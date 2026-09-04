import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { LinkButton, ToastProvider, Toaster, TooltipProvider } from '@stack/ui'
import { getCurrentUser } from '~/features/auth/server'
import type { SessionUser } from '~/server/session'
import styles from '~/styles.css?url'

export type RouterContext = {
  queryClient: QueryClient
  user: SessionUser | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  /**
   * Resolved on the server for the first request and on the client for
   * subsequent navigations. Putting it here means every route guard below can
   * read `context.user` synchronously, and the server-rendered HTML already
   * shows the right state — no signed-out flash on load.
   */
  beforeLoad: async () => ({ user: await getCurrentUser() }),

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Stack Fullstack' },
    ],
    links: [
      { rel: 'stylesheet', href: styles },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),

  component: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center p-6">
      <div className="flex max-w-narrow flex-col items-center text-center">
        <p className="text-fg-subtle font-mono text-2xs tracking-widest uppercase">Error 404</p>
        <h1 className="text-fg mt-3 text-2xl font-semibold">Page not found</h1>
        <p className="text-fg-muted mt-2 text-xs">
          The page you asked for does not exist, or you no longer have access to it.
        </p>
        <LinkButton variant="primary" className="mt-5" render={<Link to="/" />}>
          Go home
        </LinkButton>
      </div>
    </div>
  )
}

function RootDocument() {
  return (
    <html lang="en" data-appearance="dark" data-density="comfortable">
      <head>
        <HeadContent />
        {/*
          Applies the stored colour scheme before first paint. It runs inline in
          the server-rendered HTML, which is the only place early enough to
          avoid a flash of the wrong scheme.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=JSON.parse(localStorage.getItem("stack:theme")||"{}");var a=p.appearance||"system";if(a==="system"){a=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var e=document.documentElement;e.setAttribute("data-appearance",a);e.setAttribute("data-density",p.density||"comfortable")}catch(_){}})()`,
          }}
        />
      </head>
      <body>
        <ToastProvider>
          <TooltipProvider>
            <Outlet />
            <Toaster />
          </TooltipProvider>
        </ToastProvider>
        <Scripts />
      </body>
    </html>
  )
}
