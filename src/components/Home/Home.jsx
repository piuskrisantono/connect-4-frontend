import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Constant from '../../Constant';
import BattleRoom from './BattleRoom/BattleRoom';
import './Home.css';
import Lobby from './Lobby/Lobby';
import { connectToServer, sendMessage } from './api';
import Countdown from './Countdown/Countdown';

export default function Home() {
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [battleConfirmation, setBattleConfirmation] = useState(null);
  const [onGoingBattle, setOnGoingBattle] = useState(null);
  const [isWaitingForBattle, setIsWaitingForBattle] = useState(false);
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
    connectToServer(player.id, player.username,
      (message) => {
        if (message && message.data) {
          const parsedMessage = JSON.parse(message.data);
          switch (parsedMessage.type) {
            case 'players':
              setPlayers(parsedMessage.players);
              break;
            case 'confirmation':
              setBattleConfirmation(parsedMessage);
              break;
            case 'accept':
              setIsWaitingForBattle(false);
              setOnGoingBattle(parsedMessage);
              break;
            case 'decline':
              setIsWaitingForBattle(false);
              alert('Enemy didn\'t accept the battle')
              break;
            case 'fill':
              childRef.current.fillBoardFromEnemy(parsedMessage.colIndex);
              break;
            case 'disconnect':
              cleanUpBattle();
              alert(parsedMessage.player.username + ' has disconnected. Match is cancelled :(');
              break;
            default:
          }
        }
      },
      () => {
        cleanUpBattle();
        alert('You have been disconnected (Network error)');
      }
    );
  }, [navigate]);

  const answerBattle = (answer) => {
    const message = {
      type: answer,
      content: battleConfirmation.battleId
    };

    setBattleConfirmation(null);
    sendMessage(JSON.stringify(message));

    if (answer === 'accept') {
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
    setIsWaitingForBattle(false);
    setBattleConfirmation(null);
    setOnGoingBattle(null);
  }

  return (
    <div>
      {isWaitingForBattle ? 'Waiting answer from enemy...' : <Lobby player={player} players={players} onInviteBattle={() => {setIsWaitingForBattle(true);}} isOnBattle={onGoingBattle !== null} />}
      {battleConfirmation && (
        <div>
          {battleConfirmation.playerOne.username} challenges you to a battle!
          <button onClick={() => answerBattle('accept')}>accept</button><button onClick={() => answerBattle('decline')}>decline</button>
          <Countdown second="10" onOver={() => answerBattle('decline')}></Countdown>
        </div>
      )}
      {onGoingBattle && <BattleRoom player={player} battleDetail={onGoingBattle} ref={childRef} cleanUpBattle={cleanUpBattle}></BattleRoom>}
    </div>
  )
};
