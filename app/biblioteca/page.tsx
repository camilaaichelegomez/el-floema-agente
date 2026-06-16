"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

function IconBotanica() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <line x1="19" y1="44" x2="19" y2="8" stroke="#5a7a3a" strokeWidth="1" opacity="0.65" strokeLinecap="round" />
      <path d="M19,36 C13,32 8,33 8,36 C8,39 13,39 19,36Z" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M19,36 C15,34 11,35 9,36" stroke="#5a7a3a" strokeWidth="0.55" fill="none" opacity="0.4" />
      <path d="M19,30 C25,26 30,27 30,30 C30,33 25,33 19,30Z" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M19,30 C23,28 27,29 29,30" stroke="#5a7a3a" strokeWidth="0.55" fill="none" opacity="0.4" />
      <path d="M19,22 C13,18 9,19 9,22 C9,25 14,25 19,22Z" stroke="#c8a050" strokeWidth="0.75" fill="none" opacity="0.48" />
      <path d="M19,22 C15,20 11,21 10,22" stroke="#5a7a3a" strokeWidth="0.5" fill="none" opacity="0.35" />
      <circle cx="19" cy="8" r="4.5" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="19" cy="8" r="1.8" fill="#c8a050" opacity="0.22" />
      <circle cx="19" cy="3"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.38" />
      <circle cx="24" cy="5"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.35" />
      <circle cx="14" cy="5"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.35" />
      <path d="M15,44 C12,46 10,44 9,46" stroke="#5a7a3a" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M23,44 C26,46 28,44 29,46" stroke="#5a7a3a" strokeWidth="0.6" fill="none" opacity="0.3" />
      <circle cx="19" cy="8" r="1" fill="#7a4a8a" opacity="0.4" />
    </svg>
  );
}

function IconCell() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="30" height="36" rx="7" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <circle cx="19" cy="21" r="7.5" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="19" cy="21" r="3.2" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.65" />
      <circle cx="20.5" cy="19.5" r="1" fill="#5a7a3a" opacity="0.5" />
      <ellipse cx="8" cy="12" rx="3" ry="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" transform="rotate(-20,8,12)" />
      <ellipse cx="30" cy="11" rx="3" ry="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" transform="rotate(20,30,11)" />
      <ellipse cx="7" cy="35" rx="3" ry="1.6" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" transform="rotate(15,7,35)" />
      <ellipse cx="31" cy="36" rx="3" ry="1.6" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" transform="rotate(-15,31,36)" />
      <ellipse cx="19" cy="34" rx="5.5" ry="3" fill="none" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function IconMolecule() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <polygon points="19,4 31,11 31,25 19,32 7,25 7,11" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <circle cx="19" cy="18" r="7" stroke="#c8a050" strokeWidth="0.5" fill="none" opacity="0.28" strokeDasharray="3 3" />
      <circle cx="19" cy="4"  r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="31" cy="11" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="31" cy="25" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="19" cy="32" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="7"  cy="25" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="7"  cy="11" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="19" cy="18" r="3" fill="none" stroke="#7a4a8a" strokeWidth="0.8" opacity="0.55" />
      <circle cx="19" cy="18" r="1.2" fill="#7a4a8a" opacity="0.4" />
      <line x1="19" y1="32" x2="19" y2="43" stroke="#5a7a3a" strokeWidth="0.8" opacity="0.5" />
      <circle cx="19" cy="44" r="1.5" fill="#5a7a3a" opacity="0.45" />
    </svg>
  );
}

function IconMortar() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <path d="M5,21 C5,34 10,43 19,43 C28,43 33,34 33,21 Z" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <path d="M3,21 L35,21" stroke="#c8a050" strokeWidth="1" opacity="0.5" />
      <line x1="28" y1="4" x2="16" y2="23" stroke="#c8a050" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />
      <ellipse cx="16" cy="24" rx="3.5" ry="1.6" fill="none" stroke="#c8a050" strokeWidth="0.8" opacity="0.5" transform="rotate(-30,16,24)" />
      <ellipse cx="14" cy="34" rx="4.5" ry="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" />
      <ellipse cx="24" cy="37" rx="3.5" ry="1.8" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" />
      <circle  cx="20" cy="32" r="1.5" fill="none" stroke="#7a4a8a" strokeWidth="0.6" opacity="0.4" />
    </svg>
  );
}

const CARDS = [
  {
    key: "botanica",
    label: "Botánica",
    desc: "Taxonomía, morfología y adaptaciones de las especies medicinales del sur de Chile.",
    Icon: IconBotanica,
    href: "/biblioteca/botanica",
  },
  {
    key: "fisiologia",
    label: "Fisiología Vegetal",
    desc: "La planta como fábrica química viva: cómo produce y almacena sus principios activos.",
    Icon: IconCell,
    href: "/biblioteca/fisiologia-vegetal",
  },
  {
    key: "metabolitos",
    label: "Metabolitos Secundarios",
    desc: "Terpenos, flavonoides y alcaloides: los compuestos que dan poder terapéutico a cada planta.",
    Icon: IconMolecule,
    href: "/biblioteca/metabolitos-secundarios",
  },
  {
    key: "extraccion",
    label: "Métodos de Extracción",
    desc: "Infusión, decocción, maceración y tintura: cómo capturar los activos de cada planta.",
    Icon: IconMortar,
    href: "/biblioteca/metodos-extraccion",
  },
];

