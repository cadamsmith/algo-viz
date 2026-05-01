import { ALGORITHMS } from '../algorithms';
import { renderNav } from '../components/Nav';

/** Landing page: lists every algorithm, linking to the ones that are ready. */
export function render(root: HTMLElement): void {
  const cards = ALGORITHMS.map((a) => {
    const tag = a.ready
      ? '<span class="text-xs text-emerald-400">ready</span>'
      : '<span class="text-xs text-zinc-600">coming soon</span>';
    const wrapTag = a.ready ? 'a' : 'div';
    const wrapAttrs = a.ready
      ? `href="#${a.slug}" class="block hover:bg-zinc-900 hover:border-zinc-700 transition-colors"`
      : 'class="block opacity-60"';
    return `
      <${wrapTag} ${wrapAttrs}>
        <article class="border border-zinc-800 rounded-lg p-5 h-full flex flex-col gap-2">
          <div class="flex items-baseline justify-between gap-3">
            <h3 class="text-base font-semibold text-zinc-100">${a.name}</h3>
            ${tag}
          </div>
          <div class="text-xs uppercase tracking-wider text-zinc-500">${a.category}</div>
          <p class="text-sm text-zinc-400 leading-relaxed flex-1">${a.blurb}</p>
          <div class="text-xs font-mono text-zinc-500 pt-2 border-t border-zinc-800/60">
            time ${a.complexity.time} · space ${a.complexity.space}
          </div>
        </article>
      </${wrapTag}>
    `;
  }).join('');

  root.innerHTML = `
    ${renderNav(null)}
    <main class="max-w-5xl mx-auto px-6 py-10">
      <header class="mb-10">
        <h1 class="text-3xl font-semibold text-zinc-100">algo-viz</h1>
        <p class="text-zinc-400 mt-2 max-w-2xl leading-relaxed">
          Interactive visualizations of non-trivial algorithms. All logic in pure Go,
          compiled to WebAssembly. Rendering via the Canvas API — no visualization libraries.
        </p>
      </header>
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">${cards}</section>
    </main>
  `;
}
