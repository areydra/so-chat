import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    TouchableOpacity, 
    Keyboard, 
    View, 
    Text, 
    TextInput, 
    ActivityIndicator 
} from 'react-native';
import auth from '@react-native-firebase/auth';

import styles from './styles';
import {witContext} from '../../../context';

const TEXT = {
    title: 'So Chat',
    buttonLogin: 'Login',
    buttonRegister: 'Register here..',
    notHaveAccount: `You don't have account? `,
};

const LoginScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!errorMessage) {
            return;
        }
        
        setErrorMessage(null);
    }, [phoneNumber])

    const prepareSignIn = () => {
        Keyboard.dismiss();
        setIsLoading(true);

        if (!localValidation()) {
            setIsLoading(false);
            return;
        }

        signIn();
    }

    const localValidation = () => {
        const isValidPhoneNumber = (/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{8})/g).test(phoneNumber);

        if (!phoneNumber) {
            setErrorMessage('Phone number cannot be null!');
            return false;
        }

        if (!isValidPhoneNumber) {
            setErrorMessage('Phone number not valid!');
            return false;
        }

        return true;
    }

    const signIn = () => {
        auth().signInWithPhoneNumber(phoneNumber).then(confirmation => {
            props.navigation.navigate('PhoneNumberVerificationScreen', {confirmation});
        }).catch(err => {
            setPhoneNumber(null);
            setErrorMessage(err.message);
        });

        setIsLoading(false);
    }

    const getStylesTextInput = () => {
        if (errorMessage) {
            return [styles.input, styles.inputError];
        }

        return styles.input;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{TEXT.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={styles.containerInput}>
                    <TextInput 
                        style={getStylesTextInput()}
                        placeholder='Your phone number'
                        value={phoneNumber}
                        keyboardType='phone-pad'
                        onChangeText={setPhoneNumber}
                        onSubmitEditing={prepareSignIn}/>
                </View>
                <TouchableOpacity onPress={prepareSignIn}>
                    <View style={styles.containerButton}>
                        {isLoading ? (
                            <ActivityIndicator
                                color='white'
                                size={30}/>
                        ) : (
                            <Text style={styles.textButton}>{TEXT.buttonLogin}</Text>
                        )}
                    </View>
                </TouchableOpacity>
            </View>
            {errorMessage && (
                <View style={styles.containerErrorMessage}>
                    <Text style={styles.textErrorMessage}>{errorMessage}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default witContext(LoginScreen);
