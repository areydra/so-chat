import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';
import {Thumbnail} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import FirebaseAuth from '@react-native-firebase/auth';

import styles from './styles';
import Icon from '../../assets/icons';
import Color from '../../constants/Colors';

const currentUser = FirebaseAuth().currentUser;

const MapScreen = ({route, ... props}) => {
    const getAvatar = (user) => {
        const userAvatar = {uri: user.photo};

        return user.photo ? userAvatar : Icon.avatar;
    }

    const getRegion = () => {
        const isShowAll = route.params?.show === 'all';

        if (!isShowAll) {
            return {
                latitude: route.params?.users[0]?.location?.latitude,
                longitude: route.params?.users[0]?.location?.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            };
        }

        return {
            latitude: -6.778489,
            longitude: 107.122118,
            latitudeDelta: 25,
            longitudeDelta: 25,
        };
    }

    const getTitleNavbar = () => {
        const isShowAll = route.params?.show === 'all';

        if (!isShowAll) {
            return route.params?.users[0]?.name + ' Location';
        }

        return 'All Friends Location';
    }

    const handleMarkerOnCallout = (user) => {
        if (currentUser?.uid === user.uid){
            return;
        }

        props.navigation.navigate('Chat', {item: user});
    }

    const getThumbnailStyle = (user) => {
        let borderColor = Color.grey;

        if (currentUser?.uid === user.uid) {
            borderColor = Color.main;
        }

        if (user.status === 'Online') {
            borderColor = Color.greenStabilo;
        }

        return { 
            borderColor,
            borderWidth: 2
        };
    }

    const backToPrevScene = () => {
        props.navigation.goBack();
    }
 
    const MapViewUsers = () => (
        <View style={styles.locationContainer}>
            <MapView 
                style={styles.locationContainer}
                zoomControlEnabled={true}
                showsUserLocation={true}
                followUserLocation={true}
                region={getRegion()}>
                    {route.params?.users?.map((data, index) => {
                        if (!data.location) {
                            return;
                        }

                        return (
                            <MarkerUsers
                                key={index}
                                user={data}/>
                        );
                    })}
            </MapView>
        </View>
    )

    const MarkerUsers = ({user}) => (
        <Marker
            coordinate={{
                latitude: user.location.latitude,
                longitude: user.location.longitude
            }}
            title={user.name}
            identifier={user.uid}
            onCalloutPress={() => handleMarkerOnCallout(user)}>
                <Thumbnail 
                    small 
                    source={getAvatar(user)} 
                    style={getThumbnailStyle(user)} 
                />
        </Marker>
    )

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.titleContainer}>
                <TouchableOpacity onPress={backToPrevScene}>
                    <Image 
                        source={Icon.arrowBackBlack} 
                        style={styles.arrowBack}/>
                </TouchableOpacity>
                <Text style={styles.title}>{getTitleNavbar()}</Text>
            </View>
            <MapViewUsers/>
        </SafeAreaView>
    );
}

export default MapScreen;
