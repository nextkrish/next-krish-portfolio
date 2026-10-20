"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const MotionContext = createContext({ enabled: true, ready: false, toggle: () => {} });
export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  // Effects own their visibility/idle scheduling; readiness no longer rerenders
  // every motion consumer after the first page paint.
  const ready = true;
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
    // The corner indicator is non-blocking; the page remains scrollable.
    const portrait = document.querySelector<HTMLImageElement>(".hero-portrait,.about-portrait img");
    const essentials = Promise.all([
      document.fonts.ready,
      portrait?.decode().catch(() => {}) || Promise.resolve(),
    ]);
    const fallback = setTimeout(finish, 1200);
    function finish() {
      if (cancelled || finished) return;
      finished = true;
      clearTimeout(fallback);
      document.documentElement.classList.remove("is-loading");
      setLoaderExit(true);
      removeTimer = setTimeout(() => setLoaderVisible(false), 380);
    }
    if (query.matches) finish(); else void essentials.then(finish);
    return () => { cancelled = true; clearTimeout(fallback); clearTimeout(removeTimer); query.removeEventListener("change", update); document.documentElement.classList.remove("is-loading"); };
  }, []);
  useEffect(() => { document.documentElement.dataset.motion = enabled ? "on" : "off"; }, [enabled]);
  function toggle() {
    setEnabled(value => { try { localStorage.setItem("nextkrish-motion", value ? "off" : "on"); } catch {} return !value; });
  }
  const value = useMemo(() => ({ enabled, ready, toggle }), [enabled, ready]);
  return <MotionContext.Provider value={value}>{children}{loaderVisible && <div className={`site-loader ${loaderExit ? "loader-exit" : ""}`} role="status" aria-label="Loading Next Krish"><div className="loader-constellation" aria-hidden="true"><svg viewBox="0 0 240 240"><g className="loader-orbit-one"><rect x="43" y="43" width="154" height="154" rx="35"/><circle cx="43" cy="78" r="4"/></g><g className="loader-orbit-two"><rect x="63" y="63" width="114" height="114" rx="28"/><circle cx="177" cy="121" r="3"/></g><circle className="loader-core" cx="120" cy="120" r="5"/><path className="loader-cross" d="M120 98v44M98 120h44"/></svg></div><div className="loader-brand">Next <em>Krish</em><span className="loader-dot" /></div><div className="loader-track"><span /></div><span className="eyebrow loader-caption">A little something is cooking.</span></div>}</MotionContext.Provider>;
}

export function MotionToggle() {
  const { enabled, toggle } = useMotion();
  return <button className="motion-toggle" onClick={toggle} aria-pressed={!enabled} title={enabled ? "Turn motion off" : "Turn motion on"}><span aria-hidden="true">{enabled ? "Ⅱ" : "▷"}</span> Motion {enabled ? "on" : "off"}</button>;
}
