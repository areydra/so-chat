import React from 'react';
import {Image, TouchableOpacity, View, Text} from 'react-native';

import Icon from '../../../assets/icons';
import styles from '../styles';

const Card = ({photo, name, message, time, navigateToChatScreen, shouldShowIcon}) => (
    <View style={styles.cardContainer}>
        <View style={styles.cardContainerImage}>
            <Image 
                source={photo} 
                style={styles.cardImage}/>
        </View>
        <View style={styles.cardContainerContent}>
            <TouchableOpacity onPress={navigateToChatScreen}>
                <Text style={styles.cardName}>{name}</Text>
            </TouchableOpacity>
            <View style={styles.cardContainerMessage}>
                <View style={styles.cardContainerMessageText}>
                    <Text>{message}</Text>
                    {shouldShowIcon && (
                        <Image 
                            source={Icon.read} 
                            style={styles.cardIcon}/>
                    )}
                </View>
                <Text style={styles.cardTime}>{time}</Text>
            </View>
        </View>
    </View>
)

export default Card;
