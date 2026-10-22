/** One observer and one owner per reveal. No scroll-time DOM splitting. */
type Mask = { words: HTMLSpanElement[]; revert: () => void };
type Part = { node: HTMLElement; mask?: Mask; kind: 'text' | 'block' | 'visual'; delay: number; styles: string[] };
type Reveal = { node: HTMLElement; trigger: HTMLElement; parts: Part[]; prepare: () => Part[]; animations: Animation[]; seen: boolean };
const ease = 'cubic-bezier(.22,1,.36,1)';
const properties = ['translate', 'opacity', 'clip-path', 'will-change', 'transform'];

function maskWords(element: HTMLElement): Mask {
  const oldLabel = element.getAttribute('aria-label');
  const read = (node: Node): string => node.nodeName === 'BR' ? ' ' : node.nodeType === Node.TEXT_NODE ? node.textContent || '' : Array.from(node.childNodes, read).join('');
  const label = read(element).replace(/\s+/g, ' ').trim();
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [], words: HTMLSpanElement[] = [];
  const records: { anchor: Comment; text: Text; nodes: Node[] }[] = [];
  while (walker.nextNode()) if (walker.currentNode.textContent?.trim()) texts.push(walker.currentNode as Text);
  for (const text of texts) {
    const anchor = document.createComment('word-mask');
    const fragment = document.createDocumentFragment();
    const nodes = text.data.split(/(\s+)/).filter(Boolean).map(token => {
      if (/^\s+$/.test(token)) return document.createTextNode(token);
      const mask = document.createElement('span'), word = document.createElement('span');
      mask.className = 'reveal-word-mask'; mask.setAttribute('aria-hidden', 'true');
      word.className = 'reveal-word'; word.textContent = token;
      mask.append(word); words.push(word); return mask;
    });
    nodes.forEach(node => fragment.append(node));
    text.before(anchor, fragment); text.remove(); records.push({ anchor, text, nodes });
  }
  element.setAttribute('aria-label', label);
  return { words, revert() {
    records.forEach(({ anchor, text, nodes }) => { nodes.forEach(node => node.parentNode?.removeChild(node)); anchor.replaceWith(text); });
    if (oldLabel === null) element.removeAttribute('aria-label'); else element.setAttribute('aria-label', oldLabel);
  } };
}

