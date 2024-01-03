import React, { Component } from 'react';
import './ChatHistory.css';
import Message from '../Message';

class ChatHistory extends Component {
    render() {
        const messages = this.props.chatHistory.map((message, index) => (<Message key={index} message={message.data} />))

        return (
            <div className="chat-history">
                <h2>Chat History</h2>
                {messages}
            </div>
        )
    }
}

export default ChatHistory;