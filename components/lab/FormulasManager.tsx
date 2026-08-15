"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Eye, FlaskConical, ListChecks, Package, Pencil, Plus, Tag, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { adivinarCoincidencia } from "@/lib/lab/coincidencias";

export interface InventarioOpcion {
  id: number;
  ingrediente: string;
  unidad: string;
  costo_unitario: number | null;
  cantidad: number;
}

export interface FormulaCosto {
  costo_lote: number;
  costo_unidad: number;
  precio_sugerido: number | null;
  unidades: number;
  margen: number | null;
}

export interface Formula {
  id: number;
  nombre: string;
  categoria: string | null;
  descripcion: string | null;
  lote: string | null;
  rinde_gramos: number | null;
  unidades: number | null;
  margen: number | null;
  ph_objetivo: string | null;
  notas: string | null;
  pasos: string | null;
  created_at: string | null;
  costo: FormulaCosto | null;
}

interface FormulaItemRow {
  id: number | null;
  ingrediente: string;
  inventario_id: number | null;
  gramos: string;
  porcentaje: string;
  fase: string;
}

interface FormulaFormState {
  id: number | null;
  nombre: string;
  categoria: string;
  descripcion: string;
  lote: string;
  rinde_gramos: string;
  unidades: string;
  margen: string;
  ph_objetivo: string;
  notas: string;
  pasos: string;
  items: FormulaItemRow[];
}

const CUSTOM = "custom";

