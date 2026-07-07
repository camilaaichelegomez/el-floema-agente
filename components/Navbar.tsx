"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav className={`navbar-grimorio${scrolled ? " scrolled" : ""}`}>
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" onClick={close}>
          <img src="/logo.jpg" alt="El Floema" />
          <span className="navbar-title">El Floema</span>
        </Link>

        <button
          className="navbar-burger"
          aria-label="Abrir menú"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`navbar-links${open ? " open" : ""}`}>
          <li><Link href="/"             onClick={close}>Inicio</Link></li>
          <li><Link href="/plantas"      onClick={close}>Plantas</Link></li>
          <li><Link href="/biblioteca"   onClick={close}>Biblioteca</Link></li>
          <li><Link href="/ingredientes" onClick={close}>Ingredientes</Link></li>
          <li><Link href="/formulas"     onClick={close}>Fórmulas</Link></li>
          <li><Link href="/recetas"      onClick={close}>Recetas</Link></li>
          <li><Link href="/blog"         onClick={close}>Blog</Link></li>
          <li><Link href="/belleza"      onClick={close}>Belleza</Link></li>
          <li><Link href="/formulacion"  onClick={close}>Formulación</Link></li>
          <li><Link href="/agente"       onClick={close}>Agente</Link></li>
          <li><Link href="/lab"          onClick={close}>El Floema Lab</Link></li>
        </ul>
      </div>
    </nav>
  );
}
