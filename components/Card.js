import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, TouchableOpacity, StyleSheet, Button, View, Text, TextInput, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation'
import firebase from 'firebase'
import _ from 'lodash'
import moment from 'moment'

const { width } = Dimensions.get('window')

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


const Card = props => {
    const [lastMessage, setLastMessage] = useState([])

    useEffect(() => {
        getLastMessage()
    }, [])

    const getLastMessage = async() => {
        let user = firebase.auth().currentUser
        let person = props.item
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


    if(props.item && props.screen === 'friends'){
        const { item } = props
        return (
            <View style={styles.card}>
                <View style={styles.cardImageContainer}>
                    <Image source={{ uri: (item.photo) ? item.photo : 'https://imgur.com/CJfr5uM.png' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <View style={styles.cardTextContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {item:item})}>
                        <Text style={styles.cardTextName}>{item.name}</Text>
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
            </View>
        );
    }else{
        const { item } = props
        const user = firebase.auth().currentUser

        return (
            <View style={styles.card}>
                <View style={styles.cardImageContainer}>
                    <Image source={{ uri: (item.photo) ? item.photo : 'https://imgur.com/CJfr5uM.png' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                </View>
                <View style={styles.cardTextContainer}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('Chat', {item:item})}>
                        <Text style={styles.cardTextName}>{item.name}</Text>
                    </TouchableOpacity>
                    <View style={styles.cardStatusOrMessage}>
                            {
                                (lastMessage.message) ? 
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text>{ lastMessage.message } </Text>
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
