import { loadWasm } from './loader';

export interface BubbleSortState {
  values: number[];
  i: number;
  j: number;
  done: boolean;
}

export interface BubbleSortBindings {
  bubbleSortInit(n: number): BubbleSortState;
  bubbleSortStep(): BubbleSortState;
  bubbleSortReset(): BubbleSortState;
  bubbleSortState(): BubbleSortState;
}

type GlobalWithBindings = typeof globalThis & BubbleSortBindings;

let cached: BubbleSortBindings | undefined;

/**
 * Loads bubble_sort.wasm (once) and returns wrappers around the global functions
 * the Go side registers. Subsequent calls reuse the same instance.
 */
export async function loadBubbleSort(): Promise<BubbleSortBindings> {
  if (cached) return cached;
  await loadWasm('/wasm/bubble_sort.wasm', { readyKey: 'bubbleSortReady' });
  const g = globalThis as GlobalWithBindings;
  cached = {
    bubbleSortInit: (n) => g.bubbleSortInit(n),
    bubbleSortStep: () => g.bubbleSortStep(),
    bubbleSortReset: () => g.bubbleSortReset(),
    bubbleSortState: () => g.bubbleSortState(),
  };
  return cached;
}
