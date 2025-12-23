'use client';

import { useState, useCallback, memo } from 'react';
import { Search, Plus, Loader2, Music } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';

interface Props {
    code: string;
    query: string;
    setQuery: (q: string) => void;
    results: any[];
    setResults: (r: any[]) => void;
}

export default function SearchTab({ code, query, setQuery, results, setResults }: Props) {
    const { socket } = useSocket();
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        try {
            const resp = await fetch(`/api/search?video=${encodeURIComponent(query)}`);
            const data = await resp.json();
            setResults(data.result?.slice(0, 15) || []); // Limit to top 15
        } catch (err) {
            console.error(err);
            alert('Lỗi khi tìm kiếm bài hát.');
        } finally {
            setLoading(false);
        }
    }, [query, setResults]);

    const addToQueue = useCallback((video: any) => {
        socket?.emit('add-to-queue', {
            code,
            item: {
                videoId: video.videoId,
                title: video.title,
                thumbnail: video.thumbnail,
                duration: video.duration,
                authorName: video.authorName
            }
        });

        // Optional: visual feedback
        alert(`Đã thêm: ${video.title}`);
    }, [socket, code]);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Tìm bài hát</h2>

            <form onSubmit={handleSearch} style={{ position: 'relative', marginBottom: '2.5rem' }}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Tên bài hát, tên ca sĩ..."
                    style={{
                        width: '100%',
                        padding: '1rem 3.5rem 1rem 1.2rem',
                        fontSize: '1.05rem',
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}
                />
                <button
                    type="submit"
                    style={{
                        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                        background: 'rgba(139, 92, 246, 0.1)', border: 'none', color: '#8b5cf6',
                        cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <Search size={20} />
                </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                        <Loader2 className="animate-spin" size={32} color="#8b5cf6" />
                    </div>
                ) : results.length > 0 ? (
                    results.map((video) => (
                        <VideoCard key={video.videoId} video={video} onAdd={addToQueue} />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
                        <Music size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>Nhập từ khóa để tìm bài hát karaoke</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const VideoCard = memo(function VideoCard({ video, onAdd }: { video: any; onAdd: (v: any) => void }) {
    return (
        <div
            style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)', padding: '0.8rem',
                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                transition: 'transform 0.1s ease',
                cursor: 'pointer'
            }}
            onTouchStart={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
            }}
            onTouchEnd={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
        >
            <img src={video.thumbnail} alt="" style={{ width: '90px', height: '60px', borderRadius: '12px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</p>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{video.authorName}</span>
                    <span style={{ fontSize: '0.7rem', color: '#4b5563' }}>• {video.duration}</span>
                </div>
            </div>
            <button
                onClick={() => onAdd(video)}
                style={{
                    background: '#8b5cf6', color: '#fff', border: 'none',
                    width: '36px', height: '36px', borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer'
                }}
            >
                <Plus size={20} />
            </button>
        </div>
    );
});
