import { Link, Outlet, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { Avatar, Button, Navbar } from '@stack/ui'
import { LogOut } from 'lucide-react'
import { signOut } from '~/features/auth/server'

/**
 * The authenticated area.
 *
 * The guard runs in `beforeLoad`, which on the first request happens on the
 * server: an unauthenticated visitor gets a 302 and never receives the
 * protected HTML at all. Guarding in a component would ship the page and then
 * hide it.
 */
export const Route = createFileRoute('/_app')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }
    return { user: context.user }
  },
  component: AppLayout,
})

function AppLayout() {
  const { user } = Route.useRouteContext()
  const router = useRouter()

  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar sticky>
        <Navbar.Brand>
          <span className="bg-accent text-accent-fg grid size-5 place-items-center rounded-sm text-2xs font-bold">
            {(import.meta.env.VITE_APP_NAME ?? 'S').slice(0, 1)}
          </span>
          {import.meta.env.VITE_APP_NAME ?? 'Stack Fullstack'}
        </Navbar.Brand>

        <Navbar.Link render={<Link to="/notes" activeProps={{ 'data-active': 'true' }} />}>
          Notes
        </Navbar.Link>

        <Navbar.Spacer />

        <Navbar.Actions>
          <span className="text-fg-muted hidden text-xs sm:inline">{user.email}</span>
          <Avatar size="sm" shape="circle" name={user.name} />
          <Button
            size="sm"
            variant="ghost"
            icon={LogOut}
            onClick={async () => {
              await signOut()
              await router.invalidate()
              await router.navigate({ to: '/login' })
            }}
          >
            Sign out
          </Button>
        </Navbar.Actions>
      </Navbar>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
