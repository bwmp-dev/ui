import { useState } from 'react'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { AppShell } from '@stack/ui'
import { useHotkey } from '@stack/hooks'
import { AppCommandMenu } from '~/components/app-command-menu'
import { AppSidebar } from '~/components/app-sidebar'

/**
 * The authenticated shell.
 *
 * A pathless layout route (`_app`) rather than a wrapper component, so the
 * guard runs in `beforeLoad` — before any child loader fetches data, and before
 * anything renders. Guarding inside a component means the protected page
 * flashes and its queries fire first.
 *
 * Every route under `src/routes/_app/` is protected by construction; there is
 * no per-route flag to forget.
 */
export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
  },
  component: AppLayout,
})

function AppLayout() {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  // Registered once for the whole authenticated area rather than per page.
  useHotkey('mod+k', () => setCommandMenuOpen(true), { enableInFormFields: true })

  return (
    <>
      <AppShell sidebar={<AppSidebar onOpenCommandMenu={() => setCommandMenuOpen(true)} />}>
        <Outlet />
      </AppShell>
      <AppCommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
    </>
  )
}
