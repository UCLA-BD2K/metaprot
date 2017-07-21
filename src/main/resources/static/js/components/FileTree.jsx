import React, {Component} from 'react';
import { connect } from 'react-redux';
import FileTreeItem from './FileTreeItem';

class FileTree extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        console.log(this);

        return (
            <div className="col-sm-3" id="sidebar_right">
                <div id="file-tree" className="col-sm-12 col-lg-10 col-lg-offset-1">
                {
                    this.props.filenames.map((filename, i) => {
                        return (
                            <FileTreeItem key={i} filename={filename}/>
                        )
                    })
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