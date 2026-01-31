import React, { useState, useEffect } from 'react';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>/?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

interface GlitchTextProps {
    text: string;
    isActive: boolean;
    speed?: number;
    className?: string;
    onComplete?: () => void;
}

export const GlitchText: React.FC<GlitchTextProps> = ({
    text,
    isActive,
    speed = 50,
    className = "",
    onComplete
}) => {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!isActive) {
            setDisplayText(text);
            return;
        }

        let interval: ReturnType<typeof setInterval>;
        let iteration = 0;

        interval = setInterval(() => {
            setDisplayText(_ =>
                text
                    .split("")
                    .map((_, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }

            iteration += 1 / 3; // Slow down the reveal
        }, speed);

        return () => clearInterval(interval);
    }, [isActive, text, speed]);

    return (
        <span className={className}>
            {displayText}
        </span>
    );
};
