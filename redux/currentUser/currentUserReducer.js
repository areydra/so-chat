import {FETCH_CURRENT_USER, RESET_CURRENT_USER} from './currentUserActionTypes';

const initialState = {
    user: {
        uid: null,
        photo: null,
        name: null,
        about: null,
        phoneNumber: null,
    },
};

export function currentUserReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CURRENT_USER:
            return {
                ...state,
                ...action.payload,
            };
        case RESET_CURRENT_USER:
            return initialState;
        default:
            return initialState;
    }
}