"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Modo = "login" | "registro";

function traducirError(mensaje: string): string {
  if (mensaje.includes("Invalid login credentials")) return "Correo o contraseña incorrectos.";
  if (mensaje.includes("User already registered")) return "Ya existe una cuenta con ese correo.";
  if (mensaje.includes("Password should be at least")) return "La contraseña debe tener al menos 6 caracteres.";
  if (mensaje.includes("Unable to validate email address")) return "El correo no es válido.";
  return mensaje;
}

export default function LoginLabPage() {
  const router = useRouter();
  const [modo, setModo] = useState<Modo>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setCargando(true);

    const supabase = createClient();

    if (modo === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(traducirError(error.message));
        setCargando(false);
        return;
      }
      router.push("/lab/inventario");
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(traducirError(error.message));
      setCargando(false);
      return;
    }

    if (data.session) {
      router.push("/lab/inventario");
      router.refresh();
      return;
    }

    setAviso("Cuenta creada. Revisa tu correo para confirmar el acceso antes de iniciar sesión.");
    setCargando(false);
  }

  return (
    <main
      className="parchment-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          border: "1px solid rgba(200, 160, 80, 0.35)",
          boxShadow: "0 8px 35px rgba(0, 0, 0, 0.42), inset 0 1px 0 rgba(200, 160, 80, 0.15)",
          background: "linear-gradient(180deg, rgba(26,48,34,0.96) 0%, rgba(8,12,10,0.98) 100%)",
          padding: "clamp(28px, 5vw, 44px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(200, 160, 80, 0.55)",
            display: "block",
            marginBottom: "0.6rem",
          }}
        >
          Área privada
        </span>
        <h1
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "clamp(1.5rem, 3.2vw, 2rem)",
            color: "#c8a050",
            letterSpacing: "0.08em",
            marginBottom: "1.6rem",
          }}
        >
          El Floema Lab
        </h1>

        <div
          style={{
            display: "flex",
            marginBottom: "1.8rem",
            border: "1px solid rgba(200, 160, 80, 0.3)",
          }}
        >
          {(
            [
              ["login", "Iniciar sesión"],
              ["registro", "Crear cuenta"],
            ] as const
          ).map(([valor, etiqueta]) => (
            <button
              key={valor}
              type="button"
              onClick={() => {
                setModo(valor);
                setError(null);
                setAviso(null);
              }}
              style={{
                flex: 1,
                padding: "10px 0",
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.62rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                color: modo === valor ? "#0d1a0d" : "#d4c4a0",
                background: modo === valor ? "#c8a050" : "transparent",
                transition: "all 0.25s ease",
              }}
            >
              {etiqueta}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(212,196,160,0.7)",
              }}
            >
              Correo
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <span
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(212,196,160,0.7)",
              }}
            >
              Contraseña
            </span>
            <input
              type="password"
              required
              minLength={6}
              autoComplete={modo === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </label>

          {error && (
            <p style={{ color: "#d1493f", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>{error}</p>
          )}
          {aviso && (
            <p style={{ color: "#2a9d4b", fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>{aviso}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            style={{
              marginTop: "0.5rem",
              padding: "12px 0",
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.65rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#0d1a0d",
              background: "#c8a050",
              border: "none",
              cursor: cargando ? "wait" : "pointer",
              opacity: cargando ? 0.7 : 1,
              transition: "opacity 0.2s ease",
            }}
          >
            {cargando
              ? "Un momento…"
              : modo === "login"
                ? "Iniciar sesión"
                : "Crear cuenta"}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "1rem",
  color: "#e8dcc8",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(200, 160, 80, 0.3)",
  padding: "10px 12px",
  outline: "none",
};
