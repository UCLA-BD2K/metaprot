import React, {Component} from 'react';
import FileSelectForm from './FileSelectForm';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormControl, ControlLabel } from 'react-bootstrap'
import { getToken } from '../util/upload';

/**
 * Main content for Pattern Recognition Analysis page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class PatternRecogAnalysis extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numClusters: 0,
            memPerCluster: 0,
            filename: this.props.filenames ? this.props.filenames[0] : "",
            progressTextHTML: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleNumClusters = this.handleNumClusters.bind(this);
        this.handleMemPerCluster = this.handleMemPerCluster.bind(this);

        // Additional form components to pass into FileSelectForm
        this.moreForms = (
               <div>
                   <ControlLabel htmlFor="numClusters">
                       Number of desired clusters:
                   </ControlLabel>
                   <FormControl type="text"
                       className="form-control"
                       id="numClusters" name="numClusters"
                       onChange={this.handleNumClusters}
                       required />

                   <br/>

                   <ControlLabel htmlFor="memPerCluster">
                       Enter a fold change threshold:
                   </ControlLabel>
                   <FormControl type="text"
                       className="form-control"
                       id="memPerCluster" name="memPerCluster"
                       onChange={this.handleMemPerCluster}
                       required />

                   <br/>
               </div>
        )

    }


    // handler function to pass to into FileSelectForm
    handleSubmit(e) {
        e.preventDefault();
        var self = this;
        self.setState({progressTextHTML: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i>'})
        // request new token for analysis task
        getToken()
        // execute R scripts on the server
        .then( token => {
            var formData = new FormData();
            var s3Key = "user-input/" + this.props.token + "/" + this.state.filename;
            formData.append("numClusters", this.state.numClusters);
            formData.append("minMembersPerCluster", this.state.memPerCluster);
            formData.append("objectKey", s3Key);
            formData.append("taskToken", token);
            return fetch("/analyze/pattern/" + this.props.token, {
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
            self.setState({progressTextHTML: '<div class="alert alert-success">' + success + '</div>' });
        })
        .catch( error => {
            self.setState({progressTextHTML: '<div class="alert alert-danger">' + error.message + '</div>'});
        })
    }

    // handler function to pass to into FileSelectForm
    handleFile(e) {
        var filename = e.target.value;
        this.setState({ filename });
    }

    handleNumClusters(e) {
        var numClusters = e.target.value;
        this.setState({ numClusters })
    }

    handleMemPerCluster(e) {
        var memPerCluster = e.target.value;
        this.setState({ memPerCluster })
    }


    render() {
        return (
            <div>
                <h2>Temporal Pattern Recognition Analysis</h2>
                <h3>Select a .csv file to analyze:</h3>

                <FileSelectForm
                    moreForms={this.moreForms}
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


export default connect(mapStateToProps, null)(PatternRecogAnalysis);