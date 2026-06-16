// Placeholder logo for El Floema. Replace with your SVG or PNG as needed.
import React from "react";

export default function LogoElFloema(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="22" cy="22" r="21" stroke="#c8a050" strokeWidth="2.2" fill="#1a2e1a" />
      <path d="M22 10c3.5 4.5 7.5 7.5 7.5 12.5 0 4.5-3.5 8-7.5 8s-7.5-3.5-7.5-8C14.5 17.5 18.5 14.5 22 10Z" fill="#c8a050" fillOpacity="0.18" stroke="#c8a050" strokeWidth="1.2" />
      <ellipse cx="22" cy="27" rx="4.5" ry="2.2" fill="#7b3b90" fillOpacity="0.7" />
      <ellipse cx="22" cy="17.5" rx="2.2" ry="1.1" fill="#c8a050" fillOpacity="0.7" />
    </svg>
  );
}
