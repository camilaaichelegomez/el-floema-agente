import type { CSSProperties } from "react";
import { computeLayout, type EtiquetaData } from "@/lib/etiquetas";

// Puerto fiel a React de label_system/template.html.j2 — mismas zonas %, misma
// matematica de escalado tipografico (ver lib/etiquetas.ts). Si el arte de fondo
// o el template .j2 cambian, este componente debe actualizarse en paralelo.

const CREAM = "#efe5c8";
const GOLD_LIGHT = "#f6dfa4";
const GOLD = "#f3dda6";

function sombra(s: number, offset: number, blur: number, alpha = 0.8) {
  return `0 ${offset * s}mm ${blur * s}mm rgba(0,0,0,${alpha})`;
}

export function EtiquetaLabel({ data, className }: { data: EtiquetaData; className?: string }) {
  const L = computeLayout(data.width_mm, data.font_scale);
  const s = L.s;

  const labelStyle: CSSProperties = {
    width: `${L.width_mm}mm`,
    height: `${L.height_mm}mm`,
    position: "relative",
    backgroundImage: "url(/etiquetas/arte-fondo.png)",
    backgroundSize: "100% 100%",
    overflow: "hidden",
    fontFamily: "var(--font-lora), Lora, serif",
    color: CREAM,
    flexShrink: 0,
  };

  const zoneBase: CSSProperties = { position: "absolute", textAlign: "center" };
  const zoneLeft: CSSProperties = { ...zoneBase, left: "4.4%", top: "14%", width: "19.2%", height: "71%" };
  const zoneCenter: CSSProperties = { ...zoneBase, left: "39.0%", top: "43.5%", width: "22.0%", height: "50%" };
  const zoneRight: CSSProperties = { ...zoneBase, left: "75.0%", top: "14%", width: "20.4%", height: "71%" };
  const bottomStyle: CSSProperties = { position: "absolute", bottom: 0, left: 0, right: 0 };

  const sectionTitle: CSSProperties = {
    fontSize: `${L.small_title_size}pt`,
    color: GOLD_LIGHT,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    fontWeight: 600,
    margin: `0 0 ${1.2 * s}mm 0`,
    textShadow: sombra(s, 0.25, 0.5),
  };
  const sectionText: CSSProperties = {
    fontSize: `${L.body_size}pt`,
    lineHeight: 1.28,
    color: CREAM,
    margin: `0 0 ${1.6 * s}mm 0`,
    textShadow: sombra(s, 0.2, 0.45),
  };
  const sectionTextSmall: CSSProperties = { ...sectionText, fontSize: `${L.small_body_size}pt` };
  const productName: CSSProperties = {
    fontSize: `${L.title_size}pt`,
    fontWeight: 600,
    color: GOLD,
    margin: `0 0 ${1.6 * s}mm 0`,
    lineHeight: 1.12,
    letterSpacing: "0.01em",
    textShadow: sombra(s, 0.35, 0.7, 0.85),
  };
  const productSubtitle: CSSProperties = {
    fontSize: `${L.subtitle_size}pt`,
    color: CREAM,
    margin: `0 0 ${1.6 * s}mm 0`,
    lineHeight: 1.3,
    textShadow: sombra(s, 0.2, 0.45),
  };
  const productCategory: CSSProperties = { ...productSubtitle, margin: 0 };
  const sizeTag: CSSProperties = {
    fontSize: `${L.size_tag_size}pt`,
    color: GOLD,
    letterSpacing: "0.08em",
    textShadow: sombra(s, 0.25, 0.5),
  };
  const storageNote: CSSProperties = {
    fontSize: `${L.small_body_size}pt`,
    lineHeight: 1.3,
    color: CREAM,
    margin: `${2.0 * s}mm 0 0 0`,
    textShadow: sombra(s, 0.2, 0.45),
  };
  const social: CSSProperties = {
    fontSize: `${L.body_size}pt`,
    color: GOLD_LIGHT,
    marginTop: `${1.8 * s}mm`,
    textShadow: sombra(s, 0.2, 0.45),
  };
  const footerBlock: CSSProperties = {
    fontSize: `${L.tiny_size}pt`,
    lineHeight: 1.35,
    color: CREAM,
    opacity: 0.92,
    marginTop: `${1.2 * s}mm`,
    textShadow: sombra(s, 0.18, 0.4),
  };

  return (
    <div className={className} style={labelStyle}>
      <div style={zoneLeft}>
        <h2 style={sectionTitle}>Modo de Uso</h2>
        <p style={sectionTextSmall}>{data.modo_uso}</p>
        {data.ingredientes && (
          <>
            <h2 style={sectionTitle}>Ingredientes (INCI)</h2>
            <p style={sectionTextSmall}>{data.ingredientes}</p>
          </>
        )}
      </div>

      <div style={zoneCenter}>
        <h1 style={productName}>{data.product_name}</h1>
        {data.subtitle && <div style={productSubtitle}>{data.subtitle}</div>}
        {data.category_line && <div style={productCategory}>{data.category_line}</div>}
        <div style={bottomStyle}>
          <div style={sizeTag}>{data.size}</div>
        </div>
      </div>

      <div style={zoneRight}>
        {data.advertencias && (
          <>
            <h2 style={sectionTitle}>Advertencias</h2>
            <p style={sectionTextSmall}>{data.advertencias}</p>
          </>
        )}
        {data.storage_note && <div style={storageNote}>{data.storage_note}</div>}
        <div style={bottomStyle}>
          {data.social && <div style={social}>{data.social}</div>}
          <div style={footerBlock}>
            {data.fabricante}
            <br />
            Lote: {data.lote}
            {data.vencimiento && ` · V: ${data.vencimiento}`}
          </div>
        </div>
      </div>
    </div>
  );
}
