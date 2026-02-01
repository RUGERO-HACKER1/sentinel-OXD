import { useState, useEffect } from 'react';

export const useTutorial = () => {
    // Home Screen Guide State
    const [showTutorial, setShowTutorial] = useState(false);

    // Dashboard Tour State
    const [showDashboardTour, setShowDashboardTour] = useState(false);
    const [currentDashboardStep, setCurrentDashboardStep] = useState(0);

    useEffect(() => {
        // Check Home Guide
        const hasSeenGuide = localStorage.getItem('sentinel_tour_v2');
        if (!hasSeenGuide) {
            const timer = setTimeout(() => setShowTutorial(true), 1000);
            return () => clearTimeout(timer);
        }

        // Check Dashboard Tour (only if we're not showing guide)
        // Note: usage of this hook in GameLayout will trigger this check independently
        // UPDATED key to force tour for debugging
        const hasSeenDashboard = localStorage.getItem('sentinel_dashboard_tour_debug_v2');
        if (!hasSeenDashboard) {
            const timer = setTimeout(() => setShowDashboardTour(true), 1500); // reduced delay slightly
            return () => clearTimeout(timer);
        }
    }, []);

    const completeTutorial = () => {
        localStorage.setItem('sentinel_tour_v2', 'true');
        setShowTutorial(false);
    };

    const completeDashboardTour = () => {
        localStorage.setItem('sentinel_dashboard_tour_debug_v2', 'true');
        setShowDashboardTour(false);
    };

    const nextDashboardStep = () => {
        setCurrentDashboardStep(prev => prev + 1);
    };

    return {
        showTutorial,
        completeTutorial,
        showDashboardTour,
        currentDashboardStep,
        nextDashboardStep,
        completeDashboardTour
    };
};
