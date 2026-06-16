"use client";

import { motion } from "framer-motion";

const GOLD = "#c8a050";
const CREAM = "#d4c4a0";

/* ── Preparation icons (28×28) ──────────────────────────────── */

function IcoInfusion() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Cup body */}
      <path d="M6 12 L8 22 L20 22 L22 12 Z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Saucer */}
      <path d="M4 22 L24 22" stroke={GOLD} strokeWidth="0.7" opacity="0.5" />
      {/* Handle */}
      <path d="M22 14 C26 14 26 20 22 20" stroke={GOLD} strokeWidth="0.7" fill="none" opacity="0.5" />
      {/* Steam lines */}
      <path d="M11 9 C11 7 13 7 13 5" stroke={GOLD} strokeWidth="0.65" fill="none" opacity="0.45" />
      <path d="M15 9 C15 7 17 7 17 5" stroke={GOLD} strokeWidth="0.65" fill="none" opacity="0.45" />
    </svg>
  );
}

function IcoDecoccion() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Pot body */}
      <path d="M5 14 C5 10 8 8 14 8 C20 8 23 10 23 14 L22 22 L6 22 Z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Lid */}
      <path d="M7 9 L21 9" stroke={GOLD} strokeWidth="0.75" opacity="0.55" />
      <path d="M11 9 L11 7 L17 7 L17 9" stroke={GOLD} strokeWidth="0.65" fill="none" opacity="0.5" />
      {/* Handles */}
      <path d="M5 13 C3 13 3 17 5 17" stroke={GOLD} strokeWidth="0.65" fill="none" opacity="0.5" />
      <path d="M23 13 C25 13 25 17 23 17" stroke={GOLD} strokeWidth="0.65" fill="none" opacity="0.5" />
      {/* Bubbles */}
      <circle cx="12" cy="16" r="1.2" stroke={GOLD} strokeWidth="0.55" opacity="0.35" />
      <circle cx="16" cy="18" r="0.9" stroke={GOLD} strokeWidth="0.55" opacity="0.3" />
    </svg>
  );
}

function IcoTintura() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Flask body */}
      <path d="M11 4 L11 12 L5 22 L23 22 L17 12 L17 4 Z" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Flask neck */}
      <path d="M10 4 L18 4" stroke={GOLD} strokeWidth="0.75" opacity="0.55" />
      {/* Liquid level */}
      <path d="M7 18 L21 18" stroke={GOLD} strokeWidth="0.6" opacity="0.35" strokeDasharray="1.5 2" />
      {/* Drops */}
      <circle cx="11" cy="20" r="1" fill={GOLD} opacity="0.3" />
      <circle cx="17" cy="21" r="0.8" fill={GOLD} opacity="0.25" />
    </svg>
  );
}

function IcoCrema() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Jar body */}
      <rect x="6" y="13" width="16" height="10" rx="2" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Lid */}
      <rect x="5" y="10" width="18" height="4" rx="1.5" stroke={GOLD} strokeWidth="0.75" fill="none" opacity="0.6" />
      {/* Label line */}
      <path d="M9 18 L19 18" stroke={GOLD} strokeWidth="0.55" opacity="0.35" />
      {/* Small leaf detail */}
      <path d="M12 16 C13 14.5 15 14.5 16 16" stroke={GOLD} strokeWidth="0.55" fill="none" opacity="0.4" />
    </svg>
  );
}

function IcoBalsamo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Round tin */}
      <ellipse cx="14" cy="19" rx="9" ry="4" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.65" />
      <path d="M5 15 L5 19" stroke={GOLD} strokeWidth="0.7" opacity="0.55" />
      <path d="M23 15 L23 19" stroke={GOLD} strokeWidth="0.7" opacity="0.55" />
      <ellipse cx="14" cy="15" rx="9" ry="4" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Top highlight */}
      <ellipse cx="14" cy="15" rx="5" ry="2" stroke={GOLD} strokeWidth="0.5" fill="none" opacity="0.3" />
      {/* Leaves */}
      <path d="M11 13 C12 11.5 14 12 13 14" stroke={GOLD} strokeWidth="0.55" fill="none" opacity="0.4" />
      <path d="M17 13 C16 11.5 14 12 15 14" stroke={GOLD} strokeWidth="0.55" fill="none" opacity="0.4" />
    </svg>
  );
}

function IcoUnguento() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Tube body */}
      <rect x="8" y="14" width="12" height="8" rx="1" stroke={GOLD} strokeWidth="0.8" fill="none" opacity="0.7" />
      {/* Tube neck + cap */}
      <path d="M11 14 L11 10 L17 10 L17 14" stroke={GOLD} strokeWidth="0.75" fill="none" opacity="0.6" />
      <rect x="10" y="7" width="8" height="4" rx="1" stroke={GOLD} strokeWidth="0.7" fill="none" opacity="0.55" />
      {/* Squeeze lines */}
      <path d="M9 18 L10 18" stroke={GOLD} strokeWidth="0.65" opacity="0.4" />
      <path d="M9 20 L10 20" stroke={GOLD} strokeWidth="0.65" opacity="0.4" />
      {/* Cream dot */}
      <circle cx="20" cy="14" r="1.5" fill={GOLD} opacity="0.25" />
      <circle cx="22" cy="12" r="0.8" fill={GOLD} opacity="0.18" />
    </svg>
  );
}

