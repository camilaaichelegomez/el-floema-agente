"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";

function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-ing">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-ing)" />
    </svg>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: "12px", ...style }}>
      {children}
    </p>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.68rem", color: "rgba(200,160,80,0.55)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: "8px", marginTop: "20px" }}>
      {children}
    </p>
  );
}

function IngTitle({ name, italic }: { name: string; italic?: string }) {
  return (
    <div style={{ marginTop: "28px", marginBottom: "12px", paddingBottom: "8px", borderBottom: "1px solid rgba(200,160,80,0.18)" }}>
      <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "#c8a050", letterSpacing: "0.1em", margin: 0 }}>{name}</h3>
      {italic && (
        <span style={{ fontFamily: "var(--font-body), serif", fontStyle: "italic", fontSize: "0.82rem", color: "rgba(212,196,160,0.55)", display: "block", marginTop: "3px" }}>
          {italic}
        </span>
      )}
    </div>
  );
}

function Check({ children, type = "ok" }: { children: React.ReactNode; type?: "ok" | "no" | "warn" | "partial" }) {
  const symbol = type === "ok" ? "✓" : type === "no" ? "✗" : type === "warn" ? "⚠" : "◐";
  const color = type === "ok" ? "#5a7a3a" : type === "no" ? "rgba(184,115,51,0.9)" : type === "warn" ? "rgba(184,115,51,0.9)" : "#c8a050";
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}>
      <span style={{ color, fontSize: "0.8rem", flexShrink: 0, marginTop: "2px" }}>{symbol}</span>
      <span style={{ fontSize: "0.9rem", color: "#d4c4a0", lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(200,160,80,0.07)", border: "1px solid rgba(200,160,80,0.22)", borderRadius: "6px", padding: "12px 16px", marginBottom: "14px", marginTop: "8px" }}>
      <span style={{ fontSize: "0.88rem", color: "#d4c4a0", lineHeight: 1.72, display: "block" }}>{children}</span>
    </div>
  );
}

function WarnBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.28)", borderRadius: "6px", padding: "12px 16px", marginBottom: "14px", marginTop: "8px" }}>
      <span style={{ fontSize: "0.88rem", color: "#d4c4a0", lineHeight: 1.72, display: "block" }}>{children}</span>
    </div>
  );
}

function GreenBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(90,122,58,0.09)", border: "1px solid rgba(90,122,58,0.28)", borderRadius: "6px", padding: "12px 16px", marginBottom: "14px", marginTop: "8px" }}>
      <span style={{ fontSize: "0.88rem", color: "#d4c4a0", lineHeight: 1.72, display: "block" }}>{children}</span>
    </div>
  );
}

function LineDivider() {
  return <div style={{ height: 1, background: "rgba(200,160,80,0.12)", margin: "24px 0" }} />;
}

interface AccordionItemProps {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
function AccordionItem({ title, open, onToggle, children }: AccordionItemProps) {
  return (
    <div style={{
      border: `1px solid ${open ? "rgba(200,160,80,0.3)" : "rgba(200,160,80,0.1)"}`,
      borderRadius: "0.5rem",
      marginBottom: "0.5rem",
      background: open ? "rgba(200,160,80,0.04)" : "transparent",
      transition: "border-color 0.3s, background 0.3s",
      overflow: "hidden",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.25rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          gap: "1rem",
        }}
      >
        <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8a050" }}>
          {title}
        </span>
        <span style={{ color: "rgba(200,160,80,0.6)", fontSize: "0.9rem", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }}>
          →
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ padding: "0 1.25rem 1.5rem" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS = ["bases", "aceites", "activos", "arcillas", "tensioactivos", "esenciales", "preparaciones", "faltantes"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function Ingredientes() {
  const [open, setOpen] = useState<SectionId | null>(null);
  const toggle = (id: SectionId) => setOpen((prev) => (prev === id ? null : id));

  return (
    <div className="parchment-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <GrainOverlay />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(64px,10vh,120px)" }}>
        <BackButton label="← Volver" />

        {/* Header */}
        <div style={{ marginTop: "2.5rem", marginBottom: "3rem" }}>
          <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(200,160,80,0.45)", display: "block", marginBottom: "0.6rem" }}>
            El Grimorio · Ingredientes
          </span>
          <h1 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(1.8rem,4vw,3rem)", color: "#c8a050", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem", textShadow: "0 0 60px rgba(200,160,80,0.2)" }}>
            Ingredientes
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.18rem)", color: "#d4c4a0", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            La materia prima de la magia — composición, función y uso seguro
          </p>
          <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.35),transparent)" }} />
        </div>

        {/* ── 1. Bases y Emolientes ── */}
        <AccordionItem id="bases" title="Bases y Emolientes" open={open === "bases"} onToggle={() => toggle("bases")}>

          <IngTitle name="Tallow — Sebo Bovino Purificado" italic="El ingrediente estrella de El Floema" />
          <P>Grasa bovina purificada obtenida del tejido adiposo perirrenal — la grasa que rodea los riñones del animal, considerada la más pura y de mejor calidad. No es la grasa de cocina ni el sebo industrial. Es grasa purificada por fusión repetida, colado y decantación hasta obtener un producto blanco, sin olor, estable.</P>

