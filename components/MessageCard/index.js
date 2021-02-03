import React from 'react';
import {Image, TouchableOpacity, View, Text} from 'react-native';

import styles from './styles';

const MessageCard = ({photo, name, message, time, navigateToChatScreen, shouldShowIcon}) => (
    <View style={styles.container}>
        <View style={styles.containerImage}>
            <Image 
                source={photo} 
                style={styles.image}/>
        </View>
        <View style={styles.containerContent}>
            <TouchableOpacity onPress={navigateToChatScreen}>
                <Text style={styles.name}>{name}</Text>
            </TouchableOpacity>
            <View style={styles.containerMessage}>
                <View style={styles.containerMessageText}>
                    <Text>{message}</Text>
                    {shouldShowIcon && (
                        <Image 
                            source={require('../../assets/icons/read.png')} 
                            style={styles.icon}/>
                    )}
                </View>
                <Text style={styles.time}>{time}</Text>
            </View>
        </View>
    </View>
)

export default MessageCard;
