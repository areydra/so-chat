import {SET_IS_SIGNED_IN} from './authenticationActionTypes';

const initialState = {
    isSignedIn: false,
}

export function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IS_SIGNED_IN:
            return {
                ...state,
                ...action.payload
            }
        default:
            return state;
    }
}
