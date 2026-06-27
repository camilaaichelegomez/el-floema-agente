import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Cómo construí El Floema con AWS DynamoDB y Vercel — El Floema",
  description:
    "Una plataforma de cosmética botánica con agentes IA, RAG científico y persistencia de conversaciones en DynamoDB. Participante del hackathon H0 Hack Zero Stack.",
};

const CONTENIDO = [
  {
    tipo: "intro",
    texto:
      "El Floema nació en el bosque valdiviano del sur de Chile. Desde allí, en medio de triwe, arrayán, maqui y matico, surgió la pregunta: ¿cómo conectar la sabiduría ancestral de las plantas con la evidencia científica moderna, y ponerla al alcance de quienes formulan cosmética natural?",
  },
  {
    tipo: "subtitulo",
    texto: "¿Qué es El Floema?",
  },
  {
    tipo: "parrafo",
    texto:
      "El Floema es una plataforma de cosmética botánica con dos agentes de inteligencia artificial. El primero, el Agente Botánico, responde preguntas sobre plantas medicinales integrando fitoterapia occidental, Ayurveda y Medicina Tradicional China con respaldo de 7.613 artículos científicos de PubMed, Semantic Scholar y Europe PMC. El segundo, el Agente de Belleza, está especializado en formulación cosmética natural: elige ingredientes activos, propone sérum, aceites y rituales de cuidado con plantas.",
  },
  {
    tipo: "parrafo",
    texto:
      "Ambos agentes mantienen memoria de la conversación dentro de cada sesión y guardan cada intercambio de forma permanente en AWS DynamoDB, lo que permite analizar patrones de consulta, mejorar las respuestas con el tiempo y construir un historial de uso real.",
  },
  {
    tipo: "subtitulo",
    texto: "El problema que resuelve",
  },
  {
    tipo: "parrafo",
    texto:
      "Quienes formulan cosmética natural en Chile y Latinoamérica se enfrentan a un problema de dispersión del conocimiento: la información sobre plantas está en libros de etnobotánica, en papers académicos en inglés, en comunidades de formuladores y en la tradición oral. No existe un punto de síntesis accesible que cruce la evidencia científica con la aplicación práctica en cosmética.",
  },
  {
    tipo: "parrafo",
    texto:
      "El Floema resuelve eso con RAG (Retrieval-Augmented Generation): cuando alguien pregunta por la rosa mosqueta o el matico, el agente busca en tiempo real los artículos más relevantes de su biblioteca científica, construye el contexto y genera una respuesta fundamentada, citando las fuentes.",
  },
  {
    tipo: "subtitulo",
    texto: "Cómo se usó AWS DynamoDB",
  },
  {
    tipo: "parrafo",
    texto:
      "Cada mensaje del usuario y cada respuesta del agente se persisten en DynamoDB en la tabla conversaciones-el-floema. La clave de partición es session_id (un UUID generado en el browser y guardado en localStorage) y la clave de ordenación es timestamp en ISO 8601.",
  },
  {
    tipo: "parrafo",
    texto:
      "La integración vive en el servidor de Next.js (App Router, Route Handlers): antes de llamar al backend Python, la API route guarda el mensaje del usuario; después de recibir la respuesta, guarda la réplica del agente. Los errores de escritura en DynamoDB se capturan silenciosamente para no interrumpir la experiencia del chat. El cliente DynamoDB se inicializa con @aws-sdk/client-dynamodb y @aws-sdk/lib-dynamodb usando las variables de entorno AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY y AWS_REGION.",
  },
  {
    tipo: "codigo",
    texto:
      "// lib/dynamodb.ts\nexport async function guardarMensaje({ session_id, rol, texto, fuentes, pregunta }) {\n  await dynamo.send(new PutCommand({\n    TableName: 'conversaciones-el-floema',\n    Item: {\n      session_id,\n      timestamp: new Date().toISOString(),\n      rol,   // 'usuario' | 'agente'\n      texto,\n      ...(fuentes ? { fuentes } : {}),\n      ...(pregunta ? { pregunta } : {}),\n    },\n  }));\n}",
  },
  {
    tipo: "subtitulo",
    texto: "Stack técnico",
  },
  {
    tipo: "tabla",
    filas: [
      ["Frontend", "Next.js 16 · App Router · TypeScript · Tailwind CSS"],
      ["Deploy frontend", "Vercel"],
      ["Backend agente botánico", "Python · Flask · desplegado en Render"],
      ["Backend agente de belleza", "Python · Flask · desplegado en Render"],
      ["RAG / búsqueda semántica", "ChromaDB + sentence-transformers"],
      ["Biblioteca científica", "7.613 artículos (PubMed, Semantic Scholar, Europe PMC)"],
      ["Modelo de lenguaje", "Gemini 2.5 Flash (Google Vertex AI)"],
      ["Persistencia de conversaciones", "AWS DynamoDB"],
      ["Base de datos estructurada", "Supabase (PostgreSQL)"],
    ],
  },
  {
    tipo: "parrafo",
    texto:
      "El flujo completo es: el usuario escribe en el frontend en Vercel → la Route Handler de Next.js guarda el mensaje en DynamoDB y reenvía la consulta al backend Python en Render → el backend busca en ChromaDB los artículos más similares → construye el prompt con contexto científico y llama a Gemini 2.5 Flash → devuelve la respuesta al frontend → la Route Handler guarda la respuesta en DynamoDB y retorna al cliente.",
  },
  {
    tipo: "subtitulo",
    texto: "Por qué DynamoDB",
  },
  {
    tipo: "parrafo",
    texto:
      "La elección de DynamoDB para el historial de conversaciones responde a su modelo de escritura de alta disponibilidad y latencia predecible. Cada mensaje es un ítem independiente sin esquema rígido, lo que permite agregar campos como fuentes_citadas o plantas_detectadas sin migraciones. El modelo de acceso es simple: siempre se consulta por session_id (todas las conversaciones de una sesión) o session_id + rango de timestamp (segmento temporal). DynamoDB es ideal para esos dos patrones de acceso.",
  },
  {
    tipo: "cierre",
    texto:
      "Este artículo fue creado con el propósito de participar en el hackathon H0 Hack Zero Stack.",
  },
  {
    tipo: "hashtag",
    texto: "#H0Hackathon",
  },
];

