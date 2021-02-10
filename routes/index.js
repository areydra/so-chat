import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import AuthStack from './stack/AuthStack';
import HomeStack from './stack/HomeStack';
import {SplashScreen} from '../src/screens';
import {connect} from 'react-redux';

const Stack = createStackNavigator();

const Router = ({currentUser}) => {
  if (!currentUser.uid) {
    return (
      <SplashScreen/>
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
  currentUser,
});

export default connect(mapStateToProps)(Router);