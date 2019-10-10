import React, { Component } from 'react';
import { AppState } from 'react-native';
import firebase from 'firebase';

export default class AppStateEx extends Component {
    state = {
        appState: AppState.currentState
    };

    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
    };

    componentWillUnmount = async () => {
        AppState.removeEventListener('change', this._handleAppStateChange);
    };

    _handleAppStateChange = async nextAppState => {
        let user = firebase.auth().currentUser
        let updates = {}

        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active'){
            if (user.uid) {
                firebase.database().ref('users/' + user.uid).once('value', val => {
                    let users = val.val()[Object.keys(val.val())]
                    let updateStatus = {
                        ...users,
                        status: 'online'
                    }

                    updates['users/' + users.uid] = updateStatus
                })
            }
        } else if ( (this.state.appState.match('active') && nextAppState === 'inactive') || 'background' ) {
            if (user.uid) {
                firebase.database().ref('users/' + user.uid).once('value', val => {
                    let users = val.val()[Object.keys(val.val())]
                    let updateStatus = {
                        ...users,
                        status: firebase.database.ServerValue.TIMESTAMP
                    }

                    updates['users/' + users.uid] = updateStatus
                })
            }
        }

        console.log(updates)

        firebase.database().ref().update(updates)
        this.setState({ appState: nextAppState })
    };

    render() {
        return null;
    }
}