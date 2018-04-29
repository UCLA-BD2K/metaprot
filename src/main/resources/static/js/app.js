'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, Switch, IndexRoute} from 'react-router-dom';

import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Home from './views/Home';
import About from './views/About';
import Contact from './views/Contact';
import Upload from './views/Upload';
import Analysis from './views/Analysis';
import MetaboliteAnalysis from './views/MetaboliteAnalysis';
import PatternRecognitionAnalysis from './views/PatternRecognitionAnalysis';
import ProcessFile from './views/ProcessFile';
import ResultValidation from './views/ResultValidation';
import Integration from './views/Integration';
import IntegrationTool from './views/IntegrationTool';
import DynamicTimeWarping from './views/DynamicTimeWarping';

import MainLayout from './layouts/MainLayout';
import SimpleLayout from './layouts/SimpleLayout';

import rootReducer from './reducers/';



// In case of page refresh, restore store data if saved in sessionStorage
const storeData = sessionStorage.getItem("store") ? JSON.parse(sessionStorage.getItem("store")) : {};

const store = createStore(rootReducer, storeData, applyMiddleware(thunk));

store.subscribe(()=> {
    // DON'T save filenames in sessionStorage.
    // In case of page refresh, make another request so that filenames remain up to date.
    let storeData = store.getState();
    let storageData = {
        token: storeData.token,
        googleAnalyticsReport: storeData.googleAnalyticsReport
    };
    sessionStorage.setItem("store", JSON.stringify(storageData));
});



const history = createBrowserHistory();

// initialize Google Analytics Tracking
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


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/" render={ renderWithLayout("simple", <Home />) }/>
                <Route path="/about" render={ renderWithLayout("simple", <About />) }/>
                <Route path="/contact" render={ renderWithLayout("simple", <Contact />) }/>
                <Route exact path="/upload" render={ renderWithLayout("main", <Upload />) } />
                <Route path="/upload/:token" render={ ({match}) => <MainLayout> <Upload linkedToken={match.params.token}/> </MainLayout>} />
                <Route path="/upload-pass" render={ renderWithLayout("main", <ProcessFile />) } />
                <Route path="/analysis" render={ renderWithLayout("main", <Analysis />) } />
                <Route path="/metabolite-analysis" render={ renderWithLayout("main", <MetaboliteAnalysis />) } />
                <Route path="/pattern" render={ renderWithLayout("main", <PatternRecognitionAnalysis />) } />
                <Route path="/result-validation" render={ renderWithLayout("main", <ResultValidation />) } />
                <Route path="/integration" render={ renderWithLayout("main", <Integration />) } />
                <Route path="/integration-tool" render={ renderWithLayout("main", <IntegrationTool />) } />
                <Route path="/dtw-cluster" render={ renderWithLayout("main", <DynamicTimeWarping />) } />
            </Switch>

        </Router>
    </Provider>, document.getElementById('react')
)