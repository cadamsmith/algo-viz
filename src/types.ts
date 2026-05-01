/**
 * Implemented by every algorithm visualizer. The animation loop drives
 * `draw` each frame; Controls dispatches user actions to the rest.
 */
export interface Visualizer {
  /** Render the current state. `dt` is wall-clock ms since last draw, already speed-scaled. */
  draw(ctx: CanvasRenderingContext2D, dt: number): void;
  /** Advance one logical step of the algorithm. */
  step(): void;
  /** Restore initial state for the current input. */
  reset(): void;
  /** Generate fresh random input. Optional — omit if the algorithm is deterministic. */
  randomize?(): void;
}

export interface AlgorithmMeta {
  /** URL slug, e.g. "voronoi". Used as the hash route and the wasm filename. */
  slug: string;
  /** Display name, e.g. "Fortune's Algorithm". */
  name: string;
  /** Category label, e.g. "Computational Geometry". */
  category: string;
  /** One-sentence description shown in the InfoPanel. */
  blurb: string;
  /** Big-O strings shown in the InfoPanel. */
  complexity: { time: string; space: string };
  /** False until you ship the page; landing renders these as "coming soon". */
  ready: boolean;
}
