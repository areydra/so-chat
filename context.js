import React from 'react';

const Context = React.createContext();

const connect = Component => props => (
    <Context.Consumer>
        {state => <Component {...props} {...state} />}
    </Context.Consumer>
)

export {
    Context,
    connect
};