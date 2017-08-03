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
import MetaboliteAnalysis from './components/MetaboliteAnalysis';
import PatternRecogAnalysis from './components/PatternRecogAnalysis';
import TimeSeriesAnalysis from './components/TimeSeriesAnalysis';
import ProcessFile from './components/ProcessFile';

import MainLayout from './layouts/MainLayout';
import SimpleLayout from './layouts/SimpleLayout';

import rootReducer from './reducers/';
import { addFileToTree } from './actions';

// tag::vars[]
const client = require('./client');
const storeData = sessionStorage.getItem("store") ? JSON.parse(sessionStorage.getItem("store")) : {};
const store = createStore(rootReducer, storeData, applyMiddleware(thunk));
store.subscribe(()=> {
    console.log("Store", "store updated");
    sessionStorage.setItem("store", JSON.stringify(store.getState()));
});



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

const renderWithLayout = (layout, component) => {
    var layoutComponent;
    switch (layout) {
        case "main":
            return () => <MainLayout> { component } </MainLayout>
            break;
        case "simple":
            return () => <SimpleLayout> { component } </SimpleLayout>
        default:
            return;
    }
}


// tag::render[]
ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>

            <Switch>
                <Route exact path="/" render={ renderWithLayout("simple", <Home />) }/>// render={ renderWithLayout("simple", <Home />) } />
                <Route path="/upload" render={ renderWithLayout("main", <Upload />) } />
                <Route path="/upload-pass" render={ renderWithLayout("main", <ProcessFile />) } />
                <Route path="/analysis" render={ renderWithLayout("main", <Analysis />) } />
                <Route path="/metabolite-analysis" render={ renderWithLayout("main", <MetaboliteAnalysis />) } />
                <Route path="/temporal-pattern-recognition" render={ renderWithLayout("main", <PatternRecogAnalysis />) } />
                <Route path="/time-series-viewer" render={ renderWithLayout("main", <TimeSeriesAnalysis />) } />
            </Switch>

        </Router>
    </Provider>, document.getElementById('react')
    )
// end::render[]