/** Separador decorativo: líneas doradas finas + símbolo botánico al centro */
export function SectionDivider() {
  return (
    <div className="section-divider" role="presentation" aria-hidden="true">
      <span className="section-divider__line" />
      <svg className="section-divider__glyph" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="3.2" fill="none" stroke="#c8a050" strokeWidth="0.65" opacity="0.9" />
        <path
          d="M24 8 C18 14 16 22 24 28 C32 22 30 14 24 8Z"
          fill="none"
          stroke="#3d5228"
          strokeWidth="0.75"
          opacity="0.95"
        />
        <path
          d="M24 40 C18 34 16 26 24 20 C32 26 30 34 24 40Z"
          fill="none"
          stroke="#3d5228"
          strokeWidth="0.75"
          opacity="0.95"
        />
        <line x1="24" y1="11" x2="24" y2="37" stroke="#c8a050" strokeWidth="0.45" opacity="0.5" />
      </svg>
      <span className="section-divider__line" />
    </div>
  );
}
