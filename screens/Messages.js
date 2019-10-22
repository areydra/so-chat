import _ from 'lodash';
import firebase from 'firebase';
import React, {Component} from 'react';
import geolocation from '@react-native-community/geolocation';
import {SafeAreaView, StyleSheet, FlatList, AppState} from 'react-native';

import Card from '../components/Card';
import Search from '../components/Search';

class Messages extends Component {
  state = {
    users: [],
    filtered: [],
    messages: [],
    messagesUser: [],
    updateCurrentLocation: [],
    appState: AppState.currentState,
  };

  componentDidMount = async () => {
    const user = firebase.auth().currentUser;
    await this.getGeolocation(user);
    await this.getMessages(user);
    AppState.addEventListener('change', this._handleAppStateChange);
  };

  getGeolocation = user => {
    firebase
      .database()
      .ref('users/' + user.uid)
      .once('value', val => {
        if (val.val()) {
          let users = val.val()[Object.keys(val.val())];
          geolocation.getCurrentPosition(position => {
            let location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            firebase
              .database()
              .ref('users/' + users.uid + '/' + Object.keys(val.val()))
              .update({location: location, status: 'online'});
          });
        }
      });
  };

  getMessages = user => {
    firebase
      .database()
      .ref('messages/' + user.uid)
      .on('value', message => {
        if (message.val())
          Object.keys(message.val()).map(key => {
            firebase
              .database()
              .ref('users/' + key)
              .on('value', person => {
                if (person.val())
                  this.getMessage(user, person.val(), message.val());
              });
          });
      });
  };

  getMessage = (user, person, messages) => {
    let message = messages[person.user.uid];
    let lastMessage = Object.keys(message).length - 1;
    let uniqMessage = message[Object.keys(message)[lastMessage]];

    this.setState(prevState => {
      if (uniqMessage.from === user.uid) {
        let messagesUser = [
          ...prevState.messagesUser,
          {
            uid: person.user.uid,
            name: person.user.name,
            photo: person.user.photo,
            message: uniqMessage,
          },
        ];
        return {
          messagesUser,
        };
      }
    });
  };

  _handleAppStateChange = nextAppState => {
    let user = firebase.auth().currentUser;

    if (user.uid) {
      if (
        this.state.appState.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        firebase
          .database()
          .ref('users/' + user.uid)
          .once('value', val => {
            let users = val.val()[Object.keys(val.val())];

            geolocation.getCurrentPosition(position => {
              let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };

              firebase
                .database()
                .ref('users/' + users.uid + '/' + Object.keys(val.val()))
                .update({location: location, status: 'online'});
            });
          });
      } else {
        firebase
          .database()
          .ref('users/' + user.uid)
          .once('value', val => {
            let users = val.val()[Object.keys(val.val())];
            geolocation.getCurrentPosition(position => {
              let location = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                }

              firebase
                .database()
                .ref('users/' + users.uid + '/' + Object.keys(val.val()))
                .update({
                  location: location,
                  status: firebase.database.ServerValue.TIMESTAMP,
                });
              })
          });
      }
    }

    this.setState({appState: nextAppState});
  };

  handleSearch = async searched => {
    let filtered = _.filter(this.state.messagesUser, obj =>
      _.startsWith(obj.name, searched),
    );
    await this.setState({filtered});
  };

  renderMessageUsers = data => {
    return <Card screen="chat" item={data.item} screen="messages" />;
  };

  render() {
    let newestMessage = this.state.filtered.length
      ? _.orderBy(this.state.filtered, e => e.message.time, ['desc'])
      : _.orderBy(this.state.messagesUser, e => e.message.time, ['desc']);
    let uniqMessage = _.uniqBy(newestMessage, 'uid');

    return (
      <SafeAreaView style={styles.container}>
        <Search onSearch={this.handleSearch} />
        {this.state.messagesUser ? (
          <FlatList
            keyExtractor={data => data.name}
            data={uniqMessage}
            renderItem={this.renderMessageUsers}
          />
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Messages;
