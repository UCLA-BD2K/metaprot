import React, {Component} from 'react';
import InfoBlock from './InfoBlock';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import Footer from './Footer';
import { Link } from 'react-router-dom';


/**
 * Main content for Analysis page.
 * This Component should be passed in as a Child Component for MainLayout
 */
class Analysis extends Component {

    // Set up InfoBlocks
    componentWillMount() {
        this.infoblocks = [
            {
                preHTML: (
                    <Link to="/metabolite-analysis">
                        <img src="/img/volcano.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Differential Expression Analysis",
                description: "Analyze time-series metabolite data and generate high quality volcano plots to visualize inherent trends."
            },
            /*{
                preHTML: (
                    <Link to="temporal-pattern-recognition">
                        <img src="/img/pattern.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Clustering",
                description: "Analyze temporal patterns and visualize clusters based on these trends."
            },*/
            {
                preHTML: (
                    <Link to="pattern">
                        <img src="/img/timeseries.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Pattern Recognition",
                description: "Analyze time-series metabolite data and visualize trends."
            },
            {
                preHTML: (
                    <Link to="#">
                        <img src="/img/association.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Association Study",
                description: "To identify the molecule highly associated with designated phenotypic characteristics"
            },
            {
                preHTML: (
                    <Link to="result-validation">
                        <img src="/img/association.jpg" className="img-responsive img-analysis" />
                    </Link>
                ),
                title: "Result Validation",
                description: "To identify the molecule highly associated with designated phenotypic characteristics"
            }


        ]

    }



    render() {
        return (

            <div>
                <h2>Analysis</h2>

                <div className="placeholders">
                    <div className="row">
                        <InfoBlock data={this.infoblocks[0]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-1 placeholder"/>
                        <InfoBlock data={this.infoblocks[1]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-2 placeholder"/>
                    </div>
                    <div className="row">
                        <InfoBlock data={this.infoblocks[2]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-1 placeholder"/>
                        <InfoBlock data={this.infoblocks[3]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-2 placeholder"/>}
                    </div>
                </div>
            </div>

        )
    }

}

export default Analysis