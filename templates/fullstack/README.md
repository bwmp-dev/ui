# Full-stack template

TanStack Start: React with server-side rendering, server functions and server
routes, sharing `@stack/ui` and `@stack/tokens` with the other templates.

## When to use this

Only when a JavaScript server is genuinely the right place for your backend.
If the API is Go, .NET or anything else, use the application template — it talks
to a backend over HTTP and does not care what wrote it. Adding a Node server in
front of an existing API buys you a second deployment and a second place for
bugs.

This template is the right choice when the server is small and belongs to the
same team as the UI: an internal tool, an admin panel, a product where the data
layer is a database and a handful of endpoints.

## Stability

TanStack Start reached v1 and is feature-complete; the version used here is on
the `latest` tag. It is younger than the router and query libraries under it,
which is worth knowing before betting a long-lived product on it.

## How it fits together

```
routes/          route tree, including /api/* server routes
features/*/server.ts   server functions — the RPC layer
features/*/queries.ts  TanStack Query over those functions
server/          session, environment, data access
```

Server functions are the transport, exactly as `api/client.ts` is in the
application template. Caching and invalidation sit above them; the components
know about neither.

### Authentication

The session is an encrypted, signed, httpOnly cookie handled by
`server/session.ts`. `__root.tsx` reads it in `beforeLoad`, so every route guard
can check `context.user` synchronously and the server-rendered HTML is already
correct — there is no signed-out flash.

Route guards throw `redirect()` in `beforeLoad`. On the first request that
happens on the server, so an unauthenticated visitor receives a 302 and never
gets the protected HTML.

Moving to OAuth or an external identity provider means rewriting
`features/auth/server.ts` and `server/session.ts`. Nothing else changes.

### Authorisation

`features/notes/server.ts` puts the session check in middleware rather than in
each handler, so a new endpoint is authenticated by default instead of by
remembering. Validation uses the same Zod schema the form uses, but the server
copy is the rule — the client copy only saves a round trip.

### Environment

`server/env.ts` is wrapped in `createServerOnlyFn`, so the build fails if a
secret is ever pulled into client code. Client-visible configuration goes
through `import.meta.env.VITE_*`.

## Deployment

`vite build` emits `dist/client` (static assets) and `dist/server/server.js`, a
standard `{ fetch(request): Response }` handler. That is deliberately
platform-neutral: the same output runs on Node, Bun, Deno, Cloudflare Workers or
any adapter that speaks fetch.

`server.mjs` is the small amount of glue a bare Node process needs — serve the
client assets, delegate the rest. On a platform with its own adapter, delete it
and use theirs. Behind a CDN, the static branch never runs.

```bash
pnpm build
SESSION_SECRET=... pnpm start
```

Before deploying: set a real `SESSION_SECRET` (32+ bytes), make sure the host
terminates TLS so the `secure` cookie flag works, and replace `server/notes.ts`
with a real database.

## Commands

```bash
pnpm dev        # SSR dev server on :3000
pnpm build      # dist/client + dist/server
pnpm start      # run the build on Node
pnpm typecheck
pnpm lint
```
