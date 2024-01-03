import React, { Component } from 'react';
import './Home.css';
import Lobby from './Lobby';
import { connect, sendMessage, connectToLobby } from './api';
import ChatHistory from './ChatHistory';
import ChatInput from './ChatInput';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: {},
      players: [],
      chatHistory: []
    }
  }

  componentDidMount() {
    const player = JSON.parse(localStorage.getItem('player'));
    this.setState(prevState => ({...prevState, player}))
    connectToLobby(player.id, player.username, (message) => {
      if (message && message.data) {
        const parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case 'players':
            this.setState(prevState => {
              return { ...prevState, players: parsedMessage.players };
            });
            break;
          case 'confirmation':
            alert(JSON.stringify(parsedMessage))
            break;
          default:
        }
      }
    });



    connect((msg) => {
      this.setState(prevState => ({
        ...prevState,
        chatHistory: [...this.state.chatHistory, msg]
      }));
    });
  }

  send(event) {
    if (event.keyCode === 13) {
      sendMessage(event.target.value);
      event.target.value = '';
    }
  }

  render() {
    return (
      <div className="App">
        <Lobby player={this.state.player} players={this.state.players} />
        <ChatHistory chatHistory={this.state.chatHistory} />
        <ChatInput send={this.send} />
      </div>
    )
  }
}

export default Home;
