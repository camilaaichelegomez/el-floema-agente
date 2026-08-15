"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { FiguraLibro } from "@/components/biblioteca/FiguraLibro";

function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-met">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-met)" />
    </svg>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: "12px", ...style }}>{children}</p>;
}
function SubLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: "10px" }}>{children}</p>;
}
function Check({ children, mark = "✓" }: { children: React.ReactNode; mark?: string }) {
  const color = mark === "✓" ? "#5a7a3a" : mark === "✗" ? "rgba(184,115,51,0.75)" : "#c8a050";
  return (
    <div style={{ marginBottom: "8px", paddingLeft: "0.2rem" }}>
      <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: 0 }}>
        <span style={{ color, marginRight: "0.45rem" }}>{mark}</span>{children}
      </p>
    </div>
  );
}
function InfoBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(200,160,80,0.62)", marginBottom: "7px" }}>{title}</p>}
      <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>{children}</p>
    </div>
  );
}
function WarnBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: "7px" }}>{title}</p>}
      <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>{children}</p>
    </div>
  );
}
function GreenBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(90,122,58,0.07)", border: "1px solid rgba(90,122,58,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(90,122,58,0.75)", marginBottom: "7px" }}>{title}</p>}
      <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>{children}</p>
    </div>
  );
}
function PurpleBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(122,74,138,0.07)", border: "1px solid rgba(122,74,138,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(154,106,170,0.75)", marginBottom: "7px" }}>{title}</p>}
      <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>{children}</p>
    </div>
  );
}
function MiniTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: "auto", marginBottom: "14px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "rgba(200,160,80,0.08)" }}>
            {headers.map((h, i) => (
              <th key={i} style={{ border: "1px solid rgba(200,160,80,0.18)", padding: "7px 10px", color: "#c8a050", fontWeight: 600, fontSize: "0.83rem", textAlign: "left" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 1 ? "rgba(200,160,80,0.02)" : "transparent" }}>
              {row.map((cell, j) => (
                <td key={j} style={{ border: "1px solid rgba(200,160,80,0.12)", padding: "7px 10px", fontSize: "0.87rem", lineHeight: 1.6, color: "#d4c4a0" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function LineDivider() {
  return <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "18px 0" }} />;
}

interface AccordionItemProps { id: string; title: string; open: boolean; onToggle: () => void; children: React.ReactNode; }
function AccordionItem({ title, open, onToggle, children }: AccordionItemProps) {
  return (
    <div style={{ border: `1px solid ${open ? "rgba(200,160,80,0.3)" : "rgba(200,160,80,0.1)"}`, borderRadius: "0.5rem", marginBottom: "0.5rem", background: open ? "rgba(200,160,80,0.04)" : "transparent", transition: "border-color 0.3s, background 0.3s", overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
        <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#c8a050" }}>{title}</span>
        <span style={{ color: "rgba(200,160,80,0.6)", fontSize: "0.9rem", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }}>→</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 1.25rem 1.25rem" }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS = ["infusion","decoccion","maceracion-fria","tintura","glicerico","oleomacerado","tallow","hidrodestilacion","enfleurage","cataplasma"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function MetodosExtraccion() {
  const [open, setOpen] = useState<SectionId | null>("infusion");
  const toggle = (id: SectionId) => setOpen(prev => prev === id ? null : id);

  return (
    <main className="parchment-bg" style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <GrainOverlay />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px, 6vh, 64px) clamp(24px, 5vw, 56px)" }}>
        <BackButton />

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "2.2rem", color: "#c8a050", letterSpacing: "0.14em", marginBottom: 8 }}>
            Métodos de Extracción
          </h1>
          <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "1.1rem", fontStyle: "italic", color: "#d4c4a0" }}>
            Cómo hablarle a la planta en su propio idioma
          </p>
        </header>

        {/* ── Por qué importa ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>Por qué importa el método</h2>
          <P>Cuando dices "quiero usar matico en mi crema" estás diciendo muy poco. El matico contiene flavonoides, taninos, aceite esencial, mucílagos y triterpenos — y cada uno de esos grupos se extrae de manera diferente, con solventes diferentes, a temperaturas diferentes, en tiempos diferentes.</P>
          <P>El método de extracción no es un detalle técnico — es la decisión que determina qué activos vas a tener en tu producto final. Usar el método equivocado puede darte un extracto hermoso que no hace absolutamente nada porque los activos que necesitabas quedaron en el material vegetal descartado.</P>
          <InfoBox title="El principio fundamental">
            Lo semejante disuelve lo semejante. Los compuestos hidrófilos (que aman el agua) se extraen con agua o mezclas agua-alcohol. Los compuestos lipófilos (que aman la grasa) se extraen con aceites, grasas o alcoholes de alta graduación. Los compuestos de polaridad media se extraen bien con alcohol de graduación media (50–70%).
          </InfoBox>
          <WarnBox title="⚠ Temperatura — la variable más crítica">
            El calor acelera la extracción pero destruye los activos termolábiles. Las antocianinas del maqui se degradan sobre 60°C. Los aceites esenciales se evaporan desde los 40°C. Las enzimas que transforman los glucósidos en sus formas activas se inactivan sobre 70°C. Cada método tiene una temperatura óptima que equilibra eficiencia de extracción con preservación de activos.
          </WarnBox>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />

        {/* ── Los 10 métodos ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 20 }}>Los 10 métodos</h2>

          {/* 1 — Infusión */}
          <AccordionItem id="infusion" title="1 · Infusión" open={open === "infusion"} onToggle={() => toggle("infusion")}>
            <FiguraLibro num="1" titulo="Infusión" src="/biblioteca/metodos/lamina-1.png" prompt="Una tetera de vidrio infusionando flores y hojas delicadas en agua caliente, con vapor subiendo. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> El método más conocido y usado. Consiste en verter agua caliente sobre el material vegetal y dejarlo reposar tapado. Es el té de toda la vida.</P>
            <InfoBox title="Por qué tapado">
              Los aceites esenciales y los compuestos volátiles se evaporan con el vapor. Tapar el recipiente retiene esos compuestos dentro de la infusión. Una infusión de menta sin tapar pierde hasta el 40% de su mentol en los primeros 5 minutos.
            </InfoBox>
            <SubLabel>Temperatura óptima</SubLabel>
            <MiniTable
              headers={["Temperatura", "Para qué plantas", "Por qué"]}
              rows={[
                ["60–70°C", "Flores delicadas, plantas aromáticas", "Preserva aceites esenciales y compuestos termolábiles"],
                ["80–85°C", "Hojas, flores robustas", "Balance entre extracción y preservación"],
                ["90–95°C", "Hierbas en general", "Extracción completa de la mayoría de compuestos"],
                ["100°C", "Raíces y cortezas duras", "Solo si no hay aceites esenciales importantes"],
              ]}
            />
            <SubLabel>Tiempo</SubLabel>
            <P>Flores y hojas delicadas: 3–5 min · Hojas y tallos: 5–10 min · Material más denso: 10–15 min. Más tiempo no significa más activos — después de cierto punto empieza a extraer compuestos amargos y astringentes indeseados.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Flavonoides hidrosolubles</Check>
            <Check>Mucílagos</Check>
            <Check>Vitaminas hidrosolubles</Check>
            <Check>Algunos taninos</Check>
            <Check>Aceites esenciales (si se tapa)</Check>
            <Check>Compuestos aromáticos volátiles</Check>
            <SubLabel>Qué extrae mal</SubLabel>
            <Check mark="✗">Terpenos lipófilos</Check>
            <Check mark="✗">Clorofila</Check>
            <Check mark="✗">Resinas y compuestos muy hidrofóbicos</Check>
            <LineDivider />
            <P><strong style={{ color: "#c8a050" }}>Partes de la planta:</strong> Hojas, flores, partes aéreas tiernas. No es adecuada para raíces duras, cortezas ni semillas.</P>
            <P><strong style={{ color: "#c8a050" }}>Uso medicinal:</strong> Consumo interno — el método más accesible para uso doméstico. También base para cataplasmas y compresas.</P>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Conservación:</strong> 24–48 horas en refrigeración. Sin conservantes. Para uso inmediato.</P>
          </AccordionItem>

          {/* 2 — Decocción */}
          <AccordionItem id="decoccion" title="2 · Decocción" open={open === "decoccion"} onToggle={() => toggle("decoccion")}>
            <FiguraLibro num="2" titulo="Decocción" src="/biblioteca/metodos/lamina-2.png" prompt="Raices y cortezas hirviendo a fuego en una olla de agua, preparando una decoccion. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> Hervir el material vegetal directamente en agua durante un tiempo prolongado. A diferencia de la infusión el material va al agua fría, se lleva a ebullición y se mantiene hirviendo.</P>
            <InfoBox title="Cuándo usar decocción en vez de infusión">
              La decocción es para materiales duros y densos donde la infusión no logra penetrar — raíces, cortezas, semillas, tallos leñosos. Estos materiales necesitan el calor sostenido para romper las paredes celulares y liberar los activos.
            </InfoBox>
            <P><strong style={{ color: "#c8a050" }}>Temperatura y tiempo:</strong> 95–100°C sostenido durante 15–45 min según dureza. Regla práctica: hervir 20 minutos, colar caliente.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Taninos (se extraen mejor con calor prolongado)</Check>
            <Check>Polisacáridos y mucílagos de raíces</Check>
            <Check>Saponinas</Check>
            <Check>Algunos alcaloides</Check>
            <Check>Minerales y sales</Check>
            <Check>Glucósidos resistentes al calor</Check>
            <SubLabel>Qué destruye</SubLabel>
            <Check mark="✗">Aceites esenciales (se evaporan completamente)</Check>
            <Check mark="✗">Antocianinas y flavonoides termolábiles</Check>
            <Check mark="✗">Vitaminas sensibles al calor</Check>
            <Check mark="✗">Enzimas</Check>
            <LineDivider />
            <P><strong style={{ color: "#c8a050" }}>Partes de la planta:</strong> Raíces, cortezas, semillas, tallos leñosos, rizomas.</P>
            <GreenBox title="Ejemplos con plantas de El Floema">
              Arrayán (corteza y ramas): decocción 20 min extrae taninos elágicos y flavonoides estables. Triwe (corteza): decocción 30 min para taninos y saponinas.
            </GreenBox>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Conservación:</strong> 24–48 horas refrigerado. Más potente que la infusión para materiales duros.</P>
          </AccordionItem>

          {/* 3 — Maceración fría acuosa */}
          <AccordionItem id="maceracion-fria" title="3 · Maceración fría acuosa" open={open === "maceracion-fria"} onToggle={() => toggle("maceracion-fria")}>
            <FiguraLibro num="3" titulo="Maceración fría" src="/biblioteca/metodos/lamina-3.png" prompt="Hierbas reposando en agua fria dentro de un frasco de vidrio, maceracion en frio, agua tenida de verde. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> Poner el material vegetal en agua fría o temperatura ambiente y dejarlo reposar sin aplicar calor. Es el método más lento pero preserva los activos más delicados.</P>
            <P><strong style={{ color: "#c8a050" }}>Temperatura:</strong> Agua fría o temperatura ambiente (15–25°C). Nunca calor.</P>
            <P><strong style={{ color: "#c8a050" }}>Tiempo:</strong> 8–24 horas según el material. Algunas maceraciones acuosas se dejan hasta 48 horas en refrigeración.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Mucílagos (se degradan con el calor — este es EL método para mucílagos)</Check>
            <Check>Enzimas activas</Check>
            <Check>Antocianinas y flavonoides muy termolábiles</Check>
            <Check>Algunos glucósidos que se activan enzimáticamente en frío</Check>
            <Check>Compuestos de bajo peso molecular</Check>
            <LineDivider />
            <InfoBox title="Cuándo usarla">
              Principalmente para plantas mucilaginosas como malva, lino, llantén, aloe. También para extractos que conservarán enzimas activas.
            </InfoBox>
            <WarnBox title="⚠ Riesgo de contaminación">
              Sin alcohol ni calor el agua es un excelente medio de cultivo para bacterias y hongos. Una maceración acuosa sin conservar adecuadamente se contamina en horas a temperatura ambiente. Usar inmediatamente o refrigerar y consumir en 24 horas.
            </WarnBox>
          </AccordionItem>

          {/* 4 — Tintura alcohólica */}
          <AccordionItem id="tintura" title="4 · Tintura alcohólica" open={open === "tintura"} onToggle={() => toggle("tintura")}>
            <FiguraLibro num="4" titulo="Tintura" src="/biblioteca/metodos/lamina-4.png" prompt="Hierbas macerando en alcohol dentro de un frasco de vidrio ambar, una tintura herbal con gotero. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> Maceración del material vegetal en alcohol etílico de distintas graduaciones durante semanas. Es uno de los métodos de extracción más completos y versátiles.</P>
            <InfoBox title="Por qué el alcohol es tan buen solvente">
              El alcohol etílico es anfifílico — tiene una parte que ama el agua y otra que ama el aceite. Por eso extrae tanto compuestos hidrófilos como lipófilos. La graduación del alcohol determina qué extrae más.
            </InfoBox>
            <SubLabel>Graduaciones y qué extraen</SubLabel>
            <MiniTable
              headers={["Graduación", "Mejor para", "Ejemplos"]}
              rows={[
                ["30–40°", "Mucílagos, taninos hidrófilos, alcaloides básicos", "Plantas mucilaginosas"],
                ["50–60°", "Balance general — la mayoría de flavonoides y polifenoles", "Uso general"],
                ["70°", "Flavonoides, taninos, glucósidos, algunos aceites esenciales", "El más versátil"],
                ["90–96°", "Resinas, aceites esenciales, compuestos muy lipófilos", "Plantas resinosas"],
              ]}
            />
            <SubLabel>Proporción planta:solvente</SubLabel>
            <P>Plantas frescas: 1:1 a 1:2 · Plantas secas: 1:5 a 1:10. Las plantas frescas ya contienen agua que diluye el alcohol — se usa menos solvente. Las plantas secas absorben mucho solvente — se necesita más.</P>
            <P><strong style={{ color: "#c8a050" }}>Tiempo:</strong> Mínimo 2 semanas · Óptimo 4–6 semanas · Máximo 3 meses. Agitar o voltear el frasco cada 1–2 días.</P>
            <P><strong style={{ color: "#c8a050" }}>Temperatura:</strong> Ambiente, lugar oscuro. Nunca calor — el alcohol se evapora y pierde potencia.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Flavonoides y polifenoles</Check>
            <Check>Alcaloides</Check>
            <Check>Glucósidos</Check>
            <Check>Aceites esenciales (especialmente a 90°)</Check>
            <Check>Resinas</Check>
            <Check>Taninos</Check>
            <Check>La mayoría de los metabolitos secundarios en general</Check>
            <LineDivider />
            <GreenBox title="Proceso de transferencia de fase al tallow">
              Las tinturas alcohólicas se pueden incorporar al tallow mediante evaporación del alcohol. Se calienta el tallow a 45–50°C, se agrega la tintura gota a gota y se mantiene esa temperatura 20–40 minutos mientras el alcohol se evapora. Los activos extraídos quedan en el tallow. Este es uno de los métodos que usamos en El Floema.
            </GreenBox>
            <WarnBox title="⚠ Alcohol residual">
              El alcohol residual en la tintura introduce agua al tallow. Hay que evaporar bien antes de envasar para evitar contaminación.
            </WarnBox>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Conservación:</strong> Con alcohol de 40° o más: 2–5 años. Es el extracto vegetal con mayor vida útil.</P>
          </AccordionItem>

          {/* 5 — Macerado glicérico */}
          <AccordionItem id="glicerico" title="5 · Macerado glicérico" open={open === "glicerico"} onToggle={() => toggle("glicerico")}>
            <FiguraLibro num="5" titulo="Macerado glicérico" src="/biblioteca/metodos/lamina-5.png" prompt="Hierbas macerando en glicerina, un macerado glicerico, liquido dorado y espeso en un frasco. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> Maceración en glicerina vegetal pura o mezclada con agua. Es la alternativa al alcohol para quienes buscan productos sin etanol.</P>
            <InfoBox title="La glicerina como solvente">
              La glicerina es un poliol — tiene múltiples grupos hidroxilo que le permiten disolver compuestos de polaridad media. No es tan versátil como el alcohol pero es completamente segura, no volátil y tiene propiedades humectantes propias.
            </InfoBox>
            <SubLabel>Proporción de glicerina</SubLabel>
            <P>Glicerina pura: para activos muy hidrófilos. Glicerina 60–80% + agua 20–40%: el más usado, mejor espectro de extracción. La mezcla con agua mejora la extracción de flavonoides y polifenoles.</P>
            <P><strong style={{ color: "#c8a050" }}>Planta:solvente:</strong> 1:5 a 1:10 para plantas secas.</P>
            <P><strong style={{ color: "#c8a050" }}>Tiempo:</strong> 4–8 semanas. Más lento que la tintura alcohólica.</P>
            <P><strong style={{ color: "#c8a050" }}>Temperatura:</strong> Puede acelerarse a 35–40°C. Más de 40°C empieza a degradar activos termolábiles.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Flavonoides hidrosolubles</Check>
            <Check>Taninos</Check>
            <Check>Polifenoles generales</Check>
            <Check>Algunos glucósidos</Check>
            <Check>Compuestos de polaridad media</Check>
            <LineDivider />
            <SubLabel>Ventajas sobre la tintura</SubLabel>
            <P>Sin alcohol — apto para productos para niños y pieles sensibles. La glicerina es humectante — el extracto ya tiene propiedades hidratantes propias. Más seguro para uso interno en personas que evitan el alcohol.</P>
            <SubLabel>Limitaciones</SubLabel>
            <P>No extrae resinas ni compuestos muy lipófilos. Menor espectro que la tintura alcohólica. Vida útil menor sin conservante (6–12 meses).</P>
            <InfoBox title="En formulación cosmética">
              Los macerados glicéricos son perfectos para syndets líquidos, geles y emulsiones. Al ser hidrosolubles se integran fácilmente en la fase acuosa.
            </InfoBox>
          </AccordionItem>

          {/* 6 — Oleomacerado */}
          <AccordionItem id="oleomacerado" title="6 · Maceración en aceite — oleomacerado" open={open === "oleomacerado"} onToggle={() => toggle("oleomacerado")}>
            <FiguraLibro num="6" titulo="Oleomacerado" src="/biblioteca/metodos/lamina-6.png" prompt="Flores infusionando en aceite dentro de un frasco de vidrio al sol, un oleomacerado solar. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> Maceración del material vegetal en aceite vegetal. Extrae exclusivamente los compuestos lipófilos — los que se disuelven en grasa.</P>
            <SubLabel>Aceites para macerar</SubLabel>
            <MiniTable
              headers={["Aceite", "Características", "Mejor para"]}
              rows={[
                ["Oliva", "Rico en oleico, estable, extrae bien", "Uso general, plantas mediterráneas"],
                ["Girasol", "Ligero, neutro, económico", "Cuando no quieres que el aceite aporte sabor u olor"],
                ["Almendra dulce", "Suave, emoliente, buena penetración", "Productos faciales"],
                ["Jojoba", "Técnicamente cera, muy estable", "Plantas aromáticas, larga conservación"],
                ["Coco fraccionado", "Muy estable, no solidifica", "Clima cálido, extracción eficiente"],
              ]}
            />
            <SubLabel>Métodos de oleomaceración</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Método frío — sol y luna:</strong> Material seco en aceite, frasco cerrado, expuesto al sol 4–6 semanas. El calor solar (30–40°C) acelera la extracción sin destruir activos.</P>
            <P><strong style={{ color: "#c8a050" }}>Método caliente — baño maría:</strong> Material seco en aceite a 40–60°C durante 4–8 horas. Resultado similar al método frío en menos tiempo. Temperatura crítica — nunca sobre 65°C.</P>
            <P><strong style={{ color: "#c8a050" }}>Método de vaporera (El Floema):</strong> Material seco en aceite o tallow a 40–45°C durante 6–8 horas. Control preciso de temperatura. Ideal para plantas aromáticas cuyos aceites esenciales se preservan mejor bajo 45°C.</P>
            <P><strong style={{ color: "#c8a050" }}>Tiempo:</strong> Método frío: 4–6 semanas · Baño maría 50°C: 4–8 horas · Vaporera 40–45°C: 6–8 horas.</P>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Carotenoides (beta-caroteno, luteína)</Check>
            <Check>Terpenos lipófilos (triterpenos, sesquiterpenos)</Check>
            <Check>Clorofila</Check>
            <Check>Aceites esenciales (parcialmente)</Check>
            <Check>Vitaminas liposolubles (A, E, K)</Check>
            <Check>Esteroles vegetales</Check>
            <Check>Flavonoides lipófilos</Check>
            <SubLabel>Qué no extrae</SubLabel>
            <Check mark="✗">Taninos (hidrófilos)</Check>
            <Check mark="✗">Mucílagos</Check>
            <Check mark="✗">Flavonoides muy hidrófilos</Check>
            <Check mark="✗">Vitamina C</Check>
            <LineDivider />
            <WarnBox title="⚠ Error más común">
              Usar planta fresca. La humedad de la planta fresca genera fermentación y moho en el aceite. Siempre usar planta completamente seca — dejarla secar hasta que cruje al doblarla.
            </WarnBox>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Conservación:</strong> 6–12 meses según el aceite base. Agregar vitamina E (0.5%) como antioxidante prolonga la vida útil.</P>
          </AccordionItem>

          {/* 7 — Tallow */}
          <AccordionItem id="tallow" title="7 · Maceración en sebo — oleomacerado en tallow" open={open === "tallow"} onToggle={() => toggle("tallow")}>
            <FiguraLibro num="7" titulo="Maceración en tallow" src="/biblioteca/metodos/lamina-7.png" prompt="Hierbas infusionando en sebo derretido a bano maria, oleomacerado en tallow. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> El método estrella de El Floema. Es el mismo principio que el oleomacerado en aceite pero usando tallow purificado como solvente extractor.</P>
            <InfoBox title="Por qué el tallow es diferente a los aceites vegetales">
              Su composición de ácidos grasos — ~45% oleico, ~27% palmítico, ~20% esteárico — es casi idéntica a la composición de la barrera lipídica del estrato córneo humano. Esto tiene dos consecuencias: extrae activos con mayor afinidad por compuestos de polaridad intermedia, y al aplicar el tallow macerado en la piel los activos están disueltos en un vehículo que la piel reconoce como propio — la penetración de los activos es significativamente mayor que con aceites vegetales.
            </InfoBox>
            <SubLabel>Proceso completo en vaporera</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Preparación:</strong> Purifica el tallow (funde, cuela, solidifica, elimina la capa inferior acuosa — repetir 2–3 veces hasta que quede completamente blanco). Seca completamente las plantas hasta que crujen al doblarlas. Trocea o muele groseramente el material vegetal.</P>
            <ol style={{ paddingLeft: "1.5rem", marginBottom: "14px" }}>
              {[
                "Coloca el tallow en frasco de vidrio de boca ancha",
                "Funde a 45°C en vaporera",
                "Agrega las plantas secas — proporción 1:5 a 1:8 (20g de planta por 100–160g de tallow)",
                "Mantén a 40–45°C durante 6–8 horas mínimo — hasta 12 horas para plantas densas",
                "Agita o remueve suavemente cada 30–60 minutos",
                "La temperatura de 40–45°C es crítica: suficiente para fundir el tallow y abrir las células vegetales — no tan alta para destruir aceites esenciales ni compuestos termolábiles",
                "Cuela mientras está caliente y líquido — a través de lienzo fino o muselina",
                "Exprime bien el material vegetal — contiene mucho tallow cargado de activos",
                "Agrega vitamina E inmediatamente (0.5%) mientras aún está líquido",
                "Vierte en frascos de vidrio oscuro",
                "Deja solidificar a temperatura ambiente — no refrigerar inmediatamente",
                "Etiqueta con fecha, planta usada, proporción y método",
              ].map((step, i) => (
                <li key={i} style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: "6px" }}>{step}</li>
              ))}
            </ol>
            <LineDivider />
            <SubLabel>Qué extrae bien</SubLabel>
            <Check>Terpenos lipófilos — especialmente triterpenos antiinflamatorios</Check>
            <Check>Aceites esenciales (a 40–45°C se retienen mejor que a temperaturas mayores)</Check>
            <Check>Carotenoides</Check>
            <Check>Vitaminas liposolubles</Check>
            <Check>Esteroles y fitoesteroles</Check>
            <Check>Clorofila</Check>
            <Check>Compuestos de polaridad intermedia que no extraen bien ni el agua ni el aceite</Check>
            <LineDivider />
            <SubLabel>Combinaciones probadas en El Floema</SubLabel>
            <MiniTable
              headers={["Macerado", "Plantas", "Objetivo"]}
              rows={[
                ["Reparador", "Matico 40% + Pitra 40% + Milenrama 20%", "Cicatrizante, antimicrobiano"],
                ["Antiinflamatorio", "Arrayán 35% + Milenrama 35% + Clavo 20% + Canela 10%", "Dolor, inflamación"],
                ["Facial piel madura", "Arrayán 40% + Maqui 40% + Chilco 20%", "Antioxidante, antiedad"],
              ]}
            />
            <WarnBox title="⚠ Precauciones específicas">
              Nunca usar plantas frescas. No superar 50°C — el aceite esencial del clavo y la canela se evapora. El maqui (antocianinas) se degrada algo con el calor — es normal que el color sea menos intenso que en extracción acuosa fría. Etiquetar siempre — los tallow macerados son muy similares en apariencia.
            </WarnBox>
          </AccordionItem>

          {/* 8 — Hidrodestilación */}
          <AccordionItem id="hidrodestilacion" title="8 · Hidrodestilación — aceites esenciales e hidrolatos" open={open === "hidrodestilacion"} onToggle={() => toggle("hidrodestilacion")}>
            <FiguraLibro num="8" titulo="Hidrodestilación" src="/biblioteca/metodos/lamina-8.png" prompt="Un alambique de cobre destilando aceite esencial e hidrolato a partir de plantas, con vapor. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> El método por excelencia para obtener aceites esenciales e hidrolatos. Consiste en pasar vapor de agua a través del material vegetal, arrastrar los compuestos volátiles, y luego condensar el vapor separando el aceite esencial del agua aromatizada.</P>
            <SubLabel>Dos productos de un proceso</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Aceite esencial:</strong> La fracción lipófila. Contiene los compuestos más volátiles y aromáticos. Es extremadamente concentrado — se necesitan cientos o miles de gramos de planta para obtener pocos mililitros. Por eso son caros y potentes.</P>
            <P><strong style={{ color: "#c8a050" }}>Hidrolato (agua floral):</strong> La fracción acuosa. Contiene los compuestos volátiles hidrosolubles que no pasan al aceite esencial. Es mucho más suave, listo para usar en piel sin diluir. Tiene propiedades propias diferentes al aceite esencial de la misma planta.</P>
            <SubLabel>Proceso artesanal con alambique</SubLabel>
            <ol style={{ paddingLeft: "1.5rem", marginBottom: "14px" }}>
              {[
                "Material vegetal fresco o seco en el alambique sobre una rejilla",
                "Agua debajo del material — se calienta y genera vapor",
                "El vapor sube a través del material vegetal arrastrando los compuestos volátiles",
                "El vapor cargado pasa por un serpentín refrigerado por agua fría",
                "Condensa en el recipiente final",
                "El aceite esencial flota sobre el hidrolato — se separa con embudo de decantación",
              ].map((step, i) => (
                <li key={i} style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: "6px" }}>{step}</li>
              ))}
            </ol>
            <InfoBox>
              El vapor de agua es 100°C pero el contacto con el material vegetal baja la temperatura efectiva. Los aceites esenciales se destilan a temperaturas menores que su punto de ebullición por la acción del vapor — esto permite destilar compuestos que se degradarían a su temperatura de ebullición real.
            </InfoBox>
            <LineDivider />
            <SubLabel>Qué extrae</SubLabel>
            <Check>Monoterpenos volátiles</Check>
            <Check>Sesquiterpenos semi-volátiles</Check>
            <Check>Alcoholes terpénicos (linalol, geraniol, mentol)</Check>
            <Check>Ésteres aromáticos y aldehídos aromáticos</Check>
            <Check>Fenoles volátiles (eugenol, timol, carvacrol)</Check>
            <SubLabel>Qué NO extrae</SubLabel>
            <Check mark="✗">Polifenoles no volátiles</Check>
            <Check mark="✗">Taninos, mucílagos</Check>
            <Check mark="✗">Triterpenos de alto peso molecular</Check>
            <Check mark="✗">La mayoría de los flavonoides</Check>
            <LineDivider />
            <GreenBox title="Hidrolatos de El Floema disponibles">
              Hidrolato de laurel — antimicrobiano, tonificante. Hidrolato de eucalipto+triwe+pitra+maqui — expectorante, purificante.
            </GreenBox>
            <WarnBox title="⚠ Calidad del hidrolato">
              Un hidrolato verdadero es el subproducto de una destilación real — no es agua con aceite esencial disuelto. Tiene compuestos propios que no están en el aceite esencial. Exigir siempre que el hidrolato provenga de destilación real.
            </WarnBox>
          </AccordionItem>

          {/* 9 — Enfleurage */}
          <AccordionItem id="enfleurage" title="9 · Enfleurage" open={open === "enfleurage"} onToggle={() => toggle("enfleurage")}>
            <FiguraLibro num="9" titulo="Enfleurage" src="/biblioteca/metodos/lamina-9.png" prompt="Petalos de flores prensados sobre un marco con grasa para enfleurage, extrayendo el perfume. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> El método más antiguo y artesanal de todos. Históricamente usado en Grecia y el sur de Francia para capturar el perfume de flores delicadas que no soportan el calor — jazmín, rosa, azahar, nardo, violeta.</P>
            <InfoBox title="El principio">
              Las flores frescas se colocan sobre una capa de grasa neutra purificada (históricamente manteca de cerdo o vacuno purificada — exactamente como el tallow de El Floema). La grasa absorbe los compuestos aromáticos de las flores a temperatura ambiente. Las flores se reemplazan cada 24–72 horas por flores frescas hasta que la grasa está saturada de aroma. El producto se llama pomada de enfleurage.
            </InfoBox>
            <SubLabel>Dos variantes</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Enfleurage frío (la original):</strong> Grasa a temperatura ambiente. Las flores se colocan sobre marcos de vidrio untados con grasa (chassis). Se apilan y se dejan 24–72 horas. Se retiran las flores marchitas, se agregan flores frescas, y se repite durante semanas.</P>
            <P><strong style={{ color: "#c8a050" }}>Enfleurage caliente:</strong> Grasa fundida a 40–60°C con las flores sumergidas durante horas. Más rápido pero menos delicado. Destruye algunos compuestos termolábiles pero es más accesible artesanalmente.</P>
            <InfoBox title="Extracción posterior">
              La pomada de enfleurage puede usarse directamente como cosmético o se puede extraer con alcohol de alta graduación — el alcohol disuelve los compuestos aromáticos dejando la grasa. Al evaporar el alcohol se obtiene el absoluto.
            </InfoBox>
            <LineDivider />
            <SubLabel>Qué extrae</SubLabel>
            <Check>Compuestos aromáticos extremadamente delicados</Check>
            <Check>Moléculas que se destruyen completamente con cualquier calor</Check>
            <Check>El perfume más fiel a la flor viva — ningún otro método lo iguala</Check>
            <PurpleBox title="Relevancia para El Floema">
              El tallow purificado es el solvente histórico del enfleurage. Usar tallow para capturar aromas de flores del bosque valdiviano — chilco, arrayán en flor, flores nativas — es una conexión directa con la tradición más antigua de la perfumería botánica. Y el producto resultante es directamente aplicable en cosmética sin ningún procesamiento adicional.
            </PurpleBox>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Limitación:</strong> Extremadamente laborioso. No escalable industrialmente. Para pequeñas cantidades de productos de alta gama es incomparable en calidad aromática.</P>
          </AccordionItem>

          {/* 10 — Cataplasma */}
          <AccordionItem id="cataplasma" title="10 · Cataplasma" open={open === "cataplasma"} onToggle={() => toggle("cataplasma")}>
            <FiguraLibro num="10" titulo="Cataplasma" src="/biblioteca/metodos/lamina-10.png" prompt="Una cataplasma de hierbas frescas machacadas aplicada sobre un pano, compresa herbal. Estilo grabado cientifico del siglo XIX, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, estetica de grimorio botanico, sin texto ni letras ni marca de agua." />
            <P><strong style={{ color: "#c8a050" }}>Qué es:</strong> El método más directo de todos — aplicar el material vegetal directamente sobre la piel sin extracción previa. No hay solvente intermediario. La planta actúa en contacto directo con el tejido.</P>
            <SubLabel>Tipos</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Planta fresca machacada:</strong> La planta fresca se tritura hasta obtener una pasta y se aplica directamente. El machacado rompe las células vegetales liberando todos los activos — enzimas activas, jugos celulares, aceites esenciales, activos hidrosolubles y lipófilos simultáneamente.</P>
            <P><strong style={{ color: "#c8a050" }}>Cocida:</strong> Material hervido o cocido al vapor hasta ablandar, luego aplicado caliente (temperatura tolerable). El calor dilata los poros y aumenta la absorción de los activos.</P>
            <P><strong style={{ color: "#c8a050" }}>De harina medicinal:</strong> Planta seca molida en polvo mezclada con agua caliente u otro ligante hasta formar pasta. Permite usar plantas que no están disponibles frescas.</P>
            <P><strong style={{ color: "#c8a050" }}>De arcilla medicinal:</strong> Arcilla mezclada con infusión o decocción de planta. La arcilla actúa como vehículo que mantiene la humedad y los activos en contacto prolongado.</P>
            <LineDivider />
            <SubLabel>Mecanismo de acción</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Oclusión:</strong> El material crea una barrera que aumenta la hidratación local del estrato córneo. La piel hidratada es más permeable — los activos penetran mejor.</P>
            <P><strong style={{ color: "#c8a050" }}>Calor local:</strong> Aumenta la vasodilatación local y la permeabilidad cutánea.</P>
            <P><strong style={{ color: "#c8a050" }}>Enzimas activas:</strong> En la cataplasma de planta fresca las enzimas vegetales están activas. Algunas tienen acción directa sobre tejidos inflamados o infectados. En la planta cocida este efecto se pierde.</P>
            <P><strong style={{ color: "#c8a050" }}>Espectro completo:</strong> No hay selección. La sinergia entre todos los compuestos es máxima.</P>
            <LineDivider />
            <SubLabel>Plantas de El Floema para cataplasma</SubLabel>
            <MiniTable
              headers={["Planta", "Tipo", "Uso tradicional documentado"]}
              rows={[
                ["Matico", "Hojas frescas machacadas", "Heridas, cortes, picaduras, infecciones cutáneas"],
                ["Pitra", "Hojas frescas o cocidas", "Heridas, micosis, afecciones de piel"],
                ["Milenrama", "Hojas y flores frescas", "Heridas sangrantes, contusiones, inflamación"],
                ["Arrayán", "Hojas cocidas tibias", "Dolores reumáticos, afecciones articulares"],
                ["Triwe", "Corteza cocida", "Uso mapuche documentado en etnobotánica"],
                ["Chilco", "Hojas frescas", "Uso tradicional antiinflamatorio"],
              ]}
            />
            <P><strong style={{ color: "#c8a050" }}>Tiempo de aplicación:</strong> Cataplasma fresca: 20–60 min · Caliente: 15–30 min · No dejar más de 2 horas — riesgo de irritación por contacto prolongado.</P>
            <WarnBox title="⚠ Precauciones">
              Verificar que la planta sea la correcta — error de identificación es riesgo real. Lavar bien la zona antes y después. No usar en heridas abiertas profundas sin supervisión. No usar en quemaduras de segundo o tercer grado. Algunas plantas frescas pueden irritar piel sensible — hacer prueba en zona pequeña primero. El calor excesivo puede agravar inflamaciones agudas.
            </WarnBox>
          </AccordionItem>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />

        {/* ── Tabla comparativa ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>Tabla comparativa completa</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ background: "rgba(200,160,80,0.08)" }}>
                  {["Método", "Solvente", "Temperatura", "Tiempo", "Qué extrae mejor", "Para cosmética"].map((h, i) => (
                    <th key={i} style={{ border: "1px solid rgba(200,160,80,0.18)", padding: "7px 9px", color: "#c8a050", fontWeight: 600, fontSize: "0.8rem", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Infusión", "Agua", "70–95°C", "5–15 min", "Flavonoides, mucílagos", "Hidrolato improvisado"],
                  ["Decocción", "Agua", "100°C", "15–45 min", "Taninos, polisacáridos", "Base para tónicos"],
                  ["Maceración fría", "Agua", "Ambiente", "8–24 h", "Mucílagos, enzimas", "Uso inmediato"],
                  ["Tintura", "Alcohol 30–96°", "Ambiente", "4–6 sem", "Espectro completo", "Transferencia a tallow"],
                  ["Macerado glicérico", "Glicerina+agua", "35–40°C", "4–8 sem", "Flavonoides, polifenoles", "Syndets, emulsiones"],
                  ["Oleomacerado", "Aceite vegetal", "40–60°C", "4–8 h / 4–6 sem", "Terpenos, carotenoides", "Directamente en fórmula"],
                  ["Macerado en tallow", "Tallow", "40–45°C", "6–12 h", "Terpenos + penetración superior", "Directamente ungüento"],
                  ["Hidrodestilación", "Vapor de agua", "100°C vapor", "Variable", "Compuestos volátiles", "AE + hidrolatos"],
                  ["Enfleurage", "Grasa/tallow", "Ambiente–60°C", "Semanas", "Aromáticos delicados", "Pomada directa"],
                  ["Cataplasma", "Sin solvente", "Variable", "20–60 min", "Todo el espectro", "Uso medicinal directo"],
                ].map((row, i) => (
                  <tr key={i} style={{ background: i % 2 === 1 ? "rgba(200,160,80,0.02)" : "transparent" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ border: "1px solid rgba(200,160,80,0.12)", padding: "7px 9px", fontSize: "0.84rem", lineHeight: 1.55, color: "#d4c4a0" }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />

        {/* ── El método de El Floema ── */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>El método de El Floema — por qué elegimos el tallow</h2>
          <P>El tallow no es solo una base cosmética en El Floema — es el solvente extractor principal. Esta elección tiene base científica real.</P>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>1. Temperatura de trabajo óptima</strong></p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El tallow funde a 40–45°C — exactamente la temperatura donde los aceites esenciales se preservan, las células vegetales se abren y los activos se liberan sin degradación. Es como si la planta y el tallow tuvieran la misma temperatura de conversación.</p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>2. Composición biomimética</strong></p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Su perfil de ácidos grasos similar al sebo humano significa que extrae selectivamente los activos con mayor afinidad por la barrera cutánea. No es coincidencia — es química.</p>
          </div>
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>3. Producto listo</strong></p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El oleomacerado en tallow es ya un cosmético terminado. No hay que añadir base, no hay que emulsionar, no hay que procesar más. La planta y el tallow se convierten directamente en el ungüento.</p>
          </div>
          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>4. Sinergia de activos</strong></p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El tallow aporta sus propios ácidos grasos bioactivos — el ácido palmitoleico (omega-7) presente en el sebo humano y escaso en aceites vegetales. Los activos de la planta y los del tallow actúan juntos sobre la misma barrera cutánea.</p>
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />

        {/* ── Errores más comunes ── */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>Errores más comunes que destruyen los activos</h2>
          {[
            { n: "1", title: "Planta fresca en aceite o tallow", body: "El agua de la planta fresca genera fermentación, moho y contaminación. Siempre secar completamente primero. La planta seca debe crujir al doblarla." },
            { n: "2", title: "Temperatura demasiado alta en oleomacerado", body: "Sobre 65°C los aceites esenciales se evaporan y los flavonoides termolábiles se degradan. La regla es nunca pasar de 60°C y mantener lo más cerca posible de 40–45°C." },
            { n: "3", title: "Infusión sin tapar", body: "Los aceites esenciales se pierden completamente con el vapor. Siempre tapar durante el reposo." },
            { n: "4", title: "Tintura sin agitar", body: "Sin agitación regular los activos que ya pasaron al alcohol crean una zona saturada alrededor del material vegetal que frena la extracción. Agitar cada 1–2 días." },
            { n: "5", title: "Colar en frío el oleomacerado", body: "Si el tallow solidificó antes de colar se pierde gran parte del extracto impregnado en las plantas. Siempre colar mientras está líquido y caliente." },
            { n: "6", title: "No secar el material antes de destilar", body: "El material muy húmedo diluye el hidrolato y reduce el rendimiento del aceite esencial. Marchitar el material fresco 12–24 horas antes de destilar mejora el rendimiento." },
            { n: "7", title: "Guardar extractos acuosos sin conservante", body: "Una infusión, decocción o maceración acuosa sin conservante es un caldo de cultivo. Usar en 24–48 horas o conservar adecuadamente." },
            { n: "8", title: "Confundir hidrolato con agua con aceite esencial", body: "Son productos completamente distintos con propiedades distintas. El hidrolato real viene de destilación. El agua con aceite esencial disuelto puede irritar si el aceite no está correctamente solubilizado." },
          ].map(({ n, title, body }) => (
            <div key={n} style={{ marginBottom: 14, display: "flex", gap: "0.85rem", alignItems: "flex-start" }}>
              <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.75rem", color: "rgba(200,160,80,0.4)", letterSpacing: "0.1em", minWidth: "1.2rem", paddingTop: "0.2rem" }}>{n}</span>
              <div>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", marginBottom: 2 }}><strong style={{ color: "#c8a050" }}>{title}</strong></p>
                <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "rgba(212,196,160,0.8)", marginBottom: 0 }}>{body}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
