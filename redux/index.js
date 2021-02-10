import {createStore, combineReducers} from 'redux';

import {currentUserReducer} from './currentUser/currentUserReducer';

export const store = createStore(combineReducers({
    currentUserReducer
}));