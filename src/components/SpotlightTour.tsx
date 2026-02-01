import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TourStep {
    targetId: string;
    title: string;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface SpotlightTourProps {
    isVisible: boolean;
    currentStep: number;
    steps: TourStep[];
    onNext: () => void;
    onComplete: () => void;
}

export const SpotlightTour: React.FC<SpotlightTourProps> = ({
    isVisible,
    currentStep,
    steps,
    onNext,
    onComplete
}) => {
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [typedText, setTypedText] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);
    const step = steps[currentStep];

    // Typing animation effect
    useEffect(() => {
        if (!step) return;

        setTypedText('');
        setIsTypingComplete(false);
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < step.content.length) {
                setTypedText(step.content.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                setIsTypingComplete(true);
                clearInterval(typingInterval);
            }
        }, 30); // Typing speed

        return () => clearInterval(typingInterval);
    }, [step, currentStep]);

    useEffect(() => {
        if (!step || !isVisible) return;

        const updateTarget = () => {
            const target = document.getElementById(step.targetId);
            if (target) {
                setTargetRect(target.getBoundingClientRect());
            } else {
                setTargetRect(null);
            }
        };

        updateTarget();
        window.addEventListener('resize', updateTarget);
        return () => window.removeEventListener('resize', updateTarget);
    }, [step, isVisible]);

    if (!isVisible || !step) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            onNext();
        } else {
            onComplete();
        }
    };

    const isLastStep = currentStep === steps.length - 1;

    // Calculate info card position
    const getCardPosition = () => {
        if (!targetRect || step.targetId === 'center-screen') {
            return {
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            };
        }

        const padding = 30;
        const cardWidth = 400;

        switch (step.position) {
            case 'right':
                return {
                    top: `${targetRect.top + targetRect.height / 2}px`,
                    left: `${targetRect.right + padding}px`,
                    transform: 'translateY(-50%)',
                };
            case 'bottom':
                return {
                    top: `${targetRect.bottom + padding}px`,
                    left: `${Math.min(targetRect.left + targetRect.width / 2, window.innerWidth - cardWidth / 2 - 20)}px`,
                    transform: 'translateX(-50%)',
                };
            default:
                return {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                };
        }
    };

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] pointer-events-none"
            >
                {/* SVG Mask for Spotlight Effect */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <mask id="spotlight-mask">
                            <rect className="w-full h-full fill-black opacity-80" width="100%" height="100%" />
                            {targetRect && (
                                <motion.circle
                                    initial={{ r: 0 }}
                                    animate={{ r: Math.max(targetRect.width, targetRect.height) / 1.5 + 20 }}
                                    transition={{ type: 'spring', damping: 20 }}
                                    cx={targetRect.left + targetRect.width / 2}
                                    cy={targetRect.top + targetRect.height / 2}
                                    fill="black"
                                />
                            )}
                        </mask>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00ff9d" />
                            <stop offset="100%" stopColor="#00aaff" />
                        </linearGradient>
                    </defs>
                    {/* Dark Overlay with Mask */}
                    <rect className="w-full h-full fill-black/80 pointer-events-none" width="100%" height="100%" mask="url(#spotlight-mask)" />

                    {/* Spotlight Ring */}
                    {targetRect && step.targetId !== 'center-screen' && (
                        <motion.circle
                            initial={{ r: 0, opacity: 0 }}
                            animate={{ r: Math.max(targetRect.width, targetRect.height) / 1.5 + 25, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20 }}
                            cx={targetRect.left + targetRect.width / 2}
                            cy={targetRect.top + targetRect.height / 2}
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="3"
                            className="pointer-events-none"
                        />
                    )}
                </svg>

                {/* Info Card - Always render, fallback to center if no target */}
                {(targetRect || step) && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        style={getCardPosition()}
                        className="absolute pointer-events-auto w-[400px] max-w-[90vw]"
                    >
                        <div className="bg-cyber-panel/95 backdrop-blur-xl border-2 border-cyber-primary rounded-lg shadow-[0_0_30px_rgba(0,255,157,0.3)] p-6 relative overflow-hidden">
                            {/* Animated background effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/5 to-transparent pointer-events-none" />

                            {/* Avatar - Bouncing Robot */}
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -top-8 -right-8 text-6xl opacity-80"
                            >
                                🤖
                            </motion.div>

                            <div className="relative">
                                <h3 className="text-xl font-bold text-cyber-primary mb-3 font-mono flex items-center gap-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-300 mb-6 leading-relaxed font-mono text-sm min-h-[80px]">
                                    {typedText}
                                    {!isTypingComplete && (
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                            className="inline-block w-2 h-4 bg-cyber-primary ml-1"
                                        />
                                    )}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {steps.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all ${idx === currentStep
                                                    ? 'w-8 bg-cyber-primary'
                                                    : idx < currentStep
                                                        ? 'w-1.5 bg-cyber-accent'
                                                        : 'w-1.5 bg-gray-700'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-cyber-primary text-cyber-dark font-bold rounded-md hover:bg-cyber-accent transition-colors shadow-[0_0_15px_rgba(0,255,157,0.3)] font-mono"
                                    >
                                        {isLastStep ? '🚀 Let\'s Go!' : '👉 Next'}
                                    </motion.button>
                                </div>

                                {/* Skip button */}
                                <button
                                    onClick={onComplete}
                                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-300 transition-colors"
                                    title="Skip Tour"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>,
        document.body
    );
};
