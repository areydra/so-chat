import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions } from 'react-native';

const { width } = Dimensions.get('window')

const Splash = () => (
    <SafeAreaView style={Styles.brandContainer}>
        <Text style={Styles.brand}>So Chat</Text>
        <View style={Styles.line} />
    </SafeAreaView>
);

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