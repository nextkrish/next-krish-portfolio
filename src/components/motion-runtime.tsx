"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useMotion } from "./motion-provider";

type HeadingMask = { words: HTMLSpanElement[]; revert: () => void };

// Word masks need no line measurement. Preserve the original nodes so React's
// tree, emphasis, punctuation and spacing can be restored exactly on cleanup.
function maskHeading(element: HTMLElement): HeadingMask {
  const oldLabel = element.getAttribute("aria-label");
  const read = (node: Node): string => node.nodeName === "BR" ? " " : node.nodeType === Node.TEXT_NODE ? node.textContent || "" : Array.from(node.childNodes, read).join("");
  const label = read(element).replace(/\s+/g, " ").trim();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) texts.push(walker.currentNode as Text);
  const records: { anchor: Comment; text: Text; nodes: Node[] }[] = [];
  const words: HTMLSpanElement[] = [];
  texts.forEach(text => {
    const anchor = document.createComment("word-mask");
    const fragment = document.createDocumentFragment();
    const nodes = text.data.split(/(\s+)/).filter(Boolean).map(token => {
      if (/^\s+$/.test(token)) return document.createTextNode(token);
      const mask = document.createElement("span"), word = document.createElement("span");
      mask.className = "reveal-word-mask"; mask.setAttribute("aria-hidden", "true");
      word.className = "reveal-word"; word.textContent = token; mask.append(word); words.push(word);
      return mask;
    });
    nodes.forEach(node => fragment.append(node));
    text.before(anchor, fragment); text.remove(); records.push({ anchor, text, nodes });
  });
  element.setAttribute("aria-label", label);
  return { words, revert() {
    records.forEach(({ anchor, text, nodes }) => { nodes.forEach(node => node.parentNode?.removeChild(node)); anchor.replaceWith(text); });
    if (oldLabel === null) element.removeAttribute("aria-label"); else element.setAttribute("aria-label", oldLabel);
  } };
}

