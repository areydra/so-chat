import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import AuthStack from './stack/AuthStack';
import HomeStack from './stack/HomeStack';
import {SplashScreen} from '../src/screens';

const Stack = createStackNavigator();

const Router = ({authentication}) => {
  const [isLoading, setIsLoading] = useState(true);

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