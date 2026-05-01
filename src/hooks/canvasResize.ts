/**
 * Observes a canvas's parent and keeps the canvas's pixel buffer in sync
 * with its CSS size, accounting for devicePixelRatio. Calls `onResize` with
 * the new logical (CSS-pixel) width and height after each resize.
 *
 * Returns a teardown function.
 */
export function observeCanvasResize(
  canvas: HTMLCanvasElement,
  onResize: (width: number, height: number) => void,
): () => void {
  const apply = (cssWidth: number, cssHeight: number): void => {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    const ctx = canvas.getContext('2d');
    // Reset transform so subsequent draws are in CSS-pixel coordinates.
    ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize(cssWidth, cssHeight);
  };

  const observer = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (!entry) return;
    const { width, height } = entry.contentRect;
    apply(width, height);
  });

  const parent = canvas.parentElement;
  if (parent) observer.observe(parent);
  // Prime once with current size.
  const rect = (parent ?? canvas).getBoundingClientRect();
  apply(rect.width, rect.height);

  return () => observer.disconnect();
}
