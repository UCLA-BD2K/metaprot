import React, {Component} from 'react';
import { connect } from 'react-redux';
import { removeFileFromTree } from '../actions';
import { downloadFileFromS3 } from '../util/upload';
import CsvViewer from './CsvViewer';




class FileTreeItem extends Component {




    handleShowFile() {
//        downloadFileFromS3()
//            .then(this.props.showModal);
        this.props.openModal();

    }

    render() {
        return (



            <div className="file-tree-item row"
                    onClick={()=> {
                        downloadFileFromS3(this.props.filename)
                            .then(data => {
                                var content = <CsvViewer data={data}/>
                                this.props.openModal(content);
                            })
                        }}>
                <div className="col-sm-9">
                    <p>{this.props.filename}</p>
                </div>
                <div className="col-sm-2">
                    <i className="glyphicon glyphicon-trash"
                        onClick={()=>this.props.removeFileFromTree(this.props.filename)}></i>
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