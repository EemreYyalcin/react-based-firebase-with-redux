import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {applyMiddleware, createStore} from 'redux';
import {Provider} from 'react-redux';
import logger from 'redux-logger';


const store = createStore(reducers, applyMiddleware(thunk, logger));
ReactDOM.render(
    <Provider store={store}>
        <App/></Provider>, document.querySelector('#root')
);