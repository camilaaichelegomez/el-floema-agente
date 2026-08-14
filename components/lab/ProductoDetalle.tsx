"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Copy, Check, Pencil } from "lucide-react";
import { EtiquetaLabel } from "@/components/lab/EtiquetaLabel";
import type { EtiquetaData } from "@/lib/etiquetas";

export interface DetalleFormula {
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  lote: string | null;
  rinde_gramos: number | null;
  unidades: number | null;
  ph_objetivo: string | null;
  notas: string | null;
  pasos: string | null;
}

export interface DetalleItem {
  ingrediente: string;
  gramos: number | null;
  porcentaje: number | null;
  fase: string | null;
}

export function ProductoDetalle({
  productId,
  formula,
  items,
  etiqueta,
  subtitle,
}: {
  productId: number;
  formula: DetalleFormula;
  items: DetalleItem[];
  etiqueta: EtiquetaData;
  subtitle: string | null;
}) {
  const pasos = (formula.pasos ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => l.replace(/^\d+[.)]\s*/, ""));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header */}
      <div style={cabeceraStyle}>
        <div>
          <h1 style={nombreStyle}>{formula.nombre}</h1>
          {(subtitle || formula.categoria) && <p style={subtituloStyle}>{subtitle || formula.categoria}</p>}
        </div>
        <Link href={`/lab/etiquetas/${productId}`} style={editarLinkStyle}>
          <Pencil size={13} /> Editar etiqueta y descripciones
        </Link>
      </div>

      {/* Etiqueta + descripciones */}
      <div style={dosColumnasStyle}>
        <section>
          <h2 style={seccionTituloStyle}>Etiqueta</h2>
          <div style={etiquetaScrollStyle}>
            <EtiquetaLabel data={etiqueta} />
          </div>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <h2 style={seccionTituloStyle}>Descripciones</h2>
          {etiqueta.descripcion_catalogo || etiqueta.descripcion_redes ? (
            <>
              {etiqueta.descripcion_catalogo && (
                <BloqueCopiable titulo="Catálogo" texto={etiqueta.descripcion_catalogo} />
              )}
              {etiqueta.descripcion_redes && (
                <BloqueCopiable titulo="Redes sociales" texto={etiqueta.descripcion_redes} />
              )}
            </>
          ) : (
            <p style={vacioStyle}>
              Todavía no hay descripciones. Entra a &ldquo;Editar&rdquo; para escribirlas o generarlas con IA.
            </p>
          )}
        </section>
      </div>

      {/* Fórmula: ingredientes */}
      <section>
        <h2 style={seccionTituloStyle}>Fórmula</h2>
        {(formula.rinde_gramos || formula.unidades || formula.ph_objetivo || formula.lote) && (
          <div style={metaFilaStyle}>
            {formula.rinde_gramos ? <Meta label="Rinde" valor={`${formula.rinde_gramos} g`} /> : null}
            {formula.unidades ? <Meta label="Unidades" valor={String(formula.unidades)} /> : null}
            {formula.ph_objetivo ? <Meta label="pH objetivo" valor={formula.ph_objetivo} /> : null}
            {formula.lote ? <Meta label="Lote" valor={formula.lote} /> : null}
          </div>
        )}
        {formula.descripcion && <p style={parrafoStyle}>{formula.descripcion}</p>}
        {items.length === 0 ? (
          <p style={vacioStyle}>
            Este producto no tiene ingredientes cargados (es un producto manual). Puedes agregarlos en /lab/formulas.
          </p>
        ) : (
          <div className="lab-tabla-marco" style={tablaWrapperStyle}>
            <table style={tablaStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Ingrediente</th>
                  <th style={thStyle}>Gramos</th>
                  <th style={thStyle}>%</th>
                  <th style={thStyle}>Fase</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{it.ingrediente}</td>
                    <td style={tdStyle}>{it.gramos ?? "—"}</td>
                    <td style={tdStyle}>{it.porcentaje ?? "—"}</td>
                    <td style={tdStyle}>{it.fase || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Forma de preparar */}
      {pasos.length > 0 && (
        <section>
          <h2 style={seccionTituloStyle}>Cómo prepararlo</h2>
          <ol style={pasosListaStyle}>
            {pasos.map((paso, i) => (
              <li key={i} style={pasosItemStyle}>
                <span style={pasosNumeroStyle}>{i + 1}</span>
                <span style={pasosTextoStyle}>{paso}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {formula.notas && (
        <section>
          <h2 style={seccionTituloStyle}>Observaciones</h2>
          <p style={parrafoStyle}>{formula.notas}</p>
        </section>
      )}
    </div>
  );
}

function BloqueCopiable({ titulo, texto }: { titulo: string; texto: string }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // portapapeles no disponible
    }
  }
  return (
    <div style={bloqueStyle}>
      <div style={bloqueHeaderStyle}>
        <span style={bloqueTituloStyle}>{titulo}</span>
        <button type="button" onClick={copiar} style={botonCopiarStyle}>
          {copiado ? <Check size={12} color="#7c9473" /> : <Copy size={12} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p style={bloqueTextoStyle}>{texto}</p>
    </div>
  );
}

function Meta({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <span style={metaLabelStyle}>{label}</span>
      <span style={metaValorStyle}>{valor}</span>
    </div>
  );
}

const cabeceraStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
};

const nombreStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "clamp(1.4rem, 3vw, 2rem)",
  color: "#e8c070",
  letterSpacing: "0.06em",
  margin: 0,
};

const subtituloStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontStyle: "italic",
  fontSize: "0.95rem",
  color: "rgba(212,196,160,0.6)",
  margin: "0.3rem 0 0",
};

const editarLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  flexShrink: 0,
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#c8a050",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "9px 13px",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const dosColumnasStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  alignItems: "start",
};

const seccionTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.7rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#c8a050",
  margin: "0 0 1rem",
  paddingBottom: "0.4rem",
  borderBottom: "1px solid rgba(200,160,80,0.18)",
};

