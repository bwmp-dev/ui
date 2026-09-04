import type { ComponentPropsWithRef, ReactNode } from 'react'
import { useRender } from '@base-ui/react/use-render'
import { cn } from '@stack/utils'
import type { IconComponent } from '@stack/icons'

export type SidebarProps = ComponentPropsWithRef<'aside'> & {
  label?: string
}

function SidebarRoot({ label = 'Main', className, ...props }: SidebarProps) {
  return (
    <aside
      aria-label={label}
      {...props}
      className={cn(
        'border-line bg-surface flex h-full w-sidebar shrink-0 flex-col border-r',
        className,
      )}
    />
  )
}

function SidebarHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex h-navbar shrink-0 items-center gap-2 px-3', className)}
    />
  )
}

function SidebarNav({ className, ...props }: ComponentPropsWithRef<'nav'>) {
  return (
    <nav
      {...props}
      className={cn('flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-2 py-2', className)}
    />
  )
}

export type SidebarGroupProps = ComponentPropsWithRef<'div'> & {
  /** Group heading. Omit for the primary, unlabelled group. */
  title?: ReactNode
  /** Right-aligned control, e.g. an "add" button. */
  action?: ReactNode
}

function SidebarGroup({ title, action, className, children, ...props }: SidebarGroupProps) {
  return (
    <div {...props} className={cn('flex flex-col gap-0.5', className)}>
      {title || action ? (
        <div className="flex h-6 items-center justify-between gap-2 px-2">
          {title ? (
            <span className="text-fg-subtle text-2xs font-medium tracking-wide uppercase">
              {title}
            </span>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      {children}
    </div>
  )
}

export type SidebarItemProps = Omit<ComponentPropsWithRef<'a'>, 'children'> & {
  icon?: IconComponent
  children?: ReactNode
  /**
   * Marks the item as the current page. With TanStack Router, prefer
   * `render={<Link to="…" activeProps={{ 'data-active': 'true' }} />}` and let
   * the router decide, rather than comparing paths by hand.
   */
  active?: boolean
  /** Right-aligned badge or count. */
  trailing?: ReactNode
  render?: useRender.RenderProp
}

function SidebarItem({
  icon: Icon,
  active,
  trailing,
  className,
  children,
  render,
  ...props
}: SidebarItemProps) {
  return useRender({
    render,
    defaultTagName: 'a',
    props: {
      'aria-current': active ? ('page' as const) : undefined,
      ...props,
      className: cn(
        'text-ui text-fg-muted flex h-control-md items-center gap-2 rounded-md px-2',
        'transition-control focus-ring',
        'hover:bg-hover hover:text-fg',
        // `data-active` is what a router link sets; `aria-current` is what we set.
        'aria-[current=page]:bg-selected aria-[current=page]:text-fg data-[active]:bg-selected data-[active]:text-fg',
        className,
      ),
      children: (
        <>
          {Icon ? <Icon width={15} height={15} aria-hidden className="shrink-0" /> : null}
          <span className="min-w-0 flex-1 truncate">{children}</span>
          {trailing ? <span className="shrink-0">{trailing}</span> : null}
        </>
      ),
    },
  })
}

function SidebarFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div {...props} className={cn('border-line-muted shrink-0 border-t p-2', className)} />
  )
}

/**
 * The primary navigation rail of an application.
 *
 * Width and header height come from the density tokens, so it tightens with the
 * rest of the interface in compact mode.
 *
 * ```tsx
 * <Sidebar>
 *   <Sidebar.Header><ProductMark /></Sidebar.Header>
 *   <Sidebar.Nav>
 *     <Sidebar.Group>
 *       <Sidebar.Item icon={Server} render={<Link to="/devices" />}>Devices</Sidebar.Item>
 *     </Sidebar.Group>
 *   </Sidebar.Nav>
 *   <Sidebar.Footer>…</Sidebar.Footer>
 * </Sidebar>
 * ```
 */
export const Sidebar = Object.assign(SidebarRoot, {
  Header: SidebarHeader,
  Nav: SidebarNav,
  Group: SidebarGroup,
  Item: SidebarItem,
  Footer: SidebarFooter,
})
