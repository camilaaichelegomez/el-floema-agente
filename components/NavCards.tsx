"use client";

import { motion } from "framer-motion";
import { MouseEvent } from "react";

function IconLeaf() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <path
        d="M19,42 C19,42 5,30 5,18 C5,9 11,3 19,3 C27,3 33,9 33,18 C33,30 19,42 19,42 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.65"
      />
      <path
        d="M19,5 C19,5 10,13 10,21 C10,29 15,35 19,40"
        stroke="#5a7a3a" strokeWidth="0.8" fill="none" opacity="0.7"
      />
      <path
        d="M19,14 C16,11 12,11 11,14" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.5"
      />
      <path
        d="M19,22 C16,19 12,20 11,23" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.5"
      />
      <line x1="19" y1="42" x2="19" y2="46" stroke="#5a7a3a" strokeWidth="0.9" opacity="0.5" />
    </svg>
  );
}

function IconFlask() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <path
        d="M15,3 L15,18 L6,34 C4,39 7,43 13,43 L25,43 C31,43 34,39 32,34 L23,18 L23,3 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6"
      />
      <line x1="12" y1="3" x2="26" y2="3" stroke="#c8a050" strokeWidth="1" opacity="0.5" />
      <line x1="13" y1="8" x2="25" y2="8" stroke="#c8a050" strokeWidth="0.5" opacity="0.3" />
      <circle cx="14" cy="33" r="3.5" fill="none" stroke="#5a7a3a" strokeWidth="0.8" opacity="0.6" />
      <circle cx="23" cy="37" r="2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.45" />
      <circle cx="26" cy="29" r="1.5" fill="none" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.4" />
    </svg>
  );
}

function IconScroll() {
  return (
    <svg width="42" height="46" viewBox="0 0 42 46" fill="none" aria-hidden="true">
      <rect x="8" y="6" width="26" height="34" rx="1.5" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <path d="M8,6 C8,3 5,1 3,3.5 C1,6 3,8.5 5.5,7" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M34,6 C34,3 37,1 39,3.5 C41,6 39,8.5 36.5,7" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M8,40 C8,43 5,45 3,42.5 C1,40 3,37.5 5.5,39" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M34,40 C34,43 37,45 39,42.5 C41,40 39,37.5 36.5,39" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <line x1="14" y1="15" x2="28" y2="15" stroke="#c8a050" strokeWidth="0.7" opacity="0.4" />
      <line x1="14" y1="21" x2="28" y2="21" stroke="#c8a050" strokeWidth="0.7" opacity="0.4" />
      <line x1="14" y1="27" x2="24" y2="27" stroke="#c8a050" strokeWidth="0.7" opacity="0.3" />
      <circle cx="21" cy="33" r="2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.5" />
    </svg>
  );
}

function IconJarCream() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <path d="M6,18 C4,20 4,40 6,42 L32,42 C34,40 34,20 32,18 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <rect x="5" y="10" width="28" height="9" rx="2.5"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6" />
      <line x1="10" y1="14.5" x2="28" y2="14.5" stroke="#c8a050" strokeWidth="0.5" opacity="0.28" />
      <circle cx="19" cy="14.5" r="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.65" opacity="0.5" />
      <path d="M8,24 Q13,21 19,24 Q25,27 30,24"
        stroke="#d4c4a0" strokeWidth="0.7" fill="none" opacity="0.35" />
      <path d="M8,29 Q13,26 19,29 Q25,32 30,29"
        stroke="#d4c4a0" strokeWidth="0.6" fill="none" opacity="0.22" />
      <circle cx="12" cy="35" r="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.5" />
      <circle cx="26" cy="37" r="1.7" fill="none" stroke="#5a7a3a" strokeWidth="0.6" opacity="0.45" />
      <circle cx="20" cy="39" r="1.3" fill="none" stroke="#7a4a8a" strokeWidth="0.6" opacity="0.4" />
      <line x1="7" y1="11.5" x2="13" y2="11.5" stroke="#c8a050" strokeWidth="0.5" opacity="0.18" />
    </svg>
  );
}

