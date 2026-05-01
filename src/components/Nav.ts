import { ALGORITHMS } from '../algorithms';

/**
 * Top nav bar shown on every page. Uses hash routes so it works inside the SPA.
 */
export function renderNav(activeSlug: string | null): string {
  const links = ALGORITHMS.map((a) => {
    const isActive = a.slug === activeSlug;
    const base = 'px-2 py-1 rounded text-xs transition-colors';
    const cls = isActive
      ? `${base} bg-zinc-800 text-zinc-100`
      : a.ready
        ? `${base} text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900`
        : `${base} text-zinc-600 cursor-not-allowed`;
    const href = a.ready ? `#${a.slug}` : '#';
    return `<a href="${href}" class="${cls}" ${a.ready ? '' : 'aria-disabled="true"'}>${a.name}</a>`;
  }).join('');

  return `
    <nav class="flex items-center gap-1 px-4 py-2 border-b border-zinc-800 bg-zinc-950">
      <a href="#" class="text-sm font-semibold text-zinc-100 mr-4 hover:text-white">algo-viz</a>
      <div class="flex flex-wrap items-center gap-1">${links}</div>
    </nav>
  `;
}
