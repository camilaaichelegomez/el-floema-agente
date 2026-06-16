"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const GOLD = "#c8a050";

const plantas = [
  {
    key: "matico",
    name: "Matico",
    latin: "Piper aduncum",
    desc: "Poderoso cicatrizante y antiinflamatorio de los Andes. Sus flavonoides y aceites esenciales regulan la inflamación cutánea y aceleran la reparación tisular.",
  },
  {
    key: "maqui",
    name: "Maqui",
    latin: "Aristotelia chilensis",
    desc: "La superfruta del mundo. Con la mayor concentración de antocianinas conocida, protege la piel del daño oxidativo y activa la regeneración celular.",
  },
  {
    key: "arrayan",
    name: "Arrayán",
    latin: "Luma apiculata",
    desc: "Árbol emblemático del bosque templado lluvioso. Sus aceites esenciales antisépticos equilibran la microbiota cutánea y aportan fragancia botánica única.",
  },
];

function IconMatico() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path d="M36 64 C36 64 12 46 12 28 C12 15 22 6 36 6 C50 6 60 15 60 28 C60 46 36 64 36 64Z"
        stroke="#c8a050" strokeWidth="0.85" fill="none" opacity="0.45" />
      <path d="M36 8 C24 20 24 38 36 60" stroke="#3d5228" strokeWidth="0.9" fill="none" opacity="0.65" />
      <path d="M36 20 C28 15 20 17 18 22" stroke="#3d5228" strokeWidth="0.75" fill="none" opacity="0.5" />
      <path d="M36 34 C28 28 20 31 18 36" stroke="#3d5228" strokeWidth="0.75" fill="none" opacity="0.45" />
      <path d="M36 20 C44 15 52 17 54 22" stroke="#3d5228" strokeWidth="0.75" fill="none" opacity="0.4" />
      <path d="M36 34 C44 28 52 31 54 36" stroke="#3d5228" strokeWidth="0.65" fill="none" opacity="0.35" />
      <circle cx="36" cy="46" r="3" fill="none" stroke="#c8a050" strokeWidth="0.7" opacity="0.3" />
    </svg>
  );
}

function IconMaqui() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      <path d="M36 62 C24 54 10 42 12 28 C14 14 26 8 36 8 C46 8 58 14 60 28 C62 42 48 54 36 62Z"
        stroke="#7a4a8a" strokeWidth="0.85" fill="none" opacity="0.45" />
      <circle cx="36" cy="22" r="5"   fill="none" stroke="#7a4a8a" strokeWidth="0.75" opacity="0.5" />
      <circle cx="24" cy="34" r="4.5" fill="none" stroke="#7a4a8a" strokeWidth="0.7"  opacity="0.45" />
      <circle cx="48" cy="34" r="4.5" fill="none" stroke="#7a4a8a" strokeWidth="0.7"  opacity="0.45" />
      <circle cx="28" cy="48" r="4"   fill="none" stroke="#7a4a8a" strokeWidth="0.65" opacity="0.4" />
      <circle cx="44" cy="48" r="4"   fill="none" stroke="#7a4a8a" strokeWidth="0.65" opacity="0.4" />
      <circle cx="36" cy="55" r="3.5" fill="none" stroke="#7a4a8a" strokeWidth="0.6"  opacity="0.35" />
      <path d="M36 8 C34 4 33 2 36 1 C39 2 38 4 36 8" stroke="#3d5228" strokeWidth="0.7" fill="none" opacity="0.45" />
    </svg>
  );
}

