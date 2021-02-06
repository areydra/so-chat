import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, View, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {Thumbnail} from 'native-base';
import MapView, {Marker} from 'react-native-maps';
import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import toArray from 'lodash/toArray';

const { width } = Dimensions.get('window')

const Map = (props) => {
    const [users, setUsers] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        setCurrentUser(auth().currentUser);
    }, [])

    useEffect(() => {
        getUsers();

        return getUsers();
    }, [currentUser])

    const getUsers = () => {
        if (props.route.params?.show !== 'all') {
            return setUsers([props.route.params?.person]);
        }

        // database().ref('users').on('value', users => {
        //     let filteredUsers = toArray(users.val()).filter(user => user.location);
        //     setUsers(filteredUsers);
        // });
    }

    const getAvatar = person => {
        const userAvatar = {uri: person.photo};
        const defaultAvatar = require('../assets/icons/icon_thumbnail.png');

        return person.photo ? userAvatar : defaultAvatar;
    }

    const getRegion = () => {
        const isShowAll = props.route.params?.show === 'all';

        if (!isShowAll) {
            return {
                latitude: props.route.params?.person?.location?.latitude,
                longitude: props.route.params?.person?.location?.longitude,
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
        const isShowAll = props.route.params?.show === 'all';

        if (!isShowAll) {
            return props.route.params?.person?.name + ' Location';
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
        let borderColor = 'grey';

        if (currentUser?.uid === user.uid) {
            borderColor = '#2FAEB2';
        }

        if (user.status === 'online') {
            '#00ff2f';
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
        <View style={Styles.locationContainer}>
            <MapView 
                style={Styles.locationContainer}
                zoomControlEnabled={true}
                showsUserLocation={true}
                followUserLocation={true}
                region={getRegion()}>
                    {users?.map((data, index) => (
                        <MarkerUsers
                            key={index}
                            user={data}/>
                    ))}
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
        <SafeAreaView style={Styles.container}>
            <View style={Styles.titleContainer}>
                <TouchableOpacity onPress={backToPrevScene}>
                    <Image 
                        source={require('../assets/icons/arrow_back_black.png')} 
                        style={Styles.arrowBack}/>
                </TouchableOpacity>
                <Text style={Styles.title}>{getTitleNavbar()}</Text>
            </View>
            <MapViewUsers/>
        </SafeAreaView>
    );
}

const Styles = StyleSheet.create({
    container: {
        flex: 1
    },
    arrowBack: {
        height: 20,
        width: 20,
        marginLeft: 10,
        alignSelf: 'flex-start'
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        height: width / 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    },
    title: {
        flex: 1,
        marginLeft: -20,
        textAlign: 'center'
    },
    locationContainer: {
        flex: 1,
    }
});

export default Map;
