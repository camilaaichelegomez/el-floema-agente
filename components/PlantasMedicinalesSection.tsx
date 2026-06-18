"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { plantas, Planta } from "@/lib/plantas-data";
import { plantaIcons } from "@/components/PlantIcons";

const GOLD = "#c8a050";
const CREAM = "#d4c4a0";
const BG_CARD = "#111d11";
const BG_LEFT = "#122012";

/* ── Datos del acordeón ─────────────────────────────────────── */

const METODOS_PREP = [
  {
    nombre: "Infusión",
    temp: "85–90 °C",
    tiempo: "8–12 min",
    desc: "Para hojas y flores delicadas. No hervir: el calor excesivo degrada aceites esenciales y flavonoides.",
  },
  {
    nombre: "Decocción",
    temp: "100 °C",
    tiempo: "15–20 min",
    desc: "Para raíces, cortezas y semillas. La ebullición extrae taninos y polisacáridos resistentes al calor.",
  },
  {
    nombre: "Maceración",
    temp: "Ambiente",
    tiempo: "2–4 semanas",
    desc: "En aceite, alcohol o agua fría. Extrae compuestos termolábiles. Ideal para principios activos cosméticos.",
  },
  {
    nombre: "Tintura",
    temp: "Ambiente",
    tiempo: "3–4 semanas",
    desc: "Alcohol 60–70° como solvente. Alta concentración de principios activos. Uso tópico al 5–15%.",
  },
];

const BLOQUES = [
  { id: "uso",          titulo: "Cómo usar las plantas" },
  { id: "metodos",      titulo: "Métodos de preparación" },
  { id: "complementos", titulo: "Complementos y contraindicaciones" },
];

/* ── Contenido de cada panel ────────────────────────────────── */

function PanelContenido({ id }: { id: string }) {
  const baseParrafo: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontStyle: "italic",
    fontSize: "1.05rem",
    color: CREAM,
    opacity: 0.55,
    lineHeight: 1.75,
    margin: 0,
  };

  if (id === "uso") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
        <p style={baseParrafo}>
          La primera pregunta no es qué planta usar, sino para qué. Identificar el objetivo
          terapéutico —cicatrización, inflamación, sistema nervioso— define la elección.
        </p>
        <p style={baseParrafo}>
          Luego viene el método: una planta aromática se infusiona, una corteza se decoce.
          El tiempo y la temperatura son parte de la fórmula, no un detalle menor.
        </p>
      </div>
    );
  }

  if (id === "metodos") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
        {METODOS_PREP.map((m) => (
          <div
            key={m.nombre}
            style={{
              borderLeft: "2px solid rgba(200,160,80,0.22)",
              paddingLeft: "0.8rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
                marginBottom: "0.2rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-grimoire)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: GOLD,
                }}
              >
                {m.nombre}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.72rem",
                  color: CREAM,
                  opacity: 0.38,
                  whiteSpace: "nowrap",
                }}
              >
                {m.temp} · {m.tiempo}
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "1.05rem",
                color: CREAM,
                opacity: 0.45,
                lineHeight: 1.75,
                margin: 0,
              }}
            >
              {m.desc}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
      <p style={baseParrafo}>
        Algunas plantas interactúan con anticoagulantes, ansiolíticos o hipoglucemiantes.
        Consultar con un profesional es parte del protocolo, no una excepción.
      </p>
      <p style={baseParrafo}>
        Embarazo, lactancia y pieles muy sensibles requieren precaución adicional.
        Realizar prueba de parche antes de cualquier aplicación tópica extendida.
      </p>
    </div>
  );
}

/* ── Accordion item ─────────────────────────────────────────── */

