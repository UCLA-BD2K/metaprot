import React, {Component} from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { fileUploadSubmitHandler } from '../util/upload'
import { connect } from 'react-redux';
import { addFileToTree, setToken } from '../actions';

class FileUploadForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            $fileInput: [],  // naming convention retained from previous JQuery implementation
            uploadProgress: 0,
            progressTextHTML: null
        }



        // bind component methods
        this.handleSubmit = this.handleSubmit.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.handleFile = this.handleFile.bind(this);

    }
    handleSubmit(e) {
        e.preventDefault();
        var callbacks = {
            updateProgress: this.updateProgress,
            addFileToTree: this.props.addFileToTree,
            setToken: this.props.setToken
        }
        fileUploadSubmitHandler(this.state.$fileInput, callbacks);
        // e.target equiv to $fileinput

    }

    updateProgress(state) {
        this.setState(state);
    }

    handleFile(e) {
        var $fileInput = [e.target];
        this.setState({$fileInput});
    }

    render() {

        return (
            <div>
                <div className="well well-lg">
                    <Form id="csv-upload-form" className="form-horizontal"  onSubmit={this.handleSubmit} >
                        <fieldset>

                            <ControlLabel htmlFor="fileFormControl">
                                Select file:
                            </ControlLabel>
                            <FormControl id="fileFormControl"
                                type="file" className="form-control" required onChange={this.handleFile} />

                            <br/>

                            <ControlLabel htmlFor="xAxisSelector">
                                What do rows define in the input file?
                            </ControlLabel>
                            <select id="xAxisSelector" >
                                <option value="Metabolite">Protein/Metabolite</option>
                                <option value="Time-Series">Time Point Data</option>
                            </select>

                            <br />

                            <ControlLabel htmlFor="yAxisSelector">
                                What do columns define in the input file?
                            </ControlLabel>
                            <select id="yAxisSelector">
                                <option value="Time-Series">Time Point Data</option>
                                <option value="Metabolite">Protein/Metabolite</option>
                            </select>

                            <br />
                            <br />

                            <FormControl type="submit" value="Submit" className="form-control" />
                            <FormControl type="reset" value="Reset" className="form-control" />

                        </fieldset>
                    </Form>

                </div>

                <div id="progress-bar-display" className="transition">
                    <h5>Upload Progress</h5>
                    <div className="progress">
                        <div className="progress-bar"
                            style={{width: this.state.uploadProgress + "%"}}
                            role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                            {this.state.uploadProgress}% Complete
                        </div>
                    </div>
                        <div dangerouslySetInnerHTML={ { __html: this.state.progressTextHTML } }
                            id="progressText" className="text-center"></div>
                    <br />
                </div>
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