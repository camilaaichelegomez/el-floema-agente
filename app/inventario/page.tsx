import fs from "node:fs/promises";
import path from "node:path";

type EstadoInventario = "suficiente" | "poco" | "urgente";

type ItemInventario = {
  categoria: string;
  ingrediente: string;
  cantidad: string;
  estado: EstadoInventario;
};

const estadoLabel: Record<EstadoInventario, string> = {
  suficiente: "Suficiente",
  poco: "Poco",
  urgente: "Urgente o agotado",
};

const estadoColor: Record<EstadoInventario, string> = {
  suficiente: "#2a9d4b",
  poco: "#d4a62a",
  urgente: "#d1493f",
};

function parseEstado(raw: string): EstadoInventario {
  const normalizado = raw.trim().toLowerCase();
  if (normalizado.includes("suf") || normalizado.includes("verde")) return "suficiente";
  if (normalizado.includes("poc") || normalizado.includes("amar")) return "poco";
  return "urgente";
}

function esFilaSeparadora(columnas: string[]): boolean {
  return columnas.every((columna) => /^:?-{3,}:?$/.test(columna.trim()));
}

function extraerColumnasTabla(linea: string): string[] {
  if (!linea.includes("|")) return [];
  const sinBordes = linea.replace(/^\|/, "").replace(/\|$/, "");
  return sinBordes.split("|").map((c) => c.trim());
}

function inferirEstadoDesdeCantidad(cantidad: string, nota = ""): EstadoInventario {
  const cantidadNorm = cantidad.toLowerCase();
  const notaNorm = nota.toLowerCase();

  if (
    cantidadNorm.includes("sin cantidad") ||
    /^0+([.,]0+)?\s*[a-z]*$/i.test(cantidadNorm) ||
    notaNorm.includes("agotad")
  ) {
    return "urgente";
  }

  if (notaNorm.includes("⚠") || notaNorm.includes("verificar") || notaNorm.includes("confirmar")) {
    return "poco";
  }

  return "suficiente";
}

