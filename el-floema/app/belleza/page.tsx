"use client";

import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";

interface Mensaje {
  rol: "usuario" | "agente";
  texto: string;
}

const SUGERENCIAS = [
  "¿Qué aceite es mejor para piel seca?",
  "¿Cómo hacer un sérum de rosa mosqueta?",
  "¿Qué plantas sirven para el acné?",
  "¿Cómo hidrato el cabello con plantas?",
];

function renderTexto(texto: string) {
  const lines = texto.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    if (line.startsWith("### ") || line.startsWith("## ")) {
      const content = line.replace(/^#{2,3}\s+/, "");
      elements.push(
        <h3 key={i} className="md-heading">{renderInline(content)}</h3>
      );
    } else if (/^\*\s+|^-\s+/.test(line)) {
      elements.push(
        <li key={i} className="md-li">{renderInline(line.replace(/^[\*\-]\s+/, ""))}</li>
      );
    } else if (line.trim() === "") {
      elements.push(<br key={i} />);
    } else {
      elements.push(<p key={i} className="md-p">{renderInline(line)}</p>);
    }
  });

  return <div className="mensaje-cuerpo">{elements}</div>;
}

function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*") && part.endsWith("*"))
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });
}

export default function BellezaPage() {
  const [mensajes, setMensajes]   = useState<Mensaje[]>([]);
  const [input, setInput]         = useState("");
  const [cargando, setCargando]   = useState(false);
  const [sessionId, setSessionId] = useState("");
  const chatEndRef                = useRef<HTMLDivElement>(null);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let id = localStorage.getItem("floema_belleza_session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("floema_belleza_session_id", id);
    }
    setSessionId(id);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  async function enviar(preguntaOverride?: string) {
    const question = (preguntaOverride ?? input).trim();
    if (!question || cargando) return;

    const history: { user: string; assistant: string }[] = [];
    for (let i = 0; i + 1 < mensajes.length; i += 2) {
      if (mensajes[i].rol === "usuario" && mensajes[i + 1]?.rol === "agente") {
        history.push({ user: mensajes[i].texto, assistant: mensajes[i + 1].texto });
      }
    }

    setMensajes((prev) => [...prev, { rol: "usuario", texto: question }]);
    setInput("");
    setCargando(true);

    try {
      const res = await fetch("/api/belleza", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history, session_id: sessionId }),
      });
      const data = await res.json();

      if (data.error) {
        setMensajes((prev) => [...prev, { rol: "agente", texto: `⚠ ${data.error}` }]);
      } else {
        setMensajes((prev) => [...prev, { rol: "agente", texto: data.response }]);
      }
    } catch {
      setMensajes((prev) => [
        ...prev,
        { rol: "agente", texto: "⚠ No pude conectarme al agente de belleza." },
      ]);
    } finally {
      setCargando(false);
      textareaRef.current?.focus();
    }
  }

  return (
    <>
      <Navbar />
      <main className="consulta-page">
        <div className="consulta-header">
          <span className="consulta-label">El Floema</span>
          <h1 className="consulta-titulo">Cosmética Botánica</h1>
          <p className="consulta-subtitulo">
            Consulta sobre formulación natural, ingredientes activos y rituales
            de belleza con plantas.
          </p>
        </div>

        <div className="chat-contenedor">
          {mensajes.length === 0 && (
            <div className="chat-vacio">
              <div className="chat-vacio-ornamento">✦</div>
              <p className="chat-vacio-texto">¿Qué quieres formular hoy?</p>
              <div className="sugerencias">
                {SUGERENCIAS.map((s) => (
                  <button key={s} className="sugerencia-btn" onClick={() => enviar(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mensajes.map((m, i) => (
            <div key={i} className={`mensaje mensaje--${m.rol}`}>
              {m.rol === "agente" && (
                <span className="mensaje-avatar" aria-hidden>✦</span>
              )}
              <div className="mensaje-burbuja">
                {m.rol === "agente"
                  ? renderTexto(m.texto)
                  : <p className="md-p">{m.texto}</p>}
              </div>
            </div>
          ))}

          {cargando && (
            <div className="mensaje mensaje--agente">
              <span className="mensaje-avatar" aria-hidden>✦</span>
              <div className="mensaje-burbuja">
                <div className="cargando-puntos">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={textareaRef}
            className="chat-input"
            placeholder="Escribe tu pregunta sobre cosmética botánica… (Enter para enviar)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                enviar();
              }
            }}
            rows={2}
            disabled={cargando}
          />
          <button
            className="chat-enviar"
            onClick={() => enviar()}
            disabled={cargando || !input.trim()}
            aria-label="Enviar consulta"
          >
            {cargando ? "…" : "Consultar"}
          </button>
        </div>
      </main>
    </>
  );
}
