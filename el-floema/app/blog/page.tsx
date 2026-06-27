"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { supabase, type Post, type Categoria } from "@/lib/supabase";

// ── Grain overlay ──────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-blog">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-blog)" />
    </svg>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const CATEGORIAS: Categoria[] = ["Formulaciones", "Investigación", "Del Predio", "Ciencia", "Reflexiones"];

const CATEGORIA_COLOR: Record<Categoria, string> = {
  Formulaciones: "rgba(200,160,80,0.18)",
  Investigación: "rgba(90,122,58,0.18)",
  "Del Predio":  "rgba(122,74,138,0.18)",
  Ciencia:       "rgba(60,120,180,0.18)",
  Reflexiones:   "rgba(180,80,80,0.18)",
};
const CATEGORIA_BORDER: Record<Categoria, string> = {
  Formulaciones: "rgba(200,160,80,0.4)",
  Investigación: "rgba(90,122,58,0.4)",
  "Del Predio":  "rgba(122,74,138,0.4)",
  Ciencia:       "rgba(60,120,180,0.4)",
  Reflexiones:   "rgba(180,80,80,0.4)",
};
const CATEGORIA_TEXT: Record<Categoria, string> = {
  Formulaciones: "#c8a050",
  Investigación: "#7aaa4a",
  "Del Predio":  "#b07ad0",
  Ciencia:       "#6aaaee",
  Reflexiones:   "#e08080",
};

