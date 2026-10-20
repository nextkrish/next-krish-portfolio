import { Arrow } from "./icons";

const tools = ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "GSAP", "Three.js", "Git"];

export function TechGrid({ inverse = false }: { inverse?: boolean }) {
  return <section className={`tech-section section-space ${inverse ? "tech-dark" : "light-chapter"}`} id="tech" aria-labelledby="tech-title"><div className="container"><div className="tech-heading"><h2 id="tech-title" data-reveal="text">Tech I work with.</h2></div><div className="tech-grid">{tools.map((name, i) => <button key={name} className="tech-item"><span className="tech-number" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span><span>{name}</span><Arrow /></button>)}</div></div></section>;
}
