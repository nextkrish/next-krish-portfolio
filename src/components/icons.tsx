import type { SVGProps } from "react";

export function Arrow({ direction = "up", ...props }: SVGProps<SVGSVGElement> & { direction?: "up" | "down" | "right" }) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props} style={{ transform: direction === "down" ? "rotate(135deg)" : direction === "right" ? "rotate(45deg)" : undefined, ...props.style }}><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Plus(props: SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}><path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.4" /></svg>;
}
