import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { Dimensions } from 'react-native'

import { Friends, Messages, Profile, Chat, Map, Login, Register, Splash } from '../screens'

const { width } = Dimensions.get('window')

const AuthStack = createStackNavigator({
  Login, Register
}, {
  headerMode: 'none',
  initialRouteName: 'Login'
})

const MessagesStack = createStackNavigator({
  Messages, Chat, Map
},{
  initialRouteName: 'Messages',
  headerMode: 'none',

  // hide tab bar in specific screen
  navigationOptions:({navigation}) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};

    if (routeName === 'Map' || routeName === 'Chat') {
      navigationOptions.tabBarVisible = false;
      navigationOptions.swi
    }

    return navigationOptions;
  }
})

const FriendsStack = createStackNavigator({
  Friends, Map
}, {
  initialRouteName: 'Friends',
  headerMode: 'none',

  // hide tab bar in specific screen
  navigationOptions: ({ navigation }) => {
    let { routeName } = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};

    if (routeName === 'Map') {
      navigationOptions.tabBarVisible = false;
      navigationOptions.swipeEnabled = false
    }

    return navigationOptions;
  }
})

const Swipe = createMaterialTopTabNavigator(
 {
    Friends: { screen: FriendsStack },
    Messages: {screen: MessagesStack},
    Profile: {screen: Profile}
 },
 {
    initialRouteName: 'Messages',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
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
    },
  },
)

const Router = createSwitchNavigator({
  Swipe, AuthStack, Splash
},{
  initialRouteName: 'Splash',
  headerMode: 'none'
})
export default createAppContainer(Router)