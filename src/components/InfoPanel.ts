import type { AlgorithmMeta } from '../types';

/**
 * Sidebar panel showing the algorithm name, category, blurb, and complexity.
 * Optional `extras` slot for per-algorithm parameter readouts.
 */
export class InfoPanel {
  private root: HTMLElement;
  private extrasEl: HTMLElement;

  constructor(container: HTMLElement, meta: AlgorithmMeta) {
    this.root = document.createElement('aside');
    this.root.className =
      'w-72 shrink-0 border-l border-zinc-800 bg-zinc-950 p-4 flex flex-col gap-4 text-sm';
    this.root.innerHTML = `
      <header>
        <div class="text-xs uppercase tracking-wider text-zinc-500">${escapeHtml(meta.category)}</div>
        <h2 class="text-lg font-semibold text-zinc-100 mt-1">${escapeHtml(meta.name)}</h2>
      </header>
      <p class="text-zinc-400 leading-relaxed">${escapeHtml(meta.blurb)}</p>
      <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
        <dt class="text-zinc-500">Time</dt>
        <dd class="text-zinc-200 font-mono">${escapeHtml(meta.complexity.time)}</dd>
        <dt class="text-zinc-500">Space</dt>
        <dd class="text-zinc-200 font-mono">${escapeHtml(meta.complexity.space)}</dd>
      </dl>
      <div data-role="extras" class="border-t border-zinc-800 pt-4 mt-auto empty:hidden"></div>
    `;
    container.appendChild(this.root);
    this.extrasEl = this.root.querySelector<HTMLElement>('[data-role="extras"]')!;
  }

  /** Replace the extras slot's HTML — use for per-algorithm live readouts. */
  setExtras(html: string): void {
    this.extrasEl.innerHTML = html;
  }

  destroy(): void {
    this.root.remove();
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      default: return '&#39;';
    }
  });
}
