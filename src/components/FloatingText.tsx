import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingTextItem {
    id: string;
    text: string;
    x: number;
    y: number;
    type: 'score' | 'damage' | 'info';
}

interface FloatingTextOverlayProps {
    items: FloatingTextItem[];
}

export const FloatingTextOverlay: React.FC<FloatingTextOverlayProps> = ({ items }) => {
    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {items.map(item => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.5, x: item.x, y: item.y }}
                        animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0.5, 1.2, 1],
                            y: item.y - 100
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`absolute font-black text-2xl tracking-wider text-shadow-neon whitespace-nowrap
                            ${item.type === 'score' ? 'text-cyber-warning' :
                                item.type === 'damage' ? 'text-cyber-danger' : 'text-cyber-primary'}`}
                    >
                        {item.text}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
