import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, FlatList, AppState } from 'react-native';
import firebase from 'firebase'
import _ from 'lodash'
import geolocation from '@react-native-community/geolocation'

import Search from '../components/Search'
import Card from '../components/Card'

class Messages extends Component {
  state = { 
    messages : [],
    users : [],
    messagesUser : [],
    updateCurrentLocation: [],
    filtered: [],
    statusFilter: false,
    appState: AppState.currentState
   }

   componentDidMount = async() => {
     let user = firebase.auth().currentUser

     AppState.addEventListener('change', this._handleAppStateChange)
     await firebase.database().ref('messages/' + user.uid).on('value', message => {      
       
        if(message.val()){
          let messages = message.val()
          Object.keys(message.val()).map(key => {
            firebase.database().ref('users/'+key).on('value', user => {
              if(user.val()){           
                let key = Object.keys(user.val())
                let users = user.val()[key]
                let message = messages[users.uid]
                let lastMessage = Object.keys(message).length - 1
                let uniqMessage = message[Object.keys(message)[lastMessage]]
                
                this.setState(prevState => {
                  if (uniqMessage.form === user.uid) {
                    let messagesUser = [
                      ...prevState.messagesUser, { uid: users.uid, name: users.name, photo: users.photo, message: uniqMessage }
                    ]
                    return {
                      messagesUser
                    }
                  }
                })            

              }
            })
          })
        }
      })
     await firebase.database().ref('users/' + user.uid).once('value', val => {
       let users = val.val()[Object.keys(val.val())]
       
       geolocation.getCurrentPosition(position => {
         let location = {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude,
         };

         let updateCurrentLocation = {
           user : {
             ...users,
             location: location
           }
         }
        let updates = {}
        updates['/users/' + users.uid] = updateCurrentLocation;
        firebase.database().ref().update(updates)
       })
     })
  }

  componentWillUnmount() {
    let user = firebase.auth().currentUser
    if(user){
      AppState.removeEventListener('change', this._handleAppStateChange);
      firebase.database().ref('messages/' + user.uid).on('value', message => {})
    }
  }

  _handleAppStateChange = (nextAppState) => {
    let user = firebase.auth().currentUser

    if (user.uid) {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
          firebase.database().ref('users/' + user.uid).once('value', val => {
            let users = val.val()[Object.keys(val.val())]

            geolocation.getCurrentPosition(position => {
              let location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };

              let updateStatus = {
                user: {
                  ...users,
                  status: 'online',
                  location: location
                }
              }
              let updates = {}
              updates['users/' + users.uid] = updateStatus
              firebase.database().ref().update(updates)
            })
          })
      }else{
        firebase.database().ref('users/' + user.uid).once('value', val => {
          let users = val.val()[Object.keys(val.val())]

          geolocation.getCurrentPosition(position => {
            let location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };

            let updateStatus = {
              user: {
                ...users,
                status: firebase.database.ServerValue.TIMESTAMP,
                location: location
              }
            }
            let updates = {}
            updates['users/' + users.uid] = updateStatus
            firebase.database().ref().update(updates)
          })
        })
      }
    }

    this.setState({ appState: nextAppState });
  };

   renderMessageUsers = data => {
     return(
       <Card screen='chat' item={data.item} screen='messages' />
     )
   }

   handleSearch = async(searched) => {
     let filtered =_.filter(this.state.messagesUser, obj => {
                      return _.startsWith(obj.name, searched)
                    })
    await this.setState({ filtered, statusFilter: true })
   }

  render() { 
    let newestMessage = []
    if(this.state.statusFilter){
      newestMessage = _.orderBy(this.state.filtered, (e) => e.message.time, ['desc'])
    }else{
      newestMessage = _.orderBy(this.state.messagesUser, (e) => e.message.time, ['desc'])
    }
    let uniqMessage = _.uniqBy(newestMessage, 'uid')

    return (
      <SafeAreaView style={styles.container}>
        <Search onSearch={this.handleSearch} />
        {
          (this.state.messagesUser) ?
            <FlatList
              keyExtractor={data => data.name}
              data={uniqMessage}
              renderItem={this.renderMessageUsers}
            />
          : null
        }
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1
  }
});

export default Messages;
