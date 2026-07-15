"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  Leaf,
  FlaskConical,
  Plus,
  Clock,
  Flame,
  Check,
  Trash2,
  NotebookPen,
  ListChecks,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

type Tipo = "receta" | "tarea";
type Urgencia = "urgente" | "normal";
type Filtro = "todas" | Tipo;
type Vista = "tareas" | "notas";

export interface Tarea {
  id: string;
  titulo: string;
  tipo: Tipo;
  urgencia: Urgencia;
  tiempo: string | null;
  hecha: boolean;
  nota: string | null;
  creada: string;
}

export interface NotaLibre {
  id: string;
  texto: string;
  creada: string;
}

interface FormTarea {
  titulo: string;
  tipo: Tipo;
  urgencia: Urgencia;
  tiempo: string;
}

const formVacio: FormTarea = { titulo: "", tipo: "receta", urgencia: "normal", tiempo: "" };

export function TareasManager({
  initialTareas,
  initialNotas,
  userId,
}: {
  initialTareas: Tarea[];
  initialNotas: NotaLibre[];
  userId: string;
}) {
  const [vista, setVista] = useState<Vista>("tareas");
  const [tareas, setTareas] = useState<Tarea[]>(initialTareas);
  const [notas, setNotas] = useState<NotaLibre[]>(initialNotas);
  const [form, setForm] = useState<FormTarea>(formVacio);
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [error, setError] = useState<string | null>(null);
  const [notaLibre, setNotaLibre] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function agregarTarea(e: FormEvent) {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    const supabase = createClient();
    const nueva = {
      user_id: userId,
      titulo: form.titulo.trim(),
      tipo: form.tipo,
      urgencia: form.urgencia,
      tiempo: form.tiempo.trim() || null,
      hecha: false,
      nota: "",
    };
    const { data, error: err } = await supabase.from("floema_tareas").insert(nueva).select().single();
    if (err || !data) {
      setError("No se pudo guardar la tarea.");
      return;
    }
    setTareas([data as Tarea, ...tareas]);
    setForm(formVacio);
    setError(null);
    inputRef.current?.focus();
  }

  async function marcar(id: string) {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;
    const supabase = createClient();
    const { error: err } = await supabase.from("floema_tareas").update({ hecha: !tarea.hecha }).eq("id", id);
    if (err) {
      setError("No se pudo actualizar la tarea.");
      return;
    }
    setTareas(tareas.map((t) => (t.id === id ? { ...t, hecha: !t.hecha } : t)));
  }

  async function eliminarTarea(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("floema_tareas").delete().eq("id", id);
    if (err) {
      setError("No se pudo eliminar la tarea.");
      return;
    }
    setTareas(tareas.filter((t) => t.id !== id));
  }

  async function actualizarNotaTarea(id: string, texto: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("floema_tareas").update({ nota: texto }).eq("id", id);
    if (err) {
      setError("No se pudo guardar la anotación.");
      return;
    }
    setTareas(tareas.map((t) => (t.id === id ? { ...t, nota: texto } : t)));
  }

  async function agregarNotaLibre(e: FormEvent) {
    e.preventDefault();
    if (!notaLibre.trim()) return;
    const supabase = createClient();
    const { data, error: err } = await supabase
      .from("floema_notas")
      .insert({ user_id: userId, texto: notaLibre.trim() })
      .select()
      .single();
    if (err || !data) {
      setError("No se pudo guardar la nota.");
      return;
    }
    setNotas([data as NotaLibre, ...notas]);
    setNotaLibre("");
    setError(null);
  }

  async function actualizarNotaLibre(id: string, texto: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("floema_notas").update({ texto }).eq("id", id);
    if (err) {
      setError("No se pudo guardar la nota.");
      return;
    }
    setNotas(notas.map((n) => (n.id === id ? { ...n, texto } : n)));
  }

  async function eliminarNotaLibre(id: string) {
    const supabase = createClient();
    const { error: err } = await supabase.from("floema_notas").delete().eq("id", id);
    if (err) {
      setError("No se pudo eliminar la nota.");
      return;
    }
    setNotas(notas.filter((n) => n.id !== id));
  }

  const visibles = tareas.filter((t) => filtro === "todas" || t.tipo === filtro);
  const pendientes = visibles
    .filter((t) => !t.hecha)
    .sort((a, b) => {
      if (a.urgencia !== b.urgencia) return a.urgencia === "urgente" ? -1 : 1;
      return new Date(b.creada).getTime() - new Date(a.creada).getTime();
    });
  const hechas = visibles
    .filter((t) => t.hecha)
    .sort((a, b) => new Date(b.creada).getTime() - new Date(a.creada).getTime());

  return (
    <div style={styles.wrap}>
      <nav style={styles.tabs}>
        <button
          type="button"
          onClick={() => setVista("tareas")}
          style={{ ...styles.tabBtn, ...(vista === "tareas" ? styles.tabBtnActiva : {}) }}
        >
          <ListChecks size={15} />
          Tareas y recetas
        </button>
        <button
          type="button"
          onClick={() => setVista("notas")}
          style={{ ...styles.tabBtn, ...(vista === "notas" ? styles.tabBtnActiva : {}) }}
        >
          <NotebookPen size={15} />
          Notas
        </button>
      </nav>

      {error && <div style={styles.errorBanner}>{error}</div>}

      {vista === "tareas" ? (
        <>
          <form onSubmit={agregarTarea} style={styles.form}>
            <input
              ref={inputRef}
              type="text"
              placeholder="¿Qué hay que hacer? (ej: formular sérum de matico)"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              style={styles.input}
            />
            <div style={styles.row}>
              <div style={styles.segmented}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: "receta" })}
                  style={{ ...styles.segBtn, ...(form.tipo === "receta" ? styles.segBtnActiveReceta : {}) }}
                >
                  <FlaskConical size={14} style={{ marginRight: 6 }} />
                  Receta
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, tipo: "tarea" })}
                  style={{ ...styles.segBtn, ...(form.tipo === "tarea" ? styles.segBtnActiveTarea : {}) }}
                >
                  <Leaf size={14} style={{ marginRight: 6 }} />
                  Tarea
                </button>
              </div>

              <div style={styles.segmented}>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, urgencia: "normal" })}
                  style={{ ...styles.segBtn, ...(form.urgencia === "normal" ? styles.segBtnActiveNormal : {}) }}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, urgencia: "urgente" })}
                  style={{ ...styles.segBtn, ...(form.urgencia === "urgente" ? styles.segBtnActiveUrgente : {}) }}
                >
                  <Flame size={14} style={{ marginRight: 6 }} />
                  Urgente
                </button>
              </div>
            </div>

            <div style={styles.row}>
              <input
                type="text"
                placeholder="Tiempo estimado (ej: 30 min, 2 h)"
                value={form.tiempo}
                onChange={(e) => setForm({ ...form, tiempo: e.target.value })}
                style={{ ...styles.input, flex: 1 }}
              />
              <button type="submit" style={styles.addBtn} aria-label="Agregar">
                <Plus size={16} />
              </button>
            </div>
          </form>

          <div style={styles.filtros}>
            {(
              [
                { key: "todas", label: "Todas" },
                { key: "receta", label: "Recetas" },
                { key: "tarea", label: "Tareas" },
              ] as const
            ).map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFiltro(f.key)}
                style={{ ...styles.filtroBtn, ...(filtro === f.key ? styles.filtroBtnActiva : {}) }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="lab-panel" style={styles.lista}>
            {pendientes.length === 0 && hechas.length === 0 ? (
              <p style={styles.vacio}>Sin tareas todavía. Agrega la primera arriba.</p>
            ) : (
              <>
                {pendientes.map((t) => (
                  <TareaItem key={t.id} tarea={t} onMarcar={marcar} onEliminar={eliminarTarea} onNota={actualizarNotaTarea} />
                ))}

                {hechas.length > 0 && (
                  <>
                    <div style={styles.divisor}>
                      <span style={styles.divisorTexto}>Completadas · fórmulas preparadas · {hechas.length}</span>
                    </div>
                    {hechas.map((t) => (
                      <TareaItem key={t.id} tarea={t} onMarcar={marcar} onEliminar={eliminarTarea} onNota={actualizarNotaTarea} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <form onSubmit={agregarNotaLibre} style={styles.form}>
            <textarea
              placeholder="Escribe una nota, idea o apunte suelto…"
              value={notaLibre}
              onChange={(e) => setNotaLibre(e.target.value)}
              style={styles.textarea}
              rows={3}
            />
            <button type="submit" style={styles.addNoteBtn}>
              <Plus size={15} style={{ marginRight: 6 }} />
              Guardar nota
            </button>
          </form>

          <div className="lab-panel" style={styles.lista}>
            {notas.length === 0 ? (
              <p style={styles.vacio}>Sin notas todavía. Escribe la primera arriba.</p>
            ) : (
              notas.map((n) => <NotaItem key={n.id} nota={n} onActualizar={actualizarNotaLibre} onEliminar={eliminarNotaLibre} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}

function TareaItem({
  tarea,
  onMarcar,
  onEliminar,
  onNota,
}: {
  tarea: Tarea;
  onMarcar: (id: string) => void;
  onEliminar: (id: string) => void;
  onNota: (id: string, texto: string) => void;
}) {
  const esReceta = tarea.tipo === "receta";
  const [abierta, setAbierta] = useState(false);
  const [texto, setTexto] = useState(tarea.nota ?? "");
  const tieneNota = (tarea.nota ?? "").trim().length > 0;

  function guardar() {
    if (texto !== tarea.nota) onNota(tarea.id, texto);
  }

  return (
    <div style={{ ...styles.item, opacity: tarea.hecha ? 0.55 : 1 }}>
      <button
        type="button"
        onClick={() => onMarcar(tarea.id)}
        style={{ ...styles.checkbox, ...(tarea.hecha ? styles.checkboxHecho : {}) }}
        aria-label={tarea.hecha ? "Marcar como pendiente" : "Marcar como hecha"}
      >
        {tarea.hecha && <Check size={13} color="#0d0f0a" strokeWidth={3} />}
      </button>

      <div style={styles.itemBody}>
        <div style={styles.itemTop}>
          <span style={{ ...styles.badge, ...(esReceta ? styles.badgeReceta : styles.badgeTarea) }}>
            {esReceta ? <FlaskConical size={11} /> : <Leaf size={11} />}
            {esReceta ? (tarea.hecha ? "Fórmula preparada" : "Receta") : "Tarea"}
          </span>
          {tarea.urgencia === "urgente" && (
            <span style={styles.badgeUrgente}>
              <Flame size={11} />
              Urgente
            </span>
          )}
          {tarea.tiempo && (
            <span style={styles.badgeTiempo}>
              <Clock size={11} />
              {tarea.tiempo}
            </span>
          )}
        </div>
        <p style={{ ...styles.itemTitulo, textDecoration: tarea.hecha ? "line-through" : "none" }}>{tarea.titulo}</p>

        <button type="button" onClick={() => setAbierta(!abierta)} style={styles.notaToggle}>
          {abierta ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {tieneNota ? "Ver / editar anotación" : "Agregar anotación"}
        </button>

        {abierta && (
          <div style={styles.notaBox}>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onBlur={guardar}
              placeholder={
                esReceta
                  ? "Observaciones de la fórmula: proporciones, ajustes, resultado, textura…"
                  : "Anotación sobre esta tarea…"
              }
              style={styles.textareaChica}
              rows={3}
            />
          </div>
        )}
      </div>

      <button type="button" onClick={() => onEliminar(tarea.id)} style={styles.deleteBtn} aria-label="Eliminar tarea">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function NotaItem({
  nota,
  onActualizar,
  onEliminar,
}: {
  nota: NotaLibre;
  onActualizar: (id: string, texto: string) => void;
  onEliminar: (id: string) => void;
}) {
  const [texto, setTexto] = useState(nota.texto);

  function guardar() {
    if (texto !== nota.texto) onActualizar(nota.id, texto);
  }

  return (
    <div style={styles.notaLibreItem}>
      <textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={guardar}
        style={styles.textareaLibre}
        rows={Math.max(2, Math.ceil(texto.length / 48))}
      />
      <button type="button" onClick={() => onEliminar(nota.id)} style={styles.deleteBtn} aria-label="Eliminar nota">
        <Trash2 size={15} />
      </button>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  wrap: { maxWidth: 680, margin: "0 auto" },
  tabs: {
    display: "flex",
    gap: 6,
    background: "#0d0f0a",
    border: "1px solid #2d3320",
    borderRadius: 9,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 6px",
    background: "transparent",
    border: "none",
    borderRadius: 6,
    color: "#8a8a7a",
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  tabBtnActiva: { background: "#1f2617", color: "#c8a050" },
  form: {
    background: "#161a10",
    border: "1px solid #2d3320",
    borderRadius: 10,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 18,
  },
  input: {
    background: "#0d0f0a",
    border: "1px solid #2d3320",
    borderRadius: 7,
    padding: "10px 12px",
    color: "#e8e4d8",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
  },
  textarea: {
    background: "#0d0f0a",
    border: "1px solid #2d3320",
    borderRadius: 7,
    padding: "10px 12px",
    color: "#e8e4d8",
    fontSize: 14,
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
  },
  row: { display: "flex", gap: 8 },
  segmented: { display: "flex", background: "#0d0f0a", border: "1px solid #2d3320", borderRadius: 7, overflow: "hidden", flex: 1 },
  segBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 6px",
    background: "transparent",
    border: "none",
    color: "#8a8a7a",
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  segBtnActiveReceta: { background: "#2d4a2d", color: "#eaf0e0" },
  segBtnActiveTarea: { background: "#4a3a5c", color: "#eee6f4" },
  segBtnActiveNormal: { background: "#33392a", color: "#e8e4d8" },
  segBtnActiveUrgente: { background: "#6b2d2d", color: "#f4e0e0" },
  addBtn: {
    background: "#c8a050",
    border: "none",
    borderRadius: 7,
    color: "#0d0f0a",
    width: 42,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  addNoteBtn: {
    background: "#c8a050",
    border: "none",
    borderRadius: 7,
    color: "#0d0f0a",
    padding: "9px 14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: 13.5,
    fontFamily: "var(--font-body)",
    fontWeight: 600,
  },
  filtros: { display: "flex", gap: 8, marginBottom: 16 },
  filtroBtn: {
    background: "transparent",
    border: "1px solid #2d3320",
    borderRadius: 20,
    padding: "5px 14px",
    color: "#8a8a7a",
    fontSize: 12.5,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  },
  filtroBtnActiva: { background: "#1f2617", borderColor: "#c8a050", color: "#c8a050" },
  errorBanner: {
    background: "#3a1414",
    border: "1px solid #6b2d2d",
    color: "#f4c0c0",
    padding: "8px 12px",
    borderRadius: 7,
    fontSize: 12.5,
    marginBottom: 12,
  },
  lista: { display: "flex", flexDirection: "column", gap: 8, padding: "1rem" },
  vacio: { textAlign: "center", color: "#6a6a5a", fontSize: 14, margin: "20px 0" },
  divisor: { display: "flex", alignItems: "center", margin: "14px 0 4px", gap: 10 },
  divisorTexto: { fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#5a6a4f" },
  item: { display: "flex", alignItems: "flex-start", gap: 10, background: "#141810", border: "1px solid #262c1c", borderRadius: 9, padding: "11px 12px" },
  checkbox: {
    marginTop: 2,
    width: 20,
    height: 20,
    minWidth: 20,
    borderRadius: "50%",
    border: "1.5px solid #c8a050",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  },
  checkboxHecho: { background: "#c8a050" },
  itemBody: { flex: 1, minWidth: 0 },
  itemTop: { display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 },
  badge: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 7px", borderRadius: 20, fontFamily: "var(--font-body)" },
  badgeReceta: { background: "#1f3320", color: "#a8d0a0" },
  badgeTarea: { background: "#2f2338", color: "#d0b8e0" },
  badgeUrgente: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 7px", borderRadius: 20, background: "#3a1f1f", color: "#e8a0a0" },
  badgeTiempo: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 7px", borderRadius: 20, background: "#1c2230", color: "#a0b8e0" },
  itemTitulo: { margin: 0, fontSize: 14.5, color: "#e8e4d8", lineHeight: 1.4, fontFamily: "var(--font-body)" },
  notaToggle: { display: "inline-flex", alignItems: "center", gap: 4, background: "transparent", border: "none", color: "#8a9a7a", fontSize: 11.5, cursor: "pointer", padding: "6px 0 0", fontFamily: "var(--font-body)" },
  notaBox: { marginTop: 6 },
  textareaChica: {
    width: "100%",
    background: "#0d0f0a",
    border: "1px solid #2d3320",
    borderRadius: 6,
    padding: "8px 10px",
    color: "#e8e4d8",
    fontSize: 13,
    fontFamily: "var(--font-body)",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  deleteBtn: { background: "transparent", border: "none", color: "#5a5a4a", cursor: "pointer", padding: 4, marginTop: 1 },
  notaLibreItem: { display: "flex", alignItems: "flex-start", gap: 8, background: "#141810", border: "1px solid #262c1c", borderRadius: 9, padding: "11px 12px" },
  textareaLibre: { flex: 1, background: "transparent", border: "none", color: "#e8e4d8", fontSize: 14, fontFamily: "var(--font-body)", outline: "none", resize: "vertical", lineHeight: 1.5 },
};
