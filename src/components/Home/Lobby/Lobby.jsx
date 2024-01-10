import React from 'react';
import { sendMessage } from '../api';
import './Lobby.css';

export default function Lobby(props) {
    const { player: loginPlayer, players, onInviteBattle, isOnBattle } = props

    const battlePlayer = (playerId) => {
        const message = {
            type: 'battle',
            content: playerId
        };
        sendMessage(JSON.stringify(message));
        onInviteBattle();
    }

    return (
        <div className="lobby">
            <h2>Players</h2>
            {players?.map((player, index) => (
                <div key={index}>
                    {player.username}
                    {loginPlayer.id !== player.id && !isOnBattle && <button onClick={() => battlePlayer(player.id)}>Battle</button>}
                </div>
            ))}
        </div>
    )
};
