import { useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { CommandMenu, useTheme, type CommandAction } from '@bwmp-dev/ui'
import { Kbd } from '@bwmp-dev/ui'
import { Contrast, LogOut, Rows3 } from 'lucide-react'
import { NAV_ITEMS } from '~/config/navigation'
import { useAuth } from '~/features/auth/auth-context'

export type AppCommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Contributed by the current page, e.g. "New device" on the devices list. */
  pageActions?: CommandAction[]
}

/**
 * The palette is assembled at the app level from global actions plus whatever
 * the current page contributes. Pages stay in control of their own commands
 * without a registry or an effect that mutates shared state.
 */
export function AppCommandMenu({ open, onOpenChange, pageActions = [] }: AppCommandMenuProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { resolvedAppearance, setAppearance, density, setDensity } = useTheme()

  const actions = useMemo<CommandAction[]>(
    () => [
      ...pageActions,
      // Navigation commands come from the same list the sidebar renders, so a
      // new section appears in both without being registered twice.
      ...NAV_ITEMS.map((item) => ({
        id: `nav-${item.to}`,
        label: `Go to ${item.label.toLowerCase()}`,
        group: 'Navigation',
        icon: item.icon,
        ...(item.keywords ? { keywords: item.keywords } : {}),
        onSelect: () => void navigate({ to: item.to }),
      })),
      {
        id: 'toggle-appearance',
        label: resolvedAppearance === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        group: 'Preferences',
        icon: Contrast,
        keywords: ['theme', 'dark', 'light'],
        onSelect: () => setAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark'),
      },
      {
        id: 'toggle-density',
        label: density === 'compact' ? 'Use comfortable density' : 'Use compact density',
        group: 'Preferences',
        icon: Rows3,
        keywords: ['spacing', 'compact'],
        onSelect: () => setDensity(density === 'compact' ? 'comfortable' : 'compact'),
      },
      {
        id: 'sign-out',
        label: 'Sign out',
        group: 'Account',
        icon: LogOut,
        onSelect: () => void logout(),
      },
    ],
    [pageActions, navigate, resolvedAppearance, setAppearance, density, setDensity, logout],
  )

  return (
    <CommandMenu
      open={open}
      onOpenChange={onOpenChange}
      actions={actions}
      placeholder="Search commands…"
      footer={
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> to navigate
          <span className="mx-1">·</span>
          <Kbd>↵</Kbd> to run
          <span className="mx-1">·</span>
          <Kbd>esc</Kbd> to close
        </span>
      }
    />
  )
}
