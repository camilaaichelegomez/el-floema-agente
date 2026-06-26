import Link from "next/link";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Demo — El Floema",
  description: "Recorrido visual de El Floema: agente botánico, agente de belleza y persistencia de conversaciones en AWS DynamoDB.",
};

function SectionDivider() {
  return (
    <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.3),transparent)", margin: "3.5rem 0" }} />
  );
}

function StackBadge({ label }: { label: string }) {
  return (
    <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.7)", border: "1px solid rgba(200,160,80,0.22)", padding: "4px 14px", borderRadius: "20px", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ChatMockup({ titulo, subtitulo, mensajes, color = "#c8a050" }: {
  titulo: string;
  subtitulo: string;
  mensajes: { rol: "usuario" | "agente"; texto: string }[];
  color?: string;
}) {
  return (
    <div style={{ border: "1px solid rgba(200,160,80,0.15)", borderRadius: "8px", overflow: "hidden", background: "rgba(14,26,14,0.6)" }}>
      {/* Header */}
      <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(200,160,80,0.1)", background: "rgba(200,160,80,0.03)" }}>
        <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)", margin: 0, marginBottom: "0.2rem" }}>
          El Floema
        </p>
        <h3 style={{ fontFamily: "var(--font-grimoire)", fontSize: "1rem", color, margin: 0, letterSpacing: "0.1em" }}>
          {titulo}
        </h3>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "rgba(212,196,160,0.5)", margin: "0.25rem 0 0", fontStyle: "italic" }}>
          {subtitulo}
        </p>
      </div>
      {/* Messages */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        {mensajes.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: m.rol === "usuario" ? "row-reverse" : "row", alignItems: "flex-start", gap: "0.5rem" }}>
            {m.rol === "agente" && (
              <span style={{ fontSize: "0.8rem", color, flexShrink: 0, marginTop: "2px" }}>✦</span>
            )}
            <div style={{
              maxWidth: "80%",
              padding: "0.65rem 0.9rem",
              borderRadius: m.rol === "usuario" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.rol === "usuario" ? "rgba(200,160,80,0.1)" : "rgba(14,26,14,0.9)",
              border: `1px solid ${m.rol === "usuario" ? "rgba(200,160,80,0.2)" : "rgba(200,160,80,0.1)"}`,
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: m.rol === "usuario" ? "#e8dcc8" : "rgba(212,196,160,0.85)",
              lineHeight: 1.65,
            }}>
              {m.texto}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DynamoRow({ campo, valor, tipo }: { campo: string; valor: string; tipo?: string }) {
  return (
    <tr style={{ borderBottom: "1px solid rgba(200,160,80,0.06)" }}>
      <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", fontSize: "0.78rem", color: "#6aaaee", whiteSpace: "nowrap" }}>{campo}</td>
      <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", fontSize: "0.72rem", color: "rgba(200,160,80,0.4)", whiteSpace: "nowrap" }}>{tipo}</td>
      <td style={{ padding: "0.5rem 0.75rem", fontFamily: "monospace", fontSize: "0.78rem", color: "#a8d488" }}>{valor}</td>
    </tr>
  );
}

