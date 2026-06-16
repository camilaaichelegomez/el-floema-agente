"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "model";
  content: string;
}

const CHIPS = [
  "Piel sensible",
  "Piel grasa",
  "Rutina mañana",
  "Cabello seco",
  "Yoga facial",
  "Masaje facial",
  "Anti-edad",
  "Piel mixta",
];

const WELCOME =
  "Hola, soy Floema 🌿 Tu asesora de belleza botánica. Cuéntame sobre tu piel, tu cabello o lo que quieras mejorar en tu rutina — te acompaño con la sabiduría de las plantas.";

export default function BellezaPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function send(text: string) {
    const question = text.trim();
    if (!question || loading) return;

    const newMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const history = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
      }));

      const res = await fetch("https://el-floema-agente.onrender.com/ask-belleza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });

      const data = await res.json();
      const answer = data.answer ?? data.error ?? "No se pudo obtener respuesta.";
      setMessages((prev) => [...prev, { role: "model", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Hubo un error de conexión. Por favor intenta de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ── */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(13, 26, 13, 0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(200, 160, 80, 0.18)",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.6rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              opacity: 0.55,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.55")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Inicio
          </Link>

          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.58rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                opacity: 0.45,
                margin: 0,
              }}
            >
              El Floema
            </p>
            <h1
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.9rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--color-gold)",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Asesora de Belleza
            </h1>
          </div>

          <img
            src="/logo.jpg"
            alt="El Floema"
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(200, 160, 80, 0.3)",
              objectFit: "cover",
              opacity: 0.8,
            }}
          />
        </div>
      </header>

      {/* ── Chat area ── */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          maxWidth: 760,
          width: "100%",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {/* Welcome bubble */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #1a3520, #2a4a2a)",
              border: "1px solid rgba(200,160,80,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: "1rem",
            }}
          >
            🌿
          </div>
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(200, 160, 80, 0.18)",
              borderRadius: "0 1rem 1rem 1rem",
              padding: "1rem 1.25rem",
              maxWidth: "80%",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "0.97rem",
                color: "var(--color-cream)",
                opacity: 0.85,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {WELCOME}
            </p>
          </div>
        </div>

        {/* Chips — visible only while no messages */}
        {messages.length === 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.55rem",
              paddingLeft: "3rem",
            }}
          >
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => send(chip)}
                style={{
                  fontFamily: "var(--font-grimoire)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--color-gold)",
                  background: "transparent",
                  border: "1px solid rgba(200, 160, 80, 0.35)",
                  borderRadius: "2rem",
                  padding: "0.45rem 0.9rem",
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s, opacity 0.2s",
                  opacity: 0.7,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(200,160,80,0.1)";
                  e.currentTarget.style.borderColor = "rgba(200,160,80,0.65)";
                  e.currentTarget.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(200,160,80,0.35)";
                  e.currentTarget.style.opacity = "0.7";
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Conversation messages */}
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  background: "rgba(45, 74, 62, 0.45)",
                  border: "1px solid rgba(200, 160, 80, 0.2)",
                  borderRadius: "1rem 0 1rem 1rem",
                  padding: "0.85rem 1.1rem",
                  maxWidth: "75%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.97rem",
                    color: "var(--color-cream)",
                    opacity: 0.9,
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          ) : (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #1a3520, #2a4a2a)",
                  border: "1px solid rgba(200,160,80,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "1rem",
                }}
              >
                🌿
              </div>
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid rgba(200, 160, 80, 0.18)",
                  borderRadius: "0 1rem 1rem 1rem",
                  padding: "1rem 1.25rem",
                  maxWidth: "80%",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontStyle: "italic",
                    fontSize: "0.97rem",
                    color: "var(--color-cream)",
                    opacity: 0.85,
                    margin: 0,
                    lineHeight: 1.65,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {msg.content}
                </p>
              </div>
            </div>
          )
        )}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a3520, #2a4a2a)",
                border: "1px solid rgba(200,160,80,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                fontSize: "1rem",
              }}
            >
              🌿
            </div>
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid rgba(200, 160, 80, 0.18)",
                borderRadius: "0 1rem 1rem 1rem",
                padding: "1rem 1.4rem",
                display: "flex",
                gap: "0.35rem",
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--color-gold)",
                    opacity: 0.4,
                    display: "block",
                    animation: `bellezaDot 1.2s ease-in-out ${j * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </main>

      {/* ── Input area ── */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: "rgba(13, 26, 13, 0.97)",
          backdropFilter: "blur(16px)",
          borderTop: "1px solid rgba(200, 160, 80, 0.14)",
          padding: "1rem 1.5rem 1.25rem",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-end",
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu consulta de belleza…"
            rows={1}
            style={{
              flex: 1,
              background: "var(--bg-card)",
              border: "1px solid rgba(200, 160, 80, 0.25)",
              borderRadius: "0.75rem",
              padding: "0.85rem 1.1rem",
              fontFamily: "var(--font-body)",
              fontSize: "0.97rem",
              color: "var(--color-cream)",
              resize: "none",
              outline: "none",
              lineHeight: 1.55,
              transition: "border-color 0.2s",
              overflowY: "hidden",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(200,160,80,0.55)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(200,160,80,0.25)")}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              flexShrink: 0,
              width: 44,
              height: 44,
              borderRadius: "0.75rem",
              background:
                loading || !input.trim()
                  ? "rgba(200,160,80,0.15)"
                  : "rgba(200,160,80,0.9)",
              border: "1px solid rgba(200,160,80,0.35)",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
              color: loading || !input.trim() ? "rgba(200,160,80,0.4)" : "#0d1a0d",
            }}
            aria-label="Enviar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
            </svg>
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.5rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-gold)",
            opacity: 0.25,
            margin: "0.75rem 0 0",
          }}
        >
          Sabiduría botánica · El Floema
        </p>
      </div>

      <style>{`
        @keyframes bellezaDot {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 0.9; transform: scale(1.15); }
        }
        ::placeholder { color: rgba(212,196,160,0.28); }
      `}</style>
    </div>
  );
}
