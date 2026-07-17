// Puerto a TS de la logica de layout de label_system/render.py.
// Mantener en sync con BASE_SIZES / compute_layout de ese archivo si cambia el diseño.

export const ART_ASPECT = 1457 / 720; // ancho / alto del arte de fondo
export const BASE_WIDTH_MM = 150.0; // ancho de referencia del diseño

export const BASE_SIZES = {
  small_title_size: 8.4,
  body_size: 6.2,
  small_body_size: 5.2,
  title_size: 17.0,
  subtitle_size: 6.5,
  size_tag_size: 10.0,
  tiny_size: 4.9,
} as const;

export interface LayoutBase {
  width_mm: number;
  height_mm: number;
  s: number;
}

export type ZoneSizes = { [K in keyof typeof BASE_SIZES]: number } & { s: number };

export function computeLayout(widthMm: number, fontScale = 1.0): LayoutBase {
  const s = (widthMm / BASE_WIDTH_MM) * fontScale;
  return {
    width_mm: round2(widthMm),
    height_mm: round2(widthMm / ART_ASPECT),
    s: Math.round(s * 10000) / 10000,
  };
}

// Tamaño de letra por panel: cada zona (izquierda/centro/derecha) puede tener su
// propio multiplicador ademas de la escala global (ancho fisico x "Ajuste de letra").
export function sizesForZone(baseS: number, zoneScale: number): ZoneSizes {
  const s = baseS * (zoneScale || 1);
  const sizes = Object.fromEntries(
    Object.entries(BASE_SIZES).map(([k, v]) => [k, round2(v * s)])
  ) as { [K in keyof typeof BASE_SIZES]: number };
  return { s, ...sizes };
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

export interface EtiquetaData {
  product_name: string;
  subtitle: string;
  category_line: string;
  size: string;
  modo_uso: string;
  ingredientes: string;
  advertencias: string;
  storage_note: string;
  social: string;
  fabricante: string;
  lote: string;
  vencimiento: string;
  width_mm: number;
  font_scale: number;
  descripcion_catalogo: string;
  descripcion_redes: string;
  offset_left_mm: number;
  offset_center_mm: number;
  offset_right_mm: number;
  font_scale_left: number;
  font_scale_center: number;
  font_scale_right: number;
}

export const ETIQUETA_DEFAULTS: EtiquetaData = {
  product_name: "",
  subtitle: "",
  category_line: "",
  size: "",
  modo_uso: "",
  ingredientes: "",
  advertencias: "",
  storage_note: "",
  social: "@elfloema",
  fabricante: "Fabricante: El Floema · La Unión, Región de Los Ríos, Chile.",
  lote: "",
  vencimiento: "",
  width_mm: 150,
  font_scale: 1.0,
  descripcion_catalogo: "",
  descripcion_redes: "",
  offset_left_mm: 0,
  offset_center_mm: 0,
  offset_right_mm: 0,
  font_scale_left: 1.0,
  font_scale_center: 1.0,
  font_scale_right: 1.0,
};
