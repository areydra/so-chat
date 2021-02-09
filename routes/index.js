import React, {useState, useMemo, useEffect} from 'react';
import { Alert, Dimensions, PermissionsAndroid } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import auth from '@react-native-firebase/auth'

import {
  LoginScreen,
  PhoneNumberVerificationScreen,
  AccountInformationScreen,
  FriendsScreen,
  ChatScreen,
  MessagesScreen,
  SplashScreen,
  MapScreen,
} from '../src/screens';

import Color from '../src/constants/Colors';
import {Context} from '../context';

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
      component={FriendsScreen}/>
    <Tab.Screen 
      name="Messages" 
      component={MessagesScreen}/>
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}/>
  </Tab.Navigator>
)

const ProfileScreen = () => (
  <AccountInformationScreen isProfile={true}/>
)

const HomeStack = () => (
  <Stack.Navigator headerMode="none" initialRouteName="Swipe">
    <Stack.Screen 
      name="Swipe" 
      component={Swipe}/>
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}/>
    <Stack.Screen 
      name="Map" 
      component={MapScreen}/>
  </Stack.Navigator>
)

const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkIsSignedIn();
  }, [])

  const checkIsSignedIn = () => {
    if (!auth().currentUser?.uid || !auth().currentUser.displayName) {
      return;
    }

    setIsSignedIn(true);
  }

  const contextValue = useMemo(() => ({
    signIn: isSignedIn => {
      setIsSignedIn(isSignedIn);
    },
    isLoading: isLoading => {
      setIsLoading(isLoading);
    }
  }), []);

  if (isLoading) {
    return (
      <Context.Provider value={contextValue}>
        <SplashScreen/>
      </Context.Provider>
    );
  }

  return (
    <Context.Provider value={contextValue}>
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
    </Context.Provider>
  )
}

export default Router;