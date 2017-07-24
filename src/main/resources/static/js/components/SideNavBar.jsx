import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';


var tabData = [
    {name: "Upload Data", path: "/upload" },
    {name: "Preprocessing", path: "/upload-pass" },
    {name: "Analysis", path: "/analysis" },
    {name: "Annotation", path: "#" },
    {name: "Integration", path: "#" },
    {name: "Summary", path: "#" },
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
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(tab) {
        this.setState({activeTab: tab});
    }

    render() {
        return (
             <div className="col-sm-3 col-md-2 sidebar sidebar-left sidebar-animate sidebar-md-show">
                <ul className="nav nav-sidebar">
                    {tabData.map(function(tab, i){
                        return (
                            <Tab
                                key={i}
                                data={tab}
                                isActive={this.state.activeTab === tab}
                                handleClick={this.handleClick.bind(this,tab)} />
                        );
                    }.bind(this))}
                </ul>
                <div id="token_text" >
                    <p className="navbar-text">Token number</p>
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



