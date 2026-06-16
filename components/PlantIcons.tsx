import React from "react";

const S = 56; // shared viewBox width
const T = 64; // shared viewBox height

function Icon({ children }: { children: React.ReactNode }) {
  return (
    <svg width={S} height={T} viewBox={`0 0 ${S} ${T}`} fill="none" aria-hidden="true">
      {children}
    </svg>
  );
}

export function IconMatico() {
  return (
    <Icon>
      <path d="M28 60 C28 60 10 44 10 27 C10 14 18 5 28 5 C38 5 46 14 46 27 C46 44 28 60 28 60Z"
        stroke="#c8a050" strokeWidth="0.8" opacity="0.45" />
      <path d="M28 7 C18 18 18 34 28 56" stroke="#3d5228" strokeWidth="0.85" opacity="0.65" />
      <path d="M28 18 C22 13 16 15 14 20" stroke="#3d5228" strokeWidth="0.7" opacity="0.5" />
      <path d="M28 28 C22 23 16 25 14 30" stroke="#3d5228" strokeWidth="0.68" opacity="0.45" />
      <path d="M28 38 C22 33 17 35 16 40" stroke="#3d5228" strokeWidth="0.6" opacity="0.38" />
      <path d="M28 18 C34 13 40 15 42 20" stroke="#3d5228" strokeWidth="0.7" opacity="0.42" />
      <path d="M28 28 C34 23 40 25 42 30" stroke="#3d5228" strokeWidth="0.65" opacity="0.38" />
    </Icon>
  );
}

export function IconPitra() {
  return (
    <Icon>
      <path d="M28 60 L28 30" stroke="#3d5228" strokeWidth="0.9" opacity="0.6" />
      <path d="M28 30 L14 18" stroke="#3d5228" strokeWidth="0.7" opacity="0.5" />
      <path d="M28 38 L42 27" stroke="#3d5228" strokeWidth="0.68" opacity="0.48" />
      <path d="M28 30 L36 15" stroke="#3d5228" strokeWidth="0.65" opacity="0.42" />
      <circle cx="12" cy="15" r="5.5" stroke="#c8a050" strokeWidth="0.8" opacity="0.5" />
      <circle cx="36" cy="11" r="5" stroke="#c8a050" strokeWidth="0.75" opacity="0.5" />
      <circle cx="43" cy="24" r="4.5" stroke="#c8a050" strokeWidth="0.75" opacity="0.45" />
      <circle cx="12" cy="15" r="2" fill="#c8a050" opacity="0.2" />
      <circle cx="36" cy="11" r="2" fill="#c8a050" opacity="0.2" />
      <path d="M28 38 C24 34 21 36 23 40" stroke="#3d5228" strokeWidth="0.6" opacity="0.4" />
      <path d="M28 46 C32 42 35 44 33 48" stroke="#3d5228" strokeWidth="0.6" opacity="0.38" />
    </Icon>
  );
}

export function IconArrayan() {
  return (
    <Icon>
      {/* 5 petals rotated 72° each, pivot (28,28) */}
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="28" cy="16" rx="4" ry="9"
          stroke="#c8a050" strokeWidth="0.8" opacity="0.48"
          transform={`rotate(${deg}, 28, 28)`} />
      ))}
      <circle cx="28" cy="28" r="5.5" stroke="#c8a050" strokeWidth="0.85" opacity="0.6" />
      <circle cx="28" cy="28" r="2.2" fill="#c8a050" opacity="0.3" />
      {/* stamens */}
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 28 + Math.cos(rad) * 7;
        const y = 28 + Math.sin(rad) * 7;
        return <circle key={deg} cx={x} cy={y} r="1" fill="#3d5228" opacity="0.45" />;
      })}
      <path d="M28 33 L28 56" stroke="#3d5228" strokeWidth="0.9" opacity="0.5" />
      <path d="M28 44 C22 40 18 42 20 47" stroke="#3d5228" strokeWidth="0.65" fill="none" opacity="0.42" />
      <path d="M28 50 C34 46 38 48 36 52" stroke="#3d5228" strokeWidth="0.65" fill="none" opacity="0.38" />
    </Icon>
  );
}

export function IconMaqui() {
  return (
    <Icon>
      <path d="M28 58 C18 50 8 40 10 26 C12 12 22 6 28 6 C34 6 44 12 46 26 C48 40 38 50 28 58Z"
        stroke="#7a4a8a" strokeWidth="0.8" opacity="0.42" />
      <circle cx="28" cy="20" r="5" stroke="#7a4a8a" strokeWidth="0.72" opacity="0.5" />
      <circle cx="18" cy="32" r="4.5" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.45" />
      <circle cx="38" cy="32" r="4.5" stroke="#7a4a8a" strokeWidth="0.7" opacity="0.45" />
      <circle cx="22" cy="44" r="4" stroke="#7a4a8a" strokeWidth="0.65" opacity="0.4" />
      <circle cx="34" cy="44" r="4" stroke="#7a4a8a" strokeWidth="0.65" opacity="0.4" />
      <path d="M28 6 C26 2 25 0 28 -1 C31 0 30 2 28 6" stroke="#3d5228" strokeWidth="0.7" opacity="0.45" />
      <path d="M28 6 C22 3 20 1 22 4" stroke="#3d5228" strokeWidth="0.6" opacity="0.35" />
      <path d="M28 6 C34 3 36 1 34 4" stroke="#3d5228" strokeWidth="0.6" opacity="0.35" />
    </Icon>
  );
}

