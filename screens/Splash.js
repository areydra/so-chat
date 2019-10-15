import firebase from 'firebase'
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, PermissionsAndroid } from 'react-native';

const { width } = Dimensions.get('window')

const Splash = props => {
    
    useEffect(() => {
        checkPermission()
    },[])

    let checkPermission = async() => {
        let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

        if(!locationPermission) locationPermission = await requestLocationPermission()

        if(!locationPermission){
            firebase.auth().signOut()
            props.navigation.navigate('AuthStack')
        }else{
            setTimeout(() => {
                firebase.auth().onAuthStateChanged(user => {
                    props.navigation.navigate(user ? 'Swipe' : 'AuthStack')
                })
            }, 1000)
        }
    }

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            return granted === PermissionsAndroid.RESULTS.GRANTED
        } catch (err) {
            console.warn(err)
            return false
        }
    };

    return (
        <SafeAreaView style={styles.brandContainer}>
            <Text style={styles.brand}>So Chat</Text>
            <View style={styles.line} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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