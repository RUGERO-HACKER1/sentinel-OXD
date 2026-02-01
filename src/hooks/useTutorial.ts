import { useState, useEffect } from 'react';

export const useTutorial = () => {
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('sentinel_tutorial_seen');
        if (!hasSeenTutorial) {
            // Small delay to let the UI load
            const timer = setTimeout(() => {
                setShowTutorial(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const completeTutorial = () => {
        localStorage.setItem('sentinel_tutorial_seen', 'true');
        setShowTutorial(false);
    };

    const nextStep = () => {
        setCurrentStep(prev => prev + 1);
    };

    return { showTutorial, currentStep, nextStep, completeTutorial };
};
