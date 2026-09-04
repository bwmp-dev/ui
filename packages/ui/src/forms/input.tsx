import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Input as BaseInput } from '@base-ui/react/input'
import { cn, cv, type VariantProps } from '@stack/utils'
import type { IconComponent } from '@stack/icons'

/**
 * Shared styling for anything that reads as a text control: Input, Textarea,
 * Select trigger, NumberInput and the Combobox input all use it so they line up
 * on the same baseline and share one focus treatment.
 */
export const controlVariants = cv({
  base: [
    'w-full min-w-0 rounded-md border bg-surface text-fg',
    'placeholder:text-fg-subtle',
    'transition-control focus-ring',
    'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-fg-disabled',
    'data-[invalid]:border-danger-line aria-invalid:border-danger-line',
  ],
  variants: {
    size: {
      sm: 'h-control-sm px-gutter-sm text-xs',
      md: 'h-control-md px-gutter-md text-ui',
      lg: 'h-control-lg px-gutter-lg text-ui',
    },
    variant: {
      default: 'border-line',
      /** Blends into a toolbar until focused or hovered. */
      quiet: 'border-transparent bg-transparent hover:bg-hover focus:bg-surface',
    },
  },
  defaultVariants: { size: 'md', variant: 'default' },
})

export type ControlVariants = VariantProps<typeof controlVariants>

export type InputProps = Omit<ComponentPropsWithRef<typeof BaseInput>, 'size'> &
  ControlVariants & {
    /** Icon rendered inside the leading edge of the field. */
    icon?: IconComponent
    /** Content pinned to the trailing edge, e.g. a unit or a clear button. */
    suffix?: ReactNode
  }

const iconInset = { sm: 'pl-7', md: 'pl-8', lg: 'pl-9' } as const

export function Input({ icon: Icon, suffix, size = 'md', variant, className, ...props }: InputProps) {
  const field = (
    <BaseInput
      {...props}
      className={cn(
        controlVariants({ size, variant }),
        Icon && iconInset[size],
        suffix && 'pr-8',
        className,
      )}
    />
  )

  if (!Icon && !suffix) return field

  return (
    <div className="relative flex w-full items-center">
      {Icon ? (
        <Icon
          width={14}
          height={14}
          aria-hidden
          className="text-fg-subtle pointer-events-none absolute left-2.5"
        />
      ) : null}
      {field}
      {suffix ? (
        <div className="text-fg-subtle absolute right-2 flex items-center text-xs">{suffix}</div>
      ) : null}
    </div>
  )
}

export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'size'> &
  Pick<ControlVariants, 'variant'> & {
    /** Grows with content up to this many rows before scrolling. */
    rows?: number
  }

export function Textarea({ variant, rows = 4, className, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      rows={rows}
      className={cn(
        controlVariants({ variant }),
        'text-ui h-auto resize-y px-gutter-md py-1.5 leading-relaxed',
        className,
      )}
    />
  )
}
