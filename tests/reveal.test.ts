import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
const { JSDOM } = createRequire(import.meta.url)('jsdom');
import { createReveals } from '../src/lib/reveal.ts';

function setup(html: string) {
  const dom = new JSDOM(`<body>${html}</body>`);
  const observers: Observer[] = [];
  class Observer {
    targets = new Set<Element>();
    callback: (entries: { target: Element; isIntersecting: boolean }[]) => void;
    constructor(callback: (entries: { target: Element; isIntersecting: boolean }[]) => void) { this.callback = callback; observers.push(this); }
    observe(node: Element) { this.targets.add(node); }
    unobserve(node: Element) { this.targets.delete(node); }
    disconnect() { this.targets.clear(); }
    show(node: Element) { if (this.targets.has(node)) this.callback([{ target: node, isIntersecting: true }]); }
  }
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, Node: dom.window.Node, NodeFilter: dom.window.NodeFilter, Element: dom.window.Element, IntersectionObserver: Observer });
  const starts: Element[] = [];
  dom.window.HTMLElement.prototype.animate = function (this: HTMLElement) {
    starts.push(this);
    return { finished: Promise.resolve(), cancel() {} } as unknown as Animation;
  };
  const root = dom.window.document.body.firstElementChild as HTMLElement;
  return { root, dom, starts, show(node: Element) { for (let frame = 0; frame < 2; frame++) observers.forEach(observer => [...observer.targets].filter(target => target === node || node.contains(target)).forEach(target => observer.show(target))); } };
}

test('a shared footer reveals once, keeps its accessible heading, and restores its original nodes', async () => {
  const original = '<h2>Have something<br>in <em>mind?</em></h2>';
  const { root, dom, starts, show } = setup(`<footer><div class="footer-invitation"><p class="eyebrow">Hello</p>${original}<a class="button">Talk</a></div><div class="footer-socials"><a>GitHub</a><a>Email</a></div></footer>`);
  const cleanup = createReveals(root, true);
  const invitation = root.querySelector<HTMLElement>('.footer-invitation')!;
  const heading = root.querySelector('h2')!;
  show(invitation);
  assert.equal(heading.getAttribute('aria-label'), 'Have something in mind?');
  await Promise.resolve();
  const count = starts.length;
  show(invitation); dom.window.dispatchEvent(new dom.window.Event('portfolio:content'));
  show(invitation);
  assert.equal(starts.length, count);
  assert.equal(invitation.dataset.motionRuns, '1');
  cleanup();
  assert.equal(root.querySelector('h2')!.outerHTML, original);
  assert.equal(root.querySelectorAll('.reveal-word-mask').length, 0);
  dom.window.close();
});

test('each project card owns one coordinated entrance; newly filtered cards are discovered', () => {
  const { root, dom, starts, show } = setup('<main><article data-reveal="card"><div class="project-art" aria-hidden="true">Art</div><div class="project-caption"><h3>RelayUp</h3><p>Landing page</p></div></article></main>');
  const cleanup = createReveals(root);
  const card = root.querySelector<HTMLElement>('article')!;
  show(card);
  assert.equal(starts.filter(node => node === card).length, 1);
  assert.equal(starts.filter(node => node.classList.contains('project-art')).length, 0);
  assert.equal(card.querySelector('h3')!.dataset.motionSeen, undefined);
  const second = card.cloneNode(true) as HTMLElement;
  // Simulate fresh React-rendered DOM rather than cloning prepared masks.
  second.innerHTML = '<div class="project-caption"><h3>NextDM</h3><p>Landing page</p></div>';
  root.append(second);
  dom.window.dispatchEvent(new dom.window.Event('portfolio:content'));
  show(second);
  assert.equal(starts.filter(node => node === second).length, 1);
  cleanup(); dom.window.close();
});

test('a route curtain delays entrances until the new page is ready', () => {
  const { root, dom, starts, show } = setup('<main><h1>Next Krish</h1></main>');
  dom.window.document.documentElement.classList.add('is-navigating');
  const cleanup = createReveals(root);
  show(root.querySelector('h1')!);
  assert.equal(starts.length, 0);
  dom.window.dispatchEvent(new dom.window.Event('portfolio:enter'));
  assert.equal(starts.length, 2);
  cleanup(); dom.window.close();
});

test('the review fan staggers stable slots once and leaves hover surfaces to CSS', () => {
  const { root, dom, starts, show } = setup('<main><div class="review-fan">' + [1, 2, 3].map(i => `<article class="review-slot" tabindex="0"><div class="review-card"><p>Review ${i}</p><span class="eyebrow">Sample</span></div></article>`).join('') + '</div></main>');
  const timings: number[] = [];
  const animate = dom.window.HTMLElement.prototype.animate;
  dom.window.HTMLElement.prototype.animate = function (this: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
    timings.push(Number(options.delay));
    return animate.call(this, frames, options);
  };
  const cleanup = createReveals(root);
  const fan = root.querySelector<HTMLElement>('.review-fan')!;
  show(fan);
  assert.deepEqual(timings, [0, 140, 280]);
  assert.equal(starts.length, 3);
  assert.ok(starts.every(node => node.classList.contains('review-slot')));
  show(fan); dom.window.dispatchEvent(new dom.window.Event('portfolio:content')); show(fan);
  assert.equal(starts.length, 3);
  assert.equal(fan.dataset.motionRuns, '1');
  cleanup(); dom.window.close();
});
