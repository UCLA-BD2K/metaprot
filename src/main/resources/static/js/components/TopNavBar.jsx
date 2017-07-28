import React, {Component} from 'react';
import { Link } from 'react-router-dom';


class TopNavBar extends Component {

    constructor(props) {
        super(props);
        this.sideNavBarItems = [
            { name: "Upload Data", path: "/upload" },
            { name: "Preprocessing", path: "/upload-pass" },
            { name: "Analysis", path: "/analysis" },
            { name: "Annotation", path: "#" },
            { name: "Integration", path: "#" },
            { name: "Summary", path: "#" },
        ];
    }

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">

                        <Link to="/upload">
                            <img src="/img/icon11.png" id="navbar-logo" />
                        </Link>
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            {
                                this.props.hasSideNavBar ?
                                    this.sideNavBarItems.map( (item, i) => {
                                        return (
                                            <li key={i}>
                                                <Link className="hidden-md hidden-lg" to={item.path}>
                                                    {item.name}
                                                </Link>
                                            </li>
                                        )
                                    }) : null
                            }
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

        )

    }

}

export default TopNavBar