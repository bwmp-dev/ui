/**
 * The documentation's table of contents.
 *
 * One list, used by the sidebar and by the previous/next links. A page that is
 * not here is unreachable, which is the point — it makes an orphaned page
 * obvious instead of quietly unlinked.
 */
export type DocLink = { href: string; label: string; summary?: string }
export type DocSection = { title: string; links: DocLink[] }

export const NAVIGATION: DocSection[] = [
  {
    title: 'Introduction',
    links: [
      { href: '/', label: 'Overview' },
      { href: '/guides/getting-started', label: 'Getting started' },
      { href: '/guides/architecture', label: 'Architecture' },
    ],
  },
  {
    title: 'Foundations',
    links: [
      { href: '/tokens', label: 'Tokens' },
      { href: '/guides/theming', label: 'Theming' },
      { href: '/guides/styling', label: 'Styling' },
    ],
  },
  {
    title: 'Components',
    links: [
      { href: '/components/core', label: 'Core' },
      { href: '/components/forms', label: 'Forms' },
      { href: '/components/overlays', label: 'Overlays' },
      { href: '/components/navigation', label: 'Navigation' },
      { href: '/components/feedback', label: 'Feedback' },
      { href: '/components/application', label: 'Application' },
      { href: '/components/data-table', label: 'DataTable' },
    ],
  },
  {
    title: 'Packages',
    links: [
      { href: '/hooks', label: 'Hooks' },
      { href: '/utils', label: 'Utilities' },
    ],
  },
  {
    title: 'Projects',
    links: [
      { href: '/guides/templates', label: 'Templates' },
      { href: '/guides/data', label: 'Data and API' },
      { href: '/guides/forms', label: 'Forms' },
      { href: '/guides/testing', label: 'Testing' },
    ],
  },
  {
    title: 'Maintaining',
    links: [
      { href: '/guides/adding-a-component', label: 'Adding a component' },
      { href: '/guides/publishing', label: 'Publishing' },
      { href: '/guides/upgrading', label: 'Upgrading' },
    ],
  },
]

export const FLAT_LINKS: DocLink[] = NAVIGATION.flatMap((section) => section.links)

export function siblingsOf(href: string) {
  const index = FLAT_LINKS.findIndex((link) => link.href === href)
  return {
    previous: index > 0 ? FLAT_LINKS[index - 1] : undefined,
    next: index >= 0 && index < FLAT_LINKS.length - 1 ? FLAT_LINKS[index + 1] : undefined,
  }
}
