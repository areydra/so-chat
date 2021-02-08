import React from 'react';
import {
    Image,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';

import styles from '../styles';
import Icon from '../../../assets/icons';

const Card = ({photo, name, about, location, navigateToChatScreen, navigateToMapScreen}) => {
    const getAvatar = () => {
        if (photo) {
            return {uri: photo};
        }

        return Icon.avatar;
    }

    const getName = () => {
        if (name?.length > 25) {
            return `${name?.substr(0, 25)}...`;
        }

        return name;
    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.cardContainerAvatar}>
                <Image
                    source={getAvatar()}
                    style={styles.cardAvatar}/>
            </View>
            <View style={styles.cardContainerContent}>
                <TouchableOpacity onPress={navigateToChatScreen}>
                    <Text style={styles.cardTextName}>{getName()}</Text>
                </TouchableOpacity>
                <View style={styles.cardContainerTextAbout}>
                    <Text>{about}</Text>
                </View>
            </View>
            {location && (
                <View style={styles.cardContainerIconMarker}>
                    <TouchableOpacity onPress={navigateToMapScreen}>
                        <Image
                            source={Icon.marker}
                            style={styles.cardIconMarker}/>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default Card;
