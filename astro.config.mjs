// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jigspec.com',
  output: 'static',
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
