"use client";

import { useState, type CSSProperties } from "react";
import { Eye, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export interface Preparacion {
  id: number;
  formula_id: number | null;
  nombre_formula: string;
  cantidad_gramos: number;
  pasos: string | null;
  creado: string;
}

interface PreparacionItem {
  id: number;
  ingrediente: string;
  gramos: number;
  inventario_id: number | null;
}

function formatoFecha(fecha: string): string {
  return new Date(fecha).toLocaleString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function cargarItems(preparacionId: number): Promise<PreparacionItem[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("preparacion_items")
    .select("id, ingrediente, gramos, inventario_id")
    .eq("preparacion_id", preparacionId)
    .order("id", { ascending: true });

  return data ?? [];
}

export function PreparacionesManager({ initialPreparaciones }: { initialPreparaciones: Preparacion[] }) {
  const [preparaciones, setPreparaciones] = useState(initialPreparaciones);
  const [viendo, setViendo] = useState<Preparacion | null>(null);
  const [itemsViendo, setItemsViendo] = useState<PreparacionItem[]>([]);
  const [cargando, setCargando] = useState(false);
  const [borrando, setBorrando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function recargarLista() {
    const supabase = createClient();
    const { data } = await supabase
      .from("preparaciones")
      .select("id, formula_id, nombre_formula, cantidad_gramos, pasos, creado")
      .order("creado", { ascending: false });
    setPreparaciones((data as Preparacion[] | null) ?? []);
  }

  async function abrirVer(preparacion: Preparacion) {
    setError(null);
    setCargando(true);
    setViendo(preparacion);
    const items = await cargarItems(preparacion.id);
    setItemsViendo(items);
    setCargando(false);
  }

  async function handleBorrar(preparacion: Preparacion) {
    if (
      !window.confirm(
        `¿Borrar "${preparacion.nombre_formula}" (${preparacion.cantidad_gramos} g)? Esto devuelve al inventario lo que se había descontado.`
      )
    )
      return;

    setError(null);
    setBorrando(preparacion.id);
    const supabase = createClient();

    const items = await cargarItems(preparacion.id);

    for (const it of items) {
      if (it.inventario_id === null) continue;

      const { data: inv, error: invError } = await supabase
        .from("inventario")
        .select("cantidad")
        .eq("id", it.inventario_id)
        .single();

      if (invError || !inv) continue;

      const { error: updateError } = await supabase
        .from("inventario")
        .update({ cantidad: inv.cantidad + it.gramos })
        .eq("id", it.inventario_id);

      if (updateError) {
        setError(updateError.message);
        setBorrando(null);
        return;
      }
    }

    const { error: dbError } = await supabase.from("preparaciones").delete().eq("id", preparacion.id);

    if (dbError) {
      setError(dbError.message);
      setBorrando(null);
      return;
    }

    if (viendo?.id === preparacion.id) setViendo(null);
    setBorrando(null);
    await recargarLista();
  }

  return (
    <div>
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", marginBottom: "1.5rem" }}>
        {preparaciones.length} preparación{preparaciones.length === 1 ? "" : "es"} registrada
        {preparaciones.length === 1 ? "" : "s"}.
      </p>

      {error && <p style={errorStyle}>{error}</p>}

      {viendo && (
        <div style={panelStyle}>
          <div style={tituloStyle}>
            <span>
              {viendo.nombre_formula} · {viendo.cantidad_gramos} g
            </span>
            <button type="button" onClick={() => setViendo(null)} style={botonCerrarStyle} aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>

          <p style={fechaStyle}>Preparada el {formatoFecha(viendo.creado)}</p>

          {cargando ? (
            <p style={{ fontFamily: "var(--font-body)", color: "#d4c4a0", opacity: 0.7 }}>Cargando…</p>
          ) : (
            <>
              <p style={itemsTituloStyle}>Ingredientes usados</p>
              <div style={tablaWrapperStyle}>
                <table style={tablaStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Ingrediente</th>
                      <th style={thStyle}>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsViendo.map((it) => (
                      <tr key={it.id}>
                        <td style={tdStyle}>{it.ingrediente}</td>
                        <td style={tdStyle}>{it.gramos} g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {viendo.pasos && (
                <div style={{ marginTop: "1.6rem" }}>
                  <span style={itemsTituloStyle}>Pasos a seguir</span>
                  <PasosVista texto={viendo.pasos} />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {preparaciones.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", opacity: 0.75 }}>
          Todavía no preparaste ninguna fórmula. Cuando confirmes &ldquo;Preparar esta fórmula&rdquo; en
          /lab/formulas, va a aparecer acá.
        </p>
      ) : (
        <div style={tablaWrapperStyle}>
          <table style={tablaStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Fórmula</th>
                <th style={thStyle}>Cantidad</th>
                <th style={thStyle}>Fecha</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {preparaciones.map((p) => (
                <tr key={p.id}>
                  <td style={tdStyle}>{p.nombre_formula}</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{p.cantidad_gramos} g</td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatoFecha(p.creado)}</td>
                  <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                    <button type="button" onClick={() => abrirVer(p)} style={iconoAccionStyle} aria-label="Ver">
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleBorrar(p)}
                      disabled={borrando === p.id}
                      style={iconoAccionStyle}
                      aria-label="Borrar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PasosVista({ texto }: { texto: string }) {
  const pasos = texto
    .split("\n")
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => linea.replace(/^\d+[.)]\s*/, ""));

  return (
    <ol style={pasosListaStyle}>
      {pasos.map((paso, idx) => (
        <li key={idx} style={pasosItemStyle}>
          <span style={pasosNumeroStyle}>{idx + 1}</span>
          <span style={pasosTextoStyle}>{paso}</span>
        </li>
      ))}
    </ol>
  );
}

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const panelStyle: CSSProperties = {
  border: "1px solid rgba(200,160,80,0.35)",
  background: "rgba(26,48,34,0.5)",
  padding: "clamp(18px, 3vw, 28px)",
  marginBottom: "2rem",
};

const tituloStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.85rem",
  letterSpacing: "0.08em",
  color: "#c8a050",
  marginBottom: "0.4rem",
};

const fechaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  fontStyle: "italic",
  color: "rgba(212,196,160,0.7)",
  marginBottom: "1.2rem",
};

const botonCerrarStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.6)",
  cursor: "pointer",
  padding: 0,
  display: "flex",
};

const itemsTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.75)",
  marginBottom: "0.8rem",
};

const pasosListaStyle: CSSProperties = {
  listStyle: "none",
  margin: "0.8rem 0 0",
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
  background: "#c8a050",
};

const pasosTextoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.15rem",
  lineHeight: 1.6,
  color: "#e8dcc8",
  paddingTop: "3px",
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

const iconoAccionStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.6)",
  cursor: "pointer",
  padding: "4px 6px",
};
