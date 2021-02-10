import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {
  AccountInformationScreen,
  FriendsScreen,
  ChatScreen,
  MessagesScreen,
  MapScreen,
} from '../../../src/screens';

import styles from './styles';
import Color from '../../../src/constants/Colors';

const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const HomeTab = () => (
  <Tab.Navigator 
    initialRouteName="Messages" 
    tabBarPosition="top" 
    swipeEnabled={true} 
    tabBarOptions={{
      scrollEnabled: true,
      activeTintColor: Color.white,
      inactiveTintColor: Color.white,
      style: styles.containerTabBarOptions,
      tabStyle: styles.containerChildTabBarOptions,
      labelStyle: styles.tabBarOptionsLabel,
      indicatorStyle: styles.tabBarOptionsIndicator,
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
  <Stack.Navigator 
    headerMode="none" 
    initialRouteName="HomeTab">
    <Stack.Screen 
      name="HomeTab" 
      component={HomeTab}/>
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}/>
    <Stack.Screen 
      name="Map" 
      component={MapScreen}/>
  </Stack.Navigator>
)

export default HomeStack;