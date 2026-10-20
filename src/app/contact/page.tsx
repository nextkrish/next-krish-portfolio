import { pageMetadata } from "@/lib/seo";
import { publicEmailDraft, contactWhatsApp } from "@/lib/contact";
import { OrbitObject } from "@/components/orbit-object";
import { PageIntro, SectionLabel } from "@/components/ui";
import { ContactForm } from "@/components/contact-form";
import { FAQ } from "@/components/faq";
import { Arrow } from "@/components/icons";
import { profile, socials } from "@/lib/content";

export const metadata = pageMetadata("/contact", "Let’s talk", "Have a website project, a developer opportunity, or an idea? Get in touch with Krish Kumar.");

export default function ContactPage() {
  return <><section className="interactive-intro contact-intro container"><PageIntro label="Something starts here" title={<>Have something<br />in <em>mind?</em></>}><p>A project, a role,<br />or a good conversation.</p></PageIntro><div className="intro-object contact-orbit"><OrbitObject shape="planet" /><span className="eyebrow">An idea. A connection. A beginning.</span></div></section><section className="contact-chapter dark-contact section-space"><div className="container contact-grid"><div className="contact-info"><SectionLabel>Get in touch</SectionLabel><h2 className="editorial" data-reveal="text">Let’s<br /><em>talk.</em></h2><div className="contact-direct"><a href={publicEmailDraft}>{profile.contact.publicEmail}<Arrow /></a><a href={contactWhatsApp()} target="_blank" rel="noopener noreferrer" aria-label="Chat with Krish on WhatsApp">WhatsApp <Arrow /></a><span className="eyebrow availability"><i /> Open to website projects</span></div><div className="contact-socials">{socials.map(link => <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<Arrow /></a>)}</div></div><ContactForm /></div></section><FAQ /></>;
}