          <SubLabel>Composición</SubLabel>
          <Check>Ácido oleico (C18:1 omega-9): ~45%</Check>
          <Check>Ácido palmítico (C16:0): ~27%</Check>
          <Check>Ácido esteárico (C18:0): ~20%</Check>
          <Check>Ácido palmitoleico (C16:1 omega-7): ~3%</Check>
          <Check>Colesterol: ~0.3%</Check>
          <Check>Vitaminas liposolubles A, D, E, K: trazas</Check>

          <SubLabel>Por qué es biomimético</SubLabel>
          <P>La barrera lipídica del estrato córneo humano tiene una composición de ácidos grasos muy similar — dominada por ácido oleico, palmítico y esteárico. El tallow "habla el idioma de la piel". Por eso penetra mejor que la mayoría de aceites vegetales y los activos que vehiculiza alcanzan capas más profundas.</P>
          <InfoBox>El ácido palmitoleico es el ácido graso antimicrobiano natural del sebo humano — escaso en aceites vegetales. Su presencia en el tallow explica parte de su actividad antimicrobiana natural.</InfoBox>

          <SubLabel>Función en formulación</SubLabel>
          <Check>Base principal de ungüentos y bálsamos</Check>
          <Check>Vehículo de activos botánicos por maceración</Check>
          <Check>Emoliente oclusivo de alta biocompatibilidad</Check>
          <Check>Estructurante — sólido a temperatura ambiente, funde al contacto con la piel</Check>
          <Check>No necesita conservante — sin agua</Check>

          <SubLabel>Parámetros técnicos</SubLabel>
          <P>Punto de fusión: 40–45°C · Temperatura de trabajo: 40–65°C según proceso</P>

          <SubLabel>Calidad — pasturado vs feedlot</SubLabel>
          <P>El tallow de animales pasturados tiene mayor concentración de ácidos grasos omega-3, CLA (ácido linoleico conjugado) y vitaminas liposolubles. El feedlot da tallow más blanco pero menos nutricionalmente rico. Para El Floema — siempre pasturado local cuando sea posible.</P>

          <WarnBox>⚠ No apto para veganos. Siempre especificar origen animal en el etiquetado. Conservar en lugar fresco y oscuro — el calor prolongado oxida los ácidos grasos.</WarnBox>

          <LineDivider />

          <IngTitle name="Tallow Infusionado — Matico + Milenrama" italic="Macerado cicatrizante y antiinflamatorio · 500g disponibles" />
          <P>Base de tallow con activos transferidos de matico (<em>Piper aduncum</em>) y milenrama (<em>Achillea millefolium</em>) por maceración a 40–45°C durante 6–8 horas.</P>

          <SubLabel>Activos transferidos</SubLabel>
          <P><strong style={{ color: "#c8a050" }}>Del matico:</strong> flavonoides (artemetina), aceite esencial (dilapiol, beta-cariofileno), triterpenos cicatrizantes.</P>
          <P><strong style={{ color: "#c8a050" }}>De la milenrama:</strong> azuleno precursor (matricina → chamazuleno en extracción caliente), flavonoides (luteolina, apigenina), alcamidas.</P>

          <GreenBox>Uso: Base directa para ungüento cicatrizante, bálsamo reparador. El producto más diferenciado de El Floema.</GreenBox>

          <LineDivider />

          <IngTitle name="Tallow Infusionado — Pitra" italic="Macerado antimicrobiano y astringente · 500g disponibles" />
          <P>Base de tallow con activos de pitra (<em>Myrceugenia exsucca</em>) transferidos por maceración.</P>

          <SubLabel>Activos transferidos</SubLabel>
          <P>Taninos del grupo miriceol, flavonoides, terpenos lipófilos antimicrobianos.</P>

          <GreenBox>Uso: Ungüento para piel con tendencia a infecciones fúngicas o bacterianas. Base para productos para piel mixta y grasa.</GreenBox>

          <LineDivider />

          <IngTitle name="Cera de Abeja Blanca en Perlas" />
          <P>Cera secretada por las glándulas cereras de las abejas obreras (<em>Apis mellifera</em>). La cera blanca es la misma cera amarilla decolorada por procesos físicos. La decoloración no afecta sus propiedades técnicas pero da un color más neutro en el producto final.</P>

          <SubLabel>Composición</SubLabel>
          <P>~71% ésteres de ácidos grasos de cadena larga · ~15% hidrocarburos (principalmente hentriacontano) · ~14% ácidos grasos libres</P>

          <SubLabel>Función en formulación</SubLabel>
          <Check>Estructurante principal de bálsamos y barras</Check>
          <Check>Oclusivo — forma película sobre la piel reduciendo TEWL</Check>
          <Check>Estabilizador de emulsiones W/O</Check>
          <Check>Da brillo y textura sedosa</Check>

          <SubLabel>Concentraciones de uso</SubLabel>
          <Check>4–6% → bálsamo semisólido suave</Check>
          <Check>8–12% → bálsamo firme clásico</Check>
          <Check>15–20% → barra labial</Check>
          <Check>25–30% → barra sólida muy dura</Check>

          <P style={{ marginTop: "10px" }}>Punto de fusión: 62–65°C</P>
          <InfoBox>La cera de abeja natural contiene propóleos en trazas — con leve actividad antimicrobiana y antioxidante. La cera blanca pierde algo de esto en el blanqueamiento.</InfoBox>

          <LineDivider />

