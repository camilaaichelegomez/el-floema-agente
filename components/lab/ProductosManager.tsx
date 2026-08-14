"use client";

import { useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Pencil, Check, X, Plus, Package } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export interface ProductoConEtiqueta {
  id: number;
  nombre: string;
  categoria: string | null;
  formula_etiquetas: {
    subtitle: string | null;
    category_line: string | null;
    tamano: string | null;
    descripcion_catalogo: string | null;
    descripcion_redes: string | null;
    es_producto?: boolean | null;
  } | null;
}

export interface FormulaOpcion {
  id: number;
  nombre: string;
}

export function ProductosManager({
  productos,
  todasFormulas,
  userId,
}: {
  productos: ProductoConEtiqueta[];
  todasFormulas: FormulaOpcion[];
  userId: string;
}) {
  const router = useRouter();
  const [copiado, setCopiado] = useState<string | null>(null);
  const [quitando, setQuitando] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [panel, setPanel] = useState<"cerrado" | "existente" | "manual">("cerrado");

  const idsProducto = useMemo(() => new Set(productos.map((p) => p.id)), [productos]);
  const formulasDisponibles = useMemo(
    () => todasFormulas.filter((f) => !idsProducto.has(f.id)),
    [todasFormulas, idsProducto]
  );

  async function copiar(id: string, texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      setTimeout(() => setCopiado((cur) => (cur === id ? null : cur)), 1800);
    } catch {
      // portapapeles no disponible — el texto sigue visible para copiar a mano
    }
  }

  async function quitarDeProductos(formulaId: number, nombre: string) {
    if (
      !window.confirm(
        `¿Quitar "${nombre}" de Productos? La etiqueta y las descripciones se conservan; solo deja de aparecer en esta lista.`
      )
    )
      return;
    setError(null);
    setQuitando(formulaId);
    const supabase = createClient();
    const { error: err } = await supabase
      .from("formula_etiquetas")
      .update({ es_producto: false })
      .eq("formula_id", formulaId);
    setQuitando(null);
    if (err) {
      setError(err.message);
      return;
    }
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={cabeceraStyle}>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", margin: 0 }}>
          {productos.length} producto{productos.length === 1 ? "" : "s"}. Descripciones de catálogo y redes listas para
          copiar cuando las necesites.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setPanel((p) => (p === "existente" ? "cerrado" : "existente"))}
            style={botonPrimarioStyle}
          >
            <Plus size={14} /> Agregar producto
          </button>
          <button
            type="button"
            onClick={() => setPanel((p) => (p === "manual" ? "cerrado" : "manual"))}
            style={botonSecundarioStyle}
          >
            <Package size={14} /> Producto manual
          </button>
        </div>
      </div>

      {error && <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a", margin: 0 }}>{error}</p>}

      {panel === "existente" && (
        <AgregarExistente
          formulas={formulasDisponibles}
          userId={userId}
          onListo={() => {
            setPanel("cerrado");
            router.refresh();
          }}
          onError={setError}
        />
      )}

      {panel === "manual" && (
        <CrearManual
          userId={userId}
          onListo={() => {
            setPanel("cerrado");
            router.refresh();
          }}
          onError={setError}
        />
      )}

      {productos.length === 0 ? (
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", opacity: 0.75, margin: 0 }}>
          Todavía no hay productos elegidos. Usá &ldquo;Agregar producto&rdquo; para marcar una fórmula, o &ldquo;Producto
          manual&rdquo; para crear uno a mano.
        </p>
      ) : (
        productos.map((p) => {
          const etiqueta = p.formula_etiquetas;
          const tieneContenido = etiqueta && (etiqueta.descripcion_catalogo || etiqueta.descripcion_redes);

          return (
            <div key={p.id} className="lab-panel" style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div>
                  <h3 style={nombreStyle}>{p.nombre}</h3>
                  {(etiqueta?.subtitle || p.categoria) && (
                    <p style={subtituloStyle}>{etiqueta?.subtitle || p.categoria}</p>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <Link href={`/lab/etiquetas/${p.id}`} style={editarLinkStyle}>
                    <Pencil size={12} /> {tieneContenido ? "Editar" : "Generar"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => quitarDeProductos(p.id, p.nombre)}
                    disabled={quitando === p.id}
                    style={quitarBtnStyle}
                    title="Quitar de la lista de productos"
                  >
                    <X size={12} /> {quitando === p.id ? "Quitando…" : "Quitar"}
                  </button>
                </div>
              </div>

              {tieneContenido ? (
                <div style={contenidoGridStyle}>
                  {etiqueta?.descripcion_catalogo && (
                    <BloqueTexto
                      titulo="Catálogo"
                      texto={etiqueta.descripcion_catalogo}
                      copiado={copiado === `cat-${p.id}`}
                      onCopiar={() => copiar(`cat-${p.id}`, etiqueta.descripcion_catalogo!)}
                    />
                  )}
                  {etiqueta?.descripcion_redes && (
                    <BloqueTexto
                      titulo="Redes sociales"
                      texto={etiqueta.descripcion_redes}
                      copiado={copiado === `red-${p.id}`}
                      onCopiar={() => copiar(`red-${p.id}`, etiqueta.descripcion_redes!)}
                    />
                  )}
                </div>
              ) : (
                <p style={vacioStyle}>
                  Todavía no tiene descripción — entra a &ldquo;Generar&rdquo; para escribirla o usar la IA.
                </p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

/* ── Panel: marcar una fórmula existente como producto ─────────── */

function AgregarExistente({
  formulas,
  userId,
  onListo,
  onError,
}: {
  formulas: FormulaOpcion[];
  userId: string;
  onListo: () => void;
  onError: (msg: string | null) => void;
}) {
  const [seleccion, setSeleccion] = useState<string>("");
  const [guardando, setGuardando] = useState(false);

  async function agregar() {
    const formulaId = Number(seleccion);
    if (!formulaId) return;
    onError(null);
    setGuardando(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("formula_etiquetas")
      .upsert({ formula_id: formulaId, es_producto: true, user_id: userId }, { onConflict: "formula_id" });
    setGuardando(false);
    if (error) {
      onError(error.message);
      return;
    }
    onListo();
  }

  return (
    <div className="lab-panel" style={panelStyle}>
      <p style={panelTituloStyle}>Marcar una fórmula como producto</p>
      {formulas.length === 0 ? (
        <p style={vacioStyle}>Todas tus fórmulas ya están en productos. Crea una nueva en /lab/formulas.</p>
      ) : (
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
          <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)} style={{ ...inputStyle, maxWidth: 340 }}>
            <option value="">Elegí una fórmula…</option>
            {formulas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nombre}
              </option>
            ))}
          </select>
          <button type="button" onClick={agregar} disabled={!seleccion || guardando} style={botonPrimarioStyle}>
            {guardando ? "Agregando…" : "Agregar a productos"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Panel: crear un producto manual (fórmula sin ingredientes) ── */

function CrearManual({
  userId,
  onListo,
  onError,
}: {
  userId: string;
  onListo: () => void;
  onError: (msg: string | null) => void;
}) {
  const [nombre, setNombre] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [catalogo, setCatalogo] = useState("");
  const [redes, setRedes] = useState("");
  const [guardando, setGuardando] = useState(false);

  async function crear() {
    if (!nombre.trim()) {
      onError("El nombre del producto es obligatorio.");
      return;
    }
    onError(null);
    setGuardando(true);
    const supabase = createClient();

    // 1) El producto manual se guarda como una fórmula (sin ingredientes).
    const { data: formula, error: errF } = await supabase
      .from("formulas")
      .insert({ nombre: nombre.trim(), user_id: userId })
      .select("id")
      .single();
    if (errF || !formula) {
      setGuardando(false);
      onError(errF?.message ?? "No se pudo crear el producto.");
      return;
    }

    // 2) Su etiqueta guarda descripciones + la marca de producto.
    const { error: errE } = await supabase.from("formula_etiquetas").upsert(
      {
        formula_id: formula.id,
        user_id: userId,
        es_producto: true,
        subtitle: subtitle.trim() || null,
        descripcion_catalogo: catalogo.trim() || null,
        descripcion_redes: redes.trim() || null,
      },
      { onConflict: "formula_id" }
    );
    setGuardando(false);
    if (errE) {
      onError(errE.message);
      return;
    }
    onListo();
  }

  return (
    <div className="lab-panel" style={panelStyle}>
      <p style={panelTituloStyle}>Nuevo producto manual</p>
      <p style={{ ...vacioStyle, marginBottom: "1rem" }}>
        Se crea sin fórmula ni ingredientes. Después podés abrir &ldquo;Editar&rdquo; para completar la etiqueta impresa
        (INCI, modo de uso, tamaño, etc.).
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
        <CampoManual label="Nombre del producto" value={nombre} onChange={setNombre} />
        <CampoManual label="Subtítulo / línea de categoría" value={subtitle} onChange={setSubtitle} />
        <CampoManualArea label="Descripción de catálogo" value={catalogo} onChange={setCatalogo} />
        <CampoManualArea label="Descripción para redes" value={redes} onChange={setRedes} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.6rem", marginTop: "1.1rem" }}>
        <button type="button" onClick={crear} disabled={guardando} style={botonPrimarioStyle}>
          {guardando ? "Guardando…" : "Crear producto"}
        </button>
      </div>
    </div>
  );
}

function CampoManual({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={campoLabelStyle}>{label}</span>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function CampoManualArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
      <span style={campoLabelStyle}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }} />
    </label>
  );
}

function BloqueTexto({
  titulo,
  texto,
  copiado,
  onCopiar,
}: {
  titulo: string;
  texto: string;
  copiado: boolean;
  onCopiar: () => void;
}) {
  return (
    <div style={bloqueStyle}>
      <div style={bloqueHeaderStyle}>
        <span style={bloqueTituloStyle}>{titulo}</span>
        <button type="button" onClick={onCopiar} style={botonCopiarStyle}>
          {copiado ? <Check size={12} color="#7c9473" /> : <Copy size={12} />}
          {copiado ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p style={bloqueTextoStyle}>{texto}</p>
    </div>
  );
}

const cabeceraStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
};

const cardStyle: CSSProperties = { padding: "1.2rem 1.4rem" };

const cardHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "1rem",
  marginBottom: "0.8rem",
};

const nombreStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "1rem",
  color: "#e8c070",
  letterSpacing: "0.04em",
  margin: 0,
};

const subtituloStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontStyle: "italic",
  fontSize: "0.82rem",
  color: "rgba(212,196,160,0.6)",
  margin: "0.2rem 0 0",
};

const editarLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  flexShrink: 0,
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.58rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#c8a050",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "6px 10px",
  textDecoration: "none",
  whiteSpace: "nowrap",
};

const quitarBtnStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "5px",
  flexShrink: 0,
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.58rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(224,90,74,0.85)",
  background: "none",
  border: "1px solid rgba(224,90,74,0.4)",
  padding: "6px 10px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const contenidoGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "1rem",
};

const bloqueStyle: CSSProperties = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200,160,80,0.15)",
  padding: "0.8rem 1rem",
};

const bloqueHeaderStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "0.4rem",
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
  fontSize: "0.9rem",
  lineHeight: 1.5,
  color: "#d4c4a0",
  margin: 0,
};

const vacioStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontStyle: "italic",
  fontSize: "0.85rem",
  color: "rgba(212,196,160,0.5)",
  margin: 0,
};

const panelStyle: CSSProperties = {
  padding: "1.2rem 1.4rem",
};

const panelTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.72rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#c8a050",
  margin: "0 0 0.9rem",
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
  boxSizing: "border-box",
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
  padding: "10px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const botonSecundarioStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.75)",
  background: "none",
  border: "1px solid rgba(200,160,80,0.3)",
  padding: "10px 16px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};
