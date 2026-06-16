"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { plantas, Planta } from "@/lib/plantas-data";
import { plantaIcons } from "@/components/PlantIcons";

/* ── Subcomponents ────────────────────────────────────────── */

function GoldLine() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "clamp(18px,3vh,28px) 0", opacity: 0.3 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)" }} />
      <span style={{ color: "#c8a050", fontSize: "0.75rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)" }} />
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: "var(--font-cinzel), serif",
      fontSize: "0.55rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#c8a050",
      border: "1px solid rgba(200,160,80,0.3)",
      borderRadius: "2rem",
      padding: "0.2rem 0.6rem",
      display: "inline-block",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function MetodoCard({ nombre, metodo }: { nombre: string; metodo: { temperatura: string; tiempo: string; descripcion: string } }) {
  const iconos: Record<string, string> = {
    infusion: "☕",
    decoccion: "🫙",
    maceracion: "🌿",
    tintura: "🧪",
  };
  return (
    <div style={{
      background: "rgba(14,26,14,0.7)",
      border: "1px solid rgba(200,160,80,0.22)",
      padding: "1.4rem 1.2rem",
      flex: "1 1 180px",
      minWidth: 0,
    }}>
      <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", marginBottom: "0.9rem" }}>
        {iconos[nombre] ?? "✦"} {nombre}
      </div>
      <div style={{ display: "flex", gap: "1.2rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.82rem", color: "#d4c4a0", opacity: 0.75 }}>
          🌡 {metodo.temperatura}
        </span>
        <span style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.82rem", color: "#d4c4a0", opacity: 0.75 }}>
          ⏱ {metodo.tiempo}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.88rem", color: "#d4c4a0", opacity: 0.65, lineHeight: 1.65, margin: 0 }}>
        {metodo.descripcion}
      </p>
    </div>
  );
}