function IconJar() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <rect x="12" y="2" width="14" height="7" rx="2" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.5" />
      <path
        d="M9,9 C5,11 5,39 9,41 L29,41 C33,39 33,11 29,9 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.6"
      />
      <line x1="9" y1="17" x2="29" y2="17" stroke="#c8a050" strokeWidth="0.6" opacity="0.25" />
      <ellipse cx="16" cy="27" rx="4" ry="3" fill="none" stroke="#5a7a3a" strokeWidth="0.8" opacity="0.55" />
      <ellipse cx="24" cy="33" rx="3" ry="2.5" fill="none" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.45" />
      <circle cx="22" cy="23" r="1.5" fill="none" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.4" />
      <path d="M13,36 C15,32 23,32 25,36" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.35" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none" aria-hidden="true">
      <path
        d="M25,6 C17,7 11,14 11,23 C11,32 17,39 25,40 C20,42 13,41 9,36 C4,30 4,16 9,10 C13,5 20,4 25,6 Z"
        stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.62"
      />
      <path d="M28,20 C25,17 21,17 20,20" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.5" />
      <path d="M28,26 C25,23 21,24 20,27" stroke="#5a7a3a" strokeWidth="0.7" fill="none" opacity="0.45" />
      <line x1="30" y1="14" x2="30" y2="32" stroke="#5a7a3a" strokeWidth="0.7" opacity="0.4" />
      <path d="M30,32 C30,36 28,38 26,40" stroke="#5a7a3a" strokeWidth="0.6" fill="none" opacity="0.3" />
      <g stroke="#7a4a8a" strokeWidth="0.7" opacity="0.5">
        <path d="M31,7 l0,4 M29,9 l4,0" />
      </g>
      <circle cx="9" cy="14" r="0.9" fill="#c8a050" opacity="0.45" />
      <circle cx="33" cy="37" r="0.9" fill="#7a4a8a" opacity="0.45" />
    </svg>
  );
}

const sections = [
  {
    key: "ingredientes",
    label: "Ingredientes",
    subtitle: "Raíces, extractos & botánica viva",
    href: "/ingredientes",
    Icon: IconLeaf,
  },
  {
    key: "formulas",
    label: "Fórmulas",
    subtitle: "Ciencia aplicada a lo natural",
    href: "/formulas",
    Icon: IconFlask,
  },
  {
    key: "recetas",
    label: "Recetas",
    subtitle: "Creaciones del grimorio",
    href: "/recetas",
    Icon: IconScroll,
  },
  {
    key: "cosmetica",
    label: "Bases de Cosmética",
    subtitle: "Emulsiones, anhidros, geles",
    href: "/biblioteca/bases-cosmetica",
    Icon: IconJarCream,
  },
  {
    key: "bruja-verde",
    label: "Bruja Verde",
    subtitle: "Correspondencias, sahumerios & ritual",
    href: "/bruja-verde",
    Icon: IconMoon,
  },
];

export function NavCards() {
  const setCardCursor = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    target.style.setProperty("--cursor-x", `${x}px`);
    target.style.setProperty("--cursor-y", `${y}px`);
  };

  const resetCardCursor = (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget;
    target.style.setProperty("--cursor-x", "50%");
    target.style.setProperty("--cursor-y", "50%");
  };

  return (
    <section
      style={{
        padding: "clamp(80px, 10vh, 120px) clamp(32px, 5vw, 80px)",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Section label */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "clamp(20px, 3vh, 36px)",
          opacity: 0.35,
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c8a050)" }} />
        <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8a050" }}>
          El Grimorio
        </span>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c8a050)" }} />
      </div>

      <ul
        className="grimorio-cards-list"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(180px, 22vw, 260px), 1fr))",
          gap: "clamp(20px, 2.5vw, 36px)",
          listStyle: "none",
          padding: 0,
          margin: 0,
          alignItems: "start",
        }}
      >
        {sections.map(({ key, label, subtitle, href, Icon }, i) => (
          <motion.li
            key={key}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: i * 0.08 }}
          >
            <a
              href={href}
              className="nav-card grimorio-card"
              onMouseMove={setCardCursor}
              onMouseLeave={resetCardCursor}
            >
              <span className="nav-card-gem tl" aria-hidden="true" />
              <span className="nav-card-gem tr" aria-hidden="true" />
              <span className="nav-card-gem bl" aria-hidden="true" />
              <span className="nav-card-gem br" aria-hidden="true" />
              <span className="grimorio-card-gradient" aria-hidden="true" />
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", alignItems: "center", position: "relative", zIndex: 2 }}>
                <span className="nav-card-icon">
                  <Icon />
                </span>
                <span className="nav-card-title">{label}</span>
              </div>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
