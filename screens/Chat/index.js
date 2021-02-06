import React, { Component } from 'react';
import {
    SafeAreaView,
    FlatList,
    Image,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import moment from 'moment';
import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import toArray from 'lodash/toArray';
import orderBy from 'lodash/orderBy';

import ChatCard from './components/ChatCard';
import TextInputChat from './components/TextInputChat';

import styles from './styles';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            myUid : '',
            friendStatus: null,
            messages : [],
            initializing: true,
            lastMessageKey: null,
        };

        this.currentUser = auth().currentUser;
    }

    componentDidMount = () => {
        this.getStatus();
        this.getMessage();
        this.getNewMessageListener();
    }

    UNSAFE_componentWillMount = () => {
        this.getStatus();
        this.getMessage();
        this.getNewMessageListener();
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        if (this.state.messages.length === nextState.messages.length) {
            return false;
        }

        return true;
    }

    getMessage = () => {
        const currentUserUid = this.currentUser?.uid;
        const friendUid = this.props.route.params?.item?.uid;
        const canGetMessage = currentUserUid && friendUid;

        if (!canGetMessage) {
            return;
        }
        
        // database().ref('messages/').child(currentUserUid).child(friendUid).once('value', messages => {
        //     const lastMessageKey = Object.keys(messages.val())[0];
        //     messages = orderBy(toArray(messages.val()), 'time', 'desc');

        //     this.setState({messages, lastMessageKey});
        // });
    }

    getNewMessageListener = () => {
        const currentUserUid = this.currentUser?.uid;
        const friendUid = this.props.route.params?.item?.uid;

        // database().ref('messages/').child(currentUserUid).child(friendUid).limitToLast(1).on('child_added', newMessage => {
        //     if (!this.state.lastMessageKey) {
        //         return;
        //     }

        //     if (this.state.lastMessageKey === newMessage.key) {
        //         return;
        //     }

        //     const messages = [newMessage.val(), ...this.state.messages];
        //     this.setState({messages, lastMessageKey: newMessage.key});
        // });
    }

    handleSendMessage = (message) => {
        const friendUid = this.props.route.params?.item?.uid;
        const currentUserUid = this.currentUser?.uid;
        const canUpdateMessage = message.length && currentUserUid && friendUid;

        if (!canUpdateMessage) {
            return;
        }

        let payloadMessage = {
            message,
            time: database.ServerValue.TIMESTAMP,
            from: currentUserUid,
        };

        // database().ref('messages').child(currentUserUid).child(friendUid).push(payloadMessage);
        // database().ref('messages').child(friendUid).child(currentUserUid).push(payloadMessage);
    }

    convertTime = time => {
        let record = new Date(time);
        let current = new Date();
        let result = (record.getHours() < 10 ? '0' : '') + record.getHours() + ':';
        result += (record.getMinutes() < 10 ? '0' : '') + record.getMinutes();
    
        if (current.getDay() !== record.getDay()) {
            result = moment(time).format('ddd') + '  ' + result
        }
    
        return result;
    };

    getStatus = () => {
        const friendUid = this.props.route.params?.item?.uid;

        if (!friendUid) {
            return;
        }

        // database().ref(`users/${friendUid}`).on('value', user => {
        //     if (this.state.friendStatus === user.val().status) {
        //         return;
        //     }

        //     this.setState({friendStatus: user.val().status});
        // });
    }

    getFriendPhotoProfile = () => {
        const friendPhotoProfile = this.props.route.params?.item?.photo;

        if (!friendPhotoProfile) {
            return {uri: 'https://imgur.com/CJfr5uM.png'};
        }

        return {uri: friendPhotoProfile};
    }

    getFriendName = () => {
        const friendName = this.props.route.params?.item?.name;

        if (friendName.length > 25){
            return friendName.substr(0, 25) + '...';
        }

        return friendName;
    }

    getFriendStatus = () => {
        if (!this.state.friendStatus) {
            return '';
        }

        if (this.state.friendStatus === 'online') {
            return 'Online'
        } 

        return moment(this.state.friendStatus).calendar();
    }

    render() { 
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image 
                            source={require('../../assets/icons/arrow_back.png')} 
                            style={styles.arrowBack}/>
                    </TouchableOpacity>
                    <View style={styles.containerImage}>
                    <Image 
                        source={this.getFriendPhotoProfile()} 
                        style={styles.image}/>
                    </View>
                    <View style={styles.headerNameContainer}>
                        <Text style={styles.headerName}>{this.getFriendName()}</Text>
                        <Text>{this.getFriendStatus()}</Text>
                    </View>
                </View>
                <View style={styles.messageContainer}>
                    {this.state.messages?.length ? (
                        <FlatList
                            keyExtractor={(_, index) => index.toString()}
                            data={this.state.messages}
                            initialNumToRender={this.state.messages.length}
                            renderItem={({item, index}) => (
                                <ChatCard
                                    index={index}
                                    message={item.message}
                                    time={this.convertTime(item.time)}
                                    isMessageFromFriend={item.from !== this.currentUser?.uid}
                                />
                            )}
                            contentContainerStyle={styles.messageLists}
                            showsVerticalScrollIndicator={false}
                            inverted
                        />
                    ) : null}
                </View>
                <TextInputChat handleSendMessage={this.handleSendMessage}/>
            </SafeAreaView>                 
        );
    }
}

export default Chat;
