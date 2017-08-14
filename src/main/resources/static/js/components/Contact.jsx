import React, {Component} from 'react';
import { Form, FormGroup, FormControl, ControlLabel, Button, TextArea } from 'react-bootstrap'


class Contact extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            feedback: "",
            subject: "",
            text: "",
            progressText: null,
            submitting: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        console.log(e.target.value);
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("subject", this.state.subject);
        formData.append("text", this.state.text);

        var self = this;

        // display loading spinner and lock submit button
        self.setState({
            progressText: (<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>),
            submitting: true
        });

        // send POST request to server to submit feedback
        fetch("/util/sendFeedback", {
            method: "POST",
            body: formData
        })
        // process success/failure and unlock submit button
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
            self.setState({
                progressText: (<div className="alert alert-success"> { success } </div>),
                submitting: false
            });
        })
        .catch( error => {
            self.setState({
                progressText: (<div className="alert alert-danger"> { error.message } </div>),
                submitting: false
            });
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="jumbotron">
                    <h1>MetProt</h1>
                </div>

                <div className="row">
                    <div className="col-sm-offset-3 col-sm-6 col-md-offset-3 col-md-6">
                        <Form onSubmit={this.handleSubmit} style={{margin:"30px 0 30px 0"}}>
                            <FormGroup>
                                <ControlLabel>Email address:</ControlLabel>
                                <FormControl type="email" name="email"
                                    onChange={this.handleChange} placeholder="(Optional)"/>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Subject:</ControlLabel>
                                <FormControl type="text" name="subject"
                                    onChange={this.handleChange} placeholder="(Optional)"/>
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>Feedback:</ControlLabel>
                                <FormControl required componentClass="textarea" rows="5" name="text" onChange={this.handleChange}/>
                            </FormGroup>
                            <Button type="submit" disabled={this.submitting}>Submit</Button>
                        </Form>

                        <div className="text-center">
                            { this.state.progressText }
                        </div>
                    </div>

                </div>

            </div>

        )
    }


}

export default Contact;