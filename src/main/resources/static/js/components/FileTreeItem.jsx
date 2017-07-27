import React, {Component} from 'react';
import { connect } from 'react-redux';
import { removeFileFromTree } from '../actions';
import { downloadFileFromS3 } from '../util/upload';
import CsvViewer from './CsvViewer';




class FileTreeItem extends Component {

    handleShowFile(e) {
        e.preventDefault();
        var modalLoading = {
            title: this.props.filename,
            content: (
                <div className="text-center ">
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                </div>
            )
        }

        this.props.setModalData(modalLoading);
        this.props.openModal();
        downloadFileFromS3(this.props.filename)
            .then(data => {
                var modalData = {
                    title: this.props.filename,
                    content: (<CsvViewer data={data}/>)
                }
                this.props.setModalData(modalData);
                this.props.openModal();
            })
            .catch( err => {
                alert(err);
                throw new Error(err);
            });

    }

    handleDeleteFile(e) {
        e.preventDefault();
        this.props.removeFileFromTree(this.props.filename);
    }

    render() {
        return (
            <div className="file-tree-item row"
                onClick={this.handleShowFile.bind(this)}>
                <div className="col-sm-9">
                    <p>{this.props.filename}</p>
                </div>
                <div className="col-sm-2">
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