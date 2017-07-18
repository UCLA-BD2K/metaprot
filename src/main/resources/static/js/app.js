'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom';

import Home from './components/Home';
import Analysis from './components/Analysis';


// tag::vars[]
const client = require('./client');

// tag::render[]
ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/upload" component={Analysis} />
            <Route path="/upload-pass" component={Analysis} />
            <Route path="/analysis" component={Analysis} />
        </Switch>
    </BrowserRouter>, document.getElementById('react')
)
// end::render[]