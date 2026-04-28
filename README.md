# algo-viz

Interactive visualizations of non-trivial algorithms, built to demonstrate computational geometry, graph theory, and optimization knowledge. Each algorithm is implemented from scratch in Go, compiled to WebAssembly, and rendered via the Canvas API with no visualization libraries.

## Purpose

Emphasis on correctness, clean architecture, and visual clarity. All algorithm logic is written in pure Go — no JS, no external dependencies on the logic layer.

## Tech Stack

- **Go** — all algorithm logic and WASM binaries
- **WebAssembly** — Go compiled to `.wasm`, loaded in the browser
- **Vite** — build tool and dev server for the JS shell
- **TypeScript** — thin JS shell for bootstrapping WASM and wiring the UI
- **Canvas API** — all rendering (no D3, no charting libraries)
- **Tailwind CSS** — styling
- **`go test`** — unit testing for all algorithm logic

## Project Structure

```
algo-viz/
├── go/                          # all Go source
│   ├── algorithms/              # pure algorithm logic — no syscall/js, no side effects
│   │   ├── voronoi/             # Fortune's Algorithm
│   │   ├── edmonds_karp/        # Maximum Flow
│   │   ├── simulated_annealing/ # Simulated Annealing for TSP
│   │   ├── kd_tree/             # KD-Tree + nearest neighbor
│   │   └── aho_corasick/        # Aho-Corasick string matching
│   ├── wasm/                    # WASM entry points, one per algorithm
│   │   ├── voronoi/main.go      # exposes JS-callable functions via syscall/js
│   │   ├── edmonds_karp/main.go
│   │   ├── simulated_annealing/main.go
│   │   ├── kd_tree/main.go
│   │   └── aho_corasick/main.go
│   └── go.mod
├── src/                         # TypeScript shell
│   ├── wasm/                    # WASM loader + JS bindings per algorithm
│   │   ├── loader.ts            # shared WASM instantiation helper
│   │   ├── voronoi.ts
│   │   ├── edmondsKarp.ts
│   │   ├── simulatedAnnealing.ts
│   │   ├── kdTree.ts
│   │   └── ahoCorasick.ts
│   ├── visualizers/             # canvas rendering, one file per algorithm
│   │   ├── VoronoiVisualizer.ts
│   │   ├── EdmondsKarpVisualizer.ts
│   │   ├── SimulatedAnnealingVisualizer.ts
│   │   ├── KdTreeVisualizer.ts
│   │   └── AhoCorasickVisualizer.ts
│   ├── components/              # shared UI
│   │   ├── AlgoCanvas.ts        # canvas wrapper with resize handling
│   │   ├── Controls.ts          # play/pause, speed, step, reset
│   │   ├── InfoPanel.ts         # algorithm description + complexity
│   │   └── Nav.ts               # navigation between visualizers
│   ├── pages/                   # one entry point per algorithm
│   │   ├── voronoi.ts
│   │   ├── edmondsKarp.ts
│   │   ├── simulatedAnnealing.ts
│   │   ├── kdTree.ts
│   │   └── ahoCorasick.ts
│   └── hooks/
│       ├── animationLoop.ts     # rAF loop abstraction
│       └── canvasResize.ts      # ResizeObserver canvas scaling
├── public/
│   ├── wasm/                    # compiled .wasm binaries (build output)
│   └── wasm_exec.js             # Go's WASM runtime shim (copy from GOROOT)
├── dist/                        # Vite build output
├── README.md
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── build.sh                     # compiles all Go packages to WASM, then runs Vite
```

## Architecture Rules

**Go owns all logic.** Files in `go/algorithms/` must be pure Go — no `syscall/js`, no global state, no I/O. They receive input and return output. This makes them independently testable with `go test` and portable outside the browser.

**WASM entry points are thin wrappers.** Files in `go/wasm/` import from `go/algorithms/` and expose functions to JavaScript via `syscall/js`. They should contain no algorithm logic — only marshalling and JS bindings.

**TypeScript is a shell, not a framework.** The `src/` layer loads WASM, wires up the canvas, and handles UI state. It does not reimplement any algorithm logic. Keep it minimal.

**Visualizers own the canvas.** Visualizer files receive a `CanvasRenderingContext2D` and algorithm state returned from WASM, and draw. They do not own animation timing — that belongs to `animationLoop.ts`.

## Algorithms

| Algorithm | Category | Key Concepts |
|---|---|---|
| Fortune's Algorithm | Computational Geometry | Sweep line, beach line, parabolas, half-edge DCEL |
| Edmonds-Karp | Graph / Network Flow | BFS augmenting paths, residual graph, max-flow min-cut |
| Simulated Annealing (TSP) | Optimization | Probabilistic hill climbing, cooling schedule, combinatorial search |
| KD-Tree | Spatial Data Structures | Binary space partitioning, nearest neighbor, range search |
| Aho-Corasick | String Algorithms | Trie, failure links, finite automaton, multi-pattern matching |

## Controls (shared across all visualizers)

Every visualizer must support:
- **Play / Pause** — start and freeze the animation at any point
- **Step** — advance exactly one logical step when paused
- **Speed slider** — control animation playback rate
- **Reset** — restore to initial state
- **Randomize** — generate new input (where applicable)

## Code Style

**Go**
- `gofmt` enforced — no exceptions
- Every exported function must have a doc comment
- Algorithm files must have a package-level comment explaining the algorithm, time complexity, and space complexity
- No `interface{}` / `any` in algorithm logic — use concrete types

**TypeScript**
- Strict mode enabled — no `any`, no type assertions unless unavoidable
- Keep the shell lean — if logic is creeping into TS, it belongs in Go

## Testing

All algorithm logic in `go/algorithms/` must have `_test.go` files. At minimum, test:
- Correctness on known inputs
- Edge cases (empty input, single point, degenerate cases)

```bash
cd go && go test ./...
```

## Dev Commands

```bash
# compile all Go packages to WASM and copy to public/wasm/
./build.sh

# start Vite dev server (run build.sh first)
npm run dev

# production build
npm run build

# run Go tests
cd go && go test ./...
```

## Building WASM

Each Go package in `go/wasm/` is compiled separately:

```bash
GOOS=js GOARCH=wasm go build -o public/wasm/voronoi.wasm ./go/wasm/voronoi/
```

`build.sh` handles this for all five algorithms. `wasm_exec.js` must be copied from your local Go installation:

```bash
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" public/
```

## Deployment

Deployed to Cloudflare Pages. Connects directly to the GitHub repo — pushes to `main` trigger automatic deploys. Live demo link is pinned in the repo description.

Build settings in Cloudflare:
- **Build command:** `./build.sh && npm run build`
- **Output directory:** `dist`

Note: Cloudflare's build image includes Go — no custom Docker image needed.
