"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/BackButton";

/* ── Overlay de grano ─────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-bv">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-bv)" />
    </svg>
  );
}

/* ── Helpers de tipografía ───────────────────────────────────── */
function P({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: "12px", ...style }}>{children}</p>;
}
function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.97rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", margin: "18px 0 12px", borderLeft: "2px solid rgba(122,74,138,0.4)", paddingLeft: "0.75rem" }}>{children}</h3>
  );
}
function GreenBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(90,122,58,0.08)", border: "1px solid rgba(90,122,58,0.24)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(120,160,80,0.85)", marginBottom: "7px" }}>{title}</p>}
      <div style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.85)" }}>{children}</div>
    </div>
  );
}
function PurpleBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "rgba(122,74,138,0.09)", border: "1px solid rgba(122,74,138,0.26)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: "14px" }}>
      {title && <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(170,120,190,0.9)", marginBottom: "7px" }}>{title}</p>}
      <div style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.85)" }}>{children}</div>
    </div>
  );
}
function LineDivider() {
  return <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "20px 0" }} />;
}

/* ── Datos ───────────────────────────────────────────────────── */

const INTENCIONES = [
  {
    nombre: "Limpieza y purificación",
    color: "#8fae7a",
    hierbas: "Salvia, romero, tomillo, lavanda, laurel, cedro, palo santo, copal, oliban, ruda.",
    idea: "El humo arrastra la energía estancada. Se sahuma el espacio, las personas y los objetos nuevos.",
    vela: "Vela blanca",
  },
  {
    nombre: "Protección",
    color: "#c07a4a",
    hierbas: "Ruda, laurel, romero, tomillo, albahaca, salvia, canela, clavo, enebro, artemisa.",
    idea: "Guarda el hogar y aleja la negatividad, la envidia y la mala intención.",
    vela: "Vela negra o blanca",
  },
  {
    nombre: "Amor y reconciliación",
    color: "#c47a9a",
    hierbas: "Rosa, lavanda, albahaca, damiana, romero, canela, cardamomo, jazmín, verbena.",
    idea: "Ternura, autoestima, unión y armonía en los vínculos.",
    vela: "Vela rosa o roja",
  },
  {
    nombre: "Prosperidad y abundancia",
    color: "#c8a050",
    hierbas: "Albahaca, menta, canela, bergamota, salvia, laurel, jengibre, pachulí.",
    idea: "Crecimiento, éxito y dinero. La canela acelera y potencia otras intenciones.",
    vela: "Vela verde o dorada",
  },
  {
    nombre: "Claridad mental y meditación",
    color: "#7a9ac4",
    hierbas: "Lavanda, menta, salvia, laurel, artemisa, romero (memoria).",
    idea: "Enfoque, intuición y adivinación. Para estudiar, meditar o tomar decisiones.",
    vela: "Vela morada o azul",
  },
  {
    nombre: "Calma, sueño y paz",
    color: "#9a8ac4",
    hierbas: "Lavanda, manzanilla, melisa, valeriana, artemisa (bajo la almohada, para los sueños).",
    idea: "Serenar la mente, dormir mejor y descansar en paz.",
    vela: "Vela azul o lavanda",
  },
];

const PLANTAS_SUR = [
  {
    nombre: "Foye · Canelo",
    latin: "Drimys winteri",
    texto: "El árbol sagrado por excelencia, presente en las ceremonias más importantes (nguillatun, machitun). Sus ramas representan la paz; la machi lo usa para el contacto con el mundo de los espíritus. Corazón de un sahumerio de limpieza y protección.",
  },
  {
    nombre: "Triwe · Laurel chileno",
    latin: "Laurelia sempervirens",
    texto: "Junto al canelo, planta de comunicación espiritual usada por la machi. Aromática y protectora. Para sahumados de protección y claridad.",
  },
  {
    nombre: "Maqui · Kvlog",
    latin: "Aristotelia chilensis",
    texto: "Símbolo de buena intención y buenos augurios para el pueblo mapuche. Para rituales de intención positiva, abundancia y protección.",
  },
  {
    nombre: "Ruda",
    latin: "Ruta graveolens",
    texto: "La protectora por excelencia de la cultura mapuche-campesina chilena. Aleja las malas energías y la envidia, y potencia la claridad mental. Agua con sal para el hogar.",
  },
  {
    nombre: "Murta · Murtilla",
    latin: "Ugni molinae",
    texto: "Usada desde antes de la llegada de los españoles; asociada al bienestar y a la tierra. Hojas cicatrizantes.",
  },
  {
    nombre: "Araucaria · Pewen",
    latin: "Araucaria araucana",
    texto: "Árbol sagrado, patrimonio del pueblo pewenche. Símbolo de conexión con los ancestros y la montaña.",
  },
  {
    nombre: "Chilco",
    latin: "Fuchsia magellanica",
    texto: "Planta de los esteros y el agua, asociada a lo femenino y a los cursos de agua del sur.",
  },
];

