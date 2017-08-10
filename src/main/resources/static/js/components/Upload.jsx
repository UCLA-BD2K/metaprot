import React, {Component} from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import FileUploadForm from './FileUploadForm';
import FileTree from './FileTree';
import Footer from './Footer';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap'
import { resetTree, addFileToTree, setToken } from '../actions';
import { validateToken, getTreeData } from '../util/helper';

/**
 * Main content for Upload page.
 * This Component should be passed in as a Child Component for MainLayout
 */
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

    componentDidMount() {
        if (this.props.linkedToken) {
            this.setState({tokenInput: this.props.linkedToken}, ()=>{this.handleTokenSubmit()})
        }
    }

    // user retrieving file(s) via token
    handleTokenSubmit(e) {
        if (e)
            e.preventDefault();
        var token = this.state.tokenInput;
        var self = this;

        validateToken(token).then( response => {
            if(response == "true") {

                self.props.resetTree();
                self.props.setToken(token);

                getTreeData(token).then( data => {
                        data.forEach(filename => {
                            self.props.addFileToTree(filename);
                        })
                    })
                    .catch( err => {
                        alert("There was an issue validating the token. Please try again.");
                    });
            }
            else {
                alert("Token invalid, please try again");
            }
        });

    }

    handleTokenInput(e) {
        var tokenInput = e.target.value;
        this.setState({ tokenInput });
    }

    render() {
        return (
            <div>

                <h2>Upload a File</h2>

                <FileUploadForm />

                <h2>Retrieve Files</h2>

                <div className="well well-lg">
                    <Form inline onSubmit={this.handleTokenSubmit} id="retrieve-file">
                        <ControlLabel htmlFor="inputToken">Token</ControlLabel>
                        <FormControl onChange={this.handleTokenInput} id="inputToken" placeholder="token number"/>
                        <FormControl type="submit" value="Go"/>
                    </Form>
                </div>
            </div>
        )
    }

}



export default connect(null, { resetTree, addFileToTree, setToken })(Upload);