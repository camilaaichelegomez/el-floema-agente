import Link from "next/link";
import { Fragment, type CSSProperties } from "react";

const ENLACES = [
  { href: "/lab/inventario", label: "Inventario" },
  { href: "/lab/formulas", label: "Fórmulas" },
  { href: "/lab/preparadas", label: "Preparadas" },
  { href: "/lab/asistente", label: "Asistente" },
];

export function LabNav({ actual }: { actual: "inventario" | "formulas" | "preparadas" | "asistente" }) {
  return (
    <nav style={navStyle}>
      {ENLACES.map((e, idx) => {
        const activo = e.href.endsWith(actual);
        return (
          <Fragment key={e.href}>
            {idx > 0 && (
              <span style={separadorStyle} aria-hidden>
                ✦
              </span>
            )}
            <Link href={e.href} style={activo ? { ...enlaceStyle, ...enlaceActivoStyle } : enlaceStyle}>
              {e.label}
            </Link>
          </Fragment>
        );
      })}
    </nav>
  );
}

const navStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "1rem",
  marginBottom: "1.8rem",
  flexWrap: "wrap",
};

const separadorStyle: CSSProperties = {
  color: "rgba(154, 106, 170, 0.55)",
  fontSize: "0.55rem",
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
  color: "#e8c070",
  borderBottom: "1px solid #c8a050",
  textShadow: "0 0 14px rgba(200,160,80,0.5)",
};
