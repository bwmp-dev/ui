import { readFile, stat } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { serve } from 'srvx'
import app from './dist/server/server.js'

/**
 * Production entry for a plain Node host.
 *
 * `vite build` emits a standard `{ fetch(request): Response }` handler, which
 * is deliberately platform-neutral — the same output runs on Cloudflare
 * Workers, Deno, Bun or a Node container. This file is the small amount of glue
 * a bare Node process needs: serve the built client assets, and hand everything
 * else to the handler.
 *
 * On a platform with its own adapter (Vercel, Netlify, Cloudflare) you delete
 * this file and use theirs. Behind a CDN, the static branch never runs.
 */
const CLIENT_DIR = fileURLToPath(new URL('./dist/client/', import.meta.url))
const PORT = Number(process.env.PORT ?? 3000)

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
}

async function serveStatic(pathname) {
  // `normalize` collapses `..` before the join, so a crafted path cannot
  // escape the client directory.
  const relative = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '')
  const filePath = join(CLIENT_DIR, relative)
  if (!filePath.startsWith(CLIENT_DIR)) return null

  try {
    const info = await stat(filePath)
    if (!info.isFile()) return null

    const body = await readFile(filePath)
    const type = MIME[extname(filePath)] ?? 'application/octet-stream'
    // Vite fingerprints everything under /assets, so it is safe to cache hard.
    const cacheControl = relative.startsWith('assets')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate'

    return new Response(body, { headers: { 'content-type': type, 'cache-control': cacheControl } })
  } catch {
    return null
  }
}

serve({
  port: PORT,
  async fetch(request) {
    const { pathname } = new URL(request.url)

    if (request.method === 'GET' || request.method === 'HEAD') {
      const asset = await serveStatic(pathname)
      if (asset) return asset
    }

    return app.fetch(request)
  },
})

console.log(`Listening on http://localhost:${PORT}`)
