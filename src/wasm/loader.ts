/**
 * Loads a Go-compiled WASM module and runs it.
 *
 * The Go program registers its callbacks on `globalThis` and then blocks
 * (via `<-make(chan struct{}, 0)` in main). Pass a `readyKey` to await a
 * specific global being set by the Go side — e.g. `globalThis.voronoiReady = true`.
 */

declare global {
  // Defined by wasm_exec.js once it's loaded.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var Go: { new (): GoRuntime };
}

interface GoRuntime {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
}

let wasmExecPromise: Promise<void> | undefined;

/** Inject /wasm_exec.js once. Subsequent calls reuse the same promise. */
function ensureWasmExec(): Promise<void> {
  if (typeof globalThis.Go === 'function') return Promise.resolve();
  if (wasmExecPromise) return wasmExecPromise;
  wasmExecPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/wasm_exec.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('failed to load /wasm_exec.js — run ./build.sh first'));
    document.head.appendChild(script);
  });
  return wasmExecPromise;
}

export interface LoadWasmOptions {
  /**
   * Name of a global the Go program sets when it has finished registering
   * its `js.FuncOf` callbacks. The loader resolves once this becomes truthy.
   * If omitted, resolves as soon as `go.run` is kicked off.
   */
  readyKey?: string;
  /** Polling interval for `readyKey`, in ms. Default 16ms (~one frame). */
  pollMs?: number;
  /** Give up if `readyKey` hasn't appeared after this many ms. Default 5000. */
  timeoutMs?: number;
}

/**
 * Fetches and instantiates the WASM module at `path` (e.g. "/wasm/voronoi.wasm").
 * Resolves once the Go runtime has booted and (optionally) the `readyKey` global is set.
 */
export async function loadWasm(path: string, opts: LoadWasmOptions = {}): Promise<void> {
  await ensureWasmExec();
  const go = new globalThis.Go();
  const result = await WebAssembly.instantiateStreaming(fetch(path), go.importObject);
  // Intentionally not awaited — the Go main blocks until exit.
  void go.run(result.instance);

  if (!opts.readyKey) return;
  const { readyKey, pollMs = 16, timeoutMs = 5000 } = opts;
  const deadline = performance.now() + timeoutMs;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  while (!(globalThis as any)[readyKey]) {
    if (performance.now() > deadline) {
      throw new Error(`wasm at ${path} did not set globalThis.${readyKey} within ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, pollMs));
  }
}
