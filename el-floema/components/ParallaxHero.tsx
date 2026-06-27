"use client";
import Link from "next/link";

export function ParallaxHero() {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(80px,15vh,140px) clamp(24px,5vw,64px)", position: "relative" }}>
      <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", display: "block", marginBottom: "1.5rem" }}>
        El Floema
      </span>
      <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(2.5rem,8vw,5.5rem)", color: "#c8a050", letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.1, marginBottom: "1.5rem", textShadow: "0 0 80px rgba(200,160,80,0.25)" }}>
        Con ciencia,<br />mi magia despierta
      </h1>
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,2vw,1.2rem)", color: "#d4c4a0", lineHeight: 1.7, maxWidth: 480, marginBottom: "2.5rem", opacity: 0.8 }}>
        Cosmética botánica con plantas nativas del bosque valdiviano
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/consulta" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0e1a0e", background: "#c8a050", textDecoration: "none", padding: "12px 28px", borderRadius: "4px" }}>
          Agente Botánico
        </Link>
        <Link href="/biblioteca" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8a050", background: "transparent", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(200,160,80,0.45)", borderRadius: "4px" }}>
          La Biblioteca
        </Link>
      </div>
    </section>
  );
}
