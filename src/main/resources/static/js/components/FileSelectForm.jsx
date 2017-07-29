import React, {Component} from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap'
import { connect } from 'react-redux';
import { addFileToTree, setToken } from '../actions';

/**
 * Expected props:
 *      handleSubmit - handler function for submitting form
 *      handleFile - handler function for file selected
 *      moreForms - Additional HTML and Form components to append to end of this form
 */
class FileSelectForm extends Component {

    render() {

        return (
            <div className="well well-lg">
                <Form horizontal onSubmit={this.props.handleSubmit} >


                    <ControlLabel htmlFor="fileFormControl">
                        Select file:
                    </ControlLabel>
                    <FormControl id="fileFormControl"
                        componentClass="select"
                        required onChange={this.props.handleFile}>
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


                    <FormControl type="submit" value="Submit" />


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