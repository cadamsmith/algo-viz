/**
 * TEMPLATE: copy this file to e.g. src/pages/voronoi.ts when adding an algorithm.
 *
 * Each page wires together:
 *   - the shared Nav + InfoPanel + AlgoCanvas + Controls
 *   - an animation loop
 *   - a Visualizer instance (your algorithm-specific code in src/visualizers/)
 *   - WASM via loadWasm()
 *
 * Then register render() in src/main.ts under the matching slug, and flip
 * `ready: true` for that algorithm in src/algorithms.ts.
 */

import { findAlgorithm } from '../algorithms';
import { AlgoCanvas } from '../components/AlgoCanvas';
import { Controls } from '../components/Controls';
import { InfoPanel } from '../components/InfoPanel';
import { renderNav } from '../components/Nav';
import { createAnimationLoop } from '../hooks/animationLoop';
// import { loadWasm } from '../wasm/loader';
// import { TemplateVisualizer } from '../visualizers/TemplateVisualizer';

const SLUG = '_template';

export async function render(root: HTMLElement): Promise<void> {
  const meta = findAlgorithm(SLUG);
  if (!meta) throw new Error(`unknown algorithm: ${SLUG}`);

  root.innerHTML = `
    ${renderNav(SLUG)}
    <div class="flex flex-1 min-h-0">
      <div data-role="canvas-host" class="flex-1 flex flex-col min-w-0">
        <div data-role="canvas-wrap" class="flex-1 min-h-0 bg-zinc-900"></div>
      </div>
      <div data-role="info-host"></div>
    </div>
  `;
  root.classList.add('flex', 'flex-col', 'h-full');

  const canvasWrap = root.querySelector<HTMLElement>('[data-role="canvas-wrap"]')!;
  const canvasHost = root.querySelector<HTMLElement>('[data-role="canvas-host"]')!;
  const infoHost = root.querySelector<HTMLElement>('[data-role="info-host"]')!;

  const canvas = new AlgoCanvas(canvasWrap);
  const info = new InfoPanel(infoHost, meta);
  void info;

  // 1. Load WASM (uncomment once you have a wasm package built):
  // await loadWasm(`/wasm/${SLUG}.wasm`, { readyKey: '__templateReady' });

  // 2. Construct your visualizer. It should implement the Visualizer interface
  //    from src/types.ts and call into the JS bindings exposed by your wasm.
  // const viz = new TemplateVisualizer(canvas.width, canvas.height);

  // Stub so this template compiles before you add a real visualizer.
  const viz: import('../types').Visualizer = {
    draw: (ctx, _dt) => {
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '14px ui-monospace, monospace';
      ctx.fillText('replace me with a real visualizer', 16, 28);
    },
    step: () => {},
    reset: () => {},
    randomize: () => {},
  };

  canvas.setOnResize(() => viz.draw(canvas.ctx, 0));

  const loop = createAnimationLoop((dt) => {
    // For algorithms that step at a fixed rate, accumulate dt here and call viz.step().
    viz.draw(canvas.ctx, dt);
  });

  new Controls(canvasHost, {
    showRandomize: true,
    onPlayToggle: (playing) => (playing ? loop.start() : loop.stop()),
    onStep: () => {
      viz.step();
      loop.tick();
    },
    onReset: () => {
      viz.reset();
      loop.tick();
    },
    onRandomize: () => {
      viz.randomize?.();
      loop.tick();
    },
    onSpeedChange: (s) => loop.setSpeed(s),
  });

  // Initial render.
  loop.tick();
}
