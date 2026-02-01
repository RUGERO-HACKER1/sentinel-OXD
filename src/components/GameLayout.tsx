import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../hooks/useSound';
import { EventStream } from './EventStream';
import { Activity, Trophy, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import { FloatingTextOverlay } from './FloatingText';
import { ComboMeter } from './ComboMeter';
import { MissionReport } from './MissionReport';
import { CipherBackground } from './CipherBackground';
import { LevelSidebar } from './LevelSidebar';
import { SpotlightTour } from './SpotlightTour';
import { useTutorial } from '../hooks/useTutorial';

const DASHBOARD_TOUR_STEPS = [
    {
        targetId: 'event-stream-area',
        title: "THE CHAOS STREAM",
        content: "This is your primary feed. Analyze incoming data packets. Use DEEP SCAN to reveal threats. ALLOW safe data, BLOCK threats.",
        position: 'center' as const
    },
    {
        targetId: 'trust-meter',
        title: "SYSTEM INTEGRITY",
        content: "This is your life. Every mistake drops your Trust. If it hits 0%, the network collapses and you're fired.",
        position: 'bottom' as const
    },
    {
        targetId: 'score-display',
        title: "PERFORMANCE",
        content: "Track your neutralized threats here. Build a COMBO by chaining correct decisions to multiply your score.",
        position: 'bottom' as const
    },
    {
        targetId: 'level-display',
        title: "SECURITY CLEARANCE",
        content: "As you survive, your Level increases. Higher levels unlock tougher enemies.",
        position: 'bottom' as const
    },
    {
        targetId: 'audio-control',
        title: "AUDIO UPLINK",
        content: "Toggle the localized synth-wave audio feed here. Essential for operator focus.",
        position: 'bottom' as const
    }
];

export const GameLayout: React.FC = () => {
    const gameState = useGame();
    const { trust, score, gameOver, floatingTexts, level, gameMode } = gameState;
    const { toggleMusic, isMusicPlaying } = useSound();
    const controls = useAnimation();
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    // Dashboard Tour Integration
    const { showDashboardTour, currentDashboardStep, nextDashboardStep, completeDashboardTour } = useTutorial();

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Screen Shake Effect on Damage
    useEffect(() => {
        const lastText = floatingTexts[floatingTexts.length - 1];
        if (lastText && lastText.type === 'damage') {
            controls.start({
                x: [0, -5, 5, -5, 5, 0],
                transition: { duration: 0.4 }
            });
        }
    }, [floatingTexts, controls]);

    if (gameOver) {
        return <MissionReport />;
    }

    return (
        <motion.div
            animate={controls}
            className="h-screen w-full bg-cyber-dark flex relative overflow-hidden text-gray-200 font-sans"
        >
            {/* Immersive Layers */}
            <CipherBackground />
            <div className="absolute inset-0 scanline-overlay opacity-30 pointer-events-none"></div>

            {/* Dashboard Tour */}
            <SpotlightTour
                isVisible={showDashboardTour}
                currentStep={currentDashboardStep}
                steps={DASHBOARD_TOUR_STEPS}
                onNext={nextDashboardStep}
                onComplete={completeDashboardTour}
            />

            {/* UI Overlay */}

            <FloatingTextOverlay items={floatingTexts} />
            <ComboMeter />

            {/* Level Sidebar - Only in Solo Mode */}
            {gameMode === 'SOLO' && <LevelSidebar />}

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tactical Header */}
                <header className="relative z-20 flex items-center justify-between px-8 py-3 glass-panel border-b border-cyber-primary/20 shadow-lg shadow-cyber-primary/5">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col border-l-2 border-cyber-primary pl-4">
                            <h1 className="text-3xl font-black text-cyber-primary tracking-widest italic text-shadow-neon">sentinel OXD</h1>
                            <span className="text-[10px] text-cyber-accent tracking-[0.4em] font-mono uppercase opacity-80">National AI Defense Graph</span>
                        </div>

                        {/* Competitive Mode: Turn Indicator & Round */}
                        {gameState.gameMode === 'VS_COMPUTER' && (
                            <div className="flex items-center gap-4">
                                <div className={`px - 4 py - 2 rounded border - 2 transition - all ${gameState.currentTurn === 'PLAYER'
                                    ? 'border-cyber-primary bg-cyber-primary/10 text-cyber-primary text-shadow-neon'
                                    : 'border-cyber-accent/30 bg-cyber-accent/5 text-cyber-accent/50'
                                    } `}>
                                    <div className="text-[10px] uppercase tracking-wider opacity-70">Your Turn</div>
                                    <div className="text-xs font-bold">{gameState.currentTurn === 'PLAYER' ? '🎯 ACTIVE' : '⏸ WAITING'}</div>
                                </div>

                                <div className="text-center px-3">
                                    <div className="text-[10px] text-cyber-muted uppercase tracking-wider">Round</div>
                                    <div className="text-lg font-bold text-cyber-warning">{Math.ceil(gameState.roundNumber / 2)} / {gameState.maxRounds}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-12 font-mono items-center">
                        {/* Competitive Mode: Dual Scores */}
                        {gameState.gameMode === 'VS_COMPUTER' ? (
                            <>
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-cyber-primary uppercase tracking-wider">YOU</span>
                                        <div className="text-3xl font-bold text-cyber-primary text-shadow-neon">
                                            {gameState.playerScore}
                                        </div>
                                    </div>
                                    <div className="text-2xl text-gray-600 font-black">VS</div>
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-[10px] text-cyber-accent uppercase tracking-wider">COMPUTER</span>
                                        <div className="text-3xl font-bold text-cyber-accent text-shadow-neon">
                                            {gameState.computerScore}
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Solo Mode: Original Stats */}
                                {/* Level Display */}
                                <div id="level-display" className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-cyber-muted uppercase tracking-wider">SEC LEVEL</span>
                                    <div className="flex items-center gap-2 text-xl font-bold text-cyber-primary text-shadow-neon">
                                        <span>{level}</span>
                                    </div>
                                </div>

                                {/* Trust Meter (Gauge Style) */}
                                <div id="trust-meter" className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-cyber-muted uppercase tracking-wider">System Integrity</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-gray-800/50 rounded-full overflow-hidden border border-gray-700">
                                            <motion.div
                                                initial={{ width: '100%' }}
                                                animate={{ width: `${trust}% ` }}
                                                className={`h - full shadow - [0_0_10px_currentColor] ${trust < 30 ? 'bg-cyber-danger text-cyber-danger' : 'bg-cyber-primary text-cyber-primary'} `}
                                            />
                                        </div>
                                        <span className={`text - xl font - bold ${trust < 30 ? 'text-cyber-danger text-shadow-neon' : 'text-cyber-primary text-shadow-neon'} `}>{trust}%</span>
                                    </div>
                                </div>

                                {/* Score */}
                                <div id="score-display" className="flex flex-col items-end gap-1">
                                    <span className="text-[10px] text-cyber-muted uppercase tracking-wider">Threats Neutralized</span>
                                    <div className="flex items-center gap-2 text-2xl font-bold text-cyber-warning text-shadow-neon">
                                        <Trophy className="w-5 h-5 text-cyber-warning" />
                                        <span>{score.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className="flex items-center gap-4 pl-8 border-l border-gray-700/50">
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-cyber-accent uppercase tracking-wider opacity-70">Audio Uplink</span>
                                            <button
                                                id="audio-control"
                                                onClick={toggleMusic}
                                                className={`p - 2 rounded - md border backdrop - blur - md transition - all ${isMusicPlaying ? 'border-cyber-primary bg-cyber-primary/10 text-cyber-primary box-shadow-neon-green' : 'border-gray-700 text-gray-500 hover:text-gray-300'} `}
                                            >
                                                {isMusicPlaying ? (
                                                    <div className="flex items-center gap-2">
                                                        <Volume2 className="w-4 h-4" />
                                                        {/* Visualizer Bars */}
                                                        <div className="flex gap-0.5 items-end h-3">
                                                            <motion.div animate={{ height: [4, 10, 4] }} transition={{ duration: 0.4, repeat: Infinity }} className="w-0.5 bg-cyber-primary" />
                                                            <motion.div animate={{ height: [6, 12, 5] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-0.5 bg-cyber-primary" />
                                                            <motion.div animate={{ height: [3, 8, 3] }} transition={{ duration: 0.3, repeat: Infinity }} className="w-0.5 bg-cyber-primary" />
                                                        </div>
                                                    </div>
                                                ) : <VolumeX className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] text-cyber-accent uppercase tracking-wider opacity-70">Display</span>
                                            <button
                                                id="fullscreen-control"
                                                onClick={toggleFullscreen}
                                                className="p-2 rounded-md border border-gray-700 text-gray-500 hover:text-cyber-accent hover:border-cyber-accent backdrop-blur-md transition-all"
                                                title="Toggle Fullscreen"
                                            >
                                                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 px-3 py-1 rounded bg-cyber-primary/5 border border-cyber-primary/20">
                                        <Activity className="w-4 h-4 text-cyber-primary animate-pulse" />
                                        <span className="text-xs font-bold text-cyber-primary tracking-wider">ONLINE</span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 relative z-10 p-6 flex justify-center min-h-0 overflow-hidden">
                    <div id="event-stream-area" className="w-full max-w-7xl h-full relative">
                        {/* Decorative Brackets for Main Feed */}
                        <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyber-primary/30 to-transparent"></div>
                        <div className="absolute -right-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyber-primary/30 to-transparent"></div>

                        <EventStream centered={level === 1} />
                    </div>
                </main>
            </div>
        </motion.div>
    );
};
