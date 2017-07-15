'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link} from 'react-router-dom'

import Home from './components/Home'
import InfoBlock from './components/InfoBlock'


// tag::vars[]
const client = require('./client');

// tag::render[]
ReactDOM.render(
    <BrowserRouter>
        <Route path="/" component={Home} />
    </BrowserRouter>, document.getElementById('react')
)
// end::render[]