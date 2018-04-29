import React, {Component} from 'react';
import { connect } from 'react-redux';
import InfoBlock from '../components/InfoBlock';
import { Link } from 'react-router-dom';
import { plotUsagePieChart, plotGeoMap, plotTrafficChart } from '../util/GoogleAnalyticsGraphics';
import { storeGoogleAnalyticsReport } from '../actions';

class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            noReport: this.props.report.sessions === 0 ? true : false
        }

        this.renderGraphics = this.renderGraphics.bind(this);
        this.renderInfoBlocks = this.renderInfoBlocks.bind(this);

    }

    // render plots after mounting
    componentDidMount() {
        this._mounted = true;

        // if no cached Google Analytics data, make request
        if (this.state.noReport) {
            fetch("/util/googleAnalyticsReport", { method: "GET" })
                .then( response =>  response.json() )
                .then( reportJson => {
                    // cache data in redux
                    this.props.storeGoogleAnalyticsReport(reportJson);

                    // update Component if still mounted
                    if (this._mounted) {
                        this.setState({ noReport: false });
                    }
                })
        }
        else {
            this.renderGraphics();
        }

    }

    componentWillUnmount() {
        this._mounted = false;
    }

    // render Google Analytics graphics if data has loaded
    componentDidUpdate(prevProps, prevState) {
        if (this.state.noReport == false)
            this.renderGraphics();
    }

    renderGraphics() {
        plotUsagePieChart(this.props.report.toolUsage);
        plotGeoMap(this.props.report.mapData);
        plotTrafficChart(this.props.report.dailySessionData,
            this.props.report.monthlySessionData);

    }

    renderInfoBlocks() {

        // set up InfoBlocks
        var pageviewsPerSession = this.props.report.pageviewsPerSession.toFixed(2);

        var infoblocks = [
            {
                title: "Recent Updates",
                description: "Recent news and updates",
                postHTML: (
                       <div id="homepage-updates">
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
                /**
                 * Google Analytics is used to keep track of tool usage. To tally a count
                 * for a particular tool usage, send a Google Analytics pageview hit with
                 * a pathName url of the form: `usage/<Insert name of tool>`. For example:
                 *
                 *      let pathName = encodeURI("usage/Differential Expression Analysis");
                 *      ga('send', 'pageview', pathName);
                 *
                 * when called will increase the tool usage count for 'Differential
                 * Expression Analysis' by one.
                 */
                title: "Feature Use Statistics",
                description: "A full pie chart to show usage statistics of various features in MetProt",
                postHTML: ( <div id="pieChart"></div> )
            },
            {
                title: "Site Usage",
                description: (
                    <div>
                        <p>Google Analytics reports the following data on MetProt:</p>
                        <p>(worldwide usage map shown below):</p>
                    </div>
                ),
                postHTML: (
                    <div>
                        <div style={{maxWidth: "280px", margin: "0 auto"}}>
                            <ul style={{textAlign: "left"}}>
                                <li><em>{ this.props.report.sessions }</em> sessions</li>
                                <li><em>{ pageviewsPerSession }</em> pageviews per session</li>
                                <li><em>{ this.props.report.uniqueVisitors }</em> unique visitors</li>
                                <li><em>{ this.props.report.numCountries }</em> countries represented</li>
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
        if (this.state.noReport) {
            infoblocks[1].postHTML = (<i style={{marginTop:"40px"}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>)
            infoblocks[2].postHTML = (<i style={{marginTop:"40px"}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>)
            infoblocks[3].postHTML = (<i style={{marginTop:"40px"}} className="fa fa-spinner fa-spin fa-3x fa-fw"></i>)
        }

        let classStr = "col-xs-12 col-md-6 placeholder";

        return (
            <div className="row placeholders">
                <div className="row">
                    <InfoBlock data={infoblocks[0]} className={classStr}/>
                    <InfoBlock data={infoblocks[1]} className={classStr}/>
                </div>
                <div className="row">
                    <InfoBlock data={infoblocks[2]} className={classStr}/>
                    <InfoBlock data={infoblocks[3]} className={classStr}/>
                </div>
            </div>
        )
    }

    render() {
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

                { this.renderInfoBlocks() }

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

// for testing
export { Home }