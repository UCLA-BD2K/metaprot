import React, {Component} from 'react';

/**
 * An Information Block/Tile typically consisting of a title,
 * description, and usually an image before/after
 *
 * Expected props:
 *      className - className to assign to div
 *      data {
 *          preHTML - HTML to be shown above title and description (typically an image)
 *          title - title of InfoBlock
 *          description - description of InfoBlock
 *          postHTML - HTML to be shown below title and description (typically an image)
 *      }
 */
class InfoBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.className}>

                { this.props.data.preHTML }

                <h4>{ this.props.data.title }</h4>
                <div className="infoblock-description text-muted">
                    { this.props.data.description }
                </div>

                { this.props.data.postHTML }

            </div>
        )
    }

}

export default InfoBlock