/* ── Data ───────────────────────────────────────────────────── */

const MEDICINA = [
  { label: "Infusión",  sub: "hojas y flores",  Icon: IcoInfusion  },
  { label: "Decocción", sub: "cortezas y raíces", Icon: IcoDecoccion },
  { label: "Tintura",   sub: "extracto alcohólico", Icon: IcoTintura   },
];

const COSMETICA = [
  { label: "Crema",    sub: "emulsión O/W", Icon: IcoCrema   },
  { label: "Bálsamo",  sub: "base oleosa",  Icon: IcoBalsamo },
  { label: "Ungüento", sub: "base cerosa",  Icon: IcoUnguento },
];

/* ── Component ──────────────────────────────────────────────── */

export function MapaConceptual() {
  return (
    <section
      style={{
        background: "var(--bg-secondary)",
        padding: "clamp(3.5rem,7vh,5.5rem) clamp(1.5rem,5vw,4rem)",
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(200,160,80,0.1)",
        borderBottom: "1px solid rgba(200,160,80,0.1)",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* ── TITLE ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "0.5rem" }}
        >
          <p
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "clamp(0.72rem,1.5vw,0.88rem)",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: GOLD,
              opacity: 0.85,
              margin: 0,
            }}
          >
            Plantas Nativas Valdivianas
          </p>
        </motion.div>

        {/* ── CONNECTING SVG DIAGRAM ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <svg
            width="100%"
            viewBox="0 0 860 72"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
            style={{ display: "block", overflow: "visible" }}
          >
            {/* Vertical down from title */}
            <line x1="430" y1="0" x2="430" y2="28" stroke={GOLD} strokeWidth="0.8" opacity="0.45" />

            {/* Diamond at junction */}
            <polygon points="430,20 436,28 430,36 424,28" fill="none" stroke={GOLD} strokeWidth="0.7" opacity="0.45" />

            {/* Horizontal bar */}
            <line x1="155" y1="36" x2="424" y2="36" stroke={GOLD} strokeWidth="0.8" opacity="0.35" />
            <line x1="436" y1="36" x2="705" y2="36" stroke={GOLD} strokeWidth="0.8" opacity="0.35" />

            {/* Left branch dot + drop */}
            <circle cx="155" cy="36" r="3" fill="none" stroke={GOLD} strokeWidth="0.75" opacity="0.45" />
            <line   x1="155" y1="39"  x2="155" y2="68" stroke={GOLD} strokeWidth="0.8" opacity="0.38" />

            {/* Right branch dot + drop */}
            <circle cx="705" cy="36" r="3" fill="none" stroke={GOLD} strokeWidth="0.75" opacity="0.45" />
            <line   x1="705" y1="39"  x2="705" y2="68" stroke={GOLD} strokeWidth="0.8" opacity="0.38" />

            {/* Arrow heads */}
            <polygon points="151,66 155,74 159,66" fill={GOLD} opacity="0.4" />
            <polygon points="701,66 705,74 709,66" fill={GOLD} opacity="0.4" />
          </svg>
        </motion.div>

        {/* ── TWO COLUMNS ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(1.5rem,4vw,4rem)",
            marginTop: "-0.25rem",
          }}
        >
          {/* LEFT: MEDICINA */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            style={{
              border: "1px solid rgba(200,160,80,0.18)",
              borderRadius: "0.75rem",
              padding: "clamp(1.4rem,3vw,2rem)",
              background: "rgba(14,26,14,0.6)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "clamp(0.78rem,1.5vw,0.92rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              Medicina
            </h3>

            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                margin: "0 auto 1.4rem",
                opacity: 0.3,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {MEDICINA.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      border: "1px solid rgba(200,160,80,0.18)",
                      borderRadius: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(200,160,80,0.04)",
                    }}
                  >
                    <item.Icon />
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-grimoire)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: GOLD,
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                        color: CREAM,
                        opacity: 0.42,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT: COSMÉTICA */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            style={{
              border: "1px solid rgba(200,160,80,0.18)",
              borderRadius: "0.75rem",
              padding: "clamp(1.4rem,3vw,2rem)",
              background: "rgba(14,26,14,0.6)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "clamp(0.78rem,1.5vw,0.92rem)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: GOLD,
                marginBottom: "1.25rem",
                textAlign: "center",
              }}
            >
              Cosmética
            </h3>

            <div
              style={{
                width: 40,
                height: 1,
                background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                margin: "0 auto 1.4rem",
                opacity: 0.3,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              {COSMETICA.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
                  style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      width: 36,
                      height: 36,
                      border: "1px solid rgba(200,160,80,0.18)",
                      borderRadius: "0.4rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(200,160,80,0.04)",
                    }}
                  >
                    <item.Icon />
                  </span>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-grimoire)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: GOLD,
                        margin: 0,
                        lineHeight: 1.2,
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontStyle: "italic",
                        fontSize: "0.78rem",
                        color: CREAM,
                        opacity: 0.42,
                        margin: 0,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
