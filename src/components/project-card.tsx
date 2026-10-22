import Image from "next/image";
import type { Project } from "@/lib/content";
import { Arrow } from "./icons";
import { TransitionLink } from "./transition-link";

export function ProjectArt({ project, compact = false, priority = false }: { project: Project; compact?: boolean; priority?: boolean }) {
  return <div aria-hidden="true" className={`project-art tone-${project.tone} ${compact ? "compact" : ""}`} style={{ backgroundColor: project.color }}>
    <div className="project-art-top"><span className="eyebrow">{project.category}</span><span className="eyebrow">{project.index} / 04</span></div>
    <span className="project-art-name" aria-hidden="true">{project.name}</span>
    <div className="project-orbit" aria-hidden="true" />
    <div className="project-window"><div className="window-bar"><span><i /><i /><i /></span><span>{project.domain}</span><Arrow /></div><Image src={project.image} width={1280} height={720} alt={`${project.name} website homepage`} preload={priority} sizes="(max-width: 760px) calc(100vw - 44px), (max-width: 1420px) calc((100vw - 200px) / 2), 610px" /></div>
  </div>;
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return <article className="project-card" data-reveal="card"><TransitionLink href={`/work/${project.slug}`} className="project-card-link" data-cursor="View"><ProjectArt project={project} priority={priority} /><div className="project-caption"><div><h3>{project.name}</h3><p>{project.category}</p></div><span className="project-arrow"><Arrow /></span></div></TransitionLink></article>;
}
