import { createFileRoute } from '@tanstack/react-router'

/**
 * A server route: no component, just HTTP handlers.
 *
 * This is the escape hatch for anything that is not a server function —
 * webhooks, health checks, OAuth callbacks, or an endpoint another service
 * calls. It lives in the same route tree, so the path is defined once.
 */
export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          { status: 'ok', time: new Date().toISOString() },
          { headers: { 'cache-control': 'no-store' } },
        ),
    },
  },
})