function AccordionItem({
  bloque,
  isOpen,
  onToggle,
}: {
  bloque: (typeof BLOQUES)[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`accordion-item${isOpen ? " active" : ""}`}
      style={{
        border: `1px solid ${isOpen ? "#7a4a8a" : "rgba(200,160,80,0.12)"}`,
        borderLeft: isOpen ? "2px solid var(--color-gold)" : "2px solid rgba(200,160,80,0.4)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        transition: "border-color 0.3s, border-left-color 0.3s",
        background: isOpen ? "transparent" : "rgba(200,160,80,0.04)",
        paddingLeft: isOpen ? undefined : "1rem",
      }}
    >
      <button
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.85rem 1rem",
          background: isOpen ? "rgba(200,160,80,0.06)" : "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "0.75rem",
          transition: "background 0.25s",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.66rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: isOpen ? "#e8c070" : GOLD,
            opacity: isOpen ? 1 : 0.72,
            flex: 1,
            lineHeight: 1.3,
            transition: "opacity 0.25s, color 0.25s",
          }}
        >
          {bloque.titulo}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`accordion-arrow${isOpen ? " active" : ""}`}
          style={{
            display: "inline-block",
            color: isOpen ? "#7a4a8a" : GOLD,
            fontSize: "0.9rem",
            lineHeight: 1,
            flexShrink: 0,
            opacity: 0.8,
            transition: "color 0.25s",
          }}
        >
          →
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1rem 1.1rem" }}>
              <PanelContenido id={bloque.id} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Plant card ─────────────────────────────────────────────── */

function PlantCard({ planta, index }: { planta: Planta; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = plantaIcons[planta.slug];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.03 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link
        href="/plantas"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "0.7rem",
          padding: "1.5rem 0.75rem 1.3rem",
          background: BG_CARD,
          border: `1px solid ${hovered ? "rgba(200,160,80,0.48)" : "rgba(200,160,80,0.16)"}`,
          borderRadius: "1.25rem",
          textDecoration: "none",
          overflow: "hidden",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: hovered
            ? "0 18px 48px rgba(0,0,0,0.5), 0 0 20px rgba(200,160,80,0.07)"
            : "none",
          transition: "border-color 0.35s, box-shadow 0.35s",
        }}
      >
        {/* icon — natural 56×64 size */}
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 64,
            opacity: 0.9,
            flexShrink: 0,
          }}
        >
          {Icon && <Icon />}
        </span>

        {/* name */}
        <span
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.68rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: GOLD,
            display: "block",
            lineHeight: 1.2,
            borderBottom: "1px solid rgba(200,160,80,0.12)",
            paddingBottom: "0.35rem",
            width: "100%",
            textAlign: "center",
          }}
        >
          {planta.nombre}
        </span>

        {/* tags */}
        <span
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.22rem",
            justifyContent: "center",
          }}
        >
          {planta.propiedades.slice(0, 2).map((prop) => {
            const purpleProps = new Set(["sedante","hemostático","emenagogo","antiespasmódico"]);
            const cls = purpleProps.has(prop.toLowerCase()) ? "odd" : "even";
            return (
              <span key={prop} className={`plant-prop-tag ${cls}`}>
                {prop}
              </span>
            );
          })}
        </span>
        {/* puntos decorativos morados */}
        <span className="planta-card__dot tl" />
        <span className="planta-card__dot tr" />
        <span className="planta-card__dot bl" />
        <span className="planta-card__dot br" />
      </Link>
    </motion.div>
  );
}

/* ── Main section ───────────────────────────────────────────── */