const HIERBAS = [
  { n: "Tomillo", p: "Purificación (quemado como incienso), salud y protección; hojas bajo la almohada contra las pesadillas." },
  { n: "Lavanda", p: "Paz, amor, limpieza energética y sanación; eleva la conciencia y baja el estrés." },
  { n: "Laurel", p: "Protección y purificación de ambientes, adivinación, clarividencia y suerte (hoja seca)." },
  { n: "Romero", p: "Amor, memoria, limpieza energética (incienso o baño) y protección." },
  { n: "Albahaca", p: "Amor y reconciliación, fidelidad, fortuna en los negocios y protección." },
  { n: "Ruda", p: "Protección de personas y lugares; aleja maleficios, envidia y mala suerte." },
  { n: "Salvia", p: "Purificación (el humo limpia), prosperidad, sanación y resolución de problemas." },
  { n: "Menta", p: "Prosperidad, claridad mental y purificación." },
  { n: "Manzanilla", p: "Calma, meditación, prosperidad y purificación." },
  { n: "Canela", p: "Protección, prosperidad y pasión; acelera y potencia otros rituales." },
  { n: "Rosa · escaramujo", p: "Amor, adivinación, protección y curación psíquica." },
  { n: "Artemisa", p: "Sueños lúcidos, protección, adivinación y limpieza (se sahúma)." },
  { n: "Damiana", p: "Atracción, amor y adivinación." },
];

const RESINAS = [
  { n: "Oliban · incienso (frankincense)", p: "Purificación, elevación espiritual y conexión divina." },
  { n: "Mirra", p: "Protección, sanación y acompañamiento del duelo; se combina con el oliban." },
  { n: "Benjuí", p: "Prosperidad, purificación y calma." },
  { n: "Copal", p: "Limpieza (tradición mesoamericana), ofrenda y purificación de espacios." },
  { n: "Sándalo", p: "Meditación, paz y espiritualidad; fija los otros aromas." },
  { n: "Cedro", p: "Protección, limpieza y arraigo." },
  { n: "Palo santo", p: "Limpieza energética, buena suerte y aroma dulce." },
];

const VELAS = [
  { c: "Blanco", hex: "#efe8d2", s: "Pureza, paz, protección, limpieza, nuevos comienzos. Comodín: sirve para cualquier intención." },
  { c: "Rojo", hex: "#b5423a", s: "Amor pasional, energía, vitalidad, fuerza y valor." },
  { c: "Rosa", hex: "#c98aa0", s: "Amor suave, autoestima, ternura, amistad y reconciliación." },
  { c: "Verde", hex: "#5a7a3a", s: "Abundancia, prosperidad, crecimiento, salud y naturaleza." },
  { c: "Dorado / amarillo", hex: "#c8a050", s: "Éxito, riqueza, iluminación, alegría e intelecto. El sol." },
  { c: "Azul", hex: "#5a7a9a", s: "Calma, paz, comunicación, sanación y sabiduría." },
  { c: "Morado / violeta", hex: "#7a4a8a", s: "Espiritualidad, intuición, meditación profunda y poder psíquico." },
  { c: "Naranja", hex: "#c07a3a", s: "Creatividad, atracción, cambio y entusiasmo." },
  { c: "Negro", hex: "#2a2a2a", s: "Protección fuerte, destierro de energías negativas, transformación y cierre de ciclos." },
  { c: "Marrón", hex: "#7a5a3a", s: "Arraigo, hogar, animales, estabilidad y conexión con la tierra." },
];

