import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import {currentUserReducer} from './currentUser/currentUserReducer';

export const store = createStore(
    combineReducers({
        currentUser: currentUserReducer,
    }),
    applyMiddleware(thunk)
);