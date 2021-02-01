import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Keyboard, View, Text, TextInput, Dimensions, PermissionsAndroid, Alert } from 'react-native';
import auth from '@react-native-firebase/auth'

const { width } = Dimensions.get('window')

const Login = props => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleLogin = () => {
        Keyboard.dismiss()
        checkPermission()
    }

    let checkPermission = async () => {
        let locationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)

        if (!locationPermission) {
            Alert.alert(
                'Failed', //title
                'You must be granted location permission', //message or description
                //button dengan text: '', lalu style:'', onPress: ketika di pencet/klik jalankan function reset
                [{ text: 'Close', style: 'destructive' }]
            );
        } else {
            processLogin()
        }
    }

    const processLogin = () => {
        auth().signInWithEmailAndPassword(email, password).catch(err => {
            setPassword('')
            setErrorMessage(err.message)
        })
    }

    let input = (errorMessage.length > 0) ? styles.inputError : styles.input

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brandContainer}>
                <Text style={styles.brand}>So Chat</Text>
            </View>
            <View style={styles.inpuContainer}>
                <TextInput style={input} autoCapitalize='none' placeholder='Email' 
                    value={email}
                    onChangeText={text => { 
                        setEmail(text)
                        setErrorMessage('')
                    }} 
                    onSubmitEditing={() => handleLogin()}
                    />
                <TextInput style={input} secureTextEntry={true} placeholder='Password' 
                    value={password}
                    onChangeText={
                        text => { 
                            setPassword(text) 
                            setErrorMessage('')
                    }} 
                    onSubmitEditing={() => handleLogin()}
                    />
            </View>
            {
                (errorMessage.length > 0) ? 
                    <View style={{ alignSelf: 'center', marginTop: 10, marginBottom: -10, marginHorizontal: width/20 }}>
                        <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text>
                    </View>
                : null
            }
            <TouchableOpacity activeOpacity={0.8} onPress={handleLogin}>
                <View style={styles.button}>
                    <Text style={styles.textButton}>Login</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.containerRegisterHere}>
                <Text>You don't have account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Register')}>
                    <Text style={styles.textRegisterHere}>Register here..</Text>
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
        alignSelf: 'center'
    },
    brand: {
        textAlign: 'center',
        fontSize: width / 6,
        color: '#2FAEB2',
        marginBottom: width / 4.5
    },
    inpuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    input: {
        width: width / 2.4,
        borderBottomWidth: 2,
        borderBottomColor: '#2FAEB2'
    },
    inputError: {
        width: width / 2.4,
        borderBottomWidth: 2,
        borderBottomColor: 'red'
    },
    button: {
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: width/5,
        backgroundColor: '#2FAEB2',
        width: 150,
        paddingVertical: 10
    },
    textButton: {
        color: 'white',
        textAlign: 'center'
    },
    containerRegisterHere: {
        marginTop: width / 15,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    textRegisterHere: {
        color: '#2FAEB2',
        marginLeft: 3
    }
});

export default Login;
