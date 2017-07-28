import React, {Component} from 'react';
import FileSelectForm from './FileSelectForm';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormControl, ControlLabel, FormGroup, Radio, Checkbox, InputGroup} from 'react-bootstrap'
import { getToken } from '../util/upload';

/**
 * Main content for Preprocessing page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class ProcessFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            numClusters: 0,
            memPerCluster: 0,
            filename: "",
            progressTextHTML: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleNumClusters = this.handleNumClusters.bind(this);
        this.handleMemPerCluster = this.handleMemPerCluster.bind(this);

        // Additional form components to pass into FileSelectForm
        this.moreForms = (
            <div>
                <h3>Handle Missing Values</h3>
                <div >
                    <Checkbox onChange={e=>console.log(e.target.value)}>Remove features with too many missing values:</Checkbox>
                    <InputGroup className="col-xs-4 col-sm-3 col-lg-2">
                        <FormControl id="remove-threshold" type="text" defaultValue="50" bsSize="sm" />
                        <InputGroup.Addon>%</InputGroup.Addon>
                    </InputGroup>

                    <br/>

                    <ControlLabel htmlFor="missingValues">Estimate remaining missing values:</ControlLabel>
                    <FormControl
                        id="missingValues"
                        componentClass="select" className="form-control">

                        <option value="replace">Replace by a small value (half of the minimum positive value in the original data)</option>
                        <option value="exclude">Exclude variables with missing values</option>

                    </FormControl>
                </div>

                <br/>

                <div onChange={e=>console.log(e.target.value)}>
                    <h3>Normalization</h3>
                    <Radio name="norm-by" value="none" defaultChecked>None</Radio>
                    <Radio name="norm-by" value="sum">Normalization by sum</Radio>
                    <Radio name="norm-by" value="median">Normalization by median</Radio>
                    <Radio name="norm-by" value="srs">Norm. by specific reference sample</Radio>
                    <Radio name="norm-by" value="rf">Norm. by reference feature</Radio>
                </div>

                <br/>

                <div onChange={e=>console.log(e.target.value)}>
                    <h4>Data transformation:</h4>
                    <Radio name="trans" value="none" defaultChecked>None</Radio>
                    <Radio name="trans" value="log-trans">Log transformation</Radio>
                    <Radio name="trans" value="cube-root-trans">Cube root transformation</Radio>
                </div>

                <br/>

                <div onChange={e=>console.log(e.target.value)}>
                    <h4>Data scaling:</h4>
                    <Radio name="scaling" value="none" defaultChecked>None</Radio>
                    <Radio name="scaling" value="mean-centered">Mean centering</Radio>
                    <Radio name="scaling" value="pareto">Pareto scaling</Radio>

                </div>

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
            var s3Key = "user-FormControl/" + this.props.token + "/" + this.state.filename;
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
                <h2>Pre-processing</h2>
                <h3>Select a .csv file to process:</h3>

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
        token: state.token
    }
}

export default connect(mapStateToProps, null)(ProcessFile);