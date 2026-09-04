import { useState, type ComponentPropsWithRef, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@stack/utils'
import type { IconComponent } from '@stack/icons'
import { Button } from '../core/button'
import { Spinner } from '../core/spinner'

type StateShellProps = ComponentPropsWithRef<'div'> & {
  /** `page` fills the viewport area; `inline` sits inside a panel or table. */
  size?: 'inline' | 'page'
}

function StateShell({ size = 'inline', className, ...props }: StateShellProps) {
  return (
    <div
      {...props}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'page' ? 'gap-3 px-6 py-16' : 'gap-2 px-4 py-10',
        className,
      )}
    />
  )
}

export type EmptyStateProps = StateShellProps & {
  icon?: IconComponent
  title: ReactNode
  description?: ReactNode
  /** The single action that resolves the emptiness, e.g. "New project". */
  action?: ReactNode
}

/**
 * Shown when a collection is legitimately empty.
 *
 * If the list is empty because a filter excluded everything, say so and offer to
 * clear the filter — telling someone to "create your first item" when they have
 * fifty is the classic version of this bug.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  size,
  ...props
}: EmptyStateProps) {
  return (
    <StateShell size={size} {...props}>
      {Icon ? (
        <Icon width={20} height={20} aria-hidden className="text-fg-subtle" strokeWidth={1.5} />
      ) : null}
      <p className="text-ui text-fg font-medium">{title}</p>
      {description ? (
        <p className="text-fg-muted max-w-prose text-xs">{description}</p>
      ) : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </StateShell>
  )
}

export type LoadingStateProps = StateShellProps & {
  /** Announced to assistive technology while the region is busy. */
  label?: string
}

/**
 * A busy indicator for a region.
 *
 * Prefer `Skeleton` when you know the shape of what is coming — it avoids the
 * layout shift this cannot.
 */
export function LoadingState({ label = 'Loading', size, ...props }: LoadingStateProps) {
  return (
    <StateShell size={size} role="status" aria-live="polite" {...props}>
      <Spinner size="lg" className="text-fg-subtle" />
      <p className="text-fg-muted text-xs">{label}</p>
    </StateShell>
  )
}

export type ErrorStateProps = StateShellProps & {
  title?: ReactNode
  description?: ReactNode
  /** The failure itself. Details are shown only in development. */
  error?: unknown
  onRetry?: () => void
  /**
   * Defaults to `import.meta.env.DEV`. Set explicitly if your build does not
   * expose that, or to force details on in a debug build.
   */
  showDetails?: boolean
}

function describe(error: unknown): { message: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, ...(error.stack ? { stack: error.stack } : {}) }
  }
  return { message: typeof error === 'string' ? error : JSON.stringify(error, null, 2) }
}

const isDevBuild = (): boolean => {
  try {
    return Boolean((import.meta as { env?: { DEV?: boolean } }).env?.DEV)
  } catch {
    return false
  }
}

/**
 * A failed region.
 *
 * The user-facing copy stays generic, but the underlying error is rendered in
 * development — swallowing the message is how a five minute bug becomes an
 * afternoon.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'The request did not complete. Try again, and if it keeps happening the details below will help.',
  error,
  onRetry,
  showDetails,
  size,
  ...props
}: ErrorStateProps) {
  const [expanded, setExpanded] = useState(false)
  const visible = showDetails ?? isDevBuild()
  const detail = error === undefined ? null : describe(error)

  return (
    <StateShell size={size} role="alert" {...props}>
      <p className="text-ui text-fg font-medium">{title}</p>
      {description ? <p className="text-fg-muted max-w-prose text-xs">{description}</p> : null}

      {onRetry ? (
        <Button size="sm" onClick={onRetry} className="mt-1">
          Try again
        </Button>
      ) : null}

      {visible && detail ? (
        <div className="mt-3 w-full max-w-2xl text-left">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="text-fg-subtle hover:text-fg focus-ring flex items-center gap-1 rounded-xs text-2xs font-medium"
          >
            <ChevronDown
              size={12}
              aria-hidden
              className={cn('transition-transform', expanded && 'rotate-180')}
            />
            Error details
          </button>
          {expanded ? (
            <pre className="border-line bg-surface-sunken text-fg-muted mt-1.5 max-h-64 overflow-auto rounded-md border p-3 font-mono text-2xs whitespace-pre-wrap">
              {detail.stack ?? detail.message}
            </pre>
          ) : null}
        </div>
      ) : null}
    </StateShell>
  )
}
