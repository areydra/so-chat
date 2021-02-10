import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, PermissionsAndroid, Alert} from 'react-native';

import styles from './styles';

const TEXT = {
    brand: 'So Chat',
};

const SplashScreen = ({setIsLoading}) => {
    const [permission, setPermission] = useState(null);

    useEffect(() => {
        checkPermission();
        return checkPermission();
    }, [])

    useEffect(() => {
        if(permission !== PermissionsAndroid.RESULTS.GRANTED) {
            return;
        }

        setIsLoading(false);
    }, [permission])

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

export default SplashScreen;