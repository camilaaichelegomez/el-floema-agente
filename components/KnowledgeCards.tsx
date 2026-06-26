"use client";
import { motion } from "framer-motion";
import { MouseEvent, useRef, useState } from "react";
import Link from "next/link";

function IconCell() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      {/* Cell wall */}
      <rect x="4" y="5" width="30" height="36" rx="7" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      {/* Nucleus */}
      <circle cx="19" cy="21" r="7.5" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="19" cy="21" r="3.2" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.65" />
      <circle cx="20.5" cy="19.5" r="1" fill="#5a7a3a" opacity="0.5" />
      {/* Chloroplasts */}
      <ellipse cx="8" cy="12" rx="3" ry="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" transform="rotate(-20,8,12)" />
      <ellipse cx="30" cy="11" rx="3" ry="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" transform="rotate(20,30,11)" />
      <ellipse cx="7" cy="35" rx="3" ry="1.6" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" transform="rotate(15,7,35)" />
      <ellipse cx="31" cy="36" rx="3" ry="1.6" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" transform="rotate(-15,31,36)" />
      {/* Vacuole */}
      <ellipse cx="19" cy="34" rx="5.5" ry="3" fill="none" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function IconMolecule() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      {/* Hexagonal ring */}
      <polygon points="19,4 31,11 31,25 19,32 7,25 7,11"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      {/* Inner dashed ring */}
      <circle cx="19" cy="18" r="7" stroke="#c8a050" strokeWidth="0.5" fill="none" opacity="0.28" strokeDasharray="3 3" />
      {/* Vertex atoms */}
      <circle cx="19" cy="4"  r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="31" cy="11" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="31" cy="25" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="19" cy="32" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="7"  cy="25" r="1.8" fill="#c8a050" opacity="0.5" />
      <circle cx="7"  cy="11" r="1.8" fill="#c8a050" opacity="0.5" />
      {/* Center atom */}
      <circle cx="19" cy="18" r="3" fill="none" stroke="#7a4a8a" strokeWidth="0.8" opacity="0.55" />
      <circle cx="19" cy="18" r="1.2" fill="#7a4a8a" opacity="0.4" />
      {/* Side chains */}
      <line x1="19" y1="32" x2="19" y2="43" stroke="#5a7a3a" strokeWidth="0.8" opacity="0.5" />
      <circle cx="19" cy="44" r="1.5" fill="#5a7a3a" opacity="0.45" />
      <line x1="31" y1="11" x2="38" y2="7"  stroke="#5a7a3a" strokeWidth="0.7" opacity="0.4" />
      <line x1="7"  cy="11" x2="0"  y2="7"  stroke="#5a7a3a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function IconMortar() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      {/* Bowl body */}
      <path d="M5,21 C5,34 10,43 19,43 C28,43 33,34 33,21 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      {/* Rim */}
      <path d="M3,21 L35,21" stroke="#c8a050" strokeWidth="1" opacity="0.5" />
      <path d="M3,21 Q2,19 3.5,19" stroke="#c8a050" strokeWidth="0.7" fill="none" opacity="0.35" />
      <path d="M35,21 Q36,19 34.5,19" stroke="#c8a050" strokeWidth="0.7" fill="none" opacity="0.35" />
      {/* Pestle */}
      <line x1="28" y1="4" x2="16" y2="23" stroke="#c8a050" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />
      <ellipse cx="16" cy="24" rx="3.5" ry="1.6" fill="none" stroke="#c8a050" strokeWidth="0.8" opacity="0.5" transform="rotate(-30,16,24)" />
      {/* Herbs inside */}
      <ellipse cx="14" cy="34" rx="4.5" ry="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.55" />
      <ellipse cx="24" cy="37" rx="3.5" ry="1.8" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" />
      <circle  cx="20" cy="32" r="1.5" fill="none" stroke="#7a4a8a" strokeWidth="0.6" opacity="0.4" />
      {/* Drop rising from pestle tip */}
      <path d="M15,21 C14.5,19 15,17.5 15,17.5 C15,17.5 15.5,19 15,21 Z" fill="#c8a050" opacity="0.35" />
    </svg>
  );
}

function IconBotanica() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      {/* Central stem */}
      <line x1="19" y1="44" x2="19" y2="8" stroke="#5a7a3a" strokeWidth="1" opacity="0.65" strokeLinecap="round" />
      {/* Left leaf lower */}
      <path d="M19,36 C13,32 8,33 8,36 C8,39 13,39 19,36Z"
        stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M19,36 C15,34 11,35 9,36" stroke="#5a7a3a" strokeWidth="0.55" fill="none" opacity="0.4" />
      {/* Right leaf lower */}
      <path d="M19,30 C25,26 30,27 30,30 C30,33 25,33 19,30Z"
        stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.55" />
      <path d="M19,30 C23,28 27,29 29,30" stroke="#5a7a3a" strokeWidth="0.55" fill="none" opacity="0.4" />
      {/* Left leaf upper */}
      <path d="M19,22 C13,18 9,19 9,22 C9,25 14,25 19,22Z"
        stroke="#c8a050" strokeWidth="0.75" fill="none" opacity="0.48" />
      <path d="M19,22 C15,20 11,21 10,22" stroke="#5a7a3a" strokeWidth="0.5" fill="none" opacity="0.35" />
      {/* Crown flower */}
      <circle cx="19" cy="8" r="4.5" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <circle cx="19" cy="8" r="1.8" fill="#c8a050" opacity="0.22" />
      <circle cx="19" cy="3"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.38" />
      <circle cx="24" cy="5"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.35" />
      <circle cx="14" cy="5"  r="1.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.35" />
      {/* Root hint */}
      <path d="M15,44 C12,46 10,44 9,46" stroke="#5a7a3a" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M23,44 C26,46 28,44 29,46" stroke="#5a7a3a" strokeWidth="0.6" fill="none" opacity="0.3" />
      {/* Purple accent — vacuole dot */}
      <circle cx="19" cy="8" r="1" fill="#7a4a8a" opacity="0.4" />
    </svg>
  );
}

