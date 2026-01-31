import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'framer-motion';

export const ComboMeter: React.FC = () => {
    const { streak, multiplier } = useGame();
    const [shake, setShake] = useState(0);

    useEffect(() => {
        if (streak > 0) {
            setShake(prev => prev + 1);
        }
    }, [streak]);

    if (streak < 2) return null;

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
            <AnimatePresence>
                <motion.div
                    key={shake}
                    initial={{ scale: 1.2, rotate: -5 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="flex flex-col items-center"
                >
                    <div className="relative">
                        {/* Multiplier Badge */}
                        {multiplier > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-cyber-warning text-black font-black text-xl px-2 py-0.5 rounded -skew-x-12 whitespace-nowrap shadow-[0_0_15px_rgba(255,200,0,0.6)]"
                            >
                                {multiplier}x
                            </motion.div>
                        )}

                        {/* Streak Number */}
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-cyber-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                            style={{ fontFamily: 'Impact, sans-serif' }}>
                            {streak}
                        </div>
                    </div>

                    <div className="text-cyber-accent font-mono tracking-[0.5em] text-sm mt-1 animate-pulse font-bold">
                        COMBO
                    </div>

                    {/* Progress Bar to next multiplier */}
                    <div className="w-24 h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyber-primary to-cyber-warning"
                            initial={{ width: 0 }}
                            animate={{
                                width: multiplier === 3 ? '100%' :
                                    multiplier === 2 ? `${((streak - 10) / 10) * 100}%` :
                                        `${(streak / 5) * 100}%`
                            }}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
