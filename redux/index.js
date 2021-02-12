import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {currentUserReducer} from './currentUser/currentUserReducer';
import {authenticationReducer} from './authentication/authenticationReducer';

export const store = createStore(
    combineReducers({
        currentUser: currentUserReducer,
        authentication: authenticationReducer,
    }),
    applyMiddleware(thunk)
);