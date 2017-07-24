import React, {Component} from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import FileUploadForm from './FileUploadForm';
import FileTree from './FileTree';
import Footer from './Footer';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap'
import { resetTree, addFileToTree, setToken } from '../actions';
import { validateToken, getTreeData } from '../util/upload';

class MainLayout extends Component {

    render() {
        return (

            <div>
                <TopNavBar hasSideNavBar/>
                <div className="container-fluid">
                    <div className="row">

                        <SideNavBar/>
                        <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 main">
                            { this.props.children }
                        </div>

                        <FileTree />
                    </div>
                </div>

                <Footer />
            </div>
        )
    }

}



export default MainLayout;