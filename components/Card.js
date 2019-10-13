import _ from 'lodash'
import moment from 'moment'
import firebase from 'firebase'
import { withNavigation } from 'react-navigation'
import React, { useEffect, useState } from 'react';
import { Image, TouchableOpacity, StyleSheet, Modal, View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

const Card = props => {
    const [visible, setVisible] = useState(false)
    const [lastMessage, setLastMessage] = useState([])

    const { item, screen } = props
    const user = firebase.auth().currentUser

    useEffect(() => {
        getLastMessage()
    }, [])

    const getLastMessage = async() => {
        let person = item

        await firebase.database().ref('messages/' + user.uid).on('value', message => {      
            if(message.val()){
                let messages = message.val()[person.uid]
                if(messages){
                    let lastMessage = Object.keys(messages).length - 1
                    let uniqMessage = messages[Object.keys(messages)[lastMessage]]

                    setLastMessage(uniqMessage)
                }
            }
        })
    }

    const convertTime = time => {
        let record = new Date(time);
        let current = new Date();
        let result = (record.getHours() < 10 ? '0' : '') + record.getHours() + ':';
        result += (record.getMinutes() < 10 ? '0' : '') + record.getMinutes();
        if (current.getDay() !== record.getDay()) {
            result = moment(time).format('dddd') + '  ' + result
        }
        return result;
    };

    const closeModal = () => {
        setVisible(!visible)
    }

    if(item && screen === 'friends'){
        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => setVisible(true)}>
                    <View style={styles.cardImageContainer}>
                        <Image source={{ uri: (item.photo) ? item.photo : 'https://imgur.com/CJfr5uM.png' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                    </View>
                </TouchableOpacity>
                <View style={styles.cardTextContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {item:item})}>
                        <Text style={styles.cardTextName}>{(item.name.length > 25) ? item.name.substr(0, 25) + '...' : item.name}</Text>
                    </TouchableOpacity>
                    <View style={styles.cardStatusOrMessage}>
                        <Text>{item.myStatus}</Text>
                    </View>
                </View>
                <View style={styles.cardIconLocationContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Map', {show: 'friend', friend: item})}>
                        <Image source={require('../assets/icons/location.png')} style={styles.cardIconLocation} />
                    </TouchableOpacity>
                </View>

                {/* Modal */}
                <Modal visible={visible} animationType='fade' transparent>
                    <View style={ styles.modalContainer }>
                        <View style={ styles.modalChildContainer }>
                            <View style={ styles.modalImageContainer }>
                                <Image source={{ uri: (item.photo) ? item.photo : 'https://imgur.com/CJfr5uM.png' }} style={ styles.modalImage } />
                            </View>
                            <TouchableOpacity onPress={closeModal} style={ styles.modalIconContainer }>
                                <Image source={require('../assets/icons/cancel.png')} style={ styles.modalIcon } />
                            </TouchableOpacity>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={{ fontSize: 18 }}>{item.name}</Text>
                                <Text style={{ fontSize: 10 }}>{item.myStatus}</Text>
                            </View>
                            <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ marginBottom: 10 }}>Email : {item.email}</Text>
                                <Text style={{ marginBottom: 10 }}>{ (item.phone) ? 'Phone Number : ' + item.phone : null}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }else{
        return (
            <View style={styles.card}>
                <View style={styles.cardImageContainer}>
                    <Image source={{ uri: (item.photo) ? item.photo : 'https://imgur.com/CJfr5uM.png' }} style={ styles.cardImage } />
                </View>
                <View style={styles.cardTextContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {item:item})}>
                        <Text style={styles.cardTextName}>{(item.name.length > 20) ? item.name.substr(0, 20) + '...' : item.name}</Text>
                    </TouchableOpacity>
                    <View style={styles.cardStatusOrMessage}>
                        {
                            (lastMessage.message) ? 
                                <View style={{ flexDirection: 'row' }}>
                                    <Text>{ (lastMessage.message.length > 20) ? lastMessage.message.substr(0, 20) + '...' : lastMessage.message } </Text>
                                    {
                                        (lastMessage.from === user.uid) ?
                                            <Image source={require('../assets/icons/read.png')} style={styles.cardStatus} />
                                        : null
                                    }
                                </View>
                            : null
                        }
                        <Text style={{ textAlign: 'right' }}>{convertTime(item.message.time)}</Text>
                    </View>
                </View>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1, 
        justifyContent: 'center'
    },
    modalChildContainer: {
        alignSelf: 'center', 
        height: 250, 
        width: 250, 
        backgroundColor: 'white', 
        borderRadius: 20, 
        position: 'relative', 
        elevation: 3
    },
    modalImageContainer: {
        alignItems: 'center', 
        margin: 10
    },
    modalImage: {
        width: 100, 
        height: 100, 
        borderRadius: 100   
    },
    modalIconContainer: {
        right: 10, 
        top: 10, 
        position: 'absolute', 
        zIndex: 1
    },
    modalIcon: {
        height: 20, 
        width: 20
    },

    card: {
        height: 80,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width / 30,
        marginBottom: width/30
    },
    cardImageContainer: {
        height: 65,
        width: 65,
        backgroundColor: 'white',
        borderRadius: 65,
        overflow: 'hidden'
    },
    cardImage: {
        width: '100%', 
        height: '100%', 
        resizeMode: 'cover'
    },
    cardTextContainer: {
        marginLeft: 15,
        flex: 1
    },
    cardTextName: {
        fontSize: 18,
        marginBottom: 5,
    },
    cardStatusOrMessage: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardStatus:{
        height: 15,
        width: 15,
        marginLeft: 10
    },
    cardIconLocation: {
        height: 25,
        width: 25,
        marginLeft: 38
    },
    cardIconLocationContainer:{
        width: 30,
        alignItems: 'flex-end'
    }
});

export default withNavigation(Card);
