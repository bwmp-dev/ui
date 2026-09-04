import { cn } from '@bwmp-dev/utils'
import { Loader2 } from 'lucide-react'

export type SpinnerProps = {
  /** Matches the control size scale. */
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
  /**
   * Accessible label. Leave unset when the spinner sits inside a control that
   * already announces its busy state — a second announcement is noise.
   */
  label?: string
}

const sizes = { xs: 12, sm: 14, md: 16, lg: 20 } as const

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
  return (
    <Loader2
      size={sizes[size]}
      strokeWidth={2.25}
      className={cn('shrink-0 animate-spin-slow', className)}
      role={label ? 'status' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  )
}