export function createReveals(root: HTMLElement, footer = false) {
  const records = new Map<HTMLElement, Reveal>();
  const targets = new Map<Element, Reveal>();
  let disposed = false;
  let paused = document.documentElement.classList.contains('is-navigating');
  const waiting = new Set<Reveal>();
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const record = targets.get(entry.target);
      if (!record || record.seen) continue;
      if (paused) waiting.add(record); else play(record);
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
  // Reserve hidden, stable boxes immediately, but only split nearby text.
  // This avoids paying for an entire long page during mobile hydration.
  const approach = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const record = targets.get(entry.target);
      if (!record || record.seen) continue;
      approach.unobserve(record.trigger);
      record.parts = record.prepare();
      observer.observe(record.trigger);
    }
  }, { rootMargin: '900px 0px', threshold: 0 });

  function restore(part: Part) {
    properties.forEach((property, index) => {
      const value = part.styles[index];
      if (value) part.node.style.setProperty(property, value); else part.node.style.removeProperty(property);
    });
  }
  function part(node: HTMLElement, delay = 0, visual = false): Part {
    const styles = properties.map(property => node.style.getPropertyValue(property));
    const mask = /^H[1-4]$/.test(node.tagName) && !node.querySelector('a,button,input') ? maskWords(node) : undefined;
    const kind = mask ? 'text' : visual ? 'visual' : 'block';
    if (mask) mask.words.forEach(word => { word.style.transform = 'translateY(120%)'; });
    else {
      node.style.translate = `0 ${visual ? 48 : 24}px`;
      node.style.opacity = '0';
      if (!visual) node.style.clipPath = 'inset(0 0 100% 0)';
    }
    return { node, mask, kind, delay, styles };
  }
  function play(record: Reveal) {
    if (record.seen || disposed || !record.node.isConnected) return;
    record.seen = true; waiting.delete(record); observer.unobserve(record.trigger);
    record.node.dataset.motionSeen = 'true';
    // This marker is also useful when checking for accidental repeated entrances.
    record.node.dataset.motionRuns = String(Number(record.node.dataset.motionRuns || 0) + 1);
    for (const item of record.parts) {
      const targets = item.mask?.words || [item.node];
      for (let index = 0; index < targets.length; index++) {
        const target = targets[index];
        target.style.willChange = item.mask ? 'transform' : 'translate,opacity';
        const frames = item.mask
          ? [{ transform: 'translateY(120%)' }, { transform: 'translateY(0%)' }]
          : item.kind === 'visual'
            ? [{ translate: '0 48px', opacity: 0 }, { translate: '0 0', opacity: item.node.classList.contains('footer-ribbon') ? .36 : 1 }]
            : [{ translate: '0 24px', opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { translate: '0 0', opacity: 1, clipPath: 'inset(0)' }];
        const animation = target.animate(frames, {
          duration: item.mask ? 1250 : item.kind === 'visual' ? 1250 : 1050,
          delay: item.delay + (item.mask ? Math.min(index * 36, 180) : 0), easing: ease, fill: 'both',
        });
        record.animations.push(animation);
        void animation.finished.then(() => {
          if (disposed) return;
          if (item.mask) { target.style.removeProperty('transform'); target.style.removeProperty('will-change'); }
          else restore(item);
          animation.cancel();
        }).catch(() => {});
      }
    }
  }
  function register(node: HTMLElement, prepare: () => Part[], trigger = node) {
    const record = { node, trigger, parts: [], prepare, animations: [], seen: false };
    records.set(node, record); targets.set(trigger, record); node.dataset.motionSeen = 'false'; approach.observe(trigger);
  }
  function scan() {
    if (disposed) return;
    if (footer) {
      const invitation = root.querySelector<HTMLElement>('.footer-invitation');
      if (invitation && !records.has(invitation)) {
        const nodes = ['.footer-ribbon', ':scope > .eyebrow', 'h2', ':scope > .button'];
        register(invitation, () => nodes.flatMap((selector, i) => {
          const node = invitation.querySelector<HTMLElement>(selector);
          return node ? [part(node, [0, 80, 120, 220][i], i === 0)] : [];
        }), invitation.querySelector<HTMLElement>('h2') || invitation);
      }
      for (const selector of ['.footer-socials', '.footer-nav', '.footer-bottom']) {
        const row = root.querySelector<HTMLElement>(selector);
        if (row && !records.has(row)) register(row, () => Array.from(row.children, (node, index) => part(node as HTMLElement, index * 55)));
      }
      return;
    }
    const selector = "h1,h2,h3,h4,p,.eyebrow,summary,.tech-item,.text-link,.button,.case-meta,.contact-socials a,.contact-direct>a,.work-filters,.about-portrait,.intro-object,.review-card,[data-reveal='up'],[data-reveal='card'],.form-field,.inquiry-kinds,[data-hero-detail],.case-back,.hero-meta,.hero-bottom,.curiosity-caption,.project-art,.service-action,.service-art";
    root.querySelectorAll<HTMLElement>(selector).forEach(node => {
      if (records.has(node) || node.closest('[data-no-reveal],.window-bar,.sr-only,[aria-live],.reveal-word-mask')) return;
      if (node.closest('[aria-hidden="true"]') && !node.matches('.project-art,.service-art')) return;
      // A card owns its art, caption and masks. Nested observers used to
      // animate the same content twice with unrelated start times.
      const card = node.closest<HTMLElement>("[data-reveal='card']");
      if (card && card !== node) return;
      if (node.closest('details:not([open]) .faq-answer')) return;
      const parent = node.parentElement?.closest('.case-meta,.form-field,.inquiry-kinds,[data-hero-detail],.hero-meta,.hero-bottom,.curiosity-caption,.review-card,.intro-object,.about-portrait');
      if (parent && parent !== node) return;
      if (node.matches("[data-reveal='up']") && node.querySelector('h1,h2,h3,h4,p')) return;
      if (node.contains(document.activeElement)) { node.dataset.motionSeen = 'true'; return; }
      if (card === node) {
        register(node, () => {
          const heading = node.querySelector<HTMLElement>('h3');
          const copy = node.querySelector<HTMLElement>('.project-caption p,.service-copy p');
          const parts = [part(node, 0, true)];
          const art = node.querySelector<HTMLElement>('.project-window,.service-art');
          if (art) parts.push(part(art, 80, true));
          if (heading) parts.push(part(heading, 130));
          if (copy) parts.push(part(copy, 180));
          return parts;
        });
      } else register(node, () => [part(node, 0, node.matches('.intro-object,.about-portrait,.review-card,.project-art,[data-reveal="up"]'))]);
    });
  }
  function enter() { paused = false; waiting.forEach(play); }
  function leave() { paused = true; }
  function focus(event: FocusEvent) {
    if (!(event.target instanceof Element)) return;
    const target = event.target;
    records.forEach(record => {
      if (!record.node.contains(target)) return;
      approach.unobserve(record.trigger); observer.unobserve(record.trigger); record.seen = true;
      record.node.dataset.motionSeen = 'true';
      record.animations.forEach(animation => animation.cancel());
      record.parts.forEach(item => {
        restore(item); item.mask?.words.forEach(word => { word.style.removeProperty('transform'); word.style.removeProperty('will-change'); });
      });
    });
  }
  scan();
  window.addEventListener('portfolio:content', scan);
  window.addEventListener('portfolio:enter', enter);
  window.addEventListener('portfolio:leave', leave);
  root.addEventListener('toggle', scan, true);
  root.addEventListener('focusin', focus);
  return () => {
    disposed = true; approach.disconnect(); observer.disconnect(); waiting.clear();
    records.forEach(record => {
      record.animations.forEach(animation => animation.cancel());
      record.parts.forEach(item => { restore(item); item.mask?.revert(); });
      delete record.node.dataset.motionSeen; delete record.node.dataset.motionRuns;
    });
    window.removeEventListener('portfolio:content', scan);
    window.removeEventListener('portfolio:enter', enter);
    window.removeEventListener('portfolio:leave', leave);
    root.removeEventListener('toggle', scan, true);
    root.removeEventListener('focusin', focus);
  };
}
