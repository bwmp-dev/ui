import type { ComponentPropsWithRef, ReactNode } from 'react'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn, cv, type VariantProps } from '@stack/utils'
import type { IconComponent } from '@stack/icons'
import { IconButton } from '../core/button'

export const alertVariants = cv({
  base: 'flex gap-2.5 rounded-md border p-3 text-ui',
  variants: {
    tone: {
      info: 'border-info-line bg-info-subtle text-fg',
      success: 'border-success-line bg-success-subtle text-fg',
      warning: 'border-warning-line bg-warning-subtle text-fg',
      danger: 'border-danger-line bg-danger-subtle text-fg',
      neutral: 'border-line bg-surface-sunken text-fg',
    },
  },
  defaultVariants: { tone: 'info' },
})

const toneIcon: Record<NonNullable<VariantProps<typeof alertVariants>['tone']>, IconComponent> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
  neutral: Info,
}

const toneIconClass = {
  info: 'text-info-text',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  neutral: 'text-fg-muted',
} as const

export type AlertProps = ComponentPropsWithRef<'div'> &
  VariantProps<typeof alertVariants> & {
    title?: ReactNode
    /** Replaces the tone's default icon. Pass `null` to remove it. */
    icon?: IconComponent | null
    /** Buttons or links, rendered under the message. */
    actions?: ReactNode
    onDismiss?: () => void
  }

/**
 * A persistent, inline message about the surrounding content.
 *
 * `warning` and `danger` are announced assertively; the others are polite. For
 * transient feedback about something the user just did, use a Toast.
 */
export function Alert({
  tone = 'info',
  title,
  icon,
  actions,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = icon === null ? null : (icon ?? toneIcon[tone])
  const urgent = tone === 'danger' || tone === 'warning'

  return (
    <div
      role={urgent ? 'alert' : 'status'}
      {...props}
      className={alertVariants({ tone, className })}
    >
      {Icon ? (
        <Icon
          width={15}
          height={15}
          aria-hidden
          className={cn('mt-0.5 shrink-0', toneIconClass[tone])}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold text-fg">{title}</p> : null}
        {children ? (
          <div className={cn('text-fg-muted', title && 'mt-0.5', 'text-xs')}>{children}</div>
        ) : null}
        {actions ? <div className="mt-2 flex items-center gap-2">{actions}</div> : null}
      </div>

      {onDismiss ? (
        <IconButton
          icon={X}
          label="Dismiss"
          variant="ghost"
          size="xs"
          onClick={onDismiss}
          className="-mt-0.5 -mr-0.5 shrink-0"
        />
      ) : null}
    </div>
  )
}
