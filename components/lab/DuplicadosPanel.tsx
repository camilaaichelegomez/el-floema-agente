"use client";

import { useState, type CSSProperties } from "react";
import { Check, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { normalizarTexto } from "@/lib/lab/coincidencias";
import type { InventarioItem } from "@/components/lab/InventarioManager";

export interface GrupoDuplicado {
  clave: string;
  items: InventarioItem[];
}

export function detectarDuplicados(items: InventarioItem[]): GrupoDuplicado[] {
  const mapa = new Map<string, InventarioItem[]>();
  for (const item of items) {
    const clave = `${normalizarTexto(item.ingrediente)}|${item.unidad}`;
    const lista = mapa.get(clave) ?? [];
    lista.push(item);
    mapa.set(clave, lista);
  }
  return Array.from(mapa.entries())
    .filter(([, its]) => its.length > 1)
    .map(([clave, its]) => ({ clave, items: its }));
}

function camposCompletos(item: InventarioItem): number {
  return [item.categoria, item.proveedor, item.fecha_compra, item.vencimiento, item.notas].filter(Boolean).length;
}

function elegirSuperviviente(items: InventarioItem[]): InventarioItem {
  return [...items].sort((a, b) => camposCompletos(b) - camposCompletos(a))[0];
}

export function DuplicadosPanel({
  grupos,
  onCerrar,
  onCambio,
}: {
  grupos: GrupoDuplicado[];
  onCerrar: () => void;
  onCambio: () => Promise<void>;
}) {
  return (
    <div style={panelStyle}>
      <div style={tituloStyle}>
        <span>Posibles duplicados ({grupos.length})</span>
        <button type="button" onClick={onCerrar} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      <p style={ayudaStyle}>
        Agrupé ingredientes con el mismo nombre (ignorando tildes y mayúsculas) y la misma unidad. Elegí cuál dejar
        como principal — las cantidades de los demás se suman ahí y esos otros se borran. Si dos ítems en realidad
        son cosas distintas, destildá el que no corresponda para dejarlo afuera de la fusión, o usá el ícono de
        basurero para borrar directamente un ítem puntual sin fusionarlo con nada.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {grupos.map((grupo) => (
          <GrupoDuplicadoCard key={grupo.clave} grupo={grupo} onCambio={onCambio} />
        ))}
      </div>
    </div>
  );
}

function GrupoDuplicadoCard({ grupo, onCambio }: { grupo: GrupoDuplicado; onCambio: () => Promise<void> }) {
  const [supervivienteId, setSupervivienteId] = useState(() => elegirSuperviviente(grupo.items).id);
  const [incluidos, setIncluidos] = useState<Set<string>>(() => new Set(grupo.items.map((i) => i.id)));
  const [fusionando, setFusionando] = useState(false);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const itemsIncluidos = grupo.items.filter((i) => incluidos.has(i.id));
  const nuevaCantidad = itemsIncluidos.reduce((s, i) => s + i.cantidad, 0);
  const aBorrar = itemsIncluidos.length - 1;

  function toggleIncluir(id: string) {
    setIncluidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      if (!next.has(supervivienteId) && next.size > 0) {
        setSupervivienteId([...next][0]);
      }
      return next;
    });
  }

  async function confirmarFusion() {
    if (!incluidos.has(supervivienteId) || itemsIncluidos.length < 2) return;
    setFusionando(true);
    setError(null);
    const supabase = createClient();

    const otrosIds = itemsIncluidos.filter((i) => i.id !== supervivienteId).map((i) => i.id);

    try {
      if (otrosIds.length > 0) {
        const { error: e1 } = await supabase
          .from("formula_items")
          .update({ inventario_id: supervivienteId })
          .in("inventario_id", otrosIds);
        if (e1) throw e1;

        const { error: e2 } = await supabase
          .from("preparacion_items")
          .update({ inventario_id: supervivienteId })
          .in("inventario_id", otrosIds);
        if (e2) throw e2;
      }

      const { error: e3 } = await supabase
        .from("inventario")
        .update({ cantidad: nuevaCantidad })
        .eq("id", supervivienteId);
      if (e3) throw e3;

      if (otrosIds.length > 0) {
        const { error: e4 } = await supabase.from("inventario").delete().in("id", otrosIds);
        if (e4) throw e4;
      }

      await onCambio();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo fusionar el grupo.");
      setFusionando(false);
    }
  }

  async function borrarItem(item: InventarioItem) {
    if (!window.confirm(`¿Borrar "${item.ingrediente}" (${item.cantidad} ${item.unidad})? No se puede deshacer.`)) {
      return;
    }
    setBorrandoId(item.id);
    setError(null);
    const supabase = createClient();

    try {
      const { error: e1 } = await supabase
        .from("formula_items")
        .update({ inventario_id: null })
        .eq("inventario_id", item.id);
      if (e1) throw e1;

      const { error: e2 } = await supabase
        .from("preparacion_items")
        .update({ inventario_id: null })
        .eq("inventario_id", item.id);
      if (e2) throw e2;

      const { error: e3 } = await supabase.from("inventario").delete().eq("id", item.id);
      if (e3) throw e3;

      await onCambio();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo borrar el ingrediente.");
      setBorrandoId(null);
    }
  }

  return (
    <div style={grupoStyle}>
      <p style={grupoTituloStyle}>
        {grupo.items[0].ingrediente} <span style={grupoUnidadStyle}>({grupo.items[0].unidad})</span>
      </p>
      {error && <p style={errorMiniStyle}>{error}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {grupo.items.map((item) => (
          <label key={item.id} style={filaStyle}>
            <input type="checkbox" checked={incluidos.has(item.id)} onChange={() => toggleIncluir(item.id)} />
            <input
              type="radio"
              name={`superviviente-${grupo.clave}`}
              checked={supervivienteId === item.id}
              disabled={!incluidos.has(item.id)}
              onChange={() => setSupervivienteId(item.id)}
            />
            <span style={{ flex: 1 }}>
              {item.cantidad} {item.unidad}
              {item.proveedor ? ` · ${item.proveedor}` : ""}
              {item.categoria ? ` · ${item.categoria}` : ""}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                borrarItem(item);
              }}
              disabled={borrandoId === item.id}
              style={botonBorrarItemStyle}
              aria-label={`Borrar ${item.ingrediente}`}
              title="Borrar este ítem (sin fusionar)"
            >
              <Trash2 size={13} />
            </button>
          </label>
        ))}
      </div>
      <p style={resultadoStyle}>
        Va a quedar <strong>{nuevaCantidad} {grupo.items[0].unidad}</strong> en el ingrediente marcado con ●
        {aBorrar > 0 && ` · se ${aBorrar === 1 ? "borra" : "borran"} ${aBorrar} fila${aBorrar === 1 ? "" : "s"}`}.
      </p>
      <button
        type="button"
        onClick={confirmarFusion}
        disabled={fusionando || itemsIncluidos.length < 2}
        style={botonFusionarStyle}
      >
        {fusionando ? (
          "Fusionando…"
        ) : (
          <>
            <Check size={13} /> Fusionar este grupo
          </>
        )}
      </button>
    </div>
  );
}

