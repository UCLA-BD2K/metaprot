import React, {Component} from 'react';
import FileSelectForm from '../components/FileSelectForm';
import { connect } from 'react-redux';
import api from '../util/api';
import { FormControl, ControlLabel } from 'react-bootstrap'

/**
 * Main content for Dynamic Time Warping page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class DynamicTimeWarping extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filename: this.props.filenames ? this.props.filenames[0] : "",
            progressTextHTML: null,
            minCluster: 2,
            maxCluster: 20
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
            console.log("s3Key", s3Key);
            formData.append("objectKey", s3Key);
            formData.append("taskToken", token);
            formData.append("minCluster", this.state.minCluster);
            formData.append("maxCluster", this.state.maxCluster);

            return fetch("/analyze/dtw-elbow/" + this.props.token, {
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
            let pathName = encodeURI("usage/Dynamic Time Warping");
            //ga('send', 'pageview', pathName);
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

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // Additional form components to pass into FileSelectForm
    renderMoreForms() {
        return (
            <div>
                <ControlLabel htmlFor="minCluster">
                    Min. clusters:
                </ControlLabel>
                <FormControl type="text"
                    className="form-control" placeholder="Minimum: 2"
                    id="minCluster" name="minCluster"
                    onChange={this.handleChange}/>

                <br/>

                <ControlLabel htmlFor="maxCluster">
                    Max. clusters:
                </ControlLabel>
                <FormControl type="text"
                    className="form-control" placeholder="Maximum: 100"
                    id="maxCluster" name="maxCluster"
                    onChange={this.handleChange}/>

                <br/>
            </div>
        )
    }


    render() {
        return (
            <div>
                <h2>Dynamic Time Warping Cluster</h2>
                <h3>Select a .csv file to analyze:</h3>
                <FileSelectForm
                    moreForms={this.renderMoreForms()}
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


export default connect(mapStateToProps, null)(DynamicTimeWarping);