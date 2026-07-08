"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Check, FileText, Loader2, Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import type { InventarioItem, Unidad } from "@/components/lab/InventarioManager";

const UNIDADES: Unidad[] = ["g", "ml", "unidad"];
const CREAR_NUEVO = "nuevo";

type ModoCantidad = "reemplazar" | "sumar";

interface ItemRevision {
  nombre: string;
  categoria: string;
  cantidad: string;
  unidad: Unidad;
  proveedor: string;
  matchId: string;
  modo: ModoCantidad;
  incluir: boolean;
}

function adivinarCoincidencia(nombre: string, items: InventarioItem[]): string {
  const n = nombre.trim().toLowerCase();
  if (!n) return CREAR_NUEVO;
  const encontrado = items.find(
    (i) => n.includes(i.ingrediente.toLowerCase()) || i.ingrediente.toLowerCase().includes(n)
  );
  return encontrado ? encontrado.id : CREAR_NUEVO;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const resultado = reader.result as string;
      resolve(resultado.split(",")[1] ?? "");
    };
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

export function SubirInventarioPanel({
  items,
  userId,
  onCancelar,
  onGuardado,
}: {
  items: InventarioItem[];
  userId: string;
  onCancelar: () => void;
  onGuardado: () => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [archivoNombre, setArchivoNombre] = useState<string | null>(null);
  const [revision, setRevision] = useState<ItemRevision[] | null>(null);

  async function handleArchivo(file: File | undefined) {
    if (!file) return;
    setError(null);
    setRevision(null);
    setArchivoNombre(file.name);
    setPreview(file.type.startsWith("image/") ? URL.createObjectURL(file) : null);
    setCargando(true);

    try {
      const imageBase64 = await fileToBase64(file);
      const res = await fetch("/api/lab/inventario-importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64, mimeType: file.type || "image/jpeg" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "No se pudo leer el archivo.");
        setCargando(false);
        return;
      }

      setRevision(
        (
          data.items as Array<{
            nombre: string;
            categoria: string | null;
            cantidad: number | null;
            unidad: Unidad;
            proveedor: string | null;
          }>
        ).map((it) => ({
          nombre: it.nombre,
          categoria: it.categoria ?? "",
          cantidad: it.cantidad !== null ? String(it.cantidad) : "",
          unidad: it.unidad,
          proveedor: it.proveedor ?? "",
          matchId: adivinarCoincidencia(it.nombre, items),
          modo: "reemplazar",
          incluir: true,
        }))
      );
    } catch {
      setError("No se pudo leer el archivo. Intenta de nuevo.");
    }

    setCargando(false);
  }

  function actualizarFila(idx: number, patch: Partial<ItemRevision>) {
    setRevision((r) => (r ? r.map((it, i) => (i === idx ? { ...it, ...patch } : it)) : r));
  }

  function cancelarTodo() {
    setRevision(null);
    setPreview(null);
    setArchivoNombre(null);
    setError(null);
    onCancelar();
  }

  async function confirmar() {
    if (!revision) return;
    setGuardando(true);
    setError(null);

    const supabase = createClient();
    const incluidos = revision.filter((it) => it.incluir);

    for (const it of incluidos) {
      const cantidad = it.cantidad ? Number(it.cantidad) : 0;

      if (it.matchId !== CREAR_NUEVO) {
        const existente = items.find((i) => i.id === it.matchId);
        if (!existente) continue;
        const nuevaCantidad = it.modo === "sumar" ? existente.cantidad + cantidad : cantidad;
        const { error: dbError } = await supabase
          .from("inventario")
          .update({ cantidad: nuevaCantidad })
          .eq("id", it.matchId);

        if (dbError) {
          setError(dbError.message);
          setGuardando(false);
          return;
        }
      } else {
        const { error: dbError } = await supabase.from("inventario").insert({
          ingrediente: it.nombre.trim() || "Insumo sin nombre",
          categoria: it.categoria.trim() || null,
          unidad: it.unidad,
          cantidad,
          proveedor: it.proveedor.trim() || null,
          user_id: userId,
        });

        if (dbError) {
          setError(dbError.message);
          setGuardando(false);
          return;
        }
      }
    }

    setGuardando(false);
    setRevision(null);
    setPreview(null);
    setArchivoNombre(null);
    await onGuardado();
  }

  return (
    <div style={panelStyle}>
      <div style={tituloStyle}>
        <span>Subir inventario</span>
        <button type="button" onClick={cancelarTodo} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      {!revision && (
        <>
          <p style={ayudaStyle}>
            Sube una foto, PDF, Excel o Word con tu lista de insumos (un inventario completo, no una boleta de
            compra). La IA lee los ingredientes y cantidades — tú revisas y confirmas antes de que se actualice tu
            inventario.
          </p>
          <label style={dropzoneStyle}>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,application/pdf,.xlsx,.xls,.docx"
              style={{ display: "none" }}
              onChange={(e) => handleArchivo(e.target.files?.[0])}
            />
            {cargando ? (
              <Loader2 size={22} className="animate-spin" color="#c8a050" />
            ) : (
              <Upload size={22} color="#d4c4a0" />
            )}
            <span style={{ fontFamily: "var(--font-body)", color: "#d4c4a0" }}>
              {cargando ? "Leyendo documento…" : "Toca para subir tu lista de inventario (foto, PDF, Excel o Word)"}
            </span>
          </label>
          {error && <p style={errorStyle}>{error}</p>}
        </>
      )}

      {revision && (
        <div>
          <div style={{ display: "flex", gap: "0.8rem", alignItems: "flex-start", marginBottom: "1rem" }}>
            {preview ? (
              <img src={preview} alt="Inventario" style={previewImgStyle} />
            ) : (
              archivoNombre && (
                <div style={previewArchivoStyle}>
                  <FileText size={22} color="#c8a050" />
                  <span style={previewArchivoNombreStyle}>{archivoNombre}</span>
                </div>
              )
            )}
            <p style={ayudaStyle}>
              Revisa lo que la IA leyó antes de confirmar. Si un insumo ya existe en tu inventario, elige si la
              cantidad del archivo <strong>reemplaza</strong> el stock guardado o se <strong>suma</strong> a él. Si no
              existe, se creará como nuevo.
            </p>
          </div>

          {error && <p style={errorStyle}>{error}</p>}

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {revision.map((it, idx) => (
              <div key={idx} style={{ ...filaStyle, opacity: it.incluir ? 1 : 0.5 }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <input
                    type="checkbox"
                    checked={it.incluir}
                    onChange={(e) => actualizarFila(idx, { incluir: e.target.checked })}
                  />
                  <span style={campoLabelStyle}>Incluir</span>
                </label>

                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Ingrediente leído</span>
                  <input
                    type="text"
                    value={it.nombre}
                    onChange={(e) => actualizarFila(idx, { nombre: e.target.value })}
                    style={inputStyle}
                  />
                </label>

                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Coincide con</span>
                  <select
                    value={it.matchId}
                    onChange={(e) => actualizarFila(idx, { matchId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value={CREAR_NUEVO}>— Crear insumo nuevo —</option>
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.ingrediente}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Cantidad</span>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={it.cantidad}
                    onChange={(e) => actualizarFila(idx, { cantidad: e.target.value })}
                    style={inputStyle}
                  />
                </label>

                <label style={campoWrapperStyle}>
                  <span style={campoLabelStyle}>Unidad</span>
                  <select
                    value={it.unidad}
                    onChange={(e) => actualizarFila(idx, { unidad: e.target.value as Unidad })}
                    style={inputStyle}
                  >
                    {UNIDADES.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </label>

                {it.matchId !== CREAR_NUEVO ? (
                  <label style={campoWrapperStyle}>
                    <span style={campoLabelStyle}>Cantidad del archivo</span>
                    <select
                      value={it.modo}
                      onChange={(e) => actualizarFila(idx, { modo: e.target.value as ModoCantidad })}
                      style={inputStyle}
                    >
                      <option value="reemplazar">Reemplaza el stock actual</option>
                      <option value="sumar">Se suma al stock actual</option>
                    </select>
                  </label>
                ) : (
                  <>
                    <label style={campoWrapperStyle}>
                      <span style={campoLabelStyle}>Categoría</span>
                      <input
                        type="text"
                        value={it.categoria}
                        onChange={(e) => actualizarFila(idx, { categoria: e.target.value })}
                        style={inputStyle}
                      />
                    </label>
                    <label style={campoWrapperStyle}>
                      <span style={campoLabelStyle}>Proveedor</span>
                      <input
                        type="text"
                        value={it.proveedor}
                        onChange={(e) => actualizarFila(idx, { proveedor: e.target.value })}
                        style={inputStyle}
                      />
                    </label>
                  </>
                )}
              </div>
            ))}
          </div>

          <div style={accionesStyle}>
            <button type="button" onClick={cancelarTodo} style={botonSecundarioStyle}>
              Cancelar
            </button>
            <button type="button" onClick={confirmar} disabled={guardando} style={botonPrimarioStyle}>
              {guardando ? (
                "Guardando…"
              ) : (
                <>
                  <Check size={14} /> Confirmar y actualizar inventario
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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

const ayudaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.88rem",
  color: "rgba(212,196,160,0.75)",
  flex: 1,
};

const dropzoneStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.6rem",
  border: "1px dashed rgba(200,160,80,0.4)",
  padding: "2.5rem 1rem",
  cursor: "pointer",
};

const previewImgStyle: CSSProperties = {
  width: 84,
  height: 84,
  objectFit: "cover",
  border: "1px solid rgba(200,160,80,0.3)",
  flexShrink: 0,
};

const previewArchivoStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.3rem",
  width: 84,
  height: 84,
  border: "1px solid rgba(200,160,80,0.3)",
  flexShrink: 0,
  padding: "0.4rem",
  textAlign: "center",
};

const previewArchivoNombreStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.62rem",
  color: "rgba(212,196,160,0.75)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
};

const filaStyle: CSSProperties = {
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

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginTop: "0.6rem",
};