          <IngTitle name="Cera de Soja BPF" italic="1 kg disponible" />
          <P>Cera vegetal obtenida por hidrogenación del aceite de soja. BPF indica cera de calidad cosmética y para velas.</P>

          <SubLabel>Función</SubLabel>
          <Check>Base de velas de soja — arde limpio sin petroquímicos</Check>
          <Check>Da velas opacas con buena retención de aroma</Check>
          <Check type="warn">Demasiado blanda para velas sin recipiente sola — necesita ácido esteárico o carnauba para dar estructura</Check>

          <P>Punto de fusión: 50–55°C</P>
          <InfoBox>Para velas es superior a la cera de abeja (arde más limpio). Para cosméticos la cera de abeja es mejor por sus propiedades biológicas y mayor punto de fusión.</InfoBox>

          <LineDivider />

          <IngTitle name="Ácido Esteárico Vegetal" />
          <P>Ácido graso saturado de 18 carbonos (C18:0) de origen vegetal — generalmente palma o coco. A pesar de llamarse "ácido" no es corrosivo ni irritante — es un ácido graso sólido completamente seguro.</P>

          <WarnBox>⚠ No confundir con: alcohol estearílico (también sólido, diferente función) ni con manteca de karité (también rica en esteárico pero con muchos otros compuestos).</WarnBox>

          <SubLabel>Función en formulación</SubLabel>
          <Check>Da textura cremosa y cuerpo sin la sensación cerosa de la cera de abeja</Check>
          <Check>Estructurante de emulsiones O/W — reacciona con NaOH o KOH para formar jabón in situ</Check>
          <Check>Opacificante — da color blanco brillante a cremas</Check>
          <Check>Reduce la sensación grasa de los aceites</Check>

          <SubLabel>Concentraciones</SubLabel>
          <Check>3–5% en ungüentos → da cuerpo cremoso</Check>
          <Check>5–8% en cremas O/W → estructura y opacidad</Check>
          <Check>2–3% en syndets → ayuda a ligar ingredientes</Check>

          <P>Punto de fusión: 69–70°C</P>
          <GreenBox>En El Floema: ingrediente clave de la crema facial matificante — a 7% da la textura de "crema" sin necesitar agua ni emulsificante.</GreenBox>

        </AccordionItem>

        {/* ── 2. Aceites y Grasas Vegetales ── */}
        <AccordionItem id="aceites" title="Aceites y Grasas Vegetales" open={open === "aceites"} onToggle={() => toggle("aceites")}>

          <IngTitle name="Aceite de Ricino" />
          <P>Aceite extraído por presión en frío de las semillas de <em>Ricinus communis</em>. Es único en el mundo de los aceites — ~90% de su composición es ácido ricinoleico, un ácido graso hidroxilado que no existe en ningún otro aceite vegetal en esa proporción.</P>

          <SubLabel>Función en formulación</SubLabel>
          <Check>Espesante natural de aceites — aumenta viscosidad</Check>
          <Check>Humectante por su grupo hidroxilo</Check>
          <Check>Da brillo intenso — imprescindible en labiales</Check>
          <Check>Mejora adhesión en productos de color</Check>
          <Check>En syndets ayuda a dar cuerpo y suavidad</Check>

          <SubLabel>Concentraciones</SubLabel>
          <Check>5–10% en bálsamos → aporta cuerpo y humectación</Check>
          <Check>10–15% en labiales → brillo y humectación labial</Check>
          <Check>5–8% en syndets → suavidad y cuerpo</Check>

          <WarnBox>⚠ Más del 20% da sensación pegajosa indeseable. Las semillas son tóxicas (contienen ricina). El aceite refinado es completamente seguro — la ricina no pasa al aceite.</WarnBox>

          <LineDivider />

          <IngTitle name="Aceite de Coco Fraccionado" />
          <P>Fracción líquida del aceite de coco obtenida por fraccionamiento — se separan los ácidos grasos de cadena media (principalmente caprílico C8 y cáprico C10) que permanecen líquidos a temperatura ambiente.</P>

          <SubLabel>Diferencia con aceite de coco entero</SubLabel>
          <P>El aceite de coco entero solidifica por su alto contenido en láurico (C12). El fraccionado siempre es líquido, más estable, sin olor y con mejor sensación en piel.</P>

          <SubLabel>Función</SubLabel>
          <Check>Emoliente ligero de rápida absorción</Check>
          <Check>Solvente para aceites esenciales</Check>
          <Check>Vehículo para activos lipófilos</Check>
          <Check>Muy estable — larga vida útil</Check>

        </AccordionItem>

        {/* ── 3. Activos Funcionales ── */}
        <AccordionItem id="activos" title="Activos Funcionales" open={open === "activos"} onToggle={() => toggle("activos")}>

          <IngTitle name="Óxido de Zinc (ZnO)" />
          <P>Mineral inorgánico de color blanco, polvo muy fino. Uno de los ingredientes cosméticos con mayor espectro de acción documentado.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Protector solar físico → refleja y dispersa rayos UV (UVA y UVB) — SPF ~5-10 al 5%, hasta SPF 30+ al 20–25%</Check>
          <Check>Antiinflamatorio → inhibe la liberación de citoquinas proinflamatorias</Check>
          <Check>Cicatrizante → estimula la proliferación de queratinocitos y fibroblastos</Check>
          <Check>Antimicrobiano → activo contra S. aureus, E. coli, C. albicans</Check>
          <Check>Antifúngico → inhibe el crecimiento de hongos cutáneos</Check>
          <Check>Matificante → absorbe el exceso de sebo superficial</Check>
          <Check>Astringente leve → reduce el tamaño aparente de poros</Check>

