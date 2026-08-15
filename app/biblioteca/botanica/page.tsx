"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";
import { FiguraLibro } from "@/components/biblioteca/FiguraLibro";

function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-bot">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-bot)" />
    </svg>
  );
}

function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: "12px", ...style }}>{children}</p>;
}
function SubLabel({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: "10px" }}>{children}</p>;
}
function FamilyTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.97rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: "12px", borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>{children}</h3>;
}
function OrganTitle({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: "14px", borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>{children}</h3>;
}
function Check({ children, mark = "✓" }: { children: React.ReactNode; mark?: string }) {
  const color = mark === "✓" ? "#5a7a3a" : "#c8a050";
  return (
    <div style={{ marginBottom: "7px" }}>
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
function CodeBlock({ children }: { children: React.ReactNode }) {
  return (
    <pre style={{ fontFamily: "monospace", fontSize: "0.82rem", lineHeight: 1.8, color: "#d4c4a0", background: "rgba(200,160,80,0.04)", border: "1px solid rgba(200,160,80,0.1)", borderRadius: "0.35rem", padding: "0.75rem 1rem", marginBottom: "14px", overflowX: "auto", whiteSpace: "pre-wrap" }}>{children}</pre>
  );
}
function LineDivider() {
  return <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "20px 0" }} />;
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

const SECTIONS = ["intro","reino","celula","tejidos","organos-1","organos-2","clasificacion","familias","ciclos","valdiviano"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function Botanica() {
  const [open, setOpen] = useState<SectionId | null>("intro");
  const toggle = (id: SectionId) => setOpen(prev => prev === id ? null : id);

  return (
    <main className="parchment-bg" style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <GrainOverlay />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px, 6vh, 64px) clamp(24px, 5vw, 56px)" }}>
        <BackButton />

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "2.2rem", color: "#c8a050", letterSpacing: "0.14em", marginBottom: 8 }}>
            Botánica
          </h1>
          <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "1.1rem", fontStyle: "italic", color: "#d4c4a0" }}>
            El lenguaje de las plantas
          </p>
        </header>

        <section style={{ marginBottom: 40 }}>

          {/* 1 — Qué es la botánica */}
          <AccordionItem id="intro" title="¿Qué es la botánica?" open={open === "intro"} onToggle={() => toggle("intro")}>
            <FiguraLibro num="1" titulo="La botanica" src="/biblioteca/botanica/lamina-1.svg" prompt="Una mesa de botanico antiguo con un herbario abierto de plantas prensadas, una lupa de bronce, un mortero y frascos de vidrio con hierbas. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>La botánica es la ciencia que estudia las plantas — su estructura, funcionamiento, clasificación, distribución, evolución y relaciones con otros organismos. Es una de las ciencias más antiguas de la humanidad porque entender las plantas ha sido una cuestión de supervivencia desde siempre.</P>
            <P>Las plantas son la base de toda la cadena alimentaria terrestre. Son la fuente de la mayoría de los medicamentos que usamos — el 25% de los fármacos modernos derivan directamente de compuestos vegetales y otro 25% son análogos sintéticos de moléculas vegetales. Son la materia prima de la cosmética natural.</P>
            <InfoBox title="La botánica y la medicina">
              Durante la mayor parte de la historia humana la botánica y la medicina fueron la misma disciplina. Los primeros médicos eran herboristas. Las primeras farmacopeas eran listas de plantas. El conocimiento botánico era literalmente el conocimiento de la salud. Hoy esa conexión se recupera desde dos frentes — la etnobotánica que documenta el conocimiento tradicional antes de que desaparezca, y la fitoquímica que valida científicamente ese conocimiento ancestral.
            </InfoBox>
            <PurpleBox title="La botánica y El Floema">
              Conocer botánica no es un lujo académico para una formuladora. Es lo que te permite identificar correctamente una planta en el campo, entender por qué ciertas partes son más activas que otras, saber en qué momento del año cosechar, y comunicar con precisión lo que está en tus productos. Una formuladora que conoce botánica no dice "usé matico". Dice "usé hojas jóvenes de Piper aduncum L. cosechadas en primavera antes de la floración, con alta concentración de flavonoides en el limbo foliar". Esa diferencia es la diferencia entre cosmética artesanal y cosmética botánica científica.
            </PurpleBox>
          </AccordionItem>

          {/* 2 — El reino vegetal */}
          <AccordionItem id="reino" title="El reino vegetal — qué hace única a una planta" open={open === "reino"} onToggle={() => toggle("reino")}>
            <FiguraLibro num="2" titulo="El reino vegetal" src="/biblioteca/botanica/lamina-2.png" prompt="Una planta majestuosa iluminada por un rayo de sol captando la luz con su clorofila, simbolo de la vida vegetal. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>Las plantas pertenecen al reino Plantae. Lo que las distingue fundamentalmente de todos los demás organismos es su capacidad de realizar <strong style={{ color: "#c8a050" }}>fotosíntesis</strong> — convertir energía lumínica en energía química almacenada en glucosa usando dióxido de carbono y agua. Esta capacidad autótrofa tiene consecuencias profundas.</P>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Son organismos sésiles — no se mueven.</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>No pueden escapar de los depredadores, buscar un ambiente mejor ni encontrar pareja moviéndose. Toda su adaptación al mundo es química y estructural. Esto es exactamente lo que genera la enorme diversidad de metabolitos secundarios que aprovechamos.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Tienen pared celular rígida.</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>A diferencia de las células animales, las células vegetales están rodeadas por una pared de celulosa. Esto les da estructura, las protege y determina la forma de los tejidos. También es lo que hace que las plantas puedan crecer hacia arriba contra la gravedad.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Tienen cloroplastos.</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>Los organelos donde ocurre la fotosíntesis. Contienen clorofila — el pigmento verde que absorbe la luz roja y azul (refleja la verde, por eso las plantas son verdes) y convierte esa energía en ATP y NADPH para sintetizar glucosa.</p>
            </div>
            <div style={{ marginBottom: 0 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Tienen vacuola central grande.</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>Una vesícula que puede ocupar hasta el 90% del volumen de la célula adulta. Almacena agua, nutrientes, metabolitos secundarios y productos de desecho. Es el "depósito" de la célula vegetal.</p>
            </div>
          </AccordionItem>

          {/* 3 — La célula vegetal */}
          <AccordionItem id="celula" title="La célula vegetal — estructura detallada" open={open === "celula"} onToggle={() => toggle("celula")}>
            <FiguraLibro num="3" titulo="La celula vegetal" src="/biblioteca/botanica/lamina-3.png" prompt="Diagrama cientifico de una celula vegetal en corte con sus organulos etiquetados: pared celular, membrana, cloroplastos, vacuola central y nucleo. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>Entender la célula vegetal es entender por qué la extracción de activos funciona como funciona.</P>
            <InfoBox title="Pared celular">
              Formada principalmente por celulosa (polisacárido de glucosa en cadenas largas). Es rígida pero no impermeable — tiene poros llamados plasmodesmos que conectan células adyacentes. La pared celular es lo que hay que romper para liberar los activos en una extracción — por eso el molido, el machacado o el calor mejoran la eficiencia extractiva. Tres capas: lámina media (une células, rica en pectinas) · pared primaria (celulosa + hemicelulosa, flexible) · pared secundaria (celulosa muy organizada, rígida).
            </InfoBox>
            <InfoBox title="Membrana plasmática">
              Bajo la pared celular. Bicapa lipídica igual que en células animales. Regula qué entra y qué sale de la célula. Es la primera barrera que deben cruzar los solventes extractores.
            </InfoBox>
            <InfoBox title="Cloroplastos">
              Organelos con doble membrana. Contienen tilacoides (membranas internas apiladas donde ocurre la fase lumínica de la fotosíntesis) y estroma (fluido interno donde ocurre el ciclo de Calvin). Tienen su propio ADN circular — evidencia de que fueron bacterias fotosintéticas que se integraron simbioticamente en células eucariotas hace ~1.500 millones de años.
            </InfoBox>
            <InfoBox title="Vacuola central">
              El gran almacén. Contiene la savia celular — agua con azúcares disueltos, ácidos orgánicos, pigmentos (antocianinas, flavonoides), metabolitos secundarios y productos de desecho. Cuando muerdes una fruta y sale jugo — es el contenido de las vacuolas de las células del mesocarpo.
            </InfoBox>
            <LineDivider />
            <SubLabel>Plastidios especializados</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Cromoplastos</strong> — contienen carotenoides, dan color amarillo, naranja y rojo a flores y frutos.</P>
            <P><strong style={{ color: "#c8a050" }}>Amiloplastos</strong> — almacenan almidón en raíces y semillas.</P>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Elaioplastos</strong> — almacenan aceites, presentes en células secretoras.</P>
          </AccordionItem>

          {/* 4 — Tejidos vegetales */}
          <AccordionItem id="tejidos" title="Tejidos vegetales" open={open === "tejidos"} onToggle={() => toggle("tejidos")}>
            <FiguraLibro num="4" titulo="Tejidos vegetales" src="/biblioteca/botanica/lamina-4.png" prompt="Corte transversal de un tallo visto al microscopio mostrando el xilema y el floema, la epidermis y tricomas glandulares. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>Los tejidos son grupos de células con estructura y función similar. Entender los tejidos es entender dónde se concentran los activos.</P>

            <FamilyTitle>Tejidos meristemáticos</FamilyTitle>
            <P>Son los tejidos de crecimiento — células indiferenciadas con capacidad de dividirse. No tienen activos secundarios en grandes cantidades pero son el origen de todos los demás tejidos.</P>
            <P><strong style={{ color: "#c8a050" }}>Meristema apical:</strong> En el extremo de tallos y raíces. Responsable del crecimiento en longitud.</P>
            <P><strong style={{ color: "#c8a050" }}>Meristema lateral (cámbium):</strong> En tallos y raíces de plantas leñosas. Responsable del crecimiento en grosor.</P>
            <P><strong style={{ color: "#c8a050" }}>Meristema intercalar:</strong> En nudos de gramíneas. Permite que el tallo vuelva a crecer si se corta.</P>

            <LineDivider />
            <FamilyTitle>Tejidos dérmicos</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Epidermis:</strong> La "piel" de la planta. Una sola capa de células muy apretadas, cubiertas por cutícula de cera que reduce la pérdida de agua. Contiene los estomas — poros microscópicos que controlan el intercambio gaseoso.</P>
            <InfoBox title="Tricomas glandulares — las glándulas de la planta">
              Estructuras especializadas de la epidermis fundamentales en farmacognosia. Los tricomas glandulares secretan aceites esenciales, resinas y metabolitos secundarios directamente a la superficie. Son las "glándulas" de las plantas aromáticas. Cuando frotas una hoja de albahaca o matico y huele — estás rompiendo tricomas glandulares. Los tricomas no glandulares son pelos de protección mecánica.
            </InfoBox>
            <P><strong style={{ color: "#c8a050" }}>Peridermis:</strong> Reemplaza la epidermis en plantas leñosas maduras. Forma la corteza externa. Contiene células muertas impregnadas de suberina (corcho) que son impermeables. La corteza de los árboles es peridermis.</P>

            <LineDivider />
            <FamilyTitle>Tejidos vasculares</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Xilema:</strong> Transporta agua y minerales desde las raíces hacia arriba. Formado por células muertas con paredes engrosadas que forman tubos huecos. El movimiento es unidireccional hacia arriba impulsado por la transpiración (tensión-cohesión) y la presión radicular.</P>
            <GreenBox title="El floema — por qué se llama así esta marca">
              El floema transporta los azúcares producidos en la fotosíntesis desde las hojas hacia el resto de la planta. Formado por células vivas — los tubos cribosos. El movimiento puede ser en ambas direcciones según las necesidades de la planta. El nombre El Floema viene exactamente de este tejido — es la vía por donde viaja la savia elaborada, la energía vital de la planta que va desde donde se produce hacia donde se necesita. Una metáfora perfecta para una marca que lleva los activos vegetales desde la planta hasta la piel.
            </GreenBox>

            <LineDivider />
            <FamilyTitle>Tejidos fundamentales</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Parénquima:</strong> El tejido más abundante. Células vivas, paredes delgadas, grandes vacuolas. Tejido de reserva y metabolismo — donde se realiza la fotosíntesis (parénquima clorofílico) y donde se almacenan almidón, agua, aceites y metabolitos secundarios. La pulpa de los frutos es parénquima.</P>
            <P><strong style={{ color: "#c8a050" }}>Colénquima:</strong> Tejido de soporte en órganos jóvenes. Células vivas con paredes desigualmente engrosadas. Flexible — permite que tallos jóvenes se doblen sin romperse. Los "hilos" del apio son colénquima.</P>
            <P><strong style={{ color: "#c8a050" }}>Esclerénquima:</strong> Tejido de soporte en órganos maduros. Células muertas con paredes muy engrosadas e impregnadas de lignina. Rígido e inflexible. Las fibras textiles del lino y el cáñamo son esclerénquima.</P>

            <LineDivider />
            <FamilyTitle>Tejidos secretores — los más relevantes para los activos botánicos</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Células secretoras aisladas:</strong> Células individuales con metabolitos secundarios en su vacuola. Las células con aceite esencial de las hojas de laurel se ven a contraluz como puntitos translúcidos.</P>
            <P><strong style={{ color: "#c8a050" }}>Cavidades secretoras:</strong> Espacios entre células llenos de aceite esencial o resina. Las "glándulas" visibles en hojas de cítricos cuando las doblas y sale aceite son cavidades secretoras.</P>
            <P><strong style={{ color: "#c8a050" }}>Canales resiníferos:</strong> Tubos continuos llenos de resina que recorren toda la planta. Especialmente en coníferas — cuando un pino se daña la resina fluye para sellar la herida.</P>
            <P><strong style={{ color: "#c8a050" }}>Laticíferos:</strong> Células o vasos que contienen látex — una emulsión coloidal compleja con alcaloides, enzimas y terpenos. La amapola, el diente de león y el árbol del caucho tienen laticíferos.</P>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Hidátodos:</strong> Poros especializados en los bordes de las hojas por donde se expulsa agua líquida (gutación). Las gotas en las puntas de las hojas al amanecer son a menudo gutación, no rocío.</P>
          </AccordionItem>

          {/* 5 — Órganos I */}
          <AccordionItem id="organos-1" title="Los órganos — raíz, tallo y hoja" open={open === "organos-1"} onToggle={() => toggle("organos-1")}>
            <FiguraLibro num="5" titulo="Raiz, tallo y hoja" src="/biblioteca/botanica/lamina-5.png" prompt="Lamina anatomica de una planta completa con la raiz, el tallo y la hoja etiquetados, mostrando nervaduras y sistema radicular. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />

            <OrganTitle>La raíz</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Anclar la planta, absorber agua y minerales del suelo, almacenar reservas.</P>
            <SubLabel>Tipos</SubLabel>
            <P><strong style={{ color: "#c8a050" }}>Pivotante:</strong> una raíz principal gruesa con raíces laterales (zanahoria, diente de león, valeriana). <strong style={{ color: "#c8a050" }}>Fibrosa:</strong> muchas raíces similares sin una principal (gramíneas). <strong style={{ color: "#c8a050" }}>Tuberosa:</strong> engrosada para almacenamiento (remolacha, rábano). <strong style={{ color: "#c8a050" }}>Rizoma:</strong> tallo subterráneo horizontal que parece raíz (jengibre, cúrcuma, iris).</P>
            <SubLabel>Activos que concentra</SubLabel>
            <Check>Alcaloides (valeriana, genciana, coptis)</Check>
            <Check>Triterpenos (ginseng, regaliz, equinácea)</Check>
            <Check>Polisacáridos inulínicos (equinácea, diente de león)</Check>
            <Check>Taninos condensados (ratania, roble)</Check>
            <InfoBox title="Cuándo cosechar">
              Otoño o inicio de primavera — cuando la planta ha terminado su ciclo aéreo y las reservas están máximas en la raíz. Nunca en plena floración — la energía está en la parte aérea. Método recomendado: decocción (raíces duras) o maceración alcohólica prolongada.
            </InfoBox>

            <LineDivider />
            <OrganTitle>El tallo</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Soporte, transporte de agua y nutrientes (xilema y floema), almacenamiento en algunas plantas.</P>
            <SubLabel>Corteza del tallo leñoso — la parte más interesante</SubLabel>
            <Check>Taninos (sauce, roble, arrayán)</Check>
            <Check>Glucósidos salicílicos (sauce — precursores de la aspirina)</Check>
            <Check>Alcaloides (quina — quinina)</Check>
            <Check>Aceites esenciales (canela — la corteza es la parte usada)</Check>
            <InfoBox title="Cuándo cosechar">
              Primavera — cuando el flujo de savia es máximo y la corteza se separa fácilmente del leño.
            </InfoBox>

            <LineDivider />
            <OrganTitle>La hoja</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Fotosíntesis, intercambio gaseoso, transpiración.</P>
            <P><strong style={{ color: "#c8a050" }}>Estructura:</strong> Limbo (lámina plana con epidermis + mesófilo) · Pecíolo (une la hoja al tallo) · Nervadura (haces vasculares visibles).</P>
            <P><strong style={{ color: "#c8a050" }}>Mesófilo:</strong> Parénquima en empalizada (capa superior, alta densidad de cloroplastos — donde ocurre la mayor parte de la fotosíntesis) + Parénquima esponjoso (capa inferior, grandes espacios intercelulares para el intercambio gaseoso).</P>
            <InfoBox title="Por qué las hojas jóvenes tienen más activos">
              Las hojas jóvenes son las más vulnerables a herbívoros e insectos. Aún no tienen la dureza mecánica que desarrollarán — su defensa es química. Por eso concentran más flavonoides, taninos, aceites esenciales y alcaloides que las hojas maduras.
            </InfoBox>
            <SubLabel>Activos que concentra</SubLabel>
            <Check>Aceites esenciales (en tricomas glandulares y células secretoras)</Check>
            <Check>Flavonoides y polifenoles</Check>
            <Check>Clorofila y carotenoides</Check>
            <Check>Mucílagos (especialmente en la epidermis)</Check>
            <Check>Vitaminas C y K</Check>
            <InfoBox title="Cuándo cosechar">
              Primavera tardía a verano temprano — antes de la floración completa. En ese momento la energía de la planta está en las hojas y la concentración de activos es máxima. Después de la floración la planta destina sus recursos a las semillas.
            </InfoBox>
          </AccordionItem>

          {/* 6 — Órganos II */}
          <AccordionItem id="organos-2" title="Los órganos — flor, fruto y semilla" open={open === "organos-2"} onToggle={() => toggle("organos-2")}>
            <FiguraLibro num="6" titulo="Flor, fruto y semilla" src="/biblioteca/botanica/lamina-6.png" prompt="Anatomia de una flor abierta en corte con sus partes, un fruto seccionado y una semilla germinando. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />

            <OrganTitle>La flor</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Reproducción sexual de la planta — atraer polinizadores y producir semillas.</P>
            <P><strong style={{ color: "#c8a050" }}>Estructura:</strong> Sépalos (protegen el botón) · Pétalos (atraen polinizadores) · Estambres (producen polen) · Pistilo (estigma + estilo + ovario).</P>
            <InfoBox title="Por qué las flores concentran compuestos especiales">
              Las flores necesitan atraer polinizadores específicos — por eso producen pigmentos llamativos (flavonoides, carotenoides, antocianinas) y aromas específicos (aceites esenciales, ésteres volátiles). Esos mismos compuestos son los que aprovechamos.
            </InfoBox>
            <SubLabel>Activos que concentra</SubLabel>
            <Check>Aceites esenciales más delicados (jazmín, rosa, azahar, lavanda)</Check>
            <Check>Flavonoides y pigmentos</Check>
            <Check>Mucílagos (flores de malva, tilo)</Check>
            <Check>Polifenoles antioxidantes</Check>
            <InfoBox title="Cuándo cosechar">
              Al inicio de la apertura — antes de la fecundación completa. Los aceites esenciales son máximos en el botón y en la flor recién abierta. Temprano en la mañana, después del rocío pero antes del calor del mediodía. Los aceites esenciales son más concentrados en las primeras horas de la mañana. Método: infusión a baja temperatura (70-80°C), enfleurage para las más delicadas, hidrodestilación para aceites esenciales.
            </InfoBox>

            <LineDivider />
            <OrganTitle>El fruto</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Proteger y dispersar las semillas.</P>
            <P><strong style={{ color: "#c8a050" }}>Partes del fruto carnoso:</strong> Exocarpo (la "piel" exterior) · Mesocarpo (la pulpa comestible) · Endocarpo (la capa interna que rodea la semilla — a veces leñosa como el hueso del durazno).</P>
            <SubLabel>Activos que concentra</SubLabel>
            <Check>Antocianinas y flavonoides (frutos oscuros — maqui, arándano)</Check>
            <Check>Vitamina C (rosa mosqueta, escaramujo)</Check>
            <Check>Carotenoides (frutos naranjos y rojos)</Check>
            <Check>Aceites esenciales en el exocarpo (cítricos)</Check>
            <Check>Taninos (frutos inmaduros)</Check>
            <InfoBox title="Cuándo cosechar">
              Para antocianinas y vitamina C: madurez plena. Para taninos: fruto inmaduro o semimaduro. Para aceites esenciales del exocarpo: madurez plena, expresión en frío.
            </InfoBox>

            <LineDivider />
            <OrganTitle>La semilla</OrganTitle>
            <P><strong style={{ color: "#c8a050" }}>Función:</strong> Contener y proteger el embrión vegetal durante la dispersión y latencia.</P>
            <P><strong style={{ color: "#c8a050" }}>Estructura:</strong> Testa (cubierta protectora dura e impermeable) · Endosperma (tejido de reserva nutritiva) · Embrión (la planta en miniatura — radícula, plúmula, cotiledones).</P>
            <SubLabel>Activos que concentra</SubLabel>
            <Check>Aceites grasos de alta calidad (lino, onagra, rosa mosqueta)</Check>
            <Check>Proteínas y enzimas</Check>
            <Check>Glucosinolatos (mostaza, rábano)</Check>
            <Check>Saponinas</Check>
            <WarnBox title="⚠ Precaución con semillas">
              Muchas semillas contienen compuestos tóxicos en concentraciones significativas. La toxicidad de semillas es mucho más común que la de hojas o raíces. Siempre verificar antes de usar semillas medicinalmente.
            </WarnBox>
          </AccordionItem>

          {/* 7 — Clasificación */}
          <AccordionItem id="clasificacion" title="La clasificación botánica" open={open === "clasificacion"} onToggle={() => toggle("clasificacion")}>
            <FiguraLibro num="7" titulo="La clasificacion botanica" src="/biblioteca/botanica/lamina-7.png" prompt="Un arbol taxonomico ramificado estilo linneano, de reino a especie, con hojas y nombres cientificos en cada rama. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>El sistema de clasificación botánica organiza la enorme diversidad de plantas en categorías jerárquicas que reflejan sus relaciones evolutivas.</P>
            <SubLabel>La jerarquía</SubLabel>
            <CodeBlock>{"Reino → División → Clase → Orden → Familia → Género → Especie"}</CodeBlock>
            <SubLabel>Ejemplo con el matico</SubLabel>
            <CodeBlock>{`Reino:    Plantae
División: Magnoliophyta (plantas con flores)
Clase:    Magnoliopsida (dicotiledóneas)
Orden:    Piperales
Familia:  Piperaceae
Género:   Piper
Especie:  Piper aduncum`}</CodeBlock>
            <LineDivider />
            <SubLabel>Cómo leer un nombre científico</SubLabel>
            <P>El nombre científico tiene siempre dos partes — <strong style={{ color: "#c8a050" }}>nomenclatura binomial</strong> creada por Linneo en el siglo XVIII:</P>
            <InfoBox title="Género + epíteto específico">
              Piper aduncum L. — Piper es el género (siempre en mayúscula, en cursiva). aduncum es el epíteto específico (siempre en minúscula, en cursiva). L. es la abreviación del autor que describió la especie (en este caso Linneo).
            </InfoBox>
            <GreenBox title="Por qué importa el nombre científico">
              Los nombres comunes son locales y ambiguos. "Matico" puede referirse a Piper aduncum en Chile o a Buddleja globosa en Perú — plantas completamente diferentes. El nombre científico es universal y preciso. En cosmética seria siempre se especifica el nombre científico.
            </GreenBox>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Variedades y cultivares:</strong> Rosa canina var. blantii (variedad botánica natural) · Lavandula angustifolia 'Hidcote' (cultivar — variedad seleccionada por cultivo).</P>
          </AccordionItem>

          {/* 8 — Familias */}
          <AccordionItem id="familias" title="Las grandes familias de plantas medicinales" open={open === "familias"} onToggle={() => toggle("familias")}>
            <FiguraLibro num="8" titulo="Las grandes familias" src="/biblioteca/botanica/lamina-8.png" prompt="Muestrario de familias botanicas medicinales con ejemplares de matico, milenrama y chilco dispuestos como catalogo de herbario. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />

            <FamilyTitle>Piperaceae — la familia del matico</FamilyTitle>
            <P>Plantas herbáceas o arbustivas tropicales y subtropicales. Hojas simples alternas, frecuentemente aromáticas por aceites esenciales en células secretoras. Flores muy pequeñas en espigas densas sin pétalos.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Piperamidas y amidas (piperina de la pimienta negra)</Check>
            <Check>Aceites esenciales (fenilpropanoides, terpenos)</Check>
            <Check>Flavonoides (artemetina, apigenina en matico)</Check>
            <GreenBox title="El matico en la familia">
              Piper aduncum es la especie más representativa de los Piperaceae en el Cono Sur. Normalmente una familia tropical — el matico evolucionó en un ambiente completamente diferente desarrollando una química única dentro de su familia. Sus hojas contienen aceite esencial rico en dilapiol, flavonoides (artemetina) y mucílagos con potente actividad cicatrizante y antimicrobiana.
            </GreenBox>
            <P><strong style={{ color: "#c8a050" }}>Otras especies:</strong> Piper nigrum (pimienta negra) · Piper methysticum (kava) · Piper betle (betel).</P>

            <LineDivider />
            <FamilyTitle>Myrtaceae — la familia del arrayán y la pitra</FamilyTitle>
            <P>Una de las familias más importantes en el bosque valdiviano. Árboles y arbustos con hojas simples opuestas, generalmente coriáceas (duras y brillantes), con glándulas de aceite esencial visibles a trasluz como puntitos translúcidos. Flores con muchos estambres vistosos. Frutos generalmente bayas.</P>
            <P><strong style={{ color: "#c8a050" }}>Distribución:</strong> América del Sur, Australia y el Pacífico sur. Es la familia dominante en el bosque templado del hemisferio sur — tanto en el bosque valdiviano chileno como en el bosque australiano. Herencia compartida de Gondwana.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Aceites esenciales (1,8-cineol, alfa-pineno, linalol)</Check>
            <Check>Taninos elágicos e hidrolizables</Check>
            <Check>Flavonoides</Check>
            <Check>Triterpenos (ácido ursólico, ácido oleanólico)</Check>
            <GreenBox>
              Los Myrtaceae son el corazón del bosque valdiviano. El arrayán con su corteza canela característica y la pitra con sus frutos negros son dos de los árboles más emblemáticos del sur de Chile. La familia entera tiene una firma química dominada por taninos y aceites esenciales antimicrobianos.
            </GreenBox>
            <P><strong style={{ color: "#c8a050" }}>Otras especies:</strong> Eucalyptus spp. · Melaleuca alternifolia (árbol de té) · Psidium guajava (guayaba) · Eugenia caryophyllata (clavo de olor).</P>

            <LineDivider />
            <FamilyTitle>Aristotelaceae — la familia del maqui</FamilyTitle>
            <P>El maqui (Aristotelia chilensis) fue reclasificado en su propia familia Aristotelaceae. Es endémico de Chile y Argentina — no existe naturalmente en ningún otro lugar del planeta.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Antocianinas (delfidina-3-glucósido y cianidina-3-glucósido — la mayor concentración conocida en cualquier fruto)</Check>
            <Check>Polifenoles totales altísimos</Check>
            <Check>Flavonoides (quercetina, kaempferol)</Check>
            <Check>Ácido elágico</Check>
            <PurpleBox title="Relevancia para El Floema">
              El maqui tiene el ORAC (capacidad antioxidante) más alto de cualquier fruto conocido — superior al açaí, al arándano y a cualquier otro superfruto comercializado. Es endémico de nuestra región y prácticamente desconocido fuera de Chile. Eso es exactamente lo que lo hace estratégico para El Floema.
            </PurpleBox>

            <LineDivider />
            <FamilyTitle>Asteraceae (Compositae) — la familia de la milenrama</FamilyTitle>
            <P>La familia de plantas con flores más grande del mundo — más de 23.000 especies. Su característica definitoria es la inflorescencia en capítulo — lo que parece una "flor" es en realidad decenas o cientos de flores pequeñas (flósculos) agrupadas en un receptáculo. El "pétalo" de una margarita es una flor ligulada completa. El centro amarillo son decenas de flósculos tubulosos.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Lactonas sesquiterpénicas (artemisinina de la artemisia)</Check>
            <Check>Flavonoides (apigenina, luteolina, quercetina)</Check>
            <Check>Aceites esenciales (azuleno en manzanilla y milenrama)</Check>
            <Check>Polisacáridos (inulina en raíces de achicoria)</Check>
            <WarnBox title="⚠ Alcaloides tóxicos en algunas">
              Algunas Asteraceae contienen alcaloides pirrolizidínicos muy tóxicos (senecio, coltsfoot). Siempre identificar la especie con precisión antes de usar.
            </WarnBox>
            <GreenBox title="La milenrama en la familia">
              Achillea millefolium es una de las plantas medicinales más documentadas del mundo. Su nombre hace referencia al héroe griego Aquiles que según la leyenda la usaba para tratar las heridas de sus soldados. Contiene azuleno (sesquiterpeno antiinflamatorio formado durante la destilación), flavonoides y lactonas. Hemostática, antiinflamatoria y cicatrizante.
            </GreenBox>
            <P><strong style={{ color: "#c8a050" }}>Otras especies:</strong> Matricaria chamomilla (manzanilla alemana) · Calendula officinalis (caléndula) · Echinacea purpurea (equinácea) · Helianthus annuus (girasol).</P>

            <LineDivider />
            <FamilyTitle>Onagraceae — la familia del chilco</FamilyTitle>
            <P>Hierbas, arbustos o árboles pequeños. Flores generalmente vistosas. Alta diversidad en el bosque valdiviano.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Taninos</Check>
            <Check>Flavonoides</Check>
            <Check>Antocianinas (responsables del color rojo-morado)</Check>
            <Check>Mucílagos</Check>
            <GreenBox title="El chilco en su familia">
              Fuchsia magellanica es el arbusto más emblemático del bosque valdiviano. Sus flores rojas y moradas son inconfundibles. En medicina mapuche se usaban las hojas para tratar inflamaciones y afecciones de la piel. Sus antocianinas lo hacen especialmente interesante como antioxidante.
            </GreenBox>
            <P><strong style={{ color: "#c8a050" }}>Otras especies:</strong> Oenothera biennis (onagra) · Epilobium angustifolium (epilobio).</P>

            <LineDivider />
            <FamilyTitle>Lamiaceae — la familia de las aromáticas</FamilyTitle>
            <P>Una de las familias más importantes en cosmética y medicina. Característica diagnóstica: tallos cuadrangulares en sección transversal. Hojas opuestas, frecuentemente aromáticas por abundantes tricomas glandulares.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Aceites esenciales abundantes (monoterpenos y sesquiterpenos)</Check>
            <Check>Diterpenos (ácido carnósico en romero y salvia)</Check>
            <Check>Flavonoides (luteolina, apigenina)</Check>
            <Check>Ácido rosmarínico — potente antioxidante</Check>
            <P><strong style={{ color: "#c8a050" }}>Especies:</strong> Rosmarinus officinalis · Lavandula angustifolia · Salvia officinalis · Thymus vulgaris · Mentha piperita · Origanum vulgare · Melissa officinalis · Ocimum basilicum.</P>

            <LineDivider />
            <FamilyTitle>Rosaceae — la familia de las rosas</FamilyTitle>
            <P>Enorme familia con gran diversidad de formas. Flores generalmente con 5 pétalos y muchos estambres. Frutos muy variados — manzana, pera, frutilla, rosa mosqueta, cereza, almendra.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Taninos hidrolizables (ácido elágico, ácido gálico)</Check>
            <Check>Flavonoides (quercetina, rutina, catequinas)</Check>
            <Check>Vitamina C altísima en frutos (rosa mosqueta)</Check>
            <Check>Aceites esenciales (rosa)</Check>
            <WarnBox title="⚠ Glucósidos cianogénicos">
              Presentes en semillas de muchas Rosaceae (durazno, almendra, cereza). Las semillas no deben consumirse en grandes cantidades.
            </WarnBox>
            <P><strong style={{ color: "#c8a050" }}>Especies:</strong> Rosa canina (rosa mosqueta) · Rosa damascena (rosa de Damasco) · Rubus idaeus (frambuesa) · Crataegus spp. (espino).</P>

            <LineDivider />
            <FamilyTitle>Apiaceae (Umbelliferae) — la familia de las umbelíferas</FamilyTitle>
            <P>Hierbas aromáticas con inflorescencias en umbela — flores dispuestas como los radios de una sombrilla. Tallos frecuentemente huecos.</P>
            <WarnBox title="⚠ Familia peligrosa — identificación crítica">
              Contiene algunas de las plantas más tóxicas del mundo (cicuta) junto con las más usadas en cocina (zanahoria, perejil, hinojo, cilantro). Varias especies comestibles se parecen mucho a la cicuta. La identificación correcta es absolutamente crítica.
            </WarnBox>
            <SubLabel>Química característica</SubLabel>
            <Check>Aceites esenciales (anetol en hinojo, apiole en perejil)</Check>
            <Check mark="◐">Furanocumarinas — fotosensibilizantes potentes</Check>
            <Check>Flavonoides y cumarinas</Check>
            <P><strong style={{ color: "#c8a050" }}>Especies:</strong> Foeniculum vulgare (hinojo) · Daucus carota (zanahoria) · Petroselinum crispum (perejil) · Coriandrum sativum (cilantro).</P>

            <LineDivider />
            <FamilyTitle>Fabaceae (Leguminosae) — la familia de las leguminosas</FamilyTitle>
            <P>La tercera familia de plantas con flores más grande. Fruto siempre una legumbre (vaina). Muchas especies con nódulos radiculares fijadores de nitrógeno.</P>
            <SubLabel>Química característica</SubLabel>
            <Check>Isoflavonas (fitoestrógenos — soja, trébol rojo)</Check>
            <Check>Taninos condensados</Check>
            <Check>Saponinas (regaliz)</Check>
            <Check>Alcaloides en algunas (lupanina en lupino)</Check>
            <P><strong style={{ color: "#c8a050" }}>Especies:</strong> Glycyrrhiza glabra (regaliz) · Trifolium pratense (trébol rojo) · Glycine max (soja) · Astragalus membranaceus (astrágalo).</P>

            <LineDivider />
            <FamilyTitle>Ranunculaceae — la familia de los ranúnculos</FamilyTitle>
            <WarnBox title="⚠ La mayoría son tóxicas">
              Contienen alcaloides y glucósidos potencialmente tóxicos. Uso medicinal siempre con supervisión. Nunca usar sin identificación segura.
            </WarnBox>
            <SubLabel>Química característica</SubLabel>
            <Check>Alcaloides isoquinolínicos (berberina en mahonia e hidrastis)</Check>
            <Check>Lactonas irritantes (protoanemonina)</Check>
            <Check>Diterpenos tóxicos (acónito — muy tóxico)</Check>
            <P><strong style={{ color: "#c8a050" }}>Especies:</strong> Hydrastis canadensis (sello de oro — berberina) · Cimicifuga racemosa (cimicifuga) · Pulsatilla vulgaris.</P>
          </AccordionItem>

          {/* 9 — Ciclos */}
          <AccordionItem id="ciclos" title="Ciclos de vida y cosecha" open={open === "ciclos"} onToggle={() => toggle("ciclos")}>
            <FiguraLibro num="9" titulo="Ciclos y cosecha" src="/biblioteca/botanica/lamina-9.png" prompt="Una rueda de las estaciones alrededor de una planta que brota, florece, fructifica y descansa, con fases lunares como calendario de cosecha. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />

            <FamilyTitle>Tipos de plantas según ciclo de vida</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Plantas anuales:</strong> Completan su ciclo completo en un año. La energía se destina principalmente a la reproducción rápida. Ejemplos: albahaca, cilantro, caléndula, amapola. Cosecha: durante el periodo de máxima actividad — antes de la floración completa para hojas, durante la floración para flores.</P>
            <P><strong style={{ color: "#c8a050" }}>Plantas bianuales:</strong> Tardan dos años en completar su ciclo. El primer año crecimiento vegetativo — acumulan reservas. El segundo año florecen, producen semillas y mueren. Las raíces del primer año son generalmente las más ricas en activos. Ejemplos: zanahoria, perejil, digital, equinácea.</P>
            <P><strong style={{ color: "#c8a050" }}>Plantas perennes:</strong> Viven más de dos años. Las herbáceas perennes mueren en la parte aérea cada otoño y rebrotan de las raíces en primavera. Las leñosas mantienen tallo y ramas durante años. Cosecha: variable según la parte — hojas en primavera-verano, raíces en otoño, corteza en primavera.</P>

            <LineDivider />
            <FamilyTitle>El ciclo circadiano de los activos</FamilyTitle>
            <P>Las concentraciones de activos varían durante el día — un hecho poco conocido pero con implicaciones prácticas importantes.</P>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Aceites esenciales — máximos temprano (6–10am)</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>La síntesis nocturna no tiene pérdida por evaporación. Al calentarse el sol los aceites empiezan a evaporarse. Excepción: algunas flores nocturnas tienen pico aromático al atardecer.</p>
            </div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Flavonoides y antocianinas — la luz UV activa su síntesis</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>Máximos en horas de máxima radiación (mediodía). Pero la cosecha temprana es mejor porque la temperatura es menor y el material se degrada más lento después de la cosecha.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 4 }}><strong style={{ color: "#c8a050" }}>Mucílagos — máximos en la mañana</strong></p>
              <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem" }}>El agua disponible es máxima. Disminuyen durante el día cuando la transpiración reduce el contenido hídrico.</p>
            </div>
            <GreenBox title="Recomendación práctica">
              Cosechar siempre en la mañana, después de que el rocío se haya secado pero antes del calor del mediodía. Es la regla empírica que maximiza la calidad para la mayoría de los activos.
            </GreenBox>

            <LineDivider />
            <FamilyTitle>El ciclo estacional</FamilyTitle>
            <P><strong style={{ color: "#c8a050" }}>Primavera:</strong> Rebrote · Hojas jóvenes (alta concentración de activos defensivos) · Corteza (fácil de separar, máxima concentración de glucósidos) · Flores tempranas.</P>
            <P><strong style={{ color: "#c8a050" }}>Verano:</strong> Floración plena (cosechar flores en el pico) · Hojas maduras (concentración estable de polifenoles) · Frutos inmaduros (máximos en taninos) · Aceites esenciales altos en plantas aromáticas en floración.</P>
            <P><strong style={{ color: "#c8a050" }}>Otoño:</strong> Frutos maduros (máximo en antocianinas, vitamina C, azúcares) · Raíces y rizomas (máximo en reservas y activos de almacenamiento) · Las plantas comienzan a retirar nutrientes de las hojas — concentración baja en hojas.</P>
            <P style={{ marginBottom: 0 }}><strong style={{ color: "#c8a050" }}>Invierno:</strong> Corteza (taninos y glucósidos estables) · Yemas (concentración de aceites esenciales y resinas) · Poco recomendable para la mayoría de partes aéreas.</P>
          </AccordionItem>

          {/* 10 — Bosque valdiviano */}
          <AccordionItem id="valdiviano" title="El bosque valdiviano — por qué sus plantas son únicas" open={open === "valdiviano"} onToggle={() => toggle("valdiviano")}>
            <FiguraLibro num="10" titulo="El bosque valdiviano" src="/biblioteca/botanica/lamina-10.png" prompt="El bosque templado valdiviano entre la niebla: canelos, arrayanes de corteza rojiza, helechos gigantes y musgo, con luz filtrandose entre los arboles. Estilo lamina de herbario del siglo XIX y grabado botanico antiguo, tinta sepia y dorado envejecido sobre fondo verde muy oscuro, trazo fino y detallado, etiquetas en serif elegante, estetica de grimorio botanico, sin texto moderno ni marca de agua." />
            <P>El bosque valdiviano o bosque templado lluvioso del sur de Chile es uno de los ecosistemas más extraordinarios y menos conocidos del planeta. Comprender su singularidad es comprender por qué las plantas de El Floema son irreemplazables.</P>

            <InfoBox title="Un remanente del supercontinente Gondwana">
              Hace 180 millones de años todos los continentes del hemisferio sur formaban un supercontinente llamado Gondwana. Cuando se dividió hace ~65 millones de años Chile, Australia, Nueva Zelanda y el sur de África se separaron llevando consigo la misma flora ancestral. Por eso encontramos familias enteras en común entre el bosque valdiviano y el bosque australiano — los Myrtaceae (arrayán, pitra / eucalipto, árbol de té), los Proteaceae, los Nothofagaceae (ñire, roble pellín / fagus australiano). No es coincidencia — es herencia compartida de Gondwana. Esta antigüedad evolutiva significa que las plantas valdivianas tienen linajes de decenas de millones de años de evolución en el mismo ecosistema.
            </InfoBox>
            <InfoBox title="Aislamiento geográfico — el laboratorio natural">
              El bosque valdiviano está geográficamente aislado por el desierto de Atacama al norte, la cordillera de los Andes al este, el Océano Pacífico al oeste y el frío antártico al sur. Este aislamiento ha generado un altísimo nivel de endemismo — especies que no existen en ningún otro lugar del planeta. El maqui, la luma, el copihue y el ulmo son endémicos. Para El Floema esto es estratégico — estos activos no se pueden replicar con ingredientes de otros orígenes porque las plantas simplemente no existen en otros lugares.
            </InfoBox>
            <InfoBox title="Biodiversidad excepcional bajo alta presión biótica">
              El bosque valdiviano recibe entre 2000 y 4000mm de lluvia anual — uno de los niveles más altos del mundo fuera de los trópicos. Esa humedad extrema significa alta presión de patógenos fúngicos y bacterianos. Las plantas que sobreviven en ese ambiente desarrollaron defensas antimicrobianas y antifúngicas excepcionales. El matico, el arrayán, la pitra y el triwe viven en condiciones donde el 90% de las plantas del mundo morirían de infecciones fúngicas — y sobreviven gracias a sus metabolitos secundarios. Esos metabolitos defensivos contra hongos del suelo valdiviano son exactamente los que tienen actividad antifúngica y antimicrobiana en cosmética.
            </InfoBox>

            <LineDivider />
            <SubLabel>Las plantas de El Floema y su singularidad</SubLabel>
            {[
              { nombre: "Matico (Piper aduncum)", texto: "Único representante significativo de los Piperaceae en el bosque templado del hemisferio sur. Normalmente una familia tropical — el matico evolucionó en un ambiente completamente diferente desarrollando una química única dentro de su familia." },
              { nombre: "Arrayán (Luma apiculata)", texto: "El árbol de corteza canela con flores blancas perfumadas es uno de los Myrtaceae templados más australes del mundo. Su bark chemistry — dominada por taninos elágicos — refleja millones de años de evolución en el bosque húmedo valdiviano." },
              { nombre: "Maqui (Aristotelia chilensis)", texto: "Único en su familia. La mayor concentración de antocianinas de cualquier fruto conocido. Endémico. Irreemplazable." },
              { nombre: "Pitra (Myrceugenia exsucca)", texto: "Un Myrtaceae que crece con los pies en el agua — literal. Coloniza las orillas de ríos y vegas húmedas del sur de Chile. Su adaptación a suelos anegados y alta presión fúngica generó metabolitos antimicrobianos especialmente potentes." },
              { nombre: "Triwe (Dasyphyllum diacanthoides)", texto: "Conocido también como trevo. Un arbusto de la familia Asteraceae endémico del bosque valdiviano. En medicina mapuche documentada tiene uso como antiinflamatorio y para afecciones respiratorias." },
              { nombre: "Chilco (Fuchsia magellanica)", texto: "La fuschia silvestre del fin del mundo. Crece desde Chiloé hasta Tierra del Fuego. Sus flores son polinizadas por colibríes — una coevolución única. Sus antocianinas rojas y moradas son el color del bosque valdiviano en otoño." },
              { nombre: "Milenrama (Achillea millefolium)", texto: "La única planta de El Floema no endémica del bosque valdiviano — es cosmopolita. Pero su presencia en el sur de Chile es natural y su química es perfectamente complementaria a las plantas nativas. El azuleno formado durante su destilación es uno de los antiinflamatorios tópicos más efectivos conocidos." },
            ].map(({ nombre, texto }) => (
              <div key={nombre} style={{ marginBottom: 14 }}>
                <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><strong style={{ color: "#c8a050" }}>{nombre}</strong></p>
                <p style={{ fontSize: "0.93rem", lineHeight: 1.75, color: "#d4c4a0", paddingLeft: "1.2rem", marginBottom: 0 }}>{texto}</p>
              </div>
            ))}
          </AccordionItem>

        </section>
      </div>
    </main>
  );
}
