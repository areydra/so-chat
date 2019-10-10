import React from 'react';
import Router from './routes/index'
import firebase from 'firebase'

import { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } from './key'

// Your web app's Firebase configuration
const firebaseConfig = { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId }
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const App = () => {
    return (
    <Router />
  );
};

export default App;
