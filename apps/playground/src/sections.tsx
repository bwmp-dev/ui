import type { ReactNode } from 'react'
import { ButtonsSection } from './sections/buttons'
import { DisplaySection } from './sections/display'
import { FormsSection } from './sections/forms'
import { LayoutSection } from './sections/layout'
import { NavigationSection } from './sections/navigation'
import { OverlaysSection } from './sections/overlays'
import { StatesSection } from './sections/states'

/**
 * The playground's table of contents.
 *
 * One section per file, so each module exports only components and fast refresh
 * keeps working while you edit them — which is the entire point of this app.
 */
export type Section = {
  id: string
  title: string
  description?: string
  render: () => ReactNode
}

export const SECTIONS: Section[] = [
  {
    id: 'buttons',
    title: 'Buttons',
    description: 'Every variant and size, plus loading, icons and composition.',
    render: () => <ButtonsSection />,
  },
  {
    id: 'display',
    title: 'Display',
    description: 'Badges, avatars, progress, code and the small pieces.',
    render: () => <DisplaySection />,
  },
  {
    id: 'forms',
    title: 'Forms',
    description: 'Every control, at the current density.',
    render: () => <FormsSection />,
  },
  {
    id: 'overlays',
    title: 'Overlays',
    description: 'Dialogs, drawers, menus, popovers, tooltips and the palette.',
    render: () => <OverlaysSection />,
  },
  {
    id: 'navigation',
    title: 'Navigation',
    description: 'Tabs, pagination, toolbars and filter bars.',
    render: () => <NavigationSection />,
  },
  {
    id: 'states',
    title: 'States',
    description: 'Alerts, toasts, and the empty, loading and error states.',
    render: () => <StatesSection />,
  },
  {
    id: 'layout',
    title: 'Layout',
    description: 'Split panes, property panels and settings sections.',
    render: () => <LayoutSection />,
  },
]
