import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { LoadingState, ThemeProvider, ToastProvider, Toaster, TooltipProvider } from '@stack/ui'
import { createQueryClient } from '~/lib/query-client'
import { AuthProvider } from '~/features/auth/auth-provider'
import { useAuth } from '~/features/auth/auth-context'
import { routeTree } from './routeTree.gen'
import './styles.css'

const queryClient = createQueryClient()

const router = createRouter({
  routeTree,
  // `auth` is supplied by <App/> below, once the provider has resolved the
  // session. TanStack Router requires the shape up front but not the value.
  context: { queryClient, auth: undefined! },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  // Route data comes from TanStack Query, which owns its own staleness.
  scrollRestoration: true,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

/**
 * Route guards read `context.auth`, so the router must not mount until the
 * session probe has finished. Otherwise the very first navigation sees
 * `isAuthenticated: false` and bounces an already signed-in user to /login.
 */
function App() {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <LoadingState size="page" label="Starting up" />
      </div>
    )
  }

  return <RouterProvider router={router} context={{ auth }} />
}

const container = document.getElementById('root')
if (!container) throw new Error('Missing #root element in index.html')

createRoot(container).render(
  <StrictMode>
    <ThemeProvider defaultAppearance="system">
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <TooltipProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
