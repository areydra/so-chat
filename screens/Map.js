import firebase from 'firebase'
import React, { Component } from 'react';
import MapView, { Marker } from 'react-native-maps'
import { SafeAreaView, StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window')

class Map extends Component {
    state = { 
        users : [],
        userSelected : [],
     }

    componentDidMount = () => {
        this.getUsers()
    }

    getUsers = () => {
        firebase.database().ref('users').on('child_added', users => {
            let key = Object.keys(users.val())
            let data = users.val()
            let dataUsers = data[key]

            if (dataUsers.location !== undefined) {
                this.setState(prevState => {
                    return {
                        users: [...prevState.users, dataUsers]
                    }
                })
            }
        })
    }

    render() { 
        let myLocation = firebase.auth().currentUser
        const { show, friend } = this.props.navigation.state.params 
        
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.titleContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Image source={require('../assets/icons/arrow_back_black.png')} style={styles.arrowBack} />
                    </TouchableOpacity>
                    <Text style={styles.title}>{(show === 'all') ? 'All Friends Location' : friend.name + ' Location'}</Text>
                </View>
                <View style={styles.locationContainer}>
                        {
                            (show === 'all') ?
                                <MapView style={styles.locationContainer} zoomControlEnabled={true} showsUserLocation={true} followUserLocation={true}
                                    region={{
                                        latitude: -6.778489,
                                        longitude: 107.122118,
                                        latitudeDelta: 25,
                                        longitudeDelta: 25,
                                    }}>
                                    {this.state.users.map((user, index) => (
                                        <Marker
                                            key={index}
                                            coordinate={{
                                                latitude: user.location.latitude,
                                                longitude: user.location.longitude
                                            }}
                                            title={user.name}
                                            identifier={user.index}
                                            pinColor={(myLocation.uid === user.uid) ? '#2D9CDB' : 'red'}
                                            onCalloutPress={(myLocation.uid !== user.uid) ? () => this.props.navigation.navigate('Chat', {item: user}) : null}
                                        />
                                     ))}
                                </MapView>
                            : 
                                <MapView style={styles.locationContainer} zoomControlEnabled={true} showsUserLocation={true} followUserLocation={true}
                                    region={{
                                        latitude: friend.location.latitude,
                                        longitude: friend.location.longitude,
                                        latitudeDelta: 0.015,
                                        longitudeDelta: 0.0121,
                                    }}>
                                    <Marker
                                        coordinate={{
                                            latitude: friend.location.latitude,
                                            longitude: friend.location.longitude
                                        }}
                                        title={friend.name}
                                        onCalloutPress={() => this.props.navigation.navigate('Chat', { item: friend })}
                                    />
                                </MapView>
                        }
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
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