export function PlantasMedicinalesSection() {
  const [openId, setOpenId] = useState<string>("uso");

  const toggle = (id: string) =>
    setOpenId((prev) => (prev === id ? "" : id));

  return (
    <section
      className="bosque-frasco-section"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
        borderTop: "1px solid rgba(200,160,80,0.12)",
      }}
    >
      {/* ── FONDO: tres imágenes apiladas ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <img
          src="/bosque-hero.jpg"
          alt=""
          style={{
            height: "33%",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            flexShrink: 0,
            maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          }}
        />
        <img
          src="/bosque-plantas.jpg"
          alt=""
          style={{
            height: "35%",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            flexShrink: 0,
            marginTop: "-80px",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
          }}
        />
        <img
          src="/bosque-agente.jpg"
          alt=""
          style={{
            height: "32%",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
            flexShrink: 0,
            marginTop: "-80px",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%, black 100%)",
          }}
        />
      </div>

      {/* ── OVERLAY ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(to bottom, rgba(4,14,6,0.0) 0%, rgba(4,14,6,0.0) 30%, rgba(4,14,6,0.3) 55%, rgba(4,14,6,0.75) 80%, rgba(4,14,6,0.93) 100%)",
        }}
      />

      {/* ── CONTENIDO ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 1280,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "2fr 40px 3fr",
          minHeight: 520,
        }}
      >
        {/* ── LEFT: acordeón ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{
            background: BG_LEFT,
            padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,3.5vw,3rem)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "1.4rem",
              opacity: 0.4,
            }}
          >
            <span
              style={{
                display: "block",
                width: 36,
                height: 1,
                background: `linear-gradient(to right, transparent, ${GOLD})`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.55rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: GOLD,
                whiteSpace: "nowrap",
              }}
            >
              Botánica Medicinal
            </span>
          </div>

          {/* title */}
          <h2
            className="section-title"
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "clamp(1.7rem,3.2vw,2.6rem)",
              color: "#e8c070",
              letterSpacing: "0.1em",
              lineHeight: 1.1,
              fontWeight: 700,
              marginBottom: "1.6rem",
              textShadow: "0 0 50px rgba(200,160,80,0.18)",
            }}
          >
            Del Bosque
            <br />
            al Frasco
          </h2>

          {/* thin rule */}
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(to right, rgba(200,160,80,0.28), transparent)",
              marginBottom: "1.75rem",
              flexShrink: 0,
            }}
          />

          {/* accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {BLOQUES.map((bloque) => (
              <AccordionItem
                key={bloque.id}
                bloque={bloque}
                isOpen={openId === bloque.id}
                onToggle={() => toggle(bloque.id)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── CENTER: separador ── */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "8%",
              bottom: "8%",
              left: "50%",
              width: 1,
              transform: "translateX(-50%)",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(200,160,80,0.3) 20%, rgba(200,160,80,0.3) 80%, transparent 100%)",
            }}
          />
          <span
            style={{
              position: "relative",
              zIndex: 1,
              fontSize: "0.65rem",
              color: "rgba(200,160,80,0.55)",
              lineHeight: 1,
              background: "var(--bg-primary)",
              padding: "0.4rem 0.3rem",
            }}
          >
            ✦
          </span>
        </div>

        {/* ── RIGHT: grid 3 columnas ── */}
        <div
          style={{
            background: "var(--bg-primary)",
            padding: "clamp(3rem,6vw,5rem) clamp(1.5rem,4vw,3.5rem)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(1.5rem,3vh,2rem)",
          }}
        >
          {/* eyebrow derecha */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: 0.38 }}>
            <span
              style={{
                display: "block",
                width: 30,
                height: 1,
                background: `linear-gradient(to right, transparent, ${GOLD})`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.55rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#e8c070",
                whiteSpace: "nowrap",
              }}
            >
              Plantas Medicinales
            </span>
            <span
              style={{
                flex: 1,
                display: "block",
                height: 1,
                background: `linear-gradient(to right, ${GOLD}, transparent)`,
                opacity: 0.4,
              }}
            />
          </div>

          {/* 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
            }}
          >
            {plantas.map((planta, i) => (
              <PlantCard key={planta.slug} planta={planta} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: "right", marginTop: "auto" }}>
            <Link
              href="/plantas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.62rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: GOLD,
                opacity: 0.6,
                textDecoration: "none",
                borderBottom: "1px solid rgba(200,160,80,0.25)",
                paddingBottom: "0.15rem",
              }}
            >
              Ver biblioteca completa de plantas
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
