export interface ControlsCallbacks {
  onPlayToggle?: (playing: boolean) => void;
  onStep?: () => void;
  onReset?: () => void;
  onRandomize?: () => void;
  onSpeedChange?: (speed: number) => void;
}

export interface ControlsOptions extends ControlsCallbacks {
  showRandomize?: boolean;
  initialSpeed?: number;
}

const BTN =
  'px-3 py-1.5 rounded border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 ' +
  'active:bg-zinc-700 text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed';

/**
 * Renders Play/Pause, Step, Reset, optional Randomize, and a speed slider.
 * The owning page is responsible for keeping internal play state in sync via setPlaying().
 */
export class Controls {
  private root: HTMLElement;
  private playBtn: HTMLButtonElement;
  private stepBtn: HTMLButtonElement;
  private playing = false;

  constructor(container: HTMLElement, opts: ControlsOptions) {
    const initialSpeed = opts.initialSpeed ?? 1;
    this.root = document.createElement('div');
    this.root.className =
      'flex flex-wrap items-center gap-3 p-3 border-t border-zinc-800 bg-zinc-950';
    this.root.innerHTML = `
      <button data-act="play" class="${BTN} min-w-[5rem]">Play</button>
      <button data-act="step" class="${BTN}">Step</button>
      <button data-act="reset" class="${BTN}">Reset</button>
      ${opts.showRandomize ? `<button data-act="random" class="${BTN}">Randomize</button>` : ''}
      <label class="flex items-center gap-2 text-xs text-zinc-400 ml-auto">
        Speed
        <input data-act="speed" type="range" min="0.1" max="4" step="0.1"
          value="${initialSpeed}" class="w-32 accent-zinc-300" />
        <span data-role="speed-val" class="w-10 tabular-nums text-zinc-300">${initialSpeed.toFixed(1)}×</span>
      </label>
    `;
    container.appendChild(this.root);

    this.playBtn = this.root.querySelector<HTMLButtonElement>('[data-act="play"]')!;
    this.stepBtn = this.root.querySelector<HTMLButtonElement>('[data-act="step"]')!;
    const resetBtn = this.root.querySelector<HTMLButtonElement>('[data-act="reset"]')!;
    const randomBtn = this.root.querySelector<HTMLButtonElement>('[data-act="random"]');
    const speedInput = this.root.querySelector<HTMLInputElement>('[data-act="speed"]')!;
    const speedVal = this.root.querySelector<HTMLSpanElement>('[data-role="speed-val"]')!;

    this.playBtn.addEventListener('click', () => {
      this.setPlaying(!this.playing);
      opts.onPlayToggle?.(this.playing);
    });
    this.stepBtn.addEventListener('click', () => opts.onStep?.());
    resetBtn.addEventListener('click', () => opts.onReset?.());
    randomBtn?.addEventListener('click', () => opts.onRandomize?.());
    speedInput.addEventListener('input', () => {
      const v = parseFloat(speedInput.value);
      speedVal.textContent = `${v.toFixed(1)}×`;
      opts.onSpeedChange?.(v);
    });
  }

  /** Sync play state from outside (e.g. when the loop auto-stops at end). */
  setPlaying(playing: boolean): void {
    this.playing = playing;
    this.playBtn.textContent = playing ? 'Pause' : 'Play';
    this.stepBtn.disabled = playing;
  }

  destroy(): void {
    this.root.remove();
  }
}
