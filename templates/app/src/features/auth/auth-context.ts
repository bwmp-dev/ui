import { createContext, use } from 'react'
import type { Credentials, User } from './schema'

/**
 * The application-facing auth surface.
 *
 * Deliberately small: `user`, three booleans and two actions. Anything
 * provider-specific — tokens, refresh, redirects to an identity provider —
 * belongs in `./api.ts`, so switching providers never reaches the components.
 */
export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  /** True only while the initial session probe is in flight. */
  isLoading: boolean
  login: (credentials: Credentials) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const context = use(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an <AuthProvider>')
  return context
}
