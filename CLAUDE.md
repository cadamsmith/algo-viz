# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo state

Currently scaffold-only: the README describes the intended structure and architecture, but no Go, TypeScript, or build files exist yet. New work generally means creating these files for the first time per the conventions below. See `README.md` for the full directory layout, algorithm list, and stack rationale.

## Commands

```bash
./build.sh              # compile all Go packages to WASM, copy to public/wasm/
npm run dev             # Vite dev server (run ./build.sh first)
npm run build           # production build
cd go && go test ./...  # run all Go tests
cd go && go test ./algorithms/voronoi/...   # single package
cd go && go test -run TestFortune ./...     # single test by name
```

WASM binaries are built per-algorithm: `GOOS=js GOARCH=wasm go build -o public/wasm/<name>.wasm ./go/wasm/<name>/`. The Go runtime shim is copied once with `cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" public/`.

## Architecture — the three layers

The codebase is intentionally split into three layers with strict boundaries. Violating these is the most common way work goes wrong here:

1. **`go/algorithms/<name>/`** — pure algorithm logic. **No `syscall/js`, no globals, no I/O.** Functions take input, return output. This is what `go test` exercises and what makes the logic portable outside the browser.
2. **`go/wasm/<name>/main.go`** — thin `syscall/js` wrappers. Imports from `go/algorithms/`, marshals JS↔Go values, exposes callable functions. **No algorithm logic lives here** — if you find yourself writing algorithmic code in a wasm entry point, move it to `go/algorithms/`.
3. **`src/`** — TypeScript shell. Loads WASM (`src/wasm/loader.ts`), wires the canvas, manages UI state. **Never reimplements algorithm logic in TS.** If logic is creeping into TypeScript, it belongs in Go.

Within `src/`, visualizers (`src/visualizers/`) own drawing only — they receive a `CanvasRenderingContext2D` and state from WASM and render. Animation timing belongs to `src/hooks/animationLoop.ts`, not the visualizer.

Each algorithm follows the same fan-out: one package under `go/algorithms/`, one wasm entry point under `go/wasm/`, one loader under `src/wasm/`, one visualizer under `src/visualizers/`, one page under `src/pages/`.

## Shared visualizer contract

Every visualizer must support: Play/Pause, Step (advance one logical step while paused), Speed slider, Reset, and Randomize (where applicable). These are wired through shared components in `src/components/` (`Controls.ts`, `AlgoCanvas.ts`, etc.) — reuse them rather than re-implementing per page.

## Code style

**Go**: `gofmt` enforced. Every exported function gets a doc comment. Each algorithm package needs a package-level comment with a one-line description plus time and space complexity. No `interface{}` / `any` in algorithm logic — concrete types only.

**TypeScript**: strict mode, no `any`, avoid type assertions. Keep the shell lean.

## Testing

All `go/algorithms/<name>/` packages require `_test.go` covering correctness on known inputs and edge cases (empty input, single point, degenerate cases). WASM entry points and TS shell code are not unit-tested — they should be thin enough that the Go tests cover the meaningful logic.

## Rendering

Canvas API only — no D3, no charting libraries, no visualization frameworks. Tailwind for styling. Keep this constraint in mind before reaching for a dependency.

## Deployment

Cloudflare Pages, auto-deploys on push to `main`. Build command is `./build.sh && npm run build`, output dir is `dist`. The Cloudflare build image already includes Go.