function parseInventarioMarkdown(markdown: string): ItemInventario[] {
  const lineas = markdown.split(/\r?\n/);
  const items: ItemInventario[] = [];
  let categoriaActual = "General";

  for (const lineaCruda of lineas) {
    const linea = lineaCruda.trim();
    if (!linea) continue;

    if (linea.startsWith("## ")) {
      categoriaActual = linea.replace(/^##\s+/, "").trim() || "General";
      continue;
    }

    // Soporta listas estilo: - Ingrediente | Cantidad | Estado
    const matchLista = linea.match(/^-+\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*$/);
    if (matchLista) {
      const [, ingrediente, cantidad, estadoONota] = matchLista;
      items.push({
        categoria: categoriaActual,
        ingrediente: ingrediente.trim(),
        cantidad: cantidad.trim(),
        estado:
          /estado|suf|poc|urg|verde|amar|rojo/i.test(estadoONota) && !estadoONota.includes("verificar")
            ? parseEstado(estadoONota)
            : inferirEstadoDesdeCantidad(cantidad, estadoONota),
      });
      continue;
    }

    // Soporta tablas markdown:
    // | Categoría | Ingrediente | Cantidad | Estado |
    const columnas = extraerColumnasTabla(linea);

    if (columnas.length === 0) continue;

    if (columnas.length === 4) {
      if (esFilaSeparadora(columnas)) continue;

      const [categoria, ingrediente, cantidad, estado] = columnas;
      const campos = [categoria, ingrediente, cantidad, estado].join(" ").toLowerCase();
      const esEncabezado =
        campos.includes("categor") ||
        campos.includes("ingred") ||
        campos.includes("cantidad") ||
        campos.includes("estado");

      if (!esEncabezado) {
        items.push({
          categoria: categoria || categoriaActual,
          ingrediente,
          cantidad,
          estado: parseEstado(estado),
        });
      }
      continue;
    }

    // Soporta tablas agrupadas por categoría:
    // | Ingrediente | Cantidad | Estado |
    if (columnas.length === 3) {
      if (esFilaSeparadora(columnas)) continue;

      const [ingrediente, cantidad, estadoONota] = columnas;
      const campos = [ingrediente, cantidad, estadoONota].join(" ").toLowerCase();
      const esEncabezado =
        campos.includes("ingred") ||
        campos.includes("cantidad") ||
        campos.includes("cantidad real") ||
        campos.includes("estado") ||
        campos.includes("por verificar");

      if (!esEncabezado) {
        const terceraColumnaEsEstado =
          /suf|poc|urg|agot|verde|amar|rojo|estado/i.test(estadoONota) &&
          !/verificar|confirmar|duplicado/i.test(estadoONota);

        items.push({
          categoria: categoriaActual,
          ingrediente,
          cantidad,
          estado: terceraColumnaEsEstado
            ? parseEstado(estadoONota)
            : inferirEstadoDesdeCantidad(cantidad, estadoONota),
        });
      }
      continue;
    }

    // Soporta filas con tercera columna vacia:
    // | Ingrediente | Cantidad | |
    if (columnas.length === 2) {
      if (esFilaSeparadora(columnas)) continue;

      const [ingrediente, cantidad] = columnas;
      const campos = [ingrediente, cantidad].join(" ").toLowerCase();
      const esEncabezado = campos.includes("ingred") || campos.includes("cantidad");

      if (!esEncabezado && ingrediente && cantidad) {
        items.push({
          categoria: categoriaActual,
          ingrediente,
          cantidad,
          estado: inferirEstadoDesdeCantidad(cantidad, ""),
        });
      }
    }
  }

  return items;
}

async function getInventario(): Promise<ItemInventario[]> {
  const inventarioPath = path.join(process.cwd(), "data", "inventario.md");
  const contenido = await fs.readFile(inventarioPath, "utf8");
  return parseInventarioMarkdown(contenido);
}

export default async function InventarioPage() {
  const inventario = await getInventario();
  const categorias = Array.from(new Set(inventario.map((item) => item.categoria)));

  return (
    <main className="parchment-bg" style={{ minHeight: "100vh", color: "#e8dcc8", padding: "32px 20px" }}>
      <div
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          border: "1px solid rgba(200, 160, 80, 0.55)",
          boxShadow: "0 8px 35px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(200, 160, 80, 0.2)",
          background: "linear-gradient(180deg, rgba(26,48,34,0.96) 0%, rgba(8,12,10,0.98) 100%)",
        }}
      >
        <header style={{ padding: "26px 28px 18px", borderBottom: "1px solid rgba(200, 160, 80, 0.35)" }}>
          <h1
            style={{
              fontFamily: "var(--font-grimoire), serif",
              fontSize: "clamp(1.7rem, 3.4vw, 2.5rem)",
              letterSpacing: "0.12em",
              color: "#c8a050",
              marginBottom: "8px",
            }}
          >
            Inventario del Floema
          </h1>
          <p style={{ opacity: 0.85, fontStyle: "italic" }}>
            Ingredientes organizados por categoría y nivel de stock.
          </p>
        </header>

        <div style={{ padding: "18px 28px 28px" }}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "18px" }}>
            {([
              ["Verde", "suficiente"],
              ["Amarillo", "poco"],
              ["Rojo", "urgente"],
            ] as const).map(([nombre, estado]) => (
              <span
                key={estado}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "999px",
                    backgroundColor: estadoColor[estado],
                    border: "1px solid rgba(232,220,200,0.25)",
                  }}
                />
                {nombre} = {estadoLabel[estado]}
              </span>
            ))}
          </div>

          {categorias.map((categoria) => {
            const itemsCategoria = inventario.filter((item) => item.categoria === categoria);
            return (
              <section key={categoria} style={{ marginBottom: "26px" }}>
                <h2
                  style={{
                    fontFamily: "var(--font-grimoire), serif",
                    fontSize: "1.15rem",
                    letterSpacing: "0.08em",
                    color: "#c8a050",
                    marginBottom: "10px",
                  }}
                >
                  {categoria}
                </h2>

                <div style={{ overflowX: "auto", border: "1px solid rgba(200, 160, 80, 0.32)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "620px" }}>
                    <thead style={{ backgroundColor: "rgba(200, 160, 80, 0.2)" }}>
                      <tr>
                        <th style={thStyle}>Ingrediente</th>
                        <th style={thStyle}>Cantidad actual</th>
                        <th style={thStyle}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsCategoria.map((item) => (
                        <tr key={`${item.categoria}-${item.ingrediente}`}>
                          <td style={tdStyle}>{item.ingrediente}</td>
                          <td style={tdStyle}>{item.cantidad}</td>
                          <td style={tdStyle}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                fontWeight: 600,
                                color: estadoColor[item.estado],
                              }}
                            >
                              <span
                                aria-hidden="true"
                                style={{
                                  width: "10px",
                                  height: "10px",
                                  borderRadius: "999px",
                                  backgroundColor: estadoColor[item.estado],
                                  border: "1px solid rgba(232,220,200,0.25)",
                                }}
                              />
                              {estadoLabel[item.estado]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  fontFamily: "var(--font-grimoire), serif",
  letterSpacing: "0.04em",
  color: "#e8dcc8",
  padding: "10px 12px",
  borderBottom: "1px solid rgba(200,160,80,0.35)",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderBottom: "1px solid rgba(232,220,200,0.12)",
};
