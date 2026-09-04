import { api } from '~/api/client'
import { sessionSchema, type Credentials, type Session } from './schema'

/**
 * Everything provider-specific lives in this file.
 *
 * Swapping to OAuth, a cookie session or an external identity service means
 * rewriting these three functions. `useAuth` and every component above it stay
 * exactly as they are.
 */

export async function fetchSession(signal?: AbortSignal): Promise<Session> {
  return sessionSchema.parse(await api.get('/auth/session', signal ? { signal } : {}))
}

export async function login(credentials: Credentials): Promise<Session> {
  return sessionSchema.parse(await api.post('/auth/login', credentials, { anonymous: true }))
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}
