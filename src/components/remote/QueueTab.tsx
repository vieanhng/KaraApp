'use client';

import { useSocket } from '@/context/SocketContext';
import { Trash2, ChevronUp, ChevronDown, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    code: string;
    queue: any[];
}

export default function QueueTab({ code, queue }: Props) {
    const { socket } = useSocket();

    const handleRemove = (index: number) => {
        socket?.emit('remove-from-queue', { code, index });
    };

    const moveUp = (index: number) => {
        if (index === 0) return;
        const newQueue = [...queue];
        [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
        socket?.emit('reorder-queue', { code, newQueue });
    };

    const moveDown = (index: number) => {
        if (index === queue.length - 1) return;
        const newQueue = [...queue];
        [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
        socket?.emit('reorder-queue', { code, newQueue });
    };

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Danh sách chờ</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <AnimatePresence>
                    {queue.length > 0 ? (
                        queue.map((item, index) => (
                            <motion.div
                                key={`${item.videoId}-${index}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                style={{
                                    display: 'flex', gap: '1rem', alignItems: 'center',
                                    background: 'rgba(255,255,255,0.03)', padding: '0.8rem',
                                    borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#8b5cf6'
                                }}>
                                    {index + 1}
                                </div>
                                <img src={item.thumbnail} alt="" style={{ width: '80px', height: '55px', borderRadius: '10px', objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }} />
                                <div style={{ flex: 1, overflow: 'hidden' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                                    <p style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>{item.duration}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.3rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                        <button
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px', cursor: 'pointer', opacity: index === 0 ? 0.2 : 1 }}
                                        >
                                            <ChevronUp size={16} />
                                        </button>
                                        <button
                                            onClick={() => moveDown(index)}
                                            disabled={index === queue.length - 1}
                                            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px', cursor: 'pointer', opacity: index === queue.length - 1 ? 0.2 : 1 }}
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(index)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none',
                                            width: '32px', height: '32px', borderRadius: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
                            <ListMusic size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                            <p>Hàng đợi trống. Hãy thêm bài hát mới!</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
