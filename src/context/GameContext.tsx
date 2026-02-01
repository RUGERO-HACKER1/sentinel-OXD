import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { GameState, GameEvent, GameMode } from '../types';
import { generateEvent } from '../data/events';
import { makeComputerDecision, calculateDecisionScore } from '../utils/computerAI';

interface GameContextType extends GameState {
    processDecision: (eventId: string, action: 'ALLOW' | 'FLAG' | 'BLOCK') => void;
    analyzeEvent: (eventId: string) => void;
    restartGame: () => void;
    togglePause: () => void;
    selectGameMode: (mode: GameMode) => void;
    floatingTexts: import('../components/FloatingText').FloatingTextItem[];
    addFloatingText: (text: string, x: number, y: number, type: 'score' | 'damage' | 'info') => void;
}

const INITIAL_STATE: GameState = {
    trust: 100,
    score: 0,
    level: 1,
    completedLevels: [],
    cycle: 1,
    events: [],
    activeEvent: null,
    isPlaying: false, // Start paused until mode selected
    gameOver: false,
    highScore: 0,
    streak: 0,
    multiplier: 1,
    threatsBlocked: 0,
    falsePositives: 0,
    totalDecisions: 0,
    // Competitive mode
    gameMode: 'SOLO',
    currentTurn: 'PLAYER',
    playerScore: 0,
    computerScore: 0,
    playerStats: { correct: 0, incorrect: 0 },
    computerStats: { correct: 0, incorrect: 0 },
    roundNumber: 0,
    maxRounds: 10,
    winner: null,
};

