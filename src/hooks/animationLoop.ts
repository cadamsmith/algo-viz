export interface AnimationLoop {
  start(): void;
  stop(): void;
  toggle(): boolean;
  isPlaying(): boolean;
  setSpeed(speed: number): void;
  /** Render exactly one frame regardless of play state. */
  tick(): void;
}

/**
 * Wraps requestAnimationFrame with play/pause and a speed multiplier.
 * `onFrame` receives the wall-clock dt in ms scaled by the current speed.
 */
export function createAnimationLoop(onFrame: (dt: number) => void): AnimationLoop {
  let raf = 0;
  let last = 0;
  let speed = 1;
  let playing = false;

  function frame(now: number): void {
    const dt = (now - last) * speed;
    last = now;
    onFrame(dt);
    if (playing) raf = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (playing) return;
      playing = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      if (!playing) return;
      playing = false;
      cancelAnimationFrame(raf);
    },
    toggle() {
      if (playing) this.stop();
      else this.start();
      return playing;
    },
    isPlaying: () => playing,
    setSpeed: (s: number) => {
      speed = s;
    },
    tick() {
      onFrame(0);
    },
  };
}
