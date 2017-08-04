import React, {Component} from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock } from 'react-bootstrap'


class Contact extends Component {

    render() {
        return (
            <div className="container-fluid">
                <div className="jumbotron">
                    <h1>MetProt</h1>
                </div>

                <div className="row" style={{marginBottom:"20px"}}>
                    <div className="col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6">
                        <Form>
                            <FormGroup>
                                <ControlLabel>Email address:</ControlLabel>
                                <input type="email" className="form-control"/>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel htmlFor="sel1">Select list:</ControlLabel>
                                <select className="form-control" id="sel1">
                                    <option>General Feedback</option>
                                </select>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Subject:</ControlLabel>
                                <input type="text" className="form-control"/>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel htmlFor="comment">Feedback:</ControlLabel>
                                <textarea className="form-control" rows="5" id="comment"></textarea>
                            </FormGroup>
                            <button type="submit" className="btn btn-default">Submit</button>
                        </Form>
                    </div>
                </div>
            </div>

        )
    }


}

export default Contact;