          <InfoBox>Es el ingrediente del pañal — el zinc en cremas para bebés es óxido de zinc. Uno de los ingredientes más seguros y mejor tolerados que existen. Apto para bebés, pieles sensibles, atópicas y reactivas.</InfoBox>

          <SubLabel>Concentraciones</SubLabel>
          <Check>1–5% → antiinflamatorio y cicatrizante suave</Check>
          <Check>5–10% → matificante facial + protección solar leve</Check>
          <Check>10–20% → pomada cicatrizante potente (tipo Lassar)</Check>
          <Check>20–25% → protector solar</Check>

          <SubLabel>Proceso de incorporación</SubLabel>
          <P>Siempre tamizar antes de usar. Agregar bajo 40°C — a temperatura alta puede formar aglomerados. Mezclar con el dióxido de silicio antes de incorporar para mejor dispersión.</P>

          <WarnBox>⚠ Nanopartículas: El ZnO puede presentarse en nanopartículas (mayor transparencia) o partículas normales (deja residuo blanco). Las nanopartículas tienen más controversia regulatoria. Para El Floema — usar ZnO de partículas normales.</WarnBox>

          <LineDivider />

          <IngTitle name="Dióxido de Silicio Coloidal (SiO₂)" />
          <P>Sílice amorfa de tamaño de partícula muy pequeño. Polvo blanco ultraligero, casi impalpable. No es el mismo que el vidrio ni la arena — es silicio en forma amorfa coloidal muy pura.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Matificante potente → absorbe el sebo superficial sin resecar</Check>
          <Check>Texturizante → da sensación aterciopelada al aplicar</Check>
          <Check>Dispersante → ayuda a distribuir uniformemente el ZnO evitando grumos</Check>
          <Check>Deslizante → reduce la sensación pesada o grasa</Check>

          <SubLabel>Concentraciones</SubLabel>
          <Check>2–4% → texturizante y matificante suave</Check>
          <Check>5–8% → matificante potente</Check>

          <P>Proceso: Tamizar junto con el ZnO antes de incorporar. Agregar siempre bajo 40°C.</P>

          <LineDivider />

          <IngTitle name="Cacao en Polvo sin Azúcar" />
          <P>Polvo obtenido de los granos de cacao (<em>Theobroma cacao</em>) después de extraer la manteca. Rico en polifenoles — flavanoles (epicatequina, catequina), procianidinas — y metilxantinas (teobromina, cafeína).</P>

          <SubLabel>Función cosmética</SubLabel>
          <Check>Colorante natural — da tono beige a marrón según concentración</Check>
          <Check>Antioxidante — flavanoles protegen contra daño oxidativo</Check>
          <Check>Aroma suave y agradable</Check>
          <Check>Textura suave al tacto</Check>

          <SubLabel>Concentraciones para coloración</SubLabel>
          <Check>0.5–1% → tono beige muy suave, casi imperceptible</Check>
          <Check>1–2% → beige cálido natural</Check>
          <Check>3–5% → marrón claro</Check>

          <WarnBox>⚠ Tamizar muy fino antes de incorporar — partículas grandes se sienten en la piel. Usar cacao 100% sin azúcar ni aditivos.</WarnBox>

          <LineDivider />

          <IngTitle name="Vitamina E — Tocoferol Oleoso" />
          <P>Mezcla de tocoferoles naturales (alfa, beta, gamma, delta) extraídos generalmente de aceite de girasol o soja. El alfa-tocoferol es el más activo biológicamente.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Antioxidante lipídico → protege los aceites y grasas de la oxidación (rancidez)</Check>
          <Check>Cicatrizante → estimula la síntesis de colágeno en fibroblastos</Check>
          <Check>Emoliente → suaviza y nutre la piel</Check>
          <Check>Fotoprotector complementario → absorbe algo de UVB</Check>

          <WarnBox>⚠ No es conservante antimicrobiano — protege contra oxidación, no contra bacterias ni hongos. Error muy común confundir antioxidante con conservante.</WarnBox>

          <SubLabel>Concentraciones</SubLabel>
          <Check>0.5% → antioxidante para la fórmula (protege los aceites)</Check>
          <Check>1% → acción cosmética en piel</Check>
          <Check type="warn">Más del 1% raramente mejora el resultado y puede irritar</Check>

          <P>Proceso: Siempre agregar al final, bajo 40°C. El calor degrada el tocoferol.</P>

          <LineDivider />

          <IngTitle name="Ácido Láctico" />
          <P>Alfa-hidroxiácido (AHA) de origen natural — se produce por fermentación de azúcares. Es el AHA con mejor biodisponibilidad cutánea después del ácido glicólico.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Exfoliante químico → rompe los puentes entre corneocitos facilitando la descamación</Check>
          <Check>Hidratante → al exfoliar aumenta la capacidad de la piel para absorber agua</Check>
          <Check>Regulador de pH → baja el pH de fórmulas acuosas</Check>
          <Check>NMF (Natural Moisturizing Factor) → el lactato sódico es parte del factor humectante natural de la piel</Check>