function readingTime(contenido: string): string {
  const words = contenido.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min de lectura`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function excerpt(contenido: string, max = 130): string {
  const plain = contenido.replace(/\n/g, " ").trim();
  return plain.length > max ? plain.slice(0, max).trimEnd() + "…" : plain;
}

// ── Post card ──────────────────────────────────────────────────────────────────
function PostCard({ post }: { post: Post }) {
  const cat = post.categoria as Categoria;
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "rgba(200,160,80,0.03)",
        border: "1px solid rgba(200,160,80,0.12)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        textDecoration: "none",
        transition: "border-color 0.25s, background 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.32)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,80,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,160,80,0.12)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,160,80,0.03)";
      }}
    >
      {/* Image */}
      {post.imagen_url && (
        <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "#0e1a0e" }}>
          <img
            src={post.imagen_url}
            alt={post.titulo}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
          />
        </div>
      )}

      {/* Body */}
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        {/* Category badge */}
        <span style={{
          display: "inline-block",
          alignSelf: "flex-start",
          background: CATEGORIA_COLOR[cat] ?? "rgba(200,160,80,0.12)",
          border: `1px solid ${CATEGORIA_BORDER[cat] ?? "rgba(200,160,80,0.3)"}`,
          color: CATEGORIA_TEXT[cat] ?? "#c8a050",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "2px 10px",
          borderRadius: "20px",
        }}>
          {post.categoria}
        </span>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-grimoire)",
          fontSize: "clamp(0.95rem,2vw,1.15rem)",
          color: "#c8a050",
          letterSpacing: "0.06em",
          lineHeight: 1.35,
          margin: 0,
        }}>
          {post.titulo}
        </h2>

        {/* Excerpt */}
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "rgba(212,196,160,0.7)",
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}>
          {excerpt(post.contenido)}
        </p>

        {/* Footer */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid rgba(200,160,80,0.1)",
        }}>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.45)", letterSpacing: "0.1em" }}>
            {formatDate(post.created_at)}
          </span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.45)", letterSpacing: "0.08em" }}>
            {readingTime(post.contenido)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 0", opacity: 0.45 }}>
      <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "1.1rem", color: "#c8a050", letterSpacing: "0.15em" }}>
        {filtered ? "Sin posts en esta categoría" : "El grimorio está vacío por ahora"}
      </p>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "#d4c4a0", marginTop: "0.5rem" }}>
        {filtered ? "Prueba con otra categoría" : "Los primeros escritos llegarán pronto"}
      </p>
    </div>
  );
}

// ── Post estático H0 Hackathon ─────────────────────────────────────────────────
function H0HackathonCard() {
  return (
    <Link
      href="/blog/h0-hackathon"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "rgba(60,120,180,0.04)",
        border: "1px solid rgba(60,120,180,0.18)",
        borderRadius: "0.5rem",
        overflow: "hidden",
        textDecoration: "none",
        transition: "border-color 0.25s, background 0.25s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(60,120,180,0.4)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(60,120,180,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(60,120,180,0.18)";
        (e.currentTarget as HTMLAnchorElement).style.background = "rgba(60,120,180,0.04)";
      }}
    >
      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 }}>
        <span style={{
          display: "inline-block",
          alignSelf: "flex-start",
          background: "rgba(60,120,180,0.12)",
          border: "1px solid rgba(60,120,180,0.35)",
          color: "#6aaaee",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "0.6rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "2px 10px",
          borderRadius: "20px",
        }}>
          Ciencia · #H0Hackathon
        </span>
        <h2 style={{
          fontFamily: "var(--font-grimoire)",
          fontSize: "clamp(0.95rem,2vw,1.15rem)",
          color: "#6aaaee",
          letterSpacing: "0.06em",
          lineHeight: 1.35,
          margin: 0,
        }}>
          Cómo construí El Floema con AWS DynamoDB y Vercel
        </h2>
        <p style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "rgba(212,196,160,0.7)",
          lineHeight: 1.65,
          margin: 0,
          flex: 1,
        }}>
          Stack técnico, integración de DynamoDB para historial de conversaciones, y arquitectura de los agentes IA de cosmética botánica.
        </p>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "0.75rem",
          borderTop: "1px solid rgba(60,120,180,0.1)",
        }}>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.45)", letterSpacing: "0.1em" }}>
            26 de junio de 2026
          </span>
          <span style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", color: "rgba(200,160,80,0.45)", letterSpacing: "0.08em" }}>
            8 min de lectura
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState<Categoria | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("publicado", true)
        .order("created_at", { ascending: false });

      if (!error && data) setPosts(data as Post[]);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const filtered = catFilter ? posts.filter((p) => p.categoria === catFilter) : posts;

  return (
    <div className="parchment-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      <GrainOverlay />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(64px,10vh,120px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", display: "block", marginBottom: "0.6rem" }}>
            El Grimorio · Blog
          </span>
          <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(2rem,5vw,3.2rem)", color: "#c8a050", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.75rem", textShadow: "0 0 60px rgba(200,160,80,0.2)" }}>
            Bitácora
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.15rem)", color: "#d4c4a0", lineHeight: 1.6, maxWidth: 520 }}>
            Apuntes del proceso — formulaciones, ciencia, campo y reflexiones
          </p>
          <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.35),transparent)", marginTop: "1.75rem" }} />
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
          <button
            onClick={() => setCatFilter(null)}
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              padding: "6px 16px",
              borderRadius: "20px",
              border: `1px solid ${catFilter === null ? "rgba(200,160,80,0.6)" : "rgba(200,160,80,0.2)"}`,
              background: catFilter === null ? "rgba(200,160,80,0.12)" : "transparent",
              color: catFilter === null ? "#c8a050" : "rgba(200,160,80,0.45)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Todos
          </button>
          {CATEGORIAS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCatFilter(cat)}
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "0.62rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                padding: "6px 16px",
                borderRadius: "20px",
                border: `1px solid ${catFilter === cat ? CATEGORIA_BORDER[cat] : "rgba(200,160,80,0.15)"}`,
                background: catFilter === cat ? CATEGORIA_COLOR[cat] : "transparent",
                color: catFilter === cat ? CATEGORIA_TEXT[cat] : "rgba(200,160,80,0.45)",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.85rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.2em" }}>
              Cargando…
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(clamp(260px,28vw,360px), 1fr))",
            gap: "clamp(16px,2vw,28px)",
            alignItems: "start",
          }}>
            {!catFilter && <H0HackathonCard />}
            {filtered.length === 0 && catFilter
              ? null
              : filtered.map((post) => <PostCard key={post.id} post={post} />)}
            {filtered.length === 0 && !catFilter && posts.length === 0 && !loading && null}
          </div>
        )}
        {filtered.length === 0 && catFilter && <EmptyState filtered={true} />}
      </div>
    </div>
  );
}
