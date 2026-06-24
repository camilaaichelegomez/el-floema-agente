'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const BOSQUES = ['/bosque-1.jpg', '/bosque-2.jpg', '/bosque-3.jpg'];

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function getOpacity(index: number, progress: number) {
  if (index === 0) return 1;
  const seg = 1 / (BOSQUES.length - 1);
  const start = (index - 1) * seg;
  const end = index * seg;
  return clamp((progress - start) / (end - start), 0, 1);
}

export function PageBackground() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      const afterHero = window.scrollY - heroHeight;
      const remaining = document.body.scrollHeight - heroHeight - window.innerHeight;
      if (remaining <= 0 || afterHero < 0) return;
      setProgress(clamp(afterHero / remaining, 0, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        backgroundColor: '#0d2318',
      }}
    >
      {BOSQUES.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: getOpacity(i, progress),
            transition: 'opacity 0.3s ease',
          }}
        >
          <Image
            src={src}
            alt=""
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
          background: 'rgba(13,35,24,0.55)',
        }}
      />
    </div>
  );
}
