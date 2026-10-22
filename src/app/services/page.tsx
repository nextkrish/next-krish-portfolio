import { pageMetadata } from "@/lib/seo";
import { OrbitObject } from "@/components/orbit-object";
import { PageIntro, SectionLabel, Button } from "@/components/ui";
import { FAQ } from "@/components/faq";
import { Arrow } from "@/components/icons";
import { TransitionLink } from "@/components/transition-link";

export const metadata = pageMetadata("/services", "Websites with character", "Landing pages and websites for businesses and personal brands. Explore website development with Next Krish.");
const services = [
  { title: "Landing pages", text: "One idea. A focused story. A clear next step for the people you want to reach.", art: "sheets" },
  { title: "Business websites", text: "A considered home for your business, with room for your services, your story, and the next conversation.", art: "windows" },
  { title: "Personal websites", text: "A place that feels like you. Bring your work, ideas, and identity together in one thoughtful experience.", art: "rings" },
];

export default function ServicesPage() {
  return <><section className="interactive-intro container"><PageIntro label="What we can make" title={<>From idea<br />to <em>interaction.</em></>}><p>I build websites with a clear purpose<br />and a little personality.</p></PageIntro><div className="intro-object"><OrbitObject shape="tile" /><span className="eyebrow">Move a little. Make a little.</span></div></section><section className="services-chapter light-chapter section-space"><div className="container"><div className="section-heading"><div><SectionLabel>Website development</SectionLabel><h2 className="editorial" data-reveal="text">What I <em>create.</em></h2></div><p className="section-note">A focused scope.<br />A considered experience.</p></div><div className="service-cards">{services.map((service, i) => <TransitionLink key={service.title} href="/contact" className="service-card" data-cursor="Talk" data-reveal="card"><div className="service-copy"><span className="eyebrow">0{i + 1}</span><h3>{service.title}</h3><p>{service.text}</p><span className="service-action">Let’s explore <Arrow /></span></div><div className={`service-art art-${service.art}`} aria-hidden="true"><i /><i /><i /><i /><i /></div></TransitionLink>)}</div></div></section><section className="service-process container section-space"><div className="section-heading"><div><SectionLabel>No mystery, just a process</SectionLabel><h2 className="editorial" data-reveal="text">A clear<br />path <em>forward.</em></h2></div><p className="section-note">A conversation first.<br />The right details next.</p></div><div className="service-process-grid">{[{ title: "Discover", text: "We discuss the purpose, pages, content, and references." }, { title: "Design", text: "We shape the layout, typography, and visual direction." }, { title: "Develop", text: "I build the agreed experience, then review the details." }].map((step, i) => <div key={step.title} data-reveal="up"><span className="process-point" /><span className="eyebrow">0{i + 1}</span><h3>{step.title}</h3><p>{step.text}</p></div>)}</div><div className="service-scope"><p>My current focus is websites. We’ll agree on a scope I can confidently take on.</p><Button href="/contact">Tell me about your idea</Button></div></section><FAQ compact /></>;
}
