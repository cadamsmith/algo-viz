import { findAlgorithm } from '../algorithms';
import { AlgoCanvas } from '../components/AlgoCanvas';
import { Controls } from '../components/Controls';
import { InfoPanel } from '../components/InfoPanel';
import { renderNav } from '../components/Nav';
import { createAnimationLoop } from '../hooks/animationLoop';
import { BubbleSortVisualizer } from '../visualizers/BubbleSortVisualizer';
import { loadBubbleSort } from '../wasm/bubbleSort';

const SLUG = 'bubble_sort';
// Wall-clock ms (at speed=1) between logical steps.
const STEP_INTERVAL_MS = 60;

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
  new InfoPanel(infoHost, meta);

  const bindings = await loadBubbleSort();
  const viz = new BubbleSortVisualizer(bindings);

  canvas.setOnResize(() => viz.draw(canvas.ctx, 0));

  let stepAcc = 0;
  const loop = createAnimationLoop((dt) => {
    stepAcc += dt;
    while (stepAcc >= STEP_INTERVAL_MS) {
      viz.step();
      stepAcc -= STEP_INTERVAL_MS;
    }
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
      viz.randomize();
      loop.tick();
    },
    onSpeedChange: (s) => loop.setSpeed(s),
  });

  loop.tick();
}
