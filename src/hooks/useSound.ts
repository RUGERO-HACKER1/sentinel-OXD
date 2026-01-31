import { useCallback, useEffect, useState } from 'react';

type SoundType = 'hover' | 'click' | 'scan' | 'success' | 'fail' | 'alarm' | 'typing' | 'reveal';

// Singleton Audio Context to prevent garbage collection and multiple contexts
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
const masterGain = audioCtx.createGain();
masterGain.connect(audioCtx.destination);
masterGain.gain.value = 0.4; // Global Volume

// Sequencer State (Global to persist across renders)
let musicInterval: number | null = null;
let noteIndex = 0;

export const useSound = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    // Sync state on mount
    useEffect(() => {
        setIsMusicPlaying(!!musicInterval);
    }, []);

    const playSound = useCallback((type: SoundType) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(masterGain);

        const now = audioCtx.currentTime;

        switch (type) {
            case 'hover':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
            case 'click':
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'scan':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(1000, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'success':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.linearRampToValueAtTime(1200, now + 0.1);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;
            case 'fail':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.3);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
            case 'reveal':
                osc.type = 'square';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
            case 'alarm':
                osc.type = 'square';
                osc.frequency.setValueAtTime(880, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
            case 'typing':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;
        }
    }, []);

    const playBassNote = useCallback((freq: number, duration: number) => {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Punchy Envelope
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

        // Lowpass Filter
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }, []);

    const toggleMusic = useCallback(() => {
        if (audioCtx.state === 'suspended') audioCtx.resume();

        if (isMusicPlaying) {
            // Stop
            if (musicInterval) {
                window.clearInterval(musicInterval);
                musicInterval = null;
            }
            setIsMusicPlaying(false);
        } else {
            // Start Sequencer
            // Pattern: C2 - C2 - D#2 - F2 (Cyberpunk Bass)
            const sequence = [65.41, 65.41, 77.78, 87.31];

            if (musicInterval) window.clearInterval(musicInterval);

            // Play first note immediately
            playBassNote(sequence[noteIndex % sequence.length], 0.3);
            noteIndex++;

            musicInterval = window.setInterval(() => {
                const freq = sequence[noteIndex % sequence.length];
                playBassNote(freq, 0.3);
                noteIndex++;
            }, 500); // 120 beats per minute

            setIsMusicPlaying(true);
        }
    }, [isMusicPlaying, playBassNote]);

    return { playSound, toggleMusic, isMusicPlaying };
};
