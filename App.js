import React from 'react';
import firebase from 'firebase';
import ENV from 'react-native-config';

import Router from './routes/index';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  databaseURL: ENV.FIREBASE_DATABASE_URL,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
  measurementId: ENV.FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
if (!firebase.apps.length) { //check if not initialize
  firebase.initializeApp(firebaseConfig);
}else{
  firebase.app()
}


const App = () => {
    return (
    <Router />
  );
};

export default App;
