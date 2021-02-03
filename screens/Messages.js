import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, FlatList} from 'react-native';
import moment from 'moment';
import toArray from 'lodash/toArray';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Search from '../components/Search';
import MessageCard from '../components/MessageCard';

const Messages = ({navigation}) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState(null);
  const [allFriends, setAllFriends] = useState(null);

  useEffect(() => {
    getAllFriends();

    return getAllFriends();
  }, [])

  useEffect(() => {
    getMessages();

    return getMessages();
  }, [allFriends])

  const getAllFriends = () => {
    const currentUserUid = auth().currentUser?.uid;

    if (!currentUserUid) {
      return;
    }

    database().ref('users').on('value', users => {
      let allFriends = toArray(users.val()).filter(user => user.uid !== currentUserUid);
      setAllFriends(allFriends);
    });
  }

  const getMessages = () => {
    const currentUserUid = auth().currentUser?.uid;

    if (!currentUserUid) {
      return;
    }

    if (!allFriends) {
      return;
    }

    database().ref(`messages/${currentUserUid}`).on('value', snapshot => {
      const friendsUid = Object.keys(snapshot.val());
      let messages = [];

      friendsUid.map(friendUid => {
        let message = toArray(snapshot.val()[friendUid]);
        let friend = allFriends.find(friend => friend.uid === friendUid);
        let lastIndexOfMessage = message.length - 1;

        messages.push({
          uid: friend.uid,
          name: friend.name,
          status: friend.status,
          photo: friend.photo,
          ...message[lastIndexOfMessage],
        })
      });

      setMessages(messages);
    })
  }

  const filterMessages = (query) => {
    if (!query) {
      return setFilteredMessages(null);
    }

    const filteredMessages = messages.filter(message => (message.name).toLowerCase().includes(query.toLowerCase()));
    setFilteredMessages(filteredMessages);
  }

  const convertTime = (time) => {
    let currentTime = new Date();
    let messageTime = new Date(time);
    let messageTimeByHours = messageTime.getHours();
    let messageTimeByMinutes = messageTime.getMinutes();
    let isToday = currentTime.getDay() === messageTime.getDay();

    if (messageTimeByHours < 10) {
        messageTimeByHours = `0${messageTimeByHours}`;
    }

    if (messageTimeByMinutes < 10) {
        messageTimeByMinutes = `0${messageTimeByMinutes}`;
    }

    if (!isToday) {
        return `${moment(time).format('dddd')} ${messageTimeByHours}:${messageTimeByMinutes}`;
    }

    return `${messageTimeByHours}:${messageTimeByMinutes}`;
  };

  const textOverflowEllipsis = (text, limit) => {
    if (text.length > limit) {
        return `${text.substr(0, limit)}...`;
    }

    return text;
  }

  const getPhoto = (photo) => {
    if (photo) {
        return {uri: photo};
    }

    return require('../assets/icons/icon_avatar.png');
  }

  const navigateToChatScreen = (item) => {
    navigation.navigate('Chat', {item});
  }

  return (
    <SafeAreaView style={styles.container}>
      <Search onSearch={filterMessages}/>
      <FlatList
        keyExtractor={(_, index) => toString(index)}
        data={filteredMessages ?? messages}
        renderItem={({item}) => (
          <MessageCard
            item={item} 
            name={textOverflowEllipsis(item.name)}
            photo={getPhoto(item.photo)}
            time={convertTime(item.time)}
            message={textOverflowEllipsis(item.message)}
            shouldShowIcon={auth().currentUser?.uid === item.from}
            navigateToChatScreen={() => navigateToChatScreen(item)}/>
        )}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Messages;
