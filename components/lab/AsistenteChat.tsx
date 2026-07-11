"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { Check, Send, Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { adivinarCoincidencia } from "@/lib/lab/coincidencias";

export interface InventarioOpcion {
  id: number;
  ingrediente: string;
  unidad: string;
  costo_unitario: number | null;
}

interface Mensaje {
  role: "user" | "model";
  content: string;
}

interface FormulaSugeridaItem {
  ingrediente: string;
  gramos: number | null;
  porcentaje: number | null;
  fase: string | null;
}

interface FormulaSugerida {
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  ph_objetivo: string | null;
  rinde_gramos: number | null;
  unidades: number | null;
  pasos: string | null;
  items: FormulaSugeridaItem[];
}

interface FormularioGuardado {
  nombre: string;
  categoria: string;
  descripcion: string;
  ph_objetivo: string;
  rinde_gramos: string;
  unidades: string;
  notas: string;
  pasos: string;
  items: Array<{
    ingrediente: string;
    inventario_id: number | null;
    gramos: string;
    porcentaje: string;
    fase: string;
  }>;
}

const BIENVENIDA: Mensaje = {
  role: "model",
  content:
    "Hola, soy tu asistente de formulación para el Lab. Conozco tu inventario actual, así que puedo ayudarte a armar fórmulas priorizando lo que ya tienes en stock. Contame qué querés crear.",
};

function adivinarInventarioId(nombre: string, opciones: InventarioOpcion[]): number | null {
  return adivinarCoincidencia(nombre, opciones)?.id ?? null;
}

function extraerFormulaSugerida(texto: string): { textoLimpio: string; formula: FormulaSugerida | null } {
  const match = texto.match(/```formula\s*([\s\S]*?)```/);
  if (!match) return { textoLimpio: texto, formula: null };

  const textoLimpio = texto.slice(0, match.index).trim();
  try {
    const parsed = JSON.parse(match[1].trim());
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) {
      return { textoLimpio, formula: null };
    }
    return { textoLimpio, formula: parsed as FormulaSugerida };
  } catch {
    return { textoLimpio, formula: null };
  }
}

function formularioDesde(formula: FormulaSugerida, opciones: InventarioOpcion[]): FormularioGuardado {
  return {
    nombre: formula.nombre ?? "",
    categoria: formula.categoria ?? "",
    descripcion: formula.descripcion ?? "",
    ph_objetivo: formula.ph_objetivo ?? "",
    rinde_gramos: formula.rinde_gramos !== null && formula.rinde_gramos !== undefined ? String(formula.rinde_gramos) : "",
    unidades: formula.unidades !== null && formula.unidades !== undefined ? String(formula.unidades) : "",
    notas: "",
    pasos: formula.pasos ?? "",
    items: (formula.items ?? []).map((it) => ({
      ingrediente: it.ingrediente,
      inventario_id: adivinarInventarioId(it.ingrediente, opciones),
      gramos: it.gramos !== null && it.gramos !== undefined ? String(it.gramos) : "",
      porcentaje: it.porcentaje !== null && it.porcentaje !== undefined ? String(it.porcentaje) : "",
      fase: it.fase ?? "",
    })),
  };
}

