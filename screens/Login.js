import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, StyleSheet, Keyboard, View, Text, TextInput, Dimensions } from 'react-native';
import firebase from 'firebase'

const { width } = Dimensions.get('window')

const Login = props => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const handleLogin = () => {
        Keyboard.dismiss()
        firebase.auth().signInWithEmailAndPassword(email, password).then(user => {
            let updates = {}

            firebase.database().ref('users/' + user.user.uid).once('value', val => {
                let users = val.val()[Object.keys(val.val())]
                let updateStatus = {
                    user: {
                        ...users,
                        status: 'online'
                    }
                }

                updates['users/' + users.uid] = updateStatus
            })

            firebase.database().ref().update(updates)
        }).catch(err => {
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
                    }} />
                <TextInput style={input} secureTextEntry={true} placeholder='Password' 
                    value={password}
                    onChangeText={
                        text => { 
                            setPassword(text) 
                            setErrorMessage('')
                    }} />
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
                <Text>You have account? </Text>
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
