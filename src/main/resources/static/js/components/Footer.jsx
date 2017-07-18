import React, {Component} from 'react';


class Footer extends Component {

    render() {
        return (
            <footer >
                <div className="container text-center">
                    <img src="/img/nih_icon_2.svg" style={{width:50}}/>   &copy; 2017  BD2K MetProt is supported by the NIH Big Data to Knowledge award U54 GM114833.
                </div>
            </footer>
        )

    }

}

export default Footer