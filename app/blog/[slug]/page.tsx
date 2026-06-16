import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase, type Post, type Categoria } from "@/lib/supabase";

// ── Helpers ────────────────────────────────────────────────────────────────────
const CATEGORIA_TEXT: Record<Categoria, string> = {
  Formulaciones: "#c8a050",
  Investigación: "#7aaa4a",
  "Del Predio":  "#b07ad0",
  Ciencia:       "#6aaaee",
  Reflexiones:   "#e08080",
};
const CATEGORIA_BORDER: Record<Categoria, string> = {
  Formulaciones: "rgba(200,160,80,0.4)",
  Investigación: "rgba(90,122,58,0.4)",
  "Del Predio":  "rgba(122,74,138,0.4)",
  Ciencia:       "rgba(60,120,180,0.4)",
  Reflexiones:   "rgba(180,80,80,0.4)",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function readingTime(contenido: string): string {
  const words = contenido.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min de lectura`;
}

// ── Metadata ───────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { data } = await supabase
    .from("posts")
    .select("titulo, contenido")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (!data) return { title: "Post no encontrado — El Floema" };

  return {
    title: `${data.titulo} — El Floema`,
    description: data.contenido.slice(0, 160),
  };
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("publicado", true)
    .single();

  if (error || !data) notFound();

  const post = data as Post;
  const cat = post.categoria as Categoria;
  const paragraphs = post.contenido.split(/\n\n+/).filter(Boolean);

  return (
    <div
      style={{
        background: "var(--bg-primary, #0e1a0e)",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Navbar />
      {/* Grain */}
      <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <filter id="grain-filter-post">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter-post)" />
      </svg>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(80px,12vh,140px)" }}>

        {/* Back */}
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(200,160,80,0.5)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "2.5rem",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c8a050")}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(200,160,80,0.5)")}
        >
          ← Volver al blog
        </Link>

        {/* Category + meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          <span style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: CATEGORIA_TEXT[cat] ?? "#c8a050",
            border: `1px solid ${CATEGORIA_BORDER[cat] ?? "rgba(200,160,80,0.3)"}`,
            padding: "3px 12px",
            borderRadius: "20px",
          }}>
            {post.categoria}
          </span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.1em" }}>
            {formatDate(post.created_at)}
          </span>
          <span style={{ color: "rgba(200,160,80,0.25)", fontSize: "0.7rem" }}>·</span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.08em" }}>
            {readingTime(post.contenido)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: "var(--font-grimoire)",
          fontSize: "clamp(1.6rem,4vw,2.6rem)",
          color: "#c8a050",
          letterSpacing: "0.1em",
          lineHeight: 1.2,
          marginBottom: "0.75rem",
          textShadow: "0 0 60px rgba(200,160,80,0.18)",
        }}>
          {post.titulo}
        </h1>

        {/* Divider */}
        <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.3),transparent)", margin: "2rem 0" }} />

        {/* Hero image */}
        {post.imagen_url && (
          <div style={{ borderRadius: "0.5rem", overflow: "hidden", marginBottom: "2.5rem", border: "1px solid rgba(200,160,80,0.12)" }}>
            <img
              src={post.imagen_url}
              alt={post.titulo}
              style={{ width: "100%", display: "block", objectFit: "cover", maxHeight: "420px" }}
            />
          </div>
        )}

        {/* Content */}
        <article>
          {paragraphs.map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem,1.6vw,1.12rem)",
                lineHeight: 1.88,
                color: "#d4c4a0",
                marginBottom: "1.5rem",
              }}
            >
              {para.split("\n").map((line, j, arr) => (
                <span key={j}>
                  {line}
                  {j < arr.length - 1 && <br />}
                </span>
              ))}
            </p>
          ))}
        </article>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(200,160,80,0.1)" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.14em",
                    color: "rgba(200,160,80,0.5)",
                    border: "1px solid rgba(200,160,80,0.15)",
                    padding: "3px 10px",
                    borderRadius: "20px",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer nav */}
        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid rgba(200,160,80,0.1)", textAlign: "center" }}>
          <Link
            href="/blog"
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(200,160,80,0.55)",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#c8a050")}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(200,160,80,0.55)")}
          >
            ← Volver a la bitácora
          </Link>
        </div>

      </div>
    </div>
  );
}
