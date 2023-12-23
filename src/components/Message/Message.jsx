import React, { Component } from 'react';
import './Message.css';

class Message extends Component {
    constructor(props) {
        super(props);        this.state = {
            message: JSON.parse(this.props.message)
        }
    }

    render() {
        return (
            <div className="message">
                {this.state.message.body}
            </div>
        )
    }
}

export default Message;
