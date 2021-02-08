import React, {useState, useEffect} from 'react';
import {
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  View,
  Text,
  TextInput,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Geolocation from '@react-native-community/geolocation';
import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseStorage from '@react-native-firebase/storage';
import FirebaseFirestore from '@react-native-firebase/firestore';

import styles from './styles';
import Icon from '../../assets/icons';
import {witContext} from '../../../context';

const IMAGE_PICKER_OPTIONS = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
  mediaType: 'photo',
};

const TEXT = {
  name: 'Your name',
  button: 'Save'
}

const user = FirebaseAuth().currentUser;

const AccountInformationScreen = (props) => {
  const [name, setName] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState(false);
  const [avatar, setAvatar] = useState(Icon.avatar);

  useEffect(() => {
    getLocation();
    checkPermission();
  }, [])

  useEffect(() => {
    if (!error) {
      return;
    }

    setError(null);
  }, [name])

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

  const getLocation = () => {
    Geolocation.getCurrentPosition(position => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    })
  }

  const changeAvatar = () => {
    if (!permission) {
      return requestPermission();
    }
    
    ImagePicker.showImagePicker(IMAGE_PICKER_OPTIONS, image => {
      if (!image?.path) {
        return;
      }
      
      const imagePath = Platform.OS == 'android' ? `file:///${image.path}` : image.path;
      setAvatar({uri: imagePath});
    });
  };

  const prepareSaveAccountInformation = async() => {
    if (!user?.uid) {
      return;
    }

    if (!name) {
      setError('Name cannot be null!');
      return;
    }

    try {
      let imageUri = null;
      setIsLoading(true);

      if (avatar) {
        await FirebaseStorage().ref(`images/${user?.uid}`).putFile(avatar.uri);
        imageUri = await FirebaseStorage().ref(`images/${user?.uid}`).getDownloadURL();
      }

      saveAccountInformation(imageUri);  
    } catch (err) {
      setIsLoading(false);
      console.log('err', err);
    }
  }

  const saveAccountInformation = async(imageUri) => {
    await FirebaseAuth().currentUser.updateProfile({displayName: name});
    await FirebaseFirestore().collection('users').doc(user.uid).set({
        name,
        imageUri,
        location,
        status: 'Online',
        phone: user.phoneNumber,
    });

    props.signIn(true);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={changeAvatar}>
        <View style={styles.imageProfile}>
          <Image 
            source={avatar} 
            style={styles.iconAvatar}/>
          <Image 
            source={Icon.camera} 
            style={styles.iconCamera}/>
        </View>
      </TouchableOpacity>
      <View style={styles.containerContent}>
        <TextInput
          style={styles.textInput}
          placeholder={TEXT.name}
          defaultValue={name}
          onChangeText={setName}/>
        <TextInput
          style={styles.textInput}
          value={(user?.phoneNumber).replace('+62', '0')}
          editable={false}/>
        {error && (
          <Text style={styles.textError}>{error}</Text>
        )}
      </View>
      <TouchableOpacity onPress={prepareSaveAccountInformation}>
        <View style={styles.button}>
          {isLoading ? (
              <ActivityIndicator
                  color='white'
                  size={25}/>
          ) : (
            <Text style={styles.buttonText}>{TEXT.button}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

export default witContext(AccountInformationScreen);