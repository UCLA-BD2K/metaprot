import React, {Component} from 'react';
import FileSelectForm from './FileSelectForm';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormControl, ControlLabel } from 'react-bootstrap'
import api from '../util/api';

/**
 * Main content for Metabolite Analysis page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class MetaboliteAnalysis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pThreshold: 0.1,
            fcThreshold: 1.5,
            filename: "",
            progressTextHTML: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    // handler function to pass to into FileSelectForm
    handleSubmit(e) {
        e.preventDefault();

        const self = this;

        self.setState({progressTextHTML: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'})

        // request new token for analysis task
        api.getToken()
        // execute R scripts on the server
        .then( token => {

            var formData = new FormData();
            var s3Key = "user-input/" + this.props.token + "/" + this.state.filename;
            formData.append("pThreshold", this.state.pThreshold);
            formData.append("fcThreshold", this.state.fcThreshold);
            formData.append("objectKey", s3Key);
            formData.append("taskToken", token);

            return fetch("/analyze/metabolites/" + this.props.token, {
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
            let pathName = encodeURI("usage/Differential Expression Analysis");
            ga('send', 'pageview', pathName);
            self.setState({progressTextHTML: '<div class="alert alert-success">' + success + '</div>' });
        })
        .catch( error => {
            self.setState({progressTextHTML: '<div class="alert alert-danger">' + error.message + '</div>'});
        })
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Additional form components to pass into FileSelectForm
    renderMoreForms() {
        return (
            <div>
                <ControlLabel htmlFor="pThreshold">
                    Enter a P value threhshold:
                </ControlLabel>
                <FormControl type="text"
                    className="form-control" placeholder="Default: 0.1"
                    id="pThreshold" name="pThreshold"
                    onChange={this.handleChange}/>

                <br/>

                <ControlLabel htmlFor="fcThreshold">
                    Enter a fold change threshold:
                </ControlLabel>
                <FormControl type="text"
                    className="form-control" placeholder="Default: 1.5"
                    id="fcThreshold" name="fcThreshold"
                    onChange={this.handleChange}/>

                <br/>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Metabolite Analysis</h2>
                <h3>Select a .csv file to analyze:</h3>
                <FileSelectForm
                    moreForms={this.renderMoreForms()}
                    handleSubmit={this.handleSubmit}
                    handleFile={this.handleChange} />

                <div dangerouslySetInnerHTML={ { __html: this.state.progressTextHTML } }
                    className="text-center">
                </div>

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


export default connect(mapStateToProps, null)(MetaboliteAnalysis);