'use client';

import { Play, Pause, SkipForward, RotateCcw, Volume2 } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { motion } from 'framer-motion';

interface Props {
    code: string;
    playbackState: any;
    smaller?: boolean;
}

export default function NowPlayingControls({ code, playbackState, smaller = false }: Props) {
    const { socket } = useSocket();

    const sendCommand = (command: string, data = {}) => {
        socket?.emit('player-command', { code, command, data });
    };

    if (!playbackState || !playbackState.currentVideo) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
                <p>Hiện không có bài hát nào đang phát.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Hãy thêm bài hát vào hàng đợi để bắt đầu.</p>
            </div>
        );
    }

    const { currentVideo, isPlaying, currentTime = 0, duration = 0 } = playbackState;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '1rem', width: '100%' }}>

            {/* Album Art */}
            <motion.div
                animate={{
                    rotate: isPlaying ? 360 : 0,
                    scale: isPlaying ? 1 : 0.95
                }}
                transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5 }
                }}
                style={{
                    width: smaller ? '180px' : 'min(250px, 60vw)',
                    height: smaller ? '180px' : 'min(250px, 60vw)',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: smaller ? '6px solid var(--secondary)' : '8px solid var(--secondary)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    marginBottom: smaller ? '1.5rem' : '3rem',
                    position: 'relative'
                }}
            >
                <img src={currentVideo.thumbnail} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '40px', height: '40px', background: '#0a0a0c', borderRadius: '50%', border: '4px solid var(--secondary)'
                }} />
            </motion.div>

            {/* Meta */}
            <div style={{ textAlign: 'center', marginBottom: smaller ? '1.5rem' : '3rem', width: '100%' }}>
                <h2 style={{ fontSize: smaller ? '1.2rem' : '1.5rem', fontWeight: 800, marginBottom: '0.5rem', padding: '0 1rem' }}>{currentVideo.title}</h2>
                <p style={{ color: '#8b5cf6', fontWeight: 600, fontSize: smaller ? '0.85rem' : '1rem' }}>{currentVideo.authorName}</p>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', padding: smaller ? '0 1rem' : '0 2rem', marginBottom: smaller ? '1.5rem' : '3rem' }}>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <motion.div
                        animate={{ width: `${progress}%` }}
                        transition={{ type: 'tween', ease: 'linear', duration: 1 }}
                        style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', borderRadius: '3px' }}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 600 }}>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <button
                    onClick={() => sendCommand('seek', { seconds: 0 })}
                    style={{ background: 'none', border: 'none', color: '#4b5563', cursor: 'pointer' }}
                >
                    <RotateCcw size={28} />
                </button>

                <button
                    onClick={() => sendCommand(isPlaying ? 'pause' : 'play')}
                    style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--primary)', color: '#fff', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 20px rgba(139, 92, 246, 0.4)',
                        cursor: 'pointer'
                    }}
                >
                    {isPlaying ? <Pause size={36} fill="white" /> : <Play size={36} fill="white" style={{ marginLeft: '4px' }} />}
                </button>

                <button
                    onClick={() => sendCommand('skip')}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                    <SkipForward size={32} fill="white" />
                </button>
            </div>

            {/* Volume / Extra settings (UX Polish) */}
            <div style={{ marginTop: '4rem', width: '100%', display: 'flex', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                <Volume2 size={20} />
                <div style={{ flex: 1, height: '2px', background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '70%', height: '100%', background: '#fff' }} />
                </div>
            </div>

        </div>
    );
}
