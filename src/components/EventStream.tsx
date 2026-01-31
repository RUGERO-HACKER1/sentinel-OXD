import React from 'react';
import { useGame } from '../context/GameContext';
import { EventCard } from './EventCard';
import { AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

import { useSound } from '../hooks/useSound';

interface EventStreamProps {
    centered?: boolean;
}

export const EventStream: React.FC<EventStreamProps> = ({ centered = false }) => {
    const { events, isPlaying, togglePause, gameMode, currentTurn } = useGame();
    const { playSound } = useSound();

    if (centered) {
        // Show computer turn indicator in competitive mode
        const isComputerTurn = gameMode === 'VS_COMPUTER' && currentTurn === 'COMPUTER';

        return (
            <div className="w-full h-full flex items-center justify-center p-8">
                <AnimatePresence mode='popLayout'>
                    {events.length > 0 ? (
                        <div className="w-full max-w-2xl transform scale-110 relative">
                            {isComputerTurn && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-6 py-2 bg-cyber-accent/20 border border-cyber-accent rounded-full z-50">
                                    <span className="text-cyber-accent font-mono text-sm font-bold animate-pulse">🤖 COMPUTER ANALYZING...</span>
                                </div>
                            )}
                            <EventCard key={events[0].id} event={events[0]} />
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="text-cyber-primary text-xl font-mono animate-pulse tracking-widest mb-4">
                                {['AWAITING NEXT TRANSACTION...',
                                    'SCANNING FOR SUSPICIOUS CATS... 🐱',
                                    'CHECKING IF AI IS PLOTTING... 🤔',
                                    'WAITING FOR TROUBLE... ⏳',
                                    'ANALYZING NETWORK... OR NAPPING 😴'][Math.floor(Math.random() * 5)]}
                            </div>
                            <div className="text-cyber-muted text-sm font-mono">
                                {isComputerTurn ? 'COMPUTER IS THINKING REALLY HARD' : 'ANALYZING NETWORK TRAFFIC'}
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div id="feed-container" className="w-full h-full overflow-y-auto px-4 py-2 scrollbar-thin">
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-cyber-dark/90 backdrop-blur z-10 py-2 border-b border-cyber-border">
                <div className="flex items-center gap-4">
                    <h2 className="text-cyber-primary font-mono text-xl font-bold tracking-widest text-shadow-neon">LIVE FEED</h2>
                    <span className="text-xs text-cyber-muted animate-pulse">● RECEIVING DATA...</span>
                </div>
                <button
                    onClick={() => { togglePause(); playSound('click'); }}
                    onMouseEnter={() => playSound('hover')}
                    className="p-2 rounded bg-cyber-panel border border-cyber-border hover:bg-cyber-muted/20 text-cyber-accent transition-colors"
                    title={isPlaying ? "Pause Feed" : "Resume Feed"}
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
            </div>

            <AnimatePresence mode='popLayout'>
                {events.length === 0 ? (
                    <div className="text-center text-cyber-muted mt-10 font-mono">
                        Scanning for threats...
                    </div>
                ) : (
                    events.map(event => (
                        <EventCard key={event.id} event={event} />
                    ))
                )}
            </AnimatePresence>
        </div>
    );
};
