import React, { useEffect, useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Keyboard, View, Text, TextInput, Dimensions, PermissionsAndroid, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
import {witContext} from '../context';

const { width } = Dimensions.get('window')

const TEXT = {
    title: 'So Chat',
    buttonLogin: 'Login',
    buttonRegister: 'Register here..',
    notHaveAccount: `You don't have account? `,
};

const Login = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (!errorMessage) {
            return;
        }
        
        setErrorMessage(null);
    }, [email, password])

    const handleLogin = () => {
        Keyboard.dismiss();
        checkPermission();
    }

    let checkPermission = async () => {
        let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

        if (!locationPermission) {
            Alert.alert(
                'Failed', //title
                'You must be granted location permission', //message or description
                //button dengan text: '', lalu style:'', onPress: ketika di pencet/klik jalankan function reset
                [{ text: 'Close', style: 'destructive' }]
            );
        } else {
            prepareLogin();
        }
    }

    const localValidation = () => {
        const isEmailValid = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g).test(email);

        if (!email && !password) {
            setErrorMessage('Email and Password cannot be null!');
            return false;
        }

        if (!email) {
            setErrorMessage('Email cannot be null!');
            return false;
        }

        if (!isEmailValid) {
            setErrorMessage('Email not valid!');
            return false;
        }

        if (!password) {
            setErrorMessage('Password cannot be null!');
            return false;
        }

        if (password.length < 8) {
            setErrorMessage('Password not valid!');
            return false;
        }

        return true;
    }

    const prepareLogin = () => {
        if (!localValidation()) {
            return;
        }

        login();
    }

    const login = () => {
        auth().signInWithEmailAndPassword(email, password).then(snapshot => {
            // database().ref(`users/${snapshot.user?.uid}`).update({status: 'online'}).then(() => {
            //     props.signIn(true);
            // });
        }).catch(err => {
            setPassword('');
            setErrorMessage(err.message);
        })
    }

    const getStylesTextInput = () => {
        if (!errorMessage) {
            return styles.input;
        }

        return styles.inputError;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brandContainer}>
                <Text style={styles.brand}>{TEXT.title}</Text>
            </View>
            <View style={styles.inpuContainer}>
                <TextInput 
                    style={getStylesTextInput()}
                    autoCapitalize='none'
                    placeholder='Email'
                    value={email}
                    onChangeText={setEmail}
                    onSubmitEditing={handleLogin}/>
                <TextInput 
                    style={getStylesTextInput()}
                    secureTextEntry={true}
                    autoCapitalize='none'
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    onSubmitEditing={handleLogin}/>
            </View>
            {errorMessage && (
                <View style={styles.containerErrorMessage}>
                    <Text style={styles.textErrorMessage}>{errorMessage}</Text>
                </View>
            )}
            <TouchableOpacity onPress={handleLogin}>
                <View style={styles.button}>
                    <Text style={styles.textButton}>{TEXT.buttonLogin}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.containerRegisterHere}>
                <Text>{TEXT.notHaveAccount}</Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
                    <Text style={styles.textRegisterHere}>{TEXT.buttonRegister}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    brandContainer: {
        justifyContent: 'center',
        alignSelf: 'center',
    },
    brand: {
        textAlign: 'center',
        fontSize: width / 6,
        color: '#2FAEB2',
        marginBottom: width / 4.5,
    },
    inpuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    input: {
        width: width / 2.4,
        borderBottomWidth: 2,
        borderBottomColor: '#2FAEB2',
    },
    inputError: {
        width: width / 2.4,
        borderBottomWidth: 2,
        borderBottomColor: 'red',
    },
    button: {
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: width/5,
        backgroundColor: '#2FAEB2',
        width: 150,
        paddingVertical: 10,
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
    },
    containerRegisterHere: {
        marginTop: width / 15,
        alignSelf: 'center',
        flexDirection: 'row',
    },
    textRegisterHere: {
        color: '#2FAEB2',
        marginLeft: 3,
    },
    containerErrorMessage: {
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: -10,
        marginHorizontal: width/20,
    },
    textErrorMessage: {
        color: 'red',
        textAlign: 'center',
    },
});

export default witContext(Login);
