import { Thumbnail } from 'native-base';
import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const { width } = Dimensions.get('window')

const Map = ({... props}) => {
    const [persons, setPersons] = useState([]);
    const [user, setUser] = useState(null);

    const { show, person } = props.navigation.state.params;

    useEffect(() => {
        setUser(auth().currentUser);
    }, [])

    useEffect(() => {
        getPersons();
    }, [user])

    const getPersons = () => {
        database().ref('users').on('child_added', person => {
            if(person.location === undefined) return;
            setPersons([...persons, person]);
        })
    }

    const allPersons = () => (
        <MapView 
            style={Styles.locationContainer} 
            zoomControlEnabled={true} 
            showsUserLocation={true} 
            followUserLocation={true}
            region={{
                latitude: -6.778489,
                longitude: 107.122118,
                latitudeDelta: 25,
                longitudeDelta: 25,
            }}>
                {persons.map((person, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: person.location.latitude,
                            longitude: person.location.longitude
                        }}
                        title={person.name}
                        identifier={person.index}
                        onCalloutPress={(user?.uid !== person.uid) ? () => props.navigation.navigate('Chat', {item: person}) : null}
                    >
                        <Thumbnail small source={getAvatar(person)} 
                            style={{ borderWidth: 2, borderColor: (myLocation.uid === person.uid) ? '#2FAEB2' : (person.status === 'online') ? '#00ff2f' : 'grey' }} 
                        />
                    </Marker>
                ))}
        </MapView>
    )

    const specificPerson = () => (
        <MapView 
            style={Styles.locationContainer} 
            zoomControlEnabled={true} 
            showsUserLocation={true} 
            followUserLocation={true}
            region={{
                latitude: person.location.latitude,
                longitude: person.location.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
        }}>
            <Marker
                coordinate={{
                    latitude: person.location.latitude,
                    longitude: person.location.longitude
                }}
                title={person.name}
                onCalloutPress={() => props.navigation.navigate('Chat', { item: person })}
            >
                <Thumbnail small source={getAvatar(person)} 
                    style={{ borderWidth: 2, borderColor: (person.status === 'online') ? '#00ff2f' : 'grey' }} 
                />
            </Marker>
        </MapView>
    )

    const getAvatar = person => {
        const userAvatar = {uri: person.photo};
        const defaultAvatar = require('../assets/icons/icon_thumbnail.png');

        return person.photo ? userAvatar : defaultAvatar;
    }

    return (
        <SafeAreaView style={Styles.container}>
            <View style={Styles.titleContainer}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}>
                    <Image source={require('../assets/icons/arrow_back_black.png')} style={Styles.arrowBack} />
                </TouchableOpacity>
                <Text style={Styles.title}>{show === 'all' ? 'All Friends Location' : person.name + ' Location'}</Text>
            </View>
            <View style={Styles.locationContainer}>
                {show === 'all' ? allPersons() : specificPerson()}
            </View>
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
