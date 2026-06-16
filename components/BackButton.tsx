"use client";
import { useRouter } from "next/navigation";

export function BackButton({ label = "← Volver al Grimorio" }: { label?: string }) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "0.62rem",
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: "rgba(200, 160, 80, 0.55)",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "8px 0",
        transition: "color 0.3s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#c8a050")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(200, 160, 80, 0.55)")}
    >
      {label}
    </button>
  );
}
