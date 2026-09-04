import { Link } from '@tanstack/react-router'
import { Avatar, DropdownMenu, Kbd, Sidebar } from '@stack/ui'
import { LogOut, Monitor, Search, SlidersHorizontal } from 'lucide-react'
import { env } from '~/lib/env'
import { NAV_ITEMS } from '~/config/navigation'
import { useAuth } from '~/features/auth/auth-context'

export type AppSidebarProps = {
  onOpenCommandMenu: () => void
}

export function AppSidebar({ onOpenCommandMenu }: AppSidebarProps) {
  const { user, logout } = useAuth()

  return (
    <Sidebar label="Primary">
      <Sidebar.Header>
        <span className="grid size-5 shrink-0 place-items-center rounded-sm bg-accent text-2xs font-bold text-accent-fg">
          {env.appName.slice(0, 1).toUpperCase()}
        </span>
        <span className="truncate text-ui font-semibold text-fg">{env.appName}</span>
      </Sidebar.Header>

      <Sidebar.Nav>
        <Sidebar.Group>
          <Sidebar.Item
            icon={Search}
            render={<button type="button" onClick={onOpenCommandMenu} />}
            trailing={<Kbd>⌘K</Kbd>}
          >
            Search
          </Sidebar.Item>
        </Sidebar.Group>

        <Sidebar.Group title="Fleet">
          {NAV_ITEMS.map(({ to, label, icon }) => (
            <Sidebar.Item
              key={to}
              icon={icon}
              // The router decides what is active; comparing paths by hand gets
              // nested and trailing-slash cases wrong.
              render={<Link to={to} activeProps={{ 'data-active': 'true' }} />}
            >
              {label}
            </Sidebar.Item>
          ))}
        </Sidebar.Group>
      </Sidebar.Nav>

      <Sidebar.Footer>
        <DropdownMenu>
          <DropdownMenu.Trigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded-md p-1.5 text-left focus-ring hover:bg-hover"
              />
            }
          >
            <Avatar size="sm" name={user?.name} shape="circle" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-ui text-fg">{user?.name ?? 'Signed out'}</span>
              <span className="block truncate text-2xs text-fg-subtle">{user?.email}</span>
            </span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content side="top" align="start" className="w-56">
            <DropdownMenu.GroupLabel>{user?.role}</DropdownMenu.GroupLabel>
            <DropdownMenu.Item
              icon={SlidersHorizontal}
              render={<Link to="/settings" search={{ tab: 'appearance' }} />}
            >
              Appearance
            </DropdownMenu.Item>
            <DropdownMenu.Item icon={Monitor} render={<Link to="/settings" />}>
              Settings
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item icon={LogOut} destructive onClick={() => void logout()}>
              Sign out
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </Sidebar.Footer>
    </Sidebar>
  )
}
