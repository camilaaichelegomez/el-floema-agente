"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Copy, Pencil, Check } from "lucide-react";

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
  } | null;
}

export function ProductosManager({ productos }: { productos: ProductoConEtiqueta[] }) {
  const [copiado, setCopiado] = useState<string | null>(null);

  async function copiar(id: string, texto: string) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(id);
      setTimeout(() => setCopiado((cur) => (cur === id ? null : cur)), 1800);
    } catch {
      // portapapeles no disponible — el texto sigue visible para copiar a mano
    }
  }

  if (productos.length === 0) {
    return (
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", opacity: 0.75 }}>
        Aún no hay fórmulas. Crea una en /lab/formulas para empezar.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", margin: 0 }}>
        {productos.length} producto{productos.length === 1 ? "" : "s"}. Descripciones de catálogo y redes generadas
        con IA, listas para copiar cuando las necesites.
      </p>

      {productos.map((p) => {
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
              <Link href={`/lab/etiquetas/${p.id}`} style={editarLinkStyle}>
                <Pencil size={12} /> {tieneContenido ? "Editar" : "Generar"}
              </Link>
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
                Todavía no tiene descripción generada — entra a &ldquo;Generar&rdquo; y usa el botón de IA.
              </p>
            )}
          </div>
        );
      })}
    </div>
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
