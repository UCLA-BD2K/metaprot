import React, {Component} from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { connect } from 'react-redux';
import { addFileToTree, setToken } from '../actions';

class FileSelectForm extends Component {

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
        console.log(e);

    }

    updateProgress(state) {
        this.setState(state);
    }

    handleFile(e) {
        console.log(e.target.value);
    }

    render() {

        return (
            <div className="well well-lg">
                <Form id="csv-upload-form" className="form-horizontal"  onSubmit={this.props.handleSubmit} >
                    <fieldset>

                        <ControlLabel htmlFor="fileFormControl">
                            Select file:
                        </ControlLabel>
                        <FormControl id="fileFormControl"
                            componentClass="select" className="form-control"
                            defaultValue="Select an uploaded file..."
                            required onChange={this.props.handleFile}>
                            <option disabled>Select an uploaded file...</option>
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

                        { this.props.moreForms }


                        <FormControl type="submit" value="Submit" className="form-control" />
                        <FormControl type="reset" value="Reset" className="form-control" />

                    </fieldset>
                </Form>

            </div>


        )
    }
}


function mapStateToProps(state) {
    return {
        filenames: state.filenames
    }
}

export default connect(mapStateToProps, { addFileToTree, setToken })(FileSelectForm);