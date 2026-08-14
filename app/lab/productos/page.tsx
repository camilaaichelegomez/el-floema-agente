import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { ProductosManager, type ProductoConEtiqueta, type FormulaOpcion } from "@/components/lab/ProductosManager";

export default async function ProductosLabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const [{ data, error }, { data: todasFormulas }] = await Promise.all([
    supabase
      .from("formulas")
      .select(
        "id, nombre, categoria, formula_etiquetas!inner(subtitle, category_line, tamano, descripcion_catalogo, descripcion_redes, es_producto)"
      )
      .eq("formula_etiquetas.es_producto", true)
      .order("nombre", { ascending: true }),
    supabase.from("formulas").select("id, nombre").order("nombre", { ascending: true }),
  ]);

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo="Productos" actual="productos" />

        {error ? (
          <p style={{ fontFamily: "var(--font-body)", color: "#e05a4a" }}>
            No se pudieron cargar los productos: {error.message}
          </p>
        ) : (
          <ProductosManager
            productos={(data as unknown as ProductoConEtiqueta[] | null) ?? []}
            todasFormulas={(todasFormulas as FormulaOpcion[] | null) ?? []}
            userId={user.id}
          />
        )}
      </div>
    </main>
  );
}
