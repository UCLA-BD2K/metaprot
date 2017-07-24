'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, Switch, IndexRoute} from 'react-router-dom';

import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Home from './components/Home';
import Analysis from './components/Analysis';
import Upload from './components/Upload';

import MainLayout from './components/MainLayout';

import rootReducer from './reducers/';
import { addFileToTree } from './actions';

// tag::vars[]
const client = require('./client');

const store = createStore(rootReducer, applyMiddleware(thunk));
console.log(store.getState());
store.subscribe(()=> console.log('store', store.getState()));


const history = createBrowserHistory();
const initGA = (history) => {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-60704143-2', 'auto');  // dev
    //ga('create', 'UA-60704143-3', 'auto'); // production
    ga('send', 'pageview');

    history.listen((location) => {
        ga('send', 'pageview', location.pathname);
    });
};

initGA(history);



// tag::render[]
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>

            <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/upload" render={ ()=> <MainLayout> <Upload /> </MainLayout> } />
                <Route path="/upload-pass" render={ ()=> <MainLayout> <Analysis /> </MainLayout> } />
                <Route path="/analysis" render={ ()=> <MainLayout> <Analysis /> </MainLayout> } />
            </Switch>

        </Router>
    </Provider>, document.getElementById('react')
    )
// end::render[]