          <InfoBox>
            pH dependiente — CRÍTICO:{"\n"}
            pH menor de 3.5 → exfoliante potente, puede irritar{"\n"}
            pH 3.5–4.5 → exfoliante suave, uso regular{"\n"}
            pH mayor de 5 → casi no exfolia, actúa principalmente como humectante
          </InfoBox>

          <SubLabel>Concentraciones</SubLabel>
          <Check>2–5% a pH 3.5–4.5 → exfoliante suave</Check>
          <Check>5–10% a pH 3.5–4 → exfoliante medio</Check>
          <Check>Gotas según necesidad → regulador de pH</Check>

          <WarnBox>⚠ Solo en fórmulas acuosas. No tiene función en bases anhidras. Siempre medir pH después de usar.</WarnBox>

        </AccordionItem>

        {/* ── 4. Arcillas y Minerales ── */}
        <AccordionItem id="arcillas" title="Arcillas y Minerales" open={open === "arcillas"} onToggle={() => toggle("arcillas")}>

          <IngTitle name="Arcilla Verde" />
          <P>Arcilla de origen natural — principalmente illita y montmorillonita verde. El color viene de la presencia de óxido de hierro y materia orgánica. Es la más absorbente y desintoxicante de las arcillas cosméticas comunes.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Absorbente potente → absorbe el exceso de sebo, toxinas y partículas externas</Check>
          <Check>Purificante → limpia en profundidad los poros</Check>
          <Check>Desintoxicante → adsorbe metales y toxinas (las adhiere a su superficie)</Check>
          <Check>Astringente → contrae los poros visualmente</Check>
          <Check>Cicatrizante leve → aporta minerales y propiedades antiinflamatorias</Check>

          <SubLabel>Composición mineral</SubLabel>
          <P>Sílice, aluminio, hierro, calcio, magnesio, sodio — en formas biodisponibles.</P>

          <SubLabel>Concentraciones</SubLabel>
          <Check>5–15% en máscaras → purificante</Check>
          <Check>2–5% en syndets → limpieza específica piel grasa</Check>
          <Check>1–3% en velas → colorante natural verde/gris</Check>

          <WarnBox>⚠ Piel mixta y grasa — ideal. Piel seca y sensible — usar con mucho cuidado y en baja concentración.</WarnBox>

          <LineDivider />

          <IngTitle name="Arcilla Roja" />
          <P>Rica en óxido de hierro (hematita) — de ahí su color. Menos absorbente que la verde pero más nutritiva por su alto contenido mineral.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Más suave que la arcilla verde</Check>
          <Check>Estimulante de la circulación</Check>
          <Check>Nutritiva por contenido mineral</Check>
          <Check>Colorante natural terracota en velas y productos</Check>

          <P>Apta para todo tipo de piel, especialmente pieles normales a secas.</P>

          <LineDivider />

          <IngTitle name="Arcilla Amarilla" />
          <P>Rica en silicio y limonita. Color ocre cálido. Propiedades intermedias entre el caolín y la arcilla verde.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Suave y nutritiva</Check>
          <Check>Levemente absorbente</Check>
          <Check>Colorante natural ocre — especialmente bonita en velas (Vela Bruja de Jardín)</Check>
          <Check>Apta para pieles sensibles</Check>

          <LineDivider />

          <IngTitle name="Caolín" />
          <P>Arcilla blanca de alta pureza — principalmente caolinita. Es la arcilla más suave de todas. Se usa incluso en productos para bebés.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Absorbente muy suave — no irrita</Check>
          <Check>Matificante leve</Check>
          <Check>Espesante en máscaras y polvos</Check>
          <Check>Colorante blanco natural</Check>
          <Check>En syndets faciales da textura suave y absorbe el exceso de sebo sin agredir</Check>

          <InfoBox>Para todas las pieles — especialmente sensible, atópica y bebés.</InfoBox>

          <LineDivider />

          <IngTitle name="Bicarbonato de Sodio" />
          <P>NaHCO₃. Sal mineral de pH ~8.3 — ligeramente alcalino.</P>

          <SubLabel>Función cosmética</SubLabel>
          <Check>Desodorante → neutraliza los ácidos producidos por las bacterias responsables del olor</Check>
          <Check>Exfoliante suave → partículas que disuelven con el agua</Check>
          <Check>Neutralizador de pH en ciertas fórmulas</Check>

          <WarnBox>⚠ El pH alcalino (8.3) altera el manto ácido. Usar en concentraciones bajas y no en piel muy sensible. En desodorantes naturales es el activo principal pero puede causar irritación axilar en pieles sensibles — máximo 5–10%.</WarnBox>

          <LineDivider />

          <IngTitle name="Alumbre Potásico" />
          <P>Sulfato doble de potasio y aluminio — KAl(SO₄)₂·12H₂O. Mineral natural cristalino. Se presenta en cristal o polvo.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Desodorante natural → inhibe el crecimiento de bacterias que producen el olor axilar sin bloquear la transpiración</Check>
          <Check>Astringente → contrae tejidos y poros</Check>
          <Check>Hemostático suave → detiene pequeños sangrados (lápiz del barbero)</Check>

