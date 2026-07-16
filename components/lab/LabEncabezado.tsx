import type { CSSProperties } from "react";
import { SignOutButton } from "@/components/lab/SignOutButton";
import { LabNav } from "@/components/lab/LabNav";

export function LabEncabezado({
  titulo,
  actual,
}: {
  titulo: string;
  actual: "inventario" | "formulas" | "preparadas" | "asistente" | "tareas" | "productos";
}) {
  return (
    <>
      <div style={cabeceraStyle}>
        <div>
          <span style={kickerStyle}>El Floema Lab</span>
          <h1 className="lab-titulo" style={tituloStyle}>
            <span className="lab-hojas" style={hojaStyle} aria-hidden>
              ❧
            </span>
            {titulo}
            <span className="lab-hojas" style={{ ...hojaStyle, transform: "scaleX(-1)" }} aria-hidden>
              ❧
            </span>
          </h1>
        </div>
        <SignOutButton />
      </div>

      <div className="lab-flourish" aria-hidden>
        <span style={{ color: "rgba(200,160,80,0.8)", fontSize: "0.7rem" }}>✦</span>
        <span className="lab-hojas">❦</span>
        <span style={{ color: "rgba(200,160,80,0.8)", fontSize: "0.7rem" }}>✦</span>
      </div>

      <LabNav actual={actual} />
    </>
  );
}

const cabeceraStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
};

const kickerStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.6rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(200, 160, 80, 0.55)",
  display: "block",
  marginBottom: "0.6rem",
};

const tituloStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
  color: "#c8a050",
  letterSpacing: "0.08em",
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
};

const hojaStyle: CSSProperties = {
  fontSize: "0.55em",
  display: "inline-block",
};
