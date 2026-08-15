import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { BackButton } from "@/components/BackButton";
import { plantas, getPlanta, MetodoPreparacion } from "@/lib/plantas-data";
import { plantaIcons } from "@/components/PlantIcons";

const GOLD = "#c8a050";
const CREAM = "#d4c4a0";
const PURPLE = "#7a4a8a";

/* Genera una ruta estática por cada planta: /plantas/matico, /plantas/triwe, … */
export function generateStaticParams() {
  return plantas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const planta = getPlanta(slug);
  if (!planta) return { title: "Planta no encontrada · El Floema" };
  return {
    title: `${planta.nombre} · El Floema`,
    description: planta.descripcionBreve,
  };
}

/* ── Subcomponentes ─────────────────────────────────────────── */

function GoldLine() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "clamp(18px,3vh,28px) 0", opacity: 0.3 }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, #c8a050)" }} />
      <span style={{ color: GOLD, fontSize: "0.75rem" }}>✦</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, #c8a050)" }} />
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "0.55rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: GOLD,
        border: "1px solid rgba(200,160,80,0.3)",
        borderRadius: "2rem",
        padding: "0.2rem 0.6rem",
        display: "inline-block",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

const METODO_ICONS: Record<string, string> = {
  infusion: "☕",
  decoccion: "🫙",
  maceracion: "🌿",
  tintura: "🧪",
};

function MetodoCard({ nombre, metodo }: { nombre: string; metodo: MetodoPreparacion }) {
  return (
    <div
      style={{
        background: "rgba(14,26,14,0.7)",
        border: "1px solid rgba(200,160,80,0.22)",
        padding: "1.4rem 1.2rem",
        flex: "1 1 220px",
        minWidth: 0,
      }}
    >
      <div style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: "0.9rem" }}>
        {METODO_ICONS[nombre] ?? "✦"} {nombre}
      </div>
      <div style={{ display: "flex", gap: "1.2rem", marginBottom: "0.8rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.82rem", color: CREAM, opacity: 0.75 }}>
          🌡 {metodo.temperatura}
        </span>
        <span style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.82rem", color: CREAM, opacity: 0.75 }}>
          ⏱ {metodo.tiempo}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.88rem", color: CREAM, opacity: 0.65, lineHeight: 1.65, margin: 0 }}>
        {metodo.descripcion}
      </p>
    </div>
  );
}

/* ── Página ─────────────────────────────────────────────────── */

export default async function PlantaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const planta = getPlanta(slug);
  if (!planta) notFound();

  const Icon = plantaIcons[planta.slug];
  const metodos = Object.entries(planta.preparacion) as [string, MetodoPreparacion][];

  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-primary)", minHeight: "100vh", paddingTop: "5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(2rem,5vh,4rem) clamp(1.5rem,5vw,3rem) 6rem" }}>
          {/* Nav */}
          <div style={{ marginBottom: "clamp(2rem,4vh,3rem)" }}>
            <BackButton label="← Volver a las plantas" href="/plantas" />
          </div>

          {/* Header */}
          <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", marginBottom: "clamp(1rem,2vh,1.5rem)" }}>
            {Icon && (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 72, opacity: 0.9, flexShrink: 0 }}>
                <Icon />
              </span>
            )}
            <div style={{ flex: "1 1 260px" }}>
              <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: GOLD, letterSpacing: "0.14em", textShadow: "0 0 55px rgba(200,160,80,0.28)", marginBottom: "0.35rem" }}>
                {planta.nombre}
              </h1>
              <p style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.95rem", color: CREAM, opacity: 0.5, marginBottom: "0.9rem" }}>
                {planta.nombreCientifico} · {planta.familia}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {planta.propiedades.map((p) => (
                  <Tag key={p} label={p} />
                ))}
              </div>
            </div>
          </header>

          <GoldLine />

          {/* Descripción */}
          <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "clamp(0.95rem,1.5vw,1.08rem)", color: CREAM, lineHeight: 1.82, marginBottom: "clamp(1.2rem,2.5vh,2rem)", opacity: 0.8 }}>
            {planta.descripcionCompleta}
          </p>

          {/* Usos — dos columnas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem 2.5rem", marginBottom: "clamp(1.4rem,3vh,2.2rem)" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: "0.9rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
                Usos Medicinales
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {planta.usosMedicinales.map((uso, i) => (
                  <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.95rem", color: CREAM, opacity: 0.72, paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: GOLD, opacity: 0.5 }}>·</span>
                    {uso}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: "0.9rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
                Usos Cosméticos
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {planta.usosCosmeticos.map((uso, i) => (
                  <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.95rem", color: CREAM, opacity: 0.72, paddingLeft: "1rem", position: "relative" }}>
                    <span style={{ position: "absolute", left: 0, color: GOLD, opacity: 0.5 }}>·</span>
                    {uso}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Formas de uso / preparación — específicas de esta planta */}
          {metodos.length > 0 && (
            <>
              <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: "0.4rem", paddingBottom: "0.4rem", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
                Formas de Uso
              </h2>
              <p style={{ fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.85rem", color: CREAM, opacity: 0.45, margin: "0.6rem 0 1.1rem" }}>
                Cada planta se prepara distinto. Estos son los métodos indicados para {planta.nombre.toLowerCase()}.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "clamp(1.4rem,3vh,2.2rem)" }}>
                {metodos.map(([nombre, metodo]) => (
                  <MetodoCard key={nombre} nombre={nombre} metodo={metodo} />
                ))}
              </div>
            </>
          )}

          {/* Contraindicaciones */}
          <div style={{ background: "rgba(122,74,138,0.07)", border: "1px solid rgba(122,74,138,0.22)", padding: "1.2rem 1.4rem" }}>
            <h2 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: PURPLE, marginBottom: "0.8rem" }}>
              ⚠ Contraindicaciones
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.45rem" }}>
              {planta.contraindicaciones.map((c, i) => (
                <li key={i} style={{ fontFamily: "var(--font-crimson), serif", fontSize: "0.9rem", color: CREAM, opacity: 0.65, paddingLeft: "1.1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: PURPLE, opacity: 0.7 }}>·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Volver a la biblioteca */}
          <div style={{ textAlign: "center", marginTop: "clamp(2.5rem,5vh,4rem)" }}>
            <Link
              href="/plantas"
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: GOLD,
                opacity: 0.5,
                borderBottom: "1px solid rgba(200,160,80,0.22)",
                paddingBottom: "0.15rem",
                textDecoration: "none",
              }}
            >
              Ver biblioteca completa de plantas →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
