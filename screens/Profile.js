import firebase from 'firebase'
import RNFetchBlob from 'rn-fetch-blob';
import React, { Component } from 'react';
import ImagePicker from 'react-native-image-picker';
import { SafeAreaView, Image, TouchableOpacity, Alert, StyleSheet, PermissionsAndroid, View, Text, TextInput, Dimensions, ScrollView } from 'react-native';

const { width } = Dimensions.get('window')

class Profile extends Component {
    state = { 
        user : {
            uid: '',
            email: '',
            name: ''
        },
        text: '',
        error: ''
     }

    componentDidMount = async() => {
        await this.getUser()
    }

    requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            return false;
        }
    };

    changeImage = async() => {
        const Blob = RNFetchBlob.polyfill.Blob;
        const fs = RNFetchBlob.fs;
        const user = firebase.auth().currentUser

        window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
        window.Blob = Blob;

        const options = {
            title: 'Select Profile',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            mediaType: 'photo',
        };

        let cameraPermission =
            (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ) &&
            PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
        if (!cameraPermission) {
            cameraPermission = await this.requestCameraPermission();
        } else {
            ImagePicker.showImagePicker(options, response => {
                let uploadBob = null;
                const imageRef = firebase.storage().ref('images/' + user.uid)
                    fs.readFile(response.path, 'base64')
                    .then(data => {
                        return Blob.build(data, { type: `${response.mime};BASE64` });
                    })
                    .then(blob => {
                        uploadBob = blob;
                        return imageRef.put(blob, { contentType: `${response.mime}` });
                    })
                    .then(() => {
                        uploadBob.close();
                        return imageRef.getDownloadURL();
                    })
                    .then(url => {
                        firebase.database().ref('users/' + user.uid).once('value', val => {
                            if(val.val()){
                                let users = val.val()[Object.keys(val.val())]
                                let updateUser = {
                                                    user: {
                                                        ...users,
                                                        photo: url
                                                    }
                                                }
                                firebase.database().ref('users/' + user.uid).update(updateUser);
                            }
                        })
                    })
                    .catch(err => console.log(err));
            });
        }
    };

    getUser = () => {
        let user = firebase.auth().currentUser
        if (user) 
            firebase.database().ref('users/' + user.uid).on('value', res => {
                if(res.val()){
                    let key = Object.keys(res.val())
                    let data = res.val()
                    let dataUser = {
                        ...data[key],
                        email: user.email,
                    }
                    this.setState({ user: dataUser })
                }
            })
    }

    handleSignOut = () => {
        let user = firebase.auth().currentUser
        firebase.auth().signOut().then(() => {
            let updates = {}

            // Change status to offline
            firebase.database().ref('users/' + user.uid).once('value', val => {
                if(val.val()){
                    let users = val.val()[Object.keys(val.val())]
                    let updateStatus = {
                        user: {
                            ...users,
                            status: firebase.database.ServerValue.TIMESTAMP
                        }
                    }
                    updates['users/' + users.uid] = updateStatus
                    firebase.database().ref().update(updates)
                }
            })

            this.props.navigation.navigate('AuthStack')
        })
    }

    updateData = update => {
        let user = firebase.auth().currentUser
        if (user) 
            firebase.database().ref('users/' + user.uid).once('value').then(res => {
                if(res.val()){
                    let newData = {}
                    let key = Object.keys(res.val())
                    let data = res.val()
                    if (update === 'name') {
                        if (this.state.text.length > 4) {
                            newData = {
                                user: {
                                    ...data[key],
                                    name: this.state.text
                                }
                            }
                        }
                    } else if (update === 'myStatus') {
                        newData = {
                            user: {
                                ...data[key],
                                myStatus: this.state.text
                            }
                        }
                    } else if (update === 'phone') {
                        newData = {
                            user: {
                                ...data[key],
                                phone: this.state.text
                            }
                        }
                    }
                    firebase.database().ref('users/' + this.state.user.uid).update(newData)
                    this.setState({ text: '' })
                }
            })
        
    }

    updatePassword = () => {
        if(this.state.text.length > 5){
            firebase.auth().currentUser.updatePassword(this.state.text).then(() => {
                Alert.alert(
                    'Success', //title
                    'Password has been updated', //message or description
                    //button dengan text: '', lalu style:'', onPress: ketika di pencet/klik jalankan function reset
                    [{ text: 'Close', style: 'destructive' }]
                );
            })
            this.setState({ text: '' })
        }else if(this.state.text.length > 0){
            this.setState({ error : 'Password must be 6 character' })
            this.setState({ text: '' })
        }else{
            this.setState({ text: '' })
        }
    }

    render() {
        const { uid, email, name, phone, photo, myStatus } = this.state.user
        if(uid !== null) {
            return (
                <SafeAreaView style={styles.container}>
                    <ScrollView>
                        <TouchableOpacity onPress={this.changeImage}>
                            <View style={styles.imageProfile}>
                                <Image source={{ uri: (photo) ? photo : 'https://imgur.com/CJfr5uM' }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
                                <Image source={require('../assets/icons/photo_camera.png')} style={{ height: 20, width: 20, position: 'absolute', bottom: 5, left: 50 }} />
                            </View>
                        </TouchableOpacity>
                        <View style={styles.containerNameStatus}>
                            <TextInput style={styles.name} onChangeText={ text => this.setState({ text }) } onSubmitEditing={ () => this.updateData('name') } 
                                defaultValue={(name.length > 25) ? name.substr(0, 25) + '...' : name}
                            />
                            <TextInput style={styles.status} defaultValue={myStatus} placeholder='Add status' onChangeText={ text => this.setState({ text }) } onSubmitEditing={ () => this.updateData('myStatus') }  />
                        </View>
                        <View style={styles.dataContainer}>
                            <Text style={styles.data}>{email}</Text>
                            <TextInput style={styles.data} defaultValue={phone} placeholder='Phone number' keyboardType='number-pad' onChangeText={ text => this.setState({ text }) } onSubmitEditing={ () => this.updateData('phone') }  />
                            {
                                (this.state.error.length) ? <Text style={styles.textError}>{this.state.error}</Text> : null
                            }
                            <TextInput style={styles.data} placeholder='Type here for change password' defaultValue={this.state.text} secureTextEntry={true} onChangeText={ text => this.setState({ text, error: '' }) } onSubmitEditing={ () => this.updatePassword() } />
                        </View>
                        <TouchableOpacity onPress={this.handleSignOut}>
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Logout</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            );
        }else{
            return(
                <Text>Loading.....</Text>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    imageProfile: {
        height: width / 3,
        width: width / 3,
        borderRadius: width / 3,
        alignSelf: 'center',
        marginTop: width / 10,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#E3E3E3'
    },
    containerNameStatus: {
    },
    name: {
        marginTop: 10,
        paddingVertical: 5,
        fontSize: 25,
        textAlign: 'center',
        marginHorizontal: width / 15
    },
    status: {
        paddingVertical: 1,
        marginTop: -10,
        textAlign: 'center',
        marginHorizontal: width / 15
    },
    dataContainer: {
        marginTop: width / 15,
        marginHorizontal: width / 10
    },
    data: {
        marginTop: 10,
        fontSize: 18,
        paddingVertical: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#2FAEB2'
    },
    button: {
        width: 150,
        backgroundColor: '#DC0808',
        borderRadius: 25,
        alignSelf: 'center',
        marginTop: width / 10
    },
    buttonText: {
        paddingVertical: 15,
        textAlign: 'center',
        color: 'white',
        fontSize: 18
    },

    textError: {
        textAlign: 'center', 
        color: 'red'
    }
});

export default Profile;
