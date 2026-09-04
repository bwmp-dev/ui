import { QueryCache, QueryClient } from '@tanstack/react-query'
import { isApiError } from '~/api/errors'

/**
 * Cache defaults for the whole app.
 *
 * The important ones:
 *
 * - `staleTime` of 30s. The library default of 0 refetches on every mount,
 *   which makes navigating between two pages feel like reloading the app.
 * - Retries only for transient failures. Retrying a 404 or a 422 three times
 *   just delays the error the user is waiting for.
 * - Auth failures never retry: the session is gone and the client has already
 *   been told about it.
 */
export function createQueryClient(onError?: (error: unknown) => void): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      // Background refetch failures never reach a component's error state, so
      // without this they vanish silently.
      onError: (error, query) => {
        if (query.state.data !== undefined) onError?.(error)
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (!isApiError(error)) return failureCount < 1
          if (error.kind === 'auth') return false
          return error.isTransient && failureCount < 2
        },
      },
      mutations: {
        // A retried write can duplicate a resource; the caller decides.
        retry: false,
      },
    },
  })
}
