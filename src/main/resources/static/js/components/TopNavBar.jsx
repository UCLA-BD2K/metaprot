import React, {Component} from 'react';
import { Link } from 'react-router-dom';

/**
 * Expected props:
 *      hasSideNavBar - true if Layout contains Side NavBar
 */
class TopNavBar extends Component {

    constructor(props) {
        super(props);
        /**
         * Side NavBar links that will appear here instead,
         * when screen size is too small and NavBars collapse
         */
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

                        { /* MetProt logo, redirects to homepage upon click */ }
                        <a href="/">
                            <img src="/img/icon11.png" id="navbar-logo" />
                        </a>

                        { /* Toggle button to show NavBar items when collapsed on smaller screens */ }
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
                            /**
                             * include Side NavBar's items if Side Navbar is showing
                             * in this page layout
                             */
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
                            { /* show these items regardless of presence of Side Navbar */ }
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