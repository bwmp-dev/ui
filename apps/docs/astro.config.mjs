// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import mdx from '@astrojs/mdx'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://stack.example',
  integrations: [react(), mdx()],
  vite: { plugins: [tailwindcss()] },
  server: { port: 4321 },
  markdown: {
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' }, wrap: true },
  },
})
