import React, { useImperativeHandle, useMemo, useState } from "react";
import { sendMessage } from "../api";
import './BattleRoom.css'

const BattleRoom = React.forwardRef((props, ref) => {
    const rowSize = 6;
    const colSize = 7;
    const { player, battleDetail, cleanUpBattle } = props;
    const [boards, setBoards] = useState(new Array(rowSize).fill(null).map(() => new Array(colSize).fill(null)));
    const playerOne = useMemo(() => battleDetail.battleRoom.playerOne, [battleDetail.battleRoom.playerOne]);
    const playerTwo = useMemo(() => battleDetail.battleRoom.playerTwo, [battleDetail.battleRoom.playerTwo]);
    const isPlayerOne = useMemo(() => player.id === playerOne.id, [player.id, playerOne.id]);
    const playerColorMapping = useMemo(() => ({
        [playerOne.id]: 'green',
        [playerTwo.id]: 'yellow'
    }), [playerOne.id, playerTwo.id]);
    const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
    const [winner, setWinner] = useState(null);

    const findTopRowIndexByColumnIndex = (columnIndex) => {
        let rowIndex;
        for (rowIndex = rowSize - 1; rowIndex >= 0; rowIndex--) {
            if (!boards[rowIndex][columnIndex]) {
                break;
            }
        }
        return rowIndex;
    }

    useImperativeHandle(ref, () => ({
        fillBoardFromEnemy(otherPlayerNewCellIndex) {
            if (otherPlayerNewCellIndex !== null && otherPlayerNewCellIndex !== undefined) {
                setBoards(prevBoards => {
                    const topRowIndex = findTopRowIndexByColumnIndex(otherPlayerNewCellIndex);
                    const playerInTurn = isPlayerOne ? playerTwo : playerOne;
                    prevBoards[topRowIndex][otherPlayerNewCellIndex] = (playerInTurn).id;
                    const newWinner = findWinner(topRowIndex, otherPlayerNewCellIndex, playerInTurn);
                    setWinner(newWinner);
                    return prevBoards;
                });

                setIsPlayerOneTurn(!isPlayerOneTurn);
            }
        }
    }));

    const fillBoard = (colIndex) => {
        if (((isPlayerOneTurn && isPlayerOne) || (!isPlayerOneTurn && !isPlayerOne)) && !winner) {
            const rowIndex = findTopRowIndexByColumnIndex(colIndex);
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
                        battleId: battleDetail.battleId,
                        colIndex
                    }
                };

                sendMessage(JSON.stringify(message));
                const newWinner = findWinner(rowIndex, colIndex, playerInTurn);
                if (newWinner) {
                    setWinner(newWinner)
                    const overMessage = {
                        type: 'over',
                        content: battleDetail.battleId
                    };
                    sendMessage(JSON.stringify(overMessage))
                }
            }
        }
    }

    const findWinner = (rowIndex, colIndex, playerInTurn) => {
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
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex - i < 0 || colIndex + i === colSize) {
                break;
            } else if (boards[rowIndex - i][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex + i === colSize) {
                break;
            } else if (boards[rowIndex][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex + i === colSize || rowIndex + i === rowSize) {
                break;
            } else if (boards[rowIndex + i][colIndex + i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex + i === rowSize) {
                break;
            } else if (boards[rowIndex + i][colIndex] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex + i === rowSize || colIndex - i < 0) {
                break;
            } else if (boards[rowIndex + i][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (colIndex - i < 0) {
                break;
            } else if (boards[rowIndex][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        for (i = 1; i < 4; i++) {
            if (rowIndex - i < 0 || colIndex - i < 0) {
                break;
            } else if (boards[rowIndex - i][colIndex - i] !== currentPlayerId) {
                break;
            }
        }
        if (i === 4) {
            return playerInTurn;
        }
        return null;
    }

    return (
        <div>
            {winner && (<div>Player {winner.username} wins! <button onClick={cleanUpBattle}>Return to Lobby</button></div>)}
            {(isPlayerOneTurn ? playerOne : playerTwo).username} {'('}{playerColorMapping[(isPlayerOneTurn ? playerOne : playerTwo).id]}{')'}'s turn!
            <div style={{ width: '100%', height: ' 100%', position: 'relative' }}>
                <div className="board-container">
                    {boards.map((cells, rowIndex) =>
                        cells.map((cell, colIndex) => (
                            <div className="board-item" key={rowIndex + '-' + colIndex} onClick={() => fillBoard(colIndex)} style={{ cursor: (((isPlayerOneTurn && isPlayerOne) || (!isPlayerOneTurn && !isPlayerOne)) && !winner) ? 'pointer' : 'not-allowed' }}>
                                <svg width="100%" height="100%" style={{ position: 'absolute', padding: 0, margin: 0 }}>
                                    <defs>
                                        <mask style={{ padding: 0, margin: 0 }} id="mask" x="0" y="0">
                                            <rect style={{ padding: 0, margin: 0 }} width="100%" height="100%" fill="#fff" />
                                            <circle cx="50%" cy="50%" r="45%" />
                                        </mask>
                                    </defs>
                                    <rect x="0" y="0" width="100%" height="100%" mask="url(#mask)" style={{ padding: 0, margin: 0 }} />
                                </svg>
                            </div>
                        ))
                    )}
                </div>
                <div className="button-container">
                    {boards.map((cells, rowIndex) =>
                        cells.map((cell, colIndex) => (
                            <div className="board-item">
                                {boards[rowIndex][colIndex] && (
                                    <div style={{ position:'absolute', width: '100%', height: '100%', backgroundColor: playerColorMapping[boards[rowIndex][colIndex]]}}>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
});

export default BattleRoom;
