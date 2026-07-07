import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/lab/SignOutButton";

export default async function FormulasLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  return (
    <main
      className="parchment-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(24px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
          El Floema Lab
        </span>
        <h1
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#c8a050",
            letterSpacing: "0.08em",
            marginBottom: "1rem",
          }}
        >
          Fórmulas
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", color: "#d4c4a0", marginBottom: "0.5rem" }}>
          Sesión iniciada como {user.email}.
        </p>
        <p style={{ fontFamily: "var(--font-body)", color: "#d4c4a0", opacity: 0.7, marginBottom: "2rem" }}>
          Próximamente: recetas y cálculo de costos por fórmula.
        </p>
        <SignOutButton />
      </div>
    </main>
  );
}
