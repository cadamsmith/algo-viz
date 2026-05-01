import type { AlgorithmMeta } from './types';

/**
 * Registry of every algorithm. Slug must match the Go package directory under
 * go/wasm/ so that the wasm path /wasm/<slug>.wasm resolves correctly.
 *
 * Flip `ready` to true once a page exists, and register the page's render()
 * in src/main.ts.
 */
export const ALGORITHMS: AlgorithmMeta[] = [
  {
    slug: 'voronoi',
    name: "Fortune's Algorithm",
    category: 'Computational Geometry',
    blurb: 'Sweep-line construction of a Voronoi diagram via a beach line of parabolic arcs.',
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    ready: false,
  },
  {
    slug: 'edmonds_karp',
    name: 'Edmonds-Karp',
    category: 'Graph / Network Flow',
    blurb: 'Maximum flow via BFS-discovered augmenting paths in the residual graph.',
    complexity: { time: 'O(VE²)', space: 'O(V + E)' },
    ready: false,
  },
  {
    slug: 'simulated_annealing',
    name: 'Simulated Annealing (TSP)',
    category: 'Optimization',
    blurb: 'Probabilistic hill climbing over tour permutations with a cooling schedule.',
    complexity: { time: 'O(k · n)', space: 'O(n)' },
    ready: false,
  },
  {
    slug: 'kd_tree',
    name: 'KD-Tree',
    category: 'Spatial Data Structures',
    blurb: 'Binary space partitioning for fast nearest-neighbor and range queries.',
    complexity: { time: 'O(log n) avg', space: 'O(n)' },
    ready: false,
  },
  {
    slug: 'aho_corasick',
    name: 'Aho-Corasick',
    category: 'String Algorithms',
    blurb: 'Trie with failure links forming a finite automaton for multi-pattern matching.',
    complexity: { time: 'O(n + m + z)', space: 'O(m)' },
    ready: false,
  },
  {
    slug: 'bubble_sort',
    name: 'Bubble Sort',
    category: 'Demo',
    blurb: 'End-to-end example showing how the Go → WASM → Canvas pipeline wires together. Remove once real algorithms ship.',
    complexity: { time: 'O(n²)', space: 'O(1)' },
    ready: true,
  },
];

export function findAlgorithm(slug: string): AlgorithmMeta | undefined {
  return ALGORITHMS.find((a) => a.slug === slug);
}
