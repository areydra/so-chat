import React, {useState, useEffect} from 'react';
import {AppState} from "react-native";
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';
import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';

import AuthStack from './stack/AuthStack';
import HomeStack from './stack/HomeStack';
import {SplashScreen} from '../src/screens';

const Stack = createStackNavigator();

const Router = ({authentication}) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    const authUid = FirebaseAuth().currentUser?.uid;

    if (!authUid) {
      return;
    }

    changeUserStatus(nextAppState, authUid);
  };

  const changeUserStatus = (nextAppState, authUid) => {
    let status = 'Online';
    
    if (nextAppState === 'background') {
      status = new Date().getTime();
    }

    FirebaseFirestore().collection('users').doc(authUid).update({status});
  }

  if (isLoading) {
    return (
      <SplashScreen setIsLoading={setIsLoading}/>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!authentication.isSignedIn ? (
          <Stack.Screen 
            name="Auth" 
            component={AuthStack} 
            options={() => ({headerShown: false})}/> 
        ):(
          <Stack.Screen 
            name="Home" 
            options={() => ({headerShown: false})}
            component={HomeStack}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const mapStateToProps = ({authentication}) => ({
  authentication,
});

export default connect(mapStateToProps)(Router);