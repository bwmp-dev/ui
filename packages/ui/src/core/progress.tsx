import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Progress as BaseProgress } from '@base-ui/react/progress'
import { cn } from '@stack/utils'

export type ProgressProps = Omit<ComponentPropsWithRef<typeof BaseProgress.Root>, 'render'> & {
  label?: ReactNode
  /** Render the numeric value beside the label. */
  showValue?: boolean
  size?: 'sm' | 'md'
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}

const toneClass = {
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
} as const

/**
 * A determinate or indeterminate progress bar.
 *
 * Pass `value={null}` for indeterminate work. Base UI keeps `aria-valuenow`,
 * `aria-valuetext` and the label association correct in both modes.
 */
export function Progress({
  label,
  showValue = false,
  size = 'md',
  tone = 'accent',
  className,
  ...props
}: ProgressProps) {
  return (
    <BaseProgress.Root {...props} className={cn('flex w-full flex-col gap-1.5', className)}>
      {label || showValue ? (
        <div className="flex items-baseline justify-between gap-2">
          {label ? (
            <BaseProgress.Label className="text-fg text-xs font-medium">{label}</BaseProgress.Label>
          ) : (
            <span />
          )}
          {showValue ? (
            <BaseProgress.Value className="text-fg-muted font-mono text-2xs" />
          ) : null}
        </div>
      ) : null}

      <BaseProgress.Track
        className={cn(
          'bg-surface-sunken w-full overflow-hidden rounded-full',
          size === 'sm' ? 'h-1' : 'h-1.5',
        )}
      >
        <BaseProgress.Indicator
          className={cn(
            'h-full rounded-full transition-[width] duration-[var(--duration-normal)] ease-standard',
            toneClass[tone],
            // Base UI reports an indeterminate bar via data-indeterminate.
            'data-[indeterminate]:animate-pulse-subtle data-[indeterminate]:w-full',
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
}
