import {SET_IS_SIGNED_IN} from './authenticationActionTypes';

export function setIsSignedIn(isSignedIn) {
    return (dispatch) => {
        dispatch({
            type: SET_IS_SIGNED_IN,
            payload: {
                isSignedIn,
            },
        });
    };
}