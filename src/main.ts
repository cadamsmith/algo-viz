import './main.css';

/**
 * Hash-based router. To add an algorithm page:
 *   1. Implement src/pages/<slug>.ts exporting `render(root: HTMLElement)`
 *   2. Add an entry below
 *   3. Flip `ready: true` in src/algorithms.ts
 */
const routes: Record<string, () => Promise<{ render: (root: HTMLElement) => void | Promise<void> }>> = {
  '': () => import('./pages/index'),
  'bubble_sort': () => import('./pages/bubbleSort'),
  // 'voronoi':             () => import('./pages/voronoi'),
  // 'edmonds_karp':        () => import('./pages/edmondsKarp'),
  // 'simulated_annealing': () => import('./pages/simulatedAnnealing'),
  // 'kd_tree':             () => import('./pages/kdTree'),
  // 'aho_corasick':        () => import('./pages/ahoCorasick'),
};

const app = document.getElementById('app');
if (!app) throw new Error('missing #app root');

async function route(): Promise<void> {
  const slug = location.hash.replace(/^#/, '');
  const loader = routes[slug] ?? routes[''];
  if (!loader) return;
  app!.innerHTML = '';
  app!.className = '';
  try {
    const mod = await loader();
    await mod.render(app!);
  } catch (err) {
    console.error(err);
    app!.innerHTML = `<pre class="p-6 text-red-400 text-sm whitespace-pre-wrap">${
      (err as Error).message
    }</pre>`;
  }
}

window.addEventListener('hashchange', () => void route());
void route();
