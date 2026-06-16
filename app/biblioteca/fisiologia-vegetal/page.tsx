import { BackButton } from "@/components/BackButton";

function GrainOverlay() {
  return (
    <svg className="grain-layer" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <filter id="grain-filter-b">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter-b)" />
    </svg>
  );
}

function CornerOrnament({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const isRight = position.includes("r");
  const isBottom = position.includes("b");
  return (
    <svg
      width="80" height="80" viewBox="0 0 120 120" aria-hidden="true"
      style={{
        position: "absolute",
        top: isBottom ? "auto" : 0,
        bottom: isBottom ? 0 : "auto",
        left: isRight ? "auto" : 0,
        right: isRight ? 0 : "auto",
        transform: `scale(${isRight ? -1 : 1}, ${isBottom ? -1 : 1})`,
        transformOrigin: `${isRight ? "right" : "left"} ${isBottom ? "bottom" : "top"}`,
        opacity: 0.35,
        pointerEvents: "none",
      }}
    >
      <path d="M4,116 C4,58 24,36 48,20 C68,8 90,3 116,3" stroke="#c8a050" fill="none" strokeWidth="0.85" />
      <path d="M4,22 L4,4 L22,4" stroke="#c8a050" fill="none" strokeWidth="0.85" opacity="0.45" />
      <ellipse cx="17" cy="95" rx="7" ry="3" fill="none" stroke="#5a7a3a" strokeWidth="0.8" transform="rotate(-33,17,95)" opacity="0.7" />
      <ellipse cx="28" cy="78" rx="5.5" ry="2.2" fill="none" stroke="#5a7a3a" strokeWidth="0.7" transform="rotate(-46,28,78)" opacity="0.5" />
      <circle cx="9" cy="108" r="3" fill="none" stroke="#c8a050" strokeWidth="0.7" opacity="0.4" />
      <circle cx="9" cy="108" r="1.2" fill="#c8a050" opacity="0.3" />
    </svg>
  );
}

function BotanicalDivider({ width = 200, opacity = 0.45 }: { width?: number; opacity?: number }) {
  return (
    <svg width={width} height="28" viewBox="0 0 200 28" aria-hidden="true" style={{ opacity }}>
      <line x1="0" y1="14" x2="68" y2="14" stroke="#c8a050" strokeWidth="0.7" />
      <line x1="132" y1="14" x2="200" y2="14" stroke="#c8a050" strokeWidth="0.7" />
      <path d="M100,14 C97,9 91,6 87,9 C83,12 83,18 87,19 C91,21 98,18 100,14 Z" fill="none" stroke="#5a7a3a" strokeWidth="0.85" />
      <path d="M100,14 C103,9 109,6 113,9 C117,12 117,18 113,19 C109,21 102,18 100,14 Z" fill="none" stroke="#5a7a3a" strokeWidth="0.85" />
      <circle cx="100" cy="14" r="2.5" fill="#c8a050" opacity="0.6" />
      <circle cx="100" cy="14" r="1" fill="#c8a050" />
      <circle cx="68" cy="14" r="1.5" fill="#c8a050" opacity="0.4" />
      <circle cx="132" cy="14" r="1.5" fill="#c8a050" opacity="0.4" />
    </svg>
  );
}

function IllustrationPlaceholder({ label, height = 220 }: { label: string; height?: number }) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "580px",
        margin: "clamp(28px, 4vh, 48px) auto",
        height: `${height}px`,
        border: "1.5px dashed rgba(200, 160, 80, 0.32)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        position: "relative",
        background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,160,80,0.025) 0%, transparent 80%)",
      }}
    >
      {/* Corner marks */}
      {(["tl", "tr", "bl", "br"] as const).map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          style={{
            position: "absolute",
            top: pos.includes("b") ? "auto" : "-4px",
            bottom: pos.includes("b") ? "-4px" : "auto",
            left: pos.includes("r") ? "auto" : "-4px",
            right: pos.includes("r") ? "-4px" : "auto",
            width: "10px",
            height: "10px",
            borderTop: pos.includes("t") ? "1px solid rgba(200,160,80,0.5)" : "none",
            borderBottom: pos.includes("b") ? "1px solid rgba(200,160,80,0.5)" : "none",
            borderLeft: pos.includes("l") ? "1px solid rgba(200,160,80,0.5)" : "none",
            borderRight: pos.includes("r") ? "1px solid rgba(200,160,80,0.5)" : "none",
          }}
        />
      ))}
      <span aria-hidden="true" style={{ color: "rgba(200,160,80,0.28)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>✦</span>
      <span
        style={{
          fontFamily: "var(--font-crimson), serif",
          fontSize: "0.82rem",
          fontStyle: "italic",
          color: "#d4c4a0",
          letterSpacing: "0.1em",
          textAlign: "center",
          padding: "0 20px",
        }}
      >
        {label}
      </span>
      <span aria-hidden="true" style={{ color: "rgba(200,160,80,0.28)", fontSize: "0.7rem", letterSpacing: "0.08em" }}>✦</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "clamp(1rem, 2.2vw, 1.35rem)",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "#c8a050",
        marginBottom: "clamp(14px, 2.5vh, 22px)",
        textShadow: "0 0 30px rgba(200,160,80,0.2)",
      }}
    >
      {children}
    </h2>
  );
}

