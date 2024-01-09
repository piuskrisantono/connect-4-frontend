import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Constant from '../../Constant';
import BattleRoom from './BattleRoom/BattleRoom';
import './Home.css';
import Lobby from './Lobby/Lobby';
import { connectToServer, sendMessage } from './api';

export default function Home() {
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [isShowConfirmation, setIsShowConfirmation] = useState(false);
  const [battleConfirmation, setBattleConfirmation] = useState({ playerOne: {} });
  const [isShowBattleRoom, setIsShowBattleRoom] = useState(false);
  const [onGoingBattle, setOnGoingBattle] = useState({});
  const childRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const playerString = localStorage.getItem(Constant.LOCAL_STORAGE_PLAYER);
    if (!playerString) {
      navigate("/")
      return;
    }
    const player = JSON.parse(playerString);
    setPlayer(player);
    connectToServer(player.id, player.username, (message) => {
      if (message && message.data) {
        const parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case 'players':
            setPlayers(parsedMessage.players);
            break;
          case 'confirmation':
            setIsShowConfirmation(true);
            setBattleConfirmation(parsedMessage);
            break;
          case 'accept':
            setIsShowBattleRoom(true);
            setOnGoingBattle(parsedMessage);
            break;
          case 'fill':
            childRef.current.fillBoardFromEnemy(parsedMessage.colIndex);
            break;
          default:
        }
      }
    });
  }, [navigate]);

  const answerBattle = (answer) => {
    const message = {
      type: answer,
      content: battleConfirmation.battleId
    };

    setIsShowConfirmation(false);
    sendMessage(JSON.stringify(message));

    if (answer === 'accept') {
      setIsShowBattleRoom(true);
      setOnGoingBattle({
        battleId: battleConfirmation.battleId,
        battleRoom: {
          playerOne: battleConfirmation.playerOne,
          playerTwo: player
        }
      });
    }
  }

  const cleanUpBattle = () => {
    setBattleConfirmation({ playerOne: {} });
    setIsShowBattleRoom(false);
    setOnGoingBattle({});
  }

  return (
    <div>
      <Lobby player={player} players={players} />
      {isShowConfirmation && (
        <div>
          {battleConfirmation.playerOne.username} challenges you to a battle!
          <button onClick={() => answerBattle('accept')}>accept</button><button onClick={() => answerBattle('decline')}>decline</button>
        </div>
      )}
      {isShowBattleRoom && <BattleRoom player={player} battleDetail={onGoingBattle} ref={childRef} cleanUpBattle={cleanUpBattle}></BattleRoom>}
    </div>
  )
};
