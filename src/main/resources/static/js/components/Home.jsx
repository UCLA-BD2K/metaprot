import React, {Component} from 'react';
import InfoBlock from './InfoBlock'

class Home extends Component {

    // grab thymeleaf variables
    componentWillMount() {
        this.siteUsageDescr = SITE_USAGE_DESCR;
        this.pageViews = PAGE_VIEWS;
        this.pageViewsPerVisit = PAGE_VIEWS_PER_VISIT;
        this.uniqueVisitors = UNIQUE_VISITORS;
        this.numCountries = NUM_COUNTRIES;
        this.mapData = MAP_DATA;
        this.dailyVisitsCounts = DAILY_VISITS_COUNTS;
        this.monthlyVisitsCounts = MONTHLY_VISITS_COUNTS;
    }

    // render plots after mounting
    componentDidMount() {
        plotUsagePieChart();
        plotGeoMap(this.mapData);
        plotTrafficChart(this.dailyVisitsCounts, this.monthlyVisitsCounts);
    }


    render() {
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
                        <p>{this.siteUsageDescr}</p>
                        <p>(worldwide usage map shown below):</p>
                    </div>
                ),
                postHTML: (
                    <div>
                        <div style={{maxWidth: 220, margin: "0 auto"}}>
                            <ul style={{textAlign: "left"}}>
                                <li><em>{this.pageViews}</em> pageviews</li>
                                <li><em>{this.pageViewsPerVisit}</em> pageviews per visit</li>
                                <li><em>{this.uniqueVisitors}</em> unique visitors</li>
                                <li><em>{this.numCountries}</em> countries represented</li>
                            </ul>
                        </div>
                        <div id="regions-chart" className="drop-shadow"></div>
                    </div>
                )
            },
            {
                title: "Usage Trends",
                description: (<p id="usage-trends-title">Views per Day</p>),
                postHTML: (
                    <div>
                        <div id="usage-trends-chart" className="drop-shadow"></div>
                        <button id="chart-toggle-view">View monthly totals</button>
                    </div>
                )
            }


        ]

    console.log(infoblocks);
        return (
            <div className="row">
                <div className="col-xs-12 col-md-12 main">
                    <div className="row placeholders">
                    {
                         infoblocks.map((infoblock, i) => {
                            return <InfoBlock key={"infoblock-"+i} data={infoblock} className="col-xs-12 col-md-6 placeholder"/>
                         })
                    }
                    </div>
                </div>
            </div>
        )
    }

}

export default Home