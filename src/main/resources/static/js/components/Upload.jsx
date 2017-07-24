import React, {Component} from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import FileUploadForm from './FileUploadForm';
import FileTree from './FileTree';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap'
import { resetTree, addFileToTree, setToken } from '../actions';
import { validateToken, getTreeData } from '../util/upload';

class Upload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tokenInput: "",
            tokenWarning: null
        }
        this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
        this.handleTokenInput = this.handleTokenInput.bind(this);

    }

    componentWillMount() {
        // in case of page refresh, re-load token and sessionData if cached in sessionStorage
        var token = sessionStorage.getItem("sessionToken");
        if (token) {
            this.props.setToken(token);

            var sessionData = sessionStorage.getItem("root");
            if (sessionData) {
                JSON.parse(sessionData).forEach(filename => {
                    this.props.addFileToTree(filename)
                })
            }
        }
    }

    // user retrieving file(s) via token
    handleTokenSubmit(e) {
        e.preventDefault();
        var token = this.state.tokenInput;
        var self = this;

        validateToken(token).then(function(data){
            if(data == "true") {
                // cache and set session token
                sessionStorage.setItem("sessionToken", token);
                self.props.resetTree();
                self.props.setToken(token);

                // cache and set filenames
                getTreeData(token).then( data => {
                    sessionStorage.setItem("root", JSON.stringify(data));
                    data.forEach(filename => {
                        self.props.addFileToTree(filename);
                    })
                })
            }
            else {
                console.log("TOKEN INVALID");
                //$('#token-num-display').css("opacity", 1);
                alert("Token invalid, please try again");
            }
        });

    }

    handleTokenInput(e) {
        var tokenInput = e.target.value;
        this.setState({tokenInput});
    }



    render() {
        return (
            <div>
                <h2>Upload a File</h2>
                <FileUploadForm />



                <h2>Retrieve Files</h2>
                <div className="well well-lg">
                    <Form style={{align:"top"}} onSubmit={this.handleTokenSubmit} className="form-inline" id="retrieve-file">
                        <FormGroup>
                            <ControlLabel htmlFor="inputToken">Token</ControlLabel>
                            <FormGroup>
                                <FormControl onChange={this.handleTokenInput} className="form-control" id="inputToken" placeholder="token number"/>

                            </FormGroup>
                        </FormGroup>
                        <FormControl type="submit" value="Go"/>

                    </Form>
                </div>
            </div>
        )

    }

}



export default connect(null, { resetTree, addFileToTree, setToken })(Upload);