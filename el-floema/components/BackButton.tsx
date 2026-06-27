"use client";
import Link from "next/link";

export function BackButton({ label = "← Volver", href }: { label?: string; href?: string }) {
  if (href) {
    return (
      <Link href={href} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", textDecoration: "none" }}>
        {label}
      </Link>
    );
  }
  return (
    <button onClick={() => history.back()} style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
      {label}
    </button>
  );
}
