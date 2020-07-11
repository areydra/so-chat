import React from 'react';
import Router from './routes/index'
import firebase from 'firebase'
import firebaseConfig from './key';

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
