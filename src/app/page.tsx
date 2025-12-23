'use client';

import Link from 'next/link';
import { Monitor, Smartphone, Mic2, Sparkles, Youtube, Music2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Dynamic Background Elements */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', top: '-10%', right: '-10%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: 'absolute', bottom: '-10%', left: '-10%',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            filter: 'blur(100px)'
          }}
        />
      </div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.8rem',
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '0.6rem 1.2rem',
            borderRadius: '100px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            marginBottom: '2rem'
          }}>
            <Sparkles size={16} color="#c084fc" />
            <span style={{ color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Thế hệ Karaoke mới</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 10vw, 5rem)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            color: '#fff'
          }}>
            KARA<span style={{
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))'
            }}>APP</span>
          </h1>

          <p style={{
            color: '#a1a1aa',
            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Tận hưởng trọn vẹn từng giai điệu với hệ thống điều khiển thông minh ngay trên điện thoại của bạn.
          </p>
        </motion.div>

        {/* Action Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          width: '100%',
        }}>
          {/* Display Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <Link href="/display" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.05))',
                  padding: '2rem',
                  borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(139, 92, 246, 0.1)'
                }}>
                  <Monitor size={56} color="#a78bfa" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Hát Trên TV</h2>
                  <p style={{ color: '#71717a', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Biến TV, iPad hoặc Máy tính của bạn thành một sân khấu Karaoke chuyên nghiệp với kho nhạc khổng lồ từ Youtube.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', color: '#c084fc', fontSize: '0.8rem', fontWeight: 700 }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '100px' }}>FULL HD</span>
                  <span style={{ padding: '4px 12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '100px' }}>YOUTUBE API</span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Remote Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            whileHover={{ y: -10 }}
          >
            <Link href="/remote" style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                padding: '4rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(236, 72, 153, 0.05))',
                  padding: '2rem',
                  borderRadius: '24px',
                  boxShadow: '0 10px 40px rgba(236, 72, 153, 0.1)'
                }}>
                  <Smartphone size={56} color="#f472b6" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#fff' }}>Dùng Điện Thoại</h2>
                  <p style={{ color: '#71717a', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Quét mã, nhập mã và điều khiển danh sách bài hát ngay tức thì. Không cần cài đặt ứng dụng, chỉ cần trình duyệt.
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', color: '#f472b6', fontSize: '0.8rem', fontWeight: 700 }}>
                  <span style={{ padding: '4px 12px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '100px' }}>QR CODE</span>
                  <span style={{ padding: '4px 12px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '100px' }}>REAL-TIME</span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Features Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            marginTop: '6rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.03)',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '4rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#52525b' }}>
            <Music2 size={24} />
            <span style={{ fontWeight: 600 }}>Tất cả bài hát</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#52525b' }}>
            <Users size={24} />
            <span style={{ fontWeight: 600 }}>Không giới hạn người dùng</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#52525b' }}>
            <Youtube size={24} />
            <span style={{ fontWeight: 600 }}>Nguồn nhạc sạch</span>
          </div>
        </motion.div>

        <footer style={{ marginTop: '4rem', padding: '2rem', color: '#3f3f46', fontSize: '0.85rem', textAlign: 'center' }}>
          &copy; 2025 KaraApp Studio. Crafted for unforgettable parties.
        </footer>
      </div>
    </main>
  );
}
