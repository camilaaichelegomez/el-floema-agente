import { BackButton } from "@/components/BackButton";

// ── Grain overlay ─────────────────────────────────────────────────────────────
function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-r">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-r)" />
    </svg>
  );
}

// ── Typography helpers ─────────────────────────────────────────────────────────
function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.8rem,4vw,3rem)", color: "#c8a050", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem", textShadow: "0 0 60px rgba(200,160,80,0.2)" }}>
      {children}
    </h1>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", display: "block", marginBottom: "0.6rem" }}>
      {children}
    </span>
  );
}
function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.22),transparent)", margin: "1.75rem 0" }} />;
}

// ── Data types ────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  pct: string;
  grams: string;
}
interface Recipe {
  id: string;
  name: string;
  tag: string;
  desc: string;
  batch: string;
  ph: string;
  warning?: string;
  ingredients: Ingredient[];
  steps: string[];
}

// ── Recipe data ────────────────────────────────────────────────────────────────
const RECIPES: Recipe[] = [
  {
    id: "matico",
    name: "Syndet Facial — Matico",
    tag: "Syndet facial · Piel reactiva",
    desc: "Para piel reactiva, enrojecida o con tendencia atópica",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 5.0–5.5",
    ingredients: [
      { name: "SCI", pct: "40%", grams: "40 g" },
      { name: "Betaína de coco", pct: "18%", grams: "18 g" },
      { name: "Glucósido de coco", pct: "12%", grams: "12 g" },
      { name: "Tallow infusionado matico", pct: "10%", grams: "10 g" },
      { name: "Manteca karité", pct: "8%", grams: "8 g" },
      { name: "Avena coloidal en polvo", pct: "4%", grams: "4 g" },
      { name: "Caolín", pct: "2%", grams: "2 g" },
      { name: "Pantenol en polvo", pct: "1%", grams: "1 g" },
      { name: "Vitamina E", pct: "0.5%", grams: "0.5 g" },
      { name: "AE manzanilla", pct: "0.3%", grams: "0.3 g" },
      { name: "AE lavanda", pct: "0.2%", grams: "0.2 g" },
      { name: "Ácido cítrico", pct: "c/s", grams: "~0.5–1 g" },
    ],
    steps: [
      "Funde tallow + karité a 65 °C en baño maría.",
      "Agrega SCI y betaína — mezcla hasta homogéneo.",
      "A 55 °C agrega glucósido de coco.",
      "A 50 °C agrega avena, caolín y pantenol tamizados.",
      "A 42 °C agrega vitamina E.",
      "A 38 °C agrega AE.",
      "Disuelve ácido cítrico en 2 g de glicerina — agrega y mide pH.",
      "Moldea rápido — la masa endurece pronto.",
      "Desmolda a las 48 horas — cura 3-4 semanas.",
    ],
  },
  {
    id: "arrayan",
    name: "Shampoo Sólido — Arrayán",
    tag: "Shampoo sólido · Cabello normal",
    desc: "Limpieza suave con brillo y suavidad",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 4.5–5.0 (solución 10%)",
    ingredients: [
      { name: "SCI", pct: "45%", grams: "45 g" },
      { name: "SLSA", pct: "15%", grams: "15 g" },
      { name: "Betaína de coco", pct: "13%", grams: "13 g" },
      { name: "Manteca karité", pct: "10%", grams: "10 g" },
      { name: "Aceite de ricino", pct: "5%", grams: "5 g" },
      { name: "Proteína hidrolizada trigo", pct: "3%", grams: "3 g" },
      { name: "Almidón de arroz", pct: "5%", grams: "5 g" },
      { name: "Arrayán liofilizado", pct: "2%", grams: "2 g" },
      { name: "AE cedro", pct: "0.8%", grams: "0.8 g" },
      { name: "AE palo de ho", pct: "0.5%", grams: "0.5 g" },
      { name: "AE ciprés", pct: "0.2%", grams: "0.2 g" },
      { name: "Ácido cítrico", pct: "c/s", grams: "~0.5 g" },
    ],
    steps: [
      "Funde karité + ricino a 70 °C.",
      "Agrega SCI y betaína — mezcla bien.",
      "A 60 °C agrega SLSA en polvo poco a poco.",
      "A 52 °C agrega proteína y almidón tamizados.",
      "A 48 °C agrega arrayán liofilizado.",
      "A 42 °C agrega vitamina E.",
      "A 38 °C agrega AE.",
      "Mide pH — ajusta con ácido cítrico en glicerina.",
      "Moldea — desmolda a las 48 horas.",
      "Cura 3-4 semanas mínimo.",
    ],
  },
  {
    id: "pitra",
    name: "Syndet Facial — Pitra",
    tag: "Syndet facial · Piel mixta y grasa",
    desc: "Limpieza profunda suave, poros refinados",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 4.5–5.0",
    ingredients: [
      { name: "SCI", pct: "45%", grams: "45 g" },
      { name: "Betaína de coco", pct: "15%", grams: "15 g" },
      { name: "Glucósido de coco", pct: "10%", grams: "10 g" },
      { name: "Tallow infusionado pitra", pct: "8%", grams: "8 g" },
      { name: "Aceite de jojoba", pct: "6%", grams: "6 g" },
      { name: "Arcilla verde", pct: "3%", grams: "3 g" },
      { name: "Almidón de arroz", pct: "5%", grams: "5 g" },
      { name: "Niacinamida en polvo", pct: "2%", grams: "2 g" },
      { name: "Pitra liofilizada", pct: "2%", grams: "2 g" },
      { name: "Vitamina E", pct: "0.5%", grams: "0.5 g" },
      { name: "AE árbol de té", pct: "0.3%", grams: "0.3 g" },
      { name: "AE ciprés", pct: "0.2%", grams: "0.2 g" },
      { name: "Ácido cítrico", pct: "c/s", grams: "~0.5 g" },
    ],
    steps: [
      "Funde tallow + jojoba a 65 °C.",
      "Agrega SCI y betaína — mezcla hasta homogéneo.",
      "A 55 °C agrega glucósido de coco.",
      "A 50 °C agrega polvos tamizados juntos: arcilla, almidón, niacinamida, pitra.",
      "A 40 °C agrega vitamina E.",
      "A 38 °C agrega AE.",
      "Ajusta pH con ácido cítrico en glicerina.",
      "Moldea — desmolda 48 horas — cura 3-4 semanas.",
    ],
  },
  {
    id: "maqui",
    name: "Syndet Facial — Maqui",
    tag: "Syndet facial · Piel madura",
    desc: "Antioxidante, regenerador, luminosidad",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 5.0–5.5",
    warning: "⚠️ Rosa mosqueta y maqui agregar siempre bajo 38 °C — termosensibles.",
    ingredients: [
      { name: "SCI", pct: "38%", grams: "38 g" },
      { name: "Betaína de coco", pct: "18%", grams: "18 g" },
      { name: "Glucósido de coco", pct: "12%", grams: "12 g" },
      { name: "Tallow infusionado maqui", pct: "10%", grams: "10 g" },
      { name: "Aceite rosa mosqueta", pct: "5%", grams: "5 g" },
      { name: "Escualano", pct: "4%", grams: "4 g" },
      { name: "Manteca karité", pct: "5%", grams: "5 g" },
      { name: "Proteína seda en polvo", pct: "2%", grams: "2 g" },
      { name: "Maqui liofilizado", pct: "2%", grams: "2 g" },
      { name: "Vitamina E", pct: "0.5%", grams: "0.5 g" },
      { name: "AE incienso", pct: "0.3%", grams: "0.3 g" },
      { name: "AE neroli", pct: "0.2%", grams: "0.2 g" },
      { name: "Ácido cítrico", pct: "c/s", grams: "~0.5 g" },
    ],
    steps: [
      "Funde tallow + karité + escualano a 63 °C.",
      "Agrega SCI y betaína — mezcla.",
      "A 55 °C agrega glucósido.",
      "A 48 °C agrega proteína de seda tamizada.",
      "A 40 °C agrega vitamina E.",
      "A 37 °C agrega rosa mosqueta, maqui liofilizado y AE.",
      "Ajusta pH.",
      "Moldea — desmolda 48 horas — cura 4 semanas.",
    ],
  },
  {
    id: "laurel",
    name: "Champú Líquido — Laurel",
    tag: "Champú líquido · Nutritivo",
    desc: "Con hidrolato de laurel y extracto de matico",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 5.0–5.5",
    warning: "⚠️ Conservante OBLIGATORIO — contiene agua.",
    ingredients: [
      { name: "Hidrolato de laurel", pct: "45%", grams: "45 g" },
      { name: "Betaína de coco", pct: "22%", grams: "22 g" },
      { name: "Glucósido de coco", pct: "13%", grams: "13 g" },
      { name: "Glicerina vegetal", pct: "5%", grams: "5 g" },
      { name: "Extracto glicérico matico", pct: "5%", grams: "5 g" },
      { name: "Proteína hidrolizada trigo", pct: "3%", grams: "3 g" },
      { name: "Pantenol", pct: "2%", grams: "2 g" },
      { name: "Aceite de argán", pct: "2%", grams: "2 g" },
      { name: "Polisorbato 20", pct: "2%", grams: "2 g" },
      { name: "AE cedro", pct: "0.5%", grams: "0.5 g" },
      { name: "AE palo de ho", pct: "0.3%", grams: "0.3 g" },
      { name: "Vitamina E", pct: "0.2%", grams: "0.2 g" },
      { name: "Cosgard", pct: "0.5%", grams: "0.5 g" },
      { name: "Ácido cítrico 10%", pct: "c/s", grams: "hasta pH 5.0–5.5" },
    ],
    steps: [
      "Mezcla hidrolato + glicerina + extracto glicérico a temperatura ambiente.",
      "Agrega betaína de coco — mezcla suave sin espumar.",
      "Agrega glucósido de coco — mezcla suave.",
      "Agrega proteína y pantenol — disuelven fácil.",
      "Mezcla aceite de argán + polisorbato 20 aparte hasta transparente — luego incorpora.",
      "Agrega AE a la mezcla argán+polisorbato antes de incorporar.",
      "Agrega vitamina E.",
      "Agrega Cosgard.",
      "Ajusta pH con ácido cítrico en solución gota a gota — mide constantemente.",
      "Envasa en frasco con bomba o dosificador.",
    ],
  },
  {
    id: "chilco",
    name: "Limpiador Líquido — Chilco",
    tag: "Limpiador líquido · Piel sensible",
    desc: "Ultra suave, sin enjuague o con enjuague",
    batch: "Lote: 100 g",
    ph: "pH objetivo: 4.8–5.2",
    warning: "⚠️ Conservante OBLIGATORIO — contiene agua.",
    ingredients: [
      { name: "Hidrolato de manzanilla", pct: "58%", grams: "58 g" },
      { name: "Betaína de coco", pct: "20%", grams: "20 g" },
      { name: "Glucósido de coco", pct: "10%", grams: "10 g" },
      { name: "Glicerina vegetal", pct: "5%", grams: "5 g" },
      { name: "Extracto glicérico chilco", pct: "3%", grams: "3 g" },
      { name: "Alantoína", pct: "0.5%", grams: "0.5 g" },
      { name: "Pantenol", pct: "1%", grams: "1 g" },
      { name: "AE manzanilla", pct: "0.1%", grams: "0.1 g" },
      { name: "Vitamina E", pct: "0.2%", grams: "0.2 g" },
      { name: "Cosgard", pct: "0.5%", grams: "0.5 g" },
      { name: "Ácido cítrico 10%", pct: "c/s", grams: "hasta pH 4.8–5.2" },
    ],
    steps: [
      "Disuelve alantoína en el hidrolato tibio (40 °C) — mezcla hasta transparente.",
      "Enfría a temperatura ambiente.",
      "Agrega glicerina + extracto de chilco.",
      "Agrega betaína de coco y glucósido — mezcla muy suave.",
      "Agrega pantenol y vitamina E.",
      "Agrega Cosgard.",
      "Mezcla AE con 0.1 g de polisorbato 20 aparte — incorpora.",
      "Ajusta pH con ácido cítrico gota a gota.",
      "Envasa en frasco con bomba o dosificador de 50 ml.",
    ],
  },
];

