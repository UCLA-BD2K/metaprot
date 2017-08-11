import React, {Component} from 'react';
import { connect } from 'react-redux';
import InfoBlock from './InfoBlock';
import TopNavBar from './TopNavBar';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import { plotUsagePieChart, plotGeoMap, plotTrafficChart } from '../util/GoogleAnalyticsGraphics';
import { storeGoogleAnalyticsReport } from '../actions';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            siteUsageDescr: "",
            sessions: 0,
            pageviewsPerSession: 0,
            uniqueVisitors: 0,
            numCountries: 0,
            mapData: [[]],
            dailySessionData: [[]],
            monthlySessionData: [[]],
            loading: this.props.report === null ? true : false
        }

    }

    // render plots after mounting
    componentDidMount() {
        plotUsagePieChart();
        // if no cached Google Analytics data, make request
        if (this.props.report === null) {
            var self = this;
            fetch("/util/googleAnalyticsReport", { method: "GET" })
            .then( response => { return response.json() })
            .then( json => {
                // store data in redux
                this.props.storeGoogleAnalyticsReport(json);
                // update with retrieved data
                json.loading = false;
                self.setState(json);
            })
        }
        else {
            this.setState(this.props.report);
        }

    }

    // render Google Analytics graphics if data has loaded
    componentDidUpdate(prevProps, prevState) {
        if (this.state.loading == false) {
            plotGeoMap(this.state.mapData);
            plotTrafficChart(this.state.dailySessionData, this.state.monthlySessionData);
        }
    }

    render() {
        // set up InfoBlocks
        var siteUsageDescr = this.state.month ? "As of " + this.state.month
            + ", Google Analytics reports the following data on MetaProt:" : null;
        var pageviewsPerSession = this.state.pageviewsPerSession.toFixed(2);
        var infoblocks = [
            {
                title: "Recent Updates",
                description: "Recent news and updates",
                postHTML: (
                       <div id="list" width="305" height="305">
                           <ul className="list-group">
                           {
                               [
                                   "User1(2/2/2017): Google Analytics Integrated for tracking site traffic",
                                   "User1(2/2/2017): Transitioned database from MongoDB to DynamoDB",
                                   "User1(2/2/2017): RJava Implementated",
                                   "User1(2/2/2017): Pattern Recognition Module Implemented",
                                   "User1(2/2/2017): Differential Expression Analysis Module Implemented"
                               ].map((update, i) => {
                                   return (
                                       <li className="list-group-item list-group-item-info" key={"update-" + i}> {update} </li>
                                   )
                               })
                           }
                           </ul>
                       </div>
                )
            },
            {
                title: "Feature Use Statistics",
                description: "A full pie chart to show usage statistics of various features in MetaProt",
                postHTML: ( <div id="pieChart"></div> )
            },
            {
                title: "Site Usage",
                description: (
                    <div>
                        <p>{siteUsageDescr}</p>
                        <p>(worldwide usage map shown below):</p>
                    </div>
                ),
                postHTML: (
                    <div>
                        <div style={{maxWidth: 220, margin: "0 auto"}}>
                            <ul style={{textAlign: "left"}}>
                                <li><em>{this.state.sessions}</em> sessions</li>
                                <li><em>{pageviewsPerSession}</em> pageviews per session</li>
                                <li><em>{this.state.uniqueVisitors}</em> unique visitors</li>
                                <li><em>{this.state.numCountries}</em> countries represented</li>
                            </ul>
                        </div>
                        <div id="regions-chart" className="drop-shadow"></div>
                    </div>
                )
            },
            {
                title: "Usage Trends",
                description: (<p id="usage-trends-title">Sessions per Day</p>),
                postHTML: (
                    <div>
                        <div id="usage-trends-chart" className="drop-shadow"></div>
                        <button id="chart-toggle-view">View monthly totals</button>
                    </div>
                )
            }
        ];

        // display "Loading..." temporarily as Google Analytics data is being fetched
        if (this.state.loading) {
            infoblocks[2].postHTML = (<div>Loading...</div>)
            infoblocks[3].postHTML = (<div>Loading...</div>)
        }

        return (

            <div>

                <div className="container-fluid">
                    <div className="jumbotron">
                        <h1>MetProt</h1>
                        <p className="lead">A Cloud-based Platform to Analyze, Annotate, and Integrate Metabolomics Datasets with Proteomics Information.</p>
                        <div className="col-sm-12 col-md-12">
                            <div className="btn-border">
                                <Link className="btn btn-lg btn-default" to="/upload">Start Analysis</Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row placeholders">
                {
                     infoblocks.map((infoblock, i) => {
                        return <InfoBlock key={"infoblock-"+i} data={infoblock} className="col-xs-12 col-md-6 placeholder"/>
                     })
                }
                </div>


            </div>
        )
    }

}


function mapStateToProps(state) {
    return {
        report: state.googleAnalyticsReport
    }
}

export default connect(mapStateToProps, { storeGoogleAnalyticsReport })(Home);