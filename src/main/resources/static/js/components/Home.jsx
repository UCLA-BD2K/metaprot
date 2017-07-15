import React, {Component} from 'react';
import InfoBlock from './InfoBlock'

class Home extends Component {


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