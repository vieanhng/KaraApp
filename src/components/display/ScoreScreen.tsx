'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScoreScreenProps {
    score: number;
    songTitle: string;
    onClose: () => void;
}

export default function ScoreScreen({ score, songTitle, onClose }: ScoreScreenProps) {
    const [displayScore, setDisplayScore] = useState(0);
    const [showFireworks, setShowFireworks] = useState(false);

    // Determine rank based on score
    const getRank = (score: number) => {
        if (score >= 95) return { rank: 'SS', color: '#fbbf24', label: 'Xuất Sắc!' };
        if (score >= 85) return { rank: 'S', color: '#8b5cf6', label: 'Tuyệt Vời!' };
        if (score >= 75) return { rank: 'A', color: '#3b82f6', label: 'Rất Tốt!' };
        if (score >= 65) return { rank: 'B', color: '#10b981', label: 'Khá!' };
        if (score >= 50) return { rank: 'C', color: '#6b7280', label: 'Tạm Được!' };
        return { rank: 'D', color: '#ef4444', label: 'Cố Gắng Lên!' };
    };

    const rankInfo = getRank(score);

    // Animate score counting up
    useEffect(() => {
        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = score / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= score) {
                setDisplayScore(score);
                clearInterval(timer);
                if (score >= 85) {
                    setShowFireworks(true);
                }
            } else {
                setDisplayScore(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [score]);

    // Auto close after 8 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(10,10,12,0.98), rgba(30,20,40,0.98))',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}
        >
            {/* Fireworks Effect */}
            {showFireworks && (
                <>
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: '50%',
                                y: '50%',
                                scale: 0,
                                opacity: 1
                            }}
                            animate={{
                                x: `${50 + (Math.random() - 0.5) * 100}%`,
                                y: `${50 + (Math.random() - 0.5) * 100}%`,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0]
                            }}
                            transition={{
                                duration: 1.5,
                                delay: Math.random() * 0.5,
                                repeat: Infinity,
                                repeatDelay: 1
                            }}
                            style={{
                                position: 'absolute',
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                background: ['#fbbf24', '#8b5cf6', '#ec4899', '#3b82f6'][Math.floor(Math.random() * 4)]
                            }}
                        />
                    ))}
                </>
            )}

            {/* Main Content */}
            <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ type: 'spring', damping: 15 }}
                style={{
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 1
                }}
            >
                {/* Trophy Icon */}
                <motion.div
                    animate={{
                        rotate: [0, -10, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.5,
                        repeat: 2
                    }}
                    style={{
                        display: 'inline-block',
                        marginBottom: '2rem'
                    }}
                >
                    <Trophy size={80} color={rankInfo.color} />
                </motion.div>

                {/* Song Title */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        fontSize: '1.2rem',
                        color: '#a1a1aa',
                        marginBottom: '1rem',
                        maxWidth: '600px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        padding: '0 2rem'
                    }}
                >
                    {songTitle}
                </motion.p>

                {/* Score */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: 'spring',
                        damping: 10,
                        delay: 0.5
                    }}
                    style={{
                        fontSize: '8rem',
                        fontWeight: 900,
                        background: `linear-gradient(135deg, ${rankInfo.color}, ${rankInfo.color}dd)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                        marginBottom: '1rem'
                    }}
                >
                    {displayScore}
                </motion.div>

                {/* Rank Badge */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: 'spring',
                        damping: 12,
                        delay: 1
                    }}
                    style={{
                        display: 'inline-block',
                        padding: '1rem 3rem',
                        background: `${rankInfo.color}20`,
                        border: `3px solid ${rankInfo.color}`,
                        borderRadius: '20px',
                        marginBottom: '1rem'
                    }}
                >
                    <div style={{
                        fontSize: '3rem',
                        fontWeight: 900,
                        color: rankInfo.color,
                        letterSpacing: '0.1em'
                    }}>
                        {rankInfo.rank}
                    </div>
                </motion.div>

                {/* Label */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: rankInfo.color,
                        marginTop: '1rem'
                    }}
                >
                    {rankInfo.label}
                </motion.p>

                {/* Stars */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        marginTop: '2rem'
                    }}
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 1.5 + i * 0.1,
                                type: 'spring',
                                damping: 15
                            }}
                        >
                            <Star
                                size={32}
                                fill={i < Math.floor(score / 20) ? rankInfo.color : 'transparent'}
                                color={rankInfo.color}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Close hint */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ delay: 3 }}
                    style={{
                        marginTop: '3rem',
                        fontSize: '0.9rem',
                        color: '#6b7280'
                    }}
                >
                    Nhấn để tiếp tục...
                </motion.p>
            </motion.div>

            {/* Click to close */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    cursor: 'pointer'
                }}
            />
        </motion.div>
    );
}
