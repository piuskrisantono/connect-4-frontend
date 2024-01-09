import React, { Component } from 'react';
import './Lobby.css';
import { sendLobbyMessage } from '../api';

class Lobby extends Component {
    battlePlayer = (playerId) => {
        const message = {
            type: 'battle',
            content: playerId
        };

        sendLobbyMessage(JSON.stringify(message));
    }

    render() {
        return (
            <div className="lobby">
                <h2>Players</h2>
                {this.props.players?.map((player, index) => (
                    <div key={index}>
                        {player.username}
                        {this.props.player.id !== player.id && <button onClick={() => this.battlePlayer(player.id)}>Battle</button>}
                    </div>
                ))}
            </div>
        )
    }
}

export default Lobby;