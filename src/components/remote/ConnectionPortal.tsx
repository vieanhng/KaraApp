'use client';

import { useState, useCallback } from 'react';
import { Smartphone, ChevronRight } from 'lucide-react';

interface Props {
    onJoin: (code: string) => void;
}

export default function ConnectionPortal({ onJoin }: Props) {
    const [code, setCode] = useState('');

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (code.length === 6) {
            onJoin(code);
        }
    }, [code, onJoin]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value.replace(/[^0-9]/g, ''));
    }, []);

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
            <div
                style={{
                    width: '100%',
                    maxWidth: '450px',
                    position: 'relative',
                    zIndex: 1,
                    animation: 'fadeInUp 0.5s ease-out'
                }}
            >
                <div className="glass-card" style={{
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
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
                            onChange={handleChange}
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
                                borderRadius: '16px',
                                color: '#fff',
                                outline: 'none',
                                transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)';
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
                                letterSpacing: '0.05em',
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                border: 'none',
                                borderRadius: '16px',
                                color: '#fff',
                                cursor: code.length === 6 ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'opacity 0.2s ease, transform 0.1s ease'
                            }}
                            onTouchStart={(e) => {
                                if (code.length === 6) {
                                    (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)';
                                }
                            }}
                            onTouchEnd={(e) => {
                                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                            }}
                        >
                            Bắt đầu hát <ChevronRight size={20} />
                        </button>
                    </form>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
