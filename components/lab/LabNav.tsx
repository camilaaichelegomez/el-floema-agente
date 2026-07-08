import Link from "next/link";
import type { CSSProperties } from "react";

const ENLACES = [
  { href: "/lab/inventario", label: "Inventario" },
  { href: "/lab/formulas", label: "Fórmulas" },
  { href: "/lab/asistente", label: "Asistente" },
];

export function LabNav({ actual }: { actual: "inventario" | "formulas" | "asistente" }) {
  return (
    <nav style={navStyle}>
      {ENLACES.map((e) => {
        const activo = e.href.endsWith(actual);
        return (
          <Link key={e.href} href={e.href} style={activo ? { ...enlaceStyle, ...enlaceActivoStyle } : enlaceStyle}>
            {e.label}
          </Link>
        );
      })}
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: "flex",
  gap: "1.2rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

const enlaceStyle: CSSProperties = {
  fontFamily: "var(--font-grimoire)",
  fontSize: "0.62rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "rgba(212,196,160,0.6)",
  textDecoration: "none",
  paddingBottom: "0.3rem",
  borderBottom: "1px solid transparent",
};

const enlaceActivoStyle: CSSProperties = {
  color: "#c8a050",
  borderBottom: "1px solid #c8a050",
};
