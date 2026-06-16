"use client";

import { useEffect, useRef } from "react";

/** Canvas de partículas doradas (#c8a050) para el hero — capa local, no full-screen */
export function HeroGoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    const resize = () => {
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (parent) ro.observe(parent);

    type P = {
      x: number;
      y: number;
      size: number;
      maxOpacity: number;
      speed: number;
      drift: number;
      phase: number;
      phaseSpeed: number;
    };

    const mk = (): P => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.25,
      maxOpacity: Math.random() * 0.45 + 0.08,
      speed: Math.random() * 0.18 + 0.03,
      drift: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: Math.random() * 0.014 + 0.003,
    });

    let particles: P[] = [];
    const refill = () => {
      const n = Math.min(95, Math.floor((canvas.width * canvas.height) / 12000));
      particles = Array.from({ length: n }, mk);
    };
    refill();

    let animId = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += p.drift;
        p.phase += p.phaseSpeed;
        if (p.y < -8) {
          p.y = canvas.height + 8;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -8) p.x = canvas.width + 8;
        if (p.x > canvas.width + 8) p.x = -8;
        const tw = Math.sin(p.phase) * 0.5 + 0.5;
        const a = p.maxOpacity * tw;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 160, 80, ${a * 0.85})`;
        ctx.fill();
        if (p.size > 1.05 && tw > 0.62) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(212, 196, 160, ${a * 0.12})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="hero-gold-particles"
    />
  );
}
