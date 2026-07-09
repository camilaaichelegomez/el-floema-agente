"use client";

import { useState, type CSSProperties } from "react";
import { AlertOctagon, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { InventarioItem } from "@/components/lab/InventarioManager";

const PALABRA_CONFIRMACION = "ELIMINAR";

export function VaciarInventarioPanel({
  items,
  onCerrar,
  onVaciado,
}: {
  items: InventarioItem[];
  onCerrar: () => void;
  onVaciado: () => Promise<void>;
}) {
  const [confirmacion, setConfirmacion] = useState("");
  const [vaciando, setVaciando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const habilitado = confirmacion.trim().toUpperCase() === PALABRA_CONFIRMACION;

  async function confirmarVaciado() {
    if (!habilitado || items.length === 0) return;
    setVaciando(true);
    setError(null);
    const supabase = createClient();
    const ids = items.map((i) => i.id);

    try {
      const { error: e1 } = await supabase
        .from("formula_items")
        .update({ inventario_id: null })
        .in("inventario_id", ids);
      if (e1) throw e1;

      const { error: e2 } = await supabase
        .from("preparacion_items")
        .update({ inventario_id: null })
        .in("inventario_id", ids);
      if (e2) throw e2;

      const { error: e3 } = await supabase.from("inventario").delete().in("id", ids);
      if (e3) throw e3;

      await onVaciado();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo vaciar el inventario.");
      setVaciando(false);
    }
  }

  return (
    <div style={panelStyle}>
      <div style={tituloStyle}>
        <span>
          <AlertOctagon size={16} style={{ marginRight: 8, verticalAlign: "text-bottom" }} />
          Vaciar inventario
        </span>
        <button type="button" onClick={onCerrar} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      <p style={ayudaStyle}>
        Esto va a borrar los <strong>{items.length}</strong> ingrediente{items.length === 1 ? "" : "s"} de tu
        inventario. No se puede deshacer. Las fórmulas y preparaciones que usaban estos ingredientes no se borran,
        pero pierden el vínculo — dejan de calcular costo o descontar stock automáticamente para esos ítems.
      </p>

      <label style={campoWrapperStyle}>
        <span style={campoLabelStyle}>Escribí ELIMINAR para confirmar</span>
        <input
          type="text"
          value={confirmacion}
          onChange={(e) => setConfirmacion(e.target.value)}
          style={inputStyle}
          placeholder="ELIMINAR"
          autoComplete="off"
        />
      </label>

      {error && <p style={errorStyle}>{error}</p>}

      <div style={accionesStyle}>
        <button type="button" onClick={onCerrar} style={botonSecundarioStyle}>
          Cancelar
        </button>
        <button type="button" onClick={confirmarVaciado} disabled={!habilitado || vaciando} style={botonPeligroStyle}>
          {vaciando ? (
            "Vaciando…"
          ) : (
            <>
              <Trash2 size={14} /> Vaciar inventario
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const panelStyle: CSSProperties = {
  border: "1px solid rgba(224, 90, 74, 0.5)",
  background: "rgba(224, 90, 74, 0.06)",
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
  color: "#e05a4a",
  marginBottom: "0.8rem",
};

const botonCerrarStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.6)",
  cursor: "pointer",
  padding: 0,
  display: "flex",
};

const ayudaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  color: "rgba(212,196,160,0.85)",
  marginBottom: "1.2rem",
  lineHeight: 1.5,
};

const campoWrapperStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  maxWidth: 260,
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
  border: "1px solid rgba(224, 90, 74, 0.4)",
  padding: "9px 10px",
  outline: "none",
  width: "100%",
};

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginTop: "1rem",
};

const accionesStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.6rem",
  marginTop: "1.4rem",
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

const botonPeligroStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#fff",
  background: "#e05a4a",
  border: "none",
  padding: "10px 18px",
  cursor: "pointer",
};
