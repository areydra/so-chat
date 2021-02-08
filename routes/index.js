import React, {useState, useMemo, useEffect} from 'react';
import { Alert, Dimensions, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth'

import { Friends, Messages, Profile, Chat, Map, Splash } from '../screens';
import { LoginScreen, PhoneNumberVerificationScreen, AccountInformationScreen } from '../src/screens';

import Color from '../src/constants/Colors';
import {AuthContext} from '../context';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const AuthStack = () => {
  let initialRouteName = "LoginScreen";
  let shouldHaveDisplayName = auth().currentUser && !auth().currentUser.displayName;

  if (shouldHaveDisplayName) {
    initialRouteName="AccountInformationScreen";
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
        }}/>
      <Stack.Screen
        name="PhoneNumberVerificationScreen"
        component={PhoneNumberVerificationScreen}
        options={{
          title: 'Phone Number Verification',
          headerTitleStyle: {
            color: Color.white,
            alignSelf: 'center',
          },
          headerStyle: {
            backgroundColor: Color.main,
          }
        }}/>
        <Stack.Screen
          name="AccountInformationScreen"
          component={AccountInformationScreen}
          options={{
            headerShown: false,
          }}/>
    </Stack.Navigator>
  )
}

const Swipe = () => (
  <Tab.Navigator 
    initialRouteName="Messages" 
    tabBarPosition="top" 
    swipeEnabled={true} 
    tabBarOptions={{
      scrollEnabled: true,
      activeTintColor: '#FFFFFF',
      inactiveTintColor: '#FFFFFF',
      style: {
        backgroundColor: '#2FAEB2',
      },
      tabStyle: {
        width: width/3,
      },
      labelStyle: {
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
      },
      indicatorStyle: {
        borderBottomColor: '#FFFFFF',
        borderBottomWidth: 3,
      },
    }}>
    <Tab.Screen 
      name="Friends" 
      component={Friends}/>
    <Tab.Screen 
      name="Messages" 
      component={Messages}/>
    <Tab.Screen 
      name="Profile" 
      component={Profile}/>
  </Tab.Navigator>
)

const HomeStack = () => (
  <Stack.Navigator headerMode="none" initialRouteName="Swipe">
    <Stack.Screen 
      name="Swipe" 
      component={Swipe}/>
    <Stack.Screen 
      name="Chat" 
      component={Chat}/>
    <Stack.Screen 
      name="Map" 
      component={Map}/>
  </Stack.Navigator>
)

const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [permission, setPermission] = useState(null);

  useEffect(() => {
    checkIsSignedIn();
    checkPermission();
      
    return checkPermission();
  }, [])

  useEffect(() => {
    if(permission !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }

    setIsLoading(false);
  }, [permission])

  const checkPermission = () => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(locationPermission => {
        if(locationPermission){
            setPermission(PermissionsAndroid.RESULTS.GRANTED);
        }else{
            requestLocationPermission();
        } 
    })
  }

  const requestLocationPermission = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(permission => {
          if (permission === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            showAlertPermissionNotGranted();
          }

          setPermission(permission)
        })
        .catch(err => console.warn(err));
  };

  const showAlertPermissionNotGranted = () => {
    Alert.alert(
        'Failed',
        'You must be granted location permission',
        [
          {
            style: 'destructive', 
            onPress: () => checkPermission() 
          }
        ]
    );
  }

  const checkIsSignedIn = () => {
    if (!auth().currentUser?.uid || !auth().currentUser.displayName) {
      return;
    }

    setIsSignedIn(true);
  }

  const authContext = useMemo(() => ({
    signIn: isSignedIn => {
      setIsSignedIn(isSignedIn);
    },
  }), []);

  if (isLoading) {
    return <Splash/>
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <Stack.Navigator>
          {!isSignedIn ? (
            <Stack.Screen 
              name="Auth" 
              component={AuthStack} 
              options={() => ({headerShown: false})}
              setIsSignedIn={setIsSignedIn}/> 
          ):(
            <Stack.Screen 
              name="Home" 
              options={() => ({headerShown: false})}
              component={HomeStack}/>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default Router;