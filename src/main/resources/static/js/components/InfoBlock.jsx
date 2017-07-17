import React, {Component} from 'react';

class InfoBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.props.data.preHTML}

                <h4>{this.props.data.title}</h4>
                <span className="text-muted">{this.props.data.description}</span>

                {this.props.data.postHTML}

            </div>
        )
    }

}

export default InfoBlock