import type { ComponentPropsWithRef, ReactNode } from 'react'
import { NavigationMenu as BaseNavigationMenu } from '@base-ui/react/navigation-menu'
import { useRender } from '@base-ui/react/use-render'
import { ChevronDown } from 'lucide-react'
import { cn } from '@bwmp-dev/utils'

export type NavbarProps = ComponentPropsWithRef<'header'> & {
  /** Keeps the bar pinned while the page scrolls. */
  sticky?: boolean
  /** Adds a bottom border. Turn it off over a hero that supplies its own edge. */
  bordered?: boolean
}

function NavbarRoot({ sticky = false, bordered = true, className, ...props }: NavbarProps) {
  return (
    <header
      {...props}
      className={cn(
        'flex h-navbar w-full shrink-0 items-center gap-3 bg-surface px-3',
        bordered && 'border-b border-line',
        sticky && 'sticky top-0 z-[var(--z-navbar)]',
        className,
      )}
    />
  )
}

function NavbarBrand({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex shrink-0 items-center gap-2 text-ui font-semibold text-fg', className)}
    />
  )
}

/** Pushes everything after it to the right. */
function NavbarSpacer(props: ComponentPropsWithRef<'div'>) {
  return <div aria-hidden {...props} className={cn('flex-1', props.className)} />
}

function NavbarActions({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('flex shrink-0 items-center gap-1', className)} />
}

export type NavbarLinkProps = Omit<ComponentPropsWithRef<'a'>, 'children'> & {
  children?: ReactNode
  active?: boolean
  render?: useRender.RenderProp
}

function NavbarLink({ active, className, children, render, ...props }: NavbarLinkProps) {
  return useRender({
    render,
    defaultTagName: 'a',
    props: {
      'aria-current': active ? ('page' as const) : undefined,
      ...props,
      className: cn(
        'flex h-control-md items-center rounded-md px-2 text-ui font-medium text-fg-muted',
        'focus-ring transition-control hover:bg-hover hover:text-fg',
        'aria-[current=page]:text-fg data-[active]:text-fg',
        className,
      ),
      children,
    },
  })
}

/**
 * The top bar of an application or site.
 *
 * It is a layout shell, not a router: links are plain anchors so any routing
 * library can be composed in through `render`.
 */
export const Navbar = Object.assign(NavbarRoot, {
  Brand: NavbarBrand,
  Link: NavbarLink,
  Spacer: NavbarSpacer,
  Actions: NavbarActions,
})

export type NavigationMenuContentProps = ComponentPropsWithRef<typeof BaseNavigationMenu.Content>

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseNavigationMenu.Trigger>) {
  return (
    <BaseNavigationMenu.Trigger
      {...props}
      className={cn(
        'flex h-control-md items-center gap-1 rounded-md px-2 text-ui font-medium text-fg-muted',
        'focus-ring transition-control hover:bg-hover hover:text-fg',
        'data-[popup-open]:text-fg',
        className,
      )}
    >
      {children}
      <BaseNavigationMenu.Icon className="transition-transform duration-[var(--duration-fast)] data-[popup-open]:rotate-180">
        <ChevronDown size={13} aria-hidden />
      </BaseNavigationMenu.Icon>
    </BaseNavigationMenu.Trigger>
  )
}

function NavigationMenuViewport({ className }: { className?: string }) {
  return (
    <BaseNavigationMenu.Portal>
      <BaseNavigationMenu.Positioner sideOffset={6} className="z-[var(--z-popover)]">
        <BaseNavigationMenu.Popup
          className={cn(
            'origin-[var(--transform-origin)] popup-motion overflow-hidden surface-panel',
            className,
          )}
        >
          <BaseNavigationMenu.Viewport className="relative" />
        </BaseNavigationMenu.Popup>
      </BaseNavigationMenu.Positioner>
    </BaseNavigationMenu.Portal>
  )
}

/**
 * A menu bar with rich dropdown panels, for marketing sites and product headers.
 *
 * Application sidebars do not need this — a flat list of links is faster to
 * scan and cheaper to render.
 *
 * ```tsx
 * <NavigationMenu>
 *   <NavigationMenu.List>
 *     <NavigationMenu.Item>
 *       <NavigationMenu.Trigger>Product</NavigationMenu.Trigger>
 *       <NavigationMenu.Content>…</NavigationMenu.Content>
 *     </NavigationMenu.Item>
 *   </NavigationMenu.List>
 *   <NavigationMenu.Viewport />
 * </NavigationMenu>
 * ```
 */
export const NavigationMenu = Object.assign(BaseNavigationMenu.Root, {
  List: function NavigationMenuList({
    className,
    ...props
  }: ComponentPropsWithRef<typeof BaseNavigationMenu.List>) {
    return (
      <BaseNavigationMenu.List {...props} className={cn('flex items-center gap-0.5', className)} />
    )
  },
  Item: BaseNavigationMenu.Item,
  Trigger: NavigationMenuTrigger,
  Content: function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
    return <BaseNavigationMenu.Content {...props} className={cn('w-max p-3', className)} />
  },
  Link: BaseNavigationMenu.Link,
  Viewport: NavigationMenuViewport,
})
