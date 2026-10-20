import Image from "next/image";
import { publicEmailDraft } from "@/lib/contact";
import { FooterSculpture } from "./footer-sculpture";
import { profile, socials } from "@/lib/content";
import { Button, SectionLabel } from "./ui";
import { TransitionLink } from "./transition-link";
import { Arrow } from "./icons";
import { BendyLine } from "./bendy-line";

export function Footer() {
  return <footer className="site-footer"><div className="container"><div className="footer-invitation"><FooterSculpture /><SectionLabel>Good things start with a conversation</SectionLabel><h2 className="editorial" data-reveal="text">Have something<br />in <em>mind?</em></h2><Button href="/contact">Let’s talk</Button></div><div className="footer-socials">{socials.map(link => <a key={link.label} aria-label={link.label} href={link.href} target="_blank" rel="noopener noreferrer"><span className="roll-text" data-text={link.label}>{link.label}</span><Arrow /></a>)}<a aria-label="Email Krish" href={publicEmailDraft}><span className="roll-text" data-text="Email">Email</span><Arrow /></a></div><BendyLine /><nav className="footer-nav" aria-label="Footer navigation">{[{ href: "/about", label: "About" }, { href: "/work", label: "Work" }, { href: "/services", label: "Services" }, { href: "/#tech", label: "Tech" }, { href: "/contact", label: "Contact" }].map(link => <TransitionLink key={link.href} href={link.href}>{link.label}</TransitionLink>)}<a href="/Krish-Kumar-Resume.pdf" download>Résumé <Arrow /></a></nav><div className="footer-bottom"><span>© {new Date().getFullYear()} Next Krish</span><TransitionLink href="/" className="footer-lockup" aria-label="Next Krish, back to home"><span className="footer-symbol"><Image src="/images/logo-original.webp" width={1280} height={1280} alt="" /></span><span>Next Krish</span></TransitionLink><span>Designed with intention.</span></div></div></footer>;
}
