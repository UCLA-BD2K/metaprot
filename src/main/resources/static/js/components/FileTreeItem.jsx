import React, {Component} from 'react';
import { connect } from 'react-redux';
import { removeFileFromTree } from '../actions';
import { updateSessionData } from '../util/upload';

class FileTreeItem extends Component {

    handleRemoveFile() {
        removeFileFromTree(this.props.filename);

    }
    render() {
        return (
            <div className="file-tree-item row">
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