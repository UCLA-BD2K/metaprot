import React, {Component} from 'react';
import { Link } from 'react-router-dom';


class TopNavBar extends Component {

    render() {
        return (
            <nav className="navbar navbar-inverse navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                    {
                        // show toggle for side Nav Bar if present
                        this.props.hasSideNavBar ?
                        (
                            <button type="button" className="navbar-toggle toggle-left hidden-md hidden-lg" data-toggle="sidebar" data-target=".sidebar-left">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        ) : null

                    }
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
                            <li><Link className="hidden-md hidden-lg" to="/upload">Upload Data</Link></li>
                            <li><Link className="hidden-md hidden-lg" to="/upload-pass">Preprocessing</Link></li>
                            <li><Link className="hidden-md hidden-lg" to="/analysis">Analysis</Link></li>
                            <li><Link className="hidden-md hidden-lg" to="#">Annotation</Link></li>
                            <li><Link className="hidden-md hidden-lg" to="#">Integration</Link></li>
                            <li><Link className="hidden-md hidden-lg" to="#">Summary</Link></li>
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