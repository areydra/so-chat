import React, { Component } from 'react';
import { SafeAreaView, FlatList, Image, TouchableOpacity, StyleSheet, Modal, View, Text, TextInput, Dimensions } from 'react-native';
import firebase from 'firebase'
import moment from 'moment'

const { width } = Dimensions.get('window')

class Chat extends Component {
    state = { 
        text : '',
        myUid : '',
        messages : [],
        visible : false
     }

     componentDidMount = async() => {
         let user = firebase.auth().currentUser
         const { uid } = this.props.navigation.state.params.item

         await firebase.database().ref('messages/').child(user.uid).child(uid).on('child_added', newMessage => {
             this.setState(prevState => {
                 return {
                     messages: [...prevState.messages.reverse() , newMessage.val()].reverse()
                 }
             })
         })
     }

     componentWillMount = () => {
         let user = firebase.auth().currentUser
         const { uid } = this.props.navigation.state.params.item
         firebase.database().ref('messages/').child(user.uid).child(uid).on('child_added', newMessage => {})
     }

    handleSendMessage = () => {
        if(this.state.text.length){
            let user = firebase.auth().currentUser
            const { text } = this.state
            const { uid } = this.props.navigation.state.params.item

            let messageId = firebase.database().ref('messages').child(user.uid).child(uid).push().key
            let updates = {}
    
            let message = {
                message: text,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: user.uid
            }
    
            updates['messages/' + user.uid + '/' + uid + '/' + messageId] = message
            updates['messages/' + uid + '/' + user.uid + '/' + messageId] = message
    
            firebase.database().ref().update(updates)
            this.setState({ text: '' })
        }
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

    convertTimeStatus = time => {
        return moment(time).calendar()
    };

    renderMessage = data => {
        let user = firebase.auth().currentUser
        return(
            (data.item.from !== user.uid) ?
                <View style={styles.messageFriend}>
                    <Text style={{ color: 'white', marginLeft: -25 }}>{data.item.message} </Text>
                    <Text style={{fontSize: 10, marginTop: -3, marginRight: -25, textAlign: 'right', color: 'white' }}>{this.convertTime(data.item.time)}</Text>
                </View>
            :
                <View style={styles.message}>
                    <Text style={{ marginLeft: -25 }}>{data.item.message} </Text>
                    <Text style={{ fontSize: 10, marginTop: -3, marginRight: -25, textAlign: 'right' }}>{this.convertTime(data.item.time)}</Text>
                </View>
        )
    }

     render() { 
        const { uid, name, status, photo} = this.props.navigation.state.params.item
         return (
                 <SafeAreaView style={styles.container}>
                     <View style={styles.header}>
                         <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                             <Image source={require('../assets/icons/arrow_back.png')} style={styles.arrowBack} />
                         </TouchableOpacity>
                         <View style={styles.containerImage}>
                            <Image source={{ uri: (photo) ? photo : 'https://imgur.com/CJfr5uM.png' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                         </View>
                         <View style={styles.headerNameContainer}>
                             <Text style={styles.headerName}>{name}</Text>
                             <Text>{(status === 'online') ? 'Online' : this.convertTimeStatus(status)}</Text>
                         </View>
                     </View>
                     <View style={styles.messageContainer}>
                         <FlatList
                             keyExtractor={data => data.time.toString()}
                             data={this.state.messages}
                             renderItem={this.renderMessage}
                             contentContainerStyle={styles.messageLists}
                             showsVerticalScrollIndicator={false}
                             ref="flatList"
                             inverted
                         />
                     </View>
                     <View style={styles.textInputContainer}>
                         <TextInput placeholder='Tell me. U love me' style={styles.textInput} onChangeText={text => this.setState({ text })} value={this.state.text} />
                         <TouchableOpacity onPress={this.handleSendMessage} style={styles.send}>
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
        flexGrow: 1,
        // alignItems: 'flex-end'
    },
    message: {
        backgroundColor: '#E5E5E5', 
        paddingVertical: 5, 
        paddingHorizontal: 40, 
        marginVertical: 5,
        color: 'black',
        alignSelf: 'flex-end',
        borderRadius: 25
    },
    messageFriend: {
        backgroundColor: '#2FAEB2',
        paddingVertical: 5,
        paddingHorizontal: 40,
        marginVertical: 5,
        color: 'white',
        alignSelf: 'flex-start',
        borderRadius: 25
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
