import React, {Component} from 'react';
import InfoBlock from './InfoBlock';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import Footer from './Footer';
import { Link } from 'react-router-dom';

class Analysis extends Component {

    // Set up InfoBlocks
    componentWillMount() {
        this.infoblocks = [
            {
                preHTML: (
                    <a href="metabolite-analysis">
                        <img src="/img/volcano.jpg" className="img-responsive img-analysis" />
                    </a>
                ),
                title: "Differential Expression Analysis",
                description: "Analyze time-series metabolite data and generate high quality volcano plots to visualize inherent trends."
            },
            {
                preHTML: (
                    <a href="temporal-pattern-recognition">
                        <img src="/img/pattern.jpg" className="img-responsive img-analysis" />
                    </a>
                ),
                title: "Pattern Recognition",
                description: "Analyze temporal patterns and visualize clusters based on these trends."
            },
            {
                preHTML: (
                    <a href="time-series-viewer">
                        <img src="/img/pattern.jpg" className="img-responsive img-analysis" />
                    </a>
                ),
                title: "Time Series Analysis",
                description: "Analyze time series data and visualize trends."
            },
            {
                preHTML: (
                    <a href="#">
                        <img src="/img/association.jpg" className="img-responsive img-analysis" />
                    </a>
                ),
                title: "Association Study",
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
                        <InfoBlock data={this.infoblocks[3]} className="col-xs-10 col-xs-offset-1 col-sm-4 col-sm-offset-2 placeholder"/>
                    </div>
                </div>
            </div>

        )
    }

}

export default Analysis