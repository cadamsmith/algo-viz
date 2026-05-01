import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,html}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
