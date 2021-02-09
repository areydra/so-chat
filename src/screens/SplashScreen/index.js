import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';

import styles from './styles';

const TEXT = {
    brand: 'So Chat',
};

const SplashScreen = () => (
    <SafeAreaView style={styles.container}>
        <Text style={styles.brand}>{TEXT.brand}</Text>
        <View style={styles.line} />
    </SafeAreaView>
);

export default SplashScreen;