const etiquetaScrollStyle: CSSProperties = {
  overflow: "auto",
  border: "1px solid rgba(200,160,80,0.2)",
  padding: "1.5rem",
  background: "#0a0f0a",
};

const bloqueStyle: CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200,160,80,0.15)",
  padding: "0.9rem 1.1rem",
};

const bloqueHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.5rem",
};

const bloqueTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.56rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.7)",
};

const botonCopiarStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.56rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.7)",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px 4px",
};

const bloqueTextoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  lineHeight: 1.55,
  color: "#d4c4a0",
  margin: 0,
  whiteSpace: "pre-wrap",
};

const vacioStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontStyle: "italic",
  fontSize: "0.88rem",
  color: "rgba(212,196,160,0.5)",
  margin: 0,
};

const metaFilaStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.5rem",
  marginBottom: "1rem",
};

const metaLabelStyle: CSSProperties = {
  display: "block",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.54rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.55)",
  marginBottom: "0.2rem",
};

const metaValorStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "#e8dcc8",
};

const parrafoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  lineHeight: 1.7,
  color: "#d4c4a0",
  whiteSpace: "pre-wrap",
  margin: "0 0 1rem",
};

const tablaWrapperStyle: CSSProperties = {
  overflowX: "auto",
  border: "1px solid rgba(200, 160, 80, 0.32)",
};

const tablaStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "480px",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.75)",
  padding: "12px 14px",
  borderBottom: "1px solid rgba(200,160,80,0.35)",
  background: "rgba(200,160,80,0.08)",
};

const tdStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  padding: "10px 14px",
  borderBottom: "1px solid rgba(232,220,200,0.12)",
  color: "#d4c4a0",
};

const pasosListaStyle: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
};

const pasosItemStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "1rem",
  border: "1px solid rgba(200,160,80,0.25)",
  background: "rgba(200,160,80,0.05)",
  padding: "1rem 1.2rem",
};

const pasosNumeroStyle: CSSProperties = {
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  fontFamily: "var(--font-grimoire)",
  fontSize: "1rem",
  color: "#0d1a0d",
  background: "radial-gradient(circle at 35% 30%, #e8c070, #c8a050 60%, #a87f35)",
  borderRadius: "50%",
  border: "1px solid rgba(255, 226, 160, 0.5)",
};

const pasosTextoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.05rem",
  lineHeight: 1.6,
  color: "#e8dcc8",
  paddingTop: "3px",
};
