import React, {Component} from 'react';
import { Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';


class ShareToken extends Component {

    constructor(props) {
        super(props);
        this.state = {
            progressText: null,
            submitting: false,
            email: ""
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        var formData = new FormData();
        formData.append("email", this.state.email);
        formData.append("token", this.props.token);

        var self = this;

        // display loading spinner and lock submit button
        self.setState({
            progressText: (<i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>),
            submitting: true
        });

        // send POST request to server to submit feedback
        fetch("/util/shareToken", {
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
            <div>
                <h5>Enter your own email to receive a copy of your session token, or enter another's email to share your token.</h5>
                <Form onSubmit={this.handleSubmit} style={{margin:"30px 0 30px 0"}}>
                    <FormGroup>
                        <ControlLabel>Email address:</ControlLabel>
                        <FormControl type="email" name="email" onChange={this.handleChange}/>
                    </FormGroup>
                    <Button type="submit" disabled={this.state.submitting}>Submit</Button>
                </Form>

                <div className="text-center">
                    { this.state.progressText }
                </div>
            </div>
        )
    }
}

export default ShareToken