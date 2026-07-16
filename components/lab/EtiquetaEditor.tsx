"use client";

import { useState, type CSSProperties } from "react";
import { Copy, Printer, Save, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { computeLayout, type EtiquetaData } from "@/lib/etiquetas";
import { EtiquetaLabel } from "@/components/lab/EtiquetaLabel";

export function EtiquetaEditor({
  formulaId,
  initialData,
  userId,
}: {
  formulaId: number;
  initialData: EtiquetaData;
  userId: string;
}) {
  const [data, setData] = useState<EtiquetaData>(initialData);
  const [guardando, setGuardando] = useState(false);
  const [generandoIA, setGenerandoIA] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardado, setGuardado] = useState(false);

  const L = computeLayout(data.width_mm, data.font_scale);

  function set<K extends keyof EtiquetaData>(key: K, value: EtiquetaData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setGuardado(false);
  }

  async function guardarCampos() {
    const supabase = createClient();
    const { error: err } = await supabase.from("formula_etiquetas").upsert(
      {
        formula_id: formulaId,
        user_id: userId,
        subtitle: data.subtitle || null,
        category_line: data.category_line || null,
        modo_uso: data.modo_uso || null,
        ingredientes: data.ingredientes || null,
        advertencias: data.advertencias || null,
        storage_note: data.storage_note || null,
        social: data.social || null,
        fabricante: data.fabricante || null,
        vencimiento: data.vencimiento || null,
        tamano: data.size || null,
        width_mm: data.width_mm,
        font_scale: data.font_scale,
        descripcion_catalogo: data.descripcion_catalogo || null,
        descripcion_redes: data.descripcion_redes || null,
        actualizada: new Date().toISOString(),
      },
      { onConflict: "formula_id" }
    );
    return err;
  }

  async function generarConIA() {
    setGenerandoIA(true);
    setError(null);
    try {
      const res = await fetch("/api/lab/etiqueta-texto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_name: data.product_name, ingredientes: data.ingredientes }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "No se pudo generar el texto.");
      } else {
        setData((d) => ({
          ...d,
          modo_uso: json.modo_uso || d.modo_uso,
          advertencias: json.advertencias || d.advertencias,
          descripcion_catalogo: json.descripcion_catalogo || d.descripcion_catalogo,
          descripcion_redes: json.descripcion_redes || d.descripcion_redes,
        }));
        setGuardado(false);
      }
    } catch {
      setError("No se pudo generar el texto. Intenta de nuevo.");
    }
    setGenerandoIA(false);
  }

  async function handleGuardar() {
    setGuardando(true);
    setError(null);
    const err = await guardarCampos();
    setGuardando(false);
    if (err) {
      setError("No se pudo guardar la etiqueta.");
      return;
    }
    setGuardado(true);
  }

  async function handleImprimir() {
    setGuardando(true);
    setError(null);
    const err = await guardarCampos();
    setGuardando(false);
    if (err) {
      setError("No se pudieron guardar los campos de la etiqueta, pero igual puedes imprimir.");
    } else {
      setGuardado(true);
    }
    window.print();
  }

  async function copiar(texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      // portapapeles no disponible — el texto sigue visible para copiar a mano
    }
  }

  return (
    <div>
    <div style={wrapStyle}>
      <style>{`
        @media print {
          @page { size: ${L.width_mm}mm ${L.height_mm}mm; margin: 0; }
          body * { visibility: hidden; }
          .etiqueta-imprimir, .etiqueta-imprimir * { visibility: visible; }
          .etiqueta-imprimir { position: fixed; top: 0; left: 0; margin: 0; }
        }
      `}</style>

      <div className="lab-panel" style={formPanelStyle}>
        <h2 style={panelTituloStyle}>Datos de la etiqueta</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <Campo label="Nombre del producto" value={data.product_name} onChange={(v) => set("product_name", v)} />
        <Campo label="Subtítulo" value={data.subtitle} onChange={(v) => set("subtitle", v)} />
        <Campo label="Línea de categoría" value={data.category_line} onChange={(v) => set("category_line", v)} />
        <Campo label="Tamaño (ej: 100 ml)" value={data.size} onChange={(v) => set("size", v)} />
        <CampoTextarea
          label="Ingredientes (INCI)"
          value={data.ingredientes}
          onChange={(v) => set("ingredientes", v)}
          placeholder="Nombres INCI reales — revisa y corrige antes de imprimir."
        />

        <button type="button" onClick={generarConIA} disabled={generandoIA || !data.product_name.trim()} style={botonIAStyle}>
          <Sparkles size={14} />
          {generandoIA ? "Generando…" : "Generar con IA (etiqueta + catálogo + redes)"}
        </button>

        <CampoTextarea label="Modo de uso" value={data.modo_uso} onChange={(v) => set("modo_uso", v)} />
        <CampoTextarea label="Advertencias" value={data.advertencias} onChange={(v) => set("advertencias", v)} />
        <CampoTextarea label="Nota de conservación" value={data.storage_note} onChange={(v) => set("storage_note", v)} />
        <Campo label="Redes sociales" value={data.social} onChange={(v) => set("social", v)} />
        <Campo label="Fabricante" value={data.fabricante} onChange={(v) => set("fabricante", v)} />
        <Campo label="Lote" value={data.lote} onChange={(v) => set("lote", v)} />
        <Campo label="Vencimiento" value={data.vencimiento} onChange={(v) => set("vencimiento", v)} />

        <div style={rowStyle}>
          <Campo
            label="Ancho físico (mm)"
            value={String(data.width_mm)}
            onChange={(v) => set("width_mm", Number(v) || 0)}
            type="number"
          />
          <Campo
            label="Ajuste de letra"
            value={String(data.font_scale)}
            onChange={(v) => set("font_scale", Number(v) || 1)}
            type="number"
          />
        </div>
        <p style={ayudaStyle}>
          Alto calculado: {L.height_mm}mm (proporción fija del arte de fondo).
        </p>

        <div style={{ ...rowStyle, marginTop: "0.6rem" }}>
          <button type="button" onClick={handleGuardar} disabled={guardando} style={botonSecundarioStyle}>
            <Save size={15} />
            {guardando ? "Guardando…" : "Guardar"}
          </button>
          <button type="button" onClick={handleImprimir} disabled={guardando} style={botonImprimirStyle}>
            <Printer size={15} />
            {guardando ? "Guardando…" : "Descargar / Imprimir"}
          </button>
        </div>
        {guardado && <p style={okStyle}>Etiqueta guardada — queda disponible en Productos aunque no la uses ahora.</p>}
      </div>

      <div style={previewWrapStyle}>
        <p style={previewLabelStyle}>Vista previa (tamaño físico real)</p>
        <div style={previewScrollStyle}>
          <EtiquetaLabel data={data} className="etiqueta-imprimir" />
        </div>
      </div>
    </div>

    <div className="lab-panel" style={contenidoPanelStyle}>
      <h2 style={panelTituloStyle}>Contenido para catálogo y redes</h2>
      <p style={ayudaStyle}>No se imprime en la etiqueta — es texto para copiar y pegar donde lo necesites.</p>

      <CampoConCopiar
        label="Descripción para catálogo"
        value={data.descripcion_catalogo}
        onChange={(v) => set("descripcion_catalogo", v)}
        onCopiar={() => copiar(data.descripcion_catalogo)}
      />
      <CampoConCopiar
        label="Copy para redes sociales"
        value={data.descripcion_redes}
        onChange={(v) => set("descripcion_redes", v)}
        onCopiar={() => copiar(data.descripcion_redes)}
      />
    </div>
    </div>
  );
}

