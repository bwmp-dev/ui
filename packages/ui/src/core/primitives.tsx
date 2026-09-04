import type { ComponentPropsWithRef } from 'react'
import { Separator as BaseSeparator } from '@base-ui/react/separator'
import { cn } from '@stack/utils'

export type SeparatorProps = ComponentPropsWithRef<typeof BaseSeparator>

/**
 * A rule between content. Base UI supplies the correct `role`/`aria-orientation`
 * so it is announced (or ignored) properly.
 */
export function Separator({ className, orientation = 'horizontal', ...props }: SeparatorProps) {
  return (
    <BaseSeparator
      {...props}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-line',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  )
}

export type SkeletonProps = ComponentPropsWithRef<'div'>

/**
 * A placeholder block for content that is still loading.
 *
 * Give it the dimensions of the real content so nothing shifts when the data
 * arrives. It is hidden from assistive technology — announce loading once, at
 * the region level, rather than once per shape.
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden
      {...props}
      className={cn('animate-pulse-subtle rounded-sm bg-surface-sunken', className)}
    />
  )
}

export type KbdProps = ComponentPropsWithRef<'kbd'>

/** A keyboard key. Compose several for a chord: `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      {...props}
      className={cn(
        'border-line bg-surface-sunken text-fg-muted',
        'inline-flex h-4 min-w-4 items-center justify-center rounded-xs border px-1',
        'font-sans text-2xs leading-none font-medium',
        className,
      )}
    />
  )
}

export type CodeProps = ComponentPropsWithRef<'code'> & {
  /** Render as a scrollable block instead of inline. */
  block?: boolean
}

export function Code({ block = false, className, ...props }: CodeProps) {
  const code = (
    <code
      {...props}
      className={cn(
        'font-mono text-[0.9em]',
        block
          ? 'block whitespace-pre'
          : 'rounded-xs border border-line-muted bg-surface-sunken px-1 py-px',
        className,
      )}
    />
  )

  if (!block) return code
  return (
    <pre className="overflow-x-auto rounded-md border border-line bg-surface-sunken p-3 text-xs">
      {code}
    </pre>
  )
}
