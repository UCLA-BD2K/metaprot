import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeFileFromTree } from '../actions';
import api from '../util/api';
import CsvViewer from '../modals/CsvViewer';

/**
 * Expected props:
 *      openModal - handler function to open popup Modal
 *      setModalData - handler function to set Modal title and content
 */
class FileTreeItem extends Component {

    handleShowFile(e) {
        e.preventDefault();

        const self = this;

        // open modal and show loading spinner
        const modalLoading = {
            title: self.props.filename,
            className: "csv-modal",
            content: (
                <div className="text-center ">
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                </div>
            )
        }

        this.props.setModalData(modalLoading);
        this.props.openModal();

        // fetch file from S3
        api.downloadFileFromS3(self.props.filename)
            .then(data => {
                // set modal content with CSV table viewer
                const modalData = {
                    title: self.props.filename,
                    className: "csv-modal",
                    content: (<CsvViewer data={data} />)
                }
                self.props.setModalData(modalData);
            })
            .catch( error => {
                // an error occurred (likely when trying to download from S3)
                alert(error.message);
                self.props.closeModal();
            });

    }

    handleDeleteFile(e) {
        e.stopPropagation();
        api.deleteFileFromS3(this.props.filename)
            .then( () => this.props.removeFileFromTree(this.props.filename) )
            .catch( error => {
                alert("ERROR: Could not delete file.\n\n"
                    + error.message + "\n\nPlease try again later.");
            });
    }

    render() {
        return (
            <div className="file-tree-item row"
                onClick={this.handleShowFile.bind(this)}>

                <div className="col-sm-9">
                    <p>{this.props.filename}</p>
                </div>

                <div className="col-sm-3">
                    <i className="glyphicon glyphicon-trash"
                        onClick={this.handleDeleteFile.bind(this)}></i>
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

export default connect(mapStateToProps, { removeFileFromTree })(FileTreeItem);