// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { SITE } from './src/content/site.js'

export default defineConfig({
  site: SITE.url,
  integrations: [react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  // Every page is prerendered. Switch to 'server' only when a page genuinely
  // needs a request at runtime.
  output: 'static',
  build: { inlineStylesheets: 'auto' },
})
