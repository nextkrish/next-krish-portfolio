import type { ReactNode } from "react";
import { Arrow } from "./icons";
import { TransitionLink } from "./transition-link";

export function Button({ href, children, light = false, external = false, download = false, className = "" }: { href: string; children: ReactNode; light?: boolean; external?: boolean; download?: boolean; className?: string }) {
  const content = <><span className="button-ripple" aria-hidden="true" /><span className="button-title"><span data-label={typeof children === "string" ? children : undefined}>{children}</span></span><Arrow /></>;
  const props = { className: `button ${light ? "button-light" : ""} ${className}`, "data-magnetic": true, "aria-label": typeof children === "string" ? children : undefined };
  if (external || download || !href.startsWith("/")) return <a href={href} {...props} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} download={download || undefined}>{content}</a>;
  return <TransitionLink href={href} {...props}>{content}</TransitionLink>;
}

export function TextLink({ href, children, external = false }: { href: string; children: string; external?: boolean }) {
  const inner = <><span className="roll-text" data-text={children}>{children}</span><Arrow /></>;
  return external ? <a className="text-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={children}>{inner}</a> : <TransitionLink className="text-link" href={href} aria-label={children}>{inner}</TransitionLink>;
}

export function SectionLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function PageIntro({ label, title, children }: { label: string; title: ReactNode; children?: ReactNode }) {
  return <header className="page-intro container"><SectionLabel>{label}</SectionLabel><h1 className="display page-title" data-reveal="hero">{title}</h1>{children && <div className="page-intro-copy" data-reveal="up">{children}</div>}</header>;
}
