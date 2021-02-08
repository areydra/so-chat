import React from 'react';
import {View, Text} from 'react-native';

import styles from '../styles';

const Card = ({message, time, isMessageFromFriend}) => {
    const getStyles = () => {
        return {
            container: isMessageFromFriend ? styles.messageFriendContainer : styles.messageUserContainer,
            textTime: isMessageFromFriend ? styles.messageFriendTime : styles.messageUserTime,
            textMessage: isMessageFromFriend ? styles.messageFriend : styles.messageUser,
        }
    }

    return (
        <View style={getStyles().container}>
            <Text style={getStyles().textMessage}>{message}</Text>
            <Text style={getStyles().textTime}>{time}</Text>
        </View>
    );
}

export default Card;
