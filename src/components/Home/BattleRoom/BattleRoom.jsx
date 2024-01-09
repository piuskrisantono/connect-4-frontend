import React, { useImperativeHandle, useMemo, useState } from "react";
import { sendLobbyMessage } from "../api";

const BattleRoom = React.forwardRef((props, ref) => {
    const { battleInfo, cleanUpBattle } = props;

    const [winner, setWinner] = useState(null);

    useImperativeHandle(ref, () => ({
        fillBoardFromEnemy(otherPlayerNewCellIndex) {
            if (otherPlayerNewCellIndex !== null && otherPlayerNewCellIndex !== undefined) {
                setBoards(prevBoards => {
                    let rowIndex;
                    for (rowIndex = rowSize - 1; rowIndex >= 0; rowIndex--) {
                        if (!prevBoards[rowIndex][otherPlayerNewCellIndex]) {
                            break;
                        }
                    }
                    const playerInTurn = isPlayerOne ? playerTwo : playerOne;
                    prevBoards[rowIndex][otherPlayerNewCellIndex] = (playerInTurn).id;
                    checkWinner(rowIndex, otherPlayerNewCellIndex, playerInTurn);
                    return prevBoards;
                });

                setIsPlayerOneTurn(!isPlayerOneTurn);
            }
        }
    }));

    const rowSize = 6;
    const colSize = 7;

    const [boards, setBoards] = useState(new Array(rowSize).fill(null).map(() => new Array(colSize).fill(null)));

    const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);

    const playerOne = useMemo(() => battleInfo.battleRoom.playerOne, [battleInfo.battleRoom.playerOne]);
    const playerTwo = useMemo(() => battleInfo.battleRoom.playerTwo, [battleInfo.battleRoom.playerTwo]);
    const isPlayerOne = useMemo(() => {
        const player = JSON.parse(localStorage.getItem('player'));
        return player.id === playerOne.id;
    }, [playerOne.id]);

    const playerColorMapping = useMemo(() => ({
        [playerOne.id]: 'green',
        [playerTwo.id]: 'yellow'
    }), [playerOne.id, playerTwo.id]);

    const fillArray = (colIndex) => {
        if ((isPlayerOneTurn && isPlayerOne) || (!isPlayerOneTurn && !isPlayerOne)) {
            let rowIndex;
            for (rowIndex = rowSize - 1; rowIndex >= 0; rowIndex--) {
                if (!boards[rowIndex][colIndex]) {
                    break;
                }
            }
            if (rowIndex < 0) {
                alert('This column is already full!')
                return;
            } else {
                const playerInTurn = isPlayerOne ? playerOne : playerTwo;
                boards[rowIndex][colIndex] = playerInTurn.id;
                setBoards(boards);
                setIsPlayerOneTurn(!isPlayerOneTurn);
                const message = {
                    type: 'fill',
                    content: {
                        battleId: battleInfo.battleId,
                        colIndex
                    }
                };

                sendLobbyMessage(JSON.stringify(message));
                checkWinner(rowIndex, colIndex, playerInTurn);
            }
        }
    }

    const checkWinner = (rowIndex, colIndex, playerInTurn) => {
        const currentPlayerId = boards[rowIndex][colIndex];
        let i;
        for (i = 1; i < 4; i++) {
            if (rowIndex - i < 0) {
                break;
            } else if (boards[rowIndex - i][colIndex] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex - i < 0 || colIndex + i === colSize) {
                break;
            } else if (boards[rowIndex - i][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex + i === colSize) {
                break;
            } else if (boards[rowIndex][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex + i === colSize || rowIndex + i === rowSize) {
                break;
            } else if (boards[rowIndex + i][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex + i === rowSize) {
                break;
            } else if (boards[rowIndex + i][colIndex] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex + i === rowSize || colIndex - i < 0) {
                break;
            } else if (boards[rowIndex + i][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex - i < 0) {
                break;
            } else if (boards[rowIndex][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex - i < 0 || colIndex - i < 0) {
                break;
            } else if (boards[rowIndex - i][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            setWinner(playerInTurn);
            return;
        }
    }

    return (
        <div>
            {winner && (<div>Player  {winner.username} wins! <button onClick={cleanUpBattle}>Return to Lobby</button></div>)}
            {(isPlayerOneTurn ? playerOne : playerTwo).username} {'('}{playerColorMapping[(isPlayerOneTurn ? playerOne : playerTwo).id]}{')'}'s turn!
            {boards.map((cells, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {cells.map((cell, colIndex) => (
                        <div key={rowIndex + '-' + colIndex} onClick={() => fillArray(colIndex)} style={{ cursor: ((isPlayerOneTurn && isPlayerOne) || (!isPlayerOneTurn && !isPlayerOne)) ? 'pointer' : 'not-allowed', width: '60px', height: '60px', backgroundColor: 'salmon', border: '2px solid orange' }}>{boards[rowIndex][colIndex] ? playerColorMapping[boards[rowIndex][colIndex]] : ''}</div>
                    ))}
                </div>
            ))}
        </div>
    )
})

export default BattleRoom;
