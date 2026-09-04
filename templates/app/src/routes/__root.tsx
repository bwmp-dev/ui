import { Link, Outlet, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Button, ErrorState, LinkButton, LoadingState } from '@bwmp-dev/ui'
import { userMessage } from '~/api/errors'
import type { AuthState } from '~/features/auth/auth-context'

/**
 * Everything a route guard or loader may need is declared here and provided
 * once in `main.tsx`. Routes read it from `context` instead of importing module
 * singletons, which keeps them testable.
 */
export type RouterContext = {
  queryClient: QueryClient
  auth: AuthState
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
  pendingComponent: () => <LoadingState size="page" />,
  errorComponent: RouteError,
  notFoundComponent: NotFound,
})

/**
 * The last line of defence for anything a route throws.
 *
 * `ErrorState` shows the underlying error in development and hides it in
 * production, so this is safe to leave in place.
 */
function RouteError({ error }: { error: Error }) {
  const router = useRouter()
  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <ErrorState
        size="page"
        title="This page failed to load"
        description={userMessage(error)}
        error={error}
        onRetry={() => void router.invalidate()}
      />
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <div className="flex max-w-narrow flex-col items-center gap-3 text-center">
        <p className="font-mono text-2xs tracking-widest text-fg-subtle uppercase">Error 404</p>
        <h1 className="text-2xl font-semibold text-fg">Page not found</h1>
        <p className="text-xs text-fg-muted">
          The page you asked for does not exist, or you no longer have access to it.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <LinkButton variant="primary" render={<Link to="/" />}>
            Go home
          </LinkButton>
          <Button onClick={() => history.back()}>Go back</Button>
        </div>
      </div>
    </div>
  )
}