function BodyText({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-crimson), serif",
        fontSize: "clamp(1rem, 1.6vw, 1.18rem)",
        lineHeight: 1.82,
        color: "#d4c4a0",
        marginBottom: "clamp(14px, 2vh, 22px)",
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function HighlightText({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-crimson), serif",
        fontSize: "clamp(1rem, 1.8vw, 1.22rem)",
        fontStyle: "italic",
        lineHeight: 1.72,
        color: "#d4c4a0",
        borderLeft: "1px solid rgba(200,160,80,0.45)",
        paddingLeft: "clamp(16px, 2.5vw, 28px)",
        marginBottom: "clamp(18px, 2.5vh, 28px)",
        marginLeft: "clamp(0px, 2vw, 16px)",
      }}
    >
      {children}
    </p>
  );
}

function InlineFormula({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-cinzel), serif",
        fontSize: "clamp(0.82rem, 1.4vw, 1rem)",
        letterSpacing: "0.15em",
        color: "rgba(200,160,80,0.65)",
        textAlign: "center",
        padding: "clamp(14px, 2vh, 22px) 0",
        margin: "clamp(10px, 1.5vh, 18px) 0",
        borderTop: "1px solid rgba(200,160,80,0.12)",
        borderBottom: "1px solid rgba(200,160,80,0.12)",
      }}
    >
      {children}
    </div>
  );
}

