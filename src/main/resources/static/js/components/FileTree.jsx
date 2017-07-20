import React, {Component} from 'react';
import { connect } from 'react-redux';

class FileTree extends Component {

    constructor(props) {
        super(props);

    }

    render() {
        console.log(this);

        return (
            <div className="col-sm-3 col-md-3" id="sidebar_right">
                <div id="file-tree">
                {
                    this.props.filenames.map((filename, i) => {
                        return (
                            <div key={i} className="file-tree-item">
                                {filename}
                            </div>
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