export default function H0HackathonPost() {
  return (
    <div style={{ background: "var(--bg-primary, #0e1a0e)", minHeight: "100vh", position: "relative" }}>
      <Navbar />

      {/* Grain */}
      <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain-filter-h0">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter-h0)" />
      </svg>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(80px,12vh,140px)" }}>

        {/* Back */}
        <Link href="/blog" style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px", marginBottom: "2.5rem", transition: "color 0.2s" }}>
          ← Volver al blog
        </Link>

        {/* Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#6aaaee", border: "1px solid rgba(60,120,180,0.4)", padding: "3px 12px", borderRadius: "20px" }}>
            Ciencia
          </span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.1em" }}>
            26 de junio de 2026
          </span>
          <span style={{ color: "rgba(200,160,80,0.25)", fontSize: "0.7rem" }}>·</span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.08em" }}>
            8 min de lectura
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.6rem,4vw,2.6rem)", color: "#c8a050", letterSpacing: "0.1em", lineHeight: 1.2, marginBottom: "0.75rem", textShadow: "0 0 60px rgba(200,160,80,0.18)" }}>
          Cómo construí El Floema con AWS DynamoDB y Vercel
        </h1>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.3),transparent)", margin: "2rem 0" }} />

        {/* Content */}
        <article>
          {CONTENIDO.map((bloque, i) => {
            if (bloque.tipo === "intro") {
              return (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1.05rem,1.7vw,1.18rem)", lineHeight: 1.88, color: "#d4c4a0", marginBottom: "2rem", fontStyle: "italic", borderLeft: "2px solid rgba(200,160,80,0.25)", paddingLeft: "1.25rem" }}>
                  {bloque.texto}
                </p>
              );
            }
            if (bloque.tipo === "subtitulo") {
              return (
                <h2 key={i} style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.1rem,2.5vw,1.45rem)", color: "#c8a050", letterSpacing: "0.12em", marginTop: "2.75rem", marginBottom: "1rem", textShadow: "0 0 30px rgba(200,160,80,0.12)" }}>
                  {bloque.texto}
                </h2>
              );
            }
            if (bloque.tipo === "parrafo") {
              return (
                <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.6vw,1.12rem)", lineHeight: 1.88, color: "#d4c4a0", marginBottom: "1.5rem" }}>
                  {bloque.texto}
                </p>
              );
            }
            if (bloque.tipo === "codigo") {
              return (
                <pre key={i} style={{ background: "rgba(14,26,14,0.8)", border: "1px solid rgba(200,160,80,0.15)", borderRadius: "6px", padding: "1.25rem 1.5rem", overflowX: "auto", marginBottom: "1.75rem", fontFamily: "monospace", fontSize: "0.82rem", color: "#a8d488", lineHeight: 1.7 }}>
                  {bloque.texto}
                </pre>
              );
            }
            if (bloque.tipo === "tabla" && bloque.filas) {
              return (
                <div key={i} style={{ overflowX: "auto", marginBottom: "2rem" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                    <tbody>
                      {bloque.filas.map((fila, j) => (
                        <tr key={j} style={{ borderBottom: "1px solid rgba(200,160,80,0.08)" }}>
                          <td style={{ padding: "0.65rem 1rem 0.65rem 0", color: "#c8a050", fontFamily: "var(--font-cinzel), serif", fontSize: "0.72rem", letterSpacing: "0.08em", whiteSpace: "nowrap", verticalAlign: "top", paddingRight: "1.5rem" }}>
                            {fila[0]}
                          </td>
                          <td style={{ padding: "0.65rem 0", color: "rgba(212,196,160,0.75)", lineHeight: 1.6 }}>
                            {fila[1]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            }
            if (bloque.tipo === "cierre") {
              return (
                <div key={i} style={{ marginTop: "3rem", padding: "1.25rem 1.5rem", background: "rgba(200,160,80,0.04)", border: "1px solid rgba(200,160,80,0.2)", borderRadius: "6px" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(212,196,160,0.65)", margin: 0, lineHeight: 1.7 }}>
                    {bloque.texto}
                  </p>
                </div>
              );
            }
            if (bloque.tipo === "hashtag") {
              return (
                <p key={i} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.8rem", letterSpacing: "0.18em", color: "#c8a050", marginTop: "0.75rem", opacity: 0.7 }}>
                  {bloque.texto}
                </p>
              );
            }
            return null;
          })}
        </article>

        {/* Tags */}
        <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(200,160,80,0.1)" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {["AWS DynamoDB", "Next.js", "Vercel", "RAG", "Cosmética Botánica", "H0 Hackathon"].map((tag) => (
              <span key={tag} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.14em", color: "rgba(200,160,80,0.5)", border: "1px solid rgba(200,160,80,0.15)", padding: "3px 10px", borderRadius: "20px" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(200,160,80,0.1)", textAlign: "center" }}>
          <Link href="/blog" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,160,80,0.55)", textDecoration: "none" }}>
            ← Volver a la bitácora
          </Link>
        </div>
      </div>
    </div>
  );
}