function FichaPlanta({ planta, onClose }: { planta: Planta; onClose: () => void }) {
  const metodos = Object.entries(planta.preparacion) as [string, NonNullable<Planta["preparacion"][keyof Planta["preparacion"]]>][];

  return (
    <motion.div
      key={planta.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        background: "linear-gradient(180deg, #152515 0%, #111d11 100%)",
        border: "1px solid rgba(200,160,80,0.32)",
        borderTop: "2px solid rgba(200,160,80,0.45)",
        margin: "1.2rem 0 2rem",
        padding: "clamp(1.8rem,4vh,3rem) clamp(1.4rem,4vw,3.5rem)",
        position: "relative",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,160,80,0.08)",
      }}
    >
      {/* close */}
      <button
        onClick={onClose}
        aria-label="Cerrar ficha"
        style={{
          position: "absolute", top: "1rem", right: "1.2rem",
          background: "none", border: "1px solid rgba(200,160,80,0.2)", cursor: "pointer",
          color: "rgba(200,160,80,0.5)", fontSize: "0.7rem",
          fontFamily: "var(--font-cinzel), serif", letterSpacing: "0.1em",
          padding: "0.25rem 0.6rem", transition: "all 0.25s",
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c8a050"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,160,80,0.5)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(200,160,80,0.5)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,160,80,0.2)"; }}
      >
        ✕ cerrar
      </button>

      {/* Header */}
      <div style={{ marginBottom: "clamp(1rem,2vh,1.5rem)" }}>
        <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "clamp(1.5rem,3.5vw,2.2rem)", color: "#c8a050", letterSpacing: "0.14em", marginBottom: "0.35rem" }}>
          {planta.nombre}
        </h2>
        <p style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.9rem", color: "#d4c4a0", opacity: 0.5, marginBottom: "0.9rem" }}>
          {planta.nombreCientifico} · {planta.familia}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {planta.propiedades.map(p => <Tag key={p} label={p} />)}
        </div>
      </div>

      <GoldLine />

      {/* Descripción */}
      <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "clamp(0.95rem,1.5vw,1.08rem)", color: "#d4c4a0", lineHeight: 1.82, marginBottom: "clamp(1.2rem,2.5vh,2rem)", opacity: 0.8 }}>
        {planta.descripcionCompleta}
      </p>

      {/* Usos — dos columnas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem 2.5rem", marginBottom: "clamp(1.4rem,3vh,2.2rem)" }}>
        {/* Usos medicinales */}
        <div>
          <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", marginBottom: "0.9rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
            Usos Medicinales
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {planta.usosMedicinales.map((uso, i) => (
              <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.95rem", color: "#d4c4a0", opacity: 0.72, paddingLeft: "1rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#c8a050", opacity: 0.5 }}>·</span>
                {uso}
              </li>
            ))}
          </ul>
        </div>

        {/* Usos cosméticos */}
        <div>
          <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", marginBottom: "0.9rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
            Usos Cosméticos
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {planta.usosCosmeticos.map((uso, i) => (
              <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.95rem", color: "#d4c4a0", opacity: 0.72, paddingLeft: "1rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#c8a050", opacity: 0.5 }}>·</span>
                {uso}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Preparación */}
      {metodos.length > 0 && (
        <>
          <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", marginBottom: "1rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
            Métodos de Preparación
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "clamp(1.4rem,3vh,2.2rem)" }}>
            {metodos.map(([nombre, metodo]) => (
              metodo && <MetodoCard key={nombre} nombre={nombre} metodo={metodo} />
            ))}
          </div>
        </>
      )}

      {/* Contraindicaciones */}
      <div style={{ background: "rgba(122,74,138,0.07)", border: "1px solid rgba(122,74,138,0.22)", padding: "1.2rem 1.4rem" }}>
        <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#7a4a8a", marginBottom: "0.8rem" }}>
          ⚠ Contraindicaciones
        </h3>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          {planta.contraindicaciones.map((c, i) => (
            <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.9rem", color: "#d4c4a0", opacity: 0.65, paddingLeft: "1.1rem", position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: "#7a4a8a", opacity: 0.7 }}>·</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function PlantaCard({ planta, isSelected, isOther, onClick }: {
  planta: Planta;
  isSelected: boolean;
  isOther: boolean;
  onClick: () => void;
}) {
  const Icon = plantaIcons[planta.slug];
  return (
    <motion.button
      onClick={onClick}
      layout
      animate={{ opacity: isOther ? 0.45 : 1 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "0.9rem",
        padding: "1.8rem 1.1rem 1.6rem",
        background: isSelected ? "rgba(26,48,26,0.95)" : "var(--bg-card)",
        border: `1px solid ${isSelected ? "rgba(200,160,80,0.65)" : "rgba(200,160,80,0.18)"}`,
        borderRadius: "0.75rem",
        cursor: "pointer",
        transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
        boxShadow: isSelected ? "0 0 24px rgba(200,160,80,0.12), 0 12px 40px rgba(0,0,0,0.5)" : "none",
        width: "100%",
        font: "inherit",
      }}
    >
      <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 64, opacity: 0.88 }}>
        {Icon && <Icon />}
      </span>
      <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.85rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8a050", lineHeight: 1.2 }}>
        {planta.nombre}
      </span>
      <span style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.78rem", color: "#d4c4a0", opacity: 0.42, lineHeight: 1.3 }}>
        {planta.nombreCientifico}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.28rem", justifyContent: "center" }}>
        {planta.propiedades.map(p => <Tag key={p} label={p} />)}
      </div>
      <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#c8a050", opacity: isSelected ? 0.8 : 0.35, marginTop: "0.2rem" }}>
        {isSelected ? "▲ cerrar" : "▼ ver ficha"}
      </span>
    </motion.button>
  );
}

/* ── Preparation method info (bottom section) ─────────────── */
const metodosGenerales = [
  {
    nombre: "Infusión",
    icon: "☕",
    cuando: "Partes delicadas: flores, hojas tiernas",
    temperatura: "80 – 95 °C",
    descripcion: "Verter agua caliente (nunca hirviendo) sobre la planta. Tapar y reposar. Preserva aceites esenciales, flavonoides y vitaminas que se degradan con el hervor.",
  },
  {
    nombre: "Decocción",
    icon: "🫙",
    cuando: "Partes duras: cortezas, raíces, semillas",
    temperatura: "100 °C",
    descripcion: "Hervir la planta en agua. Extrae principios resistentes al calor: taninos, alcaloides, polisacáridos y minerales. El hervor prolongado libera estructuras celulares compactas.",
  },
  {
    nombre: "Maceración",
    icon: "🌿",
    cuando: "Extracción en frío, principios sensibles",
    temperatura: "Ambiente o 4 °C",
    descripcion: "Remojar la planta en solvente (agua, aceite o alcohol) durante días o semanas. Ideal para plantas con activos que no toleran el calor o para extracción en aceite.",
  },
  {
    nombre: "Tintura",
    icon: "🧪",
    cuando: "Extracción concentrada, conservación larga",
    temperatura: "Ambiente",
    descripcion: "Maceración hidroalcohólica (alcohol 60–70°). Alta biodisponibilidad y largo tiempo de conservación (2–5 años). Estándar en herbología clínica contemporánea.",
  },
];

