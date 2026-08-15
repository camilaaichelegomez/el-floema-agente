"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { categorias, getPlantasByCategoria, Planta } from "@/lib/plantas-data";
import { plantaIcons } from "@/components/PlantIcons";

const CATEGORIA_ICONS: Record<string, string> = {
  expectorantes: "✦",
  "ciclo-menstrual": "◯",
  antiinflamatorias: "❋",
  cicatrizantes: "⬡",
  "sistema-nervioso": "∿",
  "inmunidad-antimicrobianas": "⊕",
  digestivas: "⊙",
  "piel-cosmetica": "✧",
};

function PlantaPill({ planta }: { planta: Planta }) {
  const Icon = plantaIcons[planta.slug];
  return (
    <Link
      href="/plantas"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.65rem",
        background: "rgba(200,160,80,0.06)",
        border: "1px solid rgba(200,160,80,0.18)",
        borderRadius: "0.75rem",
        padding: "0.65rem 0.9rem",
        textDecoration: "none",
        transition: "background 0.2s, border-color 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,80,0.12)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,80,0.06)";
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.18)";
      }}
    >
      {Icon && (
        <span style={{ flexShrink: 0, opacity: 0.85, lineHeight: 0 }}>
          <Icon />
        </span>
      )}
      <span style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "0.7rem",
        letterSpacing: "0.1em",
        color: "#d4c4a0",
        whiteSpace: "nowrap",
      }}>
        {planta.nombre}
      </span>
      <span style={{
        fontFamily: "var(--font-crimson), serif",
        fontSize: "0.75rem",
        fontStyle: "italic",
        color: "rgba(200,160,80,0.55)",
        marginLeft: "auto",
        whiteSpace: "nowrap",
      }}>
        {planta.propiedades[0]}
      </span>
    </Link>
  );
}

function CategoriaCard({ cat, index }: { cat: typeof categorias[0]; index: number }) {
  const plantas = getPlantasByCategoria(cat.key);
  const glyph = CATEGORIA_ICONS[cat.key] ?? "✦";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: "easeOut" }}
      style={{
        background: "rgba(17,29,17,0.85)",
        border: "1px solid rgba(200,160,80,0.2)",
        borderRadius: "1rem",
        padding: "1.75rem 1.75rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* corner accent */}
      <span style={{
        position: "absolute",
        top: 14,
        right: 16,
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "1.4rem",
        color: "rgba(200,160,80,0.2)",
        lineHeight: 1,
        userSelect: "none",
      }}>
        {glyph}
      </span>

      {/* header */}
      <div>
        <p style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "0.55rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "rgba(200,160,80,0.6)",
          marginBottom: "0.4rem",
        }}>
          Categoría {String(index + 1).padStart(2, "0")}
        </p>
        <h2 style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
          letterSpacing: "0.08em",
          color: "#c8a050",
          margin: 0,
          fontWeight: 600,
          lineHeight: 1.3,
        }}>
          {cat.label}
        </h2>
      </div>

      {/* divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: 0.25 }}>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)" }} />
        <span style={{ color: "#c8a050", fontSize: "0.6rem" }}>✦</span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)" }} />
      </div>

      {/* description */}
      <p style={{
        fontFamily: "var(--font-crimson), serif",
        fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
        color: "rgba(212,196,160,0.75)",
        lineHeight: 1.65,
        margin: 0,
        fontStyle: "italic",
      }}>
        {cat.descripcion}
      </p>

      {/* plant pills */}
      {plantas.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
          {plantas.map((p) => (
            <PlantaPill key={p.slug} planta={p} />
          ))}
        </div>
      ) : (
        <p style={{
          fontFamily: "var(--font-crimson), serif",
          fontSize: "0.85rem",
          color: "rgba(200,160,80,0.4)",
          fontStyle: "italic",
          margin: 0,
        }}>
          Próximamente
        </p>
      )}

      {/* plant count badge */}
      <div style={{
        marginTop: "auto",
        paddingTop: "0.75rem",
        borderTop: "1px solid rgba(200,160,80,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "0.4rem",
      }}>
        <span style={{ color: "#c8a050", fontSize: "0.75rem" }}>❋</span>
        <span style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "0.55rem",
          letterSpacing: "0.14em",
          color: "rgba(200,160,80,0.5)",
          textTransform: "uppercase",
        }}>
          {plantas.length} {plantas.length === 1 ? "planta" : "plantas"} catalogadas
        </span>
      </div>
    </motion.article>
  );
}

export default function CategoriasPage() {
  return (
    <>
      <Navbar />
      <main style={{
        minHeight: "100vh",
        background: "var(--bg-primary, #0e1a0e)",
        paddingTop: "clamp(90px, 12vh, 130px)",
        paddingBottom: "clamp(60px, 10vh, 100px)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 clamp(1rem, 5vw, 2.5rem)" }}>

          {/* back nav */}
          <div style={{ marginBottom: "2rem" }}>
            <BackButton label="← Volver a Plantas" href="/plantas" />
          </div>

          {/* page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: "center", marginBottom: "clamp(2.5rem, 6vh, 4rem)" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: "1rem" }}>
              <div style={{ width: 60, height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.5))" }} />
              <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(200,160,80,0.6)", textTransform: "uppercase" }}>
                Catálogo Botánico
              </span>
              <div style={{ width: 60, height: 1, background: "linear-gradient(to left, transparent, rgba(200,160,80,0.5))" }} />
            </div>

            <h1 style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
              letterSpacing: "0.15em",
              color: "#c8a050",
              margin: 0,
              fontWeight: 700,
              lineHeight: 1.15,
              textShadow: "0 0 40px rgba(200,160,80,0.25)",
            }}>
              Categorías
            </h1>

            <p style={{
              fontFamily: "var(--font-crimson), serif",
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              fontStyle: "italic",
              color: "rgba(212,196,160,0.65)",
              marginTop: "0.75rem",
              letterSpacing: "0.04em",
            }}>
              Plantas del bosque valdiviano clasificadas por función terapéutica
            </p>
          </motion.div>

          {/* categories grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(1rem, 2.5vw, 1.5rem)",
          }}>
            {categorias.map((cat, i) => (
              <CategoriaCard key={cat.key} cat={cat} index={i} />
            ))}
          </div>

          {/* bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ textAlign: "center", marginTop: "clamp(3rem, 6vh, 5rem)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "1.75rem", opacity: 0.25 }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)" }} />
              <span style={{ color: "#c8a050", fontSize: "0.75rem" }}>✦ ✦ ✦</span>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)" }} />
            </div>
            <Link
              href="/plantas"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c8a050",
                textDecoration: "none",
                border: "1px solid rgba(200,160,80,0.35)",
                padding: "0.75rem 2rem",
                borderRadius: "0.5rem",
                transition: "background 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,80,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.6)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.35)";
              }}
            >
              Ver fichas completas
              <span aria-hidden="true">→</span>
            </Link>
          </motion.div>
        </div>
      </main>
    </>
  );
}
