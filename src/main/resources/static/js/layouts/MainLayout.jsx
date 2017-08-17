import React, {Component} from 'react';
import { Modal, Button } from 'react-bootstrap';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';
import FileTree from '../components/FileTree';
import Footer from '../components/Footer';
import { connect } from 'react-redux';
import { addFileToTree } from '../actions';
import { getSessionData } from '../util/helper';

class MainLayout extends Component {

    constructor(props) {
        super(props);
        this.state = {
          isOpen: false,
          modalData: {}
        };


        this.openModal = this.openModal.bind(this);
        this.setModalData = this.setModalData.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        if (this.props.token !== "" && this.props.filenames.length === 0) {
            getSessionData(this.props.token).then( data => {
                data.forEach( filename => this.props.addFileToTree(filename));
            })
        }
    }

    openModal() {
        this.setState({
            isOpen: true
        });
    }

    setModalData(modalData) {
        this.setState({ modalData });
    }

    closeModal() {
        this.setState({
            isOpen: false
        })
    }

    render() {
        return (
            <div>

                <TopNavBar hasSideNavBar/>

                <div className="container-fluid">
                    <div className="row">

                        <SideNavBar
                            openModal={this.openModal}
                            setModalData={this.setModalData}/>

                        <div className="col-sm-8 col-md-offset-2 main">

                            { /* Main content will be placed here */ }
                            { this.props.children }

                            <Footer />

                        </div>

                        <div className="col-sm-4 col-md-2" id="sidebar_right">
                            <FileTree
                                openModal={this.openModal}
                                closeModal={this.closeModal}
                                setModalData={this.setModalData}/>
                        </div>

                    </div>
                </div>

                { /* Modal component to contain CSV viewer for uploaded files */ }
                <Modal
                    show={this.state.isOpen}
                    onHide={this.closeModal}
                    dialogClassName={this.state.modalData.className}>

                    <Modal.Header closeButton>
                        <Modal.Title>{this.state.modalData.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        { this.state.modalData.content }
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={this.closeModal}>Close</Button>
                    </Modal.Footer>

                </Modal>

            </div>
        )
    }

}

function mapStateToProps(state) {
    return {
        token: state.token,
        filenames: state.filenames
    }
}

export default connect(mapStateToProps, { addFileToTree })(MainLayout);