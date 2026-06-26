import Link from "next/link";

const AGENTES = [
  {
    href: "/agente",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 34, height: 34 }}>
        <path d="M24 6C24 6 10 14 10 26C10 33.7 16.3 40 24 40C31.7 40 38 33.7 38 26C38 14 24 6Z" stroke="#c8a050" strokeWidth="1.5" fill="rgba(200,160,80,0.06)"/>
        <path d="M24 40V22" stroke="#c8a050" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M24 28C24 28 18 24 16 18" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M24 32C24 32 29 28 31 22" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="24" cy="22" r="2" fill="#c8a050" opacity="0.7"/>
      </svg>
    ),
    titulo: "Agente Botánico",
    descripcion: "Consulta sobre plantas medicinales, fitoterapia, Ayurveda y Medicina Tradicional China",
    etiqueta: "6.029 artículos científicos",
    color: "rgba(80,160,80,0.12)",
    border: "rgba(200,160,80,0.35)",
  },
  {
    href: "/belleza",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 34, height: 34 }}>
        <circle cx="24" cy="20" r="7" stroke="#c8a050" strokeWidth="1.5" fill="rgba(200,160,80,0.06)"/>
        <path d="M24 13C24 13 24 6 24 4" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M24 27C24 27 24 34 24 36" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M17 16.5C17 16.5 11 13 9 12" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M31 23.5C31 23.5 37 27 39 28" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M17 23.5C17 23.5 11 27 9 28" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M31 16.5C31 16.5 37 13 39 12" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="24" cy="20" r="3" fill="#c8a050" opacity="0.25"/>
        <path d="M20 38C20 38 22 44 24 44C26 44 28 38 28 38" stroke="#c8a050" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
    titulo: "Asesora de Belleza",
    descripcion: "Rutinas personalizadas para tu piel y cabello con el respaldo de la botánica",
    etiqueta: "649 artículos científicos",
    color: "rgba(160,80,140,0.10)",
    border: "rgba(200,160,80,0.35)",
  },
  {
    href: "/formulacion",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 34, height: 34 }}>
        <path d="M18 6H30V16L38 32C39.5 35 37.5 40 34 40H14C10.5 40 8.5 35 10 32L18 16V6Z" stroke="#c8a050" strokeWidth="1.5" fill="rgba(200,160,80,0.06)"/>
        <path d="M16 6H32" stroke="#c8a050" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13 30H35" stroke="#c8a050" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="20" cy="34" r="2" fill="#c8a050" opacity="0.4"/>
        <circle cx="27" cy="32" r="1.5" fill="#c8a050" opacity="0.3"/>
        <circle cx="31" cy="36" r="1" fill="#c8a050" opacity="0.4"/>
        <path d="M22 18C22 18 20 22 22 24C24 26 26 22 26 22" stroke="#c8a050" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    titulo: "Asesora de Formulación",
    descripcion: "Formula tus propios cosméticos con respaldo científico: cremas, shampoos, sérums y más",
    etiqueta: "935 artículos científicos",
    color: "rgba(80,120,200,0.08)",
    border: "rgba(200,160,80,0.35)",
  },
];

export function AgentesIA() {
  return (
    <section
      style={{
        background: "rgba(13,26,13,0.3)",
        padding: "5rem 1.5rem 6rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Fondo radial sutil */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(200,160,80,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Encabezado */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "var(--color-gold)",
              opacity: 0.9,
              marginBottom: "0.75rem",
              textShadow: "0 1px 6px rgba(0,0,0,0.9)",
            }}
          >
            Inteligencia Botánica
          </p>
          <h2
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
              fontWeight: 400,
              color: "var(--color-gold-light)",
              letterSpacing: "0.1em",
              margin: "0 0 1rem",
              textShadow: "0 2px 12px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,1)",
            }}
          >
            Consulta con Floema
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontStyle: "italic",
              fontSize: "1.15rem",
              color: "var(--color-cream)",
              opacity: 1,
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
              textShadow: "0 2px 10px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)",
            }}
          >
            Tres asistentes especializadas, cada una entrenada con cientos de artículos científicos
          </p>
          {/* Separador dorado */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              maxWidth: 280,
              margin: "1.75rem auto 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, transparent, rgba(200,160,80,0.4))" }} />
            <span style={{ color: "var(--color-gold)", fontSize: "0.7rem", opacity: 0.6 }}>✦</span>
            <div style={{ flex: 1, height: 1, background: "linear-gradient(to left, transparent, rgba(200,160,80,0.4))" }} />
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
          }}
        >
          {AGENTES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              style={{ textDecoration: "none" }}
            >
              <div
                className="agente-card"
                style={{
                  background: `linear-gradient(135deg, rgba(8,15,8,0.92), rgba(6,12,6,0.95))`,
                  border: `1.5px solid rgba(200,160,80,0.55)`,
                  borderRadius: "1rem",
                  padding: "2rem 1.75rem",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  cursor: "pointer",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,0,0,0.3), inset 0 1px rgba(200,160,80,0.1)",
                }}
              >
                {/* Brillo de esquina */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 120,
                    height: 120,
                    background: "radial-gradient(circle at top right, rgba(200,160,80,0.07), transparent 70%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Icono */}
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "0.75rem",
                    background: "rgba(200,160,80,0.06)",
                    border: "1px solid rgba(200,160,80,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {a.icon}
                </div>

                {/* Texto */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-grimoire)",
                      fontSize: "1rem",
                      letterSpacing: "0.08em",
                      color: "var(--color-gold-light)",
                      margin: "0 0 0.6rem",
                      fontWeight: 400,
                      textShadow: "0 1px 6px rgba(0,0,0,0.9)",
                    }}
                  >
                    {a.titulo}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontStyle: "italic",
                      fontSize: "0.95rem",
                      color: "var(--color-cream)",
                      opacity: 0.92,
                      margin: 0,
                      lineHeight: 1.65,
                      textShadow: "0 1px 4px rgba(0,0,0,0.85)",
                    }}
                  >
                    {a.descripcion}
                  </p>
                </div>

                {/* Footer de la card */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(200,160,80,0.1)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-grimoire)",
                      fontSize: "0.72rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "var(--color-gold)",
                      opacity: 0.70,
                    }}
                  >
                    {a.etiqueta}
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c8a050" strokeWidth="1.5" opacity={0.5}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .agente-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.4), 0 0 24px rgba(200,160,80,0.08);
          border-color: rgba(200,160,80,0.5) !important;
        }
      `}</style>
    </section>
  );
}
