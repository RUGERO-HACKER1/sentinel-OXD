import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Trophy, ShieldAlert, Target, RotateCcw, Cpu, User } from 'lucide-react';

export const MissionReport: React.FC = () => {
    const { score, threatsBlocked, falsePositives, totalDecisions, restartGame, gameMode, winner, playerScore, computerScore, playerStats, computerStats } = useGame();

    // Competitive Mode
    if (gameMode === 'VS_COMPUTER') {
        const isWin = winner === 'PLAYER';
        const playerAccuracy = (playerStats.correct + playerStats.incorrect) > 0
            ? Math.round((playerStats.correct / (playerStats.correct + playerStats.incorrect)) * 100)
            : 0;
        const computerAccuracy = (computerStats.correct + computerStats.incorrect) > 0
            ? Math.round((computerStats.correct / (computerStats.correct + computerStats.incorrect)) * 100)
            : 0;

        // Debug logging
        console.log('=== GAME OVER ===');
        console.log('Winner:', winner);
        console.log('Player Score:', playerScore);
        console.log('Computer Score:', computerScore);
        console.log('Is Player Win?:', isWin);

        // Funny messages based on outcome
        const winMessages = [
            'SYSTEM SECURED. YOU SHOWED THAT AI WHO\'S BOSS! 💪',
            'SUPERIOR PERFORMANCE DETECTED. THE MACHINES BOW TO YOU! 🙇',
            'YOU WIN! Computer.exe has stopped responding... 😵',
            'VICTORY! The AI needs a therapist now. 🤖😭',
            'HUMAN INTELLIGENCE > ARTIFICIAL INTELLIGENCE! Take that, Skynet! 🎯'
        ];

        const loseMessages = [
            'SYSTEM COMPROMISED. The robots are taking over... 🤖👑',
            'AI WINS. Don\'t worry, it\'s been training for 0.5 seconds. ⏱️',
            'DEFEAT! The computer is doing a victory dance. You can\'t see it, but trust us. 💃',
            'AI SUPERIOR. But it can\'t eat pizza, so who really won? 🍕',
            'COMPUTER WINS. It wants a rematch (and your job). 😈'
        ];

        const message = isWin
            ? winMessages[Math.floor(Math.random() * winMessages.length)]
            : loseMessages[Math.floor(Math.random() * loseMessages.length)];

        return (
            <div className="flex flex-col items-center justify-center h-screen bg-cyber-dark text-center p-4 relative z-50">
                {/* Background with color based on winner */}
                <div className={`absolute inset-0 ${isWin ? 'bg-green-500/5' : 'bg-red-500/5'} pointer-events-none`}></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(10,10,18,0.95),rgba(10,10,18,0.95)),url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10 max-w-3xl w-full bg-cyber-panel border-2 border-cyber-border/50 p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                    {/* SUPER CLEAR WINNER TEXT AT TOP */}
                    <div className={`text-8xl font-black mb-6 ${isWin ? 'text-green-400' : 'text-red-500'}`}>
                        WINNER: {isWin ? 'YOU!' : 'COMPUTER!'}
                    </div>
                    {/* HUGE Winner Indicator */}
                    <div className={`text-9xl mb-4 ${isWin ? 'animate-bounce' : ''}`}>
                        {isWin ? '🏆' : '💀'}
                    </div>

                    {/* Clear Winner Title */}
                    <h1 className={`text-6xl font-black mb-4 tracking-widest uppercase pixel-font ${isWin ? 'text-green-400' : 'text-red-500'}`}>
                        {isWin ? 'YOU WIN!' : 'COMPUTER WINS!'}
                    </h1>

                    {/* Funny subtitle */}
                    <p className="text-cyber-muted font-mono mb-2 text-lg">
                        {message}
                    </p>

                    {/* CLEAR Score Comparison with Winner Highlight */}
                    <div className="bg-black/50 p-6 rounded-lg mb-8 border-2 border-white/10">
                        <div className="text-cyber-muted text-sm mb-4 uppercase tracking-widest">Final Score</div>
                        <div className="flex items-center justify-center gap-8">
                            <div className={`text-center ${isWin ? 'scale-110' : 'opacity-60'}`}>
                                <User className={`w-10 h-10 mx-auto mb-2 ${isWin ? 'text-green-400' : 'text-cyber-primary'}`} />
                                <div className="text-sm text-cyber-muted uppercase tracking-wider mb-2">You</div>
                                <div className={`text-7xl font-black ${isWin ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-pulse' : 'text-white'}`}>
                                    {playerScore}
                                </div>
                                {isWin && <div className="text-green-400 text-xl mt-2 font-bold">WINNER! 👑</div>}
                            </div>

                            <div className="text-4xl text-gray-600 font-black">VS</div>

                            <div className={`text-center ${!isWin ? 'scale-110' : 'opacity-60'}`}>
                                <Cpu className={`w-10 h-10 mx-auto mb-2 ${!isWin ? 'text-red-500' : 'text-cyber-accent'}`} />
                                <div className="text-sm text-cyber-muted uppercase tracking-wider mb-2">Computer</div>
                                <div className={`text-7xl font-black ${!isWin ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-pulse' : 'text-white'}`}>
                                    {computerScore}
                                </div>
                                {!isWin && <div className="text-red-500 text-xl mt-2 font-bold">WINNER! 👑</div>}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-black/30 p-4 rounded border border-cyber-primary/20">
                            <Target className="w-8 h-8 text-cyber-primary mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white mb-1">{playerAccuracy}%</div>
                            <div className="text-xs text-cyber-muted font-mono">YOUR ACCURACY</div>
                        </div>
                        <div className="bg-black/30 p-4 rounded border border-cyber-accent/20">
                            <Target className="w-8 h-8 text-cyber-accent mx-auto mb-2" />
                            <div className="text-2xl font-bold text-white mb-1">{computerAccuracy}%</div>
                            <div className="text-xs text-cyber-muted font-mono">COMPUTER ACCURACY</div>
                        </div>
                    </div>

                    <button
                        onClick={restartGame}
                        className="group relative px-8 py-4 bg-cyber-primary text-cyber-dark font-black text-lg rounded-sm overflow-hidden hover:scale-105 transition-transform"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative flex items-center gap-2">
                            <RotateCcw className="w-5 h-5" /> PLAY AGAIN
                        </span>
                    </button>
                </motion.div>
            </div>
        );
    }

    // Solo Mode (original)
    const accuracy = totalDecisions > 0
        ? Math.round(((totalDecisions - falsePositives) / totalDecisions) * 100)
        : 0;

    let rank = "RECRUIT";
    let rankColor = "text-gray-400";
    if (score > 5000) { rank = "SENTINEL LEGEND"; rankColor = "text-cyber-warning"; }
    else if (score > 2500) { rank = "CYBER GUARDIAN"; rankColor = "text-cyber-accent"; }
    else if (score > 1000) { rank = "OPERATIVE"; rankColor = "text-cyber-primary"; }

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyber-dark text-center p-4 relative z-50">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(10,10,18,0.95),rgba(10,10,18,0.95)),url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 pointer-events-none"></div>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-2xl w-full bg-cyber-panel border border-cyber-border/50 p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            >
                <h1 className="text-4xl font-black text-cyber-danger mb-2 tracking-widest uppercase pixel-font">Mission Failed</h1>
                <p className="text-cyber-muted font-mono mb-8">CONNECTION SEVERED. THREAT LEVEL CRITICAL.</p>

                <div className="flex items-center justify-center gap-6 mb-10">
                    <div className="text-center">
                        <div className="text-sm text-cyber-muted uppercase tracking-wider mb-1">Final Score</div>
                        <div className="text-6xl font-black text-white drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">{score}</div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                    <div className="bg-black/30 p-4 rounded border border-white/5">
                        <ShieldAlert className="w-8 h-8 text-cyber-warning mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">{threatsBlocked}</div>
                        <div className="text-xs text-cyber-muted font-mono">THREATS BLOCKED</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded border border-white/5">
                        <Target className="w-8 h-8 text-cyber-accent mx-auto mb-2" />
                        <div className="text-2xl font-bold text-white mb-1">{accuracy}%</div>
                        <div className="text-xs text-cyber-muted font-mono">ACCURACY</div>
                    </div>
                    <div className="bg-black/30 p-4 rounded border border-white/5">
                        <Trophy className={`w-8 h-8 mx-auto mb-2 ${rankColor}`} />
                        <div className={`text-xl font-bold mb-1 ${rankColor}`}>{rank}</div>
                        <div className="text-xs text-cyber-muted font-mono">RANK ASSIGNED</div>
                    </div>
                </div>

                <button
                    onClick={restartGame}
                    className="group relative px-8 py-4 bg-cyber-primary text-cyber-dark font-black text-lg rounded-sm overflow-hidden hover:scale-105 transition-transform"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        <RotateCcw className="w-5 h-5" /> REBOOT SYSTEM
                    </span>
                </button>
            </motion.div>
        </div>
    );
};
