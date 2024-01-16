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
        <div className="lobby-container">
            <h2>Lobby</h2>
            <div className='lobby-list'>
                <div className='lobby-list-item'>
                    <span>{loginPlayer.username}</span>
                    <span>{'('}You{')'}</span>
                </div>
                {players?.map((player, index) => {
                    if (loginPlayer.id !== player.id) {
                        return (
                            <div className='lobby-list-item' key={index}>
                                <span>{player.username}</span>
                                {!isOnBattle && <button onClick={() => battlePlayer(player.id)}>battle</button>}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </div>
    )
};
