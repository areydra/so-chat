import React, {useEffect, useState} from 'react';
import {SafeAreaView, FlatList} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import FirebaseFirestore from '@react-native-firebase/firestore';

import Card from './components/Card';
import Search from '../../components/Search';

import styles from './styles';
import Icon from '../../assets/icons';

const MessagesScreen = ({navigation, currentUser}) => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState(null);

  useEffect(() => {
    getRealtimeRoomChats();

    return getRealtimeRoomChats();
  }, [])

  const getRealtimeRoomChats = () => {
    if (!currentUser?.uid) {
      return;
    }

    FirebaseFirestore().collection('chatRooms').doc(currentUser.uid).collection('chatLists').orderBy('lastMessage.createdAt', 'desc').onSnapshot(roomChats => {
      const allRoomChats = [];

      roomChats.forEach(roomChat => {
        allRoomChats.push({id: roomChat.id, ...roomChat.data()});
      });

      setMessages(allRoomChats);
    });
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
    if (!text) {
      return;
    }

    if (text.length > limit) {
        return `${text.substr(0, limit)}...`;
    }

    return text;
  }

  const getPhoto = (photo) => {
    if (photo) {
        return {uri: photo};
    }

    return Icon.avatar;
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
          <Card
            name={textOverflowEllipsis(item.name, 25)}
            photo={getPhoto(item.photo)}
            time={convertTime(item.lastMessage.createdAt)}
            message={textOverflowEllipsis(item.lastMessage.content)}
            shouldShowIcon={currentUser?.uid === item.lastMessage.ownerId}
            navigateToChatScreen={() => navigateToChatScreen(item)}/>
        )}/>
    </SafeAreaView>
  );
}

const mapStateToProps = ({currentUser}) => ({
  currentUser,
});

export default connect(mapStateToProps)(MessagesScreen);
