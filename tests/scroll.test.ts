import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { textareaConsumesWheel } from '../src/lib/scroll.ts';

const { JSDOM } = createRequire(import.meta.url)('jsdom');

test('reviews and empty contact fields keep document scrolling; overflowing text fields hand off at their edges', () => {
  const dom = new JSDOM('<div class="review-fan"><article>Review</article></div><textarea></textarea>');
  Object.assign(globalThis, { Element: dom.window.Element });
  const field = dom.window.document.querySelector('textarea')!;
  Object.defineProperties(field, { clientHeight: { value: 100 }, scrollHeight: { value: 100, configurable: true } });
  assert.equal(textareaConsumesWheel(dom.window.document.querySelector('article'), 120), false);
  assert.equal(textareaConsumesWheel(field, 120), false);
  Object.defineProperty(field, 'scrollHeight', { value: 400 });
  assert.equal(textareaConsumesWheel(field, 120), true);
  assert.equal(textareaConsumesWheel(field, -120), false);
  field.scrollTop = 150;
  assert.equal(textareaConsumesWheel(field, -120), true);
  assert.equal(textareaConsumesWheel(field, 120), true);
  field.scrollTop = 300;
  assert.equal(textareaConsumesWheel(field, 120), false);
  assert.equal(textareaConsumesWheel(field, -120), true);
  assert.equal(textareaConsumesWheel(field, 0), false);
  dom.window.close();
});
