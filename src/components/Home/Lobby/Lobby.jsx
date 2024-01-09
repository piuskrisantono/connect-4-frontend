import React from 'react';
import { sendLobbyMessage } from '../api';
import './Lobby.css';

export default function Lobby(props) {
    const { player: loginPlayer, players } = props

    const battlePlayer = (playerId) => {
        const message = {
            type: 'battle',
            content: playerId
        };

        sendLobbyMessage(JSON.stringify(message));
    }

    return (
        <div className="lobby">
            <h2>Players</h2>
            {players?.map((player, index) => (
                <div key={index}>
                    {player.username}
                    {loginPlayer.id !== player.id && <button onClick={() => battlePlayer(player.id)}>Battle</button>}
                </div>
            ))}
        </div>
    )
};
