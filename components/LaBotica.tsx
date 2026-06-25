"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const GOLD = "#c8a050";
const GOLD_LIGHT = "#e8c878";
const CREAM = "#d4c4a0";

const PURPLE = "#7a4a8a";

const PRODUCTOS = [
  {
    slug: "balsamo-pitra",
    nombre: "Bálsamo Pitra",
    categoria: "Ungüento",
    descripcion: "Ungüento cicatrizante botánico para pieles irritadas y heridas superficiales.",
    precio: 10000,
    glyph: "✦",
    accent: "rgba(61,82,40,0.55)",
  },
  {
    slug: "crema-matico",
    nombre: "Crema Matico",
    categoria: "Crema Facial",
    descripcion: "Crema facial matificante con ZnO. Regula el sebo y calma la inflamación activa.",
    precio: 12000,
    glyph: "◯",
    accent: "rgba(200,160,80,0.22)",
  },
  {
    slug: "unguento-dolor",
    nombre: "Ungüento Dolor",
    categoria: "Antiinflamatorio",
    descripcion: "Antiinflamatorio tópico con arrayán y clavo. Alivia contracturas y dolores musculares.",
    precio: 10000,
    glyph: "⬡",
    accent: "rgba(122,74,138,0.42)",
  },
  {
    slug: "vela-bosque",
    nombre: "Vela Bosque Valdiviano",
    categoria: "Aromaterapia",
    descripcion: "Aromaterapia con cedro y ciprés del sur. Evoca el bosque templado lluvioso.",
    precio: 8000,
    glyph: "❋",
    accent: "rgba(42,21,53,0.55)",
  },
];

