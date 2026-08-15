import { BackButton } from "@/components/BackButton";

// ── Grain overlay ─────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-x">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-x)" />
    </svg>
  );
}

// ── Typography helpers ────────────────────────────────────────────────────────
function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.8rem,4vw,3rem)", color: "#c8a050", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem", textShadow: "0 0 60px rgba(200,160,80,0.2)" }}>
      {children}
    </h1>
  );
}
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(0.9rem,2vw,1.2rem)", color: "#c8a050", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "1rem", textShadow: "0 0 30px rgba(200,160,80,0.18)" }}>
      {children}
    </h2>
  );
}
function Divider() {
  return (
    <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.25),transparent)", margin: "2.5rem 0" }} />
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", display: "block", marginBottom: "0.6rem" }}>
      {children}
    </span>
  );
}

// ── Formula data types ────────────────────────────────────────────────────────
interface FormulaIngredient {
  name: string;
  range: string;
  desc: string;
}
interface FormulaCategory {
  title: string;
  range: string;
  items: FormulaIngredient[];
}
interface Formula {
  id: string;
  title: string;
  ph: string;
  preservative: string;
  note?: string;
  categories: FormulaCategory[];
}

// ── Category block ────────────────────────────────────────────────────────────
function CategoryBlock({ cat }: { cat: FormulaCategory }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          background: "rgba(200,160,80,0.08)",
          borderLeft: "3px solid #c8a050",
          padding: "0.5rem 1rem",
          marginBottom: "0.75rem",
        }}
      >
        <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8a050" }}>
          {cat.title}
        </span>
        {" "}
        <span style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "0.88rem", color: "#d4c4a0", opacity: 0.7 }}>
          {cat.range}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
        {cat.items.map((item) => (
          <div key={item.name} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", paddingLeft: "0.5rem" }}>
            <span style={{ color: "#c8a050", fontSize: "0.7rem", flexShrink: 0, marginTop: "0.35rem" }}>●</span>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.95rem,1.5vw,1.05rem)", lineHeight: 1.65, color: "#d4c4a0", margin: 0 }}>
              <strong style={{ color: "rgba(212,196,160,0.95)" }}>{item.name}</strong>
              {" "}
              <span style={{ color: "rgba(200,160,80,0.7)", fontFamily: "var(--font-grimoire)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>{item.range}</span>
              {" — "}
              <em style={{ color: "rgba(212,196,160,0.65)" }}>{item.desc}</em>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Formula card ──────────────────────────────────────────────────────────────
function FormulaCard({ formula }: { formula: Formula }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(200,160,80,0.15)",
        borderRadius: "0.75rem",
        padding: "2rem 2.5rem",
        marginBottom: "2.5rem",
      }}
    >
      <SectionTitle>{formula.title}</SectionTitle>
      <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(200,160,80,0.5)", marginBottom: "1.5rem" }}>
        pH: {formula.ph} · Conservante: {formula.preservative}
      </p>
      {formula.categories.map((cat) => (
        <CategoryBlock key={cat.title} cat={cat} />
      ))}
      {formula.note && (
        <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "0.9rem", color: "rgba(220,180,80,0.8)", marginTop: "0.5rem", marginBottom: 0, paddingLeft: "0.75rem", borderLeft: "2px solid rgba(220,180,80,0.4)" }}>
          {formula.note}
        </p>
      )}
    </div>
  );
}

