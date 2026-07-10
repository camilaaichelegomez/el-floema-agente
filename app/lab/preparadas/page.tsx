import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { PreparacionesManager, type Preparacion } from "@/components/lab/PreparacionesManager";

export default async function PreparadasLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const { data, error } = await supabase
    .from("preparaciones")
    .select("id, formula_id, nombre_formula, cantidad_gramos, pasos, creado")
    .order("creado", { ascending: false });

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo="Preparadas" actual="preparadas" />

        {error ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a" }}>
            No se pudieron cargar las preparaciones: {error.message}
          </p>
        ) : (
          <PreparacionesManager initialPreparaciones={(data as Preparacion[] | null) ?? []} />
        )}
      </div>
    </main>
  );
}
