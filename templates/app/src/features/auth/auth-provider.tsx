import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { configureApiAuth } from '~/api/client'
import { isApiError } from '~/api/errors'
import { fetchSession, login as loginRequest, logout as logoutRequest } from './api'
import { AuthContext, type AuthState } from './auth-context'
import type { Session } from './schema'

/**
 * The token lives in a module variable rather than in state.
 *
 * `src/api/client.ts` reads it synchronously on every request, including from
 * route loaders that run outside React. Storing it in state would mean the
 * client either lags a render behind or has to be threaded through by hand.
 */
let currentToken: string | null = null
let handleUnauthorized: (() => void) | null = null

/**
 * Configured at module load rather than in a component, so a route loader that
 * runs before the provider mounts still sends credentials.
 */
configureApiAuth({
  token: () => currentToken,
  onUnauthorized: () => handleUnauthorized?.(),
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const clear = useCallback(() => {
    currentToken = null
    setSession(null)
    // Cached data belongs to the person who just signed out.
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    handleUnauthorized = clear
    return () => {
      handleUnauthorized = null
    }
  }, [clear])

  useEffect(() => {
    const controller = new AbortController()

    fetchSession(controller.signal)
      .then((next) => {
        currentToken = next.token
        setSession(next)
      })
      .catch((error: unknown) => {
        // A 401 here just means "not signed in", which is not an error state.
        if (!isApiError(error) || error.kind !== 'auth') {
          if (!controller.signal.aborted) console.error('Session probe failed', error)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false)
      })

    return () => controller.abort()
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      isLoading,
      login: async (credentials) => {
        const next = await loginRequest(credentials)
        currentToken = next.token
        setSession(next)
      },
      logout: async () => {
        try {
          await logoutRequest()
        } finally {
          // Sign out locally even if the server call fails; the alternative is
          // stranding someone in a session they have asked to end.
          clear()
        }
      },
    }),
    [session, isLoading, clear],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
