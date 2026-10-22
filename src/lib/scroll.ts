/** Only hand a wheel gesture to a text field when it can consume it. */
export function textareaConsumesWheel(target: EventTarget | null, deltaY: number): boolean {
  if (!(target instanceof Element) || deltaY === 0) return false;
  const field = target.closest('textarea');
  if (!field) return false;
  const limit = field.scrollHeight - field.clientHeight;
  if (limit <= 1) return false;
  return deltaY > 0 ? field.scrollTop < limit - 1 : field.scrollTop > 1;
}
