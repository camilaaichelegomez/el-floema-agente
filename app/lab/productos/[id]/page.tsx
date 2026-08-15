import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { BackButton } from "@/components/BackButton";
import { ProductoDetalle, type DetalleFormula, type DetalleItem } from "@/components/lab/ProductoDetalle";
import { ETIQUETA_DEFAULTS, type EtiquetaData } from "@/lib/etiquetas";

export default async function ProductoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const productId = Number(idParam);
  if (!Number.isInteger(productId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const [{ data: formula }, { data: items }, { data: etiqueta }] = await Promise.all([
    supabase
      .from("formulas")
      .select("id, nombre, categoria, descripcion, lote, rinde_gramos, unidades, ph_objetivo, notas, pasos")
      .eq("id", productId)
      .single(),
    supabase
      .from("formula_items")
      .select("ingrediente, gramos, porcentaje, fase")
      .eq("formula_id", productId)
      .order("id", { ascending: true }),
    supabase.from("formula_etiquetas").select("*").eq("formula_id", productId).maybeSingle(),
  ]);

  if (!formula) notFound();

  const ingredientesAuto = (items ?? []).map((it) => it.ingrediente).join(", ");

  const etiquetaData: EtiquetaData = {
    ...ETIQUETA_DEFAULTS,
    forma: etiqueta?.forma === "redonda" ? "redonda" : "rectangular",
    product_name: formula.nombre,
    lote: formula.lote ?? "",
    ingredientes: etiqueta?.ingredientes ?? ingredientesAuto,
    subtitle: etiqueta?.subtitle ?? "",
    category_line: etiqueta?.category_line ?? "",
    modo_uso: etiqueta?.modo_uso ?? "",
    advertencias: etiqueta?.advertencias ?? "",
    storage_note: etiqueta?.storage_note ?? "",
    social: etiqueta?.social ?? ETIQUETA_DEFAULTS.social,
    fabricante: etiqueta?.fabricante ?? ETIQUETA_DEFAULTS.fabricante,
    vencimiento: etiqueta?.vencimiento ?? "",
    size: etiqueta?.tamano ?? "",
    width_mm: etiqueta?.width_mm ?? ETIQUETA_DEFAULTS.width_mm,
    alto_mm: etiqueta?.alto_mm ?? ETIQUETA_DEFAULTS.alto_mm,
    font_scale: etiqueta?.font_scale ?? ETIQUETA_DEFAULTS.font_scale,
    descripcion_catalogo: etiqueta?.descripcion_catalogo ?? "",
    descripcion_redes: etiqueta?.descripcion_redes ?? "",
    offset_left_mm: etiqueta?.offset_left_mm ?? ETIQUETA_DEFAULTS.offset_left_mm,
    offset_center_mm: etiqueta?.offset_center_mm ?? ETIQUETA_DEFAULTS.offset_center_mm,
    offset_right_mm: etiqueta?.offset_right_mm ?? ETIQUETA_DEFAULTS.offset_right_mm,
    font_scale_left: etiqueta?.font_scale_left ?? ETIQUETA_DEFAULTS.font_scale_left,
    font_scale_center: etiqueta?.font_scale_center ?? ETIQUETA_DEFAULTS.font_scale_center,
    font_scale_right: etiqueta?.font_scale_right ?? ETIQUETA_DEFAULTS.font_scale_right,
  };

  const detalleFormula: DetalleFormula = {
    nombre: formula.nombre,
    categoria: formula.categoria,
    descripcion: formula.descripcion,
    lote: formula.lote,
    rinde_gramos: formula.rinde_gramos,
    unidades: formula.unidades,
    ph_objetivo: formula.ph_objetivo,
    notas: formula.notas,
    pasos: formula.pasos,
  };

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <LabEncabezado titulo={formula.nombre} actual="productos" />
        <div style={{ marginBottom: "1.5rem" }}>
          <BackButton label="← Volver a productos" href="/lab/productos" />
        </div>
        <ProductoDetalle
          productId={productId}
          formula={detalleFormula}
          items={(items as DetalleItem[] | null) ?? []}
          etiqueta={etiquetaData}
          subtitle={etiqueta?.subtitle ?? null}
        />
      </div>
    </main>
  );
}
