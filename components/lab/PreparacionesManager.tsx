"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Check, Eye, MessageSquare, Package, Sparkles, Tag, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export interface Preparacion {
  id: number;
  formula_id: number | null;
  nombre_formula: string;
  cantidad_gramos: number;
  pasos: string | null;
  notas: string | null;
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
  const [notaTexto, setNotaTexto] = useState("");
  const [guardandoNota, setGuardandoNota] = useState(false);
  const [esProducto, setEsProducto] = useState<boolean | null>(null);
  const [guardandoProducto, setGuardandoProducto] = useState(false);

  async function recargarLista() {
    const supabase = createClient();
    const { data } = await supabase
      .from("preparaciones")
      .select("id, formula_id, nombre_formula, cantidad_gramos, pasos, notas, creado")
      .order("creado", { ascending: false });
    setPreparaciones((data as Preparacion[] | null) ?? []);
  }

  async function abrirVer(preparacion: Preparacion) {
    setError(null);
    setCargando(true);
    setViendo(preparacion);
    setNotaTexto(preparacion.notas ?? "");
    setEsProducto(null);
    const items = await cargarItems(preparacion.id);
    setItemsViendo(items);
    if (preparacion.formula_id) {
      const supabase = createClient();
      const { data } = await supabase
        .from("formula_etiquetas")
        .select("es_producto")
        .eq("formula_id", preparacion.formula_id)
        .maybeSingle();
      setEsProducto(Boolean(data?.es_producto));
    }
    setCargando(false);
  }

  async function toggleProducto() {
    if (!viendo?.formula_id) return;
    const objetivo = !esProducto;
    setError(null);
    setGuardandoProducto(true);
    const supabase = createClient();
    // upsert por formula_id: si ya hay etiqueta, solo cambia es_producto y conserva
    // la etiqueta + descripción de catálogo + descripción de redes ya guardadas.
    const { error: err } = await supabase
      .from("formula_etiquetas")
      .upsert({ formula_id: viendo.formula_id, es_producto: objetivo }, { onConflict: "formula_id" });
    setGuardandoProducto(false);
    if (err) {
      setError(err.message);
      return;
    }
    setEsProducto(objetivo);
  }

  async function guardarNota() {
    if (!viendo || notaTexto === (viendo.notas ?? "")) return;
    setGuardandoNota(true);
    const supabase = createClient();
    const { error: err } = await supabase.from("preparaciones").update({ notas: notaTexto }).eq("id", viendo.id);
    setGuardandoNota(false);
    if (err) {
      setError(err.message);
      return;
    }
    setViendo({ ...viendo, notas: notaTexto });
    setPreparaciones((prev) => prev.map((p) => (p.id === viendo.id ? { ...p, notas: notaTexto } : p)));
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

    // Una sola transacción: devuelve el stock y borra el registro — todo o nada.
    const { error: rpcError } = await supabase.rpc("borrar_preparacion", { p_id: preparacion.id });

    if (rpcError) {
      setError(rpcError.message);
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
        {preparaciones.length === 1 ? "" : "s"}. Hacé clic en &ldquo;Ver / Comentar&rdquo; para dejar comentarios de cada
        receta.
      </p>

      {error && <p style={errorStyle}>{error}</p>}

      {viendo && (
        <div className="lab-panel" style={panelStyle}>
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
              <div style={notaDestacadaStyle}>
                <span style={itemsTituloStyle}>Comentarios de la receta</span>
                <p style={notaAyudaStyle}>¿Cómo quedó? ¿Qué mejorar la próxima vez? Se guarda solo al salir del campo.</p>
                <textarea
                  value={notaTexto}
                  onChange={(e) => setNotaTexto(e.target.value)}
                  onBlur={guardarNota}
                  placeholder="Ej: quedó muy líquida, subir la cera al 8%. El aroma de lavanda se sintió poco, agregar más la próxima…"
                  style={notaTextareaStyle}
                  rows={4}
                />
                {guardandoNota && <span style={notaGuardandoStyle}>Guardando…</span>}
              </div>

              <p style={itemsTituloStyle}>Ingredientes usados</p>
              <div className="lab-tabla-marco" style={tablaWrapperStyle}>
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

              <div style={{ marginTop: "1.6rem" }}>
                <span style={itemsTituloStyle}>Etiqueta y contenido</span>
                {viendo.formula_id ? (
                  <>
                    <div style={accesosDirectosStyle}>
                      <Link href={`/lab/etiquetas/${viendo.formula_id}`} style={accesoDirectoStyle}>
                        <Tag size={13} /> Generar etiqueta
                      </Link>
                      <Link href={`/lab/etiquetas/${viendo.formula_id}`} style={accesoDirectoStyle}>
                        <Sparkles size={13} /> Copy de catálogo y redes
                      </Link>
                      <button
                        type="button"
                        onClick={toggleProducto}
                        disabled={guardandoProducto || esProducto === null}
                        style={esProducto ? productoActivoStyle : accesoDirectoStyle}
                      >
                        {esProducto ? <Check size={13} /> : <Package size={13} />}
                        {guardandoProducto
                          ? "Guardando…"
                          : esProducto
                            ? "En productos — quitar"
                            : "Añadir a productos"}
                      </button>
                    </div>
                    <p style={productoAyudaStyle}>
                      {esProducto
                        ? "Aparece en la sección Productos con su etiqueta y descripciones."
                        : "Márcala para que aparezca en la sección Productos. Se conserva la etiqueta y las descripciones de catálogo y redes."}
                    </p>
                  </>
                ) : (
                  <p style={notaGuardandoStyle}>
                    Esta preparación no está vinculada a una fórmula (se borró o no la tenía), así que no se puede
                    generar etiqueta desde acá.
                  </p>
                )}
              </div>
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
        <div className="lab-tabla-marco" style={tablaWrapperStyle}>
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
              {preparaciones.map((p) => {
                const tieneNota = (p.notas ?? "").trim().length > 0;
                return (
                  <tr key={p.id}>
                    <td style={tdStyle}>
                      <button type="button" onClick={() => abrirVer(p)} style={nombreBotonStyle}>
                        {p.nombre_formula}
                      </button>
                      {tieneNota && (
                        <span style={notaBadgeStyle}>
                          <MessageSquare size={11} /> con comentario
                        </span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{p.cantidad_gramos} g</td>
                    <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatoFecha(p.creado)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                      <button type="button" onClick={() => abrirVer(p)} style={verComentarBotonStyle}>
                        <Eye size={13} /> Ver / Comentar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBorrar(p)}
                        disabled={borrando === p.id}
                        style={iconoAccionStyle}
                        aria-label="Borrar"
                        title="Borrar preparación (devuelve el stock al inventario)"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
  background: "radial-gradient(circle at 35% 30%, #e8c070, #c8a050 60%, #a87f35)",
  borderRadius: "50%",
  border: "1px solid rgba(255, 226, 160, 0.5)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.45)",
};

const pasosTextoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1.15rem",
  lineHeight: 1.6,
  color: "#e8dcc8",
  paddingTop: "3px",
};

const notaTextareaStyle: CSSProperties = {
  width: "100%",
  marginTop: "0.8rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  color: "#e8dcc8",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200, 160, 80, 0.3)",
  padding: "10px 12px",
  outline: "none",
  resize: "vertical",
  lineHeight: 1.5,
  boxSizing: "border-box",
};

const notaGuardandoStyle: CSSProperties = {
  display: "block",
  marginTop: "0.4rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.78rem",
  fontStyle: "italic",
  color: "rgba(212,196,160,0.5)",
};

const notaDestacadaStyle: CSSProperties = {
  border: "1px solid rgba(200,160,80,0.3)",
  background: "rgba(200,160,80,0.05)",
  padding: "1rem 1.2rem",
  marginBottom: "1.6rem",
};

const notaAyudaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.8rem",
  fontStyle: "italic",
  color: "rgba(212,196,160,0.6)",
  margin: "0.2rem 0 0",
};

const nombreBotonStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "#e8dcc8",
  background: "none",
  border: "none",
  borderBottom: "1px dashed rgba(200,160,80,0.4)",
  cursor: "pointer",
  padding: 0,
  textAlign: "left",
};

const notaBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
  marginLeft: "0.6rem",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.5rem",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "rgba(124,148,115,0.9)",
  border: "1px solid rgba(124,148,115,0.4)",
  padding: "2px 6px",
  whiteSpace: "nowrap",
};

const verComentarBotonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.55rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "none",
  border: "1px solid rgba(200,160,80,0.4)",
  padding: "6px 10px",
  cursor: "pointer",
  marginRight: "6px",
};

const accesosDirectosStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.6rem",
  marginTop: "0.6rem",
};

const accesoDirectoStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "none",
  cursor: "pointer",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "8px 12px",
  textDecoration: "none",
};

const productoActivoStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#0d1a0d",
  background: "radial-gradient(circle at 35% 30%, #e8c070, #c8a050 60%, #a87f35)",
  border: "1px solid rgba(200,160,80,0.6)",
  padding: "8px 12px",
  cursor: "pointer",
};

const productoAyudaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.78rem",
  fontStyle: "italic",
  color: "rgba(212,196,160,0.55)",
  margin: "0.6rem 0 0",
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
