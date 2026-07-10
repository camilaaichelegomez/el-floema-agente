import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { InventarioManager, type InventarioItem } from "@/components/lab/InventarioManager";

const COLUMNAS =
  "id, ingrediente, categoria, cantidad, unidad, precio_compra, cantidad_compra, proveedor, fecha_compra, vencimiento, notas, costo_unitario, foto_boleta_path";

export default async function InventarioLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const { data, error } = await supabase
    .from("inventario_con_costo")
    .select(COLUMNAS)
    .order("ingrediente", { ascending: true });

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo="Inventario" actual="inventario" />

        {error ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a" }}>
            No se pudo cargar el inventario: {error.message}
          </p>
        ) : (
          <InventarioManager initialItems={(data as InventarioItem[] | null) ?? []} userId={user.id} />
        )}
      </div>
    </main>
  );
}
