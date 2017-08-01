import React, {Component} from 'react';
import { connect } from 'react-redux';
import FileTreeItem from './FileTreeItem';

/**
 * Expected props:
 *      openModal - handler function to open popup Modal
 *      setModalData - handler function to set Modal title and content
 */
class FileTree extends Component {

    render() {

        return (
            <div className="col-sm-4 col-md-2" id="sidebar_right">
            {
                /* only show if at least one file has been uploaded
                 * (prevent empty colored div from rendering)
                 */
                this.props.filenames.length > 0 ?

                <div id="file-tree" className="row">
                {
                    /* For every file associated with this session, generate
                     * a row in the File Tree to allow users to delete and/or view
                     * data
                     */
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

        )
    }
}

function mapStateToProps(state) {
    return {
        filenames: state.filenames
    }
}

export default connect(mapStateToProps, null)(FileTree);