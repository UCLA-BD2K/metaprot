import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CopyToClipboard from 'react-copy-to-clipboard';
import ShareToken from '../modals/ShareToken';

/* Path and Name information for each tab in Side NavBar */
var tabData = [
    { name: "Upload Data", path: "/upload" },
    { name: "Preprocessing", path: "/upload-pass" },
    { name: "Analysis", path: "/analysis" },
    { name: "Annotation", path: "#" },
    { name: "Integration", path: "#" },
    { name: "Summary", path: "#" },
];

class Tab extends Component {
    render() {
        return (
            <li onClick={this.props.handleClick}
                className={this.props.isActive ? "active" : null}>
                <Link to={this.props.data.path}>{this.props.data.name}</Link>
            </li>
        );
    }
}

class SideNavBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeTab: tabData[0]
        }

        this.openShareTokenModal = this.openShareTokenModal.bind(this);
    }

    handleClick(tab) {
        this.setState({activeTab: tab});
    }

    openShareTokenModal() {
        this.props.setModalData({title: "Share Session Token", className:"", content:(<ShareToken token={this.props.token}/>)});
        this.props.openModal();
    }

    render() {
        // show Share token button if user has a session token
        var shareBtn = this.props.token === "" ? null : (
            <div id="token-share" onClick={this.openShareTokenModal}>
                <p>Share</p>
            </div>
        );

        return (
             <div className="col-sm-2 sidebar sidebar-left sidebar-animate sidebar-md-show">

                <ul className="nav nav-sidebar">
                {
                    /* Generate tabs for Side Navbar */
                    tabData.map( (tab, i) => {
                        return (
                            <Tab key={i}
                                data={tab}
                                isActive={this.state.activeTab === tab}
                                handleClick={this.handleClick.bind(this, tab)} />
                        );
                    })
                }
                </ul>

                { /* Token information at the bottom of the Side NavBar */ }
                <div id="token_text" >
                    <div>
                        { shareBtn }
                        <p className="navbar-text">Token number</p>
                    </div>

                    <p className="navbar-text" id="token_num">{this.props.token}</p>

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

export default connect(mapStateToProps, null)(SideNavBar);



