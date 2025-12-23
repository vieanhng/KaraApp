'use client';

import { useCallback, memo } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Trash2, ChevronUp, ChevronDown, ListMusic } from 'lucide-react';

interface Props {
    code: string;
    queue: any[];
}

export default function QueueTab({ code, queue }: Props) {
    const { socket } = useSocket();

    const handleRemove = useCallback((index: number) => {
        socket?.emit('remove-from-queue', { code, index });
    }, [socket, code]);

    const moveUp = useCallback((index: number) => {
        if (index === 0) return;
        const newQueue = [...queue];
        [newQueue[index - 1], newQueue[index]] = [newQueue[index], newQueue[index - 1]];
        socket?.emit('reorder-queue', { code, newQueue });
    }, [socket, code, queue]);

    const moveDown = useCallback((index: number) => {
        if (index === queue.length - 1) return;
        const newQueue = [...queue];
        [newQueue[index], newQueue[index + 1]] = [newQueue[index + 1], newQueue[index]];
        socket?.emit('reorder-queue', { code, newQueue });
    }, [socket, code, queue]);

    return (
        <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 800 }}>Danh sách chờ</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {queue.length > 0 ? (
                    queue.map((item, index) => (
                        <QueueItem
                            key={`${item.videoId}-${index}`}
                            item={item}
                            index={index}
                            isFirst={index === 0}
                            isLast={index === queue.length - 1}
                            onRemove={handleRemove}
                            onMoveUp={moveUp}
                            onMoveDown={moveDown}
                        />
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#4b5563' }}>
                        <ListMusic size={48} style={{ marginBottom: '1rem', opacity: 0.2 }} />
                        <p>Hàng đợi trống. Hãy thêm bài hát mới!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const QueueItem = memo(function QueueItem({
    item,
    index,
    isFirst,
    isLast,
    onRemove,
    onMoveUp,
    onMoveDown
}: {
    item: any;
    index: number;
    isFirst: boolean;
    isLast: boolean;
    onRemove: (i: number) => void;
    onMoveUp: (i: number) => void;
    onMoveDown: (i: number) => void;
}) {
    return (
        <div
            style={{
                display: 'flex', gap: '1rem', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)', padding: '0.8rem',
                borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)',
                opacity: 1,
                transform: 'scale(1)',
                transition: 'opacity 0.2s ease, transform 0.2s ease'
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
                        onClick={() => onMoveUp(index)}
                        disabled={isFirst}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px', cursor: 'pointer', opacity: isFirst ? 0.2 : 1 }}
                    >
                        <ChevronUp size={16} />
                    </button>
                    <button
                        onClick={() => onMoveDown(index)}
                        disabled={isLast}
                        style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', borderRadius: '4px', padding: '2px', cursor: 'pointer', opacity: isLast ? 0.2 : 1 }}
                    >
                        <ChevronDown size={16} />
                    </button>
                </div>
                <button
                    onClick={() => onRemove(index)}
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
        </div>
    );
});
