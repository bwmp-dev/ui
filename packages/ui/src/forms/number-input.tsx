import type { ComponentPropsWithRef } from 'react'
import { NumberField } from '@base-ui/react/number-field'
import { Minus, Plus } from 'lucide-react'
import { cn } from '@bwmp-dev/utils'
import { controlVariants, type ControlVariants } from './input'

export type NumberInputProps = ComponentPropsWithRef<typeof NumberField.Root> &
  ControlVariants & {
    /** Hide the stepper buttons and rely on keyboard and scrub input. */
    hideStepper?: boolean
    placeholder?: string
    /** Passed to `Intl.NumberFormat`, e.g. `{ style: 'percent' }`. */
    format?: Intl.NumberFormatOptions
  }

const stepperButton = [
  'text-fg-subtle hover:text-fg hover:bg-hover transition-control',
  'grid w-6 place-items-center',
  'disabled:pointer-events-none disabled:opacity-40',
]

/**
 * A numeric field with steppers, keyboard increment and pointer scrubbing.
 *
 * Base UI keeps the value locale-formatted for display while reporting a real
 * number to `onValueChange`, which is the part that is tedious to do by hand.
 */
export function NumberInput({
  size = 'md',
  variant,
  hideStepper = false,
  placeholder,
  format,
  className,
  ...props
}: NumberInputProps) {
  return (
    <NumberField.Root {...props} format={format} className={cn('w-full', className)}>
      <NumberField.Group
        className={cn(
          controlVariants({ size, variant }),
          'flex items-stretch overflow-hidden p-0',
          'focus-within:outline-[var(--ring-width)] focus-within:outline-ring',
        )}
      >
        {hideStepper ? null : (
          <NumberField.Decrement className={cn(stepperButton, 'border-r border-line')}>
            <Minus size={12} aria-hidden />
          </NumberField.Decrement>
        )}
        <NumberField.Input
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent px-2 text-center text-ui tabular-nums outline-none"
        />
        {hideStepper ? null : (
          <NumberField.Increment className={cn(stepperButton, 'border-l border-line')}>
            <Plus size={12} aria-hidden />
          </NumberField.Increment>
        )}
      </NumberField.Group>
    </NumberField.Root>
  )
}
