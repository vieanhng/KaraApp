'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useSocket } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ListMusic, Play, Pause, SkipForward, Mic2, Smartphone, Loader2, ArrowLeft } from 'lucide-react';
import ConnectionPortal from '@/components/remote/ConnectionPortal';
import SearchTab from '@/components/remote/SearchTab';
import QueueTab from '@/components/remote/QueueTab';
import NowPlayingControls from '@/components/remote/NowPlayingControls';

export type Tab = 'search' | 'queue' | 'playing';

export default function RemotePage() {
    const { socket, isConnected } = useSocket();
    const [sessionCode, setSessionCode] = useState<string | null>(null);
    const [isJoined, setIsJoined] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('search');

    // App state from server
    const [queue, setQueue] = useState<any[]>([]);
    const [playbackState, setPlaybackState] = useState<any>(null);

    // Persisted Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Define handleJoin with useCallback to avoid dependency issues
    const handleJoin = useCallback((code: string) => {
        setSessionCode(code);
        socket?.emit('join-session', code);
    }, [socket]);

    // Load saved session code from localStorage on mount
    useEffect(() => {
        const savedCode = localStorage.getItem('karaapp_session_code');
        if (savedCode && socket && isConnected && !isJoined) {
            console.log('🔄 Auto-reconnecting to saved session:', savedCode);
            handleJoin(savedCode);
        }
    }, [socket, isConnected, isJoined, handleJoin]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.on('joined-success', ({ queue, playbackState }) => {
            setIsJoined(true);
            setQueue(queue);
            setPlaybackState(playbackState);
            // Save session code to localStorage
            if (sessionCode) {
                localStorage.setItem('karaapp_session_code', sessionCode);
                console.log('💾 Session code saved to localStorage:', sessionCode);
            }
        });

        socket.on('queue-updated', (newQueue) => {
            setQueue(newQueue);
        });

        socket.on('playback-updated', (newState) => {
            setPlaybackState(newState);
        });

        socket.on('display-disconnected', () => {
            setIsJoined(false);
            setSessionCode(null);
            localStorage.removeItem('karaapp_session_code');
            alert('Màn hình hiển thị đã ngắt kết nối.');
        });

        socket.on('error', (msg) => {
            alert(msg);
            // If error, clear saved session
            setIsJoined(false);
            setSessionCode(null);
            localStorage.removeItem('karaapp_session_code');
        });

        return () => {
            socket.off('joined-success');
            socket.off('queue-updated');
            socket.off('playback-updated');
            socket.off('display-disconnected');
            socket.off('error');
        };
    }, [socket, isConnected, sessionCode]);

    const handleChangeCode = () => {
        if (confirm('Bạn có chắc muốn đổi mã kết nối?')) {
            setIsJoined(false);
            setSessionCode(null);
            localStorage.removeItem('karaapp_session_code');
            console.log('🔄 Session code cleared, ready for new connection');
        }
    };

    if (!isConnected) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
                <Loader2 className="animate-spin" size={32} color="#8b5cf6" />
            </div>
        );
    }

    if (!isJoined) {
        return <ConnectionPortal onJoin={handleJoin} />;
    }

    return (
        <div className="remote-root" style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            background: '#0a0a0c',
            color: '#fff',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'relative',
            boxShadow: '0 0 100px rgba(0,0,0,0.5)',
            borderLeft: '1px solid rgba(255,255,255,0.05)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
        }}>
            {/* Mobile Header */}
            <header className="remote-header-mob" style={{
                padding: '1.2rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(10,10,12,0.9)',
                backdropFilter: 'blur(8px)',
                zIndex: 20
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        padding: '0.5rem',
                        borderRadius: '10px'
                    }}>
                        <Mic2 size={20} color="#fff" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.1rem', fontWeight: 800 }}>KaraApp <span style={{ color: '#8b5cf6', fontSize: '0.75rem' }}>REMOTE</span></h1>
                        <p style={{ fontSize: '0.7rem', color: '#10b981' }}>● Code: {sessionCode}</p>
                    </div>
                </div>
                <button
                    onClick={handleChangeCode}
                    style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#a1a1aa', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                    <ArrowLeft size={18} />
                </button>
            </header>

            <div className="remote-main-view" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* Landscape Sidebar Nav */}
                <nav className="remote-side-nav">
                    <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.8rem', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', borderRadius: '16px' }}>
                            <Mic2 size={32} color="#fff" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>KaraApp</h2>
                            <p style={{ fontSize: '0.8rem', color: '#10b981' }}>Connected: {sessionCode}</p>
                        </div>
                    </div>
                    <NavBtn active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={22} />} label="Tìm bài hát" vertical />
                    <NavBtn active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} icon={<ListMusic size={22} />} label="Hàng chờ" badge={queue.length} vertical />
                    <NavBtn active={activeTab === 'playing'} onClick={() => setActiveTab('playing')} icon={<Mic2 size={22} />} label="Đã chọn" vertical />

                    <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <button
                            onClick={handleChangeCode}
                            style={{ width: '100%', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Đổi mã kết nối
                        </button>
                    </div>
                </nav>

                {/* Content Area */}
                <div className="remote-tab-content hide-scrollbar" style={{ flex: 1, overflowY: 'auto' }}>
                    <main style={{ padding: '1rem', paddingBottom: '120px' }}>
                        <AnimatePresence mode="wait">
                            {activeTab === 'search' && (
                                <motion.div key="search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                    <SearchTab
                                        code={sessionCode!}
                                        query={searchQuery}
                                        setQuery={setSearchQuery}
                                        results={searchResults}
                                        setResults={setSearchResults}
                                    />
                                </motion.div>
                            )}
                            {activeTab === 'queue' && (
                                <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                    <QueueTab code={sessionCode!} queue={queue} />
                                </motion.div>
                            )}
                            {activeTab === 'playing' && (
                                <motion.div key="playing" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                                    <NowPlayingControls code={sessionCode!} playbackState={playbackState} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>

                {/* Landscape Persistent Control Side */}
                <aside className="remote-persistent-side hide-scrollbar">
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '2rem', color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Play size={20} fill="#8b5cf6" /> Đang biểu diễn
                    </h2>
                    {playbackState?.currentVideo ? (
                        <NowPlayingControls code={sessionCode!} playbackState={playbackState} smaller={true} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.3, border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '24px' }}>
                            <Mic2 size={48} style={{ margin: '0 auto 1rem' }} />
                            <p>Sân khấu đang trống</p>
                        </div>
                    )}
                </aside>
            </div>

            {/* Mobile Persistent Mini Player */}
            <div className="remote-mini-player-mob">
                <AnimatePresence>
                    {playbackState?.currentVideo && activeTab !== 'playing' && (
                        <motion.div
                            initial={{ x: '-50%', y: 20, opacity: 0 }}
                            animate={{ x: '-50%', y: 0, opacity: 1 }}
                            exit={{ x: '-50%', y: 20, opacity: 0 }}
                            onClick={() => setActiveTab('playing')}
                            style={{
                                position: 'fixed', bottom: '90px', left: '50%',
                                width: 'calc(100% - 2rem)', maxWidth: '560px',
                                background: 'rgba(30,30,36,0.9)', backdropFilter: 'blur(20px)',
                                borderRadius: '20px', padding: '0.7rem 1rem',
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6)', cursor: 'pointer',
                                overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', zIndex: 15
                            }}
                        >
                            <img src={playbackState.currentVideo.thumbnail} alt="" style={{ width: '45px', height: '45px', borderRadius: '12px', objectFit: 'cover' }} />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.85rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{playbackState.currentVideo.title}</p>
                                <p style={{ fontSize: '0.7rem', color: '#8b5cf6', fontWeight: 600 }}>{playbackState.isPlaying ? 'Đang hát...' : 'Đã tạm dừng'}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Pause size={18} fill="white" />
                                <SkipForward size={18} fill="white" />
                            </div>
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.1)' }}>
                                <div style={{ width: `${(playbackState.currentTime / playbackState.duration) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #ec4899)', transition: 'width 0.3s linear' }} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Mobile Navigation */}
            <div className="remote-nav-mob" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '600px', zIndex: 25 }}>
                <nav className="pb-safe" style={{ background: 'rgba(10,10,12,0.95)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'space-around', padding: '0.8rem 0', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <NavBtn active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={22} />} label="Tìm bài" />
                    <NavBtn active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} icon={<ListMusic size={22} />} label="Hàng chờ" badge={queue.length} />
                    <NavBtn active={activeTab === 'playing'} onClick={() => setActiveTab('playing')} icon={<Mic2 size={22} />} label="Đang hát" />
                </nav>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

const NavBtn = memo(function NavBtn({ active, onClick, icon, label, badge, vertical = false }: any) {
    const buttonStyle = useMemo(() => ({
        background: vertical && active ? 'rgba(139, 92, 246, 0.1)' : 'none',
        border: 'none',
        color: active ? '#8b5cf6' : '#6b7280',
        display: 'flex',
        flexDirection: vertical ? 'row' : 'column',
        alignItems: 'center',
        gap: vertical ? '0.8rem' : '0.4rem',
        padding: vertical ? '0.8rem 1rem' : '0',
        borderRadius: vertical ? '12px' : '0',
        cursor: 'pointer',
        flex: vertical ? 'none' : 1,
        width: vertical ? '100%' : 'auto',
        position: 'relative',
        transition: 'color 0.2s ease, background 0.2s ease',
        justifyContent: vertical ? 'flex-start' : 'center'
    }), [vertical, active]);

    const iconStyle = useMemo(() => ({
        transform: active ? (vertical ? 'scale(1)' : 'scale(1.1) translateY(-2px)') : 'scale(1)',
        transition: 'transform 0.2s ease'
    }), [active, vertical]);

    return (
        <button onClick={onClick} style={buttonStyle as any}>
            <div style={iconStyle}>
                {icon}
            </div>
            <span style={{
                fontSize: vertical ? '0.9rem' : '0.65rem',
                fontWeight: active ? 700 : 600,
                textTransform: vertical ? 'none' : 'uppercase',
                letterSpacing: vertical ? '0' : '0.05em'
            } as any}>
                {label}
            </span>
            {badge > 0 && (
                <span style={{
                    position: 'absolute',
                    top: vertical ? '50%' : -4,
                    right: vertical ? '0.8rem' : '25%',
                    transform: vertical ? 'translateY(-50%)' : 'none',
                    background: 'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                    color: '#fff',
                    fontSize: vertical ? '0.75rem' : '0.6rem',
                    minWidth: vertical ? '22px' : '18px',
                    height: vertical ? '22px' : '18px',
                    borderRadius: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    border: '1.5px solid #0a0a0c',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.5)',
                    padding: vertical ? '0 4px' : '0'
                } as any}>
                    {badge}
                </span>
            )}
            {active && !vertical && (
                <div style={{
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#8b5cf6'
                } as any} />
            )}
        </button>
    );
});
