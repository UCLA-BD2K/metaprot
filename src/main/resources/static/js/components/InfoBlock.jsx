import React, {Component} from 'react';

class InfoBlock extends Component {
    constructor(props) {
        super(props);
        console.log(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.data.preHTML}

                <h4>{this.props.data.title}</h4>
                <span className="text-muted"><p>{this.props.data.description}</p></span>

                {this.props.data.postHTML}

            </div>
        )
    }

}

export default InfoBlock