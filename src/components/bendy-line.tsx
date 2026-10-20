"use client";

import { useRef } from "react";
import { useMotion } from "./motion-provider";

export function BendyLine() {
  const path = useRef<SVGPathElement>(null);
  const shape = useRef({ x: 500, y: 30 });
  const { enabled } = useMotion();
  return <div className="bendy-line" aria-hidden="true" onPointerMove={event => {
    if (!enabled || event.pointerType !== "mouse") return;
    const b = event.currentTarget.getBoundingClientRect();
    void import("gsap").then(({default:gsap}) => gsap.to(shape.current, { x: (event.clientX - b.left) / b.width * 1000, y: (event.clientY - b.top) / b.height * 120 - 30, duration: .25, overwrite: true, onUpdate: () => path.current?.setAttribute("d", `M0 30 Q${shape.current.x} ${shape.current.y} 1000 30`) }));
  }} onPointerLeave={() => { void import("gsap").then(({default:gsap}) => gsap.to(shape.current, { x: 500, y: 30, duration: 1.7, ease: "elastic.out(1,.2)", overwrite: true, onUpdate: () => path.current?.setAttribute("d", `M0 30 Q${shape.current.x} ${shape.current.y} 1000 30`) })); }}><svg viewBox="0 0 1000 60" preserveAspectRatio="none"><path ref={path} d="M0 30 Q500 30 1000 30" fill="none" stroke="currentColor" strokeWidth=".8" vectorEffect="non-scaling-stroke" /></svg></div>;
}
