import React, {Component} from 'react';
import { Form, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { fileUploadSubmitHandler } from '../util/helper'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFileToTree, setToken } from '../actions';

// prevent files larger than limit from being uploaded
const FILESIZE_LIMIT = 10485760 ; // 10 MB

class FileUploadForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            $fileInput: [],  // naming convention retained from previous JQuery implementation
            uploadProgress: 0,
            progressText: null,
            uploading: false
        }



        // bind component methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }
    handleSubmit(e) {
        e.preventDefault();
        var filesize = this.state.$fileInput[0].files[0].size;
        if (filesize > FILESIZE_LIMIT) {
            alert("Error: file size exceeds 10 MB limit.");
            return;
        }
        this.setState({ uploading: true });

        // callback helper functions to appropriately set and update Redux store and Component's state
        var callbacks = {
            updateProgress: this.updateProgress,
            addFileToTree: this.props.addFileToTree,
            setToken: this.props.setToken
        }
        // call helper function to upload file to S3
        fileUploadSubmitHandler(this.state.$fileInput, callbacks);
    }

    /*
     * callback helper function to pass to fileUploadSubmitHandler
     * to allow updating Component's progress state.
     */
    updateProgress(state) {
        this.setState(state);
    }

    handleFile(e) {
        var $fileInput = [e.target];
        this.setState({$fileInput});
    }

    handleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(target, name, value);

        this.setState({
            [name]: value
        });
    }

    render() {
        return (
            <div>
                <div className="well well-lg">
                    <Form id="csv-upload-form" className="form-horizontal"  onSubmit={this.handleSubmit} >

                            <ControlLabel htmlFor="fileFormControl">
                                Select file:
                            </ControlLabel>
                            <FormControl id="fileFormControl"
                                type="file" className="form-control" required onChange={this.handleFile} />

                            <br/>

                            <ControlLabel htmlFor="xAxisSelector">
                                What do rows define in the input file?
                            </ControlLabel>
                            <select name="xAxisSelector"
                                onChange={this.handleChange}>
                                <option value="Metabolite">Protein/Metabolite</option>
                                <option value="Time-Series">Time Point Data</option>
                            </select>

                            <br />

                            <ControlLabel htmlFor="yAxisSelector">
                                What do columns define in the input file?
                            </ControlLabel>
                            <select name="yAxisSelector"
                                onChange={this.handleChange}>
                                <option value="Time-Series">Time Point Data</option>
                                <option value="Metabolite">Protein/Metabolite</option>
                            </select>

                            <br />
                            <br />

                            <FormControl type="submit" value="Submit"/>


                    </Form>

                </div>

                {
                    /* Show progress bar while file is being uploaded */
                    this.state.uploading ?

                    <div id="progress-bar-display" className="transition">
                        <h5>Upload Progress</h5>
                        <div className="progress">
                            <div className="progress-bar"
                                style={{width: this.state.uploadProgress + "%"}}
                                role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                                {this.state.uploadProgress}% Complete
                            </div>
                        </div>
                            <div id="progressText" className="text-center">
                                { this.state.progressText }
                            </div>
                        <br />
                    </div>

                    : null

                }
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        filenames: state.filenames
    }
}

export default connect(mapStateToProps, { addFileToTree, setToken })(FileUploadForm);