// Level Requirements
const LEVEL_REQUIREMENTS = {
    1: { decisions: 0, score: 0, name: "Training" },
    2: { decisions: 5, score: 0, name: "Active Duty" },
    3: { decisions: 15, score: 500, name: "Veteran" },
    4: { decisions: 30, score: 1500, name: "Elite" },
    5: { decisions: 50, score: 3000, name: "Master" }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
    const [floatingTexts, setFloatingTexts] = useState<import('../components/FloatingText').FloatingTextItem[]>([]);

    const addFloatingText = useCallback((text: string, x: number, y: number, type: 'score' | 'damage' | 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setFloatingTexts(prev => [...prev, { id, text, x, y, type }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(item => item.id !== id));
        }, 2000);
    }, []);

    // Difficulty Scaling & Game Loop
    useEffect(() => {
        if (!gameState.isPlaying || gameState.gameOver) return;

        // VS_COMPUTER Mode: Only spawn events when it's player's turn and no events exist
        if (gameState.gameMode === 'VS_COMPUTER') {
            if (gameState.currentTurn === 'PLAYER' && gameState.events.length === 0) {
                const timer = setTimeout(() => {
                    const newEvent = generateEvent(gameState.cycle);
                    setGameState(prev => ({
                        ...prev,
                        events: [newEvent],
                    }));
                }, 500);
                return () => clearTimeout(timer);
            }
            return;
        }

        // SOLO Mode: Standard Stream Mode
        const baseInterval = 2000;
        const speedMultiplier = Math.min(0.6, (gameState.cycle - 1) * 0.1);
        const spawnInterval = Math.max(800, baseInterval * (1 - speedMultiplier));

        const interval = setInterval(() => {
            // Chance to generate a new event
            const spawnChance = 0.4 + (Math.min(0.5, gameState.cycle * 0.05));

            if (gameState.events.length < 50 && Math.random() < spawnChance) {
                const newEvent = generateEvent(gameState.cycle);
                setGameState(prev => ({
                    ...prev,
                    events: [newEvent, ...prev.events],
                }));
            }
        }, spawnInterval);

        // Cycle Progression: Increase difficulty every 15 seconds
        const cycleInterval = setInterval(() => {
            setGameState(prev => ({
                ...prev,
                cycle: prev.cycle + 1
            }));
        }, 15000);

        return () => {
            clearInterval(interval);
            clearInterval(cycleInterval);
        };
    }, [gameState.isPlaying, gameState.gameOver, gameState.cycle, gameState.events.length, gameState.level, gameState.gameMode, gameState.currentTurn]);

    // Win/Loss Condition Check
    useEffect(() => {
        if (gameState.trust <= 0) {
            setGameState(prev => ({ ...prev, gameOver: true, isPlaying: false }));
        }
    }, [gameState.trust]);

    const analyzeEvent = useCallback((eventId: string) => {
        setGameState(prev => {
            const events = prev.events.map(e => {
                if (e.id === eventId) {
                    // Reveal clues
                    return {
                        ...e,
                        maskStatus: 'PARTIALLY_REVEALED',
                        clues: e.clues.map(c => ({ ...c, revealed: true }))
                    } as GameEvent;
                }
                return e;
            });
            return { ...prev, events };
        });
    }, []);

    const processDecision = useCallback((eventId: string, action: 'ALLOW' | 'FLAG' | 'BLOCK') => {
        setGameState(prev => {
            const event = prev.events.find(e => e.id === eventId);
            if (!event) return prev;

            // ----- COMPETITIVE MODE -----
            if (prev.gameMode === 'VS_COMPUTER') {
                const result = calculateDecisionScore(event, action);
                const newPlayerScore = prev.playerScore + result.scoreChange;
                const newRoundNumber = prev.roundNumber + 1;

                // Update player stats
                const newPlayerStats = {
                    correct: prev.playerStats.correct + (result.isCorrect ? 1 : 0),
                    incorrect: prev.playerStats.incorrect + (result.isCorrect ? 0 : 1)
                };

                addFloatingText(
                    `${result.isCorrect ? '✓' : '✗'} +${result.scoreChange}`,
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    result.isCorrect ? 'score' : 'damage'
                );

                // Remove event
                const remainingEvents = prev.events.filter(e => e.id !== eventId);

                // Check if game is over (all rounds completed)
                if (newRoundNumber > prev.maxRounds * 2) { // 2x because player + computer turns
                    const winner = newPlayerScore > prev.computerScore ? 'PLAYER' : 'COMPUTER';
                    console.log('🎮 GAME ENDING AFTER PLAYER TURN');
                    console.log('Player Score:', newPlayerScore);
                    console.log('Computer Score:', prev.computerScore);
                    console.log('Winner:', winner);
                    return {
                        ...prev,
                        playerScore: newPlayerScore,
                        playerStats: newPlayerStats,
                        roundNumber: newRoundNumber,
                        events: remainingEvents,
                        gameOver: true,
                        winner,
                        isPlaying: false
                    };
                }

                // Switch to computer turn after slight delay
                setTimeout(() => {
                    setGameState(current => {
                        if (current.gameOver) return current;

                        // Generate new event for computer (with clues revealed since AI analyzes immediately)
                        const computerEvent = generateEvent(current.cycle);
                        computerEvent.maskStatus = 'PARTIALLY_REVEALED';
                        computerEvent.clues = computerEvent.clues.map(c => ({ ...c, revealed: true }));

                        // Computer makes decision after showing the event briefly
                        setTimeout(() => {
                            const computerAction = makeComputerDecision(computerEvent);
                            const computerResult = calculateDecisionScore(computerEvent, computerAction);

                            // Funny computer messages based on performance
                            const funnyMessages = {
                                correctMessages: [
                                    `🤖 COMPUTER: "${computerAction}" - Too easy! 😎`,
                                    `🤖 Nailed it! ${computerAction}. I'm basically a genius 🧠`,
                                    `🤖 ${computerAction}! *does victory dance* 💃`,
                                    `🤖 Ez ${computerAction}, calculated everything in 0.003ms ⚡`,
                                    `🤖 ${computerAction}... Did you see that? Pure brilliance! ✨`,
                                    `🤖 *yawns* ${computerAction}. Wake me up when it gets hard 😴`,
                                    `🤖 ${computerAction}! Who's the best? (It's me) 🏆`,
                                ],
                                incorrectMessages: [
                                    `🤖 ${computerAction}... Uhh, meant to do that... 😅`,
                                    `🤖 ${computerAction}? THIS IS A LEARNING OPPORTUNITY! 🤓`,
                                    `🤖 Whoops ${computerAction}... My circuits must be tired 🔌`,
                                    `🤖 ${computerAction}... Let's pretend that didn't happen 🙈`,
                                    `🤖 ${computerAction}! I blame the programmer 👨‍💻`,
                                    `🤖 ${computerAction}... Error 404: Good decision not found 🤦`,
                                    `🤖 ${computerAction}... Still winning though! 😤`,
                                ]
                            };

                            const messageArray = computerResult.isCorrect ? funnyMessages.correctMessages : funnyMessages.incorrectMessages;
                            const randomMessage = messageArray[Math.floor(Math.random() * messageArray.length)];

                            addFloatingText(
                                randomMessage,
                                window.innerWidth / 2,
                                window.innerHeight / 2,
                                computerResult.isCorrect ? 'info' : 'damage'
                            );

                            setGameState(s => {
                                const newComputerRound = s.roundNumber + 1;

                                // Check if game should end
                                if (newComputerRound > s.maxRounds * 2) {
                                    const finalComputerScore = s.computerScore + computerResult.scoreChange;
                                    const winner = s.playerScore > finalComputerScore ? 'PLAYER' : 'COMPUTER';
                                    console.log('🎮 GAME ENDING AFTER COMPUTER TURN');
                                    console.log('Player Score:', s.playerScore);
                                    console.log('Computer Score:', finalComputerScore);
                                    console.log('Winner:', winner);
                                    return {
                                        ...s,
                                        computerScore: finalComputerScore,
                                        computerStats: {
                                            correct: s.computerStats.correct + (computerResult.isCorrect ? 1 : 0),
                                            incorrect: s.computerStats.incorrect + (computerResult.isCorrect ? 0 : 1)
                                        },
                                        roundNumber: newComputerRound,
                                        events: [],
                                        gameOver: true,
                                        winner,
                                        isPlaying: false
                                    };
                                }

                                return {
                                    ...s,
                                    computerScore: s.computerScore + computerResult.scoreChange,
                                    computerStats: {
                                        correct: s.computerStats.correct + (computerResult.isCorrect ? 1 : 0),
                                        incorrect: s.computerStats.incorrect + (computerResult.isCorrect ? 0 : 1)
                                    },
                                    roundNumber: newComputerRound,
                                    events: [],
                                    currentTurn: 'PLAYER'
                                };
                            });
                        }, 7000); // Computer "thinks" for 7 seconds (increased for readability)

                        return {
                            ...current,
                            events: [computerEvent],
                            currentTurn: 'COMPUTER'
                        };
                    });
                }, 2000); // 2 second delay before computer turn starts

                return {
                    ...prev,
                    playerScore: newPlayerScore,
                    playerStats: newPlayerStats,
                    roundNumber: newRoundNumber,
                    events: remainingEvents,
                    currentTurn: 'PLAYER' // Will switch to COMPUTER after timeout
                };
            }

            // ----- SOLO MODE (ORIGINAL LOGIC) -----
            let streak = prev.streak || 0;
            let multiplier = prev.multiplier || 1;
            let threatsBlocked = prev.threatsBlocked || 0;
            let falsePositives = prev.falsePositives || 0;
            let totalDecisions = (prev.totalDecisions || 0) + 1;

            let scoreChange = 0;
            let trustChange = 0;

            const isThreat = event.isThreat;

            // Success Helper
            const handleSuccess = (baseScore: number) => {
                streak++;

                // Calculate Multiplier
                if (streak >= 20) multiplier = 3;
                else if (streak >= 10) multiplier = 2;
                else if (streak >= 5) multiplier = 1.5;
                else multiplier = 1;

                scoreChange = baseScore * multiplier;
                addFloatingText(`+${scoreChange}`, window.innerWidth / 2, window.innerHeight / 2, 'score');
            };

            // Failure Helper
            const handleFailure = (trustPenalty: number) => {
                trustChange = trustPenalty;
                addFloatingText(`${trustPenalty}% TRUST`, window.innerWidth / 2, window.innerHeight / 2, 'damage');

                if (streak > 0) {
                    addFloatingText("COMBO LOST", window.innerWidth / 2, window.innerHeight / 2 - 50, 'damage');
                }
                streak = 0;
                multiplier = 1;
            };

            if (action === 'ALLOW') {
                if (isThreat) {
                    handleFailure(-15);
                } else {
                    handleSuccess(50);
                }
            } else if (action === 'BLOCK') {
                if (isThreat) {
                    handleSuccess(100);
                    threatsBlocked++;
                } else {
                    handleFailure(-5);
                    falsePositives++;
                }
            } else if (action === 'FLAG') {
                if (isThreat) {
                    handleSuccess(75);
                } else {
                    scoreChange = 10;
                    addFloatingText("+10", window.innerWidth / 2, window.innerHeight / 2, 'info');
                }
            }

            // Remove processed event
            const remainingEvents = prev.events.filter(e => e.id !== eventId);

            // Level Up Check - Enhanced for 5 levels
            let newLevel = prev.level;
            let newCompletedLevels = [...prev.completedLevels];
            const newScore = Math.max(0, prev.score + scoreChange);

            // Check each level requirement
            for (let level = 2; level <= 5; level++) {
                const req = LEVEL_REQUIREMENTS[level as keyof typeof LEVEL_REQUIREMENTS];

                // If we meet requirements and haven't reached this level yet
                if (totalDecisions >= req.decisions && newScore >= req.score && prev.level < level) {
                    newLevel = level;
                    // Mark previous level as completed
                    if (level > 1 && !newCompletedLevels.includes(level - 1)) {
                        newCompletedLevels.push(level - 1);
                    }
                    addFloatingText(`LEVEL ${level}: ${req.name}`, window.innerWidth / 2, window.innerHeight / 2 - 100, 'info');
                }
            }

            return {
                ...prev,
                score: newScore,
                trust: Math.min(100, prev.trust + trustChange),
                events: remainingEvents,
                activeEvent: null,
                streak,
                multiplier,
                threatsBlocked,
                falsePositives,
                totalDecisions,
                level: newLevel,
                completedLevels: newCompletedLevels
            };
        });
    }, [addFloatingText]);

    const restartGame = () => {
        setGameState(INITIAL_STATE);
    };

    const togglePause = () => {
        setGameState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    };

    const selectGameMode = useCallback((mode: GameMode) => {
        setGameState(() => ({
            ...INITIAL_STATE,
            gameMode: mode,
            isPlaying: true,
            maxRounds: mode === 'VS_COMPUTER' ? 10 : 0,
        }));
    }, []);

    return (
        <GameContext.Provider value={{ ...gameState, processDecision, analyzeEvent, restartGame, togglePause, selectGameMode, floatingTexts, addFloatingText }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};
