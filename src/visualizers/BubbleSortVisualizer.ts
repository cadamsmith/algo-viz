import type { Visualizer } from '../types';
import type { BubbleSortBindings, BubbleSortState } from '../wasm/bubbleSort';

const COLORS = {
  bg: '#18181b',
  bar: '#71717a',
  active: '#f59e0b',
  settled: '#10b981',
  text: '#a1a1aa',
};

export class BubbleSortVisualizer implements Visualizer {
  private state: BubbleSortState;

  constructor(
    private readonly bindings: BubbleSortBindings,
    private readonly size: number = 32,
  ) {
    this.state = bindings.bubbleSortInit(size);
  }

  step(): void {
    if (!this.state.done) {
      this.state = this.bindings.bubbleSortStep();
    }
  }

  reset(): void {
    this.state = this.bindings.bubbleSortReset();
  }

  randomize(): void {
    this.state = this.bindings.bubbleSortInit(this.size);
  }

  draw(ctx: CanvasRenderingContext2D, _dt: number): void {
    const dpr = window.devicePixelRatio || 1;
    const w = ctx.canvas.width / dpr;
    const h = ctx.canvas.height / dpr;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, w, h);

    const { values, i, j, done } = this.state;
    const n = values.length;
    if (n === 0) return;

    const pad = 16;
    const max = Math.max(...values, 1);
    const barW = (w - 2 * pad) / n;
    const maxH = h - 2 * pad - 16;
    const settledFrom = n - i;

    for (let k = 0; k < n; k++) {
      const v = values[k];
      if (v === undefined) continue;
      const bh = (v / max) * maxH;
      const x = pad + k * barW;
      const y = h - pad - bh;

      let color = COLORS.bar;
      if (k >= settledFrom) color = COLORS.settled;
      if (!done && (k === j || k === j + 1)) color = COLORS.active;

      ctx.fillStyle = color;
      ctx.fillRect(x, y, Math.max(1, barW - 2), bh);
    }

    ctx.fillStyle = COLORS.text;
    ctx.font = '11px ui-monospace, monospace';
    ctx.fillText(
      done ? 'sorted' : `pass ${i + 1} · comparing [${j}, ${j + 1}]`,
      pad,
      pad + 4,
    );
  }
}
