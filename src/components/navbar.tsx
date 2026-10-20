"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { TransitionLink } from "./transition-link";
import { Arrow } from "./icons";

const links = [{ href: "/work", label: "Work" }, { href: "/about", label: "About" }, { href: "/services", label: "Services" }];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);
  const toggle = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => { setOpen(false); setHidden(false); }, [pathname]);
  useEffect(() => {
    const scroll = () => { const y = window.scrollY; setHidden(y > 450 && y > last.current && !open); last.current = y; };
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, [open]);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    const content = document.getElementById("page-content");
    const motion = document.querySelector<HTMLElement>(".motion-toggle");
    if (content) content.inert = open;
    if (motion) motion.inert = open;
    const key = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
      if (event.key === "Tab") {
        const controls = Array.from(header.current?.querySelectorAll<HTMLElement>("a,button") || []).filter(node => node.getClientRects().length > 0);
        const first = controls[0], lastControl = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); lastControl?.focus(); }
        else if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", key);
    return () => { document.documentElement.classList.remove("menu-open"); if(content)content.inert=false; if(motion)motion.inert=false; document.removeEventListener("keydown", key); };
  }, [open]);
  return <header ref={header} className={`site-header ${hidden ? "header-hidden" : ""}`}>
    <div className="nav-shell">
      <TransitionLink href="/" className="brand" aria-label="Next Krish, home">Next Krish<span className="brand-dot" /></TransitionLink>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <TransitionLink key={link.href} href={link.href} aria-label={link.label} aria-current={pathname.startsWith(link.href) ? "page" : undefined}><span className="roll-text" data-text={link.label}>{link.label}</span></TransitionLink>)}</nav>
      <TransitionLink href="/contact" className="nav-contact" aria-label="Let’s talk"><span className="roll-text" data-text="Let’s talk">Let’s talk</span><Arrow /></TransitionLink>
      <button ref={toggle} className={`menu-toggle ${open ? "open" : ""}`} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}><span /><span /></button>
    </div>
    <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation" hidden={!open}>{[...links, { href: "/contact", label: "Let’s talk" }].map((link, i) => <TransitionLink key={link.href} href={link.href} onClick={() => setOpen(false)}><span className="eyebrow">0{i + 1}</span>{link.label}<Arrow /></TransitionLink>)}</nav>
  </header>;
}
