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
            <div className="row">
            {
                /*
                 * only show if at least one file has been uploaded
                 * (prevent empty colored div from rendering)
                 */
                this.props.filenames.length > 0 ?

                <div id="file-tree" className="col-sm-10 col-sm-offset-1">
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