import type { ComponentPropsWithRef } from 'react'
import { cv, type VariantProps } from '@stack/utils'

export const badgeVariants = cv({
  base: 'inline-flex shrink-0 items-center gap-1 border font-medium whitespace-nowrap',
  variants: {
    tone: {
      neutral: '',
      accent: '',
      success: '',
      warning: '',
      danger: '',
      info: '',
    },
    variant: {
      subtle: 'border-transparent',
      outline: 'bg-transparent',
      solid: 'border-transparent',
    },
    size: {
      sm: 'h-4 px-1 text-2xs',
      md: 'h-5 px-1.5 text-xs',
    },
    /** Square by default — pills are reserved for things that read as chips. */
    shape: { square: 'rounded-sm', pill: 'rounded-full px-2' },
  },
  compoundVariants: [
    { tone: 'neutral', variant: 'subtle', class: 'bg-surface-sunken text-fg-muted' },
    { tone: 'neutral', variant: 'outline', class: 'border-line text-fg-muted' },
    { tone: 'neutral', variant: 'solid', class: 'bg-fg-muted text-canvas' },

    { tone: 'accent', variant: 'subtle', class: 'bg-accent-subtle text-accent-text' },
    { tone: 'accent', variant: 'outline', class: 'border-accent-line text-accent-text' },
    { tone: 'accent', variant: 'solid', class: 'bg-accent text-accent-fg' },

    { tone: 'success', variant: 'subtle', class: 'bg-success-subtle text-success-text' },
    { tone: 'success', variant: 'outline', class: 'border-success-line text-success-text' },
    { tone: 'success', variant: 'solid', class: 'bg-success text-success-fg' },

    { tone: 'warning', variant: 'subtle', class: 'bg-warning-subtle text-warning-text' },
    { tone: 'warning', variant: 'outline', class: 'border-warning-line text-warning-text' },
    { tone: 'warning', variant: 'solid', class: 'bg-warning text-warning-fg' },

    { tone: 'danger', variant: 'subtle', class: 'bg-danger-subtle text-danger-text' },
    { tone: 'danger', variant: 'outline', class: 'border-danger-line text-danger-text' },
    { tone: 'danger', variant: 'solid', class: 'bg-danger text-danger-fg' },

    { tone: 'info', variant: 'subtle', class: 'bg-info-subtle text-info-text' },
    { tone: 'info', variant: 'outline', class: 'border-info-line text-info-text' },
    { tone: 'info', variant: 'solid', class: 'bg-info text-info-fg' },
  ],
  defaultVariants: { tone: 'neutral', variant: 'subtle', size: 'md', shape: 'square' },
})

export type BadgeProps = ComponentPropsWithRef<'span'> &
  VariantProps<typeof badgeVariants> & {
    /**
     * Show a status dot. Colour comes from the tone, so the meaning does not
     * depend on the reader distinguishing the background tint.
     */
    dot?: boolean
  }

const dotTone = {
  neutral: 'bg-fg-subtle',
  accent: 'bg-accent',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
} as const

export function Badge({
  tone = 'neutral',
  variant,
  size,
  shape,
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span {...props} className={badgeVariants({ tone, variant, size, shape, className })}>
      {dot ? <span className={`size-1.5 rounded-full ${dotTone[tone]}`} aria-hidden /> : null}
      {children}
    </span>
  )
}
