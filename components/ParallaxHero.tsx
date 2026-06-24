'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const IMAGES = [
  { src: '/Gemini_Generated_Image_ (7).png', alt: 'La bruja en su laboratorio' },
  { src: '/bosque-hero.jpg', alt: 'El bosque' },
  { src: '/bosque-plantas.jpg', alt: 'Plantas del bosque' },
  { src: '/bosque-agente.jpg', alt: 'Agente del bosque' },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getOpacity(index: number, progress: number) {
  if (index === 0) return 1;
  const segmentSize = 1 / (IMAGES.length - 1);
  const start = (index - 1) * segmentSize;
  const end = index * segmentSize;
  return clamp((progress - start) / (end - start), 0, 1);
}

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(clamp(scrolled / totalScrollable, 0, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scale = 1 + progress * 0.15;

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0d2318',
        }}
      >
        {IMAGES.map((img, i) => (
          <div
            key={img.src}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: getOpacity(i, progress),
              transform: `scale(${scale})`,
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              style={{ objectFit: 'cover' }}
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(13,35,24,0.6) 0%, rgba(13,35,24,0.25) 50%, rgba(13,35,24,0.6) 100%)',
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
    </div>
  );
}