function ProductCard({
  producto,
  index,
}: {
  producto: (typeof PRODUCTOS)[0];
  index: number;
}) {
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background: "#0f1a0f",
        border: `1px solid ${hovered ? "rgba(122,74,138,0.65)" : "rgba(200,160,80,0.18)"}`,
        borderRadius: "4px",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        boxShadow: hovered
          ? "0 32px 70px rgba(0,0,0,0.8), 0 0 40px rgba(122,74,138,0.18), inset 0 1px 0 rgba(122,74,138,0.08)"
          : "0 4px 24px rgba(0,0,0,0.4), inset 0 1px rgba(200,160,80,0.06)",
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
    >
      {/* Purple gem corners */}
      <span style={{ position: "absolute", top: 7,  left: 7,  width: 6, height: 6, borderRadius: "50%", background: PURPLE, opacity: hovered ? 0.9 : 0.5, boxShadow: hovered ? `0 0 12px ${PURPLE}` : "none", zIndex: 3, transition: "opacity 0.4s, box-shadow 0.4s", pointerEvents: "none" }} aria-hidden="true" />
      <span style={{ position: "absolute", top: 7,  right: 7, width: 6, height: 6, borderRadius: "50%", background: PURPLE, opacity: hovered ? 0.9 : 0.5, boxShadow: hovered ? `0 0 12px ${PURPLE}` : "none", zIndex: 3, transition: "opacity 0.4s, box-shadow 0.4s", pointerEvents: "none" }} aria-hidden="true" />
      <span style={{ position: "absolute", bottom: 7, left: 7,  width: 6, height: 6, borderRadius: "50%", background: PURPLE, opacity: hovered ? 0.9 : 0.5, boxShadow: hovered ? `0 0 12px ${PURPLE}` : "none", zIndex: 3, transition: "opacity 0.4s, box-shadow 0.4s", pointerEvents: "none" }} aria-hidden="true" />
      <span style={{ position: "absolute", bottom: 7, right: 7, width: 6, height: 6, borderRadius: "50%", background: PURPLE, opacity: hovered ? 0.9 : 0.5, boxShadow: hovered ? `0 0 12px ${PURPLE}` : "none", zIndex: 3, transition: "opacity 0.4s, box-shadow 0.4s", pointerEvents: "none" }} aria-hidden="true" />
      {/* corner bracket TL */}
      <span
        style={{
          position: "absolute",
          top: -1,
          left: -1,
          width: hovered ? 44 : 28,
          height: hovered ? 44 : 28,
          borderTop: `1.5px solid ${hovered ? "rgba(154,106,170,0.85)" : "rgba(200,160,80,0.28)"}`,
          borderLeft: `1.5px solid ${hovered ? "rgba(154,106,170,0.85)" : "rgba(200,160,80,0.28)"}`,
          zIndex: 2,
          transition: "width 0.4s, height 0.4s, border-color 0.4s",
          pointerEvents: "none",
        }}
      />
      {/* corner bracket BR */}
      <span
        style={{
          position: "absolute",
          bottom: -1,
          right: -1,
          width: hovered ? 44 : 28,
          height: hovered ? 44 : 28,
          borderBottom: `1.5px solid ${hovered ? "rgba(154,106,170,0.85)" : "rgba(200,160,80,0.28)"}`,
          borderRight: `1.5px solid ${hovered ? "rgba(154,106,170,0.85)" : "rgba(200,160,80,0.28)"}`,
          zIndex: 2,
          transition: "width 0.4s, height 0.4s, border-color 0.4s",
          pointerEvents: "none",
        }}
      />

      {/* image area */}
      <div
        style={{
          height: 210,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.6rem",
          borderBottom: "1px solid rgba(200,160,80,0.08)",
          position: "relative",
          overflow: "hidden",
          background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${producto.accent} 0%, transparent 70%), linear-gradient(135deg, #152515 0%, #0d1a0d 100%)`,
          filter: hovered ? "brightness(1.1)" : "brightness(1)",
          transition: "filter 0.4s",
        }}
      >
        {/* Decorative ring */}
        <span
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: `1px solid ${hovered ? "rgba(154,106,170,0.25)" : "rgba(200,160,80,0.12)"}`,
            transition: "border-color 0.4s",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            fontSize: "3.4rem",
            color: hovered ? "rgba(200,160,80,0.45)" : "rgba(200,160,80,0.2)",
            lineHeight: 1,
            transform: hovered ? "scale(1.12)" : "scale(1)",
            transition: "color 0.4s, transform 0.4s",
            display: "block",
            position: "relative",
            zIndex: 1,
          }}
        >
          {producto.glyph}
        </span>
      </div>

      {/* body */}
      <div
        style={{
          padding: "1.4rem 1.6rem 1.65rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.45rem",
          flex: 1,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.62rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(154,106,170,0.7)",
              margin: "0 0 0.2rem",
              borderBottom: "1px solid rgba(200,160,80,0.2)",
              paddingBottom: "0.4rem",
            }}
          >
            {producto.categoria}
          </p>
          <h3
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.9rem",
              color: CREAM,
              letterSpacing: "0.06em",
              lineHeight: 1.25,
              margin: 0,
            }}
          >
            {producto.nombre}
          </h3>
        </div>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "0.82rem",
            color: "rgba(212,196,160,0.4)",
            lineHeight: 1.5,
            margin: 0,
            flex: 1,
          }}
        >
          {producto.descripcion}
        </p>

        {/* footer: price + button */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            marginTop: "0.75rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid rgba(200,160,80,0.1)",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.92rem",
              color: GOLD,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            ${producto.precio.toLocaleString("es-CL")} CLP
          </span>
          <button
            onClick={() => {
              setAdded(true);
              setTimeout(() => setAdded(false), 2200);
            }}
            style={{
              fontFamily: "var(--font-grimoire)",
              fontSize: "0.68rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: added ? GOLD_LIGHT : GOLD,
              background: added ? "rgba(200,160,80,0.08)" : "transparent",
              border: `1px solid ${added ? "rgba(232,200,120,0.6)" : "rgba(200,160,80,0.45)"}`,
              padding: "0.6rem 1.2rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "background 0.25s, border-color 0.25s, color 0.25s",
            }}
          >
            {added ? "✓ Agregado" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function LaBotica() {
  return (
    <section
      style={{
        position: "relative",
        background: "rgba(6,11,6,0.55)",
        padding: "clamp(5.5rem,10vh,9rem) clamp(1.5rem,5vw,5rem) clamp(3rem,5vh,5rem)",
        overflow: "hidden",
        borderTop: "1px solid rgba(122,74,138,0.18)",
      }}
    >
      {/* Atmospheric glow — purple dominant */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `
            radial-gradient(ellipse 100% 50% at 50% 0%,   rgba(200,160,80,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 70%  60% at 0%   50%,  rgba(90,45,107,0.22)  0%, transparent 55%),
            radial-gradient(ellipse 70%  60% at 100% 50%,  rgba(90,45,107,0.18)  0%, transparent 55%),
            radial-gradient(ellipse 55%  45% at 50%  100%, rgba(42,21,53,0.35)   0%, transparent 60%),
            radial-gradient(ellipse 40%  30% at 50%  40%,  rgba(122,74,138,0.08) 0%, transparent 50%)
          `,
        }}
      />
      {/* Section-level corner gems */}
      {[
        { top: 20, left:  20 },
        { top: 20, right: 20 },
        { bottom: 20, left:  20 },
        { bottom: 20, right: 20 },
      ].map((pos, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            ...pos,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#7a4a8a",
            opacity: 0.55,
            boxShadow: "0 0 14px rgba(122,74,138,0.7)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      ))}

      {/* giant ghost text */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-grimoire)",
          fontSize: "clamp(8rem,22vw,22rem)",
          color: "rgba(200,160,80,0.022)",
          letterSpacing: "0.3em",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        BOTICA
      </span>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.95 }}
        style={{
          textAlign: "center",
          marginBottom: "clamp(3rem,6vh,5rem)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            maxWidth: 340,
            margin: "0 auto 1.1rem",
            opacity: 0.38,
          }}
        >
          <span style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${GOLD})`, display: "block" }} />
          <span style={{ fontFamily: "var(--font-grimoire)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, whiteSpace: "nowrap" }}>
            Cosmética Botánica
          </span>
          <span style={{ flex: 1, height: 1, background: `linear-gradient(to left, transparent, ${GOLD})`, display: "block" }} />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-grimoire)",
            fontSize: "clamp(2.5rem,7vw,5.5rem)",
            color: GOLD,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 700,
            lineHeight: 1,
            margin: "0 0 0.85rem",
            textShadow:
              "0 0 80px rgba(200,160,80,0.38), 0 0 160px rgba(200,160,80,0.14), 0 3px 12px rgba(0,0,0,0.9)",
          }}
        >
          La Botica
        </h2>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: "clamp(1rem,2vw,1.2rem)",
            color: CREAM,
            opacity: 0.42,
            margin: 0,
            letterSpacing: "0.05em",
          }}
        >
          Elaborado con ciencia, entregado con alma
        </p>
      </motion.div>

      {/* product grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "clamp(1rem,2vw,1.75rem)",
          maxWidth: 1160,
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {PRODUCTOS.map((p, i) => (
          <ProductCard key={p.slug} producto={p} index={i} />
        ))}
      </div>

      {/* bottom flourish */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          height: 1,
          background:
            "linear-gradient(to right, transparent, rgba(200,160,80,0.12), transparent)",
          maxWidth: 500,
          margin: "clamp(2rem,4vh,3.5rem) auto 0",
          position: "relative",
          zIndex: 1,
        }}
      />
    </section>
  );
}
