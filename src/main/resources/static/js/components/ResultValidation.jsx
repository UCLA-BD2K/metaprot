import React, {Component} from 'react';
import FileSelectForm from './FileSelectForm';
import { connect } from 'react-redux';
import api from '../util/api';

/**
 * Main content for Result Validation page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class ResultValidation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filename: this.props.filenames ? this.props.filenames[0] : "",
            progressTextHTML: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        this.setState({progressTextHTML: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'})

        // request new token for analysis task
        api.getToken()
        // execute R scripts on the server
        .then( token => {
            var formData = new FormData();
            var s3Key = "user-input/" + this.props.token + "/" + this.state.filename;

            formData.append("objectKey", s3Key);
            formData.append("taskToken", token);
            return fetch("/analyze/result-validation/" + this.props.token, {
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
            let pathName = encodeURI("usage/Result Validation");
            ga('send', 'pageview', pathName);
            self.setState({progressTextHTML: '<div class="alert alert-success">' + success + '</div>' });
        })
        .catch( error => {
            self.setState({progressTextHTML: '<div class="alert alert-danger">' + error.message + '</div>'});
        })
    }

    handleFile(e) {
        const filename = e.target.value;
        this.setState({ filename });
    }

    render() {
        return (
            <div>
                <h2>Result Validation</h2>
                <h3>Select a .csv file to analyze:</h3>
                <FileSelectForm
                    handleSubmit={this.handleSubmit}
                    handleFile={this.handleFile} />

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


export default connect(mapStateToProps, null)(ResultValidation);