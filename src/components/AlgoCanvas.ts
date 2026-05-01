import { observeCanvasResize } from '../hooks/canvasResize';

/**
 * A canvas that fills its parent and stays in sync with devicePixelRatio.
 * Construct one per page; pass `ctx` to your visualizer's draw().
 */
export class AlgoCanvas {
  readonly canvas: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  /** Current logical (CSS-pixel) size. */
  width = 0;
  height = 0;
  private teardown: () => void;
  private onResize?: (width: number, height: number) => void;

  constructor(container: HTMLElement) {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'block w-full h-full';
    container.appendChild(this.canvas);
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('failed to acquire 2d context');
    this.ctx = ctx;
    this.teardown = observeCanvasResize(this.canvas, (w, h) => {
      this.width = w;
      this.height = h;
      this.onResize?.(w, h);
    });
  }

  /** Subscribe to resizes (after the initial sizing). */
  setOnResize(cb: (width: number, height: number) => void): void {
    this.onResize = cb;
  }

  destroy(): void {
    this.teardown();
    this.canvas.remove();
  }
}