/* ── Page ─────────────────────────────────────────────────── */
export default function PlantasPage() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const selectedPlanta = plantas.find((p) => p.slug === selectedSlug) ?? null;

  const handleCardClick = (slug: string) =>
    setSelectedSlug((prev) => (prev === slug ? null : slug));

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)", minHeight: "100vh", paddingTop: "5rem" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "clamp(2rem,5vh,4rem) clamp(1.5rem,5vw,3rem) 6rem" }}>

          {/* Nav */}
          <div style={{ marginBottom: "clamp(2rem,4vh,3rem)" }}>
            <BackButton label="← Volver al inicio" />
          </div>

          {/* Header */}
          <header style={{ textAlign: "center", marginBottom: "clamp(2.5rem,5vh,4rem)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "clamp(18px,3vh,28px)", opacity: 0.32 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)" }} />
              <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "#c8a050" }}>
                Botánica Medicinal
              </span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)" }} />
            </div>

            <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "clamp(2rem,5.5vw,3.5rem)", color: "#c8a050", letterSpacing: "0.16em", textShadow: "0 0 55px rgba(200,160,80,0.28)", marginBottom: "0.75rem" }}>
              Plantas Medicinales
            </h1>
            <p style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "clamp(1rem,2vw,1.2rem)", color: "#d4c4a0", opacity: 0.55, marginBottom: "1.5rem" }}>
              La sabiduría del bosque valdiviano
            </p>
            <Link href="/plantas/categorias" style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a050", opacity: 0.45, borderBottom: "1px solid rgba(200,160,80,0.22)", paddingBottom: "0.15rem", textDecoration: "none", transition: "opacity 0.3s" }}>
              Ver catálogo por categoría →
            </Link>
          </header>

          {/* Gallery */}
          <section aria-label="Galería de plantas">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "1rem",
              marginBottom: selectedPlanta ? "0" : "1rem",
            }}>
              {plantas.map((planta) => (
                <PlantaCard
                  key={planta.slug}
                  planta={planta}
                  isSelected={selectedSlug === planta.slug}
                  isOther={selectedSlug !== null && selectedSlug !== planta.slug}
                  onClick={() => handleCardClick(planta.slug)}
                />
              ))}
            </div>

            {/* Expanded ficha */}
            <AnimatePresence mode="wait">
              {selectedPlanta && (
                <FichaPlanta
                  planta={selectedPlanta}
                  onClose={() => setSelectedSlug(null)}
                />
              )}
            </AnimatePresence>
          </section>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "3rem 2rem", maxWidth: 480, margin: "0 auto", opacity: 0.25 }}>
            <span style={{ flex: 1, height: 1, display: "block", background: "linear-gradient(to right, transparent, #c8a050)" }} />
            <span style={{ color: "#c8a050", fontSize: "0.7rem" }}>✦</span>
            <span style={{ flex: 1, height: 1, display: "block", background: "linear-gradient(to left, transparent, #c8a050)" }} />
          </div>

          {/* Métodos de preparación — sección general */}
          <section aria-label="Métodos de preparación">
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#c8a050", opacity: 0.4, marginBottom: "0.6rem" }}>
                Guía práctica
              </p>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "clamp(1.2rem,3vw,1.8rem)", color: "#c8a050", letterSpacing: "0.14em" }}>
                Métodos de Extracción
              </h2>
              <p style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.95rem", color: "#d4c4a0", opacity: 0.45, marginTop: "0.5rem" }}>
                Cuándo usar cada técnica de preparación
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              {metodosGenerales.map((m) => (
                <div key={m.nombre} style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(200,160,80,0.2)",
                  padding: "1.8rem 1.5rem",
                }}>
                  <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", marginBottom: "0.3rem" }}>
                    {m.icon} {m.nombre}
                  </div>
                  <div style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.78rem", color: "#d4c4a0", opacity: 0.5, marginBottom: "0.5rem" }}>
                    {m.temperatura}
                  </div>
                  <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a050", opacity: 0.5, marginBottom: "0.85rem", paddingBottom: "0.6rem", borderBottom: "1px solid rgba(200,160,80,0.12)" }}>
                    Indicado: {m.cuando}
                  </div>
                  <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.92rem", color: "#d4c4a0", opacity: 0.65, lineHeight: 1.7, margin: 0 }}>
                    {m.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