export default function DemoPage() {
  return (
    <div style={{ background: "var(--bg-primary, #0e1a0e)", minHeight: "100vh", position: "relative" }}>
      <Navbar />

      {/* Grain */}
      <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain-filter-demo">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter-demo)" />
      </svg>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(80px,12vh,140px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", display: "block", marginBottom: "0.6rem" }}>
            H0 Hack Zero Stack · Demo
          </span>
          <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(2rem,5vw,3rem)", color: "#c8a050", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "0.75rem", textShadow: "0 0 60px rgba(200,160,80,0.2)" }}>
            El Floema
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "#d4c4a0", lineHeight: 1.6, maxWidth: 560 }}>
            Plataforma de cosmética botánica con agentes IA, RAG de 7.613 artículos científicos y conversaciones persistidas en AWS DynamoDB.
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
            {["Next.js · Vercel", "Python · Render", "AWS DynamoDB", "Supabase", "Gemini 2.5 Flash", "ChromaDB RAG"].map((s) => (
              <StackBadge key={s} label={s} />
            ))}
          </div>
        </div>

        <SectionDivider />

        {/* Agente Botánico */}
        <section>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)" }}>
              01 · Agente Botánico
            </span>
            <h2 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.2rem,3vw,1.7rem)", color: "#c8a050", letterSpacing: "0.12em", margin: "0.4rem 0 0.5rem" }}>
              Consulta Botánica con RAG Científico
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(212,196,160,0.7)", lineHeight: 1.7, maxWidth: 580 }}>
              El agente busca en tiempo real entre 7.613 artículos peer-reviewed de PubMed, Semantic Scholar y Europe PMC.
              Integra fitoterapia occidental, Ayurveda y Medicina Tradicional China en cada respuesta, con fuentes citadas.
            </p>
          </div>

          <ChatMockup
            titulo="Consulta Botánica"
            subtitulo="Pregunta sobre plantas medicinales"
            mensajes={[
              { rol: "usuario", texto: "¿Qué propiedades tiene el matico para la piel?" },
              { rol: "agente", texto: "El matico (Piper aduncum) contiene flavonoides, taninos y aceites esenciales con actividad antiinflamatoria y cicatrizante documentada. Estudios en ChromaDB muestran eficacia en heridas superficiales y dermatitis leve. En cosmética se usa como infusión concentrada (5-10%) en cremas base o como hidrolato." },
              { rol: "usuario", texto: "¿Con qué otros ingredientes lo puedo combinar?" },
              { rol: "agente", texto: "Combina bien con rosa mosqueta (regeneradora) y aceite de peumo para pieles secas. Para pieles con acné: combinar con extracto de arrayán (antifúngico) y niacinamida al 5%. La sinergia matico-arrayán tiene respaldo en 3 artículos de la biblioteca." },
            ]}
          />

          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <Link href="/consulta" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8a050", textDecoration: "none", border: "1px solid rgba(200,160,80,0.35)", padding: "8px 18px", borderRadius: "4px", transition: "all 0.2s" }}>
              Abrir agente botánico →
            </Link>
          </div>
        </section>

        <SectionDivider />

        {/* Agente Belleza */}
        <section>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)" }}>
              02 · Agente de Belleza
            </span>
            <h2 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.2rem,3vw,1.7rem)", color: "#c8a050", letterSpacing: "0.12em", margin: "0.4rem 0 0.5rem" }}>
              Formulación Cosmética Botánica
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(212,196,160,0.7)", lineHeight: 1.7, maxWidth: 580 }}>
              Especializado en formulación natural: elige activos vegetales, proporciones y métodos de extracción para sérum, aceites, cremas y rituales de cuidado con plantas nativas de Chile.
            </p>
          </div>

          <ChatMockup
            titulo="Cosmética Botánica"
            subtitulo="Formulación natural con plantas"
            color="#7aaa4a"
            mensajes={[
              { rol: "usuario", texto: "¿Cómo hago un sérum de rosa mosqueta para manchas?" },
              { rol: "agente", texto: "Sérum base: 70% aceite de rosa mosqueta prensado en frío + 20% aceite de jojoba como portador. Agrega vitamina C liposomal al 5% para potenciar la acción despigmentante. La rosa mosqueta chilena (Rosa rubiginosa) tiene el mayor contenido de ácido trans-retinoico natural: entre 0.01% y 0.08% dependiendo de la cosecha." },
              { rol: "usuario", texto: "¿Qué conservante natural puedo usar?" },
              { rol: "agente", texto: "Para sérum oleoso puro no necesitas conservante: los aceites vegetales son aquel medio. Si decides agregar fase acuosa (hidrolato de matico), usa extracto de semilla de pomelo al 0.3-0.5% o vitamina E al 0.5% como antioxidante. Vida útil: 6 meses en envase ámbar." },
            ]}
          />

          <div style={{ marginTop: "1rem" }}>
            <Link href="/belleza" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#7aaa4a", textDecoration: "none", border: "1px solid rgba(90,122,58,0.4)", padding: "8px 18px", borderRadius: "4px", transition: "all 0.2s" }}>
              Abrir agente de belleza →
            </Link>
          </div>
        </section>

        <SectionDivider />

        {/* DynamoDB */}
        <section>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)" }}>
              03 · Persistencia
            </span>
            <h2 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.2rem,3vw,1.7rem)", color: "#c8a050", letterSpacing: "0.12em", margin: "0.4rem 0 0.5rem" }}>
              Conversaciones en AWS DynamoDB
            </h2>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "rgba(212,196,160,0.7)", lineHeight: 1.7, maxWidth: 580 }}>
              Cada mensaje del usuario y cada respuesta del agente se guardan automáticamente en DynamoDB.
              La tabla <code style={{ fontFamily: "monospace", fontSize: "0.85em", color: "#6aaaee", background: "rgba(60,120,180,0.08)", padding: "1px 6px", borderRadius: "3px" }}>conversaciones-el-floema</code> usa <code style={{ fontFamily: "monospace", fontSize: "0.85em", color: "#6aaaee", background: "rgba(60,120,180,0.08)", padding: "1px 6px", borderRadius: "3px" }}>session_id</code> como partition key y <code style={{ fontFamily: "monospace", fontSize: "0.85em", color: "#6aaaee", background: "rgba(60,120,180,0.08)", padding: "1px 6px", borderRadius: "3px" }}>timestamp</code> como sort key.
            </p>
          </div>

          {/* DynamoDB item mockup */}
          <div style={{ border: "1px solid rgba(60,120,180,0.2)", borderRadius: "8px", overflow: "hidden", background: "rgba(14,26,14,0.7)" }}>
            <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(60,120,180,0.15)", background: "rgba(60,120,180,0.05)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#6aaaee", letterSpacing: "0.08em" }}>DynamoDB</span>
              <span style={{ color: "rgba(200,160,80,0.3)", fontSize: "0.7rem" }}>·</span>
              <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "rgba(200,160,80,0.5)" }}>conversaciones-el-floema</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(200,160,80,0.1)" }}>
                    {["campo", "tipo", "valor ejemplo"].map((h) => (
                      <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontFamily: "var(--font-cinzel), serif", fontSize: "0.6rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)", fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <DynamoRow campo="session_id" tipo="String (PK)" valor="a3f8c2d1-9b4e-4f7a-…" />
                  <DynamoRow campo="timestamp" tipo="String (SK)" valor="2026-06-26T14:32:11.204Z" />
                  <DynamoRow campo="rol" tipo="String" valor='"agente"' />
                  <DynamoRow campo="texto" tipo="String" valor="El matico contiene flavonoides y taninos con actividad…" />
                  <DynamoRow campo="pregunta" tipo="String" valor="¿Qué propiedades tiene el matico para la piel?" />
                  <DynamoRow campo="fuentes" tipo="List" valor='[{ "plant_key": "matico", "similarity": 0.87, … }]' />
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ marginTop: "1.25rem", padding: "1rem 1.25rem", background: "rgba(200,160,80,0.03)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: "6px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "rgba(212,196,160,0.65)", margin: 0, lineHeight: 1.7 }}>
              El flujo es: <strong style={{ color: "rgba(212,196,160,0.9)" }}>Next.js Route Handler</strong> recibe la consulta → guarda mensaje usuario en DynamoDB → llama al backend Python en Render → recibe respuesta → guarda respuesta agente en DynamoDB → retorna al frontend. Los errores de escritura se capturan silenciosamente para no interrumpir el chat.
            </p>
          </div>
        </section>

        <SectionDivider />

        {/* Architecture */}
        <section>
          <div style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.4)" }}>
              04 · Arquitectura
            </span>
            <h2 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.2rem,3vw,1.7rem)", color: "#c8a050", letterSpacing: "0.12em", margin: "0.4rem 0 0.5rem" }}>
              Stack Técnico
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
            {[
              { icono: "▲", titulo: "Frontend", desc: "Next.js 16 · App Router · TypeScript · Tailwind · desplegado en Vercel" },
              { icono: "⬡", titulo: "Agente Botánico", desc: "Python · Flask · Gemini 2.5 Flash · ChromaDB RAG · 7.613 artículos · Render" },
              { icono: "⬡", titulo: "Agente Belleza", desc: "Python · Flask · Gemini 2.5 Flash · especializado en formulación cosmética · Render" },
              { icono: "◈", titulo: "DynamoDB", desc: "Historial de conversaciones · session_id + timestamp · AWS ap-southeast-1" },
              { icono: "◫", titulo: "Supabase", desc: "PostgreSQL · posts del blog · protocolos guardados · autenticación futura" },
              { icono: "◎", titulo: "RAG Científico", desc: "ChromaDB · sentence-transformers · búsqueda semántica en embeddings" },
            ].map((card) => (
              <div key={card.titulo} style={{ padding: "1.1rem 1.25rem", background: "rgba(200,160,80,0.03)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: "6px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#c8a050", fontSize: "0.9rem" }}>{card.icono}</span>
                  <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#c8a050" }}>{card.titulo}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "rgba(212,196,160,0.6)", lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(200,160,80,0.35)", marginBottom: "2rem" }}>
            #H0Hackathon · H0 Hack Zero Stack
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/consulta" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0e1a0e", background: "#c8a050", textDecoration: "none", padding: "12px 28px", borderRadius: "4px", display: "inline-block" }}>
              Agente Botánico
            </Link>
            <Link href="/belleza" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#c8a050", background: "transparent", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(200,160,80,0.45)", borderRadius: "4px", display: "inline-block" }}>
              Agente de Belleza
            </Link>
            <Link href="/blog/h0-hackathon" style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.55)", background: "transparent", textDecoration: "none", padding: "12px 28px", border: "1px solid rgba(200,160,80,0.2)", borderRadius: "4px", display: "inline-block" }}>
              Leer artículo
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
