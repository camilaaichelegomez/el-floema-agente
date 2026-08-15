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
    id: "syndet-facial-triwe",
    name: "Syndet Facial Líquido de Triwe",
    tag: "Limpieza facial · Rinse-off",
    desc: "Gel limpiador facial sin sulfatos, pH piel, con hidrolato de triwe (laurel nativo chileno). Limpia sin dejar la cara tirante.",
    batch: "Lote 100 g",
    ph: "pH 5.0–5.5",
    warning:
      "Uso de enjuague. Hacer prueba de parche 24 h antes de usar o vender. Usar mascarilla al pesar el SCI en polvo (irrita las vías respiratorias).",
    ingredients: [
      { name: "Agua destilada (fase A1)", pct: "18%", grams: "18 g" },
      { name: "SCI (Sodium Cocoyl Isethionate)", pct: "7%", grams: "7 g" },
      { name: "Hidrolato de triwe (fase A2)", pct: "54.7%", grams: "54.7 g" },
      { name: "Glicerina vegetal", pct: "4%", grams: "4 g" },
      { name: "Goma xantana", pct: "0.5%", grams: "0.5 g" },
      { name: "Inulina", pct: "1%", grams: "1 g" },
      { name: "Glucósido de coco", pct: "8%", grams: "8 g" },
      { name: "Betaína de coco", pct: "6%", grams: "6 g" },
      { name: "Ácido cítrico (solución)", pct: "c.s.", grams: "hasta pH 5.0–5.5" },
      { name: "Conservante Cosgard", pct: "0.8%", grams: "0.8 g" },
    ],
    steps: [
      "Fase A1: calienta el agua destilada a 70–75 °C, agrega el SCI y revuelve con paciencia hasta obtener un líquido transparente.",
      "Fase A2: mezcla la goma xantana con la glicerina en seco; incorpora el hidrolato de triwe (frío) y la inulina, y revuelve hasta lograr un gel parejo.",
      "Une la fase A1 ya entibiada (menos de 40 °C) con el gel de la fase A2.",
      "Agrega el glucósido y la betaína de coco revolviendo despacio, sin batir, para no generar espuma.",
      "Ajusta el pH a 5.0–5.5 con la solución de ácido cítrico (el glucósido viene alcalino, este paso es clave).",
      "Agrega el conservante Cosgard, mezcla y envasa. Queda un gel translúcido de pH piel.",
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
        {RECIPES.length === 0 ? (
          <div
            style={{
              border: "1px solid rgba(200,160,80,0.18)",
              borderRadius: "1rem",
              padding: "clamp(2.5rem,6vh,4rem) 2rem",
              textAlign: "center",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-grimoire)",
                fontSize: "0.62rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(200,160,80,0.5)",
                marginBottom: "0.9rem",
              }}
            >
              El grimorio en blanco
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontStyle: "italic",
                fontSize: "clamp(1rem,1.8vw,1.15rem)",
                color: "rgba(212,196,160,0.6)",
                lineHeight: 1.7,
                maxWidth: 460,
                margin: "0 auto",
              }}
            >
              Todavía no hay recetas publicadas. Iremos sumando aquí las fórmulas
              a medida que las vayamos creando y probando.
            </p>
          </div>
        ) : (
          RECIPES.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        )}
      </div>
    </div>
  );
}
