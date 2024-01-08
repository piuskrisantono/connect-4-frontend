import React, { Component } from 'react';
import BattleRoom from './BattleRoom/BattleRoom';
import './Home.css';
import Lobby from './Lobby';
import { connectToLobby, sendLobbyMessage } from './api';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: {},
      players: [],
      chatHistory: [],
      isShowConfirmation: false,
      battleInfo: { playerOne: {} },
      isShowBattleRoom: false,
      otherPlayerNewCellIndex: null,
      onGoingBattle: {}
    }
  }

  childRef = React.createRef();

  componentDidMount() {
    const player = JSON.parse(localStorage.getItem('player'));
    this.setState(prevState => ({ ...prevState, player }))
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
            console.log('yus', parsedMessage)
            this.setState(prevState => ({
              ...prevState, isShowConfirmation: true, battleInfo: parsedMessage
            }));
            break;
          case 'accept':
            console.log('kiw', parsedMessage)
            this.setState(prevState => ({
              ...prevState, isShowBattleRoom: true,
              onGoingBattle: parsedMessage
            }));
            break;
          case 'fill':
            // this.setState(prevState => ({
            //   ...prevState, otherPlayerNewCellIndex: parsedMessage.colIndex
            // }));
            this.childRef.current.fillBoardFromEnemy(parsedMessage.colIndex);
            break;
          default:
        }
      }
    });
  }

  answerBattle = (answer) => {
    const { battleInfo } = this.state;
    const message = {
      type: answer,
      battleId: battleInfo.battleId
    };

    this.setState(prevState => ({
      ...prevState,
      isShowConfirmation: false,
      isShowBattleRoom: true,
      onGoingBattle: {
        battleId: battleInfo.battleId,
        battleRoom: {
          playerOne: battleInfo.playerOne,
          playerTwo: JSON.parse(localStorage.getItem('player'))
        }
      }
    }));

    sendLobbyMessage(JSON.stringify(message));
  }

  cleanUpBattle = () => {
    this.setState(prevState => ({
      ...prevState,
      battleInfo: { playerOne: {} },
      isShowBattleRoom: false,
      otherPlayerNewCellIndex: null,
      onGoingBattle: {}
    }));
  }

  render() {
    return (
      <div className="App">
        <Lobby player={this.state.player} players={this.state.players} />
        {this.state.isShowConfirmation && (
          <div>
            {this.state.battleInfo.playerOne.username} challenges you to a battle!
            <button onClick={() => this.answerBattle('accept')}>accept</button><button onClick={() => this.answerBattle('decline')}>decline</button>
          </div>
        )}
        {this.state.isShowBattleRoom && <BattleRoom battleInfo={this.state.onGoingBattle} ref={this.childRef} cleanUpBattle={this.cleanUpBattle}></BattleRoom>}
      </div>
    )
  }
}

export default Home;
