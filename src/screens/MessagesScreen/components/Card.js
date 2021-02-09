import React from 'react';
import {Image, TouchableOpacity, View, Text} from 'react-native';

import Icon from '../../../assets/icons';
import styles from '../styles';

const Card = ({photo, name, message, time, navigateToChatScreen, shouldShowIcon}) => (
    <TouchableOpacity onPress={navigateToChatScreen}>
        <View style={styles.cardContainer}>
            <View style={styles.cardContainerImage}>
                <Image 
                    source={photo} 
                    style={styles.cardImage}/>
            </View>
            <View style={styles.cardContainerContent}>
                <Text style={styles.cardName}>{name}</Text>
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
    </TouchableOpacity>
)

export default Card;
