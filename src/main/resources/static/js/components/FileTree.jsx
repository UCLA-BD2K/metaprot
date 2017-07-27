import React, {Component} from 'react';
import { connect } from 'react-redux';
import FileTreeItem from './FileTreeItem';

class FileTree extends Component {



    render() {

        return (
            <div>

            <div className="col-sm-2" id="sidebar_right">
            {
                // only show if at least one file has been uploaded
                // (prevent empty colored div from rendering)
                this.props.filenames.length > 0 ?

                <div id="file-tree" className="col-sm-12">
                {
                    this.props.filenames.map((filename, i) => {
                        return (
                            <FileTreeItem
                                openModal={this.props.openModal}
                                setModalData={this.props.setModalData}
                                key={i} filename={filename}/>
                        )
                    })
                }
                </div>

                : null
            }
            </div>
            </div>

        )
    }
}

function mapStateToProps(state) {
    return {
        filenames: state.filenames
    }
}

export default connect(mapStateToProps, null)(FileTree);