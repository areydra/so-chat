import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import FirebaseAuth from '@react-native-firebase/auth';
import {connect} from 'react-redux';

import AuthStack from './stack/AuthStack';
import HomeStack from './stack/HomeStack';
import {SplashScreen} from '../src/screens';

const Stack = createStackNavigator();

const authUid = FirebaseAuth().currentUser?.uid;

const Router = ({authentication}) => {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return (
      <SplashScreen
        authUid={authUid}
        setIsLoading={setIsLoading}/>
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