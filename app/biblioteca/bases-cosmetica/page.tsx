"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "var(--font-grimoire)", fontSize: "clamp(0.75rem,1.5vw,0.95rem)", color: "rgba(200,160,80,0.75)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
      {children}
    </h3>
  );
}
function Body({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.6vw,1.12rem)", lineHeight: 1.82, color: "#d4c4a0", marginBottom: "1rem" }}>
      {children}
    </p>
  );
}
function Quote({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(1rem,1.6vw,1.1rem)", lineHeight: 1.72, color: "#d4c4a0", borderLeft: "1px solid rgba(200,160,80,0.4)", paddingLeft: "1.2rem", marginBottom: "1.2rem", marginLeft: "0.5rem" }}>
      {children}
    </p>
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

// ── Accordion item ────────────────────────────────────────────────────────────
interface AccordionItemProps {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
function AccordionItem({ title, open, onToggle, children }: AccordionItemProps) {
  return (
    <div
      style={{
        border: `1px solid ${open ? "rgba(200,160,80,0.3)" : "rgba(200,160,80,0.1)"}`,
        borderRadius: "0.5rem",
        marginBottom: "0.5rem",
        background: open ? "rgba(200,160,80,0.04)" : "transparent",
        transition: "border-color 0.3s, background 0.3s",
        overflow: "hidden",
      }}
    >
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
        <span
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "0.78rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#c8a050",
          }}
        >
          {title}
        </span>
        <span
          style={{
            color: "rgba(200,160,80,0.6)",
            fontSize: "0.9rem",
            display: "inline-block",
            transform: open ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
          }}
        >
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
            <div style={{ padding: "0 1.25rem 1.25rem" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const SECTIONS = [
  "que-es",
  "tipos",
  "piel",
  "tensioactivos",
  "emolientes",
  "ph",
  "conservantes",
  "syndet",
  "proceso",
] as const;
type SectionId = (typeof SECTIONS)[number];

export default function BasesCosmetica() {
  const [openId, setOpenId] = useState<SectionId>("que-es");

  const toggle = (id: SectionId) => setOpenId((prev) => (prev === id ? ("" as SectionId) : id));

  return (
    <div className="parchment-bg" style={{ position: "relative", minHeight: "100vh" }}>
      <GrainOverlay />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "clamp(80px,12vh,140px) clamp(24px,5vw,64px) clamp(64px,10vh,120px)" }}>
        <BackButton label="← Volver" />

        {/* Page header */}
        <div style={{ marginTop: "2.5rem", marginBottom: "3rem" }}>
          <Label>La Biblioteca · Bases de Cosmética</Label>
          <PageTitle>Bases de Cosmética Natural</PageTitle>
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
            Teoría pura — lo que necesitas entender antes de formular
          </p>
          <div style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(200,160,80,0.35),transparent)" }} />
        </div>

        {/* ── Accordion ── */}

        {/* 1. ¿Qué es la cosmética natural? */}
        <AccordionItem id="que-es" title="¿Qué es la cosmética natural?" open={openId === "que-es"} onToggle={() => toggle("que-es")}>
          <Body>
            La cosmética natural no es simplemente usar ingredientes naturales. Es entender cómo funcionan, por qué actúan sobre la piel de una determinada manera, y cómo formularlos de forma segura y efectiva. No alcanza con reemplazar un químico de síntesis por uno de origen vegetal — si no entiendes el rol que cumple ese ingrediente en la fórmula, el resultado puede ser igualmente ineficaz o inestable.
          </Body>
          <Body>
            Formular es un acto de ciencia aplicada. Cada ingrediente tiene una función técnica, un porcentaje de uso seguro, una fase en la que va, una temperatura que no puede superar. El origen natural es una elección ética y ecológica — pero no exime de rigor.
          </Body>
          <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { name: "Ciencia", text: "Cada ingrediente tiene una razón de estar en la fórmula. Nada es decorativo." },
              { name: "Origen", text: "Plantas nativas del sur de Chile, sebo local — ingredientes con historia, trazabilidad y coherencia." },
              { name: "Honestidad", text: "Lo que dice la etiqueta es lo que hay. Sin rellenos, sin activos fantasma, sin porcentajes trucados." },
            ].map((pillar) => (
              <div key={pillar.name} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                <span style={{ color: "#c8a050", fontFamily: "var(--font-grimoire)", fontSize: "0.75rem", marginTop: "0.25rem", flexShrink: 0 }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.6vw,1.12rem)", lineHeight: 1.72, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.85)", fontStyle: "normal" }}>{pillar.name} — </strong>
                  {pillar.text}
                </p>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* 2. Tipos de productos */}
        <AccordionItem id="tipos" title="Tipos de productos cosméticos" open={openId === "tipos"} onToggle={() => toggle("tipos")}>
          <SubTitle>Por su estructura física</SubTitle>
          {[
            {
              name: "Anhidros — sin agua",
              desc: "Sin agua, no hay crecimiento microbiano, no se necesita conservante antimicrobiano. Los aceites, ceras y grasas son la base. Son los productos más estables y los más simples de formular.",
              examples: "Ungüentos, bálsamos, cremas sólidas, barras labiales, velas, syndets sólidos.",
            },
            {
              name: "Emulsiones — aceite + agua",
              desc: "El tipo más complejo. Mezclar agua y aceite requiere emulsionante — una molécula con doble personalidad que estabiliza la unión. Siempre necesitan conservante antimicrobiano. La fase en la que está disperso el otro líquido define si es O/W (hidratante ligera) o W/O (nutritiva intensa).",
              examples: "Cremas, lociones, leches limpiadoras.",
            },
            {
              name: "Geles acuosos",
              desc: "Base acuosa espesada con gomas naturales o carbómero. Ligeros, frescos, sin grasa. Siempre necesitan conservante.",
              examples: "Geles de aloe, tónicos espesos, sueros.",
            },
            {
              name: "Syndets",
              desc: "Productos de limpieza formulados con tensioactivos suaves. Pueden ser sólidos o líquidos. Su pH se puede controlar — a diferencia del jabón tradicional, que siempre es alcalino.",
              examples: "Champú sólido, barra limpiadora facial, gel de ducha, champú líquido.",
            },
          ].map((item) => (
            <div key={item.name} style={{ marginBottom: "1.5rem" }}>
              <SubTitle>{item.name}</SubTitle>
              <Body>{item.desc}</Body>
              <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "clamp(0.9rem,1.4vw,1rem)", color: "rgba(212,196,160,0.7)", marginBottom: "0.5rem", lineHeight: 1.6 }}>
                Ejemplos: {item.examples}
              </p>
            </div>
          ))}
        </AccordionItem>

        {/* 3. La Piel */}
        <AccordionItem id="piel" title="La Piel" open={openId === "piel"} onToggle={() => toggle("piel")}>
          <Body>
            La piel tiene tres capas principales: epidermis, dermis e hipodermis. Para la cosmética, lo que más importa es la capa más externa de la epidermis: el estrato córneo. Es una barrera formada por corneocitos (células muertas aplanadas) rodeados de capas organizadas de lípidos — como ladrillos en una pared de mortero lipídico. Tiene dos funciones críticas: mantener el agua dentro y mantener los agentes externos fuera.
          </Body>
          <SubTitle>El manto ácido</SubTitle>
          <Body>
            El pH de la piel sana es 4.5–5.5 — ligeramente ácido. Este entorno protege contra patógenos, mantiene la microbiota beneficiosa y regula las enzimas de renovación celular. Todo lo que se aplica sobre la piel afecta este manto. Por eso el pH de los productos cosméticos importa: un producto demasiado alcalino altera el equilibrio, irrita y desprotege.
          </Body>
          <SubTitle>Cómo penetran los activos</SubTitle>
          <Body>
            Los ingredientes penetran principalmente entre las células del estrato córneo, a través de la matriz lipídica intercelular. Los activos lipófilos (que aman las grasas) penetran mejor que los hidrófilos. El sebo es tan efectivo como vehículo porque su composición de ácidos grasos es similar a la de esa matriz lipídica — la piel lo reconoce como propio y lo incorpora con facilidad.
          </Body>
        </AccordionItem>

        {/* 4. Los tensioactivos */}
        <AccordionItem id="tensioactivos" title="Los tensioactivos" open={openId === "tensioactivos"} onToggle={() => toggle("tensioactivos")}>
          <Body>
            Los tensioactivos son moléculas con doble personalidad: una parte hidrofílica (ama el agua) y una parte hidrofóbica (ama el aceite). Esta doble naturaleza les permite emulsionar, limpiar, espumar y acondicionar. Se clasifican según su carga eléctrica.
          </Body>

          {/* Aniónicos */}
          <div style={{ borderLeft: "3px solid rgba(200,160,80,0.4)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <SubTitle>Aniónicos — los que limpian</SubTitle>
            <Body>
              Carga negativa. Son los principales limpiadores — los más potentes y también los más irritantes cuando se usan solos. Siempre se combinan con anfóteros para suavizar.
            </Body>
            {[
              { name: "SCI (Sodium Cocoyl Isethionate)", desc: "Suave, espuma cremosa, excelente en syndets sólidos. El más biocompatible de su familia.", warn: false },
              { name: "SLSA (Sodium Lauryl Sulfoacetate)", desc: "Molécula grande, penetra menos en piel. Volumen de espuma alto. Buena opción para champú sólido.", warn: false },
              { name: "SCS (Sodium Coco Sulfate)", desc: "Más fuerte que SCI, menos que SLS. Usar con moderación en pieles sensibles.", warn: false },
              { name: "SLS — Evitar", desc: "Sodium Lauryl Sulfate. Demasiado agresivo. Destruye el manto ácido. No forma parte de ninguna fórmula de El Floema.", warn: true },
            ].map((item) => (
              <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: item.warn ? "rgba(200,80,80,0.8)" : "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Anfóteros */}
          <div style={{ borderLeft: "3px solid rgba(200,160,80,0.4)", paddingLeft: "1rem", marginBottom: "1.5rem" }}>
            <SubTitle>Anfóteros — los que suavizan</SubTitle>
            <Body>
              Cambian de carga según el pH. Reducen la irritación de los aniónicos, mejoran la espuma y acondicionan. Son el puente entre limpieza y suavidad.
            </Body>
            {[
              { name: "Betaína de coco", desc: "Derivada del coco. Suaviza, estabiliza la espuma, acondiciona. Imprescindible en cualquier syndet." },
              { name: "Cocamidopropil betaína", desc: "Similar a la betaína de coco. Muy usada en champús líquidos. Buena compatibilidad con todos los tipos de tensioactivos." },
            ].map((item) => (
              <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* No iónicos */}
          <div style={{ borderLeft: "3px solid rgba(200,160,80,0.4)", paddingLeft: "1rem" }}>
            <SubTitle>No iónicos — los que acondicionan</SubTitle>
            <Body>
              Sin carga eléctrica. Los más suaves. Poca capacidad limpiadora solos, pero excelentes como co-tensioactivos acondicionadores.
            </Body>
            {[
              { name: "Glucósido de coco", desc: "Tan suave que se usa en productos para bebés desde el nacimiento. pH natural 11-12 — siempre ajustar con ácido cítrico antes de incorporar." },
              { name: "Decil glucósido", desc: "Similar al glucósido de coco. Muy suave, buena compatibilidad, espuma cremosa. Ideal para piel sensible y fórmulas faciales." },
            ].map((item) => (
              <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* 5. Los emolientes */}
        <AccordionItem id="emolientes" title="Los emolientes" open={openId === "emolientes"} onToggle={() => toggle("emolientes")}>
          <Body>
            Los emolientes nutren, suavizan y protegen la piel. En syndets, se funden con los tensioactivos y se depositan sobre la piel al enjuagar. En productos anhidros, son la base principal.
          </Body>

          <SubTitle>Ceras y sólidos estructurantes</SubTitle>
          {[
            { name: "Cera de abeja", desc: "Punto de fusión 62-65°C. Al 4-6% da un bálsamo semi-sólido. Por encima del 20% la barra queda muy dura." },
            { name: "Ácido esteárico vegetal", desc: "Ácido graso, no una cera. Da textura cremosa. Al 3-8% proporciona esa sensación de pomada densa sin solidificar de golpe." },
            { name: "Alcohol cetílico y estearílico", desc: "Alcoholes grasos de cadena larga. Suavizan, espesan y estabilizan emulsiones. Buena compatibilidad con tensioactivos." },
          ].map((item) => (
            <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                {item.desc}
              </p>
            </div>
          ))}

          <div style={{ marginTop: "1.25rem" }}>
            <SubTitle>Grasas y aceites</SubTitle>
            {[
              { name: "Sebo bovino", desc: "El ingrediente estrella de El Floema. ~45% oleico, ~27% palmítico, ~20% esteárico. Biomimético — su composición es muy similar a los lípidos del estrato córneo. Punto de fusión ~40°C, funde a temperatura corporal." },
              { name: "Manteca de karité", desc: "Rica en insaponificables con acción antiinflamatoria y cicatrizante. Se usa al 5-30% según la textura deseada." },
              { name: "Aceite de jojoba", desc: "Técnicamente una cera líquida. Imita el sebo natural de la piel. No comedogénico. Estable al calor — no se oxida fácilmente." },
              { name: "Aceite de rosa mosqueta", desc: "Rico en ácido linoleico, con acción regeneradora comprobada. Termosensible — agregar siempre por debajo de 40°C." },
              { name: "Aceite de ricino", desc: "~90% ácido ricinoleico. Espesa los aceites, da brillo y humectación. Por encima del 20% resulta pegajoso." },
            ].map((item) => (
              <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </AccordionItem>

        {/* 6. El pH */}
        <AccordionItem id="ph" title="El pH y por qué importa" open={openId === "ph"} onToggle={() => toggle("ph")}>
          <Body>
            La escala de pH va de 0 a 14. El 7 es neutro. Por debajo de 7 es ácido, por encima es alcalino. El pH de la piel sana es 4.5–5.5 — ligeramente ácido.
          </Body>
          <Quote>
            Un producto muy alcalino (pH &gt; 7) altera el manto ácido, irrita, reseca y puede promover el crecimiento de bacterias patógenas. Un jabón de soda tiene pH 9-10.
          </Quote>

          {/* pH table */}
          <div style={{ overflowX: "auto", marginBottom: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem,1.4vw,1rem)" }}>
              <thead>
                <tr style={{ background: "rgba(200,160,80,0.08)" }}>
                  <th style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", padding: "0.6rem 1rem", textAlign: "left", border: "1px solid rgba(200,160,80,0.12)" }}>Producto</th>
                  <th style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", padding: "0.6rem 1rem", textAlign: "left", border: "1px solid rgba(200,160,80,0.12)" }}>pH ideal</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Limpiador facial", "4.5–5.5"],
                  ["Syndet corporal", "5.0–6.5"],
                  ["Shampoo", "4.5–5.5"],
                  ["Tónico facial", "4.5–5.5"],
                  ["Crema / emulsión", "5.0–6.0"],
                  ["Gel aloe", "4.5–5.5"],
                  ["Ungüento anhidro", "No aplica"],
                ].map(([producto, ph], i) => (
                  <tr key={producto} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ color: "#d4c4a0", padding: "0.5rem 1rem", border: "1px solid rgba(200,160,80,0.08)" }}>{producto}</td>
                    <td style={{ color: "rgba(200,160,80,0.75)", padding: "0.5rem 1rem", border: "1px solid rgba(200,160,80,0.08)", fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.08em" }}>{ph}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SubTitle>Cómo ajustar el pH</SubTitle>
          {[
            { action: "Para bajar el pH", how: "Solución de ácido cítrico al 10%, gota a gota." },
            { action: "Para subir el pH", how: "Solución de hidróxido de sodio al 10%, gota a gota." },
            { action: "Para medir", how: "Siempre con pHmetro o tiras reactivas de calidad. Nunca a ojo." },
          ].map((item) => (
            <div key={item.action} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.6rem" }}>
              <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.2rem" }}>→</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.action}: </strong>
                {item.how}
              </p>
            </div>
          ))}
        </AccordionItem>

        {/* 7. Conservantes */}
        <AccordionItem id="conservantes" title="Conservantes" open={openId === "conservantes"} onToggle={() => toggle("conservantes")}>
          <Body>
            Necesitas conservante antimicrobiano siempre que haya agua en la fórmula. El agua es el sustrato donde crecen bacterias, hongos y levaduras. Sin conservante, un producto acuoso se contamina en días — aunque no lo veas ni lo huelas.
          </Body>
          <Body>
            Los productos 100% anhidros no necesitan conservante antimicrobiano. Sí necesitan antioxidante (vitamina E) para proteger los aceites de la oxidación.
          </Body>

          {[
            {
              name: "Cosgard (Benzyl Alcohol + Dehydroacetic Acid)",
              desc: "El más usado en cosmética natural certificada. Amplio espectro (bacterias, hongos, levaduras). Activo a pH < 6. Dosis: 0.5–1%.",
            },
            {
              name: "Leucidal (Leuconostoc/Radish Root Ferment)",
              desc: "Origen fermentado, muy suave. Buena opción para pieles sensibles. Dosis: 2–4%.",
            },
            {
              name: "Vitamina E — Tocoferol",
              desc: "NO es conservante antimicrobiano — es un antioxidante. Protege los aceites de la oxidación, pero no previene el crecimiento microbiano. Siempre en bases oleosas: 0.5–1%.",
            },
          ].map((item) => (
            <div key={item.name} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.9rem" }}>
              <span style={{ color: "#c8a050", flexShrink: 0, marginTop: "0.25rem" }}>→</span>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                <strong style={{ color: "rgba(200,160,80,0.85)" }}>{item.name} — </strong>
                {item.desc}
              </p>
            </div>
          ))}

          <Quote>
            Si agregas cualquier ingrediente que contenga agua a una base anhidra — hidrolato, extracto acuoso, aloe vera líquido — inmediatamente necesitas conservante.
          </Quote>
        </AccordionItem>

        {/* 8. El Syndet */}
        <AccordionItem id="syndet" title="El Syndet" open={openId === "syndet"} onToggle={() => toggle("syndet")}>
          <Body>
            Syndet = synthetic detergent. Todo producto de limpieza formulado con tensioactivos suaves. No confundas &quot;sintético&quot; con artificial — los tensioactivos de syndet natural provienen del coco, del azúcar, de la glucosa. Son biodegradables y de origen vegetal.
          </Body>
          <Body>
            La diferencia clave con el jabón tradicional está en el pH. El jabón de soda tiene pH 9–10. Con cada lavado rompe el manto ácido — la piel tarda 1 a 3 horas en recuperar su pH natural. El syndet tiene pH 4.5–6.5: respeta el manto ácido y la microbiota cutánea.
          </Body>

          {/* Comparison table */}
          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "clamp(0.9rem,1.4vw,1rem)" }}>
              <thead>
                <tr style={{ background: "rgba(200,160,80,0.08)" }}>
                  <th style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", padding: "0.6rem 1rem", textAlign: "left", border: "1px solid rgba(200,160,80,0.12)" }}></th>
                  <th style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", padding: "0.6rem 1rem", textAlign: "left", border: "1px solid rgba(200,160,80,0.12)" }}>Sólido</th>
                  <th style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "#c8a050", padding: "0.6rem 1rem", textAlign: "left", border: "1px solid rgba(200,160,80,0.12)" }}>Líquido</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Agua", "Sin agua", "50–70% agua"],
                  ["Conservante", "No necesita", "Obligatorio"],
                  ["Duración", "2–3 años", "12–18 meses"],
                  ["Sustentabilidad", "Sin envase plástico", "Requiere envase"],
                  ["Dificultad", "Media", "Fácil"],
                ].map(([row, solid, liquid], i) => (
                  <tr key={row} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.015)" : "transparent" }}>
                    <td style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", padding: "0.5rem 1rem", border: "1px solid rgba(200,160,80,0.08)" }}>{row}</td>
                    <td style={{ color: "#d4c4a0", padding: "0.5rem 1rem", border: "1px solid rgba(200,160,80,0.08)" }}>{solid}</td>
                    <td style={{ color: "#d4c4a0", padding: "0.5rem 1rem", border: "1px solid rgba(200,160,80,0.08)" }}>{liquid}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AccordionItem>

        {/* 9. Proceso general */}
        <AccordionItem id="proceso" title="Proceso general de formulación" open={openId === "proceso"} onToggle={() => toggle("proceso")}>
          <Body>
            Antes de hacer cualquier producto, define siempre el objetivo, el tipo de producto y los ingredientes. Luego sigue este orden:
          </Body>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "0.5rem" }}>
            {[
              { n: 1, title: "Define el objetivo", desc: "¿Qué quieres que haga el producto? ¿Para qué tipo de piel? ¿Qué activos necesita?" },
              { n: 2, title: "Elige el tipo de producto", desc: "Anhidro, emulsión, gel, syndet sólido, syndet líquido. Cada tipo tiene reglas distintas." },
              { n: 3, title: "Lista tus ingredientes", desc: "Verifica compatibilidades. Comprueba en qué fase va cada uno. Calcula los porcentajes — deben sumar 100%." },
              { n: 4, title: "Pesa todo antes de empezar", desc: "Nunca formules a ojo. La balanza de precisión es tu herramienta más importante." },
              { n: 5, title: "Trabaja en orden correcto", desc: "Base → estructurantes → activos que resisten el calor → activos termosensibles → aceites esenciales → conservante → ajuste de pH." },
              { n: 6, title: "Respeta las temperaturas", desc: "Fundido de bases y ceras: 65-70°C. Activos: por debajo de 40°C. AE: por debajo de 40°C. Conservante: temperatura ambiente." },
              { n: 7, title: "Mide el pH", desc: "En todos los productos acuosos. Ajusta antes de envasar." },
              { n: 8, title: "Registra todo", desc: "Fecha, lote, ingredientes, porcentajes, proceso, resultado. Si no lo registras, no puedes reproducirlo ni mejorarlo." },
              { n: 9, title: "Prueba en piel", desc: "Siempre prueba en parche 48 horas antes de usar en rostro completo." },
              { n: 10, title: "Evalúa la estabilidad", desc: "Guarda una muestra a temperatura ambiente y una en nevera. Revisa a las 2 semanas y al mes: color, olor, textura, separación de fases." },
            ].map((step) => (
              <div key={step.n} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    border: "1px solid rgba(200,160,80,0.45)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "0.1rem",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.65rem", color: "#c8a050", fontWeight: "bold" }}>{step.n}</span>
                </div>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.5vw,1.05rem)", lineHeight: 1.72, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.85)" }}>{step.title} — </strong>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </AccordionItem>

        <Divider />
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <BackButton label="← Volver" />
        </div>
      </div>
    </div>
  );
}
