import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { SignOutButton } from "@/components/lab/SignOutButton";
import { LabNav } from "@/components/lab/LabNav";
import { FormulasManager, type Formula, type InventarioOpcion } from "@/components/lab/FormulasManager";

export default async function FormulasLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const { data: formulasData, error } = await supabase.from("formulas").select("*").order("nombre", { ascending: true });
  const formulasBase = formulasData ?? [];

  const costos = await Promise.all(
    formulasBase.map((f) => supabase.rpc("costo_formula", { f_id: f.id }).then(({ data }) => data?.[0] ?? null))
  );
  const formulas: Formula[] = formulasBase.map((f, i) => ({ ...f, costo: costos[i] }));

  const { data: inventarioData } = await supabase
    .from("inventario_con_costo")
    .select("id, ingrediente, unidad, costo_unitario, cantidad")
    .order("ingrediente", { ascending: true });

  return (
    <main
      className="parchment-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <div>
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
              }}
            >
              Fórmulas
            </h1>
          </div>
          <SignOutButton />
        </div>

        <LabNav actual="formulas" />

        {error ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a" }}>
            No se pudieron cargar las fórmulas: {error.message}
          </p>
        ) : (
          <FormulasManager
            initialFormulas={formulas}
            inventarioOpciones={(inventarioData as InventarioOpcion[] | null) ?? []}
            userId={user.id}
          />
        )}
      </div>
    </main>
  );
}
