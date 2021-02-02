import React from 'react';

const AuthContext = React.createContext();

const witContext = Component => props => (
    <AuthContext.Consumer>
        {state => <Component {...props} {...state} />}
    </AuthContext.Consumer>
)

export {
    AuthContext,
    witContext
};