/* ── Acordeón ─────────────────────────────────────────────────── */
function AccordionItem({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div style={{ border: `1px solid ${open ? "rgba(122,74,138,0.4)" : "rgba(200,160,80,0.1)"}`, borderRadius: "0.5rem", marginBottom: "0.5rem", background: open ? "rgba(122,74,138,0.05)" : "transparent", transition: "border-color 0.3s, background 0.3s", overflow: "hidden" }}>
      <button onClick={onToggle} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
        <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.78rem", letterSpacing: "0.16em", textTransform: "uppercase", color: open ? "#b98acb" : "#c8a050" }}>{title}</span>
        <span style={{ color: "rgba(170,120,190,0.7)", fontSize: "0.9rem", display: "inline-block", transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }}>→</span>
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

const SECTIONS = ["que-es", "correspondencias", "plantas-sur", "hierbas", "resinas", "velas", "inciensos", "inventario"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function BrujaVerde() {
  const [open, setOpen] = useState<SectionId | null>("que-es");
  const toggle = (id: SectionId) => setOpen((prev) => (prev === id ? null : id));

  return (
    <main className="parchment-bg" style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <GrainOverlay />
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px, 6vh, 64px) clamp(24px, 5vw, 56px)" }}>
        <BackButton label="← Volver al Grimorio" href="/" />

        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(170,120,190,0.7)", marginBottom: 14 }}>
            El Grimorio · Sendero Verde
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "clamp(2rem, 5vw, 2.8rem)", color: "#c8a050", letterSpacing: "0.14em", marginBottom: 10, textShadow: "0 0 55px rgba(122,74,138,0.35)" }}>
            Bruja Verde
          </h1>
          <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "1.12rem", fontStyle: "italic", color: "#d4c4a0", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
            El otro lado de la planta: su fuerza simbólica. Correspondencias, plantas sagradas del sur y el arte de los inciensos, sahumerios y velas rituales.
          </p>
        </header>

        {/* Encuadre respetuoso */}
        <PurpleBox title="Cómo leer esta sección">
          Aquí las plantas se miran desde la tradición, no desde la clínica. Es herencia cultural viva —sobre todo la
          mapuche— que compartimos con respeto y atribución, como saber simbólico y ritual, no como &ldquo;hechizos&rdquo; ni
          como tratamiento. <strong>Ninguna afirmación de esta página es médica.</strong>
        </PurpleBox>

        <section style={{ marginTop: 28 }}>
          {/* 1 — Qué es la brujería verde */}
          <AccordionItem title="¿Qué es la brujería verde?" open={open === "que-es"} onToggle={() => toggle("que-es")}>
            <P>
              La brujería verde es un camino de herbolaria y naturaleza: reconocer que cada planta, además de sus
              compuestos, carga una energía y un simbolismo que las culturas humanas le han atribuido durante milenios. La
              bruja verde trabaja con las estaciones, la luna, los cuatro elementos y, sobre todo, con las plantas de su
              propio territorio.
            </P>
            <P>
              En El Floema ese sendero se enraíza en el sur de Chile. En la cosmovisión mapuche las plantas medicinales
              —<em>lawen</em>— tienen un <em>newen</em>: una fuerza o energía propia que ayuda a restaurar el equilibrio
              entre cuerpo, espíritu y entorno. La <em>machi</em>, guía espiritual y sanadora, interpreta el lenguaje de
              las plantas mediante infusiones, mates, sahumados y baños de hierbas que buscan limpiar las emociones,
              fortalecer el ánimo y reconectar con el territorio, el <em>mapu</em>.
            </P>
            <GreenBox title="Lo científico y lo simbólico">
              Somos brujas científicas: una misma planta puede tener una acción demostrada sobre la piel <em>y</em> un
              lugar en la tradición. No competimos con la evidencia; caminamos con las dos manos. Lo simbólico ordena la
              intención; la ciencia cuida el cuerpo.
            </GreenBox>
          </AccordionItem>

          {/* 2 — Correspondencias por intención */}
          <AccordionItem title="Correspondencias por intención" open={open === "correspondencias"} onToggle={() => toggle("correspondencias")}>
            <P>La brujería verde organiza las hierbas por <strong>intención</strong>: qué se quiere cultivar. Estas son las seis grandes familias y sus plantas.</P>
            <div style={{ display: "grid", gap: "0.7rem" }}>
              {INTENCIONES.map((it) => (
                <div key={it.nombre} style={{ border: "1px solid rgba(200,160,80,0.14)", borderLeft: `3px solid ${it.color}`, borderRadius: "0.4rem", padding: "0.85rem 1rem", background: "rgba(255,255,255,0.02)" }}>
                  <p style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "0.92rem", letterSpacing: "0.06em", color: it.color, margin: "0 0 4px" }}>{it.nombre}</p>
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#d4c4a0", margin: "0 0 6px" }}>{it.hierbas}</p>
                  <p style={{ fontSize: "0.85rem", lineHeight: 1.65, color: "rgba(212,196,160,0.6)", fontStyle: "italic", margin: 0 }}>
                    {it.idea} · <span style={{ color: "rgba(170,120,190,0.85)" }}>{it.vela}</span>
                  </p>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* 3 — Plantas sagradas del sur */}
          <AccordionItem title="Plantas sagradas del sur" open={open === "plantas-sur"} onToggle={() => toggle("plantas-sur")}>
            <P>
              Las plantas de conexión espiritual de la tradición mapuche y campesina chilena. Varias ya viven en nuestras
              fórmulas —maqui, matico, arrayán, triwe— y aquí muestran su otra cara.
            </P>
            {PLANTAS_SUR.map((pl) => (
              <div key={pl.nombre} style={{ marginBottom: "14px" }}>
                <SubTitle>
                  {pl.nombre} <span style={{ fontStyle: "italic", fontSize: "0.82rem", color: "rgba(212,196,160,0.5)", fontWeight: 400 }}>· {pl.latin}</span>
                </SubTitle>
                <P style={{ marginBottom: 0 }}>{pl.texto}</P>
              </div>
            ))}
            <GreenBox title="Sahumerios con nativas del sur">
              <strong>Limpieza mapuche:</strong> foye (canelo) + triwe + un toque de ruda. ·{" "}
              <strong>Intención y abundancia:</strong> maqui + laurel + murta. ·{" "}
              <strong>Protección del hogar:</strong> ruda + canelo + romero.
            </GreenBox>
          </AccordionItem>

          {/* 4 — Fichas de hierbas */}
          <AccordionItem title="Fichas de hierbas" open={open === "hierbas"} onToggle={() => toggle("hierbas")}>
            <P>La propiedad mágica principal de las hierbas más usadas en la tradición verde y wicca.</P>
            {HIERBAS.map((h) => (
              <div key={h.n} style={{ marginBottom: "9px", paddingLeft: "0.9rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#7a9a5a" }}>❧</span>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.9)" }}>{h.n}.</strong> {h.p}
                </p>
              </div>
            ))}
          </AccordionItem>

          {/* 5 — Resinas y maderas */}
          <AccordionItem title="Resinas y maderas para incienso" open={open === "resinas"} onToggle={() => toggle("resinas")}>
            <P>Dan cuerpo, duración y profundidad al humo. Son el alma de los inciensos.</P>
            {RESINAS.map((r) => (
              <div key={r.n} style={{ marginBottom: "9px", paddingLeft: "0.9rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#b98acb" }}>◆</span>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.7, color: "#d4c4a0", margin: 0 }}>
                  <strong style={{ color: "rgba(200,160,80,0.9)" }}>{r.n}.</strong> {r.p}
                </p>
              </div>
            ))}
          </AccordionItem>

          {/* 6 — El color de las velas */}
          <AccordionItem title="El color de las velas" open={open === "velas"} onToggle={() => toggle("velas")}>
            <P>Cada color de cera lleva su propia intención. Elige según lo que quieras cultivar.</P>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              {VELAS.map((v) => (
                <div key={v.c} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.5rem 0" }}>
                  <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: v.hex, border: "1px solid rgba(200,160,80,0.35)", marginTop: 2 }} />
                  <p style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "#d4c4a0", margin: 0 }}>
                    <strong style={{ color: "rgba(200,160,80,0.9)" }}>{v.c}.</strong> {v.s}
                  </p>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* 7 — Inciensos, sahumerios y velas */}
          <AccordionItem title="Inciensos, sahumerios y velas" open={open === "inciensos"} onToggle={() => toggle("inciensos")}>
            <SubTitle>Incienso en cono — receta base (por partes)</SubTitle>
            <P style={{ marginBottom: 6 }}>
              <strong>4 partes</strong> base combustible (corteza de eucalipto molida, aserrín fino, carbón vegetal en
              polvo o polvo de sándalo/makko). · <strong>3 partes</strong> aroma (hierbas secas, especias, maderas y
              resinas: oliban, mirra, benjuí, copal). · <strong>1 parte</strong> aglutinante (goma tragacanto hidratada
              en gel). · Opcional: una pizca de nitrato de potasio para que la brasa no se apague. · Agua destilada c.s.
            </P>
            <P style={{ marginBottom: 12 }}>
              Moler la base a harina fina; triturar hierbas y resinas en el mortero; mezclar y tamizar los secos; sumar el
              gel de tragacanto de a poco hasta una pasta moldeable (unas gotas de aceite esencial al final); formar conos
              de ~3 cm y <strong>secar sobre papel encerado 2–3 semanas</strong> en lugar fresco. El secado largo es la
              clave: humedad = no enciende.
            </P>

            <SubTitle>Sahumerio en atado (sin base combustible)</SubTitle>
            <P style={{ marginBottom: 12 }}>
              Atar hierbas secas frescas —romero, salvia, laurel, lavanda, foye— con hilo de algodón; secar colgado 2–3
              semanas. Se enciende la punta y se sopla para que humee.
            </P>

            <SubTitle>Inciensos por intención</SubTitle>
            <GreenBox>
              <strong>Limpieza:</strong> base + salvia + romero + oliban + un toque de canelo (foye). ·{" "}
              <strong>Protección del hogar:</strong> base + ruda + laurel/triwe + mirra + cedro. ·{" "}
              <strong>Prosperidad:</strong> base + canela + laurel + benjuí + menta + una pizca de albahaca. ·{" "}
              <strong>Amor / armonía:</strong> base + pétalos de rosa + lavanda + damiana + un toque de canela. ·{" "}
              <strong>Calma / meditación:</strong> base + lavanda + manzanilla + sándalo.
            </GreenBox>

            <SubTitle>Velas de soya aromáticas</SubTitle>
            <P style={{ marginBottom: 6 }}>
              El aroma se aporta con <strong>aceites esenciales</strong> (no quemando la hierba): 6–10 % del peso de la
              cera, agregados a ~50–55 °C (más caliente se volatiliza). Se decoran con flores o hierbas secas por fuera,
              nunca dentro, por seguridad de la llama. Combina color + aceite según la intención:
            </P>
            <PurpleBox>
              <strong>Limpieza:</strong> vela blanca + AE de romero / eucalipto / cedro. ·{" "}
              <strong>Protección:</strong> vela negra o blanca + AE de laurel / cedro / clavo. ·{" "}
              <strong>Prosperidad:</strong> vela verde o dorada + AE de canela / naranja / menta. ·{" "}
              <strong>Calma / amor:</strong> vela rosa o lavanda + AE de lavanda / rosa / citronela suave.
            </PurpleBox>
            <P style={{ fontSize: "0.85rem", color: "rgba(212,196,160,0.6)", fontStyle: "italic", marginBottom: 0 }}>
              Ventilar siempre al quemar incienso. Nunca dejar una vela encendida sin supervisión. Uso aromático,
              simbólico y ritual.
            </P>
          </AccordionItem>

          {/* 8 — Con lo que ya tienes */}
          <AccordionItem title="Con lo que ya tenemos" open={open === "inventario"} onToggle={() => toggle("inventario")}>
            <P>
              Con el inventario de El Floema —romero, tomillo, lavanda, menta, laurel/triwe, clavo, cedro, citronela,
              ciprés, maqui y matico— ya se cubren las cuatro intenciones más pedidas: <strong>limpieza, protección,
              prosperidad y calma</strong>. El sendero verde no pide comprar de nuevo: pide mirar distinto lo que ya está
              en el estante.
            </P>
          </AccordionItem>
        </section>

        <LineDivider />
        <p style={{ textAlign: "center", fontFamily: "var(--font-crimson), serif", fontStyle: "italic", fontSize: "0.95rem", color: "rgba(212,196,160,0.5)", maxWidth: 560, margin: "8px auto 0", lineHeight: 1.7 }}>
          Fuentes: recopilación de etnobotánica mapuche (Ladera Sur, Serindígena, medicina herbolaria mapuche), &ldquo;La
          bruja verde&rdquo; de Arin Murphy-Hiscock, Cunningham y tradición wicca. Compartido como herencia cultural, con
          respeto y sin fines médicos.
        </p>
      </div>
    </main>
  );
}
