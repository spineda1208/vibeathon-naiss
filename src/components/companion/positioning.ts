export type AbsolutePosition = { top: number; left: number };

function getScrollOffsets(): { x: number; y: number } {
  return {
    x: typeof window !== "undefined" ? window.scrollX : 0,
    y: typeof window !== "undefined" ? window.scrollY : 0,
  };
}

function getClientRect(el: Element): DOMRect {
  return el.getBoundingClientRect();
}

export function anchorTopLeftOf(target: Element, offsetX = 0, offsetY = 0): AbsolutePosition {
  const r = getClientRect(target);
  const { x, y } = getScrollOffsets();
  return { top: r.top + y + offsetY, left: r.left + x + offsetX };
}

export function anchorTopRightOf(target: Element, offsetX = 0, offsetY = 0): AbsolutePosition {
  const r = getClientRect(target);
  const { x, y } = getScrollOffsets();
  return { top: r.top + y + offsetY, left: r.right + x + offsetX };
}

export function positionRightOf(
  target: Element,
  options?: { margin?: number; referenceSizePx?: number },
): AbsolutePosition {
  const r = getClientRect(target);
  const { x, y } = getScrollOffsets();
  const referenceSizePx = Math.max(1, Math.floor(options?.referenceSizePx ?? 28));
  const margin = options?.margin ?? 8;
  const top = r.top + y + Math.max(0, (r.height - referenceSizePx) / 2);
  const left = r.right + x + margin;
  return { top, left };
}

export function positionLeftOf(
  target: Element,
  options?: { margin?: number; referenceSizePx?: number },
): AbsolutePosition {
  const r = getClientRect(target);
  const { x, y } = getScrollOffsets();
  const referenceSizePx = Math.max(1, Math.floor(options?.referenceSizePx ?? 28));
  const margin = options?.margin ?? 8;
  const top = r.top + y + Math.max(0, (r.height - referenceSizePx) / 2);
  const left = r.left + x - referenceSizePx - margin;
  return { top, left };
}