          <InfoBox>Diferencia con antitranspirantes convencionales: El alumbre no bloquea los poros — permite la transpiración natural. Solo inhibe las bacterias que transforman el sudor en compuestos odorantes. Es fisiológicamente más respetuoso.</InfoBox>

          <SubLabel>Concentraciones en desodorante</SubLabel>
          <Check>10–15% en barra sólida</Check>
          <Check>Solución saturada en spray</Check>

        </AccordionItem>

        {/* ── 5. Tensioactivos ── */}
        <AccordionItem id="tensioactivos" title="Tensioactivos" open={open === "tensioactivos"} onToggle={() => toggle("tensioactivos")}>

          <IngTitle name="SCI — Sodium Cocoyl Isethionate" />
          <P>Tensioactivo aniónico suave derivado del aceite de coco. Se presenta en escamas o polvo blanco. Es la base de los syndets de alta cosmética — Lush, By Humankind y marcas premium lo usan como tensioactivo principal.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Limpiador principal de syndets</Check>
          <Check>Espuma densa, cremosa y muy suave</Check>
          <Check>pH en uso 5.5–6.5 — no altera el manto ácido</Check>
          <Check>Deposita emolientes en piel al enjuagar</Check>

          <P>Punto de fusión: ~55°C — se puede fundir para moldes.</P>
          <WarnBox>⚠ Incompatible con tensioactivos catiónicos (BTMS). No mezclar directamente.</WarnBox>

          <LineDivider />

          <IngTitle name="BTMS-50" />
          <P>Behentrimonium Methosulfate — emulsificante catiónico y acondicionador. La "50" indica que viene mezclado con alcohol cetílico al 50%.</P>

          <SubLabel>Funciones</SubLabel>
          <Check>Emulsificante catiónico — crea emulsiones W/O especialmente para acondicionadores</Check>
          <Check>Acondicionador — se une a la carga negativa del cabello dañado, suaviza y reduce el frizz</Check>
          <Check>Base de acondicionadores sólidos</Check>

          <SubLabel>Concentraciones</SubLabel>
          <Check>3–6% en acondicionadores líquidos</Check>
          <Check>40–60% en acondicionadores sólidos</Check>

          <WarnBox>⚠ Incompatible con tensioactivos aniónicos (SCI, SLSA, SCS, SLS). Nunca mezclar directamente.</WarnBox>

        </AccordionItem>

        {/* ── 6. Aceites Esenciales ── */}
        <AccordionItem id="esenciales" title="Aceites Esenciales" open={open === "esenciales"} onToggle={() => toggle("esenciales")}>

          <InfoBox>Los aceites esenciales son concentrados biológicamente activos. Nunca aplicar puros en piel. Respetar concentraciones máximas IFRA. Consultar contraindicaciones antes de cada uso.</InfoBox>

          <IngTitle name="AE Cedro del Atlas" italic="Cedrus atlantica · 10ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Madera seca, amaderado cálido, ligeramente alcanforado.</P>
          <P><strong style={{ color: "#c8a050" }}>Componentes principales:</strong> Atlantona (~20%), beta-himachaleno (~40%), alfa-himachaleno (~10%).</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Antiseborreico → reduce la producción de sebo — excelente para piel y cuero cabelludo grasos</Check>
          <Check>Antimicrobiano → activo contra bacterias y hongos cutáneos</Check>
          <Check>Linfotónico → estimula el drenaje linfático</Check>
          <Check>Calmante → efecto ansiolítico leve por vía inhalatoria</Check>
          <Check>Repelente de insectos leve</Check>

          <P><strong style={{ color: "#c8a050" }}>Uso cosmético:</strong> Cremas para piel grasa, syndets capilares, desodorantes, velas de aromaterapia.</P>
          <InfoBox>Concentración máxima en piel: 2% (IFRA) — En El Floema: 0.5% en crema facial matificante.</InfoBox>

          <LineDivider />

          <IngTitle name="AE Palo de Ho" italic="Cinnamomum camphora ct. linalol · 5ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Floral, suave, recuerda a la rosa y al palo de rosa.</P>
          <P><strong style={{ color: "#c8a050" }}>Componente principal:</strong> Linalol ~80–85% — uno de los porcentajes más altos de linalol en cualquier aceite esencial.</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Calmante cutáneo — el linalol inhibe la liberación de sustancia P (mediador del dolor e inflamación)</Check>
          <Check>Antimicrobiano suave — especialmente antibacteriano</Check>
          <Check>Ansiolítico — por vía inhalatoria, efecto documentado</Check>
          <Check>Regenerador cutáneo — estimula la síntesis de colágeno en fibroblastos</Check>
          <Check>Apto para pieles sensibles — uno de los AE mejor tolerados</Check>

          <GreenBox>Es la alternativa sostenible al palo de rosa (<em>Aniba rosaeodora</em>) — especie en peligro de extinción. El palo de ho tiene perfil aromático casi idéntico y es de cultivo sostenible.</GreenBox>
          <P><strong style={{ color: "#c8a050" }}>Concentración:</strong> 0.5–1% en cosméticos.</P>

          <LineDivider />

          <IngTitle name="AE Ciprés" italic="Cupressus sempervirens · 4ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Fresco, resinoso, madera verde.</P>
          <P><strong style={{ color: "#c8a050" }}>Componentes:</strong> Alfa-pineno (~40%), delta-3-careno (~20%), cedrol (~10%).</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Venotónico y linfotónico → mejora la circulación venosa y el drenaje linfático</Check>
          <Check>Astringente → reduce el tamaño de los poros</Check>
          <Check>Antisudoral → reduce la transpiración excesiva — ideal en desodorantes</Check>
          <Check>Antimicrobiano</Check>
          <Check>Decongestivo respiratorio suave</Check>