function IconJarCream() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      {/* Jar body */}
      <path d="M6,18 C4,20 4,40 6,42 L32,42 C34,40 34,20 32,18 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      {/* Lid */}
      <rect x="5" y="10" width="28" height="9" rx="2.5"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      {/* Label on lid */}
      <line x1="10" y1="14.5" x2="28" y2="14.5" stroke="#c8a050" strokeWidth="0.5" opacity="0.28" />
      <circle cx="19" cy="14.5" r="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.65" opacity="0.5" />
      {/* Wavy cream surface */}
      <path d="M8,24 Q13,21 19,24 Q25,27 30,24"
        stroke="#d4c4a0" strokeWidth="0.7" fill="none" opacity="0.35" />
      <path d="M8,29 Q13,26 19,29 Q25,32 30,29"
        stroke="#d4c4a0" strokeWidth="0.6" fill="none" opacity="0.22" />
      {/* Emulsion droplets */}
      <circle cx="12" cy="35" r="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.5" />
      <circle cx="26" cy="37" r="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" />
      <circle cx="20" cy="39" r="1.3" fill="none" stroke="#7a4a8a" strokeWidth="0.6" opacity="0.4" />
      {/* Lid shine */}
      <line x1="7" y1="11.5" x2="13" y2="11.5" stroke="#c8a050" strokeWidth="0.5" opacity="0.18" />
    </svg>
  );
}

const modules = [
  {
    key: "botanica",
    label: "Botánica",
    subtitle: "El lenguaje de las plantas",
    Icon: IconBotanica,
    href: "/biblioteca/botanica",
  },
  {
    key: "fisiologia",
    label: "Fisiología Vegetal",
    subtitle: "La planta como fábrica química viva",
    Icon: IconCell,
    href: "/biblioteca/fisiologia-vegetal",
  },
  {
    key: "metabolitos",
    label: "Metabolitos Secundarios",
    subtitle: "Los activos que transforma tu piel",
    Icon: IconMolecule,
    href: "/biblioteca/metabolitos-secundarios",
  },
  {
    key: "extraccion",
    label: "Métodos de Extracción",
    subtitle: "Infusión, decocción, maceración",
    Icon: IconMortar,
    href: "/biblioteca/metodos-extraccion",
  },
];

export function KnowledgeCards() {
  const [visible, setVisible] = useState(false);
  const [toastKey, setToastKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    setToastKey((k) => k + 1);
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2600);
  };

  const setCardCursor = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    target.style.setProperty("--cursor-x", `${x}px`);
    target.style.setProperty("--cursor-y", `${y}px`);
  };

  const resetCardCursor = (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const target = event.currentTarget;
    target.style.setProperty("--cursor-x", "50%");
    target.style.setProperty("--cursor-y", "50%");
  };

  return (
    <>
      <section
        style={{
          padding: "clamp(80px, 10vh, 120px) clamp(32px, 5vw, 80px)",
          position: "relative",
          zIndex: 10,
          maxWidth: 1200,
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "1rem",
              opacity: 0.7,
              maxWidth: 360,
              margin: "0 auto 1rem",
            }}
          >
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c8a050)" }} />
            <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#e8c070", whiteSpace: "nowrap", textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}>
              Conocimiento
            </span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c8a050)" }} />
          </div>
          {/* Main title */}
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)",
              color: "#e8c070",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: "0 0 0.75rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)",
            }}
          >
            La Biblioteca
          </h2>
          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-crimson), serif",
              fontSize: "1.15rem",
              fontStyle: "italic",
              color: "rgba(225,210,175,1)",
              letterSpacing: "0.08em",
              margin: 0,
              textShadow: "0 2px 10px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)",
            }}
          >
            Conocimiento ancestral · Ciencia viva
          </p>
        </div>

        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
            gap: "clamp(10px, 1.5vw, 18px)",
            listStyle: "none",
            padding: 0,
            margin: "0 auto",
            maxWidth: 1100,
          }}
        >
          {modules.map(({ key, label, subtitle, Icon, href }) => (
            <motion.li
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.95, ease: "easeOut", delay: 0.06 }}
            >
              {href ? (
                <Link
                  href={href}
                  className="nav-card knowledge-card"
                  onMouseMove={setCardCursor}
                  onMouseLeave={resetCardCursor}
                >
                  <span className="nav-card-icon">
                    <Icon />
                  </span>
                  <span className="nav-card-title">{label}</span>
                  <span className="nav-card-subtitle">{subtitle}</span>
                </Link>
              ) : (
                <button
                  onClick={handleClick}
                  onMouseMove={setCardCursor}
                  onMouseLeave={resetCardCursor}
                  className="nav-card knowledge-card"
                  aria-label={`${label} — Próximamente`}
                >
                  <span className="nav-card-icon">
                    <Icon />
                  </span>
                  <span className="nav-card-title">{label}</span>
                  <span className="nav-card-subtitle">{subtitle}</span>
                </button>
              )}
            </motion.li>
          ))}
        </ul>
      </section>

      {visible && (
        <div
          key={toastKey}
          role="status"
          aria-live="polite"
          className="proximamente-toast"
        >
          <span aria-hidden="true" style={{ opacity: 0.6, fontSize: "0.75em" }}>✦</span>
          <span>Próximamente</span>
          <span aria-hidden="true" style={{ opacity: 0.6, fontSize: "0.75em" }}>✦</span>
        </div>
      )}
    </>
  );
}
