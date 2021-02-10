import React from 'react';
import Router from './routes/index';
import {Provider} from 'react-redux';
import {store} from './redux';

const App = () => (
    <Provider value={store}>
        <Router/>
    </Provider>
);

export default App;