          <P><strong style={{ color: "#c8a050" }}>Uso cosmético:</strong> Desodorantes, productos para piernas cansadas, syndets para piel grasa.</P>

          <LineDivider />

          <IngTitle name="AE Hinojo Dulce" italic="Foeniculum vulgare · 10ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Anisado dulce característico.</P>
          <P><strong style={{ color: "#c8a050" }}>Componente principal:</strong> Trans-anetol (~70–80%).</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Digestivo — por vía inhalatoria e interna</Check>
          <Check>Carminativo</Check>
          <Check>Estrogénico leve — el anetol tiene estructura similar a estrógenos (fitoestrógeno)</Check>
          <Check>Diurético suave</Check>

          <WarnBox>⚠ CONTRAINDICACIONES — NO usar en: embarazo · niños menores de 6 años · epilepsia · endometriosis o cáncer hormonodependiente. Concentración máxima: 0.5% (IFRA). Solo usar en velas de aromaterapia y productos de uso adulto sin contraindicaciones.</WarnBox>

          <LineDivider />

          <IngTitle name="AE Citronela" italic="Cymbopogon nardus · 10ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Cítrico fresco, ligeramente terroso.</P>
          <P><strong style={{ color: "#c8a050" }}>Componentes:</strong> Geraniol (~20%), citronelal (~35%), citronelol (~15%).</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Repelente de insectos — el más documentado de todos los AE repelentes</Check>
          <Check>Antimicrobiano</Check>
          <Check>Desodorante</Check>
          <Check>Refrescante</Check>

          <P><strong style={{ color: "#c8a050" }}>Uso cosmético:</strong> Velas antiinsectos (Vela Bruja de Jardín), sprays repelentes, desodorantes.</P>
          <WarnBox>⚠ Fotosensibilizante leve — evitar aplicación en piel expuesta al sol en altas concentraciones.</WarnBox>

          <LineDivider />

          <IngTitle name="AE Clavo de Olor" italic="Syzygium aromaticum · 10ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Especiado potente, cálido, muy característico.</P>
          <P><strong style={{ color: "#c8a050" }}>Componente principal:</strong> Eugenol ~70–90%.</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Analgésico → el eugenol inhibe los canales de sodio en neuronas — el dentista lo usa para calmar el dolor dental</Check>
          <Check>Antimicrobiano potentísimo → uno de los AE con mayor actividad antibacteriana y antifúngica conocida</Check>
          <Check>Antiinflamatorio → inhibe COX-2</Check>
          <Check>Calefactor — aumenta la circulación local</Check>

          <WarnBox>⚠ DERMOCÁUSTICO — peligroso si no se usa bien. El eugenol es sensibilizante y potencialmente irritante. Concentración máxima en cosméticos: 0.5% (IFRA). En ungüentos musculares: máximo 1%, siempre evaluar tolerancia. NUNCA aplicar puro en piel. No usar en niños ni pieles sensibles.</WarnBox>

          <LineDivider />

          <IngTitle name="AE Canela (Corteza)" italic="uso en maceración únicamente" />
          <P><strong style={{ color: "#c8a050" }}>Componente principal:</strong> Cinamaldehído (~65–75%).</P>

          <WarnBox>⚠ UNO DE LOS AE MÁS DERMOCÁUSTICOS. Concentración máxima en cosméticos de enjuague: 0.05% · Sin enjuague: 0.01%. Solo usar en maceraciones en tallow donde la concentración queda muy diluida. Nunca en productos para pieles sensibles ni niños.</WarnBox>

          <LineDivider />

          <IngTitle name="AE Verbena" italic="Lippia citriodora · 2ml disponibles" />
          <P><strong style={{ color: "#c8a050" }}>Perfil aromático:</strong> Cítrico fresco, limón intenso, muy aromático.</P>
          <P><strong style={{ color: "#c8a050" }}>Componentes:</strong> Geranial + neral (citral) ~30%, limoneno ~10%.</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Relajante — efecto ansiolítico documentado</Check>
          <Check>Antiinflamatorio</Check>
          <Check>Digestivo</Check>

          <WarnBox>⚠ Fotosensibilizante potente — los citral son fuertemente fotosensibilizantes. Concentración máxima sin enjuague: 0.2% (IFRA). Nunca en productos de uso diurno sin protección solar. No usar en embarazo.</WarnBox>

        </AccordionItem>

        {/* ── 7. Preparaciones Propias ── */}
        <AccordionItem id="preparaciones" title="Preparaciones Propias" open={open === "preparaciones"} onToggle={() => toggle("preparaciones")}>

          <IngTitle name="Hidrolato de Laurel" italic="200ml disponibles" />
          <P>Agua destilada de hojas de laurel (<em>Laurus nobilis</em>). Contiene los compuestos volátiles hidrosolubles del laurel — principalmente alcoholes terpénicos y óxidos que no pasan al aceite esencial.</P>

