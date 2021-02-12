import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    TouchableOpacity, 
    Keyboard, 
    View, 
    Text, 
    TextInput, 
    ActivityIndicator,
    Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {StackActions} from '@react-navigation/native';

import styles from './styles';
import Icon from '../../assets/icons';

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
        const isIndonesiaPhoneNumber = /^(^\+62|62|081|082|083|085|087|088|089)(\d{3,4}-?){2}\d{3,4}$/g;
        const isValidPhoneNumber = isIndonesiaPhoneNumber.test(phoneNumber);

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

    const signIn = async() => {
        await auth().signInWithPhoneNumber(indonesiaPhoneNumber(phoneNumber)).then(confirmation => {
            navigatePhoneNumberVerificationScreen(confirmation);
        }).catch(err => {
            setPhoneNumber(null);
            setErrorMessage(err.message);
        });

        setIsLoading(false);
    }

    const navigatePhoneNumberVerificationScreen = (confirmation) => {
        props.navigation.dispatch(
            StackActions.replace('PhoneNumberVerificationScreen', {confirmation})
        );
    }

    const indonesiaPhoneNumber = (phoneNumber) => {
        if (phoneNumber.startsWith('08')) {
            return phoneNumber.replace('0', '+62');
        }

        if (phoneNumber.startsWith('62')) {
            return `+${phoneNumber}`;
        }

        return phoneNumber;
    }

    const getStylesTextInput = () => {
        if (errorMessage) {
            return [styles.containerInput, styles.containerInputError];
        }

        return styles.containerInput;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{TEXT.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={getStylesTextInput()}>
                    <Image
                        source={Icon.indonesiaFlag}
                        style={styles.icon}
                    />
                    <TextInput 
                        style={styles.input}
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

export default LoginScreen;