// ── Ingredient table ───────────────────────────────────────────────────────────
function IngredientTable({ ingredients }: { ingredients: Ingredient[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "0.5rem" }}>
      <thead>
        <tr style={{ background: "rgba(200,160,80,0.08)" }}>
          {["Ingrediente", "%", "Gramos"].map((h) => (
            <th
              key={h}
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#c8a050",
                padding: "0.6rem 0.75rem",
                textAlign: h === "Ingrediente" ? "left" : "right",
                border: "1px solid rgba(200,160,80,0.1)",
                fontWeight: 600,
              }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ing, i) => (
          <tr
            key={ing.name}
            style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}
          >
            <td style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.88rem,1.4vw,1rem)", color: "#d4c4a0", padding: "0.5rem 0.75rem", border: "1px solid rgba(200,160,80,0.07)" }}>
              {ing.name}
            </td>
            <td style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.72rem", color: "rgba(200,160,80,0.7)", padding: "0.5rem 0.75rem", textAlign: "right", border: "1px solid rgba(200,160,80,0.07)", whiteSpace: "nowrap" }}>
              {ing.pct}
            </td>
            <td style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.72rem", color: "rgba(212,196,160,0.55)", padding: "0.5rem 0.75rem", textAlign: "right", border: "1px solid rgba(200,160,80,0.07)", whiteSpace: "nowrap" }}>
              {ing.grams}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Recipe card ────────────────────────────────────────────────────────────────
function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article
      style={{
        border: "1px solid rgba(200,160,80,0.18)",
        borderRadius: "1rem",
        overflow: "hidden",
        marginBottom: "3rem",
      }}
    >
      {/* Header band */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f1a0f 0%, #1a1220 100%)",
          padding: "2rem 2.5rem",
          borderBottom: "1px solid rgba(200,160,80,0.12)",
        }}
      >
        {/* Tag */}
        <span
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.52rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(154,106,170,0.85)",
            display: "block",
            marginBottom: "0.6rem",
          }}
        >
          {recipe.tag}
        </span>

        {/* Name */}
        <h2
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "clamp(1.1rem,2.5vw,1.6rem)",
            color: "#c8a050",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            margin: "0 0 0.5rem",
            textShadow: "0 0 40px rgba(200,160,80,0.2)",
          }}
        >
          {recipe.name}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
            color: "rgba(212,196,160,0.6)",
            margin: "0 0 1rem",
          }}
        >
          {recipe.desc}
        </p>

        {/* Batch + pH */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
          <span
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(200,160,80,0.55)",
            }}
          >
            {recipe.batch}
          </span>
          <span
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(200,160,80,0.55)",
            }}
          >
            {recipe.ph}
          </span>
        </div>

        {/* Warning */}
        {recipe.warning && (
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "rgba(220,180,80,0.85)",
              marginTop: "1rem",
              marginBottom: 0,
              paddingLeft: "0.75rem",
              borderLeft: "2px solid rgba(220,180,80,0.4)",
            }}
          >
            {recipe.warning}
          </p>
        )}
      </div>

      {/* Body */}
      <div style={{ background: "rgba(255,255,255,0.02)", padding: "2rem 2.5rem" }}>
        {/* Ingredients */}
        <h3
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,160,80,0.6)",
            marginBottom: "1rem",
          }}
        >
          Ingredientes
        </h3>
        <IngredientTable ingredients={recipe.ingredients} />

        <Divider />

        {/* Process */}
        <h3
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.62rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "rgba(200,160,80,0.6)",
            marginBottom: "1.25rem",
          }}
        >
          Proceso
        </h3>

        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {recipe.steps.map((step, i) => (
            <li
              key={i}
              style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
            >
              {/* Step number */}
              <span
                style={{
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "1px solid rgba(200,160,80,0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-grimoire)",
                  fontSize: "0.58rem",
                  color: "#c8a050",
                  marginTop: "0.18rem",
                }}
              >
                {i + 1}
              </span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
                  lineHeight: 1.65,
                  color: "#d4c4a0",
                  margin: 0,
                }}
              >
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function RecetasPage() {
  return (
    <div className="parchment-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <GrainOverlay />

      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(64px,10vh,120px)",
        }}
      >
        <BackButton label="← Volver al Grimorio" />

        {/* Page header */}
        <div style={{ marginBottom: "clamp(48px,8vh,80px)" }}>
          <Label>El Grimorio · Recetas</Label>
          <PageTitle>Recetas</PageTitle>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "clamp(1rem,1.8vw,1.18rem)",
              color: "rgba(212,196,160,0.5)",
              marginTop: "0.5rem",
              marginBottom: 0,
            }}
          >
            Fórmulas completas listas para producir
          </p>
          <div
            style={{
              height: 1,
              background: "linear-gradient(to right,rgba(200,160,80,0.35),transparent)",
              marginTop: "1.5rem",
              maxWidth: 320,
            }}
          />
        </div>

        {/* Recipe cards */}
        {RECIPES.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
