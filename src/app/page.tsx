import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Hero } from "@/components/hero";
import { ParticleField } from "@/components/particle-field";
import { TechGrid } from "@/components/tech-grid";
import { ProjectCard } from "@/components/project-card";
import { Button, SectionLabel, TextLink } from "@/components/ui";
import { FAQ } from "@/components/faq";
import { projects, profile } from "@/lib/content";
import { Arrow } from "@/components/icons";

export const metadata = { ...pageMetadata("/", "Website developer & BCA student", "Next Krish is the portfolio of Krish Kumar, a BCA student building landing pages and business websites. Explore four live projects or start a conversation."), title: { absolute: "Next Krish — Krish Kumar | Website Developer" } };

export default function Home() {
  return <>
    <Hero />
    <section id="curiosity" className="curiosity-section" aria-labelledby="curiosity-title"><div className="container curiosity-header"><h2 id="curiosity-title" className="editorial" data-reveal="text">A little <em>curiosity.</em></h2><SectionLabel>01 / An invitation to play</SectionLabel></div><ParticleField /><div className="container curiosity-caption"><span className="eyebrow">Good things happen<br />when you explore.</span><span className="eyebrow">Move your cursor <span className="tiny-dot" /></span></div></section>
    <TechGrid />
    <section className="work-section dark-chapter section-space" id="selected-work" aria-labelledby="work-title"><div className="container"><div className="section-heading"><div><SectionLabel>A few things I’ve cooked</SectionLabel><h2 id="work-title" className="display" data-reveal="text">Selected <em>work.</em></h2></div><span className="eyebrow work-count">04 / Websites & landing pages</span></div><div className="project-grid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div><div className="center-action"><Button href="/work">View all projects</Button></div></div></section>
    <section className="capabilities-section container section-space"><div className="capability-art" data-reveal="up"><div className="floating-site rear"><Image src={projects[1].image} width={1280} height={720} alt="" sizes="40vw" /></div><div className="floating-site front"><Image src={projects[2].image} width={1280} height={720} alt="Velvet Touch Salon website created by Krish" sizes="(max-width: 700px) 90vw, 45vw" /></div><div className="art-ground" /></div><div className="capability-copy"><SectionLabel>What I create</SectionLabel><h2 className="editorial" data-reveal="text">A good idea.<br />A website with<br /><em>character.</em></h2><div className="capability-links" data-reveal="up"><TextLink href="/services">Landing pages</TextLink><TextLink href="/services">Business websites</TextLink><TextLink href="/services">Personal websites</TextLink></div></div></section>
    <section className="process-section container section-space"><div><SectionLabel>A considered approach</SectionLabel><h2 className="editorial" data-reveal="text">From idea<br />to <em>interaction.</em></h2></div><ol className="process-list" data-reveal="up">{[{ title: "Discover", text: "Find the purpose. Ask the right questions." }, { title: "Design", text: "Make it clear. Give it character." }, { title: "Develop", text: "Build the details. Refine the experience." }].map((item, i) => <li key={item.title}><span className="process-point" /><span className="eyebrow">0{i + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></section>
    <section className="reviews-section light-chapter section-space" aria-labelledby="reviews-title"><div className="container"><div className="reviews-heading"><SectionLabel>A place for future feedback</SectionLabel><h2 id="reviews-title" className="display" data-reveal="text">Kind <em>words.</em></h2><span className="preview-badge">Sample layout</span></div><div className="review-fan">{profile.reviews.drafts.map((review, i) => <article className="review-slot" key={review.text} tabIndex={0}><div className="review-card"><span className="review-quote" aria-hidden="true">“</span><p>{review.text}</p><span className="eyebrow">Sample feedback / 0{i + 1}</span></div></article>)}</div><p className="review-disclaimer">Illustrative feedback, not client testimonials. Real reviews will take their place.</p></div></section>
    <FAQ />
    <section className="about-note container"><span className="eyebrow">A human behind the pixels</span><p>Student by day.<br /><span>A little more curious</span> every day.</p><TextLink href="/about">Meet Krish</TextLink></section>
  </>;
}
