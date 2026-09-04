/**
 * Environment access, validated once at startup.
 *
 * Reading `import.meta.env` directly scatters `string | undefined` through the
 * app and turns a missing variable into a blank screen halfway through a
 * session. Failing here instead means a misconfigured build breaks immediately,
 * with a message that names the variable.
 */

function required(name: string, value: string | undefined): string {
  if (value === undefined || value === '') {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`,
    )
  }
  return value
}

function flag(value: string | undefined, fallback = false): boolean {
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

export const env = {
  apiUrl: required('VITE_API_URL', import.meta.env.VITE_API_URL),
  useMockApi: flag(import.meta.env.VITE_API_MOCK, import.meta.env.DEV),
  appName: import.meta.env.VITE_APP_NAME ?? 'Stack App',
  isDev: import.meta.env.DEV,
} as const
