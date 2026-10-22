"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMotion } from "./motion-provider";
import { createReveals } from "@/lib/reveal";
import { SmoothScroll } from "./smooth-scroll";

// Each page owns its content reveals. The shared footer has a separate lifetime,
// so navigating never resets a footer the visitor has already seen.
export function MotionRuntime() {
  const pathname = usePathname();
  const { enabled, ready } = useMotion();
  useLayoutEffect(() => {
    if (!enabled || !ready || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const main = document.getElementById("main-content");
    if (main) return createReveals(main);
  }, [pathname, enabled, ready]);
  useLayoutEffect(() => {
    if (!enabled || !ready || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (footer) return createReveals(footer, true);
  }, [enabled, ready]);
  return <><SmoothScroll /><Cursor /></>;
}

function Cursor() {
  const cursor = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches || !cursor.current) return;
    let cancelled = false;
    let cleanup = () => {};
    void import("gsap").then(({ default: gsap }) => {
    if (cancelled || !cursor.current) return;
    const element = cursor.current;
    document.documentElement.removeAttribute("data-cursor");
    document.documentElement.dataset.cursorMode = "custom";
    const x = gsap.quickTo(element, "x", { duration: .34, ease: "power3.out" });
    const y = gsap.quickTo(element, "y", { duration: .34, ease: "power3.out" });
    let currentCard: HTMLElement | null = null;
    let cardBounds: DOMRect | null = null;
    const move = (event: PointerEvent) => {
      x(event.clientX); y(event.clientY); element.classList.add("visible");
      const card = (event.target as Element).closest<HTMLElement>(".project-card-link");
      if (card) {
        if (card !== currentCard || !cardBounds) { currentCard = card; cardBounds = card.getBoundingClientRect(); }
        const box = cardBounds;
        card.style.setProperty("--rx",`${((event.clientY-box.top)/box.height-.5)*-3}deg`); card.style.setProperty("--ry",`${((event.clientX-box.left)/box.width-.5)*4}deg`);
      }
    };
    const cardOut = (event: PointerEvent) => {
      const card=(event.target as Element).closest<HTMLElement>(".project-card-link");
      if (card && !card.contains(event.relatedTarget as Node)) { card.style.setProperty("--rx","0deg"); card.style.setProperty("--ry","0deg"); currentCard = null; cardBounds = null; }
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-cursor],a,button,summary");
      const label = target?.dataset.cursor || (target ? "↗" : "");
      element.dataset.active = label ? "true" : "false";
      const text = element.querySelector("span"); if (text) text.textContent = label;
    };
    const leave = () => element.classList.remove("visible");
    const invalidate = () => { cardBounds = null; };
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerout", cardOut, { passive: true });
    window.addEventListener("scroll", invalidate, { passive: true });
    window.addEventListener("resize", invalidate);
    cleanup = () => { delete document.documentElement.dataset.cursorMode; document.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); document.removeEventListener("pointerleave", leave); document.removeEventListener("pointerout", cardOut); window.removeEventListener("scroll", invalidate); window.removeEventListener("resize", invalidate); document.querySelectorAll<HTMLElement>(".project-card-link").forEach(card=>{card.style.removeProperty("--rx");card.style.removeProperty("--ry");}); gsap.killTweensOf(element); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches) return;
    let cancelled = false;
    let cleanup = () => {};
    void import("gsap").then(({ default: gsap }) => {
    if (cancelled) return;
    const bounds = new Map<HTMLElement, DOMRect>();
    const move = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-magnetic]");
      if (!target) return;
      let box = bounds.get(target);
      if (!box) { box = target.getBoundingClientRect(); bounds.set(target, box); }
      gsap.to(target, { x: (event.clientX - box.left - box.width / 2) * .12, y: (event.clientY - box.top - box.height / 2) * .18, duration: .4, overwrite: true });
    };
    const out = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-magnetic]");
      if (target && !target.contains(event.relatedTarget as Node)) { bounds.delete(target); gsap.to(target, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.45)", overwrite: true }); }
    };
    document.addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerout", out, { passive: true });
    const invalidate = () => bounds.clear();
    window.addEventListener("scroll", invalidate, { passive: true }); window.addEventListener("resize", invalidate);
    cleanup = () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", out); window.removeEventListener("scroll", invalidate); window.removeEventListener("resize", invalidate); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);
  return <div className="custom-cursor" ref={cursor} aria-hidden="true"><div><span /></div></div>;
}