// ── Formula data ──────────────────────────────────────────────────────────────
const formulas: Formula[] = [
  {
    id: "syndet-facial-liquido",
    title: "Syndet Facial Líquido",
    ph: "5.0–5.5",
    preservative: "OBLIGATORIO (base acuosa)",
    note: "Pensar en materia activa (ASM), no en el % del ingrediente: cada tensioactivo trae distinta concentración. Para rostro apuntar a ~10–14% de materia activa total.",
    categories: [
      {
        title: "Fase acuosa",
        range: "~72%",
        items: [
          { name: "Hidrolato o agua destilada", range: "55–72%", desc: "Base líquida. El hidrolato aporta aroma y activos suaves." },
          { name: "Glicerina vegetal", range: "3–5%", desc: "Humectante, evita la tirantez." },
          { name: "Goma xantana", range: "0.3–0.5%", desc: "Espesa a gel. Pre-dispersar en la glicerina." },
          { name: "Inulina", range: "0.5–1%", desc: "Prebiótico — cuida el microbioma de la piel." },
        ],
      },
      {
        title: "Tensioactivos",
        range: "~20% (materia activa ~12%)",
        items: [
          { name: "SCI", range: "6–8%", desc: "Aminoácido suave, principal. Disolver caliente (70–75 °C)." },
          { name: "Glucósido de coco", range: "8–12%", desc: "Muy suave. ⚠️ pH natural alcalino — ajustar al final." },
          { name: "Betaína de coco", range: "5–8%", desc: "Co-tensioactivo suave, da cuerpo." },
        ],
      },
      {
        title: "Finales",
        range: "~1%",
        items: [
          { name: "Ácido cítrico", range: "c.s.", desc: "Ajuste de pH a 5.0–5.5." },
          { name: "Conservante Cosgard", range: "0.5–1%", desc: "Obligatorio en base acuosa. Activo a pH < 6." },
        ],
      },
    ],
  },
  {
    id: "syndet-solido",
    title: "Syndet Sólido",
    ph: "5.0–6.5 (solución 10%)",
    preservative: "No necesario (anhidro)",
    categories: [
      {
        title: "Tensioactivos",
        range: "55–70%",
        items: [
          { name: "SCI", range: "40–60%", desc: "Base principal. Da la espuma cremosa característica." },
          { name: "SLSA", range: "0–15% opcional", desc: "Para más volumen de espuma. Omitir en pieles sensibles." },
          { name: "Betaína de coco", range: "10–15%", desc: "Suaviza, estabiliza, acondiciona." },
        ],
      },
      {
        title: "Emolientes",
        range: "15–25%",
        items: [
          { name: "Manteca karité / cacao / tallow", range: "8–15%", desc: "Nutren y se depositan en piel al enjuagar." },
          { name: "Aceite coco / almendra / ricino", range: "5–10%", desc: "Ligan ingredientes. Suavizan." },
        ],
      },
      {
        title: "Polvos",
        range: "5–15%",
        items: [
          { name: "Almidón de arroz o arrowroot", range: "5–10%", desc: "Textura, absorción, ligante." },
          { name: "Arcilla caolín / verde", range: "0–5%", desc: "Purificante. Caolín para piel sensible." },
          { name: "Plantas liofilizadas", range: "1–5%", desc: "Activos botánicos en polvo." },
        ],
      },
      {
        title: "Activos y otros",
        range: "1–3%",
        items: [
          { name: "Vitamina E", range: "0.5%", desc: "Antioxidante para proteger aceites." },
          { name: "AE", range: "0.5–1.5%", desc: "Aceites esenciales de elección." },
          { name: "Ácido cítrico", range: "0.5–1%", desc: "Ajuste de pH (medido en solución)." },
        ],
      },
    ],
  },
  {
    id: "syndet-facial-solido",
    title: "Syndet Facial Sólido",
    ph: "4.5–5.5",
    preservative: "No necesario (anhidro)",
    categories: [
      {
        title: "Tensioactivos",
        range: "50–60%",
        items: [
          { name: "SCI", range: "35–45%", desc: "Menor concentración que el corporal." },
          { name: "Betaína de coco", range: "15–20%", desc: "Mayor proporción — más suavidad." },
          { name: "Glucósido de coco", range: "10–15%", desc: "Para pieles muy sensibles. Reemplaza parte del SCI." },
        ],
      },
      {
        title: "Emolientes",
        range: "20–30%",
        items: [
          { name: "Tallow infusionado", range: "8–12%", desc: "El diferenciador de El Floema. Alta biocompatibilidad." },
          { name: "Manteca karité", range: "5–8%", desc: "Nutritiva, antiinflamatoria." },
          { name: "Aceite específico por tipo de piel", range: "5–8%", desc: "Jojoba mixta, rosa mosqueta madura, escualano sensible." },
        ],
      },
      {
        title: "Activos",
        range: "3–8%",
        items: [
          { name: "Polvo de planta liofilizada", range: "2–5%", desc: "Activos botánicos específicos." },
          { name: "Arcilla caolín", range: "1–2%", desc: "Solo caolín. Arcillas más fuertes evitar en cara." },
          { name: "Pantenol o alantoína en polvo", range: "0.5–1%", desc: "Calmante y cicatrizante." },
        ],
      },
      {
        title: "Finales",
        range: "1–2%",
        items: [
          { name: "Vitamina E", range: "0.5%", desc: "Antioxidante." },
          { name: "AE", range: "0.3–0.5% máximo", desc: "Dosis baja en facial." },
          { name: "Ácido cítrico", range: "0.5%", desc: "Ajuste de pH." },
        ],
      },
    ],
  },
  {
    id: "shampoo-solido",
    title: "Shampoo Sólido",
    ph: "4.5–5.5",
    preservative: "No necesario (anhidro)",
    categories: [
      {
        title: "Tensioactivos",
        range: "60–75%",
        items: [
          { name: "SCI", range: "45–55%", desc: "Base principal, suave. Calentar a ~75 °C." },
          { name: "SLSA", range: "10–20%", desc: "Da volumen de espuma. Más potencia limpiadora." },
          { name: "Betaína de coco", range: "10–15%", desc: "Suaviza y acondiciona el cabello." },
        ],
      },
      {
        title: "Emolientes",
        range: "12–20%",
        items: [
          { name: "Manteca karité / cacao", range: "8–12%", desc: "Nutritivas, se depositan en el cabello." },
          { name: "Aceite de ricino", range: "3–8%", desc: "Da brillo y suavidad al cabello." },
        ],
      },
      {
        title: "Activos capilares",
        range: "3–8%",
        items: [
          { name: "Proteína hidrolizada trigo / seda / avena", range: "2–3%", desc: "Se deposita en la cutícula. Da brillo y resistencia." },
          { name: "Pantenol en polvo", range: "1–2%", desc: "Hidratante capilar." },
          { name: "Planta liofilizada", range: "1–3%", desc: "Activos botánicos (romero anticaída, ortiga, etc.)." },
        ],
      },
      {
        title: "Finales",
        range: "1–2%",
        items: [
          { name: "AE", range: "1–1.5%", desc: "Aceites esenciales capilares." },
          { name: "Ácido cítrico", range: "0.5%", desc: "Ajuste de pH." },
        ],
      },
    ],
  },
  {
    id: "serum-facial",
    title: "Sérum Facial",
    ph: "5.0–6.0",
    preservative: "OBLIGATORIO (base acuosa)",
    note: "Los activos se agregan en frío (se degradan con el calor). Niacinamida + ácido hialurónico tienen sinergia de hidratación.",
    categories: [
      {
        title: "Base acuosa / gel",
        range: "85–95%",
        items: [
          { name: "Hidrolato o agua destilada", range: "c.s.p. 100%", desc: "Base del sérum." },
          { name: "Ácido hialurónico", range: "0.1–1%", desc: "Humecta en profundidad, efecto plumping." },
          { name: "Glicerina vegetal", range: "3–5%", desc: "Humectante de refuerzo." },
          { name: "Goma xantana", range: "0.2–0.5%", desc: "Da la textura sérum ligera." },
        ],
      },
      {
        title: "Activos",
        range: "2–10%",
        items: [
          { name: "Niacinamida", range: "2–5%", desc: "Regula sebo, unifica el tono, fortalece la barrera." },
          { name: "Pantenol", range: "1–3%", desc: "Calma y repara." },
          { name: "Extracto glicérico (centella, etc.)", range: "2–5%", desc: "Activo botánico específico." },
        ],
      },
      {
        title: "Finales",
        range: "~1%",
        items: [
          { name: "Ácido cítrico", range: "c.s.", desc: "Ajuste de pH a 5.0–6.0." },
          { name: "Conservante Cosgard", range: "0.5–1%", desc: "Obligatorio." },
        ],
      },
    ],
  },
  {
    id: "crema-emulsion-ow",
    title: "Crema / Emulsión O/W",
    ph: "5.0–5.5",
    preservative: "OBLIGATORIO (base acuosa)",
    note: "Calentar ambas fases a ~70 °C, verter la acuosa sobre la oleosa y emulsionar; agregar los activos y el conservante bajo 40 °C.",
    categories: [
      {
        title: "Fase acuosa",
        range: "65–75%",
        items: [
          { name: "Hidrolato o agua destilada", range: "c.s.p. 100%", desc: "Fase continua." },
          { name: "Glicerina vegetal", range: "3–5%", desc: "Humectante." },
        ],
      },
      {
        title: "Fase oleosa",
        range: "18–28%",
        items: [
          { name: "Aceites vegetales por tipo de piel", range: "10–18%", desc: "Jojoba, rosa mosqueta, escualano, etc." },
          { name: "Manteca (karité / cacao)", range: "3–8%", desc: "Nutre, da cuerpo." },
          { name: "Emulsionante O/W (Olivem 1000 / cera lanette)", range: "5–8%", desc: "Une agua y aceite en emulsión estable." },
          { name: "Alcohol cetílico", range: "1–3%", desc: "Co-emulsionante, textura sedosa." },
        ],
      },
      {
        title: "Activos y finales",
        range: "1–5%",
        items: [
          { name: "Vitamina E", range: "0.5%", desc: "Antioxidante para la fase oleosa." },
          { name: "Activos en frío", range: "1–3%", desc: "Niacinamida, extractos, ácido hialurónico." },
          { name: "Conservante Cosgard + ácido cítrico", range: "~1%", desc: "Conservante obligatorio; ajuste de pH." },
        ],
      },
    ],
  },
  {
    id: "gel-facial",
    title: "Gel Facial",
    ph: "5.0–5.5",
    preservative: "OBLIGATORIO (base acuosa)",
    categories: [
      {
        title: "Fase acuosa",
        range: "90–97%",
        items: [
          { name: "Hidrolato o agua destilada", range: "70–80%", desc: "Base del gel." },
          { name: "Glicerina vegetal", range: "10–15%", desc: "Humectante, evita que la goma se apelmace." },
          { name: "Goma xantana / guar", range: "0.5–2%", desc: "Gelificante. Pre-dispersar en la glicerina." },
        ],
      },
      {
        title: "Activos",
        range: "0.5–5%",
        items: [
          { name: "Activos botánicos (agua/glicerina)", range: "0.5–3%", desc: "Aloe, extractos hidroglicerinados." },
          { name: "Niacinamida u otro activo", range: "0–2%", desc: "Opcional, según objetivo." },
        ],
      },
      {
        title: "Finales",
        range: "~1%",
        items: [
          { name: "Conservante Cosgard", range: "0.5–1%", desc: "Obligatorio." },
          { name: "Ácido cítrico", range: "c.s.", desc: "Ajuste de pH." },
        ],
      },
    ],
  },
  {
    id: "tonico-facial",
    title: "Tónico Facial",
    ph: "4.5–5.5",
    preservative: "OBLIGATORIO (base acuosa)",
    note: "Sin alcohol para no resecar. Ideal el hidrolato según tipo de piel: rosa (madura), manzanilla (sensible), triwe/menta (grasa).",
    categories: [
      {
        title: "Base",
        range: "90–97%",
        items: [
          { name: "Hidrolato", range: "80–95%", desc: "Base activa y aromática." },
          { name: "Glicerina vegetal", range: "2–5%", desc: "Humectante suave." },
        ],
      },
      {
        title: "Activos",
        range: "1–8%",
        items: [
          { name: "Extractos hidroglicerinados", range: "2–8%", desc: "Según piel (2–8% se agregan en frío)." },
          { name: "Niacinamida", range: "0–4%", desc: "Opcional, para tono y poros." },
        ],
      },
      {
        title: "Finales",
        range: "~1%",
        items: [
          { name: "Conservante Cosgard", range: "0.5–1%", desc: "Obligatorio." },
          { name: "Ácido cítrico", range: "c.s.", desc: "Ajuste de pH." },
        ],
      },
    ],
  },
  {
    id: "unguento-anhidro",
    title: "Ungüento Anhidro",
    ph: "No aplica (anhidro)",
    preservative: "No necesario — 100% anhidro",
    categories: [
      {
        title: "Base",
        range: "70–85%",
        items: [
          { name: "Tallow purificado o infusionado", range: "50–75%", desc: "Base principal biomimética." },
          { name: "Aceite de maceración / oleato", range: "10–20%", desc: "Vehículo de activos botánicos." },
        ],
      },
      {
        title: "Estructurantes",
        range: "5–15%",
        items: [
          { name: "Ácido esteárico vegetal", range: "3–8%", desc: "Da textura cremosa sin solidificar como cera." },
          { name: "Cera de abeja", range: "0–8% opcional", desc: "Solo si se quiere más firmeza." },
        ],
      },
      {
        title: "Activos",
        range: "1–5%",
        items: [
          { name: "Vitamina E", range: "0.5–1%", desc: "Antioxidante esencial en bases oleosas." },
          { name: "AE", range: "0.5–2%", desc: "Aceites esenciales terapéuticos." },
          { name: "Activos lipófilos específicos", range: "1–3%", desc: "Según objetivo de la fórmula." },
        ],
      },
    ],
  },
  {
    id: "balsamo-labial",
    title: "Bálsamo Labial",
    ph: "No aplica (anhidro)",
    preservative: "No necesario — 100% anhidro",
    note: "La piel del labio tiene solo 3–5 capas celulares (vs 16 del rostro): el AE no debe superar el 0.5%, y es un producto que se reaplica mucho.",
    categories: [
      {
        title: "Base oleosa",
        range: "100%",
        items: [
          { name: "Cera de abeja", range: "20–30%", desc: "Da la dureza de la barra." },
          { name: "Mantecas (cacao / karité)", range: "20–30%", desc: "Nutren y protegen." },
          { name: "Aceites vegetales", range: "30–40%", desc: "Suavidad y deslizamiento." },
          { name: "Vitamina E", range: "0.2–1%", desc: "Antioxidante." },
          { name: "AE / aroma", range: "0–0.5% máximo", desc: "Dosis muy baja en labios." },
        ],
      },
    ],
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Formulas() {
  return (
    <div className="parchment-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <GrainOverlay />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(64px,10vh,120px)" }}>
        <BackButton label="← Volver" />

        {/* Page header */}
        <div style={{ marginTop: "2.5rem", marginBottom: "3rem" }}>
          <Label>El Grimorio · Fórmulas</Label>
          <PageTitle>Fórmulas</PageTitle>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "clamp(1rem,1.6vw,1.18rem)",
              color: "#d4c4a0",
              marginBottom: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            Proporciones y rangos — la arquitectura de cada producto
          </p>
          <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.35),transparent)" }} />
        </div>

        {/* Formula cards */}
        {formulas.map((formula) => (
          <FormulaCard key={formula.id} formula={formula} />
        ))}

        <Divider />
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <BackButton label="← Volver" />
        </div>
      </div>
    </div>
  );
}
