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
import {connect} from 'react-redux';

import styles from './styles';
import Icon from '../../assets/icons';
import {setIsSignedIn} from '../../../redux/authentication/authenticationActions';
import {setCurrentUser} from '../../../redux/currentUser/currentUserActions';

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
  about: 'About you',
  phoneNumber: 'Your phone number',
  button: 'Save'
}

const authUser = FirebaseAuth().currentUser;

const AccountInformationScreen = ({currentUser, ... props}) => {
  const [name, setName] = useState(null);
  const [about, setAbout] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState(false);
  const [avatar, setAvatar] = useState(null);

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

  useEffect(() => {
    if (props.isProfile || !isLoading) {
      return;
    }

    props.setIsSignedIn(true);
  }, [currentUser])

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
    if (!authUser?.uid) {
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
        await FirebaseStorage().ref(`images/${authUser?.uid}`).putFile(avatar.uri);
        imageUri = await FirebaseStorage().ref(`images/${authUser?.uid}`).getDownloadURL();
      }

      saveAccountInformation(imageUri);  
    } catch (err) {
      setIsLoading(false);
      console.log('err', err);
    }
  }

  const saveAccountInformation = async(imageUri) => {
    const payload = getPayloadAccountInformation(imageUri);

    if (props.isProfile) {
      await FirebaseFirestore().collection('users').doc(authUser?.uid).update(payload.collection);
    } else {
      await FirebaseFirestore().collection('users').doc(authUser?.uid).set(payload.collection);
    }

    props.setCurrentUser({uid: authUser?.uid, ...payload.collection});
    await FirebaseAuth().currentUser.updateProfile(payload.authentication);

    setIsLoading(false);
  };

  const getPayloadAccountInformation = (imageUri) => {
    let defaultName = name ?? currentUser?.name;
    let defaultCollection = {
      name: defaultName,
      about,
      location,
      status: 'Online',
      phoneNumber: currentUser.phoneNumber,
    };

    let defaultAuthentication = {
      displayName: defaultName,
    };

    if (imageUri) {
      return {
        collection: {photo: imageUri, ...defaultCollection},
        authentication: {photoURL: imageUri, ...defaultAuthentication},
      };
    }

    return {
      collection: {photo: currentUser?.photo, ...defaultCollection},
      authentication: defaultAuthentication,
    };
  }

  const getStyleContainer = () => {
    if (props.isProfile) {
      return styles.containerProfile;
    }

    return styles.container;
  }

  const getDefaultAvatar = () => {
    if (avatar) {
      return avatar;
    }

    if (currentUser?.photo) {
      return {uri: currentUser?.photo};
    }

    return Icon.avatar;
  }

  return (
    <View style={getStyleContainer()}>
      <TouchableOpacity onPress={changeAvatar}>
        <View style={styles.imageProfile}>
          <Image 
            source={getDefaultAvatar()} 
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
          value={currentUser?.name}
          onChangeText={setName}/>
        <TextInput
          style={styles.textInput}
          placeholder={TEXT.about}
          defaultValue={about ?? currentUser.about}
          onChangeText={setAbout}/>
        <TextInput
          style={styles.textInput}
          value={(FirebaseAuth().currentUser?.phoneNumber).replace('+62', '0')}
          placeholder={TEXT.phoneNumber}
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

const mapStateToProps = ({currentUser}) => ({
  currentUser,
});

const mapDispatchToProps = {
  setIsSignedIn,
  setCurrentUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountInformationScreen);
