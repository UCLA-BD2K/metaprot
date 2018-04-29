import React, {Component} from 'react';
import InfoBlock from '../components/InfoBlock';
import TopNavBar from '../components/TopNavBar';
import SideNavBar from '../components/SideNavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';


/**
 * Main content for Integration page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class Integration extends Component {

    // Set up InfoBlocks
    componentWillMount() {
        this.infoblocks = [
            {
                preHTML: (
                    <Link to="/integration-tool">
                        <img src="/img/volcano.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Integration Tool",
                description: "Analyze and observe protein and metabolite interaction."
            },
            {
                preHTML: (
                    <Link to="/dtw-cluster">
                        <img src="/img/dtw2.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Dynamic Time Warping Cluster",
                description: "Cluster metabolites based on values at different timepoints."
            }

        ]

    }



    render() {
        return (

            <div>
                <h2>Integration</h2>

                <div className="placeholders">
                    <div className="row">
                        <InfoBlock data={this.infoblocks[0]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-1 placeholder"/>
                        <InfoBlock data={this.infoblocks[1]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-2 placeholder"/>
                    </div>
                </div>
            </div>

        )
    }

}

export default Integration