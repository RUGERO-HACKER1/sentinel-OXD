import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, Sparkles, BookOpen } from 'lucide-react';
import type { GameMode } from '../types';
import { GuideOverlay } from './GuideOverlay';
import { useTutorial } from '../hooks/useTutorial';

interface ModeSelectorProps {
    onSelectMode: (mode: GameMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ onSelectMode }) => {
    const { showTutorial, completeTutorial } = useTutorial();
    // We can use local state to toggle the guide manually too
    const [isGuideOpen, setIsGuideOpen] = React.useState(false);

    // Sync hook state with local state for auto-show
    React.useEffect(() => {
        if (showTutorial) {
            setIsGuideOpen(true);
        }
    }, [showTutorial]);

    const handleCloseGuide = () => {
        setIsGuideOpen(false);
        completeTutorial();
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyber-dark text-center p-4 relative overflow-hidden">
            <GuideOverlay isVisible={isGuideOpen} onClose={handleCloseGuide} />

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(5,5,16,0.98),rgba(5,5,16,0.98)),url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 pointer-events-none"></div>
            <div className="absolute inset-0 scanline-overlay opacity-20 pointer-events-none"></div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 max-w-4xl w-full"
            >
                {/* Title */}
                <h1 className="text-6xl font-black text-cyber-primary mb-4 tracking-widest italic text-shadow-neon">
                    sentinel OXD
                </h1>
                <p className="text-cyber-accent text-sm font-mono tracking-[0.3em] uppercase mb-8 opacity-80">
                    National AI Defense Graph
                </p>

                {/* Manual Guide Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsGuideOpen(true)}
                    className="mb-12 px-6 py-2 border border-cyber-muted/30 text-cyber-muted hover:text-white hover:border-white/50 rounded-full text-xs font-mono tracking-widest flex items-center gap-2 mx-auto transition-all"
                >
                    <BookOpen className="w-3 h-3" />
                    OPERATOR MANUAL
                </motion.button>

                <h2 className="text-2xl font-bold text-gray-300 mb-8 font-mono">
                    SELECT GAME MODE
                </h2>

                {/* Mode Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {/* Solo Mode */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectMode('SOLO')}
                        className="group relative p-8 glass-panel border-2 border-cyber-primary/30 hover:border-cyber-primary rounded-lg transition-all shadow-[0_0_20px_rgba(0,255,157,0.1)] hover:shadow-[0_0_40px_rgba(0,255,157,0.3)] clip-corner-br overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/0 via-cyber-primary/5 to-cyber-primary/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyber-primary/10 border-2 border-cyber-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                <User className="w-10 h-10 text-cyber-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-cyber-primary mb-3 tracking-wider">SOLO MODE</h3>
                            <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                Test your skills alone. Analyze threats, make decisions, and protect the system.
                                Survive as long as you can!
                            </p>
                        </div>
                    </motion.button>

                    {/* VS Computer Mode */}
                    <motion.button
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectMode('VS_COMPUTER')}
                        className="group relative p-8 glass-panel border-2 border-cyber-accent/30 hover:border-cyber-accent rounded-lg transition-all shadow-[0_0_20px_rgba(0,217,249,0.1)] hover:shadow-[0_0_40px_rgba(0,217,249,0.3)] clip-corner-br overflow-hidden"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyber-accent/0 via-cyber-accent/5 to-cyber-accent/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-cyber-accent/10 border-2 border-cyber-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                                <div className="relative">
                                    <Cpu className="w-10 h-10 text-cyber-accent" />
                                    <Sparkles className="w-4 h-4 text-cyber-warning absolute -top-1 -right-1 animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-cyber-accent mb-3 tracking-wider">VS COMPUTER</h3>
                            <p className="text-gray-400 text-sm font-mono leading-relaxed">
                                Compete against an AI opponent! Take turns analyzing threats.
                                Highest score after 10 rounds wins! 🏆
                            </p>
                        </div>
                    </motion.button>
                </div>

                {/* Footer hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-12 text-cyber-muted text-xs font-mono"
                >
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-cyber-primary rounded-full animate-pulse"></div>
                        <span>SELECT A MODE TO BEGIN OPERATION</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};
