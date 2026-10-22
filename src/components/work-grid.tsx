"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { Project } from "@/lib/content";
import { ProjectCard } from "./project-card";
import { useMotion } from "./motion-provider";

export function WorkGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All work");
  const grid = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const { enabled } = useMotion();
  useLayoutEffect(() => { window.dispatchEvent(new Event("portfolio:content")); }, [filter]);
  const filtered = projects.filter(project => filter === "All work" || (filter === "Landing pages" ? project.category === "Landing page" : project.category === "Business website"));
  async function change(value: string) {
    if (value === filter || busy.current) return;
    if (!enabled) { setFilter(value); return; }
    busy.current = true;
    const node = grid.current;
    if (!node) { busy.current = false; return; }
    const out = node.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: "both", easing: "ease-out" });
    await out.finished.catch(() => {});
    node.style.opacity = "0"; out.cancel();
    setFilter(value);
    requestAnimationFrame(() => {
      // Individual cards own their entrance. A second grid entrance used to
      // compound the same transforms and make filtering feel sluggish.
      node.style.removeProperty("opacity"); busy.current = false;
    });
  }
  return <><div className="work-filters" role="group" aria-label="Filter projects">{["All work", "Landing pages", "Business websites"].map(label => <button key={label} className={filter === label ? "active" : ""} aria-pressed={filter === label} onClick={() => void change(label)}>{label}<span>{label === "All work" ? "04" : "02"}</span></button>)}</div><p className="sr-only" aria-live="polite">{filtered.length} projects shown</p><div ref={grid} className="project-grid filtered-grid">{filtered.map((project, index) => <ProjectCard project={project} key={project.slug} priority={index === 0} />)}</div></>;
}
