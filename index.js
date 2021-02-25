import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FirebaseMessaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const CHANNEL = {
  id: 'so-chat-local-notifications',
  name: 'sochat',
  description: 'sochat notification'
};

PushNotification.configure({
    onRegister: token => {
      console.log("TOKEN: ", token)
    },
    onNotification: function (notification) {
      console.log("NOTIFICATION: ", notification);
    },
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
});

PushNotification.createChannel({
  channelId: CHANNEL.id,
  channelName: CHANNEL.name,
  channelDescription: CHANNEL.description
});

FirebaseMessaging().setBackgroundMessageHandler(async remoteMessage => {
    const notification = JSON.parse(remoteMessage.data.notification);

    PushNotification.localNotification({
        channelId: CHANNEL.id,
        title: notification.title, 
        message: notification.body,
    });
});

AppRegistry.registerComponent(appName, () => App);
