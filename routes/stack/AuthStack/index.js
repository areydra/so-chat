import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FirebaseAuth from '@react-native-firebase/auth'

import {
  LoginScreen,
  PhoneNumberVerificationScreen,
  AccountInformationScreen,
} from '../../../src/screens';

import styles from './styles';

const Stack = createStackNavigator();

const AuthStack = () => {
  let initialRouteName = 'LoginScreen';
  let shouldHaveDisplayName = FirebaseAuth().currentUser && !FirebaseAuth().currentUser.displayName;

  if (shouldHaveDisplayName) {
    initialRouteName='AccountInformationScreen';
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}>
      <Stack.Screen
        name='LoginScreen'
        component={LoginScreen}
        options={{
          headerShown: false,
        }}/>
      <Stack.Screen
        name='PhoneNumberVerificationScreen'
        component={PhoneNumberVerificationScreen}
        options={{
          title: 'Phone Number Verification',
          headerStyle: styles.phoneNumberVerificationContainerHeader,
          headerTitleStyle: styles.phoneNumberVerificationHeaderTitle,
        }}/>
        <Stack.Screen
          name='AccountInformationScreen'
          component={AccountInformationScreen}
          options={{
            headerShown: false,
          }}/>
    </Stack.Navigator>
  )
}

export default AuthStack;