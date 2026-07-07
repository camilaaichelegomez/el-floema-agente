"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export function SignOutButton() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  async function handleClick() {
    setCargando(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/lab/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={cargando}
      style={{
        fontFamily: "var(--font-grimoire)",
        fontSize: "0.6rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(200, 160, 80, 0.7)",
        background: "none",
        border: "1px solid rgba(200, 160, 80, 0.35)",
        padding: "8px 16px",
        cursor: cargando ? "wait" : "pointer",
        opacity: cargando ? 0.6 : 1,
      }}
    >
      {cargando ? "Saliendo…" : "Cerrar sesión"}
    </button>
  );
}
