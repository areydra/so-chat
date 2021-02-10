import FirebaseAuth from '@react-native-firebase/auth';
import FirebaseFirestore from '@react-native-firebase/firestore';

import {FETCH_CURRENT_USER, RESET_CURRENT_USER} from './currentUserActionTypes';

export function fetchCurrentUser() {
    return async (dispatch) => {
        const authUserId = FirebaseAuth().currentUser?.uid;
        const currentUser = await FirebaseFirestore().collection('users').doc(authUserId).get();

        if (!authUserId || !currentUser) {
            return;
        }

        dispatch({
            type: FETCH_CURRENT_USER,
            payload: currentUser,
        });
    }
}

export function resetCurrentUser() {
    return async (dispatch) => {
        dispatch({
            type: RESET_CURRENT_USER,
        });
    };
}