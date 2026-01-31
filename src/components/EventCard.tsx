import React, { useState } from 'react';
import type { GameEvent } from '../types';
import { useGame } from '../context/GameContext';
import { GlitchText } from './GlitchText';
import { useSound } from '../hooks/useSound';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Search, CheckCircle, XCircle, Flag } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface EventCardProps {
    event: GameEvent;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
    const { analyzeEvent, processDecision, gameMode, currentTurn } = useGame();
    const { playSound } = useSound();
    const [isExpanding, setIsExpanding] = useState(false);

    const handleAnalyze = () => {
        playSound('reveal');
        setIsExpanding(true);
        analyzeEvent(event.id);
    };

    const isRevealed = event.maskStatus === 'PARTIALLY_REVEALED' || event.maskStatus === 'UNMASKED';
    const isComputerTurn = gameMode === 'VS_COMPUTER' && currentTurn === 'COMPUTER';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={twMerge(
                "relative w-full mb-4 p-5 clip-corner-br glass-panel transition-all",
                "border-l-4 group",
                event.maskStatus === 'MASKED' ? "border-l-gray-500" :
                    event.riskScore > 80 ? "border-l-cyber-danger shadow-[0_0_20px_rgba(255,0,85,0.2)]" : "border-l-cyber-warning"
            )}
            onMouseEnter={() => playSound('hover')}
        >
            {/* Header Row */}
            <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded bg-black/40 border border-white/10 ${event.riskScore > 80 ? 'animate-pulse text-cyber-danger' : 'text-cyber-accent'}`}>
                        {event.riskScore > 80 ? <AlertTriangle className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                        {/* Transaction ID instead of type */}
                        <h3 className="font-mono text-lg font-bold text-cyber-primary tracking-wider uppercase text-shadow-neon">
                            TRANSACTION #{event.id.slice(0, 8)}
                        </h3>
                        <div className="h-0.5 w-full bg-cyber-primary/30 mt-0.5"></div>
                    </div>
                </div>
                <span className="text-xs font-mono text-cyber-accent/70 tracking-widest">
                    T-{new Date(event.timestamp).toLocaleTimeString([], { hour12: false })}
                </span>
            </div>

            {/* Content Body */}
            <div className="mb-4 space-y-2 font-mono text-sm relative z-10 pl-1">
                <p className="text-gray-400"><span className="text-cyber-accent text-[10px] tracking-widest uppercase opacity-70 block mb-0.5">Origin Source</span> {event.source}</p>
                <div className="p-2 bg-black/30 border-l-2 border-cyber-muted italic text-gray-300">
                    "{event.message}"
                </div>
                {event.amount && (
                    <p className="text-cyber-warning font-bold flex items-center gap-2">
                        <span className="text-[10px] text-cyber-muted uppercase">Transaction Value</span>
                        <span className="text-lg">{event.amount}</span>
                    </p>
                )}
            </div>

            {/* Analysis Section */}
            <div className="min-h-[50px] relative z-10">
                {!isRevealed ? (
                    <button
                        onClick={handleAnalyze}
                        onMouseEnter={() => playSound('hover')}
                        className="w-full py-3 flex items-center justify-center gap-2 bg-cyber-primary/10 border border-cyber-primary/30 hover:bg-cyber-primary/20 hover:border-cyber-primary/60 hover:shadow-[0_0_15px_rgba(0,255,157,0.2)] rounded-sm transition-all text-cyber-primary font-mono text-sm tracking-widest font-bold group clip-corner-br"
                    >
                        <Search className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                        INITIATE DEEP SCAN
                    </button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-3 bg-black/40 p-3 rounded border border-white/5"
                    >
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                            <div className="w-1.5 h-1.5 bg-cyber-warning rounded-full animate-pulse"></div>
                            <h4 className="text-xs font-bold text-cyber-warning tracking-[0.2em]">THREAT ANALYSIS COMPLETE</h4>
                        </div>

                        {event.clues.map((clue) => (
                            <div key={clue.id} className="flex items-start gap-3 text-xs text-gray-300 font-mono">
                                <span className="text-cyber-primary mt-0.5">⟫</span>
                                <div className="flex-1">
                                    <GlitchText text={clue.text} isActive={true} speed={20} />
                                </div>
                                <span className={`ml-auto px-1.5 py-0.5 rounded text-[10px] font-bold ${clue.reliability > 0.8 ? 'bg-cyber-primary/20 text-cyber-primary' : 'bg-gray-800 text-gray-500'}`}>
                                    {(clue.reliability * 100).toFixed(0)}%
                                </span>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Actions (Tactical Buttons) */}
            {isRevealed && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 mt-4 pt-3 border-t border-white/5"
                >
                    <button
                        onClick={() => { !isComputerTurn && processDecision(event.id, 'ALLOW'); playSound('click'); }}
                        disabled={isComputerTurn}
                        className={`flex-1 py-3 bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 hover:border-green-400 text-green-400 rounded-sm font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(34,197,94,0.1)] clip-corner-br ${isComputerTurn ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <CheckCircle className="w-4 h-4" /> ALLOW
                    </button>
                    <button
                        onClick={() => { !isComputerTurn && processDecision(event.id, 'FLAG'); playSound('click'); }}
                        disabled={isComputerTurn}
                        className={`flex-1 py-3 bg-yellow-500/10 border border-yellow-500/30 hover:bg-yellow-500/20 hover:border-yellow-400 text-yellow-400 rounded-sm font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(234,179,8,0.1)] clip-corner-br ${isComputerTurn ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <Flag className="w-4 h-4" /> FLAG
                    </button>
                    <button
                        onClick={() => { !isComputerTurn && processDecision(event.id, 'BLOCK'); playSound('click'); }}
                        disabled={isComputerTurn}
                        className={`flex-1 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500 text-red-500 rounded-sm font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(239,68,68,0.1)] clip-corner-br ${isComputerTurn ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                        <XCircle className="w-4 h-4" /> BLOCK
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
};
