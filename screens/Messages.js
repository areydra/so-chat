import _, { toArray } from 'lodash';
import React, {useEffect, useState} from 'react';
import geolocation from '@react-native-community/geolocation';
import {SafeAreaView, StyleSheet, FlatList, AppState} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Card from '../components/Card';
import Search from '../components/Search';

const Messages = () => {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [persons, setPersons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messagesUser, setMessagesUser] = useState([]);
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    AppState.addEventListener('change', _handleAppStateChange);

    return(() => {
      subscriber;
      AppState.removeEventListener('change', _handleAppStateChange);
    })
  }, [])

  useEffect(() => {
    if (!user) {
      return;
    }

    getMessages();
    setGeolocation();
  }, [user])

  useEffect(() => {
    if(toArray(messages).length) getPerson();
  }, [messages])

  useEffect(() => {
    if(persons.length) getMessage();
  }, [persons])

  useEffect(() => {
    handleFilterPersons()
  }, [query])

  const onAuthStateChanged = (user) => {    
    setUser(user);
  }

  const _handleAppStateChange = nextAppState => {
    if(!user) return;
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      setGeolocation('online');
    } else {
      setGeolocation(database.ServerValue.TIMESTAMP)
    }

    setAppState(nextAppState)
  };

  const setGeolocation = (status = 'online') => {
    geolocation.getCurrentPosition(position => {
      const location = {latitude: position.coords.latitude, longitude: position.coords.longitude};
      if(user.uid) database().ref(`users/${user.uid}`).update({location, status});      
    });    
  }

  const getMessages = () => {
    const messagesRef = database().ref(`messages/${user.uid}`);
    messagesRef.on('value', messages => {
      if(messages.val()) setMessages(messages.val());
    });
  };

  const getPerson = () => {
    const messageKeys = Object.keys(messages);
    messageKeys.map(key => {
      database().ref(`users/${key}`).on('value', person => {
        if(person.val().uid) setPersons([...persons, person.val()]);
      });
    });
  }

  const getMessage = () => {
    persons.map(person => {
      const personMessage = messages[person.uid];
      const indexOfLastMessage = Object.keys(personMessage).length - 1;
      const lastMessage = personMessage[Object.keys(personMessage)[indexOfLastMessage]];
  
      if (lastMessage.from !== user.uid) return;
  
      setMessagesUser([...messagesUser, {
        uid: person.uid,
        name: person.name,
        photo: person.photo,
        message: lastMessage,
      }]);  
    })
  }

  const handleFilterPersons = () => {
    const filtered = messagesUser.filter(person => (person.name).toLowerCase().includes(query.toLowerCase()) && person.uid !== user.uid);
    setFiltered(filtered);
  }

  const chatList = () => {
    if(!messagesUser.length) return;
    const newestMessage = _.orderBy((filtered.length || query.length) ? filtered : messagesUser, e => e.message.time, ['desc']);
    const uniqMessage = _.uniqBy(newestMessage, 'uid');

    return(
      <FlatList
        keyExtractor={data => data.name}
        data={uniqMessage}
        renderItem={data => (
          <Card screen="chat" item={data.item} screen="messages" navigation={props.navigation}/>
        )}
      />
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Search onSearch={setQuery} />
      {chatList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Messages;
