import React, {Component} from 'react';
import FileSelectForm from '../components/FileSelectForm';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormControl, ControlLabel, FormGroup, Radio, Checkbox, InputGroup} from 'react-bootstrap'
import api from '../util/api';
import { addFileToTree } from '../actions';

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
            progressTextHTML: null,
            submitting: false,
            progressText: null
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderMoreForms = this.renderMoreForms.bind(this);


    }

    // handler function to pass to into FileSelectForm
    handleSubmit(e) {
        e.preventDefault();

        var s3ObjectKey = "user-input/" + this.props.token + "/" + this.state.filename;

        var formData = new FormData();
        formData.append("objectKey", s3ObjectKey);
        formData.append("token", this.props.token);

        // display loading spinner and lock submit button
        this.setState({
            progressText: (<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>),
            submitting: true
        });

        var self = this;

        fetch("/analyze/clean-dataset", {
            method: "POST",
            body: formData
        })
        // process success/failure
        .then( response => {
            if (response.ok)
                return response.json();
            else {
                return response.json().then( json => {
                    throw new Error(json.message || response.statusText);
                });
            }
        })
        .then( json => {
            // update file tree to reflect new processed file added to S3
            self.props.addFileToTree(json.filename);

            self.setState({
                progressText: (<div className="alert alert-success"> { json.message } </div>)
            });
        })
        .catch( error => {
            self.setState({
                progressText: (<div className="alert alert-danger"> { error.message } </div>)
            });
        })
        .then( () => self.setState({ submitting: false }));

    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // handler function to pass to into FileSelectForm
    handleFile(e) {
        var filename = e.target.value;
        this.setState({ filename });
    }

    // Additional form components to pass into FileSelectForm
    renderMoreForms() {
        return (
            <div>
                <h3>Handle Missing Values</h3>
                <div >
                    <Checkbox onChange={this.handleChange} name="removeValues">Remove features with too many missing values:</Checkbox>
                    <InputGroup className="col-xs-4 col-sm-3 col-lg-2">
                        <FormControl onChange={this.handleChange}
                            name="removeThreshold"
                            type="text" defaultValue="50" bsSize="sm"
                            />
                        <InputGroup.Addon>%</InputGroup.Addon>
                    </InputGroup>

                    <br/>

                    <ControlLabel htmlFor="missingValues">Estimate remaining missing values:</ControlLabel>
                    <FormControl
                        name="missingValues"
                        onChange={this.handleChange}
                        componentClass="select" className="form-control">

                        <option value="replace">Replace by a small value (half of the minimum positive value in the original data)</option>
                        <option value="exclude">Exclude variables with missing values</option>

                    </FormControl>
                </div>

                <br/>

                <div>
                    <h3>Normalization</h3>
                    <Radio name="norm" value="none"
                        onClick={this.handleChange} defaultChecked>None</Radio>
                    <Radio name="norm" value="sum"
                        onClick={this.handleChange} >Normalization by sum</Radio>
                    <Radio name="norm" value="median"
                        onClick={this.handleChange} >Normalization by median</Radio>
                    <Radio name="norm" value="srs"
                        onClick={this.handleChange} >Norm. by specific reference sample</Radio>
                    <Radio name="norm" value="rf"
                        onClick={this.handleChange}>Norm. by reference feature</Radio>
                </div>

                <br/>

                <div>
                    <h4>Data transformation:</h4>
                    <Radio name="trans" value="none"
                        onClick={this.handleChange} defaultChecked>None</Radio>
                    <Radio name="trans" value="log-trans"
                        onClick={this.handleChange}>Log transformation</Radio>
                    <Radio name="trans" value="cube-root-trans"
                        onClick={this.handleChange}>Cube root transformation</Radio>
                </div>

                <br/>

                <div>
                    <h4>Data scaling:</h4>
                    <Radio name="scaling" value="none"
                        onClick={this.handleChange} defaultChecked>None</Radio>
                    <Radio name="scaling" value="mean-centered"
                        onClick={this.handleChange}>Mean centering</Radio>
                    <Radio name="scaling" value="pareto"
                        onClick={this.handleChange}>Pareto scaling</Radio>

                </div>

                <br/>

            </div>
        )
    }




    render() {
        return (
            <div>
                <h2>Pre-processing</h2>
                <h3>Select a .csv file to process:</h3>

                <FileSelectForm
                    moreForms={this.renderMoreForms()}
                    handleSubmit={this.handleSubmit}
                    handleFile={this.handleFile} />

                <div className="text-center">
                    { this.state.progressText }
                </div>


            </div>
        )

    }

}

function mapStateToProps(state) {
    return {
        token: state.token
    }
}

export default connect(mapStateToProps, { addFileToTree })(ProcessFile);