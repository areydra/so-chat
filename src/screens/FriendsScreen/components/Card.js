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
        <TouchableOpacity onPress={navigateToChatScreen}>
            <View style={styles.cardContainer}>
                <View style={styles.cardContainerAvatar}>
                    <Image
                        source={getAvatar()}
                        style={styles.cardAvatar}/>
                </View>
                <View style={styles.cardContainerContent}>
                    <Text style={styles.cardTextName}>{getName()}</Text>
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
        </TouchableOpacity>
    );
};

export default Card;
