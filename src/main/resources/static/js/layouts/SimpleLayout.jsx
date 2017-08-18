import React, {Component} from 'react';
import TopNavBar from '../components/TopNavBar';
import Footer from '../components/Footer';

class SimpleLayout extends Component {

    render() {
        return (
            <div>

                <TopNavBar />

                <div className="col-xs-12 main">

                   { /* Main content will be placed here */ }
                   { this.props.children }

                    <Footer />

                </div>

            </div>
        )
    }

}



export default SimpleLayout;