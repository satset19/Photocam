import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    // SPA mode — all non-prerendered routes fall back to 200.html for client-side routing.
    adapter: adapter({
      fallback: '200.html',
      strict: false
    }),
    alias: {
      $lib: 'src/lib'
    }
  }
};

export default config;
