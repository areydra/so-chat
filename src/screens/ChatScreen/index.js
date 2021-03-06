import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    FlatList,
    View,
} from 'react-native';
import moment from 'moment';
import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';
import {connect} from 'react-redux';

import Card from './components/Card';
import InputBox from './components/InputBox';

import styles from './styles';
import Icon from '../../assets/icons';
import {sendNotification} from '../../../redux/notification/notificationActions';

const user = FirebaseAuth().currentUser;

const ChatScreen = ({route, navigation, ... props}) => {
    const [friend, setFriend] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getRealtimeMessages();
        getRealtimeFriendInformation();

        return () => {
            getRealtimeMessages();
            getRealtimeFriendInformation();
        };
    }, [])

    useEffect(() => {
        navigation.setParams({
            name: getFriendName(),
            status: getFriendStatus(),
            photo: getFriendPhotoProfile(),
        });
    }, [friend])

    const getRealtimeFriendInformation = () => {
        const friendUid = route.params?.item?.id;

        if (!friendUid) {
            return;
        }

        FirebaseFirestore().collection('users').doc(friendUid).onSnapshot(friend => {
            setFriend(friend.data());
        });
    }

    const getRealtimeMessages = () => {
        const friendUid = route.params?.item?.id;
        const canGetMessage = user?.uid && friendUid;

        if (!canGetMessage) {
            return;
        }
        
        FirebaseFirestore().collection('chats').doc(user.uid).collection(friendUid).orderBy('createdAt', 'desc').onSnapshot(messages => {
            const allMessages = [];

            messages.forEach(message => {
                allMessages.push(message.data());
            });

            setMessages(allMessages);
        });
    }

    const sendMessage = (message) => {
        const friendUid = route.params?.item?.id;
        const canUpdateMessage = message.length && user?.uid && friendUid;

        if (!canUpdateMessage) {
            return;
        }

        const FirestoreBatch = FirebaseFirestore().batch();

        const payloadMessage = {
            ownerId: user.uid,
            content: message,
            createdAt: new Date().getTime(),
        };
        const payloadCurrentUserChatRooms = {
            photo: friend?.photo,
            name: friend?.name,
            lastMessage: payloadMessage,
        };
        const payloadFriendChatRooms = {
            photo: user?.photoURL,
            name: user?.displayName,
            lastMessage: payloadMessage,
        };
        

        const currentUserChats = FirebaseFirestore().collection('chats').doc(user.uid).collection(friendUid).doc();
        const friendChats = FirebaseFirestore().collection('chats').doc(friendUid).collection(user.uid).doc();
        const currentUserChatRooms = FirebaseFirestore().collection('chatRooms').doc(user.uid).collection('chatLists').doc(friendUid);
        const friendRoomChatRooms = FirebaseFirestore().collection('chatRooms').doc(friendUid).collection('chatLists').doc(user.uid);

        FirestoreBatch.set(currentUserChats, payloadMessage);
        FirestoreBatch.set(friendChats, payloadMessage);
        FirestoreBatch.set(currentUserChatRooms, payloadCurrentUserChatRooms);
        FirestoreBatch.set(friendRoomChatRooms, payloadFriendChatRooms);

        FirestoreBatch.commit().then(() => {
            props.sendNotification(friend.tokenNotification, {
                title: user.displayName,
                body: message,
                tag: user.uid
            });
        });
    }

    const convertTime = (time, isUserStatus) => {
        let record = new Date(time);
        let current = new Date();
        let result = (record.getHours() < 10 ? '0' : '') + record.getHours() + ':';
        result += (record.getMinutes() < 10 ? '0' : '') + record.getMinutes();
    
        if (current.getDay() !== record.getDay()) {
            return moment(time).format('ddd') + '  ' + result;
        }

        if (isUserStatus) {
            return moment(time).calendar();
        }
    
        return result;
    };

    const getFriendPhotoProfile = () => {
        const defaultPhotoProfile = route.params?.item?.photo;
        const photoProfile = friend?.photo ?? defaultPhotoProfile;

        if (!photoProfile) {
            return Icon.avatar;
        }

        return {uri: photoProfile};
    }

    const getFriendName = () => {
        const defaultName = route.params?.item?.name;
        const name = friend?.name ?? defaultName;

        if (name.length > 25){
            return name.substr(0, 25) + '...';
        }

        return name;
    }

    const getFriendStatus = () => {
        let status = friend?.status ?? route.params?.item?.status;

        if (!status) {
            return;
        }

        if (status === 'Online') {
            return status;
        }

        return convertTime(status, true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.messageContainer}>
                {messages?.length ? (
                    <FlatList
                        keyExtractor={(_, index) => index.toString()}
                        data={messages}
                        initialNumToRender={messages.length}
                        renderItem={({item, index}) => (
                            <Card
                                index={index}
                                message={item.content}
                                time={convertTime(item.createdAt)}
                                isMessageFromFriend={item.ownerId !== user?.uid}
                            />
                        )}
                        contentContainerStyle={styles.messageLists}
                        showsVerticalScrollIndicator={false}
                        inverted
                    />
                ) : null}
            </View>
            <InputBox handleSendMessage={sendMessage}/>
        </SafeAreaView>                 
    );
}

const mapDispatchToProps = {
    sendNotification,
};

export default connect(null, mapDispatchToProps)(ChatScreen);
