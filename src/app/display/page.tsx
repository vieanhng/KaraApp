'use client';

import { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import YouTube, { YouTubeProps, YouTubePlayer } from 'react-youtube';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic2, Loader2, ListMusic, Play, Pause, SkipForward, Smartphone, RefreshCw } from 'lucide-react';

interface QueueItem {
    videoId: string;
    title: string;
    thumbnail: string;
    duration: string;
    authorName: string;
}

export default function DisplayPage() {
    const { socket, isConnected } = useSocket();
    const [sessionCode, setSessionCode] = useState<string | null>(null);
    const [remoteConnected, setRemoteConnected] = useState(false);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [currentVideo, setCurrentVideo] = useState<QueueItem | null>(null);
    const [player, setPlayer] = useState<YouTubePlayer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showTitleToast, setShowTitleToast] = useState(false);
    const playerRef = useRef<YouTubePlayer | null>(null);
    const sessionCodeRef = useRef<string | null>(null);
    const queueRef = useRef<QueueItem[]>([]);

    useEffect(() => {
        queueRef.current = queue;
    }, [queue]);

    useEffect(() => {
        sessionCodeRef.current = sessionCode;
    }, [sessionCode]);

    useEffect(() => {
        if (currentVideo) {
            setShowTitleToast(true);
            const timer = setTimeout(() => {
                setShowTitleToast(false);
            }, 8000); // Show for 8 seconds
            return () => clearTimeout(timer);
        }
    }, [currentVideo]);

    useEffect(() => {
        if (!isPlaying && currentVideo) {
            setShowTitleToast(true);
        }
    }, [isPlaying, currentVideo]);

    useEffect(() => {
        if (!isPlaying || !currentVideo || !playerRef.current || !sessionCodeRef.current) return;

        const interval = setInterval(() => {
            const p = playerRef.current;
            if (p) {
                const currentTime = p.getCurrentTime();
                const duration = p.getDuration();
                socket?.emit('update-playback', {
                    code: sessionCodeRef.current,
                    state: {
                        currentTime: Math.floor(currentTime),
                        duration: Math.floor(duration)
                    }
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isPlaying, currentVideo, socket]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        // Create session only if not already created
        if (!sessionCodeRef.current) {
            const savedCode = localStorage.getItem('karaoke_session_code');
            socket.emit('create-session', savedCode);
        }

        socket.on('session-created', ({ code, queue: initialQueue, playbackState: initialPlayback }) => {
            setSessionCode(code);
            localStorage.setItem('karaoke_session_code', code);
            if (initialQueue) setQueue(initialQueue);
            if (initialPlayback?.currentVideo) setCurrentVideo(initialPlayback.currentVideo);
        });

        socket.on('remote-connected', () => {
            setRemoteConnected(true);
        });

        socket.on('remote-disconnected', () => {
            setRemoteConnected(false);
        });

        socket.on('queue-updated', (newQueue: QueueItem[]) => {
            setQueue(newQueue);
        });

        socket.on('player-command', ({ command, data }) => {
            const p = playerRef.current;
            if (!p) return;

            switch (command) {
                case 'play':
                    p.playVideo();
                    break;
                case 'pause':
                    p.pauseVideo();
                    break;
                case 'skip':
                    playNext(queueRef.current);
                    break;
                case 'seek':
                    p.seekTo(data.seconds, true);
                    break;
            }
        });

        return () => {
            socket.off('session-created');
            socket.off('remote-connected');
            socket.off('remote-disconnected');
            socket.off('queue-updated');
            socket.off('player-command');
        };
    }, [socket, isConnected]); // Only depend on connection status

    // Separate effect for auto-playing
    useEffect(() => {
        if (!currentVideo && queue.length > 0) {
            playNext(queue);
        }
    }, [queue, currentVideo]);

    const playNext = (targetQueue = queue) => {
        const code = sessionCodeRef.current;
        if (targetQueue.length > 0) {
            const next = targetQueue[0];
            setCurrentVideo(next);

            // Update queue on server (remove first item)
            if (code) {
                socket?.emit('remove-from-queue', { code: code, index: 0 });
                socket?.emit('update-playback', {
                    code: code,
                    state: { currentVideo: next, isPlaying: true }
                });
            }
        } else {
            setCurrentVideo(null);
            if (code) {
                socket?.emit('update-playback', {
                    code: code,
                    state: { currentVideo: null, isPlaying: false }
                });
            }
        }
    };

    const handleResetSession = () => {
        if (sessionCode && confirm('Bạn có chắc chắn muốn đổi mã kết nối mới? Mọi thiết bị đang kết nối sẽ bị ngắt.')) {
            socket?.emit('reset-session', sessionCode);
            localStorage.removeItem('karaoke_session_code');
        }
    };

    const handleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullScreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullScreen(false);
            }
        }
    };

    const onPlayerReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        setPlayer(event.target);
    };

    const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
        const state = event.data;
        // 1 = playing, 2 = paused, 0 = ended
        setIsPlaying(state === 1);

        if (sessionCode) {
            socket?.emit('update-playback', {
                code: sessionCode,
                state: { isPlaying: state === 1 }
            });
        }

        if (state === 0) { // Ended
            playNext();
        }
    };

    if (!isConnected) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
                <Loader2 className="animate-spin" size={48} color="#8b5cf6" />
            </div>
        );
    }

    return (
        <div style={{ height: '100vh', background: '#000', overflow: 'hidden', position: 'relative' }}>

            {/* Background Ambience */}
            {currentVideo && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${currentVideo.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(100px) opacity(0.3)',
                    zIndex: 0
                }} />
            )}

            {/* Start Button Overlay (Browser requirement for gesture) */}
            <AnimatePresence>
                {!isFullScreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.9)', zIndex: 1000,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: '2rem'
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <Mic2 size={64} color="#8b5cf6" style={{ marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Nhấn để bắt đầu</h2>
                            <p style={{ color: '#a1a1aa' }}>Bật chế độ toàn màn hình và bắt đầu phiên hát</p>
                        </div>
                        <button
                            onClick={handleFullScreen}
                            className="premium-btn"
                            style={{ padding: '1.5rem 3rem', fontSize: '1.2rem' }}
                        >
                            BẮT ĐẦU NGAY
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div
                style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex' }}
                onMouseEnter={() => setShowControls(true)}
                onMouseLeave={() => setShowControls(false)}
            >

                {/* Playback Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                    {currentVideo ? (
                        <div style={{ width: '100%', height: '100%' }}>
                            <YouTube
                                videoId={currentVideo.videoId}
                                opts={{
                                    width: '100%',
                                    height: '100%',
                                    playerVars: {
                                        autoplay: 1,
                                        controls: 0,
                                        rel: 0,
                                        showinfo: 0,
                                        modestbranding: 1,
                                    },
                                }}
                                onReady={onPlayerReady}
                                onStateChange={onPlayerStateChange}
                                style={{ width: '100%', height: '100%' }}
                                className="youtube-container"
                            />

                            {/* Playback Overlay (Pause Icon) */}
                            <AnimatePresence>
                                {!isPlaying && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        style={{
                                            position: 'absolute',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            background: 'rgba(0,0,0,0.5)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        <div className="glass-card" style={{ padding: '2rem' }}>
                                            <Pause size={64} color="#fff" />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                            <Mic2 size={120} color="#8b5cf6" style={{ marginBottom: '2rem', opacity: 0.5 }} />
                            <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>Sẵn sàng hát chưa?</h1>
                            <p style={{ fontSize: '1.5rem', opacity: 0.7 }}>Quét mã hoặc nhập mã để bắt đầu</p>
                        </div>
                    )}

                    {/* On-Screen Controls Overlay */}
                    <AnimatePresence>
                        {showControls && currentVideo && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    padding: '2rem',
                                    zIndex: 20
                                }}
                            >
                                {/* Top Bar */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <div className="glass-card" style={{ padding: '0.8rem 1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <Mic2 size={24} color="#8b5cf6" />
                                        <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>KaraApp Live</span>
                                    </div>

                                    <button
                                        onClick={handleResetSession}
                                        className="control-btn-circle"
                                        title="Đổi mã kết nối mới"
                                    >
                                        <RefreshCw size={24} />
                                    </button>
                                </div>

                                {/* Bottom Control Strip */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}>
                                    <button
                                        onClick={() => {
                                            const p = playerRef.current;
                                            if (p) p.seekTo(p.getCurrentTime() - 10, true);
                                        }}
                                        className="control-btn-circle"
                                    >
                                        <SkipForward size={24} style={{ transform: 'rotate(180deg)' }} />
                                    </button>

                                    <button
                                        onClick={() => {
                                            const p = playerRef.current;
                                            if (isPlaying) p?.pauseVideo();
                                            else p?.playVideo();
                                        }}
                                        style={{
                                            width: '80px', height: '80px', borderRadius: '50%',
                                            background: 'var(--primary)', border: 'none', color: '#fff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 0 30px rgba(139, 92, 246, 0.4)'
                                        }}
                                    >
                                        {isPlaying ? <Pause size={32} /> : <Play size={32} fill="white" />}
                                    </button>

                                    <button
                                        onClick={() => playNext(queueRef.current)}
                                        className="control-btn-circle"
                                    >
                                        <SkipForward size={32} />
                                    </button>

                                    <button
                                        onClick={handleFullScreen}
                                        className="control-btn-circle"
                                    >
                                        <Smartphone size={24} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Session Code Badge (Visible when sidebar hidden) */}
                    <AnimatePresence>
                        {currentVideo && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                style={{
                                    position: 'absolute', top: '2rem', right: '2rem', zIndex: 10,
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem'
                                }}
                            >
                                <div className="glass-card" style={{ padding: '0.5rem 1rem', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid var(--primary)' }}>
                                    <p style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Mã kết nối</p>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{sessionCode}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Current Info Toast - Fixed Styling */}
                    <AnimatePresence>
                        {currentVideo && showTitleToast && (
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -100, opacity: 0 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '3rem',
                                    left: '3rem',
                                    maxWidth: '600px',
                                    display: 'flex',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    padding: '1.2rem',
                                    background: 'rgba(10, 10, 12, 0.85)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '24px',
                                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                    zIndex: 15
                                }}
                            >
                                <div style={{ position: 'relative' }}>
                                    <img src={currentVideo.thumbnail} alt="" style={{ width: '140px', height: '105px', borderRadius: '14px', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--primary)', padding: '4px', borderRadius: '50%' }}>
                                        <Mic2 size={16} color="white" />
                                    </div>
                                </div>
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <span style={{
                                        fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 800,
                                        display: 'inline-block', padding: '2px 8px', background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '6px', marginBottom: '0.5rem', textTransform: 'uppercase'
                                    }}>
                                        Đang phát
                                    </span>
                                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{currentVideo.title}</h3>
                                    <p style={{ fontSize: '1.1rem', color: '#a1a1aa', fontWeight: 500 }}>{currentVideo.authorName}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar (Code & Queue) - Hidden when playing */}
                <motion.div
                    initial={false}
                    animate={{
                        width: currentVideo ? 0 : 'min(400px, 35vw)',
                        opacity: currentVideo ? 0 : 1,
                        x: currentVideo ? 400 : 0
                    }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    style={{
                        background: 'rgba(10, 10, 12, 0.95)',
                        backdropFilter: 'blur(30px)',
                        borderLeft: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                    }}
                >
                    <div style={{ padding: '2.5rem', width: 'min(400px, 35vw)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Code Section */}
                        <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
                            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mã kết nối</p>
                            <div style={{
                                fontSize: '4.5rem',
                                fontWeight: 900,
                                color: '#fff',
                                letterSpacing: '0.1em',
                                lineHeight: '1.2',
                                paddingBottom: '0.2rem',
                                background: 'linear-gradient(to bottom, #fff, #8b5cf6)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))'
                            }}>
                                {sessionCode || '------'}
                            </div>
                            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: remoteConnected ? '#10b981' : '#ef4444' }}>
                                <div style={{
                                    width: '10px', height: '10px', borderRadius: '50%',
                                    background: 'currentColor',
                                    boxShadow: remoteConnected ? '0 0 15px #10b981' : 'none'
                                }} />
                                <span style={{ fontSize: '1rem', fontWeight: 600 }}>
                                    {remoteConnected ? 'Điều khiển đã sẵn sàng' : 'Chưa có kết nối'}
                                </span>
                            </div>
                        </div>

                        {/* Queue Section */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '2rem', color: '#fff' }}>
                                <ListMusic size={24} color="#8b5cf6" />
                                <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Danh sách chờ ({queue.length})</h2>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingRight: '0.5rem' }}>
                                {queue.length === 0 ? (
                                    <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.3 }}>
                                        <Mic2 size={48} style={{ margin: '0 auto 1rem' }} />
                                        <p>Chưa có bài nào</p>
                                    </div>
                                ) : (
                                    queue.map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            gap: '1.2rem',
                                            alignItems: 'center',
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '1rem',
                                            borderRadius: '16px',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <span style={{ color: '#8b5cf6', fontWeight: 900, fontSize: '1.2rem', minWidth: '24px' }}>{index + 1}</span>
                                            <img src={item.thumbnail} alt="" style={{ width: '80px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                                            <div style={{ overflow: 'hidden' }}>
                                                <p style={{ fontSize: '1rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                                <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>{item.duration}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>

            <style jsx global>{`
        .youtube-container iframe {
          border: none;
        }
      `}</style>
        </div>
    );
}
