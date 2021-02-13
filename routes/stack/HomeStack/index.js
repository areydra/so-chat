import React from 'react';
import {Image, Text, View} from 'react-native';
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
import Icon from '../../../src/assets/icons';
import Color from '../../../src/constants/Colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
  <Stack.Navigator initialRouteName="HomeTab">
    <Stack.Screen 
      name="HomeTab"
      component={HomeTab}
      options={{
        headerShown: false
      }}/>
    <Stack.Screen 
      name="Chat"
      component={ChatScreen}
      options={({route, navigation}) => ({
        header: () => (
          <HeaderChat
            name={route.params?.name}
            status={route.params?.status}
            photo={{uri: route.params?.item?.photo}}
            backToPrevScreen={() => navigation.goBack()}/>
        ),
      })}
    />
    <Stack.Screen 
      name="Map" 
      component={MapScreen}
      options={({route, navigation}) => ({
        header: () => (
          <HeaderMap
            title={route.params?.title}
            backToPrevScreen={() => navigation.goBack()}/>
        ),
      })}/>
  </Stack.Navigator>
)

const HeaderChat = ({name, status, photo, backToPrevScreen}) => (
  <View style={styles.chatScreenHeaderContainer}>
    <TouchableOpacity onPress={backToPrevScreen}>
      <Image 
        source={Icon.arrowBackWhite} 
        style={styles.iconArrowBack}/>
    </TouchableOpacity>
    <Image 
      source={photo}
      style={styles.chatScreenTitlePhoto}/>
    <View style={styles.chatScreenTitleTextContainer}>
      <Text style={styles.chatScreenTitleTextName}>{name}</Text>
      <Text style={styles.chatScreenTitleTextStatus}>{status}</Text>    
    </View>
  </View>
);

const HeaderMap = ({title, backToPrevScreen}) => (
  <View style={styles.mapScreenHeaderContainer}>
    <TouchableOpacity onPress={backToPrevScreen}>
      <Image 
        source={Icon.arrowBackWhite} 
        style={styles.iconArrowBack}/>
    </TouchableOpacity>
    <Text style={styles.mapScreenTitleStyle}>{title}</Text>
  </View>
);

export default HomeStack;