export function IconTriwe() {
  return (
    <Icon>
      <path d="M28 3 C16 12 12 28 16 42 C20 52 28 58 28 58 C28 58 36 52 40 42 C44 28 40 12 28 3Z"
        stroke="#c8a050" strokeWidth="0.85" opacity="0.45" />
      <path d="M28 3 L28 58" stroke="#3d5228" strokeWidth="0.85" opacity="0.6" />
      <path d="M28 16 L19 23" stroke="#3d5228" strokeWidth="0.65" opacity="0.42" />
      <path d="M28 16 L37 23" stroke="#3d5228" strokeWidth="0.65" opacity="0.42" />
      <path d="M28 28 L18 36" stroke="#3d5228" strokeWidth="0.6" opacity="0.38" />
      <path d="M28 28 L38 36" stroke="#3d5228" strokeWidth="0.6" opacity="0.38" />
      <path d="M28 40 L21 46" stroke="#3d5228" strokeWidth="0.55" opacity="0.32" />
      <path d="M28 40 L35 46" stroke="#3d5228" strokeWidth="0.55" opacity="0.32" />
      <circle cx="21" cy="26" r="1.2" fill="#c8a050" opacity="0.22" />
      <circle cx="35" cy="20" r="1" fill="#c8a050" opacity="0.2" />
      <circle cx="22" cy="40" r="1" fill="#c8a050" opacity="0.18" />
    </Icon>
  );
}

export function IconChilco() {
  return (
    <Icon>
      <path d="M28 2 L28 18" stroke="#3d5228" strokeWidth="0.8" opacity="0.55" />
      {/* spreading sepals */}
      <path d="M28 18 C20 22 14 30 16 36" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M28 18 C36 22 42 30 40 36" stroke="#c8a050" strokeWidth="0.8" fill="none" opacity="0.5" />
      <path d="M28 18 C23 22 20 30 22 38" stroke="#c8a050" strokeWidth="0.75" fill="none" opacity="0.45" />
      <path d="M28 18 C33 22 36 30 34 38" stroke="#c8a050" strokeWidth="0.75" fill="none" opacity="0.45" />
      {/* corolla tube */}
      <path d="M21 35 C19 40 20 50 28 54 C36 50 37 40 35 35 C33 32 23 32 21 35Z"
        stroke="#7a4a8a" strokeWidth="0.82" opacity="0.55" />
      {/* stamens */}
      <line x1="24" y1="54" x2="22" y2="63" stroke="#c8a050" strokeWidth="0.6" opacity="0.4" />
      <line x1="28" y1="54" x2="28" y2="64" stroke="#c8a050" strokeWidth="0.65" opacity="0.45" />
      <line x1="32" y1="54" x2="34" y2="63" stroke="#c8a050" strokeWidth="0.6" opacity="0.4" />
      <circle cx="22" cy="63" r="1.4" fill="#c8a050" opacity="0.4" />
      <circle cx="28" cy="64" r="1.5" fill="#c8a050" opacity="0.42" />
      <circle cx="34" cy="63" r="1.4" fill="#c8a050" opacity="0.4" />
    </Icon>
  );
}

export function IconMilenrama() {
  return (
    <Icon>
      <path d="M28 60 L28 28" stroke="#3d5228" strokeWidth="0.9" opacity="0.6" />
      {/* flat-topped flower head */}
      <path d="M6 26 L50 26" stroke="#c8a050" strokeWidth="0.6" opacity="0.35" />
      {[6, 13, 20, 28, 36, 43, 50].map((x, i) => (
        <circle key={x} cx={x} cy={24 - (i === 3 ? 4 : i === 2 || i === 4 ? 2 : 0)}
          r={i === 3 ? 3 : i === 2 || i === 4 ? 2.5 : 2}
          stroke="#c8a050" strokeWidth="0.7" opacity={i === 3 ? 0.6 : 0.45} />
      ))}
      {/* branch stems */}
      <path d="M28 28 L13 27" stroke="#3d5228" strokeWidth="0.55" opacity="0.38" />
      <path d="M28 28 L43 27" stroke="#3d5228" strokeWidth="0.55" opacity="0.38" />
      <path d="M28 28 L20 27" stroke="#3d5228" strokeWidth="0.52" opacity="0.35" />
      <path d="M28 28 L36 27" stroke="#3d5228" strokeWidth="0.52" opacity="0.35" />
      {/* feathery leaves */}
      <path d="M28 40 C23 36 21 38 23 43" stroke="#3d5228" strokeWidth="0.55" fill="none" opacity="0.38" />
      <path d="M28 50 C33 46 35 48 33 52" stroke="#3d5228" strokeWidth="0.55" fill="none" opacity="0.35" />
      <path d="M28 44 C24 41 23 43 25 46" stroke="#3d5228" strokeWidth="0.5" fill="none" opacity="0.3" />
    </Icon>
  );
}

export const plantaIcons: Record<string, () => React.ReactElement> = {
  matico:    IconMatico,
  pitra:     IconPitra,
  arrayan:   IconArrayan,
  maqui:     IconMaqui,
  triwe:     IconTriwe,
  chilco:    IconChilco,
  milenrama: IconMilenrama,
};