function formatoCLP(valor: number | null): string {
  if (valor === null || !isFinite(valor)) return "—";
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

function formatoFecha(valor: string | null): string {
  if (!valor) return "—";
  const d = new Date(valor);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CL", { day: "2-digit", month: "long", year: "numeric" });
}

function formBlank(): FormulaFormState {
  return {
    id: null,
    nombre: "",
    categoria: "",
    descripcion: "",
    lote: "",
    rinde_gramos: "",
    unidades: "",
    margen: "",
    ph_objetivo: "",
    notas: "",
    pasos: "",
    items: [],
  };
}

function itemBlank(): FormulaItemRow {
  return { id: null, ingrediente: "", inventario_id: null, gramos: "", porcentaje: "", fase: "" };
}

async function cargarFormula(formulaId: number): Promise<FormulaItemRow[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("formula_items")
    .select("id, ingrediente, inventario_id, gramos, porcentaje, fase")
    .eq("formula_id", formulaId)
    .order("id", { ascending: true });

  return (data ?? []).map((it) => ({
    id: it.id,
    ingrediente: it.ingrediente,
    inventario_id: it.inventario_id,
    gramos: String(it.gramos ?? ""),
    porcentaje: it.porcentaje !== null ? String(it.porcentaje) : "",
    fase: it.fase ?? "",
  }));
}

export function FormulasManager({
  initialFormulas,
  inventarioOpciones,
  userId,
  productoIdsIniciales = [],
}: {
  initialFormulas: Formula[];
  inventarioOpciones: InventarioOpcion[];
  userId: string;
  productoIdsIniciales?: number[];
}) {
  const [formulas, setFormulas] = useState(initialFormulas);
  const [productos, setProductos] = useState<Set<number>>(() => new Set(productoIdsIniciales));
  const [guardandoProducto, setGuardandoProducto] = useState<number | null>(null);
  const [form, setForm] = useState<FormulaFormState | null>(null);
  const [itemsOriginales, setItemsOriginales] = useState<FormulaItemRow[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viendo, setViendo] = useState<Formula | null>(null);
  const [itemsViendo, setItemsViendo] = useState<FormulaItemRow[]>([]);
  const [agregandoTarea, setAgregandoTarea] = useState<number | null>(null);
  const [tareaAgregada, setTareaAgregada] = useState<number | null>(null);
  const [cargandoVer, setCargandoVer] = useState(false);

  const costoPorInventarioId = useMemo(() => {
    const mapa = new Map<number, number | null>();
    inventarioOpciones.forEach((o) => mapa.set(o.id, o.costo_unitario));
    return mapa;
  }, [inventarioOpciones]);

  async function recargarLista() {
    const supabase = createClient();
    const { data: formulasData } = await supabase.from("formulas").select("*").order("nombre", { ascending: true });
    const lista = formulasData ?? [];
    const costos = await Promise.all(
      lista.map((f) => supabase.rpc("costo_formula", { f_id: f.id }).then(({ data }) => data?.[0] ?? null))
    );
    setFormulas(lista.map((f, i) => ({ ...f, costo: costos[i] })));
  }

  async function abrirNueva() {
    setViendo(null);
    setForm(formBlank());
    setItemsOriginales([]);
    setError(null);
  }

  async function abrirVer(formula: Formula) {
    setForm(null);
    setCargandoVer(true);
    setError(null);
    setViendo(formula);
    const items = await cargarFormula(formula.id);
    setItemsViendo(items);
    setCargandoVer(false);
  }

  async function abrirEditar(formula: Formula) {
    setViendo(null);
    setCargando(true);
    setError(null);
    const items = await cargarFormula(formula.id);
    setItemsOriginales(items);
    setForm({
      id: formula.id,
      nombre: formula.nombre,
      categoria: formula.categoria ?? "",
      descripcion: formula.descripcion ?? "",
      lote: formula.lote ?? "",
      rinde_gramos: formula.rinde_gramos !== null ? String(formula.rinde_gramos) : "",
      unidades: formula.unidades !== null ? String(formula.unidades) : "",
      margen: formula.margen !== null ? String(formula.margen) : "",
      ph_objetivo: formula.ph_objetivo ?? "",
      notas: formula.notas ?? "",
      pasos: formula.pasos ?? "",
      items,
    });
    setCargando(false);
  }

  function actualizarItem(idx: number, patch: Partial<FormulaItemRow>) {
    setForm((f) => (f ? { ...f, items: f.items.map((it, i) => (i === idx ? { ...it, ...patch } : it)) } : f));
  }

  function agregarItem() {
    setForm((f) => (f ? { ...f, items: [...f.items, itemBlank()] } : f));
  }

  function quitarItem(idx: number) {
    setForm((f) => (f ? { ...f, items: f.items.filter((_, i) => i !== idx) } : f));
  }

  const costoEstimado = useMemo(() => {
    if (!form) return 0;
    return form.items.reduce((suma, it) => {
      if (!it.inventario_id) return suma;
      const costoUnit = costoPorInventarioId.get(it.inventario_id);
      const gramos = Number(it.gramos) || 0;
      return costoUnit ? suma + gramos * costoUnit : suma;
    }, 0);
  }, [form, costoPorInventarioId]);

  async function handleGuardar(e: FormEvent) {
    e.preventDefault();
    if (!form) return;

    if (!form.nombre.trim()) {
      setError("El nombre de la fórmula es obligatorio.");
      return;
    }
    if (form.items.some((it) => !it.ingrediente.trim())) {
      setError("Cada línea de ingrediente necesita un nombre.");
      return;
    }

    setGuardando(true);
    setError(null);
    const supabase = createClient();

    const formulaPayload = {
      nombre: form.nombre.trim(),
      categoria: form.categoria.trim() || null,
      descripcion: form.descripcion.trim() || null,
      lote: form.lote.trim() || null,
      rinde_gramos: form.rinde_gramos ? Number(form.rinde_gramos) : null,
      unidades: form.unidades ? Number(form.unidades) : null,
      margen: form.margen ? Number(form.margen) : null,
      ph_objetivo: form.ph_objetivo.trim() || null,
      notas: form.notas.trim() || null,
      pasos: form.pasos.trim() || null,
    };

    let formulaId = form.id;

    if (formulaId) {
      const { error: dbError } = await supabase.from("formulas").update(formulaPayload).eq("id", formulaId);
      if (dbError) {
        setError(dbError.message);
        setGuardando(false);
        return;
      }
    } else {
      const { data, error: dbError } = await supabase
        .from("formulas")
        .insert({ ...formulaPayload, user_id: userId })
        .select("id")
        .single();
      if (dbError || !data) {
        setError(dbError?.message ?? "No se pudo crear la fórmula.");
        setGuardando(false);
        return;
      }
      formulaId = data.id;
    }

    const idsOriginales = new Set(itemsOriginales.map((it) => it.id).filter((id): id is number => id !== null));
    const idsActuales = new Set(form.items.map((it) => it.id).filter((id): id is number => id !== null));
    const idsABorrar = [...idsOriginales].filter((id) => !idsActuales.has(id));

    if (idsABorrar.length > 0) {
      const { error: dbError } = await supabase.from("formula_items").delete().in("id", idsABorrar);
      if (dbError) {
        setError(dbError.message);
        setGuardando(false);
        return;
      }
    }

    for (const it of form.items) {
      const itemPayload = {
        formula_id: formulaId,
        ingrediente: it.ingrediente.trim(),
        inventario_id: it.inventario_id,
        gramos: it.gramos ? Number(it.gramos) : 0,
        porcentaje: it.porcentaje ? Number(it.porcentaje) : null,
        fase: it.fase.trim() || null,
      };

      const { error: dbError } = it.id
        ? await supabase.from("formula_items").update(itemPayload).eq("id", it.id)
        : await supabase.from("formula_items").insert({ ...itemPayload, user_id: userId });

      if (dbError) {
        setError(dbError.message);
        setGuardando(false);
        return;
      }
    }

    await recargarLista();
    setForm(null);
    setGuardando(false);
  }

  async function handleBorrar(formula: Formula): Promise<boolean> {
    if (!window.confirm(`¿Borrar la fórmula "${formula.nombre}"? Esto también borra sus ingredientes.`)) return false;

    setError(null);
    const supabase = createClient();
    await supabase.from("formula_items").delete().eq("formula_id", formula.id);
    const { error: dbError } = await supabase.from("formulas").delete().eq("id", formula.id);

    if (dbError) {
      setError(dbError.message);
      return false;
    }

    await recargarLista();
    return true;
  }

  async function toggleProducto(formula: Formula) {
    const objetivo = !productos.has(formula.id);
    setError(null);
    setGuardandoProducto(formula.id);
    const supabase = createClient();
    // upsert por formula_id: conserva la etiqueta y las descripciones ya guardadas,
    // solo cambia la marca es_producto.
    const { error: dbError } = await supabase
      .from("formula_etiquetas")
      .upsert({ formula_id: formula.id, es_producto: objetivo, user_id: userId }, { onConflict: "formula_id" });
    setGuardandoProducto(null);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    setProductos((prev) => {
      const next = new Set(prev);
      if (objetivo) next.add(formula.id);
      else next.delete(formula.id);
      return next;
    });
  }

  async function handleAgregarATareas(formula: Formula) {
    setError(null);
    setAgregandoTarea(formula.id);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("floema_tareas").insert({
      user_id: userId,
      titulo: formula.nombre,
      tipo: "receta",
      urgencia: "normal",
      tiempo: null,
      hecha: false,
      nota: "",
      formula_id: formula.id,
    });
    setAgregandoTarea(null);
    if (dbError) {
      setError("No se pudo agregar la fórmula a Tareas.");
      return;
    }
    setTareaAgregada(formula.id);
    setTimeout(() => setTareaAgregada((cur) => (cur === formula.id ? null : cur)), 2500);
  }

  return (
    <div>
      {!form && !viendo && (
        <div style={cabeceraStyle}>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", margin: 0 }}>
            {formulas.length} fórmula{formulas.length === 1 ? "" : "s"}.
          </p>
          <button type="button" onClick={abrirNueva} style={botonPrimarioStyle}>
            <Plus size={14} /> Nueva fórmula
          </button>
        </div>
      )}

      {(form || viendo) && (
        <button
          type="button"
          onClick={() => {
            setForm(null);
            setViendo(null);
            setError(null);
          }}
          style={volverBotonStyle}
        >
          <ArrowLeft size={14} /> Volver a la lista
        </button>
      )}

      {error && <p style={errorStyle}>{error}</p>}

      {form && (
        <FormularioFormula
          form={form}
          setForm={setForm}
          onSubmit={handleGuardar}
          onCancel={() => {
            setForm(null);
            setError(null);
          }}
          guardando={guardando}
          cargando={cargando}
          inventarioOpciones={inventarioOpciones}
          costoEstimado={costoEstimado}
          onActualizarItem={actualizarItem}
          onAgregarItem={agregarItem}
          onQuitarItem={quitarItem}
        />
      )}

      {viendo && (
        <VistaFormula
          formula={viendo}
          items={itemsViendo}
          cargando={cargandoVer}
          inventarioOpciones={inventarioOpciones}
          onCerrar={() => setViendo(null)}
          onEditar={() => abrirEditar(viendo)}
          onBorrar={async () => {
            const ok = await handleBorrar(viendo);
            if (ok) setViendo(null);
          }}
        />
      )}

      {!form && !viendo && (
        <TablaFormulas
          formulas={formulas}
          onVer={abrirVer}
          onEditar={abrirEditar}
          onBorrar={handleBorrar}
          onAgregarTarea={handleAgregarATareas}
          agregandoTarea={agregandoTarea}
          tareaAgregada={tareaAgregada}
          productos={productos}
          onToggleProducto={toggleProducto}
          guardandoProducto={guardandoProducto}
        />
      )}
    </div>
  );
}

function VistaFormula({
  formula,
  items,
  cargando,
  inventarioOpciones,
  onCerrar,
  onEditar,
  onBorrar,
}: {
  formula: Formula;
  items: FormulaItemRow[];
  cargando: boolean;
  inventarioOpciones: InventarioOpcion[];
  onCerrar: () => void;
  onEditar: () => void;
  onBorrar: () => void;
}) {
  const router = useRouter();
  const [preparando, setPreparando] = useState(false);
  const [cantidadDeseada, setCantidadDeseada] = useState(() =>
    formula.rinde_gramos ? String(formula.rinde_gramos) : ""
  );
  const [guardandoPreparacion, setGuardandoPreparacion] = useState(false);
  const [errorPreparacion, setErrorPreparacion] = useState<string | null>(null);
  const [preparado, setPreparado] = useState(false);
  const [vinculosManual, setVinculosManual] = useState<Record<number, number>>({});

  const inventarioPorId = useMemo(() => {
    const mapa = new Map<number, InventarioOpcion>();
    inventarioOpciones.forEach((o) => mapa.set(o.id, o));
    return mapa;
  }, [inventarioOpciones]);

  const rindeBase = formula.rinde_gramos || items.reduce((suma, it) => suma + (Number(it.gramos) || 0), 0);
  const cantidadDeseadaNum = Number(cantidadDeseada) || 0;
  const factor = rindeBase > 0 ? cantidadDeseadaNum / rindeBase : 0;
  const itemsConDescuento = items.map((it) => {
    let inventarioIdEfectivo = (it.id !== null ? vinculosManual[it.id] : undefined) ?? it.inventario_id;
    let autoVinculado = false;
    if (inventarioIdEfectivo === null || inventarioIdEfectivo === undefined) {
      const coincidencia = adivinarCoincidencia(it.ingrediente, inventarioOpciones);
      if (coincidencia) {
        inventarioIdEfectivo = coincidencia.id;
        autoVinculado = true;
      }
    }
    const opcion = inventarioIdEfectivo !== null && inventarioIdEfectivo !== undefined
      ? inventarioPorId.get(inventarioIdEfectivo)
      : undefined;
    const aDescontar = Math.round((Number(it.gramos) || 0) * factor * 100) / 100;
    const stockResultante = opcion ? Math.round((opcion.cantidad - aDescontar) * 100) / 100 : null;
    return { ...it, inventarioIdEfectivo, opcion, aDescontar, stockResultante, autoVinculado };
  });

  async function confirmarPreparacion() {
    setGuardandoPreparacion(true);
    setErrorPreparacion(null);
    const supabase = createClient();

    // Incluye los vínculos manuales y los que se adivinaron automáticamente
    // por nombre, para que la función en la base de datos los aplique igual.
    const vinculosEfectivos: Record<number, number> = {};
    for (const it of itemsConDescuento) {
      if (
        it.id !== null &&
        it.inventarioIdEfectivo !== null &&
        it.inventarioIdEfectivo !== undefined &&
        it.inventarioIdEfectivo !== it.inventario_id
      ) {
        vinculosEfectivos[it.id] = it.inventarioIdEfectivo;
      }
    }

    // Una sola transacción en la base de datos: aplica vínculos manuales,
    // descuenta el inventario y registra la preparación — todo o nada.
    const { error: rpcError } = await supabase.rpc("preparar_formula", {
      f_id: formula.id,
      gramos_deseados: cantidadDeseadaNum,
      vinculos: vinculosEfectivos,
    });

    if (rpcError) {
      setErrorPreparacion(rpcError.message);
      setGuardandoPreparacion(false);
      return;
    }

    setGuardandoPreparacion(false);
    setPreparando(false);
    setPreparado(true);
    router.refresh();
  }

  return (
    <div className="lab-panel" style={formularioStyle}>
      <div style={formularioTituloStyle}>
        <span>{formula.nombre}</span>
        <button type="button" onClick={onCerrar} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      {cargando ? (
        <p style={{ fontFamily: "var(--font-body)", color: "#d4c4a0", opacity: 0.7 }}>Cargando…</p>
      ) : (
        <>
          <div style={gridVistaStyle}>
            <DatoVista label="Categoría" valor={formula.categoria} />
            <DatoVista label="Lote" valor={formula.lote} />
            <DatoVista label="Rinde" valor={formula.rinde_gramos ? `${formula.rinde_gramos} g` : null} />
            <DatoVista label="Unidades que rinde" valor={formula.unidades ? String(formula.unidades) : null} />
            <DatoVista label="pH objetivo" valor={formula.ph_objetivo} />
            <DatoVista label="Creada el" valor={formula.created_at ? formatoFecha(formula.created_at) : null} />
            <DatoVista label="Costo por unidad" valor={formatoCLP(formula.costo?.costo_unidad ?? null)} />
            <DatoVista label="Precio sugerido" valor={formatoCLP(formula.costo?.precio_sugerido ?? null)} />
          </div>

          {formula.descripcion && (
            <div style={{ marginBottom: "1.2rem" }}>
              <span style={campoLabelStyle}>Descripción</span>
              <p style={textoVistaStyle}>{formula.descripcion}</p>
            </div>
          )}

          <div style={dividerStyle} />

          <p style={itemsTituloStyle}>Ingredientes</p>
          {items.length === 0 ? (
            <p style={{ fontFamily: "var(--font-body)", color: "#d4c4a0", opacity: 0.7 }}>Sin ingredientes cargados.</p>
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
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{it.ingrediente}</td>
                      <td style={tdStyle}>{it.gramos || "—"}</td>
                      <td style={tdStyle}>{it.porcentaje || "—"}</td>
                      <td style={tdStyle}>{it.fase || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {formula.pasos && (
            <div style={{ marginTop: "1.6rem" }}>
              <span style={itemsTituloStyle}>Pasos a seguir</span>
              <PasosVista texto={formula.pasos} />
            </div>
          )}

          {formula.notas && (
            <div style={{ marginTop: "1.2rem" }}>
              <span style={campoLabelStyle}>Observaciones</span>
              <p style={textoVistaStyle}>{formula.notas}</p>
            </div>
          )}

          {preparado && (
            <p className="lab-ok-msg" style={okStyle}>Inventario descontado y guardado en /lab/preparadas.</p>
          )}
          {errorPreparacion && <p style={errorStyle}>{errorPreparacion}</p>}

          {preparando && (
            <div style={prepararPanelStyle}>
              <p style={itemsTituloStyle}>¿Cuántos gramos vas a preparar?</p>
              <input
                type="number"
                step="any"
                min="0"
                value={cantidadDeseada}
                onChange={(e) => setCantidadDeseada(e.target.value)}
                placeholder={rindeBase ? `Ej: ${rindeBase}` : "Ej: 300"}
                style={{ ...inputStyle, maxWidth: 140, marginBottom: "0.4rem" }}
              />
              <p style={estimadoStyle}>
                {formula.rinde_gramos
                  ? `La receta original rinde ${formula.rinde_gramos} g. Se recalculan las cantidades de forma proporcional.`
                  : `Esta fórmula no tiene "Rinde" definido, así que se usa la suma de sus ingredientes (${rindeBase} g) como base.`}
              </p>

              <div className="lab-tabla-marco" style={{ ...tablaWrapperStyle, marginTop: "1rem" }}>
                <table style={tablaStyle}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Ingrediente</th>
                      <th style={thStyle}>Se descuenta</th>
                      <th style={thStyle}>Stock actual</th>
                      <th style={thStyle}>Quedará</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itemsConDescuento.map((it, idx) => (
                      <tr key={idx}>
                        <td style={tdStyle}>
                          {it.ingrediente}
                          {it.autoVinculado && (
                            <span style={{ display: "block", fontSize: "0.72rem", color: "#8fae7a", fontStyle: "italic" }}>
                              vinculado automáticamente
                            </span>
                          )}
                        </td>
                        <td style={tdStyle}>{it.aDescontar}</td>
                        <td style={tdStyle}>
                          {it.opcion ? `${it.opcion.cantidad} ${it.opcion.unidad}` : "—"}
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            color: it.stockResultante !== null && it.stockResultante < 0 ? "#e05a4a" : tdStyle.color,
                            fontWeight: it.stockResultante !== null && it.stockResultante < 0 ? 600 : 400,
                          }}
                        >
                          {it.opcion ? (
                            it.stockResultante
                          ) : (
                            <select
                              value=""
                              onChange={(e) => {
                                if (it.id === null || !e.target.value) return;
                                setVinculosManual((prev) => ({ ...prev, [it.id as number]: Number(e.target.value) }));
                              }}
                              style={inputStyle}
                            >
                              <option value="">Vincular al inventario…</option>
                              {inventarioOpciones.map((o) => (
                                <option key={o.id} value={o.id}>
                                  {o.ingrediente} ({o.cantidad} {o.unidad} disponibles)
                                </option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={accionesFormularioStyle}>
                <button type="button" onClick={() => setPreparando(false)} style={botonSecundarioStyle}>
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={confirmarPreparacion}
                  disabled={guardandoPreparacion || cantidadDeseadaNum <= 0 || rindeBase <= 0}
                  style={botonPrimarioStyle}
                >
                  {guardandoPreparacion ? (
                    "Descontando…"
                  ) : (
                    <>
                      <Check size={14} /> Confirmar y descontar del inventario
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div style={accionesFormularioStyle}>
            {!preparando && (
              <button
                type="button"
                onClick={() => {
                  setPreparado(false);
                  setErrorPreparacion(null);
                  setPreparando(true);
                }}
                style={botonSecundarioStyle}
              >
                <FlaskConical size={14} style={{ marginRight: 6 }} /> Preparar esta fórmula
              </button>
            )}
            <button type="button" onClick={onEditar} style={botonPrimarioStyle}>
              <Pencil size={14} /> Editar
            </button>
            <button
              type="button"
              onClick={onBorrar}
              style={{ ...botonSecundarioStyle, color: "#e0785f", borderColor: "rgba(224,120,95,0.4)" }}
            >
              <Trash2 size={14} style={{ marginRight: 6 }} /> Borrar
            </button>
          </div>
        </>
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

function DatoVista({ label, valor }: { label: string; valor: string | null }) {
  return (
    <div>
      <span style={campoLabelStyle}>{label}</span>
      <p style={{ ...textoVistaStyle, marginTop: "0.3rem" }}>{valor || "—"}</p>
    </div>
  );
}

function FormularioFormula({
  form,
  setForm,
  onSubmit,
  onCancel,
  guardando,
  cargando,
  inventarioOpciones,
  costoEstimado,
  onActualizarItem,
  onAgregarItem,
  onQuitarItem,
}: {
  form: FormulaFormState;
  setForm: (f: FormulaFormState) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  guardando: boolean;
  cargando: boolean;
  inventarioOpciones: InventarioOpcion[];
  costoEstimado: number;
  onActualizarItem: (idx: number, patch: Partial<FormulaItemRow>) => void;
  onAgregarItem: () => void;
  onQuitarItem: (idx: number) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="lab-panel" style={formularioStyle}>
      <div style={formularioTituloStyle}>
        <span>{form.id ? "Editar fórmula" : "Nueva fórmula"}</span>
        <button type="button" onClick={onCancel} style={botonCerrarStyle} aria-label="Cerrar">
          <X size={16} />
        </button>
      </div>

      <div style={gridFormularioStyle}>
        <Campo label="Nombre" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} requerido />
        <Campo label="Categoría" value={form.categoria} onChange={(v) => setForm({ ...form, categoria: v })} />
        <Campo label="Lote" value={form.lote} onChange={(v) => setForm({ ...form, lote: v })} />
        <CampoNumero label="Rinde (gramos)" value={form.rinde_gramos} onChange={(v) => setForm({ ...form, rinde_gramos: v })} />
        <CampoNumero label="Unidades que rinde" value={form.unidades} onChange={(v) => setForm({ ...form, unidades: v })} />
        <CampoNumero
          label="Margen (multiplicador sobre costo, ej. 1.4)"
          value={form.margen}
          onChange={(v) => setForm({ ...form, margen: v })}
        />
        <Campo label="pH objetivo" value={form.ph_objetivo} onChange={(v) => setForm({ ...form, ph_objetivo: v })} />
        <div style={{ gridColumn: "1 / -1" }}>
          <Campo label="Descripción" value={form.descripcion} onChange={(v) => setForm({ ...form, descripcion: v })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <Campo label="Notas" value={form.notas} onChange={(v) => setForm({ ...form, notas: v })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <CampoTextarea
            label="Pasos a seguir"
            value={form.pasos}
            onChange={(v) => setForm({ ...form, pasos: v })}
            placeholder="1. Fundir la fase oleosa a baño maría...&#10;2. Agregar la fase acuosa...&#10;3. Emulsionar..."
          />
        </div>
      </div>

      <div style={dividerStyle} />

      <div style={{ marginBottom: "1rem" }}>
        <p style={itemsTituloStyle}>Ingredientes de la fórmula</p>
        {cargando ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#d4c4a0", opacity: 0.7 }}>Cargando…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {form.items.map((it, idx) => (
              <FilaItem
                key={idx}
                item={it}
                inventarioOpciones={inventarioOpciones}
                onChange={(patch) => onActualizarItem(idx, patch)}
                onQuitar={() => onQuitarItem(idx)}
              />
            ))}
          </div>
        )}
        <button type="button" onClick={onAgregarItem} style={botonAgregarItemStyle}>
          <Plus size={13} /> Agregar ingrediente
        </button>
        <p style={estimadoStyle}>
          Costo estimado del lote (según tu inventario actual): <strong>{formatoCLP(costoEstimado)}</strong>
        </p>
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

function FilaItem({
  item,
  inventarioOpciones,
  onChange,
  onQuitar,
}: {
  item: FormulaItemRow;
  inventarioOpciones: InventarioOpcion[];
  onChange: (patch: Partial<FormulaItemRow>) => void;
  onQuitar: () => void;
}) {
  const seleccion = item.inventario_id !== null ? String(item.inventario_id) : CUSTOM;

  return (
    <div style={filaItemStyle}>
      <label style={{ ...campoWrapperStyle, gridColumn: "span 2" }}>
        <span style={campoLabelStyle}>Ingrediente (de tu inventario)</span>
        <select
          value={seleccion}
          onChange={(e) => {
            if (e.target.value === CUSTOM) {
              onChange({ inventario_id: null });
              return;
            }
            const id = Number(e.target.value);
            const opcion = inventarioOpciones.find((o) => o.id === id);
            onChange({ inventario_id: id, ingrediente: opcion ? opcion.ingrediente : item.ingrediente });
          }}
          style={inputStyle}
        >
          <option value={CUSTOM}>— Personalizado (sin costo) —</option>
          {inventarioOpciones.map((o) => (
            <option key={o.id} value={o.id}>
              {o.ingrediente} ({o.unidad})
            </option>
          ))}
        </select>
      </label>

      {seleccion === CUSTOM && (
        <label style={campoWrapperStyle}>
          <span style={campoLabelStyle}>Nombre</span>
          <input
            type="text"
            value={item.ingrediente}
            onChange={(e) => onChange({ ingrediente: e.target.value })}
            style={inputStyle}
          />
        </label>
      )}

      <label style={campoWrapperStyle}>
        <span style={campoLabelStyle}>Gramos</span>
        <input
          type="number"
          step="any"
          min="0"
          value={item.gramos}
          onChange={(e) => onChange({ gramos: e.target.value })}
          style={inputStyle}
        />
      </label>

      <label style={campoWrapperStyle}>
        <span style={campoLabelStyle}>%</span>
        <input
          type="number"
          step="any"
          min="0"
          value={item.porcentaje}
          onChange={(e) => onChange({ porcentaje: e.target.value })}
          style={inputStyle}
        />
      </label>

      <label style={campoWrapperStyle}>
        <span style={campoLabelStyle}>Fase</span>
        <input type="text" value={item.fase} onChange={(e) => onChange({ fase: e.target.value })} style={inputStyle} />
      </label>

      <button type="button" onClick={onQuitar} style={iconoAccionStyle} aria-label="Quitar ingrediente">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function Campo({
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
      <input type="text" value={value} required={requerido} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
    </label>
  );
}

function CampoNumero({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={campoWrapperStyle}>
      <span style={campoLabelStyle}>{label}</span>
      <input type="number" step="any" min="0" value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle} />
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
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={textareaStyle}
        rows={10}
      />
    </label>
  );
}

function TablaFormulas({
  formulas,
  onVer,
  onEditar,
  onBorrar,
  onAgregarTarea,
  agregandoTarea,
  tareaAgregada,
  productos,
  onToggleProducto,
  guardandoProducto,
}: {
  formulas: Formula[];
  onVer: (f: Formula) => void;
  onEditar: (f: Formula) => void;
  onBorrar: (f: Formula) => void;
  onAgregarTarea: (f: Formula) => void;
  agregandoTarea: number | null;
  tareaAgregada: number | null;
  productos: Set<number>;
  onToggleProducto: (f: Formula) => void;
  guardandoProducto: number | null;
}) {
  if (formulas.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", opacity: 0.75 }}>
        Aún no hay fórmulas. Crea la primera para empezar a calcular costos.
      </p>
    );
  }

  return (
    <div className="lab-tabla-marco" style={tablaWrapperStyle}>
      <table style={tablaStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Fórmula</th>
            <th style={thStyle}>Rinde</th>
            <th style={thStyle}>Costo por unidad</th>
            <th style={thStyle}>Precio sugerido</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formulas.map((f) => (
            <tr key={f.id}>
              <td style={tdStyle}>
                <span style={{ color: "#e8dcc8" }}>{f.nombre}</span>
                {f.categoria && <span style={subtituloStyle}>{f.categoria}</span>}
                {f.created_at && <span style={subtituloStyle}>Creada el {formatoFecha(f.created_at)}</span>}
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                {f.rinde_gramos ? `${f.rinde_gramos} g` : "—"}
                {f.unidades ? ` · ${f.unidades} uds` : ""}
              </td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatoCLP(f.costo?.costo_unidad ?? null)}</td>
              <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>{formatoCLP(f.costo?.precio_sugerido ?? null)}</td>
              <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                <button type="button" onClick={() => onVer(f)} style={iconoAccionStyle} aria-label="Ver" title="Ver fórmula">
                  <Eye size={14} />
                </button>
                <button type="button" onClick={() => onEditar(f)} style={iconoAccionStyle} aria-label="Editar" title="Editar fórmula">
                  <Pencil size={14} />
                </button>
                <Link
                  href={`/lab/etiquetas/${f.id}`}
                  style={{ ...iconoAccionStyle, display: "inline-flex", textDecoration: "none" }}
                  aria-label="Generar etiqueta"
                  title="Generar etiqueta"
                >
                  <Tag size={14} />
                </Link>
                <button
                  type="button"
                  onClick={() => onToggleProducto(f)}
                  disabled={guardandoProducto === f.id}
                  style={{
                    ...iconoAccionStyle,
                    color: productos.has(f.id) ? "#e8c070" : "rgba(212,196,160,0.6)",
                  }}
                  aria-label={productos.has(f.id) ? "Quitar de productos" : "Agregar a productos"}
                  title={productos.has(f.id) ? "En productos — clic para quitar" : "Agregar a productos"}
                >
                  <Package size={14} fill={productos.has(f.id) ? "#e8c070" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => onAgregarTarea(f)}
                  disabled={agregandoTarea === f.id}
                  style={iconoAccionStyle}
                  aria-label="Agregar a tareas (para preparar)"
                  title="Agregar a tareas — necesito prepararla"
                >
                  {tareaAgregada === f.id ? <Check size={14} color="#7c9473" /> : <ListChecks size={14} />}
                </button>
                <button type="button" onClick={() => onBorrar(f)} style={iconoAccionStyle} aria-label="Borrar" title="Borrar fórmula">
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
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

const volverBotonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "7px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#c8a050",
  background: "none",
  border: "1px solid rgba(200,160,80,0.35)",
  padding: "9px 14px",
  cursor: "pointer",
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

const errorStyle: CSSProperties = {
  color: "#e05a4a",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const okStyle: CSSProperties = {
  color: "#7c9473",
  fontFamily: "var(--font-body)",
  fontSize: "0.95rem",
  marginBottom: "1rem",
};

const prepararPanelStyle: CSSProperties = {
  border: "1px solid rgba(200,160,80,0.3)",
  background: "rgba(200,160,80,0.05)",
  padding: "1.2rem",
  marginTop: "1.6rem",
};

const formularioStyle: CSSProperties = {
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
  marginBottom: "1.2rem",
};

const gridVistaStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "1rem",
  marginBottom: "1.2rem",
};

const textoVistaStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.92rem",
  color: "#e8dcc8",
  whiteSpace: "pre-wrap",
  margin: 0,
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

const dividerStyle: CSSProperties = {
  height: 1,
  background: "rgba(200,160,80,0.25)",
  margin: "1.2rem 0",
};

const itemsTituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(200,160,80,0.75)",
  marginBottom: "0.8rem",
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

const botonAgregarItemStyle: CSSProperties = {
  marginTop: "0.7rem",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#7c9473",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
};

const estimadoStyle: CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "0.85rem",
  color: "rgba(212,196,160,0.8)",
  marginTop: "0.8rem",
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
  minWidth: "640px",
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
