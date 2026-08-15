"use client";

import { useState, type CSSProperties } from "react";

/**
 * Lámina ilustrada estilo libro. Deja el espacio para una imagen; mientras el
 * archivo no exista en `src`, muestra el prompt para generarla con IA y la ruta
 * donde guardarla. Cuando el archivo aparece en /public, la imagen se ve sola.
 */
export function FiguraLibro({
  num,
  titulo,
  prompt,
  src,
  alto = 260,
}: {
  num: string;
  titulo: string;
  prompt: string;
  src: string;
  alto?: number;
}) {
  const [imgOk, setImgOk] = useState(true);
  const [copiado, setCopiado] = useState(false);

  async function copiarPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      /* portapapeles no disponible */
    }
  }

  return (
    <figure style={figureStyle}>
      <div style={marcoStyle}>
        {/* Gemas de esquina */}
        <span style={{ ...gemStyle, top: -3, left: -3 }} />
        <span style={{ ...gemStyle, top: -3, right: -3 }} />
        <span style={{ ...gemStyle, bottom: -3, left: -3 }} />
        <span style={{ ...gemStyle, bottom: -3, right: -3 }} />

        {imgOk ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={titulo}
            onError={() => setImgOk(false)}
            style={{ display: "block", width: "100%", height: "auto", borderRadius: 2 }}
          />
        ) : (
          <div style={{ ...placeholderStyle, minHeight: alto }}>
            <svg width="34" height="34" viewBox="0 0 40 46" fill="none" aria-hidden="true" style={{ opacity: 0.5, marginBottom: 12 }}>
              <path d="M20,42 C20,42 6,30 6,18 C6,9 12,3 20,3 C28,3 34,9 34,18 C34,30 20,42 20,42 Z" stroke="#c8a050" strokeWidth="0.9" fill="none" opacity="0.7" />
              <path d="M20,5 C20,5 11,13 11,21 C11,29 16,35 20,40" stroke="#5a7a3a" strokeWidth="0.8" fill="none" opacity="0.7" />
            </svg>
            <p style={placeholderLabelStyle}>Lámina {num} — espacio para ilustración</p>
            <p style={promptStyle}>
              <span style={{ color: "rgba(170,120,190,0.9)" }}>Imagen a generar (IA): </span>
              {prompt}
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button type="button" onClick={copiarPrompt} style={botonPromptStyle}>
                {copiado ? "✓ Prompt copiado" : "Copiar prompt"}
              </button>
              <code style={rutaStyle}>guardar en&nbsp;·&nbsp;public{src}</code>
            </div>
          </div>
        )}
      </div>
      <figcaption style={captionStyle}>
        <span style={{ color: "rgba(200,160,80,0.85)" }}>Lámina {num}</span> · {titulo}
      </figcaption>
    </figure>
  );
}

const figureStyle: CSSProperties = { margin: "22px 0 26px" };

const marcoStyle: CSSProperties = {
  position: "relative",
  border: "1px solid rgba(200,160,80,0.32)",
  borderRadius: 4,
  padding: 6,
  background: "rgba(200,160,80,0.04)",
  boxShadow: "inset 0 0 24px rgba(0,0,0,0.35)",
};

const gemStyle: CSSProperties = {
  position: "absolute",
  width: 6,
  height: 6,
  background: "radial-gradient(circle at 35% 30%, #b98acb, #7a4a8a 70%)",
  borderRadius: "50%",
  boxShadow: "0 0 6px rgba(122,74,138,0.6)",
};

const placeholderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  border: "1px dashed rgba(200,160,80,0.35)",
  borderRadius: 2,
  padding: "1.6rem 1.4rem",
  background: "repeating-linear-gradient(45deg, rgba(200,160,80,0.02) 0 10px, transparent 10px 20px)",
};

const placeholderLabelStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.66rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.7)",
  margin: "0 0 10px",
};

const promptStyle: CSSProperties = {
  fontFamily: "var(--font-crimson), var(--font-body), serif",
  fontStyle: "italic",
  fontSize: "0.9rem",
  lineHeight: 1.65,
  color: "rgba(212,196,160,0.78)",
  maxWidth: 620,
  margin: 0,
};

const botonPromptStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.58rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "none",
  border: "1px solid rgba(200,160,80,0.4)",
  padding: "6px 12px",
  borderRadius: 2,
  cursor: "pointer",
};

const rutaStyle: CSSProperties = {
  fontFamily: "monospace",
  fontSize: "0.72rem",
  color: "rgba(212,196,160,0.5)",
  background: "rgba(0,0,0,0.2)",
  padding: "4px 8px",
  borderRadius: 2,
};

const captionStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.68rem",
  letterSpacing: "0.1em",
  color: "rgba(212,196,160,0.55)",
  textAlign: "center",
  marginTop: 10,
  fontStyle: "normal",
};
