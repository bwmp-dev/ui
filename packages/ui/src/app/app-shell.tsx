import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@bwmp-dev/utils'

export type AppShellProps = ComponentPropsWithRef<'div'> & {
  /** The persistent navigation rail. Usually a `<Sidebar>`. */
  sidebar?: ReactNode
  /** A bar above the content column. Usually a `<Toolbar>` or `<Navbar>`. */
  header?: ReactNode
}

/**
 * The outer layout of an application: a full-height sidebar beside a scrolling
 * content column.
 *
 * Only the content area scrolls, which is what keeps the sidebar and toolbar
 * fixed without any `position: fixed` and its z-index consequences.
 *
 * ```tsx
 * <AppShell sidebar={<Sidebar>…</Sidebar>} header={<Toolbar>…</Toolbar>}>
 *   <Outlet />
 * </AppShell>
 * ```
 */
export function AppShell({ sidebar, header, className, children, ...props }: AppShellProps) {
  return (
    <div {...props} className={cn('flex h-dvh w-full overflow-hidden bg-canvas', className)}>
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        {header}
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export type PageProps = ComponentPropsWithRef<'div'> & {
  /** Constrains the content width. `full` fills the available space. */
  width?: 'narrow' | 'content' | 'page' | 'full'
}

const widthClass = {
  narrow: 'max-w-narrow',
  content: 'max-w-content',
  page: 'max-w-page',
  full: '',
} as const

/** Padding and max-width for a routed page inside `AppShell`. */
export function Page({ width = 'page', className, ...props }: PageProps) {
  return (
    <div
      {...props}
      className={cn('mx-auto flex w-full flex-col gap-section p-4', widthClass[width], className)}
    />
  )
}

export type PageHeaderProps = ComponentPropsWithRef<'header'> & {
  title: ReactNode
  description?: ReactNode
  /** Breadcrumbs or an eyebrow label above the title. */
  above?: ReactNode
  /** Primary and secondary actions, aligned right. */
  actions?: ReactNode
  /** Tabs or a filter bar attached below the header. */
  below?: ReactNode
}

/**
 * The title block of a page.
 *
 * The heading is an `<h1>`: one page, one top-level heading. If you need this
 * inside a page, you want `SettingsSection` or `FormSection`.
 */
export function PageHeader({
  title,
  description,
  above,
  actions,
  below,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header {...props} className={cn('flex flex-col gap-3', className)}>
      {above}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-fg">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-prose text-xs text-fg-muted">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
      {below}
    </header>
  )
}
