import moment from 'moment'
import React, { Component } from 'react';
import { SafeAreaView, FlatList, Image, TouchableOpacity, StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const { width } = Dimensions.get('window')

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = { 
            text : '',
            myUid : '',
            friendStatus: null,
            messages : [],
            initializing: true,
        };

        this.currentUser = auth().currentUser;
    }

    componentDidMount = () => {
        this.getMessage();
        this.getStatus();
    }

    componentWillUnmount = () => {
        this.getMessage();
        this.getStatus();
    }

    getMessage = () => {
        const currentUserUid = this.currentUser?.uid;
        const friendUid = this.props.route.params?.item?.uid;
        const canGetMessage = currentUserUid && friendUid;

        if (!canGetMessage) {
            return;
        }

        database().ref('messages/').child(currentUserUid).child(friendUid).on('child_added', newMessage => {
            let messages = [...this.state.messages.reverse(), newMessage.val()].reverse();
            this.setState({messages});
        })
    }

    handleSendMessage = () => {
        const friendUid = this.props.route.params?.item?.uid;
        const currentUserUid = this.currentUser?.uid;
        const canUpdateMessage = this.state.text.length && currentUserUid && friendUid;

        if (!canUpdateMessage) {
            return;
        }

        let messages = {};
        let currentMessage = database().ref('messages').child(currentUserUid).child(friendUid).push();
        let payloadMessage = {
            message: this.state.text,
            time: database.ServerValue.TIMESTAMP,
            from: currentUserUid
        };

        messages[`messages/${currentUserUid}/${friendUid}/${currentMessage.key}`] = payloadMessage;
        messages[`messages/${friendUid}/${currentUserUid}/${currentMessage.key}`] = payloadMessage;

        this.setState({ text: '' });
        database().ref().update(messages);
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

        database().ref(`users/${friendUid}`).on('value', user => {
            if (this.state.friendStatus === user.val().status) {
                return;
            }

            this.setState({friendStatus: user.val().status});
        });
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

    renderMessage = (data) => {
        const {message, time, from} = data.item;
        const isMessageFromFriend = from !== this.currentUser?.uid;

        if (isMessageFromFriend) {
            return (
                <View style={styles.messageFriendContainer}>
                    <Text style={styles.messageFriend}>{message}</Text>
                    <Text style={styles.messageFriendTime}>{this.convertTime(time)}</Text>
                </View>
            );
        }

        return (
            <View style={styles.messageUserContainer}>
                <Text style={styles.messageUser}>{message}</Text>
                <Text style={styles.messageUserTime}>{this.convertTime(time)}</Text>
            </View>
        );
    }

    render() { 
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image 
                            source={require('../assets/icons/arrow_back.png')} 
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
                    <FlatList
                        keyExtractor={data => data.time.toString()}
                        data={this.state.messages}
                        renderItem={this.renderMessage}
                        contentContainerStyle={styles.messageLists}
                        showsVerticalScrollIndicator={false}
                        inverted
                    />
                </View>
                <View style={styles.textInputContainer}>
                    <TextInput 
                        placeholder='Tell me. U love me' 
                        style={styles.textInput} 
                        onChangeText={text => this.setState({text})} 
                        value={this.state.text} 
                        returnKeyType='send' 
                        onSubmitEditing={this.handleSendMessage}/>
                    <TouchableOpacity 
                        onPress={this.handleSendMessage} 
                        style={styles.send}>
                        <Image source={require('../assets/icons/send.png')} />
                    </TouchableOpacity>
                </View>                 
            </SafeAreaView>                 
        );
    }
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        height: width / 5.5,
        backgroundColor: '#2FAEB2',
        alignItems: 'center',
    },
    arrowBack: {
        height: 20,
        width: 20,
        marginLeft: 10,
    },
    containerImage: {
        width: 55,
        height: 55,
        borderRadius: 55,
        marginHorizontal: 15,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    image: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover'
    },
    headerNameContainer: {
        marginLeft: 5,
        width: '55%'
    },
    headerName: {
        fontSize: 20,
    },
    more: {
        marginLeft: 10,
        width: 25,
        height: 25
    },
    messageContainer: {
        flex: 1,
        marginHorizontal: 10
    },
    messageLists: {
        flexGrow: 1
    },
    messageUserContainer: {
        backgroundColor: '#E5E5E5', 
        paddingVertical: 5, 
        paddingHorizontal: 40, 
        marginVertical: 5,
        color: 'black',
        alignSelf: 'flex-end',
        borderRadius: 25
    },
    messageUser: {
        marginLeft: -25
    },
    messageUserTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right'
    },
    messageFriendContainer: {
        backgroundColor: '#2FAEB2',
        paddingVertical: 5,
        paddingHorizontal: 40,
        marginVertical: 5,
        color: 'white',
        alignSelf: 'flex-start',
        borderRadius: 25
    },
    messageFriend: {
        color: 'white', 
        marginLeft: -25
    },
    messageFriendTime: {
        fontSize: 10, 
        marginTop: -3, 
        marginRight: -25, 
        textAlign: 'right', 
        color: 'white' 
    },
    textInputContainer: {
        borderWidth: 1,
        borderRadius: 25,
        borderColor: '#E3E3E3',
        color: '#E3E3E3',
        marginBottom: 10,
        marginHorizontal: width / 20,
        position: 'relative'
    },
    textInput: {
        paddingLeft: 20,
        width: '85%'
    },
    send: {
        position: 'absolute',
        marginTop: 5,
        alignSelf: 'flex-end',
        right: 10
    }
});

export default Chat;
