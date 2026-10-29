import path from 'node:path';
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

// Build-only config added to render the kb export; the export ships src/ alone.
export default {
  extensions: ['.svelte', '.svx'],
  preprocess: [mdsvex({ extensions: ['.svx'], layout: { runbook: path.resolve('src/lib/layouts/runbook.svelte') } })],
  kit: {
    adapter: adapter({ fallback: undefined }),
    alias: { '#lib': 'src/lib' },
    prerender: { entries: ['*'], handleHttpError: 'warn' },
  },
};
