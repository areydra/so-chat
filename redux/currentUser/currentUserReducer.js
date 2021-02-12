import {FETCH_CURRENT_USER, RESET_CURRENT_USER} from './currentUserActionTypes';

const initialState = {
    uid: null,
    photo: null,
    name: null,
    about: null,
    phoneNumber: null,
};

export function currentUserReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CURRENT_USER:
        case SET_CURRENT_USER:
            return {
                ...state,
                ...action.payload,
            };
        case RESET_CURRENT_USER:
            return state;
        default:
            return state;
    }
}