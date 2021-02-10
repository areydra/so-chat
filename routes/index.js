import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FirebaseAuth from '@react-native-firebase/auth';

import AuthStack from './stack/AuthStack';
import HomeStack from './stack/HomeStack';
import {SplashScreen} from '../src/screens';
import {connect} from 'react-redux';

const Stack = createStackNavigator();

const authUid = FirebaseAuth().currentUser.uid;

const Router = ({currentUserUid}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    checkUserHasSignedIn();
  }, [currentUserUid])

  const checkUserHasSignedIn = () => {
    const userHasSignedIn = !authUid && !currentUserUid;
    setIsSignedIn(userHasSignedIn);
  }

  if (isLoading) {
    return (
      <SplashScreen
        authUid={authUid}
        currentUserUid={currentUserUid}
        setIsLoading={setIsLoading}/>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isSignedIn ? (
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

const mapStateToProps = ({currentUser}) => ({
  currentUserUid: currentUser.uid,
});

export default connect(mapStateToProps)(Router);