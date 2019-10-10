import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native';
import firebase from 'firebase'

const { width } = Dimensions.get('window')

const Splash = props => {
    useEffect(() => {
        setTimeout(() => {
            firebase.auth().onAuthStateChanged(user => {
                props.navigation.navigate(user ? 'Swipe' : 'AuthStack')
            })
        }, 1000)
    },[])
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