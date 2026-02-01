import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, ShieldCheck, ShieldAlert, Cpu, Activity } from 'lucide-react';

interface GuideOverlayProps {
    isVisible: boolean;
    onClose: () => void;
}

const GUIDE_SLIDES = [
    {
        title: "WELCOME, OPERATOR",
        icon: <Cpu className="w-16 h-16 text-cyber-primary" />,
        content: (
            <div className="text-center space-y-4">
                <p className="text-lg">
                    You have been selected to manage the <span className="text-cyber-primary font-bold">Sentinel OXD</span> defense grid.
                </p>
                <p className="text-gray-400 text-sm">
                    Your mission is simple: Filter network traffic. Stop the bad stuff. Let the good stuff through.
                    Try not to destroy the internet.
                </p>
            </div>
        )
    },
    {
        title: "THE OBJECTIVE",
        icon: <Activity className="w-16 h-16 text-cyber-warning" />,
        content: (
            <div className="text-center space-y-4">
                <div className="flex justify-center gap-8 mb-4">
                    <div className="text-center">
                        <div className="text-cyber-primary font-bold text-xl mb-1">TRUST</div>
                        <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="w-[80%] h-full bg-cyber-primary"></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Don't let this hit 0%</p>
                    </div>
                    <div className="text-center">
                        <div className="text-cyber-warning font-bold text-xl mb-1">SCORE</div>
                        <div className="text-cyber-warning font-mono">15,400</div>
                        <p className="text-xs text-gray-500 mt-1">High score wins</p>
                    </div>
                </div>
                <p className="text-gray-400 text-sm">
                    Every mistake costs <strong>Trust</strong>. Run out of trust, and it's game over.
                    Chain correct decisions to build your <strong>Combo Modifier</strong>!
                </p>
            </div>
        )
    },
    {
        title: "ANALYZE THREATS",
        icon: <ShieldAlert className="w-16 h-16 text-cyber-danger" />,
        content: (
            <div className="space-y-4">
                <div className="bg-gray-900/50 p-4 rounded border border-gray-700 font-mono text-xs">
                    <div className="flex justify-between text-gray-500 mb-2">
                        <span>SOURCE: Unknown Proxy</span>
                        <span className="text-cyber-danger">RISK: HIGH</span>
                    </div>
                    <div className="text-cyber-primary mb-2">Message: "URGENT_PATCH.exe"</div>
                    <div className="flex gap-2">
                        <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded">Bad IP</span>
                        <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Obfuscated</span>
                    </div>
                </div>
                <p className="text-center text-gray-400 text-sm">
                    Click <strong>DEEP SCAN</strong> to reveal clues. <br />
                    If it looks fishy (bad IP, poor grammar, known malware), <strong>BLOCK</strong> it.
                </p>
            </div>
        )
    },
    {
        title: "GAME MODES",
        icon: <ShieldCheck className="w-16 h-16 text-cyber-accent" />,
        content: (
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-cyber-primary/5 border border-cyber-primary/20 rounded">
                    <div className="font-bold text-cyber-primary mb-2">SOLO</div>
                    <p className="text-xs text-gray-400">
                        Endless survival mode.
                        Level up and unlock new ranks.
                    </p>
                </div>
                <div className="p-4 bg-cyber-accent/5 border border-cyber-accent/20 rounded">
                    <div className="font-bold text-cyber-accent mb-2">VS COMP</div>
                    <p className="text-xs text-gray-400">
                        Turn-based battle against AI.
                        Highest score after 10 rounds wins.
                    </p>
                </div>
            </div>
        )
    }
];

export const GuideOverlay: React.FC<GuideOverlayProps> = ({ isVisible, onClose }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        if (currentSlide < GUIDE_SLIDES.length - 1) {
            setCurrentSlide(p => p + 1);
        } else {
            onClose();
            // Reset for next time if needed, or keep at end?
            // Usually better to reset when closed
            setTimeout(() => setCurrentSlide(0), 500);
        }
    };

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(p => p - 1);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="bg-cyber-panel border border-cyber-primary/30 w-full max-w-lg rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-cyber-dark to-cyber-panel border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold font-mono text-cyber-primary tracking-widest flex items-center gap-2">
                                <span className="animate-pulse">●</span> TACTICAL BRIEFING
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 h-[320px] flex flex-col items-center justify-center relative">
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full h-full flex flex-col items-center"
                                >
                                    <div className="mb-6 animate-float">
                                        {GUIDE_SLIDES[currentSlide].icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-6 tracking-wide">
                                        {GUIDE_SLIDES[currentSlide].title}
                                    </h3>
                                    <div className="w-full">
                                        {GUIDE_SLIDES[currentSlide].content}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Footer / Controls */}
                        <div className="p-6 border-t border-gray-800 bg-black/20 flex justify-between items-center">
                            <div className="flex gap-2">
                                {GUIDE_SLIDES.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-cyber-primary w-4' : 'bg-gray-700'}`}
                                    />
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentSlide === 0}
                                    className={`p-2 rounded hover:bg-white/5 transition-colors ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'text-gray-300'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-cyber-primary text-cyber-dark font-bold rounded hover:bg-cyber-accent transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.2)]"
                                >
                                    {currentSlide === GUIDE_SLIDES.length - 1 ? 'INITIALIZE' : 'NEXT'}
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
