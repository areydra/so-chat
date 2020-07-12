import React, {useState} from 'react';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';



import { Friends, Messages, Profile, Chat, Map, Login, Register, Splash } from '../screens';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator();

const AuthStack = ({setUser}) => (
  <Stack.Navigator initialRouteName="Login" headerMode="none">
    <Stack.Screen name="Login" component={Login} setUser={setUser}/>
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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
console.log('user',user)
  return isLoading ? (
    <Splash setIsLoading={setIsLoading} setUser={setUser}/>
  ):(
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} options={() => ({headerShown: false})} setUser={setUser}/> 
        ):(
          <Stack.Screen name="Home" component={HomeStack}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Router;