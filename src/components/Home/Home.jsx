import React, { useEffect, useRef, useState } from 'react';
import Constant from '../../Constant';
import BattleRoom from './BattleRoom/BattleRoom';
import './Home.css';
import Lobby from './Lobby/Lobby';
import { connectToLobby, sendLobbyMessage } from './api';

export default function Home() {
  const [player, setPlayer] = useState({});
  const [players, setPlayers] = useState([]);
  const [isShowConfirmation, setIsShowConfirmation] = useState(false);
  const [battleInfo, setBattleInfo] = useState({ playerOne: {} });
  const [isShowBattleRoom, setIsShowBattleRoom] = useState(false);
  const [otherPlayerNewCellIndex, setOtherPlayerNewCellIndex] = useState(null);
  const [onGoingBattle, setOnGoingBattle] = useState({});
  const childRef = useRef();

  useEffect(() => {
    const playerString = localStorage.getItem(Constant.LOCAL_STORAGE_PLAYER);
    const player = JSON.parse(playerString);
    setPlayer(player);
    connectToLobby(player.id, player.username, (message) => {
      if (message && message.data) {
        const parsedMessage = JSON.parse(message.data);
        switch (parsedMessage.type) {
          case 'players':
            setPlayers(parsedMessage.players);
            break;
          case 'confirmation':
            setIsShowConfirmation(true);
            setBattleInfo(parsedMessage);
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
  }, []);

  const answerBattle = (answer) => {
    const message = {
      type: answer,
      content: battleInfo.battleId
    };

    setIsShowConfirmation(false,);
    setIsShowBattleRoom(true,);
    setOnGoingBattle({
      battleId: battleInfo.battleId,
      battleRoom: {
        playerOne: battleInfo.playerOne,
        playerTwo: player
      }
    });

    sendLobbyMessage(JSON.stringify(message));
  }

  const cleanUpBattle = () => {
    setBattleInfo({ playerOne: {} });
    setIsShowBattleRoom(false);
    setOtherPlayerNewCellIndex(null);
    setOnGoingBattle({});
  }


  return (
    <div className="App">
      <Lobby player={player} players={players} />
      {isShowConfirmation && (
        <div>
          {battleInfo.playerOne.username} challenges you to a battle!
          <button onClick={() => answerBattle('accept')}>accept</button><button onClick={() => answerBattle('decline')}>decline</button>
        </div>
      )}
      {isShowBattleRoom && <BattleRoom battleInfo={onGoingBattle} ref={childRef} cleanUpBattle={cleanUpBattle}></BattleRoom>}
    </div>
  )

};
