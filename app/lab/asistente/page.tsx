import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { AsistenteChat, type InventarioOpcion } from "@/components/lab/AsistenteChat";

export default async function AsistenteLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const { data: inventarioData } = await supabase
    .from("inventario_con_costo")
    .select("id, ingrediente, unidad, costo_unitario")
    .order("ingrediente", { ascending: true });

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo="Asistente" actual="asistente" />

        <AsistenteChat inventarioOpciones={(inventarioData as InventarioOpcion[] | null) ?? []} userId={user.id} />
      </div>
    </main>
  );
}