export function AsistenteChat({
  inventarioOpciones,
  userId,
}: {
  inventarioOpciones: InventarioOpcion[];
  userId: string;
}) {
  const [mensajes, setMensajes] = useState<Mensaje[]>([BIENVENIDA]);
  const [input, setInput] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [revision, setRevision] = useState<FormularioGuardado | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [formulaGuardada, setFormulaGuardada] = useState<string | null>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, enviando]);

  async function enviarMensaje(e: FormEvent) {
    e.preventDefault();
    const texto = input.trim();
    if (!texto || enviando) return;

    const historial = [...mensajes, { role: "user" as const, content: texto }];
    setMensajes(historial);
    setInput("");
    setError(null);
    setEnviando(true);

    try {
      // Manda solo la cola reciente (el server limita a 40 mensajes), cuidando que
      // el historial empiece con un mensaje de la usuaria (lo exige Gemini).
      const recortados = historial.filter((m) => m !== BIENVENIDA).slice(-30);
      while (recortados.length > 0 && recortados[0].role !== "user") recortados.shift();

      const res = await fetch("/api/lab/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recortados }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No pude responder. Intenta de nuevo.");
        setEnviando(false);
        return;
      }

      setMensajes([...historial, { role: "model", content: data.reply }]);
    } catch {
      setError("No pude responder. Intenta de nuevo.");
    }

    setEnviando(false);
  }

  function abrirRevision(formula: FormulaSugerida) {
    setFormulaGuardada(null);
    setRevision(formularioDesde(formula, inventarioOpciones));
  }

  function actualizarItem(idx: number, patch: Partial<FormularioGuardado["items"][number]>) {
    setRevision((r) => (r ? { ...r, items: r.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) } : r));
  }

  async function confirmarGuardado() {
    if (!revision) return;
    if (!revision.nombre.trim()) {
      setError("La fórmula necesita un nombre antes de guardarse.");
      return;
    }

    setGuardando(true);
    setError(null);
    const supabase = createClient();

    const { data: formulaData, error: dbError } = await supabase
      .from("formulas")
      .insert({
        nombre: revision.nombre.trim(),
        categoria: revision.categoria.trim() || null,
        descripcion: revision.descripcion.trim() || null,
        ph_objetivo: revision.ph_objetivo.trim() || null,
        rinde_gramos: revision.rinde_gramos ? Number(revision.rinde_gramos) : null,
        unidades: revision.unidades ? Number(revision.unidades) : null,
        notas: revision.notas.trim() || null,
        pasos: revision.pasos.trim() || null,
        user_id: userId,
      })
      .select("id")
      .single();

    if (dbError || !formulaData) {
      setError(dbError?.message ?? "No se pudo guardar la fórmula.");
      setGuardando(false);
      return;
    }

    for (const it of revision.items) {
      if (!it.ingrediente.trim()) continue;
      const { error: itemError } = await supabase.from("formula_items").insert({
        formula_id: formulaData.id,
        ingrediente: it.ingrediente.trim(),
        inventario_id: it.inventario_id,
        gramos: it.gramos ? Number(it.gramos) : 0,
        porcentaje: it.porcentaje ? Number(it.porcentaje) : null,
        fase: it.fase.trim() || null,
        user_id: userId,
      });

      if (itemError) {
        setError(itemError.message);
        setGuardando(false);
        return;
      }
    }

    setGuardando(false);
    setFormulaGuardada(revision.nombre.trim());
    setRevision(null);
  }

  return (
    <div>
      {error && <p style={errorStyle}>{error}</p>}
      {formulaGuardada && (
        <div className="lab-ok-msg" style={guardadoBoxStyle}>
          <span>&ldquo;{formulaGuardada}&rdquo; se guardó correctamente.</span>
          <Link href="/lab/formulas" style={botonVerFormulaStyle}>
            Ver fórmula
          </Link>
        </div>
      )}

      <div className="lab-panel" style={chatWrapperStyle}>
        <div style={mensajesStyle}>
          {mensajes.map((m, idx) => {
            const { textoLimpio, formula } = m.role === "model" ? extraerFormulaSugerida(m.content) : { textoLimpio: m.content, formula: null };
            return (
              <div key={idx} style={m.role === "user" ? burbujaUsuarioStyle : burbujaModeloStyle}>
                <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{textoLimpio}</p>
                {formula && (
                  <button type="button" onClick={() => abrirRevision(formula)} style={botonGuardarFormulaStyle}>
                    <Sparkles size={13} /> Guardar como fórmula
                  </button>
                )}
              </div>
            );
          })}
          {enviando && <div style={burbujaModeloStyle}>Pensando…</div>}
          <div ref={finRef} />
        </div>

        <form onSubmit={enviarMensaje} style={formInputStyle}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ej: quiero una crema corporal con lo que tengo en stock…"
            style={inputChatStyle}
          />
          <button type="submit" disabled={enviando || !input.trim()} style={botonEnviarStyle} aria-label="Enviar">
            <Send size={16} />
          </button>
        </form>
      </div>

      {revision && (
        <div className="lab-panel" style={panelRevisionStyle}>
          <div style={tituloRevisionStyle}>
            <span>Guardar como fórmula</span>
            <button type="button" onClick={() => setRevision(null)} style={botonCerrarStyle} aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>

          <div style={gridFormularioStyle}>
            <Campo label="Nombre" value={revision.nombre} onChange={(v) => setRevision({ ...revision, nombre: v })} />
            <Campo label="Categoría" value={revision.categoria} onChange={(v) => setRevision({ ...revision, categoria: v })} />
            <Campo label="pH objetivo" value={revision.ph_objetivo} onChange={(v) => setRevision({ ...revision, ph_objetivo: v })} />
            <Campo label="Rinde (gramos)" value={revision.rinde_gramos} onChange={(v) => setRevision({ ...revision, rinde_gramos: v })} />
            <Campo label="Unidades que rinde" value={revision.unidades} onChange={(v) => setRevision({ ...revision, unidades: v })} />
            <div style={{ gridColumn: "1 / -1" }}>
              <Campo label="Descripción" value={revision.descripcion} onChange={(v) => setRevision({ ...revision, descripcion: v })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <Campo
                label="Observaciones"
                value={revision.notas}
                onChange={(v) => setRevision({ ...revision, notas: v })}
                placeholder="Notas para replicar esta versión: por qué la elegiste, ajustes de la próxima vez, etc."
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <CampoTextarea
                label="Pasos a seguir"
                value={revision.pasos}
                onChange={(v) => setRevision({ ...revision, pasos: v })}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {revision.items.map((it, idx) => (
              <div key={idx} style={filaItemStyle}>
                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Ingrediente</span>
                  <input
                    type="text"
                    value={it.ingrediente}
                    onChange={(e) => actualizarItem(idx, { ingrediente: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Coincide con inventario</span>
                  <select
                    value={it.inventario_id !== null ? String(it.inventario_id) : "custom"}
                    onChange={(e) =>
                      actualizarItem(idx, { inventario_id: e.target.value === "custom" ? null : Number(e.target.value) })
                    }
                    style={inputStyle}
                  >
                    <option value="custom">— Personalizado (sin costo) —</option>
                    {inventarioOpciones.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.ingrediente} ({o.unidad})
                      </option>
                    ))}
                  </select>
                </label>
                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Gramos</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={it.gramos}
                    onChange={(e) => actualizarItem(idx, { gramos: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>%</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={it.porcentaje}
                    onChange={(e) => actualizarItem(idx, { porcentaje: e.target.value })}
                    style={inputStyle}
                  />
                </label>
                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Fase</span>
                  <input type="text" value={it.fase} onChange={(e) => actualizarItem(idx, { fase: e.target.value })} style={inputStyle} />
                </label>
              </div>
            ))}
          </div>

          <div style={accionesStyle}>
            <button type="button" onClick={() => setRevision(null)} style={botonSecundarioStyle}>
              Cancelar
            </button>
            <button type="button" onClick={confirmarGuardado} disabled={guardando} style={botonPrimarioStyle}>
              {guardando ? "Guardando…" : (
                <>
                  <Check size={14} /> Confirmar y guardar fórmula
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <input type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function CampoTextarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={textareaStyle} rows={10} />
    </label>
  );
}

const chatWrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "min(70vh, 640px)",
};

const mensajesStyle: CSSProperties = {
  flex: 1,
  overflowY: "auto",
  padding: "1.2rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.8rem",
};

const burbujaBaseStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  padding: "0.7rem 0.9rem",
  maxWidth: "80%",
  lineHeight: 1.5,
};

const burbujaUsuarioStyle: CSSProperties = {
  ...burbujaBaseStyle,
  alignSelf: "flex-end",
  background: "rgba(200,160,80,0.18)",
  color: "#e8dcc8",
};

const burbujaModeloStyle: CSSProperties = {
  ...burbujaBaseStyle,
  alignSelf: "flex-start",
  background: "rgba(255,255,255,0.04)",
  color: "#d4c4a0",
};

const botonGuardarFormulaStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "none",
  border: "1px solid rgba(200,160,80,0.4)",
  padding: "8px 12px",
  marginTop: "0.6rem",
  cursor: "pointer",
};

const formInputStyle: CSSProperties = {
  display: "flex",
  gap: "0.6rem",
  padding: "0.8rem",
  borderTop: "1px solid rgba(200,160,80,0.25)",
};

const inputChatStyle: CSSProperties = {
  flex: 1,
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "#e8dcc8",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200, 160, 80, 0.3)",
  padding: "9px 10px",
  outline: "none",
};

const botonEnviarStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#0d1a0d",
  background: "linear-gradient(160deg, #e8c070 0%, #c8a050 55%, #a87f35 100%)",
  border: "1px solid rgba(255, 226, 160, 0.55)",
  borderRadius: 2,
  boxShadow: "0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,240,200,0.5)",
  padding: "0 16px",
  cursor: "pointer",
};

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const guardadoBoxStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  color: "#7c9473",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const botonVerFormulaStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#c8a050",
  border: "1px solid rgba(200,160,80,0.4)",
  padding: "6px 12px",
  textDecoration: "none",
};

const panelRevisionStyle: CSSProperties = {
  padding: "clamp(18px, 3vw, 28px)",
  marginTop: "1.5rem",
};

const tituloRevisionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.85rem",
  letterSpacing: "0.08em",
  color: "#c8a050",
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

const gridFormularioStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "1rem",
  marginBottom: "1.2rem",
};

const filaItemStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "0.6rem",
  alignItems: "end",
  border: "1px solid rgba(200,160,80,0.18)",
  padding: "0.7rem",
};

const campoWrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
};

const campoLabelStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.56rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.7)",
};

const inputStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  color: "#e8dcc8",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200, 160, 80, 0.3)",
  padding: "9px 10px",
  outline: "none",
  width: "100%",
};

const textareaStyle: CSSProperties = {
  ...inputStyle,
  resize: "vertical",
  lineHeight: 1.5,
};

const accionesStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.6rem",
  marginTop: "1.2rem",
};

const botonPrimarioStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#0d1a0d",
  background: "linear-gradient(160deg, #e8c070 0%, #c8a050 55%, #a87f35 100%)",
  border: "1px solid rgba(255, 226, 160, 0.55)",
  borderRadius: 2,
  boxShadow: "0 2px 10px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,240,200,0.5)",
  padding: "10px 18px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const botonSecundarioStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.75)",
  background: "none",
  border: "1px solid rgba(200,160,80,0.3)",
  padding: "10px 18px",
  cursor: "pointer",
};
