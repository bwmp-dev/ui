import type { ComponentPropsWithRef, ReactNode } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { ChevronRight } from 'lucide-react'
import { cn } from '@stack/utils'

export type BreadcrumbsProps = ComponentPropsWithRef<'nav'> & {
  /** Overrides the `nav` label. */
  label?: string
}

function BreadcrumbsRoot({ label = 'Breadcrumb', className, children, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} {...props} className={cn('min-w-0', className)}>
      <ol className="text-fg-muted flex min-w-0 items-center gap-1 text-xs">{children}</ol>
    </nav>
  )
}

export type BreadcrumbItemProps = Omit<ComponentPropsWithRef<'a'>, 'children'> & {
  children?: ReactNode
  /** The final crumb: rendered as plain text and marked as the current page. */
  current?: boolean
  /** Compose with a router link: `render={<Link to="/devices" />}`. */
  render?: useRender.RenderProp
}

function BreadcrumbItem({
  current = false,
  className,
  children,
  render,
  href,
  ...props
}: BreadcrumbItemProps) {
  const element = useRender({
    render,
    defaultTagName: current ? 'span' : 'a',
    props: {
      ...(current
        ? { 'aria-current': 'page' as const }
        : { href, className: 'hover:text-fg focus-ring transition-control' }),
      ...props,
      className: cn(
        'truncate rounded-xs',
        current ? 'text-fg font-medium' : 'hover:text-fg focus-ring transition-control',
        className,
      ),
      children,
    },
  })

  return (
    <li className="flex min-w-0 items-center gap-1">
      {element}
      {current ? null : <ChevronRight size={12} aria-hidden className="text-fg-subtle shrink-0" />}
    </li>
  )
}

/**
 * The path to the current page.
 *
 * Mark the last crumb with `current` — it becomes plain text with
 * `aria-current="page"` rather than a link back to where the user already is.
 *
 * ```tsx
 * <Breadcrumbs>
 *   <Breadcrumbs.Item render={<Link to="/" />}>Devices</Breadcrumbs.Item>
 *   <Breadcrumbs.Item current>edge-01</Breadcrumbs.Item>
 * </Breadcrumbs>
 * ```
 */
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, { Item: BreadcrumbItem })
