import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Database, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';

interface TutorialOverlayProps {
    isVisible: boolean;
    currentStep: number;
    onNext: () => void;
    onComplete: () => void;
}

const STEPS = [
    {
        title: "INITIALIZING SENTINEL PROTOCOL...",
        icon: <Shield className="w-12 h-12 text-cyber-primary" />,
        content: "Welcome, Operator. You have been assigned to oversee the National AI Defense Graph. Your mission is to monitor and neutralize cyber threats before they compromise the system.",
        highlight: "center"
    },
    {
        title: "SYSTEM INTEGRITY MONITOR",
        icon: <Activity className="w-12 h-12 text-cyber-danger" />,
        content: "Keep an eye on the TRUST METER (Top Right). If it drops to 0%, the network collapses and the mission fails. Maintain public trust by handling incidents efficiently.",
        highlight: "top-right"
    },
    {
        title: "THREAT DETECTION FEED",
        icon: <AlertTriangle className="w-12 h-12 text-cyber-warning" />,
        content: "Real-time threats will appear in the MAIN FEED. Analyze them. Some require immediate ACTION (Clicking), others are purely informational.",
        highlight: "center"
    },
    {
        title: "AUDIO UPLINK",
        icon: <Database className="w-12 h-12 text-cyber-accent" />,
        content: "Enable AUDIO UPLINK (Top Right) for immersive feedback. Sound cues are vital for reacting to critical system alerts.",
        highlight: "top-right"
    },
    {
        title: "READY FOR DEPLOYMENT",
        icon: <CheckCircle className="w-12 h-12 text-cyber-primary" />,
        content: "System is online. Good luck, Operator. The network is in your hands.",
        highlight: "center"
    }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, currentStep, onNext, onComplete }) => {
    if (!isVisible) return null;

    const step = STEPS[currentStep];
    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
                <div className="absolute inset-0 scanline-overlay pointer-events-none opacity-20"></div>

                <motion.div
                    key={currentStep}
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.1, opacity: 0, y: -20 }}
                    className="w-full max-w-lg p-1 bg-gradient-to-br from-cyber-primary/40 to-cyber-accent/40 rounded-lg shadow-[0_0_50px_rgba(0,255,157,0.2)]"
                >
                    <div className="bg-cyber-panel border border-cyber-border rounded-lg p-8 relative overflow-hidden">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Shield className="w-32 h-32" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="p-3 bg-cyber-dark rounded-full border border-cyber-primary/30 shadow-[0_0_15px_rgba(0,255,157,0.3)]">
                                {step.icon}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-cyber-primary tracking-widest text-shadow-neon">
                                    {step.title}
                                </h2>
                                <div className="flex gap-1 mt-1">
                                    {STEPS.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-cyber-primary box-shadow-neon-green' : 'w-2 bg-gray-700'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <p className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10 font-mono">
                            {step.content}
                        </p>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 relative z-10">
                            <button
                                onClick={isLastStep ? onComplete : onNext}
                                className="group flex items-center gap-2 px-6 py-3 bg-cyber-primary/10 hover:bg-cyber-primary/20 border border-cyber-primary/50 hover:border-cyber-primary rounded transition-all shadow-[0_0_10px_rgba(0,255,157,0.1)] hover:shadow-[0_0_20px_rgba(0,255,157,0.3)]"
                            >
                                <span className="font-bold text-cyber-primary tracking-wider group-hover:text-white transition-colors">
                                    {isLastStep ? "INITIATE SYSTEM" : "NEXT SEQUENCE"}
                                </span>
                                <ArrowRight className="w-4 h-4 text-cyber-primary group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