function IconArrayan() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
      {/* Trunk */}
      <path d="M36 66 C36 50 36 36 36 20" stroke="#3d5228" strokeWidth="1.1" fill="none" opacity="0.65" />
      {/* Main branches left */}
      <path d="M36 44 C28 38 18 36 12 38" stroke="#3d5228" strokeWidth="0.85" fill="none" opacity="0.55" />
      {/* Main branches right */}
      <path d="M36 44 C44 38 54 36 60 38" stroke="#3d5228" strokeWidth="0.85" fill="none" opacity="0.55" />
      {/* Upper branches */}
      <path d="M36 32 C29 26 20 24 15 26" stroke="#3d5228" strokeWidth="0.75" fill="none" opacity="0.5" />
      <path d="M36 32 C43 26 52 24 57 26" stroke="#3d5228" strokeWidth="0.75" fill="none" opacity="0.5" />
      {/* Left leaves */}
      <ellipse cx="10" cy="35" rx="8" ry="4"   stroke="#c8a050" strokeWidth="0.7"  fill="none" opacity="0.45" transform="rotate(-12 10 35)" />
      <ellipse cx="14" cy="23" rx="7" ry="3.5" stroke="#c8a050" strokeWidth="0.65" fill="none" opacity="0.4"  transform="rotate(-18 14 23)" />
      {/* Right leaves */}
      <ellipse cx="62" cy="35" rx="8" ry="4"   stroke="#c8a050" strokeWidth="0.7"  fill="none" opacity="0.45" transform="rotate(12 62 35)" />
      <ellipse cx="58" cy="23" rx="7" ry="3.5" stroke="#c8a050" strokeWidth="0.65" fill="none" opacity="0.4"  transform="rotate(18 58 23)" />
      {/* Crown */}
      <ellipse cx="36" cy="13" rx="10" ry="7" stroke="#c8a050" strokeWidth="0.75" fill="none" opacity="0.42" />
      {/* Berries — characteristic of arrayán */}
      <circle cx="10" cy="32" r="2.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.42" />
      <circle cx="62" cy="32" r="2.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.42" />
      <circle cx="36" cy="8"  r="2"   fill="#c8a050"                                  opacity="0.35" />
      {/* Root hint */}
      <path d="M32 66 C28 68 24 66 22 69" stroke="#3d5228" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M40 66 C44 68 48 66 50 69" stroke="#3d5228" strokeWidth="0.6" fill="none" opacity="0.3" />
    </svg>
  );
}

const Icons: Record<string, () => React.ReactElement> = {
  matico:  IconMatico,
  maqui:   IconMaqui,
  arrayan: IconArrayan,
};

export function PlantasSection() {
  return (
    <section id="plantas" className="plantas-section">
      <div className="plantas-section__header">
        <div className="section-label-row" style={{ maxWidth: 420, margin: "0 auto 0.75rem" }}>
          <span className="section-label-line" />
          <span className="section-label-text">Plantas Destacadas</span>
          <span className="section-label-line" />
        </div>
        <h2 className="section-title">El Jardín del Grimorio</h2>
        <p className="plantas-section__subtitle">
          Botánica científica del sur del mundo
        </p>
      </div>

      <div className="plantas-grid">
        {plantas.map(({ key, name, latin, desc }, i) => {
          const Icon = Icons[key];
          return (
            <motion.div
              key={key}
              className="planta-card"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: "easeOut" }}
            >
              {/* puntos decorativos morados */}
              <span className="planta-card__dot tl" />
              <span className="planta-card__dot tr" />
              <span className="planta-card__dot bl" />
              <span className="planta-card__dot br" />
              <div className="planta-card__img">
                <Icon />
              </div>
              <div className="planta-card__body">
                <h3 className="planta-card__name">{name}</h3>
                <p className="planta-card__lat">{latin}</p>
                <p className="planta-card__desc">{desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        style={{ textAlign: "center", marginTop: "3rem" }}
      >
        <Link
          href="/plantas"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: GOLD,
            textDecoration: "none",
            border: "1px solid rgba(200,160,80,0.32)",
            padding: "0.75rem 2.2rem",
            borderRadius: "0.4rem",
            transition: "background 0.25s, border-color 0.25s",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "rgba(200,160,80,0.08)";
            el.style.borderColor = "rgba(200,160,80,0.6)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement;
            el.style.background = "transparent";
            el.style.borderColor = "rgba(200,160,80,0.32)";
          }}
        >
          Ver todas las plantas
          <span aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
