import React, { useEffect, useRef } from 'react';

export const CipherBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Configuration
        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops: number[] = new Array(columns).fill(1);

        // matrix characters (Katana + Latin + Numbers)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&";

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff9d'; // Cyber primary color (glowing blue-green)
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = chars[Math.floor(Math.random() * chars.length)];

                // Add some variety in color for "glitch" effect
                if (Math.random() > 0.98) {
                    ctx.fillStyle = '#00d9f9'; // Cyber accent (blue)
                } else {
                    ctx.fillStyle = '#00ff9d'; // Cyber primary
                }

                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-screen"
        />
    );
};