          <SubLabel>Propiedades</SubLabel>
          <Check>Antimicrobiano suave</Check>
          <Check>Tonificante</Check>
          <Check>Antiinflamatorio leve</Check>
          <Check>pH 4.5–5.5 — respeta el manto ácido</Check>

          <P><strong style={{ color: "#c8a050" }}>Uso:</strong> Tónico facial, base para syndet líquido, spray corporal.</P>
          <InfoBox>Conservación: Sin conservante — máximo 2–3 semanas refrigerado. Con Cosgard 0.5% → 6–12 meses.</InfoBox>

          <LineDivider />

          <IngTitle name="Hidrolato de Eucalipto + Triwe + Pitra + Maqui" italic="100ml disponibles — destilación combinada" />

          <SubLabel>Propiedades por planta</SubLabel>
          <Check>Expectorante — eucalipto (1,8-cineol)</Check>
          <Check>Antimicrobiano — pitra, eucalipto</Check>
          <Check>Antioxidante — maqui</Check>
          <Check>Astringente suave — triwe, pitra</Check>

          <P><strong style={{ color: "#c8a050" }}>Uso:</strong> Base para ungüento expectorante, spray purificante de ambiente, tónico corporal.</P>

          <LineDivider />

          <IngTitle name="Tinturas Alcohólicas" />

          <SubLabel>Tintura de Maqui — 60ml</SubLabel>
          <P>Extracto alcohólico de bayas de maqui. Alto contenido en antocianinas. Color morado intenso.</P>

          <SubLabel>Tintura de Nalca — 80ml</SubLabel>
          <P>Extracto de <em>Gunnera tinctoria</em> — planta gigante del bosque valdiviano. Uso tradicional antiinflamatorio y astringente.</P>

          <SubLabel>Tintura de Té Verde — 60ml</SubLabel>
          <P>Extracto de <em>Camellia sinensis</em>. Alto contenido en EGCG — el catequín más activo del té verde. Antioxidante, antiinflamatorio, antimicrobiano.</P>

          <SubLabel>Tinturas pequeñas — 10ml c/u</SubLabel>
          <P>Tomillo · Manzano · Chilco — pequeñas cantidades, usar con criterio de prioridad en fórmulas.</P>

        </AccordionItem>

        {/* ── 8. Ingredientes que Deberías Tener ── */}
        <AccordionItem id="faltantes" title="Ingredientes que Deberías Tener" open={open === "faltantes"} onToggle={() => toggle("faltantes")}>

          <P style={{ marginBottom: "20px" }}>Ingredientes no disponibles actualmente que ampliarían significativamente las posibilidades de formulación:</P>

          <IngTitle name="Aceite de Rosa Mosqueta" italic="Rosa canina / Rosa rubiginosa" />
          <P>El aceite regenerador por excelencia. ~40% ácido linoleico, ~35% ácido alfa-linolénico (omega-3), ~2% ácido trans-retinoico (precursor de vitamina A activa). Para manchas, cicatrices, estrías, piel madura.</P>
          <WarnBox>⚠ Termosensible — agregar siempre bajo 38°C. Vida útil corta — conservar refrigerado.</WarnBox>

          <LineDivider />

          <IngTitle name="Aceite de Jojoba" italic="Simmondsia chinensis" />
          <P>Técnicamente es una cera líquida. No se enrancia. Imita el sebo natural. Emoliente no comedogénico para piel mixta y grasa. Muy estable. Ideal para syndets faciales.</P>

          <LineDivider />

          <IngTitle name="Pantenol (Provitamina B5)" />
          <P>Humectante, cicatrizante, calmante. Se convierte en ácido pantoténico en la piel. Excelente en syndets para pieles sensibles.</P>

          <LineDivider />

          <IngTitle name="Alantoína" />
          <P>Compuesto derivado de la consuelda. Queratolítico suave, cicatrizante, calmante. Activa la proliferación celular. Imprescindible en productos para piel dañada e irritada.</P>

          <LineDivider />

          <IngTitle name="Aceite de Argán" italic="Argania spinosa" />
          <P>Rico en vitamina E y ácido oleico. Antiedad, nutritivo, con buena penetración. Para productos faciales premium.</P>

          <LineDivider />

          <IngTitle name="Escualano" />
          <P>Derivado del olivo (o de la caña de azúcar). Ultraligero, no comedogénico, estabiliza la barrera cutánea. Excelente para pieles sensibles y mixtas.</P>

          <LineDivider />

          <IngTitle name="Proteína Hidrolizada de Trigo o Seda" />
          <P>Se deposita en la cutícula del cabello, rellena daños, da brillo y resistencia. Imprescindible en syndets capilares.</P>

          <LineDivider />

          <IngTitle name="Cosgard" italic="Benzyl Alcohol + Dehydroacetic Acid" />
          <P>El conservante de cosmética natural más usado. Imprescindible en cualquier fórmula con agua. Activo en pH menor de 6.</P>

          <LineDivider />

          <IngTitle name="Polisorbato 20" />
          <P>Solubilizante para aceites esenciales en bases acuosas. Sin él los AE flotan o quedan turbios en syndets líquidos y tónicos.</P>

          <LineDivider />

          <IngTitle name="Goma Xantana" />
          <P>Espesante para bases acuosas. Da textura gel sin grasa. Para tónicos espesos, geles de aloe y syndets líquidos con cuerpo.</P>

        </AccordionItem>

      </div>
    </div>
  );
}
