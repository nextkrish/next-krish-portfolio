"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const MotionContext = createContext({ enabled: true, ready: false, toggle: () => {} });
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [ready, setReady] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderExit, setLoaderExit] = useState(false);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      let preference: string | null = null;
      try { preference = localStorage.getItem("nextkrish-motion"); } catch {}
      setEnabled(!query.matches && preference !== "off");
    };
    update(); query.addEventListener("change", update);
    let cancelled = false, finished = false;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    let readyTimer: ReturnType<typeof setTimeout> | undefined;
    document.documentElement.classList.add("is-loading");
    const content = document.querySelectorAll<HTMLElement>("#page-content,.site-header,.motion-toggle");
    content.forEach(node => { node.inert = true; });
    // A short, full-viewport opening chapter. Assets load behind it; a hard
    // deadline prevents a slow image or font from trapping the visitor.
    const portrait = document.querySelector<HTMLImageElement>(".hero-portrait,.about-portrait img");
    // The server already displayed the loader before hydration. Count that
    // time too, rather than adding another 850ms on a slower mobile device.
    const elapsed = performance.now();
    const essentials = Promise.all([
      document.fonts.ready,
      portrait?.decode().catch(() => {}) || Promise.resolve(),
      new Promise(resolve => setTimeout(resolve, Math.max(0, 850 - elapsed))),
    ]);
    const fallback = setTimeout(finish, Math.max(0, 1600 - elapsed));
    function finish() {
      if (cancelled || finished) return;
      finished = true;
      clearTimeout(fallback);
      setLoaderExit(true);
      // Begin the page's masks as the curtain leaves, not underneath a
      // finished loader. Keep focus and scrolling locked until it clears.
      readyTimer = setTimeout(() => setReady(true), query.matches ? 0 : 160);
      removeTimer = setTimeout(() => {
        setLoaderVisible(false);
        content.forEach(node => { node.inert = false; });
        document.documentElement.classList.remove("is-loading");
        window.dispatchEvent(new Event("portfolio:enter"));
      }, query.matches ? 0 : 560);
    }
    if (query.matches) finish(); else void essentials.then(finish);
    return () => { cancelled = true; clearTimeout(fallback); clearTimeout(removeTimer); clearTimeout(readyTimer); content.forEach(node => { node.inert = false; }); query.removeEventListener("change", update); document.documentElement.classList.remove("is-loading"); };
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = enabled ? "on" : "off"; }, [enabled]);
  function toggle() {
    setEnabled(value => { try { localStorage.setItem("nextkrish-motion", value ? "off" : "on"); } catch {} return !value; });
  }
  const value = useMemo(() => ({ enabled, ready, toggle }), [enabled, ready]);
  return <MotionContext.Provider value={value}>{children}{loaderVisible && <div className={`site-loader ${loaderExit ? "loader-exit" : ""}`} role="status" aria-label="Loading Next Krish"><div className="loader-constellation" aria-hidden="true"><svg viewBox="0 0 240 240"><g className="loader-orbit-one"><rect x="43" y="43" width="154" height="154" rx="35"/><circle cx="43" cy="78" r="4"/></g><g className="loader-orbit-two"><rect x="63" y="63" width="114" height="114" rx="28"/><circle cx="177" cy="121" r="3"/></g><circle className="loader-core" cx="120" cy="120" r="5"/><path className="loader-cross" d="M120 98v44M98 120h44"/></svg></div><div className="loader-brand">Next <em>Krish</em><span className="loader-dot" /></div><div className="loader-track"><span /></div><span className="eyebrow loader-caption">A little something is cooking.</span><div className="loader-meta" aria-hidden="true"><span>Next Krish / Portfolio</span><span>Made with curiosity.</span></div></div>}</MotionContext.Provider>;
}

export function MotionToggle() {
  const { enabled, toggle } = useMotion();
  return <button className="motion-toggle" onClick={toggle} aria-pressed={!enabled} title={enabled ? "Turn motion off" : "Turn motion on"}><span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span> Motion {enabled ? "on" : "off"}</button>;
}