// Prepare word masks once. Scrolling only starts existing transforms; it never
// splits text, measures line wrapping, or refreshes a page-wide scroll engine.
export function MotionRuntime() {
  const pathname = usePathname();
  const { enabled, ready } = useMotion();
  useLayoutEffect(() => {
    if (!enabled || !ready || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let disposed = false;
    const prepared = new Map<HTMLElement, HeadingMask | null>();
    const registered = new Set<HTMLElement>();
    const animations = new Map<HTMLElement, Animation[]>();
    const clear = (element: HTMLElement) => ["transform", "opacity", "clip-path", "will-change"].forEach(property => element.style.removeProperty(property));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target as HTMLElement;
        observer.unobserve(element);
        element.dataset.motionSeen = "true";
        const split = prepared.get(element);
        const heading = /^H[123]$/.test(element.tagName);
        const delay = element.dataset.motionEntry === "true" ? .18 : 0;
        element.dataset.revealDelay = String(delay);
        const list = split?.words || [element];
        animations.set(element, list.map((target, index) => {
          const frames = split
            ? [{ transform: "translateY(110%)" }, { transform: "translateY(0%)" }]
            : [{ transform: "translateY(16px)", opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }, { transform: "translateY(0)", opacity: 1, clipPath: "inset(0%)" }];
          const animation = target.animate(frames, { duration: heading ? 1020 : 880, delay: delay * 1000 + (split && list.length > 1 ? index / (list.length - 1) * 120 : 0), easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });
          void animation.finished.then(() => { clear(target); animation.cancel(); }).catch(() => {});
          return animation;
        }));
      });
    }, { rootMargin: "0px 0px -3% 0px", threshold: 0 });

    function prepare(element: HTMLElement, entry: boolean) {
      if (disposed || prepared.has(element) || !element.isConnected) return;
      if (element.contains(document.activeElement)) { prepared.set(element, null); element.dataset.motionSeen = "true"; return; }
      element.dataset.motionSeen = "false";
      element.dataset.motionEntry = String(entry);
      const heading = /^H[123]$/.test(element.tagName);
      let split: HeadingMask | null = null;
      if (heading && !element.querySelector("a,button,input")) {
        split = maskHeading(element);
        split.words.forEach(word => { word.style.transform = "translateY(110%)"; });
      } else {
        element.style.transform = "translateY(16px)"; element.style.opacity = "0"; element.style.clipPath = "inset(0% 0% 100% 0%)";
      }
      prepared.set(element, split);
      observer.observe(element);
    }
    // Prepare the next screen ahead of the visitor. Distant headings do not
    // create hundreds of masked spans during the initial loading task.
    const entryCandidates = new WeakSet<Element>();
    const approach = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        approach.unobserve(entry.target);
        const box = entry.boundingClientRect;
        if (!box.width || !box.height) return;
        prepare(entry.target as HTMLElement, entryCandidates.has(entry.target) && box.top < innerHeight);
      });
    }, { rootMargin: "400px 0px", threshold: 0 });

    function scan(initial = false) {
      if (disposed) return;
      const selector = "main h1,main h2,main h3,main p,main .eyebrow,main summary,main .tech-item,main .text-link,main .button,main .case-meta,main .contact-socials a,main .contact-direct>a,main .work-filters,main .about-portrait,main .intro-object,main .review-card,[data-reveal='up'],main .form-field,main .inquiry-kinds,.site-footer h2,.site-footer p,.site-footer .button,.footer-socials a,.footer-nav a,.footer-lockup,.footer-bottom>span,[data-hero-detail],.service-action,.service-art,.project-art";
      document.querySelectorAll<HTMLElement>(selector).forEach(element => {
        if (registered.has(element) || element.closest("[data-no-reveal],.window-bar,.sr-only,[aria-live],.reveal-word-mask")) return;
        if (element.closest(".project-art") && !element.matches(".project-art")) return;
        if (element.closest("details:not([open]) .faq-answer") || element.parentElement?.closest("[data-hero-detail],.case-meta,.form-field,.inquiry-kinds")) return;
        if (!(element.textContent?.trim() || element.matches(".service-art,.project-art,.about-portrait,.intro-object"))) return;
        if (element.matches("[data-reveal='up']") && element.querySelector("h1,h2,h3,p")) return;
        registered.add(element);
        if (initial) entryCandidates.add(element);
        approach.observe(element);
      });
    }

    let prepareFrame = 0, paintFrame = 0;
    void document.fonts.ready.then(() => {
      if (disposed) return;
      paintFrame = requestAnimationFrame(() => { prepareFrame = requestAnimationFrame(() => scan(true)); });
    });
    const refresh = () => scan();
    const focus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const focused = event.target;
      prepared.forEach((split, element) => {
        if (!element.contains(focused)) return;
        observer.unobserve(element); animations.get(element)?.forEach(animation => animation.cancel());
        element.dataset.motionSeen = "true";
        (split?.words || [element]).forEach(clear);
      });
    };
    window.addEventListener("portfolio:content", refresh);
    document.addEventListener("toggle", refresh, true);
    document.addEventListener("focusin", focus);
    return () => {
      disposed = true; cancelAnimationFrame(prepareFrame); cancelAnimationFrame(paintFrame); approach.disconnect(); observer.disconnect(); animations.forEach(list => list.forEach(animation => animation.cancel()));
      prepared.forEach((split, element) => {
        split?.revert(); delete element.dataset.motionSeen; delete element.dataset.motionEntry;
        ["transform","opacity","clip-path","will-change"].forEach(property => element.style.removeProperty(property));
      });
      window.removeEventListener("portfolio:content", refresh);
      document.removeEventListener("toggle", refresh, true);
      document.removeEventListener("focusin", focus);
    };
  }, [pathname, enabled, ready]);
  return <Cursor />;
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
    const move = (event: PointerEvent) => {
      x(event.clientX); y(event.clientY); element.classList.add("visible");
      const card = (event.target as Element).closest<HTMLElement>(".project-card-link");
      if (card) { const box=card.getBoundingClientRect(); card.style.setProperty("--rx",`${((event.clientY-box.top)/box.height-.5)*-3}deg`); card.style.setProperty("--ry",`${((event.clientX-box.left)/box.width-.5)*4}deg`); }
    };
    const cardOut = (event: PointerEvent) => {
      const card=(event.target as Element).closest<HTMLElement>(".project-card-link");
      if (card && !card.contains(event.relatedTarget as Node)) { card.style.setProperty("--rx","0deg"); card.style.setProperty("--ry","0deg"); }
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-cursor],a,button,summary");
      const label = target?.dataset.cursor || (target ? "↗" : "");
      element.dataset.active = label ? "true" : "false";
      const text = element.querySelector("span"); if (text) text.textContent = label;
    };
    const leave = () => element.classList.remove("visible");
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerout", cardOut, { passive: true });
    cleanup = () => { delete document.documentElement.dataset.cursorMode; document.removeEventListener("pointermove", move); document.removeEventListener("pointerover", over); document.removeEventListener("pointerleave", leave); document.removeEventListener("pointerout", cardOut); document.querySelectorAll<HTMLElement>(".project-card-link").forEach(card=>{card.style.removeProperty("--rx");card.style.removeProperty("--ry");}); gsap.killTweensOf(element); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);
  useEffect(() => {
    if (!enabled || !matchMedia("(pointer: fine)").matches) return;
    let cancelled = false;
    let cleanup = () => {};
    void import("gsap").then(({ default: gsap }) => {
    if (cancelled) return;
    const move = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-magnetic]");
      if (!target) return;
      const bounds = target.getBoundingClientRect();
      gsap.to(target, { x: (event.clientX - bounds.left - bounds.width / 2) * .12, y: (event.clientY - bounds.top - bounds.height / 2) * .18, duration: .4, overwrite: true });
    };
    const out = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>("[data-magnetic]");
      if (target && !target.contains(event.relatedTarget as Node)) gsap.to(target, { x: 0, y: 0, duration: .7, ease: "elastic.out(1,.45)", overwrite: true });
    };
    document.addEventListener("pointermove", move, { passive: true }); document.addEventListener("pointerout", out, { passive: true });
    cleanup = () => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerout", out); };
    });
    return () => { cancelled = true; cleanup(); };
  }, [enabled]);
  return <div className="custom-cursor" ref={cursor} aria-hidden="true"><div><span /></div></div>;
}
