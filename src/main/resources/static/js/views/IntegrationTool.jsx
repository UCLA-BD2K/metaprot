import React, {Component} from 'react';
import { connect } from 'react-redux';
import api from '../util/api';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'

/**
 * Main content for Integration Tool  page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class IntegrationTool extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filename1: "",
            filename2: "",
            progressTextHTML: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        this.setState({progressTextHTML: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'})

        // request new token for task
        api.getToken()
        // execute R scripts on the server
        .then( token => {
            var formData = new FormData();
            var s3Key = "user-input/" + this.props.token + "/" + this.state.filename1;

            formData.append("objectKey", s3Key);
            formData.append("taskToken", token);
            return fetch("/analyze/integration-tool/" + this.props.token, {
                method: "POST",
                body: formData
            });
        })
        // process success/failure
        .then( response => {
            if (response.ok)
                return response.text();
            else {
                return response.json().then( json => {
                    throw new Error(json.message || response.statusText);
                })
            }
        })
        .then( success => {
            // send pageview hit to Google Analytics to keep track of tool usage
            //let pathName = encodeURI("usage/Result Validation");
            //ga('send', 'pageview', pathName);
            self.setState({progressTextHTML: '<div class="alert alert-success">' + success + '</div>' });
        })
        .catch( error => {
            self.setState({progressTextHTML: '<div class="alert alert-danger">' + error.message + '</div>'});
        })
    }

    handleFile(e) {
        this.setState({ [e.target.name] : e.target.value });
    }

    render() {
        return (
            <div>
                <h2>Integration Tool</h2>
                <h3>Select a .csv file to analyze:</h3>

                <div className="well well-lg">
                    <Form horizontal onSubmit={this.handleSubmit} >


                        <ControlLabel htmlFor="fileFormControl">
                            Select file 1:
                        </ControlLabel>
                        <FormControl id="fileFormControl"
                            componentClass="select"
                            defaultValue=""
                            name="filename1"
                            required onChange={this.handleFile}>
                            <option value="">Select...</option>
                        {
                            this.props.filenames.map( (filename, i) => {
                                return (
                                    <option key={i} value={filename}>
                                        {filename}
                                    </option>
                                )
                            })
                        }
                        </FormControl>

                        <br/>

                        <ControlLabel htmlFor="fileFormControl">
                            Select file 2:
                        </ControlLabel>
                        <FormControl id="fileFormControl"
                            componentClass="select"
                            defaultValue=""
                            name="filename2"
                            required onChange={this.handleFile}>
                            <option value="">Select...</option>
                        {
                            this.props.filenames.map( (filename, i) => {
                                return (
                                    <option key={i} value={filename}>
                                        {filename}
                                    </option>
                                )
                            })
                        }
                        </FormControl>

                        { this.props.moreForms }


                        <br/>

                        <FormControl type="submit" value="Submit" />



                    </Form>

                </div>

                <div dangerouslySetInnerHTML={ { __html: this.state.progressTextHTML } }
                    className="text-center"></div>

            </div>
        )

    }

}

function mapStateToProps(state) {
    return {
        token: state.token,
        filenames: state.filenames
    }
}


export default connect(mapStateToProps, null)(IntegrationTool);