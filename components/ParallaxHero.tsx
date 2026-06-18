"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroGoldParticles } from "@/components/HeroGoldParticles";

/* ── Animated botanical branch ──────────────────────────────── */
function BotanicalBranch() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
      style={{ display: "flex", justifyContent: "center", margin: "1.6rem 0 1.2rem" }}
    >
      <motion.svg
        width="200"
        height="150"
        viewBox="0 0 200 150"
        fill="none"
        aria-hidden="true"
        style={{ originX: 0.5, originY: 1 }}
        animate={{ rotate: [-1.2, 1.2, -1.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      >
        {/* Central stem */}
        <path d="M100 148 C99 130 100 110 100 55" stroke="#c8a050" strokeWidth="0.85" opacity="0.55" />

        {/* Left main branch */}
        <path d="M100 85 C84 76 64 72 50 74" stroke="#c8a050" strokeWidth="0.75" opacity="0.45" />
        {/* Right main branch */}
        <path d="M100 85 C116 76 136 72 150 74" stroke="#c8a050" strokeWidth="0.75" opacity="0.45" />

        {/* Left secondary branch */}
        <path d="M100 68 C88 62 74 60 64 62" stroke="#c8a050" strokeWidth="0.65" opacity="0.38" />
        {/* Right secondary branch */}
        <path d="M100 68 C112 62 126 60 136 62" stroke="#c8a050" strokeWidth="0.65" opacity="0.38" />

        {/* Left leaves */}
        <ellipse cx="48" cy="68"  rx="13" ry="5.5" stroke="#c8a050" strokeWidth="0.7" opacity="0.42" transform="rotate(-28 48 68)" />
        <ellipse cx="62" cy="56"  rx="10" ry="4.5" stroke="#3d5228" strokeWidth="0.65" opacity="0.48" transform="rotate(-18 62 56)" />
        <ellipse cx="33" cy="72"  rx="9"  ry="4"   stroke="#3d5228" strokeWidth="0.6"  opacity="0.35" transform="rotate(-38 33 72)" />

        {/* Right leaves */}
        <ellipse cx="152" cy="68" rx="13" ry="5.5" stroke="#c8a050" strokeWidth="0.7" opacity="0.42" transform="rotate(28 152 68)" />
        <ellipse cx="138" cy="56" rx="10" ry="4.5" stroke="#3d5228" strokeWidth="0.65" opacity="0.48" transform="rotate(18 138 56)" />
        <ellipse cx="167" cy="72" rx="9"  ry="4"   stroke="#3d5228" strokeWidth="0.6"  opacity="0.35" transform="rotate(38 167 72)" />

        {/* Crown leaf */}
        <ellipse cx="100" cy="38" rx="11" ry="20" stroke="#c8a050" strokeWidth="0.75" opacity="0.42" />
        <path d="M100 18 L100 58" stroke="#3d5228" strokeWidth="0.6" opacity="0.32" />

        {/* Small leaf tips on secondary branches */}
        <ellipse cx="62"  cy="57" rx="7" ry="3" stroke="#3d5228" strokeWidth="0.55" opacity="0.3" transform="rotate(-22 62 57)" />
        <ellipse cx="138" cy="57" rx="7" ry="3" stroke="#3d5228" strokeWidth="0.55" opacity="0.3" transform="rotate(22 138 57)" />

        {/* Gold accent dots */}
        <circle cx="50"  cy="70" r="1.5" fill="#c8a050" opacity="0.28" />
        <circle cx="150" cy="70" r="1.5" fill="#c8a050" opacity="0.28" />
        <circle cx="100" cy="18" r="2"   fill="#c8a050" opacity="0.38" />

        {/* Subtle radial glow at crown */}
        <circle cx="100" cy="38" r="18" stroke="#c8a050" strokeWidth="0.4" opacity="0.12" />

        {/* Base ornament */}
        <path d="M82 148 L100 142 L118 148" stroke="#c8a050" strokeWidth="0.55" opacity="0.28" />
        <circle cx="100" cy="148" r="2" fill="#c8a050" opacity="0.22" />
      </motion.svg>
    </motion.div>
  );
}

/* ── Hero ───────────────────────────────────────────────────── */
export function ParallaxHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const bgY = scrollY * 0.25;
  const contentY = scrollY * -0.07;

  return (
    <motion.section
      className="parallax-hero"
      aria-label="Portada El Floema"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Image layer — moves slower than scroll for parallax */}
      <div
        className="parallax-hero__bg"
        style={{
          transform: `translate3d(0, ${bgY}px, 0)`,
          backgroundImage: `url('/Gemini_Generated_Image_ (7).png')`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />

      {/* Solid dark overlay for text readability */}
      <div className="parallax-hero__overlay" aria-hidden="true" />

      <HeroGoldParticles />
      <div className="parallax-hero__vignette" aria-hidden="true" />

      <motion.div
        className="parallax-hero__content"
        style={{ y: contentY }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: "easeOut" }}
      >
        {/* Title */}
        <motion.h1
          className="parallax-hero__title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
        >
          EL FLOEMA
        </motion.h1>

        {/* Animated botanical illustration */}
        <BotanicalBranch />

        {/* Tagline */}
        <motion.p
          className="parallax-hero__tagline"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.42, ease: "easeOut" }}
        >
          Con ciencia, mi magia despierta
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#plantas"
          className="parallax-hero__cta"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.52, ease: "easeOut" }}
        >
          Explorar el grimorio
        </motion.a>

        {/* Bottom decoration */}
        <motion.div
          className="parallax-hero__bottom-deco"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1.2, delay: 0.65, ease: "easeOut" }}
        >
          <span className="parallax-hero__deco-line" />
          <span className="parallax-hero__deco-dot" />
          <span className="parallax-hero__deco-line" />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
