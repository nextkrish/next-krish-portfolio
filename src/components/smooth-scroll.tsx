"use client";

import { useEffect } from "react";
import { useMotion } from "./motion-provider";

/** Lenis keeps the native document scroll; touch and keyboard remain native. */
export function SmoothScroll() {
  const { enabled, ready } = useMotion();
  useEffect(() => {
    if (!enabled || !ready || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer: fine)').matches) return;
    let disposed = false;
    let cleanup = () => {};
    void import('lenis').then(({ default: Lenis }) => {
      if (disposed) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: .115,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: .9,
        anchors: { duration: 1.05 },
        prevent: node => node.matches('textarea,[data-lenis-prevent],.review-fan,.mobile-nav'),
      });
      const locked = () => document.documentElement.matches('.is-loading,.is-navigating,.menu-open');
      let wasLocked: boolean | undefined;
      const synchronize = () => {
        wasLocked = locked();
        if (wasLocked) lenis.stop();
        else {
          lenis.resize();
          lenis.scrollTo(window.scrollY, { immediate: true, force: true });
          lenis.start();
        }
      };
      const leave = () => lenis.stop();
      const visibility = () => { if (document.hidden) lenis.stop(); else synchronize(); };
      const keyboard = (event: KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) || locked()) return;
        if (event.target instanceof Element && event.target.closest('input,textarea,select,[contenteditable="true"]')) return;
        // Cancel wheel inertia before the browser performs its native key
        // scroll, so a recent wheel gesture cannot pull Home/End back.
        lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      };
      // Lenis also changes classes while scrolling. React only to our lock
      // classes, otherwise each wheel gesture would reset its own inertia.
      const classes = new MutationObserver(() => { if (locked() !== wasLocked) synchronize(); });
      classes.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      window.addEventListener('portfolio:leave', leave);
      window.addEventListener('portfolio:enter', synchronize);
      document.addEventListener('visibilitychange', visibility);
      document.addEventListener('keydown', keyboard, true);
      synchronize();
      cleanup = () => {
        classes.disconnect(); lenis.destroy();
        window.removeEventListener('portfolio:leave', leave);
        window.removeEventListener('portfolio:enter', synchronize);
        document.removeEventListener('visibilitychange', visibility);
        document.removeEventListener('keydown', keyboard, true);
      };
    });
    return () => { disposed = true; cleanup(); };
  }, [enabled, ready]);
  return null;
}
