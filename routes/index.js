import React, {useState, useMemo, useEffect} from 'react';
import { Dimensions, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth'

import { Friends, Messages, Profile, Chat, Map, Login, Register, Splash } from '../screens';
import {AuthContext} from '../context';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator initialRouteName="Login" headerMode="none">
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Register" component={Register}/>
  </Stack.Navigator>
)

const MessagesStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Messages" component={Messages}/>
  </Stack.Navigator>
)

const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Chat" component={Chat}/>
  </Stack.Navigator>
)

const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Map" component={Map}/>
  </Stack.Navigator>
)

const FriendsStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Friends" component={Friends}/>
  </Stack.Navigator>
)

const ProfileStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name="Profile" component={Profile}/>
  </Stack.Navigator>
)

const Tab = createMaterialTopTabNavigator();
const Swipe = () => (
  <Tab.Navigator initialRouteName="Messages" tabBarPosition="top" swipeEnabled={true} tabBarOptions={{
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
    <Tab.Screen name="Friends" component={FriendsStack} />
    <Tab.Screen name="Messages" component={MessagesStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
)

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Swipe">
    <Stack.Screen name="Swipe" component={Swipe} />
    <Stack.Screen name="Chat" component={ChatStack} />
    <Stack.Screen name="Map" component={MapStack} />
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
    if(!permission) {
      return;
    }

    handleAfterCheckPermission();
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
        .then(permission => setPermission(permission))
        .catch(err => console.warn(err));
  };

  const handleAfterCheckPermission = () => {
    if(permission !== PermissionsAndroid.RESULTS.GRANTED){
        return;
    }
    
    setIsLoading(false);
  }

  const checkIsSignedIn = () => {
    if (!auth().currentUser?.uid) {
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
              component={HomeStack}/>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default Router;