function Campo({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <input type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function CampoConCopiar({
  label,
  value,
  onChange,
  onCopiar,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onCopiar: () => void;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoConCopiarLabelRowStyle}>
        <span style={campoLabelStyle}>{label}</span>
        <button type="button" onClick={onCopiar} style={botonCopiarStyle} aria-label={`Copiar ${label}`}>
          <Copy size={12} /> Copiar
        </button>
      </span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} style={textareaStyle} rows={4} />
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
      <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} style={textareaStyle} rows={3} />
    </label>
  );
}

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 380px) 1fr",
  gap: "1.5rem",
  alignItems: "start",
};

const formPanelStyle: CSSProperties = { padding: "1.4rem", display: "flex", flexDirection: "column", gap: "0.7rem" };

const panelTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.85rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#c8a050",
  margin: "0 0 0.4rem",
};

const campoWrapperStyle: CSSProperties = { display: "flex", flexDirection: "column", gap: "0.35rem" };
const campoLabelStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.56rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.7)",
};
const inputStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.9rem",
  color: "#e8dcc8",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200,160,80,0.3)",
  padding: "8px 10px",
  outline: "none",
};
const textareaStyle: CSSProperties = { ...inputStyle, resize: "vertical", lineHeight: 1.4 };
const rowStyle: CSSProperties = { display: "flex", gap: "0.7rem" };
const ayudaStyle: CSSProperties = { fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(212,196,160,0.5)", fontStyle: "italic", margin: 0 };

const botonImprimirStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.65rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#0d1a0d",
  background: "linear-gradient(160deg, #e8c070 0%, #c8a050 55%, #a87f35 100%)",
  border: "1px solid rgba(255, 226, 160, 0.55)",
  padding: "12px 18px",
  cursor: "pointer",
};

const botonSecundarioStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.65rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.85)",
  background: "none",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "12px 18px",
  cursor: "pointer",
};

const botonIAStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "rgba(200,160,80,0.08)",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "9px 14px",
  cursor: "pointer",
};

const errorStyle: CSSProperties = { color: "#e05a4a", fontFamily: "var(--font-body)", fontSize: "0.85rem", margin: 0 };
const okStyle: CSSProperties = { color: "#7c9473", fontFamily: "var(--font-body)", fontSize: "0.8rem", margin: "0.4rem 0 0" };

const previewWrapStyle: CSSProperties = { position: "sticky", top: "1rem" };
const previewLabelStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.5)",
  marginBottom: "0.6rem",
};
const previewScrollStyle: CSSProperties = {
  overflow: "auto",
  border: "1px solid rgba(200,160,80,0.2)",
  padding: "1.5rem",
  background: "#0a0f0a",
};

const contenidoPanelStyle: CSSProperties = {
  padding: "1.4rem",
  marginTop: "1.5rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.9rem",
  maxWidth: 680,
};

const campoConCopiarLabelRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
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
