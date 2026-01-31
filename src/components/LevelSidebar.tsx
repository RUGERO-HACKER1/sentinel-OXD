import React from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';
import { Lock, Check, Circle } from 'lucide-react';

const LEVELS = [
    { id: 1, name: "Training", decisions: 0, score: 0 },
    { id: 2, name: "Active Duty", decisions: 5, score: 0 },
    { id: 3, name: "Veteran", decisions: 15, score: 500 },
    { id: 4, name: "Elite", decisions: 30, score: 1500 },
    { id: 5, name: "Master", decisions: 50, score: 3000 }
];

export const LevelSidebar: React.FC = () => {
    const { level, completedLevels, totalDecisions, score } = useGame();

    const getLevelStatus = (levelId: number) => {
        if (completedLevels.includes(levelId)) return 'completed';
        if (levelId === level) return 'current';
        return 'locked';
    };

    const getProgressForCurrentLevel = () => {
        if (level >= 5) return 100;

        const nextLevel = LEVELS[level]; // Next level (index = level, since array is 0-indexed)
        if (!nextLevel) return 100;

        const decisionsProgress = (totalDecisions / nextLevel.decisions) * 100;
        const scoreProgress = nextLevel.score > 0 ? (score / nextLevel.score) * 100 : 100;

        return Math.min(decisionsProgress, scoreProgress);
    };

    return (
        <div className="w-64 h-full bg-cyber-panel/50 backdrop-blur-md border-r border-cyber-border p-4 flex flex-col gap-4">
            <div className="border-b border-cyber-border pb-3">
                <h2 className="text-cyber-primary font-bold text-sm uppercase tracking-widest mb-1">Security Levels</h2>
                <p className="text-cyber-muted text-xs font-mono">Mission Progression</p>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                {LEVELS.map((lvl, index) => {
                    const status = getLevelStatus(lvl.id);
                    const isLast = index === LEVELS.length - 1;

                    return (
                        <div key={lvl.id} className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`
                                    relative p-3 rounded-lg border transition-all
                                    ${status === 'current'
                                        ? 'bg-cyber-primary/10 border-cyber-primary shadow-[0_0_15px_rgba(0,255,157,0.2)]'
                                        : status === 'completed'
                                            ? 'bg-cyber-accent/5 border-cyber-accent/30'
                                            : 'bg-gray-800/30 border-gray-700/50'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Icon */}
                                    <div className={`
                                        flex items-center justify-center w-8 h-8 rounded-full
                                        ${status === 'current'
                                            ? 'bg-cyber-primary text-cyber-dark'
                                            : status === 'completed'
                                                ? 'bg-cyber-accent text-cyber-dark'
                                                : 'bg-gray-700 text-gray-500'
                                        }
                                    `}>
                                        {status === 'completed' && <Check className="w-4 h-4" />}
                                        {status === 'current' && <Circle className="w-4 h-4 fill-current" />}
                                        {status === 'locked' && <Lock className="w-4 h-4" />}
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`
                                                text-xs font-bold font-mono
                                                ${status === 'current'
                                                    ? 'text-cyber-primary'
                                                    : status === 'completed'
                                                        ? 'text-cyber-accent'
                                                        : 'text-gray-500'
                                                }
                                            `}>
                                                LVL {lvl.id}
                                            </span>
                                        </div>
                                        <h3 className={`
                                            text-sm font-semibold
                                            ${status === 'current'
                                                ? 'text-white'
                                                : status === 'completed'
                                                    ? 'text-gray-300'
                                                    : 'text-gray-600'
                                            }
                                        `}>
                                            {lvl.name}
                                        </h3>
                                        {status === 'locked' && lvl.id > 1 && (
                                            <p className="text-[10px] text-gray-600 mt-1 font-mono">
                                                {lvl.decisions} decisions, {lvl.score} pts
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Progress Bar for Current Level */}
                                {status === 'current' && lvl.id < 5 && (
                                    <div className="mt-3">
                                        <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${getProgressForCurrentLevel()}%` }}
                                                className="h-full bg-cyber-primary shadow-[0_0_8px_currentColor]"
                                            />
                                        </div>
                                        <p className="text-[9px] text-cyber-muted mt-1 font-mono">
                                            {totalDecisions}/{LEVELS[level]?.decisions} decisions · {score}/{LEVELS[level]?.score} pts
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Connector Line */}
                            {!isLast && (
                                <div className={`
                                    absolute left-7 top-full w-0.5 h-3 -translate-x-1/2
                                    ${status === 'completed' ? 'bg-cyber-accent/50' : 'bg-gray-700/50'}
                                `} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
