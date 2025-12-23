'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ChevronRight } from 'lucide-react';

interface Props {
    onJoin: (code: string) => void;
}

export default function ConnectionPortal({ onJoin }: Props) {
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length === 6) {
            onJoin(code);
        }
    };

    return (
        <div style={{
            height: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            background: '#0a0a0c',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', top: '-10%', right: '-10%',
                    width: '300px', height: '300px', borderRadius: '50%',
                    background: 'rgba(139, 92, 246, 0.15)', filter: 'blur(80px)',
                    zIndex: 0
                }}
            />
            <motion.div
                animate={{
                    scale: [1.2, 1, 1.2],
                    x: [0, -50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    position: 'absolute', bottom: '-10%', left: '-10%',
                    width: '350px', height: '350px', borderRadius: '50%',
                    background: 'rgba(236, 72, 153, 0.1)', filter: 'blur(100px)',
                    zIndex: 0
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ width: '100%', maxWidth: '450px', position: 'relative', zIndex: 1 }}
            >
                <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        width: '70px', height: '70px', borderRadius: '20px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.3)'
                    }}>
                        <Smartphone size={32} color="#fff" />
                    </div>

                    <h1 style={{ fontSize: '1.8rem', marginBottom: '0.8rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Kết nối điều khiển</h1>
                    <p style={{ color: '#a1a1aa', marginBottom: '2.5rem', fontSize: '0.95rem', lineHeight: 1.6 }}>Nhập mã 6 chữ số đang hiển thị trên màn hình TV của bạn để bắt đầu.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <input
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="000 000"
                            style={{
                                fontSize: '2rem',
                                textAlign: 'center',
                                letterSpacing: '0.2em',
                                width: '100%',
                                fontWeight: 800,
                                padding: '1.2rem',
                                background: 'rgba(0,0,0,0.3)',
                                border: '2px solid rgba(139, 92, 246, 0.2)',
                                borderRadius: '16px'
                            }}
                            autoFocus
                        />

                        <button
                            type="submit"
                            className="premium-btn"
                            disabled={code.length !== 6}
                            style={{
                                opacity: code.length === 6 ? 1 : 0.4,
                                padding: '1.2rem',
                                fontSize: '1rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}
                        >
                            Bắt đầu hát <ChevronRight size={20} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