export default function FisiologiaVegetal() {
  return (
    <main
      className="parchment-bg"
      style={{ position: "relative", minHeight: "100vh", overflowX: "hidden" }}
    >
      <GrainOverlay />

      {/* Candle glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: `
            radial-gradient(ellipse 90% 60% at 50% 25%,
              rgba(200,160,80,0.09) 0%, rgba(200,160,80,0.04) 35%, transparent 70%
            ),
            radial-gradient(ellipse 130% 130% at 50% 50%, transparent 38%, rgba(50,30,5,0.25) 100%)
          `,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Grimoire frame */}
      <div
        className="grimoire-entrance"
        style={{
          position: "relative",
          zIndex: 3,
          margin: "clamp(12px, 2.5vw, 28px)",
          minHeight: "calc(100vh - clamp(24px, 5vw, 56px))",
          border: "1px solid rgba(200,160,80,0.35)",
          boxShadow: `
            inset 0 0 80px rgba(200,160,80,0.025),
            inset 0 1px 0 rgba(200,160,80,0.08),
            0 0 100px rgba(0,0,0,0.7)
          `,
        }}
      >
        <CornerOrnament position="tl" />
        <CornerOrnament position="tr" />
        <CornerOrnament position="bl" />
        <CornerOrnament position="br" />

        {/* ── Content wrapper ── */}
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            padding: "clamp(32px, 6vh, 64px) clamp(24px, 5vw, 56px) clamp(48px, 8vh, 96px)",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Back button */}
          <div style={{ marginBottom: "clamp(24px, 4vh, 40px)" }}>
            <BackButton />
          </div>

          {/* ── Page header ── */}
          <header style={{ textAlign: "center", marginBottom: "clamp(40px, 6vh, 64px)" }}>
            {/* Top rule */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "clamp(22px, 4vh, 36px)", opacity: 0.32 }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c8a050)" }} />
              <span style={{ color: "#c8a050", fontSize: "0.8rem" }}>✦</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c8a050)" }} />
            </div>

            {/* Label */}
            <p style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "0.58rem",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              color: "rgba(200,160,80,0.42)",
              marginBottom: "clamp(12px, 2vh, 20px)",
            }}>
              La Biblioteca · Módulo I
            </p>

            {/* Main title */}
            <h1
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(2rem, 5.5vw, 3.8rem)",
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: "#c8a050",
                textShadow: "0 0 55px rgba(200,160,80,0.32), 0 0 100px rgba(200,160,80,0.12)",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Fisiología Vegetal
            </h1>

            {/* Divider */}
            <div style={{ margin: "clamp(16px, 3vh, 26px) auto", display: "flex", justifyContent: "center" }}>
              <BotanicalDivider width={200} opacity={0.5} />
            </div>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-crimson), serif",
                fontSize: "clamp(1.05rem, 2vw, 1.3rem)",
                fontStyle: "italic",
                color: "#d4c4a0",
                letterSpacing: "0.05em",
                lineHeight: 1.5,
                margin: 0,
              }}
            >
              La planta como fábrica química viva
            </p>

            {/* Bottom rule */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginTop: "clamp(22px, 4vh, 36px)", opacity: 0.32 }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, #c8a050)" }} />
              <span style={{ color: "#c8a050", fontSize: "0.8rem" }}>✦</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, #c8a050)" }} />
            </div>
          </header>

          {/* ── Section 1: La Planta como Laboratorio ── */}
          <article style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <SectionTitle>La Planta como Laboratorio</SectionTitle>
            <BodyText>
              Imagina una fábrica que opera sin descanso desde que nació la vida
              en la Tierra — sin gerentes, sin turnos, sin residuos. Cada célula
              vegetal es exactamente eso: un sistema de producción autónomo que
              transforma energía lumínica, dióxido de carbono y minerales en una
              biblioteca de moléculas de una complejidad asombrosa.
            </BodyText>
            <BodyText>
              Las plantas no tienen sistema nervioso ni capacidad de movimiento
              rápido, pero han desarrollado una inteligencia química sin par.
              Cuando necesitan defenderse, producen toxinas. Cuando quieren atraer
              polinizadores, sintetizan fragancias y pigmentos. Cuando el sol las
              quema, fabrican sus propios filtros solares. Es esta misma
              inteligencia molecular la que la cosmética botánica aprovecha.
            </BodyText>
            <HighlightText>
              La planta no produce activos para nosotras — los produce para
              sobrevivir. Que coincidan con lo que nuestra piel necesita no es
              azar: compartimos millones de años de evolución en el mismo planeta.
            </HighlightText>
          </article>

          {/* ── Illustration 1 ── */}
          <IllustrationPlaceholder label="La célula vegetal — diagrama de sección transversal" height={240} />

          {/* ── Section 2: La Célula Vegetal ── */}
          <article style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <SectionTitle>La Célula Vegetal — Estructura y Función</SectionTitle>
            <BodyText>
              La célula vegetal comparte con la célula animal su núcleo,
              mitocondrias y retículo endoplasmático. Pero posee tres estructuras
              únicas que la definen y que importan directamente a la cosmética
              botánica:
            </BodyText>
            <BodyText>
              <strong style={{ color: "rgba(200,160,80,0.75)", fontStyle: "normal" }}>La pared celular</strong>, hecha de celulosa,
              le otorga rigidez y protección. Es la primera barrera que el
              formulador debe considerar al extraer activos — su resistencia define
              qué método de extracción será más efectivo.
            </BodyText>
            <BodyText>
              <strong style={{ color: "rgba(200,160,80,0.75)", fontStyle: "normal" }}>Los cloroplastos</strong>, organelos
              verdes donde ocurre la fotosíntesis, contienen clorofila y
              carotenoides — pigmentos que capturan luz y que en formulación
              aparecen como potentes antioxidantes y colorantes naturales.
            </BodyText>
            <BodyText>
              <strong style={{ color: "rgba(200,160,80,0.75)", fontStyle: "normal" }}>La vacuola central</strong>, que puede
              ocupar hasta el 90% del volumen celular, almacena agua, ácidos
              orgánicos, pigmentos flavonoides, alcaloides y metabolitos
              secundarios. Esta vacuola es el cofre de tesoros de la planta —
              y el destino de la mayoría de los activos que buscamos.
            </BodyText>
          </article>

          {/* Section divider */}
          <div style={{ display: "flex", justifyContent: "center", margin: "clamp(20px, 3vh, 36px) 0", opacity: 0.3 }}>
            <BotanicalDivider width={140} />
          </div>

          {/* ── Section 3: Fotosíntesis ── */}
          <article style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <SectionTitle>Fotosíntesis y Metabolismo Primario</SectionTitle>
            <InlineFormula>6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂</InlineFormula>
            <BodyText>
              Esta ecuación esconde una cadena de más de cien reacciones
              enzimáticas. La energía solar, capturada por la clorofila en los
              tilacoides del cloroplasto, impulsa la síntesis de glucosa. A partir
              de este azúcar primario, la planta construye carbohidratos,
              aminoácidos y lípidos.
            </BodyText>
            <BodyText>
              Estos son los <em>metabolitos primarios</em> — esenciales para la vida de
              la planta y base de la estructura de extractos que conocemos bien en
              cosmética: aceites vegetales ricos en ácidos grasos insaturados,
              proteínas hidrolizadas de trigo o arroz, almidones y gomas naturales.
            </BodyText>
            <HighlightText>
              Sin fotosíntesis no hay metabolismo. Sin metabolismo primario no hay
              metabolismo secundario. Todo empieza en ese instante en que la
              clorofila atrapa un fotón de luz.
            </HighlightText>
          </article>

          {/* ── Illustration 2 ── */}
          <IllustrationPlaceholder label="Sistema vascular — xilema y floema en sección" height={260} />

          {/* ── Section 4: Xilema y Floema ── */}
          <article style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <SectionTitle>El Sistema Vascular — Xilema y Floema</SectionTitle>
            <BodyText>
              Las plantas vasculares evolucionaron hace más de 400 millones de
              años una solución brillante al problema de escala: una red de
              transporte interno que funciona sin bomba muscular.
            </BodyText>
            <BodyText>
              El <em>xilema</em> conduce agua y sales minerales desde las raíces
              hasta las hojas, viajando contra la gravedad gracias a la cohesión
              molecular del agua y la presión negativa creada por la
              transpiración foliar.
            </BodyText>
            <BodyText>
              El <em style={{ color: "rgba(200,160,80,0.7)" }}>floema</em> es distinto: distribuye la savia elaborada —
              azúcares, aminoácidos, hormonas y señales moleculares — desde las
              hojas hacia raíces, frutos y meristemos. A través del floema viajan
              también los compuestos bioactivos que luego extraemos para la
              formulación: glicósidos, alcaloides, polifenoles, flavonoides.
            </BodyText>
            <HighlightText>
              El floema es la red logística de la planta: su savia elaborada
              lleva no solo glucosa, sino también la historia química de cada
              condición ambiental que la planta ha vivido. El nombre de esta
              marca no es casual.
            </HighlightText>
          </article>

          {/* Section divider */}
          <div style={{ display: "flex", justifyContent: "center", margin: "clamp(20px, 3vh, 36px) 0", opacity: 0.3 }}>
            <BotanicalDivider width={140} />
          </div>

          {/* ── Section 5: Estrés y Respuesta ── */}
          <article style={{ marginBottom: "clamp(36px, 5vh, 56px)" }}>
            <SectionTitle>Estrés y Respuesta Química</SectionTitle>
            <BodyText>
              Cuando una planta sufre — y las plantas sufren — activa respuestas
              defensivas de una sofisticación asombrosa. Una herida mecánica
              libera ácido jasmónico, que viaja como señal de alarma e induce la
              producción de compuestos protectores en toda la planta. La sequía
              dispara la síntesis de osmoprotectores. La radiación UV intensa
              activa la vía de los fenilpropanoides, acumulando más flavonoides
              y ácidos hidroxicinámicos.
            </BodyText>
            <BodyText>
              Esta capacidad de respuesta al estrés es precisamente la que hace
              tan valiosos ciertos extractos: los polifenoles del maqui, los
              flavonoides de la rosa mosqueta, los terpenoides de la manzanilla
              patagónica no son ornamentos moleculares — son el registro
              biológico de cada adversidad que la planta sobrevivió.
            </BodyText>
            <BodyText>
              La planta literalmente escribe su historia en moléculas. Y nosotras
              las leemos en la piel.
            </BodyText>
          </article>

          {/* ── Illustration 3 ── */}
          <IllustrationPlaceholder label="De la planta a la piel — ruta de extracción y bioactividad" height={220} />

          {/* ── Section 6: De la Planta a tu Piel ── */}
          <article style={{ marginBottom: "clamp(48px, 7vh, 72px)" }}>
            <SectionTitle>De la Planta a tu Piel</SectionTitle>
            <BodyText>
              Entender la fisiología vegetal nos permite formular con criterio.
              Saber que los activos más potentes suelen concentrarse en la vacuola
              central nos dice que una extracción acuosa a temperatura adecuada
              puede ser más efectiva que un solvente orgánico agresivo que destruye
              membranas celulares.
            </BodyText>
            <BodyText>
              Saber que la planta produce más antioxidantes bajo estrés hídrico
              controlado nos permite elegir proveedores que cultiven en condiciones
              específicas — no por romanticismo, sino porque los datos lo respaldan.
              Saber en qué tejido (hoja, raíz, fruto, semilla) se concentra cada
              tipo de metabolito nos guía en la selección de materia prima.
            </BodyText>
            <HighlightText>
              La distancia entre la raíz y tu piel es larga. La fisiología
              vegetal es el mapa. Con ciencia, nuestra magia despierta.
            </HighlightText>
          </article>

          {/* ── Footer navigation ── */}
          <div
            style={{
              borderTop: "1px solid rgba(200,160,80,0.12)",
              paddingTop: "clamp(24px, 4vh, 40px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <BackButton />
            <span
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "0.55rem",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(200,160,80,0.45)",
              }}
            >
              Módulo I · La Biblioteca
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
