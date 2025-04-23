import React, { useState, useEffect } from "react";
import "../styles/Game.css";
import ShipPlacement from "../utils/ShipPlacement";
import Board from "../utils/Board";
import { useGame } from "../Context/GameContext";
import { useTimer } from "../Context/TimerContext";

const Game = () => {
    // Game state and control from GameContext
    const {
        playerBoard,
        aiBoard,
        message,
        gameStarted,
        gameOver,
        startGame,
        restartGame,
        handlePlayerAttack,
        updatePlayerBoard,
    } = useGame();

    // Timer controls from TimerContext
    const { time, start, stop, reset } = useTimer();

    // Local state for ship placement and UI messages
    const [playerShipBoard, setPlayerShipBoard] = useState(null);
    const [allShipsPlaced, setAllShipsPlaced] = useState(false);
    const [gameMessage, setGameMessage] = useState("Please place all your ships before starting!");

    // Sync timer with game state
    useEffect(() => {
        if (gameStarted) start();     // Start timer when game starts
        if (gameOver) stop();         // Stop timer when game ends
        if (!gameStarted) reset();    // Reset timer if game resets
    }, [gameStarted, gameOver]);

    // Format and update player board after ship placement
    const handleBoardUpdate = (newBoard) => {
        const formattedBoard = newBoard.map(row =>
            row.map(cell => ({
                ship: cell !== null,
                hit: false,
            }))
        );
        setPlayerShipBoard(formattedBoard);

        // Count total placed ship cells
        let shipsPlaced = 0;
        newBoard.forEach(row => {
            row.forEach(cell => {
                if (cell !== null) {
                    shipsPlaced++;
                }
            });
        });

        const allShipsReady = shipsPlaced === 17;
        setAllShipsPlaced(allShipsReady);

        if (allShipsReady) {
            setGameMessage("All ships placed! Click Start Game!");
        } else {
            setGameMessage("Please place all your ships before starting!");
        }

        if (updatePlayerBoard) {
            updatePlayerBoard(formattedBoard);
        }
    };

    // Start the game only if all ships are placed
    const handleStartGame = () => {
        if (!allShipsPlaced) {
            setGameMessage("⚠️ You must place all ships before starting!");
            return;
        }
        startGame();
        reset(); // Reset the timer
        start(); // Start the timer immediately
        setGameMessage("Game Started! Click to attack.");
    };

    // Handle player attack on AI board
    const handlePlayerMove = (row, col) => {
        if (!gameStarted) {
            setGameMessage("⚠️ Please place all your ships and then click Start Game!");
            return;
        }
        handlePlayerAttack(row, col);
        setGameMessage("");
    };

    // Restart the game without reloading the page
    const handleRestart = () => {
        reset();             // Reset timer to 0
        restartGame();       // Reset all game state in context
        setPlayerShipBoard(null);
        setAllShipsPlaced(false);
        setGameMessage("Please place all your ships before starting!");
    };

    

    return (
        <main>
            {/* Start Game Button */}
            <p>
                <button
                    className={`start-btn ${(!allShipsPlaced || gameStarted) ? "disabled-btn" : ""}`}
                    onClick={handleStartGame}
                    disabled={!allShipsPlaced || gameStarted}
                >
                    {!allShipsPlaced ? "Place all ships first" : gameStarted ? "Game In Progress" : "Start Game"}
                </button>
            </p>

            {/* Display dynamic game messages */}
            <p className="message">{message || gameMessage}</p>

            {/* Game boards section */}
            <section className="game-container">
                {/* AI Board (clickable) */}
                <div className="board">
                    <Board
                        board={aiBoard}
                        isPlayer={false}
                        onCellClick={handlePlayerMove}
                    />
                </div>

                {/* Player board or ship placement */}
                {gameStarted ? (
                    <div className="board">
                        <Board
                            board={playerBoard}
                            isPlayer={true}
                            onCellClick={() => {}} // Player board is not clickable
                        />
                    </div>
                ) : (
                    <ShipPlacement
                        gameStarted={gameStarted}
                        onBoardUpdate={handleBoardUpdate}
                    />
                )}
            </section>

            {/* Timer and Restart */}
            <div className="time">
                <p>Time: <span>{time}s</span></p>
                <p>
                    <button className="restart-btn" onClick={handleRestart}>
                        Restart
                    </button>
                </p>
            </div>
        </main>
    );
};

export default Game;
