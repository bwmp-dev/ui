import { createServerOnlyFn } from '@tanstack/react-start'

/**
 * Server-only environment access.
 *
 * `createServerOnlyFn` makes the build fail if this is ever pulled into client
 * code, which is the guarantee that matters here: a secret leaking into the
 * browser bundle is not something to discover in review.
 *
 * Client-visible configuration goes through `import.meta.env.VITE_*` instead.
 */
export const getServerEnv = createServerOnlyFn(() => {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET must be set and at least 32 characters. Copy .env.example to .env.',
    )
  }

  return {
    sessionSecret: secret,
    isProduction: process.env.NODE_ENV === 'production',
  }
})
