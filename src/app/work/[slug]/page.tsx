import { pageMetadata, absoluteUrl, siteOrigin } from "@/lib/seo";
import { StructuredData } from "@/components/structured-data";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import { Button, SectionLabel, TextLink } from "@/components/ui";
import { ProjectArt } from "@/components/project-card";
import { TransitionLink } from "@/components/transition-link";
import { Arrow } from "@/components/icons";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = projects.find(item => item.slug === slug);
  return pageMetadata(`/work/${slug}`, project?.name || "Project not found", project?.description || "A website project by Krish Kumar.");
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(item => item.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><StructuredData data={{ "@context": "https://schema.org", "@type": "CreativeWork", name: project.name, description: project.brief, url: absoluteUrl(`/work/${project.slug}`), sameAs: project.url, image: absoluteUrl(project.image), creator: { "@type": "Person", "@id": siteOrigin ? `${siteOrigin}/#krish` : undefined, name: "Krish Kumar" }, genre: project.category }} /><header className="case-header container"><TransitionLink className="case-back eyebrow" href="/work"><Arrow direction="down" /> All projects</TransitionLink><SectionLabel>{project.category} / Project {project.index}</SectionLabel><h1 className="case-title" data-reveal="hero">{project.name}</h1><div className="case-intro"><p>{project.line}</p><Button href={project.url} external>Visit live website</Button></div><div className="case-meta"><div><span className="eyebrow">Focus</span><p>Website development</p></div><div><span className="eyebrow">Format</span><p>{project.category}</p></div><div><span className="eyebrow">Project</span><p>{project.index} / 04</p></div></div></header><section className={`case-hero-media tone-${project.tone}`} style={{ background: project.color }} aria-label={`${project.name} website preview`}><div className="container"><div className="case-browser" data-reveal="up"><div className="window-bar"><span><i /><i /><i /></span><span>{project.domain}</span><Arrow /></div><Image src={project.image} width={1280} height={720} priority alt={`${project.name} homepage, captured from the live website`} sizes="90vw" /></div></div></section><section className="case-story light-chapter section-space"><div className="container"><div className="case-story-intro"><SectionLabel>The idea</SectionLabel><div><h2 className="editorial" data-reveal="text">A little purpose.<br />A clearer <em>presence.</em></h2><p>{project.brief}</p></div></div>{project.slug !== "agra-iron-gym" && <div className="case-detail-frame" data-reveal="up"><Image src={project.detailImage} width={1280} height={720} alt={`A section of the ${project.name} website`} sizes="90vw" /></div>}</div></section><section className="case-decisions container section-space"><div><SectionLabel>Inside the experience</SectionLabel><h2 className="editorial" data-reveal="text">Built around<br />the <em>details.</em></h2></div><div><p className="case-focus">{project.focus}</p><ol>{project.decisions.map((decision, i) => <li key={decision}><span className="eyebrow">0{i + 1}</span><p>{decision}</p></li>)}</ol><TextLink href={project.url} external>Explore the live website</TextLink></div></section><section className="next-project-section"><div className="container"><SectionLabel>Keep exploring / Next project</SectionLabel><TransitionLink href={`/work/${next.slug}`} className="next-project-link" data-cursor="Next"><div><h2 className="editorial">{next.name}</h2><p>{next.line}</p><span className="circle-arrow"><Arrow /></span></div><ProjectArt project={next} compact /></TransitionLink></div></section></>;
}
