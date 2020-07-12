import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, View, Text, Keyboard, TextInput, Dimensions, Alert, PermissionsAndroid } from 'react-native';
import firebase from 'firebase'

const { width } = Dimensions.get('window')

const Register = props => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleRegister = () => {
        Keyboard.dismiss()
        if (name.length < 4) {
            setErrorMessage('Name should be at least 4 characters')
            return false
        }
        if(password !== rePassword){
            setErrorMessage('Password and RePassword does not match')
            setRePassword('')
            return false
        }

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
            processRegister()
        }
    }
    
    const processRegister = () => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(res => {
            firebase.database().ref('users').child(res.user.uid).set({
                uid: res.user.uid,
                name: name,
                status: 'online'
            })
        }).catch((err) => {
            setErrorMessage(err.message)
        })
    }

    const input = (errorMessage.length > 0) ? styles.inputError : styles.input

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brandContainer}>
                <Text style={styles.brand}>So Chat</Text>
            </View>
            <View style={styles.inpuContainer}>
                <TextInput style={input} placeholder='Name' 
                    onChangeText={text => {
                        setName(text)
                        setErrorMessage('')
                    }} />
                <TextInput style={input} autoCapitalize='none' placeholder='Email' 
                    onChangeText={text => {
                        setEmail(text)
                        setErrorMessage('')
                    }} />
            </View>
            <View style={styles.inpuContainer}>
                <TextInput style={input} secureTextEntry={true} placeholder='Password' 
                onChangeText={text => {
                    setPassword(text)
                    setErrorMessage('')
                }} />
                <TextInput style={input} secureTextEntry={true} placeholder='Re-Password' 
                value={rePassword}
                onChangeText={text => {
                    setRePassword(text)
                    setErrorMessage('')
                }} />
            </View>
            {
                (errorMessage.length > 0) ?
                    <View style={{ alignSelf: 'center', marginTop: -30, marginBottom: 10 }}>
                        <Text style={{ color: 'red' }}>{ errorMessage }</Text>
                    </View>
                : null
            }

            <TouchableOpacity activeOpacity={0.8} onPress={ handleRegister }>
                <View style={styles.button}>
                    <Text style={styles.textButton}>Register</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.containerLogineHere}>
                <Text>You have account? </Text>
                <TouchableOpacity onPress={() => props.navigation.navigate('Login')}>
                    <Text style={styles.textLoginHere}>Login here..</Text>
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
        marginBottom: width / 5.5
    },
    inpuContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: width / 8
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
        marginTop: width / 10,
        borderRadius: 25,
    
        alignSelf: 'center',
        backgroundColor: '#2FAEB2',
        width: 150,
        paddingVertical: 10
    },
    textButton: {
        color: 'white',
        textAlign: 'center'
    },
    containerLogineHere: {
        marginTop: width / 15,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    textLoginHere: {
        color: '#2FAEB2',
        marginLeft: 3
    }
});

export default Register;