function BibliotecaCard({
  label,
  desc,
  Icon,
  href,
}: {
  label: string;
  desc: string;
  Icon: () => React.JSX.Element;
  href: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "2.8rem 2rem 2.4rem",
          background: hovered
            ? "radial-gradient(ellipse 90% 70% at 50% 0%, rgba(200,160,80,0.1) 0%, rgba(200,160,80,0.03) 50%, transparent 80%), #162516"
            : "var(--bg-card)",
          border: `1px solid ${hovered ? "rgba(200,160,80,0.85)" : "rgba(200,160,80,0.18)"}`,
          boxShadow: hovered
            ? "0 0 0 1px rgba(200,160,80,0.25), 0 0 28px rgba(200,160,80,0.22), 0 0 60px rgba(200,160,80,0.08), 0 24px 56px rgba(0,0,0,0.7)"
            : "none",
          transform: hovered ? "translateY(-10px)" : "translateY(0)",
          cursor: "pointer",
          textDecoration: "none",
          position: "relative",
          overflow: "hidden",
          transition: "background 0.35s ease, border-color 0.3s ease, box-shadow 0.35s ease, transform 0.35s ease",
        }}
      >
        {/* corner brackets */}
        <span style={{
          position: "absolute", top: -1, left: -1, width: hovered ? 40 : 24, height: hovered ? 40 : 24,
          borderTop: `1.5px solid ${hovered ? "rgba(200,160,80,0.75)" : "rgba(200,160,80,0.3)"}`,
          borderLeft: `1.5px solid ${hovered ? "rgba(200,160,80,0.75)" : "rgba(200,160,80,0.3)"}`,
          transition: "width 0.35s, height 0.35s, border-color 0.35s", pointerEvents: "none",
        }} />
        <span style={{
          position: "absolute", bottom: -1, right: -1, width: hovered ? 40 : 24, height: hovered ? 40 : 24,
          borderBottom: `1.5px solid ${hovered ? "rgba(200,160,80,0.75)" : "rgba(200,160,80,0.3)"}`,
          borderRight: `1.5px solid ${hovered ? "rgba(200,160,80,0.75)" : "rgba(200,160,80,0.3)"}`,
          transition: "width 0.35s, height 0.35s, border-color 0.35s", pointerEvents: "none",
        }} />

        {/* icon */}
        <span style={{
          display: "block",
          marginBottom: "1.4rem",
          opacity: hovered ? 1 : 0.85,
          transform: hovered ? "scale(1.12)" : "scale(1)",
          transition: "opacity 0.35s, transform 0.35s",
        }}>
          <svg width="0" height="0" style={{ display: "none" }}>
            <defs>
              <filter id={`glow-icon`}>
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
          </svg>
          <Icon />
        </span>

        {/* title */}
        <span style={{
          fontFamily: "var(--font-grimoire)",
          fontSize: "0.88rem",
          letterSpacing: "0.22em",
          color: hovered ? "#e8c878" : "#c8a050",
          textTransform: "uppercase",
          display: "block",
          lineHeight: 1.3,
          marginBottom: "0.75rem",
          transition: "color 0.35s",
        }}>
          {label}
        </span>

        {/* description */}
        <span style={{
          fontFamily: "var(--font-body)",
          fontStyle: "italic",
          fontSize: "0.85rem",
          color: hovered ? "rgba(212,196,160,0.82)" : "rgba(212,196,160,0.52)",
          lineHeight: 1.6,
          display: "block",
          marginBottom: "1.4rem",
          transition: "color 0.35s ease",
        }}>
          {desc}
        </span>

        {/* explorar */}
        <span style={{
          fontFamily: "var(--font-grimoire)",
          fontSize: "0.64rem",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "#e8c878",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          textShadow: "0 0 14px rgba(200,160,80,0.6)",
        }}>
          Explorar →
        </span>
      </Link>
    </motion.div>
  );
}

export default function BibliotecaPage() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        paddingTop: "clamp(6rem, 14vh, 10rem)",
        paddingBottom: "clamp(4rem, 8vh, 7rem)",
      }}>
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          style={{ textAlign: "center", marginBottom: "clamp(3rem, 6vh, 5rem)", padding: "0 1.5rem" }}
        >
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            maxWidth: 360, margin: "0 auto 1.1rem", opacity: 0.35,
          }}>
            <span style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)", display: "block" }} />
            <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8a050", whiteSpace: "nowrap" }}>
              Conocimiento
            </span>
            <span style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)", display: "block" }} />
          </div>

          <h1 style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "clamp(2.2rem, 6vw, 4rem)",
            color: "#c8a050",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            margin: "0 0 0.8rem",
            textShadow: "0 0 80px rgba(200,160,80,0.25), 0 0 160px rgba(200,160,80,0.1)",
          }}>
            La Biblioteca
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
            color: "rgba(212,196,160,0.45)",
            letterSpacing: "0.07em",
            margin: 0,
          }}>
            Conocimiento ancestral · Ciencia viva
          </p>
        </motion.div>

        {/* cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "clamp(1rem, 2vw, 1.75rem)",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 clamp(1.25rem, 3vw, 2.5rem)",
        }}>
          {CARDS.map(({ key, label, desc, Icon, href }) => (
            <BibliotecaCard key={key} label={label} desc={desc} Icon={Icon} href={href} />
          ))}
        </div>

        {/* back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ textAlign: "center", marginTop: "clamp(3rem, 6vh, 5rem)" }}
        >
          <Link href="/" style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.58rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(200,160,80,0.45)",
            textDecoration: "none",
            transition: "color 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#c8a050")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(200,160,80,0.45)")}
          >
            ← Volver al inicio
          </Link>
        </motion.div>
      </main>
    </>
  );
}
