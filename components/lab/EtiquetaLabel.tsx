import type { CSSProperties } from "react";
import { computeLayout, sizesForZone, type EtiquetaData, type ZoneSizes } from "@/lib/etiquetas";

// Puerto fiel a React de label_system/template.html.j2 — mismas zonas %, misma
// matematica de escalado tipografico (ver lib/etiquetas.ts). Si el arte de fondo
// o el template .j2 cambian, este componente debe actualizarse en paralelo.
//
// Cada panel (izquierda/centro/derecha) tiene su propio multiplicador de tamaño
// de letra (font_scale_left/center/right) ademas de la escala global del ancho
// fisico — por eso los estilos de texto se calculan una vez por panel, no una
// sola vez para toda la etiqueta.

const CREAM = "#efe5c8";
const GOLD_LIGHT = "#f6dfa4";
const GOLD = "#f3dda6";

function sombra(s: number, offset: number, blur: number, alpha = 0.8) {
  return `0 ${offset * s}mm ${blur * s}mm rgba(0,0,0,${alpha})`;
}

function estilosDeTexto(sizes: ZoneSizes) {
  const s = sizes.s;
  const sectionText: CSSProperties = {
    fontSize: `${sizes.body_size}pt`,
    lineHeight: 1.28,
    color: CREAM,
    margin: `0 0 ${1.6 * s}mm 0`,
    textShadow: sombra(s, 0.2, 0.45),
  };
  const productSubtitle: CSSProperties = {
    fontSize: `${sizes.subtitle_size}pt`,
    color: CREAM,
    margin: `0 0 ${1.6 * s}mm 0`,
    lineHeight: 1.3,
    textShadow: sombra(s, 0.2, 0.45),
  };

  return {
    sectionTitle: {
      fontSize: `${sizes.small_title_size}pt`,
      color: GOLD_LIGHT,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontWeight: 600,
      margin: `0 0 ${1.2 * s}mm 0`,
      textShadow: sombra(s, 0.25, 0.5),
    } as CSSProperties,
    sectionText,
    sectionTextSmall: { ...sectionText, fontSize: `${sizes.small_body_size}pt` } as CSSProperties,
    productName: {
      fontSize: `${sizes.title_size}pt`,
      fontWeight: 600,
      color: GOLD,
      margin: `0 0 ${1.6 * s}mm 0`,
      lineHeight: 1.12,
      letterSpacing: "0.01em",
      textShadow: sombra(s, 0.35, 0.7, 0.85),
    } as CSSProperties,
    productSubtitle,
    productCategory: { ...productSubtitle, margin: 0 } as CSSProperties,
    sizeTag: {
      fontSize: `${sizes.size_tag_size}pt`,
      color: GOLD,
      letterSpacing: "0.08em",
      textShadow: sombra(s, 0.25, 0.5),
    } as CSSProperties,
    storageNote: {
      fontSize: `${sizes.small_body_size}pt`,
      lineHeight: 1.3,
      color: CREAM,
      margin: `${2.0 * s}mm 0 0 0`,
      textShadow: sombra(s, 0.2, 0.45),
    } as CSSProperties,
    social: {
      fontSize: `${sizes.body_size}pt`,
      color: GOLD_LIGHT,
      marginTop: `${1.8 * s}mm`,
      textShadow: sombra(s, 0.2, 0.45),
    } as CSSProperties,
    footerBlock: {
      fontSize: `${sizes.tiny_size}pt`,
      lineHeight: 1.35,
      color: CREAM,
      opacity: 0.92,
      marginTop: `${1.2 * s}mm`,
      textShadow: sombra(s, 0.18, 0.4),
    } as CSSProperties,
  };
}

export function EtiquetaLabel({ data, className }: { data: EtiquetaData; className?: string }) {
  const L = computeLayout(data.width_mm, data.font_scale);

  const sizesLeft = sizesForZone(L.s, data.font_scale_left);
  const sizesCenter = sizesForZone(L.s, data.font_scale_center);
  const sizesRight = sizesForZone(L.s, data.font_scale_right);

  const izquierda = estilosDeTexto(sizesLeft);
  const centro = estilosDeTexto(sizesCenter);
  const derecha = estilosDeTexto(sizesRight);

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

  return (
    <div className={className} style={labelStyle}>
      <div style={zoneLeft}>
        <div style={{ marginTop: `${data.offset_left_mm}mm` }}>
          <h2 style={izquierda.sectionTitle}>Modo de Uso</h2>
          <p style={izquierda.sectionTextSmall}>{data.modo_uso}</p>
          {data.ingredientes && (
            <>
              <h2 style={izquierda.sectionTitle}>Ingredientes (INCI)</h2>
              <p style={izquierda.sectionTextSmall}>{data.ingredientes}</p>
            </>
          )}
        </div>
      </div>

      <div style={zoneCenter}>
        <div style={{ marginTop: `${data.offset_center_mm}mm` }}>
          <h1 style={centro.productName}>{data.product_name}</h1>
          {data.subtitle && <div style={centro.productSubtitle}>{data.subtitle}</div>}
          {data.category_line && <div style={centro.productCategory}>{data.category_line}</div>}
        </div>
        <div style={bottomStyle}>
          <div style={centro.sizeTag}>{data.size}</div>
        </div>
      </div>

      <div style={zoneRight}>
        <div style={{ marginTop: `${data.offset_right_mm}mm` }}>
          {data.advertencias && (
            <>
              <h2 style={derecha.sectionTitle}>Advertencias</h2>
              <p style={derecha.sectionTextSmall}>{data.advertencias}</p>
            </>
          )}
          {data.storage_note && <div style={derecha.storageNote}>{data.storage_note}</div>}
        </div>
        <div style={bottomStyle}>
          {data.social && <div style={derecha.social}>{data.social}</div>}
          <div style={derecha.footerBlock}>
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
