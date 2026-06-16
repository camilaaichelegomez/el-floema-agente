import { BackButton } from "@/components/BackButton";

export default function MetabolitosSecundarios() {
  return (
    <main className="parchment-bg" style={{ minHeight: "100vh", paddingBottom: 48 }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(32px, 6vh, 64px) clamp(24px, 5vw, 56px)" }}>
        <BackButton />
        <header style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "2.2rem", color: "#c8a050", letterSpacing: "0.14em", marginBottom: 8 }}>
            Metabolitos Secundarios
          </h1>
          <p style={{ fontFamily: "var(--font-crimson), serif", fontSize: "1.1rem", fontStyle: "italic", color: "#d4c4a0" }}>
            La química secreta de las plantas
          </p>
        </header>
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>
            ¿Qué son los metabolitos secundarios?
          </h2>
          <p style={{ marginBottom: 18 }}>
            Las plantas producen dos tipos de compuestos químicos. Los <strong>metabolitos primarios</strong> son universales — glucosa, aminoácidos, lípidos, ácidos nucleicos. Son los ladrillos fundamentales de toda vida. Los tiene una bacteria, un roble y un ser humano por igual.
          </p>
          <p style={{ marginBottom: 18 }}>
            Los <strong>metabolitos secundarios</strong> son otra cosa completamente distinta. No son esenciales para la vida básica de la planta — pero son indispensables para su supervivencia en el mundo real. Son las armas, las señales, los escudos y las invitaciones que la planta fabrica para relacionarse con su entorno.
          </p>
          <p style={{ marginBottom: 18 }}>
            Una planta no puede correr. No puede pelear con las manos. No puede llamar a un médico. Todo lo que necesita para defenderse de hongos, bacterias, insectos y herbívoros, para atraer polinizadores, para comunicarse con otras plantas, para sobrevivir al frío, la sequía o la radiación ultravioleta — lo fabrica con química.
          </p>
          <p style={{ marginBottom: 18 }}>
            Esa química es lo que usamos en medicina y cosmética.
          </p>
          <ul style={{ marginBottom: 18, paddingLeft: 18 }}>
            <li><strong>Por qué varían entre plantas:</strong> Cada especie vive en un ambiente distinto con presiones distintas. El matico crece en zonas húmedas del sur de Chile con alta presión de hongos — desarrolló potentes antifúngicos y antimicrobianos. El maqui está expuesto a una radiación UV intensa en verano — acumuló antioxidantes para proteger sus propias células. Esa especialización es exactamente lo que los hace útiles para nosotros.</li>
            <li><strong>Por qué varían dentro de la misma planta:</strong> Los metabolitos no están distribuidos uniformemente. Las hojas jóvenes suelen tener más porque son las más vulnerables a los herbívoros. Las flores concentran compuestos volátiles para atraer polinizadores. Las raíces acumulan reservas defensivas. Las semillas protegen el embrión con compuestos antimicrobianos. Saber qué parte usar y cuándo cosechar no es detalle menor — es la diferencia entre un extracto potente y uno inerte.</li>
            <li><strong>Factores que afectan su concentración:</strong>
              <ul>
                <li>Momento de cosecha → las concentraciones varían con las estaciones y el ciclo circadiano</li>
                <li>Altitud → mayor estrés = mayor producción de metabolitos defensivos</li>
                <li>Estrés hídrico → sequía moderada aumenta ciertos compuestos</li>
                <li>Radiación UV → activa la síntesis de flavonoides y antocianinas</li>
                <li>Temperatura → el frío puede activar ciertos terpenos protectores</li>
              </ul>
            </li>
          </ul>
        </section>
        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 28 }}>
            Las grandes familias y su acción sistémica
          </h2>

          {/* ── 1. Polifenoles ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              1. Polifenoles y fenoles
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los fenoles son compuestos que contienen al menos un anillo aromático con un grupo hidroxilo (-OH). Los polifenoles tienen múltiples de estos grupos. Es la familia más grande y diversa de metabolitos secundarios — se conocen más de 8.000 compuestos distintos.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antioxidantes sistémicos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los polifenoles neutralizan los radicales libres — moléculas inestables con un electrón desapareado que dañan el ADN, las proteínas y las membranas celulares. Lo hacen donando ese electrón faltante sin volverse inestables ellos mismos. Este mecanismo es la base de su acción protectora frente al envejecimiento celular, las enfermedades cardiovasculares y ciertos tipos de cáncer.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Inhiben enzimas clave de la cascada inflamatoria — especialmente COX-2 (ciclooxigenasa-2) y LOX (lipoxigenasa). Estas son las mismas enzimas que bloquean medicamentos como el ibuprofeno, pero con un perfil de efectos secundarios completamente diferente.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Moduladores de la microbiota intestinal</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los polifenoles no absorbidos en el intestino delgado llegan al colon donde son fermentados por la microbiota. Este proceso produce metabolitos secundarios (ácidos fenólicos de cadena corta) que tienen efectos antiinflamatorios propios. Es una de las áreas de investigación más activas en nutrición actualmente.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Cardioprotectores</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Reducen la oxidación del LDL (el mecanismo inicial de la aterosclerosis), mejoran la función endotelial y tienen efecto vasodilatador leve. El resveratrol del vino tinto y las antocianinas del maqui son los más estudiados en este contexto.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Neuroprotectores</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Estudios en modelos animales muestran protección frente al daño neuronal oxidativo. La investigación en Alzheimer y enfermedades neurodegenerativas con polifenoles es prometedora pero aún no concluyente en humanos.</p>
            </div>
            <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>
                <strong style={{ color: "rgba(200,160,80,0.72)" }}>Absorción y biodisponibilidad:</strong>{" "}Este es el talón de Aquiles de los polifenoles. Muchos son poco biodisponibles — se absorben mal en el intestino, se metabolizan rápido en el hígado y se excretan rápido. La forma de consumirlos importa: la grasa mejora la absorción de los lipófilos, la fermentación y cocción pueden aumentar o disminuir la biodisponibilidad según el compuesto.
              </p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 2. Flavonoides ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              2. Flavonoides
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los flavonoides son la subfamilia más importante de los polifenoles. Tienen una estructura de dos anillos aromáticos unidos por un puente de tres carbonos. Se dividen en seis subgrupos principales: flavonoles, flavonas, isoflavonas, flavanonas, flavanoles (catequinas) y antocianinas.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios potentes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Además de inhibir COX y LOX, los flavonoides modulan la producción de citoquinas proinflamatorias (TNF-α, IL-1β, IL-6). La quercetina es uno de los flavonoides más estudiados en este aspecto — con eficacia comparable a algunos antiinflamatorios sintéticos en modelos animales.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antialérgicos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Inhiben la degranulación de los mastocitos — las células que liberan histamina en las reacciones alérgicas. La quercetina y la luteolina son especialmente activas. Este es uno de los mecanismos mejor documentados.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antioxidantes quelantes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>A diferencia de otros antioxidantes que solo neutralizan radicales, muchos flavonoides también quelan (capturan) metales como el hierro y el cobre que catalizan la producción de radicales. Esto los hace doblemente protectores.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Estrogénicos (isoflavonas)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Las isoflavonas de la soja y otras plantas tienen estructura similar al estradiol y pueden unirse a los receptores de estrógeno. Este efecto es relevante en menopausia — hay estudios con resultados mixtos sobre su utilidad en sofocos y salud ósea.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Anticancerígenos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Múltiples flavonoides muestran actividad proapoptótica (inducen la muerte de células cancerosas) y antiproliferativa en cultivos celulares. La evidencia en humanos es mucho más limitada — los estudios epidemiológicos asocian dietas ricas en flavonoides con menor riesgo de ciertos cánceres pero la causalidad es difícil de establecer.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Antidiabéticos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos flavonoides inhiben la alfa-glucosidasa (enzima que digiere carbohidratos) y mejoran la sensibilidad a la insulina en modelos animales. Prometedor pero no concluyente en humanos.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Hepatoprotectores</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La silimarina del cardo mariano (un flavonoide) es el ejemplo más documentado de hepatoprotección. Otros flavonoides muestran efectos similares en modelos de daño hepático.</p>
            </div>
            <div style={{ background: "rgba(122,74,138,0.07)", border: "1px solid rgba(122,74,138,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(154,106,170,0.75)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>Antocianinas — el subgrupo especial</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Son los flavonoides que dan el color rojo, azul y morado a frutos como el maqui, el arándano y la frutilla. Son especialmente potentes como antioxidantes. Su estabilidad depende del pH — son más estables en medio ácido (rojo brillante) y se degradan en medio alcalino (azul/verde). El maqui chileno tiene la mayor concentración de antocianinas de cualquier fruto conocido.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 3. Taninos ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              3. Taninos
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los taninos son polifenoles de alto peso molecular con capacidad de unirse y precipitar proteínas. Su nombre viene de su uso histórico para curtir cuero — se unían a las proteínas del colágeno endureciéndolo. Hay dos tipos principales: taninos hidrolizables (ésteres de ácido gálico o elágico) y taninos condensados (proantocianidinas).
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Astringentes — el mecanismo más documentado</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Al precipitar proteínas forman una capa protectora sobre las mucosas y la piel. En el tracto digestivo esto reduce la permeabilidad intestinal. Históricamente se usaron para tratar diarreas, heridas y quemaduras — con base mecanicista sólida.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Al unirse a las proteínas de la pared celular bacteriana y a las enzimas microbianas los inactivan. Son especialmente efectivos contra bacterias grampositivas. Este es uno de los mecanismos por los que el arrayán y la pitra son antimicrobianos.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antidiarreicos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Reducen la hipersecreción intestinal y la motilidad excesiva. Uso tradicional ampliamente documentado con base farmacológica establecida.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Antitumorales</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los taninos elágicos (del arrayán, la granada, las frambuesas) se convierten en el intestino en urolitinas — metabolitos con actividad antiproliferativa y antioxidante. Las urolitinas han mostrado efectos prometedores en estudios sobre salud mitocondrial y envejecimiento celular.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Antioxidantes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Tienen capacidad antioxidante alta por sus múltiples grupos fenólicos. Sin embargo su biodisponibilidad es baja — la mayoría no se absorbe intacta y son metabolizadas por la microbiota.</p>
            </div>
            <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>⚠ Doble cara de los taninos</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>En dosis altas o uso crónico los taninos pueden interferir con la absorción de hierro no hemo, proteínas y algunos minerales. El té fuerte con las comidas reduce la absorción de hierro hasta un 60%. En cosmética este efecto es positivo — la astringencia sobre la piel es deseada.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 4. Terpenos ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              4. Terpenos y terpenoides
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los terpenos son la familia más grande de metabolitos secundarios — más de 30.000 compuestos conocidos. Se construyen todos a partir de la misma unidad básica de 5 carbonos (isopreno). Según cuántas unidades se unen se clasifican en: monoterpenos (C10), sesquiterpenos (C15), diterpenos (C20), triterpenos (C30) y tetraterpenos (C40, los carotenoides).
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios — mecanismo múltiple</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los triterpenos (como el ácido ursólico, el lupeol, el beta-sitosterol) son antiinflamatorios potentes. Inhiben NF-κB — el "interruptor maestro" de la inflamación que regula la expresión de decenas de genes proinflamatorios. Este es un mecanismo más profundo que la simple inhibición de COX.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Adaptógenos (diterpenos y triterpenos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos terpenos modulan el eje hipotálamo-hipófisis-suprarrenal — el sistema que regula la respuesta al estrés. Los ginsenósidos del ginseng, los withanólidos de la ashwagandha y los triterpenos del reishi son los ejemplos más documentados. Aumentan la resistencia inespecífica al estrés sin estimular ni deprimir.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos (monoterpenos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los monoterpenos de los aceites esenciales — timol, carvacrol, mentol, eugenol — atraviesan las membranas bacterianas y fúngicas alterando su permeabilidad. Son los responsables de la actividad antimicrobiana del tomillo, el orégano, el clavo y el eucalipto.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Anticancerígenos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El limoneno y el perillil alcohol (monoterpenos cítricos) han mostrado actividad antitumoral en varios modelos. El lupeol tiene efectos proapoptóticos en líneas celulares de cáncer. La investigación es prometedora pero está en etapas tempranas en humanos.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Neuroprotectores (sesquiterpenos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El bisabolol (del aceite de manzanilla) y el beta-cariofileno (del cannabis, la pimienta negra, el clavo) muestran efectos neuroprotectores y ansiolíticos en modelos animales. El beta-cariofileno es especialmente interesante porque es el único terpeno conocido que activa receptores endocannabinoides (CB2) — sin los efectos psicoactivos del THC.</p>
            </div>
            <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.62)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>Carotenoides — el subgrupo de los colores</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Los tetraterpenos incluyen los carotenoides — betacaroteno, licopeno, luteína, zeaxantina. Son antioxidantes liposolubles que se acumulan en los tejidos. El betacaroteno se convierte en vitamina A según necesidad. La luteína y la zeaxantina protegen la mácula del ojo. El licopeno del tomate se asocia con protección cardiovascular y prostática.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 5. Alcaloides ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              5. Alcaloides
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los alcaloides son compuestos nitrogenados de origen vegetal con actividad biológica potente. Son los metabolitos secundarios más farmacológicamente activos — y los más peligrosos en dosis incorrectas. La morfina, la cafeína, la quinina, la colchicina y la vincristina son todos alcaloides.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Acción sobre el sistema nervioso</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Es donde los alcaloides son más potentes y mejor documentados. Pueden ser estimulantes (cafeína, efedrina), depresores (morfina, codeína), alucinógenos (mescalina, psilocibina) o bloqueadores neuromusculares (curare). Su mecanismo varía enormemente según el compuesto — algunos bloquean receptores, otros los activan, otros inhiben enzimas catabólicas.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos potentes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La berberina (coptis, agracejo), la sanguinarina y otros alcaloides isoquinolínicos son antimicrobianos de amplio espectro con mecanismos múltiples — alteran la membrana bacteriana, inhiben la síntesis de ADN y ARN bacteriano, y bloquean enzimas esenciales.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antitumorales documentados</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Varios alcaloides son fármacos oncológicos establecidos — la vincristina y la vinblastina del bígaro de Madagascar inhiben la formación del huso mitótico. La taxol (del tejo) estabiliza los microtúbulos. La camptotecina inhibe la topoisomerasa. Son ejemplos de cómo los metabolitos secundarios vegetales se convierten en medicamentos.</p>
            </div>
            <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: 12 }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>⚠ Ventana terapéutica estrecha</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Los alcaloides son los metabolitos secundarios con mayor toxicidad potencial. La diferencia entre dosis terapéutica y tóxica puede ser pequeña. Muchas plantas con alcaloides requieren preparación cuidadosa y dosificación precisa.</p>
            </div>
            <div style={{ background: "rgba(90,122,58,0.07)", border: "1px solid rgba(90,122,58,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(90,122,58,0.75)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>En las plantas de El Floema</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Las plantas nativas valdivianas que usamos contienen pocos alcaloides en concentraciones significativas — es uno de los factores que las hace seguras para uso cosmético y medicinal cotidiano. El matico contiene pequeñas cantidades de piperina y compuestos relacionados con acción antimicrobiana suave.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 6. Glucósidos ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              6. Glucósidos
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los glucósidos son compuestos formados por un azúcar (generalmente glucosa) unido a una molécula no azucarada llamada aglicona. La aglicona es la parte activa — el azúcar actúa como transportador que mejora la solubilidad y estabilidad.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Cardiotónicos (glucósidos cardíacos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los glucósidos digitálicos de la dedalera (Digitalis) son los más conocidos — inhiben la bomba Na⁺/K⁺ ATPasa del músculo cardíaco aumentando la contractilidad. Son fármacos establecidos para la insuficiencia cardíaca.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios (glucósidos salicílicos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La salicina del sauce es el glucósido del que se derivó la aspirina. Se hidroliza en el intestino liberando alcohol salicílico que se convierte en ácido salicílico. Tiene efecto analgésico y antiinflamatorio con mejor tolerancia gástrica que la aspirina.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos (glucosinolatos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los glucosinolatos de las crucíferas (brócoli, rábano, mostaza) se convierten en isotiocianatos al romperse la célula — potentes antimicrobianos y con evidencia anticancerígena creciente.</p>
            </div>
            <div style={{ marginBottom: 0 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Adaptógenos (ginsenósidos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los ginsenósidos del ginseng son triterpeno-glucósidos con efectos adaptógenos documentados — modulan el eje del estrés, mejoran la función cognitiva y tienen efectos inmunomoduladores.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── 7. Aceites Esenciales ── */}
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              7. Aceites esenciales — mezclas de terpenos volátiles
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los aceites esenciales no son un tipo de metabolito secundario — son mezclas complejas de metabolitos volátiles, principalmente monoterpenos y sesquiterpenos. Un aceite esencial puede contener entre 20 y 200 compuestos distintos.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Cómo actúan en el cuerpo</p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Vía inhalatoria — sistema límbico</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los compuestos volátiles inhalados llegan al bulbo olfatorio y activan el sistema límbico — la parte del cerebro que procesa emociones y memoria. Este es el mecanismo de la aromaterapia con más base neurológica. El linalol de la lavanda reduce la actividad de la amígdala y tiene efectos ansiolíticos documentados en humanos.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos sistémicos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos aceites esenciales ingeridos (con supervisión) tienen actividad antimicrobiana sistémica. El aceite de orégano (carvacrol + timol) es uno de los más estudiados contra Helicobacter pylori y otras bacterias gastrointestinales.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Expectorantes y broncodilatadores</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El eucaliptol (1,8-cineol) del eucalipto es el componente activo de muchos expectorantes comerciales. Actúa directamente sobre el epitelio bronquial reduciendo la viscosidad del moco y con efecto broncodilatador leve. El timol y el mentol tienen mecanismos similares.</p>
            </div>
            <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>⚠ Toxicidad por vía oral</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Los aceites esenciales son concentrados extremos — 1 ml de aceite esencial equivale a cientos de gramos de planta fresca. Por vía oral son potencialmente tóxicos sin supervisión profesional. El eucalipto, la menta y el alcanfor son especialmente peligrosos en niños pequeños incluso por vía tópica en zonas como el pecho o la nariz.</p>
            </div>
          </div>
        </section>
        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />

        {/* ══════════════ PARTE II — CÓMO ACTÚAN EN LA PIEL ══════════════ */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 28 }}>
            Cómo actúan en la piel
          </h2>

          {/* ── La piel como órgano ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              La piel como órgano — lo que necesitas saber
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              La piel es el órgano más grande del cuerpo — 1.5 a 2 metros cuadrados de superficie. No es solo una envoltura pasiva. Es un órgano activo con funciones inmunológicas, endocrinas, sensoriales y metabólicas.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Sus tres capas</p>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><strong style={{ color: "#c8a050" }}>Epidermis</strong> — la capa que vemos y tocamos.</p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Formada principalmente por queratinocitos en distintos estadíos de maduración. La capa más externa — el estrato córneo — son células muertas completamente queratinizadas rodeadas por una matriz de lípidos (ceramidas, ácidos grasos libres, colesterol). Es la barrera principal.</p>
            </div>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><strong style={{ color: "#c8a050" }}>Dermis</strong> — la capa estructural.</p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Colágeno, elastina, ácido hialurónico, fibroblastos, vasos sanguíneos y nervios. Aquí están las células que producen las proteínas que dan firmeza y elasticidad. Lo que le pasa a la dermis determina cómo envejece la piel.</p>
            </div>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><strong style={{ color: "#c8a050" }}>Hipodermis</strong> — la capa profunda.</p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Principalmente tejido adiposo. Los cosméticos rara vez llegan aquí — y si llegan son fármacos, no cosméticos.</p>
            </div>
            <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.62)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>El estrato córneo — la barrera que hay que entender y respetar</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>El estrato córneo funciona como un muro de ladrillos — las células (corneocitos) son los ladrillos y los lípidos son el mortero. Esos lípidos son fundamentalmente ceramidas (~50%), ácidos grasos libres (~25%) y colesterol (~25%). Todo lo que aplicas en la piel interactúa primero con esa barrera. Los metabolitos liposolubles penetran por el espacio intercelular lipídico. Los hidrosolubles tienen más dificultad. Los de bajo peso molecular penetran mejor. Los de alto peso molecular se quedan en superficie.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Polifenoles en la piel ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Polifenoles en la piel
            </h3>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Fotoprotección y reparación del daño UV</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La radiación UV genera radicales libres en la piel que dañan el ADN de los queratinocitos y degradan el colágeno por activación de metaloproteasas (MMPs). Los polifenoles actúan en ambos frentes — neutralizan los radicales antes de que dañen el ADN, e inhiben las MMPs que degradan el colágeno. Los polifenoles del té verde (EGCG) son los más estudiados en este contexto. Aplicados tópicamente reducen el eritema post-UV, la formación de células quemadas por el sol y la inmunosupresión cutánea inducida por UV.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Inhibición de la tirosinasa — efecto aclarante</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La tirosinasa es la enzima clave en la síntesis de melanina. Múltiples polifenoles la inhiben competitivamente — ácido elágico, resveratrol, ácido ferúlico, arbutina. Este es el mecanismo detrás de los productos "aclarantes" naturales.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antioxidantes en la fase lipídica de la piel</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los polifenoles lipófilos protegen los lípidos del estrato córneo de la peroxidación lipídica — uno de los mecanismos del envejecimiento cutáneo. Una barrera lipídica oxidada pierde su función protectora y la piel se vuelve más permeable, más reactiva y más seca.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Estimulación de la síntesis de colágeno</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos polifenoles estimulan los fibroblastos dérmicos para producir más colágeno tipo I. El resveratrol, el EGCG y las proantocianidinas de la uva son los más estudiados. La penetración hasta la dermis es el factor limitante.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios cutáneos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Inhiben las mismas vías que en el cuerpo — COX, LOX, NF-κB — pero aplicados tópicamente. La diferencia es que la concentración local puede ser mucho mayor que la alcanzable por vía sistémica, compensando la limitada biodisponibilidad oral.</p>
            </div>
            <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.62)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>Penetración en la piel</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>La mayoría de los polifenoles son hidrófilos — penetran mal a través de la barrera lipídica del estrato córneo. Los vehículos lipídicos como el tallow mejoran significativamente su penetración al aumentar la partición hacia la fase lipídica intercelular. Aquí es donde la combinación tallow + extracto botánico de El Floema tiene base científica real.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Flavonoides en la piel ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Flavonoides en la piel
            </h3>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios cutáneos de primera línea</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los flavonoides son los antiinflamatorios tópicos naturales mejor documentados. Inhiben la liberación de histamina de los mastocitos cutáneos, reducen la producción de leucotrienos y prostaglandinas inflamatorias en la piel, e inhiben la activación del NF-κB en queratinocitos. La quercetina, la luteolina y la apigenina son las más activas. Especialmente útiles en dermatitis atópica, rosácea, psoriasis y piel reactiva.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Protección capilar dérmica</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los flavonoides del grupo de las proantocianidinas (OPC) — presentes en semillas de uva, corteza de pino y maqui — tienen afinidad especial por el colágeno y la elastina. Inhiben las enzimas que los degradan (elastasa, colagenasa, hialuronidasa) y estabilizan las fibras vasculares. Reducen la fragilidad capilar y mejoran la microcirculación cutánea.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 6 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antocianinas — protección específica</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem", marginBottom: 8 }}>Las antocianinas son flavonoides especialmente relevantes para la piel por varios mecanismos:</p>
              <ul style={{ paddingLeft: "2.5rem", marginBottom: 10 }}>
                {[
                  "Inhiben la enzima hialuronidasa que degrada el ácido hialurónico natural de la piel",
                  "Protegen las fibras de colágeno de la glicación (el proceso que las endurece y vuelve frágiles con la edad)",
                  "Tienen efecto fotoprotector propio absorbiendo parte del espectro UV",
                  "Estimulan la producción de glucosaminoglicanos en los fibroblastos",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El maqui chileno con su extraordinaria concentración de antocianinas (delfidina-3-glucósido y cianidina-3-glucósido) es especialmente valioso para formulaciones antiedad.</p>
            </div>
            <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>⚠ Estabilidad del color</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Las antocianinas son termolábiles y sensibles al pH. Para preservarlas en formulación hay que trabajar a temperatura ambiente, mantener pH ácido (3-5) y usar envase opaco. En bases anhidras como el tallow la estabilidad es menor que en sistemas acuosos ácidos.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Taninos en la piel ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Taninos en la piel
            </h3>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 6 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Astringentes — el efecto más visible e inmediato</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem", marginBottom: 8 }}>Al contacto con la piel los taninos precipitan las proteínas superficiales de la epidermis formando una película protectora temporal. Este efecto:</p>
              <ul style={{ paddingLeft: "2.5rem", marginBottom: 8 }}>
                {["Contrae los poros visualmente", "Reduce la producción de sebo superficial", "Da sensación de piel tensa y refinada", "Crea una barrera contra patógenos externos"].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.75)", paddingLeft: "1.3rem", fontStyle: "italic" }}>Es el mecanismo del tónico de bruja — un clásico de farmacia que era simplemente una solución hidroalcohólica de taninos de hamamelis.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 6 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Cicatrizantes — mecanismo documentado</strong></p>
              <ul style={{ paddingLeft: "2.5rem", marginBottom: 0 }}>
                {[
                  "Forman una barrera protectora sobre la herida que reduce la infección",
                  "Precipitan las proteínas exudadas de la herida formando una costra protectora natural",
                  "Reducen la inflamación local",
                  "Estimulan la proliferación de fibroblastos en algunas concentraciones",
                ].map((item, i) => (
                  <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.75, color: "#d4c4a0", marginBottom: 4 }}>{item}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos cutáneos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Se unen a las proteínas de la pared celular bacteriana y a las enzimas microbianas. Son especialmente efectivos contra Staphylococcus aureus — la bacteria más implicada en infecciones cutáneas, dermatitis atópica y acné.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antifúngicos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los taninos interfieren con la síntesis de ergosterol de la pared celular fúngica y con las enzimas líticas que los hongos usan para penetrar en los tejidos. Útiles en dermatomicosis superficiales.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Control del acné</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Por su combinación de acción astringente (reduce sebo), antimicrobiana (contra P. acnes y S. aureus) y antiinflamatoria. Estudios in vitro son prometedores. La evidencia clínica es más limitada.</p>
            </div>
            <div style={{ background: "rgba(200,160,80,0.05)", border: "1px solid rgba(200,160,80,0.13)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.62)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>Concentración importa</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>En concentraciones bajas (0.5–3%) los taninos son astringentes y beneficiosos. En concentraciones altas (&gt;10%) pueden ser irritantes por exceso de precipitación proteica. La decocción concentrada sin diluir aplicada directamente puede resecar e irritar.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Terpenos en la piel ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Terpenos en la piel
            </h3>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Potenciadores de penetración — el mecanismo más valioso en cosmética</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos monoterpenos modifican la estructura de la barrera lipídica del estrato córneo aumentando su fluidez y permeabilidad. El mentol, el limoneno, el alcanfor y el 1,8-cineol son los más documentados. Este efecto es reversible y temporal — la barrera se restaura completamente. Esto significa que los aceites esenciales no solo tienen acción propia sino que facilitan la penetración de otros activos co-formulados. Tallow + aceite esencial + activo botánico: el aceite esencial abre la puerta y el tallow conduce el activo.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antiinflamatorios cutáneos (triterpenos)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El ácido ursólico, el lupeol y el beta-sitosterol son triterpenos con potente actividad antiinflamatoria cutánea. Inhiben NF-κB y MAPK en queratinocitos y fibroblastos. Son los activos antiinflamatorios del caléndula, el sauce y muchas plantas medicinales tradicionales. El lupeol en particular inhibe la enzima 5-alfa reductasa que convierte la testosterona en DHT — la forma más activa que estimula la producción de sebo. Por eso algunos terpenos tienen acción antiseborreica.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Cicatrizantes (triterpenos — ácido asiático y madecásico)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Los triterpenos del centella asiática son los activos cicatrizantes más documentados en cosmética. Estimulan directamente la síntesis de colágeno en fibroblastos, promueven la diferenciación de queratinocitos y reducen la inflamación. Son los activos cicatrizantes más estudiados que existen.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Antimicrobianos (monoterpenos de AE)</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>El timol, el carvacrol, el eugenol y el α-pineno alteran la membrana plasmática de bacterias y hongos cutáneos aumentando su permeabilidad hasta el punto de lisis celular. Son los activos antimicrobianos de los aceites esenciales de clavo, tomillo, orégano y pino.</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Estimulantes de la microcirculación</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos monoterpenos tienen efecto vasodilatador local — mentol, alcanfor, capsaicina. Aumentan el flujo sanguíneo local dando la sensación de calor o frío. En cosmética corporal esto se usa en productos anticelulíticos y reductores aunque la evidencia de eficacia a largo plazo es limitada.</p>
            </div>
            <div style={{ background: "rgba(184,115,51,0.07)", border: "1px solid rgba(184,115,51,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(200,160,80,0.65)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>⚠ Irritación y fotosensibilización</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Los terpenos cítricos — limoneno, linalol, geraniol — son potentes fotosensibilizantes. Aplicados en piel expuesta al sol pueden causar reacciones fototóxicas y manchas. Los aceites esenciales de bergamota, lima, limón y pomelo son especialmente problemáticos. Evitar en productos de uso diurno sin protección solar.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Mucílagos en la piel ── */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Mucílagos y polisacáridos en la piel
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              <strong style={{ color: "#c8a050" }}>Qué son:</strong> Los mucílagos son polisacáridos complejos que forman geles viscosos al hidratarse. No son propiamente metabolitos secundarios de defensa — son estructurales y de reserva — pero su acción en la piel es muy relevante.
            </p>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Hidratantes filmógenos</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Forman una película hidratante sobre la piel que reduce la pérdida de agua transepidérmica (TEWL). A diferencia de los humectantes que atraen agua, los mucílagos la retienen físicamente. Son el mecanismo de acción del aloe vera, la malva, el lino y la avena.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Emolientes y calmantes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>La película mucilaginosa reduce la fricción, suaviza la superficie y crea un entorno hidratado que permite la regeneración epitelial. Especialmente útil en piel seca, deshidratada, quemada o irritada.</p>
            </div>
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#5a7a3a", marginRight: "0.4rem" }}>✓</span><strong style={{ color: "#c8a050" }}>Prebióticos para la microbiota cutánea</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Algunos polisacáridos funcionan como sustrato para las bacterias beneficiosas de la piel — especialmente Lactobacillus y Staphylococcus epidermidis. Una microbiota cutánea equilibrada es fundamental para la salud de la barrera cutánea. Esta es un área de investigación muy activa.</p>
            </div>
            <div style={{ marginBottom: 0 }}>
              <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 2 }}><span style={{ color: "#c8a050", marginRight: "0.4rem" }}>◐</span><strong style={{ color: "#c8a050" }}>Cicatrizantes</strong></p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", paddingLeft: "1.3rem" }}>Promueven la proliferación de fibroblastos y queratinocitos. La beta-glucana de la avena tiene evidencia sólida en este aspecto. El glucomanano del konjac y la inulina también muestran efectos prometedores.</p>
            </div>
          </div>

          <div style={{ height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.15), transparent)", margin: "4px 0 32px" }} />

          {/* ── Sinergias ── */}
          <div style={{ marginBottom: 8 }}>
            <h3 style={{ fontFamily: "var(--font-cinzel), serif", fontSize: "1rem", color: "rgba(200,160,80,0.9)", letterSpacing: "0.1em", marginBottom: 14, borderLeft: "2px solid rgba(200,160,80,0.28)", paddingLeft: "0.75rem" }}>
              Sinergias entre familias — lo que hace única a la planta completa
            </h3>
            <p style={{ fontSize: "0.97rem", lineHeight: 1.8, color: "#d4c4a0", marginBottom: 14 }}>
              Una de las lecciones más importantes de la fitoquímica moderna es que los extractos de planta completa son generalmente más efectivos que los compuestos aislados. Esto se llama efecto entourage o sinergia fitoquímica.
            </p>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(200,160,80,0.52)", marginBottom: 12, fontFamily: "var(--font-cinzel), serif" }}>Por qué pasa</p>
            <ul style={{ paddingLeft: "1.5rem", marginBottom: 20 }}>
              {[
                "Los terpenos de los aceites esenciales aumentan la penetración de los polifenoles",
                "Los taninos estabilizan los flavonoides protegiéndolos de la oxidación",
                "Los mucílagos retienen los activos más tiempo en contacto con la piel",
                "Los flavonoides potencian la acción antiinflamatoria de los triterpenos",
              ].map((item, i) => (
                <li key={i} style={{ fontSize: "0.95rem", lineHeight: 1.78, color: "#d4c4a0", marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
            <div style={{ background: "rgba(90,122,58,0.07)", border: "1px solid rgba(90,122,58,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem", marginBottom: 12 }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(90,122,58,0.75)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>El ejemplo del matico</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>El matico contiene simultáneamente flavonoides (artemetina, apigenina), taninos, aceite esencial (dilapiol, beta-cariofileno), mucílagos y triterpenos. Su acción cicatrizante no es el resultado de un solo compuesto — es la sinergia de todos ellos actuando en cascada sobre los mismos procesos de reparación tisular.</p>
            </div>
            <div style={{ background: "rgba(122,74,138,0.07)", border: "1px solid rgba(122,74,138,0.22)", borderRadius: "0.4rem", padding: "0.85rem 1rem" }}>
              <p style={{ fontSize: "0.82rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(154,106,170,0.75)", marginBottom: 8, fontFamily: "var(--font-cinzel), serif" }}>La implicación para El Floema</p>
              <p style={{ fontSize: "0.92rem", lineHeight: 1.75, color: "rgba(212,196,160,0.82)", marginBottom: 0 }}>Usar macerados de planta completa en tallow captura esta sinergia. Un extracto aislado de artemetina de matico no haría lo mismo que el oleato de matico con toda su matriz fitoquímica. Esa es la diferencia entre cosmética industrial y cosmética botánica real.</p>
            </div>
          </div>
        </section>

        <hr style={{ border: 0, borderTop: "1px solid rgba(200,160,80,0.18)", margin: "40px 0" }} />
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "var(--font-cinzel), serif", color: "#c8a050", fontSize: "1.2rem", letterSpacing: "0.12em", marginBottom: 18 }}>
            Tabla resumen — Metabolitos y su acción en piel
          </h2>
          <div style={{ overflowX: "auto", marginBottom: 24 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.98rem", color: "#d4c4a0" }}>
              <thead>
                <tr style={{ background: "rgba(200,160,80,0.08)" }}>
                  <th style={{ border: "1px solid rgba(200,160,80,0.18)", padding: "8px", color: "#c8a050", fontWeight: 600 }}>Familia</th>
                  <th style={{ border: "1px solid rgba(200,160,80,0.18)", padding: "8px", color: "#c8a050", fontWeight: 600 }}>Acción principal en piel</th>
                  <th style={{ border: "1px solid rgba(200,160,80,0.18)", padding: "8px", color: "#c8a050", fontWeight: 600 }}>Plantas de El Floema</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Polifenoles</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Antioxidante, fotoprotector, antiedad</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Maqui, arrayán, pitra</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Flavonoides</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Antiinflamatorio, antihistamínico, antiedad</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Matico, maqui, milenrama</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Antocianinas</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Antioxidante potente, antiedad, fotoprotector</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Maqui, chilco</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Taninos</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Astringente, antimicrobiano, cicatrizante</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Arrayán, pitra, triwe</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Monoterpenos (AE)</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Potenciador de penetración, antimicrobiano</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Todos los AE usados</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Triterpenos</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Antiinflamatorio, cicatrizante, antiseborreico</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Matico, milenrama</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Mucílagos</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Hidratante, calmante, filmógeno</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Matico, chilco</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Glucósidos</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Variable según tipo</td>
                  <td style={{ border: "1px solid rgba(200,160,80,0.13)", padding: "8px" }}>Varios</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
