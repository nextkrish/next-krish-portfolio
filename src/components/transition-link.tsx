"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode, type ComponentProps } from "react";
import { useMotion } from "./motion-provider";

const NavigationContext = createContext<(href: string) => void>(() => {});

export function TransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { enabled } = useMotion();
  const curtain = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const animation = useRef<Animation | null>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const target = useRef("");
  const historyNavigation = useRef(false);
  const entered = useRef(false);

  const announceEnter = useCallback(() => {
    if (entered.current) return;
    entered.current = true;
    window.dispatchEvent(new Event("portfolio:enter"));
  }, []);

  const reset = useCallback(() => {
    pending.current = false;
    document.documentElement.classList.remove("is-navigating");
    document.getElementById("page-content")?.style.removeProperty("transform");
    animation.current?.cancel(); animation.current = null;
    if (curtain.current) Object.assign(curtain.current.style, { transform: "scaleY(0)", opacity: "1", pointerEvents: "none" });
    if (timeout.current) clearTimeout(timeout.current);
    announceEnter();
  }, [announceEnter]);

  const navigate = useCallback((href: string) => {
    if (pending.current) return;
    if (!enabled || matchMedia("(prefers-reduced-motion: reduce)").matches) { router.push(href); return; }
    pending.current = true;
    entered.current = false;
    historyNavigation.current = false;
    target.current = href;
    router.prefetch(href);
    document.documentElement.classList.add("is-navigating");
    window.dispatchEvent(new Event("portfolio:leave"));
    timeout.current = setTimeout(reset, 6000);
    const node = curtain.current;
    if (!node) { router.push(href); reset(); return; }
    Object.assign(node.style, { opacity: "1", transform: "scaleY(0)", transformOrigin: "50% 100%", pointerEvents: "auto" });
    const cover = node.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 300, easing: "cubic-bezier(.76,0,.24,1)", fill: "both" });
    animation.current = cover;
    void cover.finished.then(() => { node.style.transform = "scaleY(1)"; cover.cancel(); animation.current = null; router.push(href, { scroll: false }); }).catch(() => {});
  }, [enabled, router, reset]);

  useEffect(() => {
    if (!pending.current) return;
    let cancelled = false;
    if (timeout.current) clearTimeout(timeout.current);
    if (!historyNavigation.current) window.scrollTo({ top: 0, behavior: "instant" });
    document.getElementById("page-content")?.style.removeProperty("transform");
    // The destination is mounted now. Fonts are shared between routes, so
    // there is no second asset wait or white-screen hold on every click.
    const frame = requestAnimationFrame(() => {
      if (cancelled) return;
      const node = curtain.current;
      if (!node) { reset(); return; }
      document.documentElement.classList.remove("is-navigating");
      announceEnter();
      const uncover = node.animate([{ transform: "translateY(0)" }, { transform: "translateY(-101%)" }], { duration: 420, easing: "cubic-bezier(.76,0,.24,1)", fill: "both" });
      animation.current = uncover;
      void uncover.finished.then(() => {
        if (cancelled) return;
        reset();
        const hash = target.current.split("#")[1];
        if (hash) document.getElementById(hash)?.scrollIntoView();
        document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
      }).catch(() => {});
    });
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [pathname]);

  useEffect(() => {
    const popstate = () => {
      if (!enabled || location.pathname === pathname || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      pending.current = true; entered.current = false; historyNavigation.current = true; target.current = location.pathname + location.hash;
      document.documentElement.classList.add("is-navigating");
      window.dispatchEvent(new Event("portfolio:leave"));
      animation.current?.cancel();
      if (curtain.current) Object.assign(curtain.current.style, { opacity: "1", transform: "scaleY(1)", pointerEvents: "auto" });
      timeout.current = setTimeout(reset, 6000);
    };
    window.addEventListener("popstate", popstate);
    return () => window.removeEventListener("popstate", popstate);
  }, [enabled, pathname]);

  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); animation.current?.cancel(); }, []);

  return <NavigationContext.Provider value={navigate}>{children}<div className="route-curtain" ref={curtain} aria-hidden="true" /></NavigationContext.Provider>;
}

export function TransitionLink({ href, onClick, onPointerEnter, onFocus, children, ...props }: ComponentProps<"a"> & { href: string }) {
  const navigate = useContext(NavigationContext);
  const pathname = usePathname();
  const router = useRouter();
  const value = href;
  const warm = () => { if (value.startsWith("/") && value.split(/[?#]/)[0] !== pathname && !props.download && props.target !== "_blank") router.prefetch(value); };
  if (value === pathname && !props.download && props.target !== "_blank") return <a href="#top" {...props} onClick={onClick}>{children}</a>;
  return <a href={href} {...props} onPointerEnter={event => { onPointerEnter?.(event); warm(); }} onFocus={event => { onFocus?.(event); warm(); }} onClick={event => {
    onClick?.(event);
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || props.target === "_blank" || props.download) return;
    if (!value.startsWith("/") || value.split(/[?#]/)[0] === pathname) return;
    event.preventDefault(); navigate(value);
  }}>{children}</a>;
}
