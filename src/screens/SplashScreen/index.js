import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, PermissionsAndroid, Alert} from 'react-native';
import {connect} from 'react-redux';
import FirebaseAuth from '@react-native-firebase/auth';

import styles from './styles';
import {fetchCurrentUser} from '../../../redux/currentUser/currentUserActions';
import {setIsSignedIn} from '../../../redux/authentication/authenticationActions';

const TEXT = {
    brand: 'So Chat',
};

const authDisplayName = FirebaseAuth().currentUser?.displayName;

const SplashScreen = ({setIsLoading, currentUser, ... props}) => {
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        checkPermission();
        return checkPermission();
    }, [])

    useEffect(() => {
        if(permission !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
        }

        getAccountInformation();
    }, [permission])

    useEffect(() => {
        if (!currentUser.uid) {
            return;
        }

        setIsLoading(false);
        props.setIsSignedIn(true);
    }, [currentUser])

    const checkPermission = () => {
        PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(locationPermission => {
            if(locationPermission){
                setPermission(PermissionsAndroid.RESULTS.GRANTED);
            }else{
                requestLocationPermission();
            } 
        })
    }

    const requestLocationPermission = () => {
        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(permission => {
                if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                    showAlertPermissionNotGranted();
                }

                setPermission(permission);
            })
            .catch(err => console.warn(err));
    };

    const getAccountInformation = () => {
        if (!authDisplayName) {
            setIsLoading(false);
            return;
        }

        props.fetchCurrentUser();
    }

    const showAlertPermissionNotGranted = () => {
        Alert.alert(
            'Failed',
            'You must be granted location permission',
            [
                {
                    style: 'destructive', 
                    onPress: () => checkPermission() 
                },
            ],
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.brand}>{TEXT.brand}</Text>
            <View style={styles.line} />
        </SafeAreaView>
    );
};

const mapStateToProps = ({currentUser}) => ({
    currentUser,
});

const mapDispatchToProps = {
    fetchCurrentUser,
    setIsSignedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);