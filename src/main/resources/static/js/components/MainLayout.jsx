import React, {Component} from 'react';
import { BrowserRouter, Route, Link, Switch, Redirect} from 'react-router-dom';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import FileUploadForm from './FileUploadForm';
import FileTree from './FileTree';
import Footer from './Footer';
import { connect } from 'react-redux';
import { Form, FormGroup, FormControl, ControlLabel, Button, HelpBlock, Modal } from 'react-bootstrap'
import { resetTree, addFileToTree, setToken } from '../actions';
import { validateToken, getTreeData } from '../util/upload';

class MainLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          modalData: {}
        };

        this.openModal = () => {
          this.setState({
            isOpen: true
          });
        };

        this.setModalData = (modalData) => {
            this.setState({ modalData });
        }

        this.hideModal = () => {
          this.setState({
            isOpen: false
          });
        };
    }

    render() {
        return (

            <div>
                <TopNavBar hasSideNavBar/>
                <div className="container-fluid">
                    <div className="row">

                        <SideNavBar/>
                        <div className="col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 main">
                            { this.props.children }
                        </div>

                        <FileTree
                            openModal={this.openModal}
                            setModalData={this.setModalData}/>
                    </div>
                </div>

                <Footer />

                <Modal
                    show={this.state.isOpen}
                    onHide={this.hideModal}
                    dialogClassName="csv-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalData.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { this.state.modalData.content }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}



export default MainLayout;