const panelStyle: CSSProperties = {
  border: "1px solid rgba(212, 130, 60, 0.4)",
  background: "rgba(212, 130, 60, 0.06)",
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
  color: "#d4a24a",
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
  fontSize: "0.88rem",
  color: "rgba(212,196,160,0.8)",
  marginBottom: "1.2rem",
};

const grupoStyle: CSSProperties = {
  border: "1px solid rgba(200,160,80,0.25)",
  background: "rgba(26,48,34,0.5)",
  padding: "1rem 1.2rem",
};

const grupoTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.8rem",
  color: "#e8dcc8",
  marginBottom: "0.7rem",
};

const grupoUnidadStyle: CSSProperties = {
  color: "rgba(212,196,160,0.6)",
  fontWeight: 400,
};

const filaStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  color: "#d4c4a0",
};

const botonBorrarItemStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.5)",
  cursor: "pointer",
  padding: "4px 6px",
  flexShrink: 0,
};

const resultadoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  color: "rgba(212,196,160,0.75)",
  margin: "0.8rem 0",
};

const errorMiniStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  marginBottom: "0.6rem",
};

const botonFusionarStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#0d1a0d",
  background: "#d4a24a",
  border: "none",
  padding: "8px 14px",
  cursor: "pointer",
};
