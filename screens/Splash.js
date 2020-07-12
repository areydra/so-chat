import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, PermissionsAndroid } from 'react-native';

const { width } = Dimensions.get('window')

const Splash = ({setIsLoading, setUser}) => {
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        checkPermission()
    }, [])

    useEffect(() => {
        if(permission === null) return;
        handleAfterCheckPermission();
    }, [permission])

    const checkPermission = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(locationPermission => {
            if(locationPermission){
                setPermission(true);
            }else{
                requestLocationPermission();
            } 
        })
    }

    const requestLocationPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(permission => setPermission(permission))
            .catch(err => console.warn(err));
    };

    const handleAfterCheckPermission = () => {
        if(permission === PermissionsAndroid.RESULTS.GRANTED){
            firebase.auth().onAuthStateChanged(user => setUser(user));
        }else{
            firebase.auth().signOut();
            setUser(null);
        }

        setIsLoading(false);
    }

    return (
        <SafeAreaView style={Styles.brandContainer}>
            <Text style={Styles.brand}>So Chat</Text>
            <View style={Styles.line} />
        </SafeAreaView>
    );
};

const Styles = StyleSheet.create({
    brandContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2FAEB2'
    },
    brand: {
        fontSize: width / 4.5,
        fontWeight: 'bold',
        color: 'white'
    },
    line: {
        height: 1,
        width: width / 3.6,
        backgroundColor: 'white'
    }
});

export default Splash;