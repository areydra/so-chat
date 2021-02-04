import React, {useState, useEffect} from 'react';
import {
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  PermissionsAndroid,
  View,
  Text,
  TextInput,
  Dimensions,
  ScrollView,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import FirebaseStorage from '@react-native-firebase/storage';

import {witContext} from '../context';

const {width} = Dimensions.get('window');

const IMAGE_PICKER_OPTIONS = {
  title: 'Select Profile',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  mediaType: 'photo',
};

const Profile = (props) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [myStatus, setMyStatus] = useState('');
  const [password, setPassword] = useState('');  
  const [error, setError] = useState('');
  const [permission, setPermission] = useState(false);
  const [user, setUser] = useState({uid: '', email: '', name: ''});
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setUser(auth().currentUser)
    getAvatarFromFirebaseStorage();    
    checkPermission();
  }, [])

  const checkPermission = () => {
    let checkPermissionCamera = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    let checkPermissionReadExternalStorage = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    let checkPermissionWriteExternalStorage = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    let permission = checkPermissionCamera && checkPermissionReadExternalStorage && checkPermissionWriteExternalStorage;

    setPermission(permission);
  }

  const requestPermission = () => {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ])
      .then(status => {
        if (status !== PermissionsAndroid.RESULTS.GRANTED){
          return;
        }

        setPermission(true);
      })
  };

  const getAvatarFromFirebaseStorage = async () => {
    const uri = await FirebaseStorage().ref(`images/${auth().currentUser.uid}`).getDownloadURL();

    if (!uri) {
      setAvatar(require('../assets/icons/icon_avatar.png'));
    }

    setAvatar({uri});
  }
  
  const uploadAvatarToFirebaseStorage = (uri) => {
    FirebaseStorage().ref(`images/${user.uid}`).putFile(uri).then(() => {
      setAvatar({uri})
    });
  }

  const changeAvatar = () => {
    if (!permission) {
      return requestPermission();
    }
    
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, image => {
      if (!image?.path) {
        return;
      }

      uploadAvatarToFirebaseStorage(image.path);
    });
  };

  const handleSignOut = () => {
    if (!auth().currentUser?.uid) {
      return;
    }

    const status = database.ServerValue.TIMESTAMP;

    database().ref(`users/${auth().currentUser.uid}`).update({status}).then(() => {
      auth().signOut().then(() => {
        props.signIn(false);
      }).catch(() => {
        database().ref(`users/${auth().currentUser.uid}`).update({status: 'online'});
      });
    });
  };

  const updateName = () => {
    if (name.length < 4) {
      return;
    }

    database().ref(`users/${user.uid}`).update({name});
    setName('');
  }

  const updateMyStatus = () => {
    if (!myStatus.length) {
      return;
    }

    database().ref(`users/${user.uid}`).update({myStatus});
    setMyStatus('');
  }

  const updatePhone = () => {
    if (!phone.length) {
      return;
    }

    database().ref(`users/${user.uid}`).update({phone});
    setPhone('');
  }  
 
  const updatePassword = () => {
    if (password.length < 6) {
      return setError('Password must be 6 character');
    }

    auth().currentUser.updatePassword(password).then(() => alertPasswordSuccessUpdated());
    setPassword('');
  };

  const alertPasswordSuccessUpdated = () => {
    Alert.alert(
      'Success', 
      'Password has been updated', 
      [{text: 'Close', style: 'destructive'}],
    );
  }

  return (
    <ScrollView style={Styles.container}>
      <TouchableOpacity onPress={changeAvatar}>
        <View style={Styles.imageProfile}>
          <Image source={avatar} style={Styles.iconAvatar}/>
          <Image source={require('../assets/icons/photo_camera.png')} style={Styles.iconCamera}/>
        </View>
      </TouchableOpacity>
      <View style={Styles.containerNameStatus}>
        <TextInput
          style={Styles.name}
          onChangeText={setName}
          onSubmitEditing={updateName}
          defaultValue={name.length > 25 ? name.substr(0, 25) + '...' : name}
        />
        <TextInput
          style={Styles.status}
          defaultValue={user.myStatus}
          placeholder="Add status"
          onChangeText={setMyStatus}
          onSubmitEditing={updateMyStatus}
        />
      </View>
      <View style={Styles.dataContainer}>
        <Text style={Styles.data}>{user.email}</Text>
        <TextInput
          style={Styles.data}
          defaultValue={user.phone}
          placeholder="Phone number"
          keyboardType="number-pad"
          onChangeText={setPhone}
          onSubmitEditing={updatePhone}
        />
        {error.length ?
          <Text style={Styles.textError}>{error}</Text>
        : null}
        <TextInput
          style={Styles.data}
          placeholder="Type here for change password"
          defaultValue={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          onSubmitEditing={updatePassword}
        />
      </View>
      <TouchableOpacity onPress={handleSignOut}>
        <View style={Styles.button}>
          <Text style={Styles.buttonText}>Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageProfile: {
    height: width / 3,
    width: width / 3,
    borderRadius: width / 3,
    alignSelf: 'center',
    marginTop: width / 10,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E3E3E3',
  },
  containerNameStatus: {},
  name: {
    marginTop: 10,
    paddingVertical: 5,
    fontSize: 25,
    textAlign: 'center',
    marginHorizontal: width / 15,
  },
  status: {
    paddingVertical: 1,
    marginTop: -10,
    textAlign: 'center',
    marginHorizontal: width / 15,
  },
  dataContainer: {
    marginTop: width / 15,
    marginHorizontal: width / 10,
  },
  data: {
    marginTop: 10,
    fontSize: 18,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#2FAEB2',
  },
  button: {
    width: 150,
    backgroundColor: '#DC0808',
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: width / 10,
  },
  buttonText: {
    paddingVertical: 15,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },

  textError: {
    textAlign: 'center',
    color: 'red',
  },
  iconAvatar: {
    width: '100%', 
    height: '100%', 
    resizeMode: 'contain',
  },
  iconCamera: {
      height: 20,
      width: 20,
      bottom: 0,
      left: 58,
      position: 'absolute',
  }
});

export default witContext(Profile);
