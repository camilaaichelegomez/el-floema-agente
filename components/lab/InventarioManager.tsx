"use client";

import { useState, type CSSProperties, type FormEvent } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export type Unidad = "g" | "ml" | "unidad";

export interface InventarioItem {
  id: string;
  ingrediente: string;
  categoria: string | null;
  cantidad: number;
  unidad: Unidad;
  precio_compra: number | null;
  cantidad_compra: number | null;
  proveedor: string | null;
  fecha_compra: string | null;
  vencimiento: string | null;
  notas: string | null;
  costo_unitario: number | null;
}

type FormState = {
  id: string | null;
  ingrediente: string;
  categoria: string;
  cantidad: string;
  unidad: Unidad;
  precio_compra: string;
  cantidad_compra: string;
  proveedor: string;
  fecha_compra: string;
  vencimiento: string;
  notas: string;
};

const UNIDADES: Unidad[] = ["g", "ml", "unidad"];
const DIAS_ALERTA = 60;

const COLUMNAS =
  "id, ingrediente, categoria, cantidad, unidad, precio_compra, cantidad_compra, proveedor, fecha_compra, vencimiento, notas, costo_unitario";

function formatoCLP(valor: number | null): string {
  if (valor === null || !isFinite(valor)) return "—";
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function formatoFecha(fecha: string | null): string {
  if (!fecha) return "—";
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-CL");
}

function diasHastaVencimiento(fecha: string | null): number | null {
  if (!fecha) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const venc = new Date(`${fecha}T00:00:00`);
  return Math.round((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

function formBlank(): FormState {
  return {
    id: null,
    ingrediente: "",
    categoria: "",
    cantidad: "",
    unidad: "g",
    precio_compra: "",
    cantidad_compra: "",
    proveedor: "",
    fecha_compra: "",
    vencimiento: "",
    notas: "",
  };
}

function itemToForm(item: InventarioItem): FormState {
  return {
    id: item.id,
    ingrediente: item.ingrediente,
    categoria: item.categoria ?? "",
    cantidad: String(item.cantidad ?? ""),
    unidad: item.unidad,
    precio_compra: item.precio_compra !== null ? String(item.precio_compra) : "",
    cantidad_compra: item.cantidad_compra !== null ? String(item.cantidad_compra) : "",
    proveedor: item.proveedor ?? "",
    fecha_compra: item.fecha_compra ?? "",
    vencimiento: item.vencimiento ?? "",
    notas: item.notas ?? "",
  };
}

export function InventarioManager({
  initialItems,
  userId,
}: {
  initialItems: InventarioItem[];
  userId: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState<FormState | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function recargar() {
    const supabase = createClient();
    const { data } = await supabase
      .from("inventario_con_costo")
      .select(COLUMNAS)
      .order("ingrediente", { ascending: true });
    setItems((data as InventarioItem[] | null) ?? []);
  }

  async function handleGuardar(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    if (!form.ingrediente.trim()) {
      setError("El nombre del ingrediente es obligatorio.");
      return;
    }

    setGuardando(true);
    setError(null);

    const payload = {
      ingrediente: form.ingrediente.trim(),
      categoria: form.categoria.trim() || null,
      cantidad: form.cantidad ? Number(form.cantidad) : 0,
      unidad: form.unidad,
      precio_compra: form.precio_compra ? Number(form.precio_compra) : null,
      cantidad_compra: form.cantidad_compra ? Number(form.cantidad_compra) : null,
      proveedor: form.proveedor.trim() || null,
      fecha_compra: form.fecha_compra || null,
      vencimiento: form.vencimiento || null,
      notas: form.notas.trim() || null,
    };

    const supabase = createClient();
    const { error: dbError } = form.id
      ? await supabase.from("inventario").update(payload).eq("id", form.id)
      : await supabase.from("inventario").insert({ ...payload, user_id: userId });

    if (dbError) {
      setError(dbError.message);
      setGuardando(false);
      return;
    }

    await recargar();
    setForm(null);
    setGuardando(false);
  }

  async function handleBorrar(item: InventarioItem) {
    if (!window.confirm(`¿Borrar "${item.ingrediente}" del inventario?`)) return;

    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("inventario").delete().eq("id", item.id);

    if (dbError) {
      setError(dbError.message);
      return;
    }

    await recargar();
  }

  return (
    <div>
      <div style={cabeceraStyle}>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", margin: 0 }}>
          {items.length} ingrediente{items.length === 1 ? "" : "s"} en tu inventario.
        </p>
        <button type="button" onClick={() => setForm(formBlank())} style={botonPrimarioStyle}>
          <Plus size={14} /> Agregar ingrediente
        </button>
      </div>

      {error && <p style={errorStyle}>{error}</p>}

      {form && (
        <FormularioIngrediente
          form={form}
          setForm={setForm}
          onSubmit={handleGuardar}
          onCancel={() => {
            setForm(null);
            setError(null);
          }}
          guardando={guardando}
        />
      )}

      <TablaInventario items={items} onEditar={(item) => setForm(itemToForm(item))} onBorrar={handleBorrar} />
    </div>
  );
}

function FormularioIngrediente({
  form,
  setForm,
  onSubmit,
  onCancel,
  guardando,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  guardando: boolean;
}) {
  return (
    <form onSubmit={onSubmit} style={formularioStyle}>
      <div style={formularioTituloStyle}>
        <span>{form.id ? "Editar ingrediente" : "Nuevo ingrediente"}</span>
        <button type="button" onClick={onCancel} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      <div style={gridFormularioStyle}>
        <CampoTexto label="Ingrediente" value={form.ingrediente} onChange={(v) => setForm({ ...form, ingrediente: v })} requerido />
        <CampoTexto label="Categoría" value={form.categoria} onChange={(v) => setForm({ ...form, categoria: v })} />

        <CampoNumero label="Cantidad en stock" value={form.cantidad} onChange={(v) => setForm({ ...form, cantidad: v })} />
        <label style={campoWrapperStyle}>
          <span style={campoLabelStyle}>Unidad</span>
          <select
            value={form.unidad}
            onChange={(e) => setForm({ ...form, unidad: e.target.value as Unidad })}
            style={inputStyle}
          >
            {UNIDADES.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </label>

        <CampoNumero label="Precio de compra (CLP)" value={form.precio_compra} onChange={(v) => setForm({ ...form, precio_compra: v })} />
        <CampoNumero
          label="Cantidad comprada"
          value={form.cantidad_compra}
          onChange={(v) => setForm({ ...form, cantidad_compra: v })}
        />

        <CampoTexto label="Proveedor" value={form.proveedor} onChange={(v) => setForm({ ...form, proveedor: v })} />

        <label style={campoWrapperStyle}>
          <span style={campoLabelStyle}>Fecha de compra</span>
          <input
            type="date"
            value={form.fecha_compra}
            onChange={(e) => setForm({ ...form, fecha_compra: e.target.value })}
            style={inputStyle}
          />
        </label>

        <label style={campoWrapperStyle}>
          <span style={campoLabelStyle}>Vencimiento</span>
          <input
            type="date"
            value={form.vencimiento}
            onChange={(e) => setForm({ ...form, vencimiento: e.target.value })}
            style={inputStyle}
          />
        </label>

        <div style={{ gridColumn: "1 / -1" }}>
          <CampoTexto label="Notas" value={form.notas} onChange={(v) => setForm({ ...form, notas: v })} />
        </div>
      </div>

      <div style={accionesFormularioStyle}>
        <button type="button" onClick={onCancel} style={botonSecundarioStyle}>
          Cancelar
        </button>
        <button type="submit" disabled={guardando} style={botonPrimarioStyle}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </form>
  );
}

function CampoTexto({
  label,
  value,
  onChange,
  requerido,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  requerido?: boolean;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <input
        type="text"
        value={value}
        required={requerido}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function CampoNumero({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <input
        type="number"
        step="any"
        min="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </label>
  );
}

function TablaInventario({
  items,
  onEditar,
  onBorrar,
}: {
  items: InventarioItem[];
  onEditar: (item: InventarioItem) => void;
  onBorrar: (item: InventarioItem) => void;
}) {
  if (items.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", opacity: 0.75 }}>
        Aún no hay ingredientes. Agrega el primero para empezar a llevar tu inventario.
      </p>
    );
  }

  return (
    <div style={tablaWrapperStyle}>
      <table style={tablaStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Ingrediente</th>
            <th style={thStyle}>Cantidad</th>
            <th style={thStyle}>Costo unitario</th>
            <th style={thStyle}>Proveedor</th>
            <th style={thStyle}>Vencimiento</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const dias = diasHastaVencimiento(item.vencimiento);
            const vencido = dias !== null && dias < 0;
            const porVencer = dias !== null && dias >= 0 && dias < DIAS_ALERTA;
            const colorVencimiento = vencido ? "#e05a4a" : porVencer ? "#d4a62a" : "#d4c4a0";

            return (
              <tr key={item.id}>
                <td style={tdStyle}>
                  <span style={{ color: "#e8dcc8" }}>{item.ingrediente}</span>
                  {item.categoria && <span style={subtituloStyle}>{item.categoria}</span>}
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {item.cantidad} {item.unidad}
                </td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                  {item.costo_unitario !== null ? `${formatoCLP(item.costo_unitario)} / ${item.unidad}` : "—"}
                </td>
                <td style={tdStyle}>{item.proveedor || "—"}</td>
                <td style={{ ...tdStyle, whiteSpace: "nowrap", color: colorVencimiento, fontWeight: vencido || porVencer ? 600 : 400 }}>
                  {formatoFecha(item.vencimiento)}
                  {vencido && " · vencido"}
                  {porVencer && ` · en ${dias}d`}
                </td>
                <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                  <button type="button" onClick={() => onEditar(item)} style={iconoAccionStyle} aria-label="Editar">
                    <Pencil size={14} />
                  </button>
                  <button type="button" onClick={() => onBorrar(item)} style={iconoAccionStyle} aria-label="Borrar">
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const cabeceraStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
  marginBottom: "1.5rem",
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
  background: "#c8a050",
  border: "none",
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

const botonCerrarStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.6)",
  cursor: "pointer",
  padding: 0,
  display: "flex",
};

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const formularioStyle: CSSProperties = {
  border: "1px solid rgba(200,160,80,0.35)",
  background: "rgba(26,48,34,0.5)",
  padding: "clamp(18px, 3vw, 28px)",
  marginBottom: "2rem",
};

const formularioTituloStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.85rem",
  letterSpacing: "0.08em",
  color: "#c8a050",
  marginBottom: "1.2rem",
};

const gridFormularioStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "1rem",
  marginBottom: "1.4rem",
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

const accionesFormularioStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "0.6rem",
};

const tablaWrapperStyle: CSSProperties = {
  overflowX: "auto",
  border: "1px solid rgba(200, 160, 80, 0.32)",
};

const tablaStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "720px",
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

const subtituloStyle: CSSProperties = {
  display: "block",
  fontSize: "0.72rem",
  fontStyle: "italic",
  color: "rgba(212,196,160,0.6)",
};

const iconoAccionStyle: CSSProperties = {
  background: "none",
  border: "none",
  color: "rgba(212,196,160,0.6)",
  cursor: "pointer",
  padding: "4px 6px",
};
