import { Server, Settings } from 'lucide-react'
import type { IconComponent } from '@stack/icons'

/**
 * The application's navigation, in one place.
 *
 * The sidebar, the command palette and anything else that needs to list the
 * app's sections read from here, so adding a section is a one-line change and
 * nothing goes stale. `to` is checked against the generated route tree.
 */
export type NavItem = {
  to: '/devices' | '/settings'
  label: string
  icon: IconComponent
  /** Extra terms that should match this entry in the command palette. */
  keywords?: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/devices', label: 'Devices', icon: Server, keywords: ['fleet', 'hardware'] },
  { to: '/settings', label: 'Settings', icon: Settings, keywords: ['preferences', 'theme'] },
]
