'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export function ParallaxHero() {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const el = ref.current;
      if (!el) return;
      const progress = Math.min(1, window.scrollY / window.innerHeight);
      setScale(1 + progress * 0.12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        backgroundColor: '#0d2318',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        <Image
          src="/hero.png"
          alt="El Floema"
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="100vw"
        />
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(13,35,24,0.5) 0%, rgba(13,35,24,0.2) 50%, rgba(13,35,24,0.7) 100%)',
          zIndex: 10,
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          pointerEvents: 'none',
        }}
      >
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", var(--font-cormorant), var(--font-cinzel), serif',
            fontSize: 'clamp(3.5rem, 10vw, 9rem)',
            fontWeight: 300,
            letterSpacing: '0.25em',
            color: '#c8a050',
            textTransform: 'uppercase',
            margin: 0,
            lineHeight: 1,
            textShadow: '0 4px 40px rgba(13,35,24,0.9)',
          }}
        >
          El Floema
        </h1>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", var(--font-cormorant), var(--font-crimson), serif',
            fontSize: 'clamp(1rem, 2.2vw, 1.6rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'rgba(235, 220, 185, 0.92)',
            marginTop: '1.25rem',
            letterSpacing: '0.12em',
            textShadow: '0 2px 24px rgba(13,35,24,0.95)',
          }}
        >
          Con ciencia, mi magia despierta
        </p>
      </div>
    </div>
  );
}
