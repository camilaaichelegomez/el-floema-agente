import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { LabEncabezado } from "@/components/lab/LabEncabezado";
import { EtiquetaEditor } from "@/components/lab/EtiquetaEditor";
import { ETIQUETA_DEFAULTS, type EtiquetaData } from "@/lib/etiquetas";

export default async function EtiquetaFormulaPage({
  params,
}: {
  params: Promise<{ formulaId: string }>;
}) {
  const { formulaId: formulaIdParam } = await params;
  const formulaId = Number(formulaIdParam);
  if (!Number.isInteger(formulaId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/lab/login");
  }

  const [{ data: formula }, { data: items }, { data: etiqueta }] = await Promise.all([
    supabase.from("formulas").select("id, nombre, lote").eq("id", formulaId).single(),
    supabase.from("formula_items").select("ingrediente").eq("formula_id", formulaId),
    supabase.from("formula_etiquetas").select("*").eq("formula_id", formulaId).maybeSingle(),
  ]);

  if (!formula) notFound();

  const ingredientesAuto = (items ?? []).map((it) => it.ingrediente).join(", ");

  const initialData: EtiquetaData = {
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

  return (
    <main
      className="parchment-bg lab-bg"
      style={{ minHeight: "100vh", padding: "clamp(90px, 14vh, 140px) clamp(20px, 5vw, 64px) 64px" }}
    >
      <div className="etiqueta-pagina" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <LabEncabezado titulo={`Etiqueta — ${formula.nombre}`} actual="formulas" />
        <EtiquetaEditor formulaId={formulaId} initialData={initialData} userId={user.id} />
      </div>
    </main>
  );
}
