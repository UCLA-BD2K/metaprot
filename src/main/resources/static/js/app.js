'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Home from './components/Home';
import Analysis from './components/Analysis';
import Upload from './components/Upload';

import rootReducer from './reducers/';
import { addFileToTree } from './actions';

// tag::vars[]
const client = require('./client');

const store = createStore(rootReducer);
console.log(store.getState());
store.subscribe(()=> console.log('store', store.getState()));

// tag::render[]
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/upload" component={Upload} />
                <Route path="/upload-pass" component={Analysis} />
                <Route path="/analysis" component={Analysis} />
            </Switch>
        </BrowserRouter>
    </Provider>, document.getElementById('react')
    )
// end::render[]