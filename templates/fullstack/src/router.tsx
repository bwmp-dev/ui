import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'
import { ErrorState, LoadingState } from '@stack/ui'
import { routeTree } from './routeTree.gen'

/**
 * One router factory, used by both the server render and the client hydration.
 *
 * The query client is created per request rather than at module scope: on the
 * server a module-level cache would be shared between users, which is how one
 * person's data ends up in another person's HTML.
 */
export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Data fetched during SSR is already fresh in the browser.
        refetchOnWindowFocus: false,
      },
    },
  })

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient, user: null },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultPendingComponent: () => <LoadingState size="page" />,
    defaultErrorComponent: ({ error }) => (
      <div className="grid min-h-dvh place-items-center p-6">
        <ErrorState size="page" error={error} />
      </div>
    ),
  })

  /*
   * Dehydrates whatever the loaders fetched into the server-rendered HTML and
   * rehydrates it on the client, so a page that loaded its data on the server
   * does not immediately fetch it again. `wrapQueryClient` also mounts the
   * QueryClientProvider, which is why the root route does not.
   */
  setupRouterSsrQueryIntegration({ router, queryClient, wrapQueryClient: true })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
