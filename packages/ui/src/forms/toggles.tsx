import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox'
import { Radio as BaseRadio } from '@base-ui/react/radio'
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group'
import { Switch as BaseSwitch } from '@base-ui/react/switch'
import { Check, Minus } from 'lucide-react'
import { cn } from '@stack/utils'

const controlBox = [
  'grid shrink-0 place-items-center border transition-control focus-ring',
  'border-line bg-surface',
  'data-[checked]:border-transparent data-[checked]:bg-accent data-[checked]:text-accent-fg',
  'data-[indeterminate]:border-transparent data-[indeterminate]:bg-accent data-[indeterminate]:text-accent-fg',
  'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
]

export type CheckboxProps = ComponentPropsWithRef<typeof BaseCheckbox.Root> & {
  /** Convenience label rendered beside the box and wired up by Base UI. */
  label?: ReactNode
  description?: ReactNode
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  const control = (
    <BaseCheckbox.Root {...props} className={cn(controlBox, 'size-4 rounded-xs', className)}>
      <BaseCheckbox.Indicator className="flex data-[unchecked]:hidden">
        {props.indeterminate ? (
          <Minus size={11} strokeWidth={3} aria-hidden />
        ) : (
          <Check size={11} strokeWidth={3} aria-hidden />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  )

  if (!label && !description) return control

  return (
    <label className="group/check flex cursor-pointer items-start gap-2">
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
      <span className="min-w-0">
        <span className="text-ui text-fg block">{label}</span>
        {description ? <span className="text-fg-muted block text-xs">{description}</span> : null}
      </span>
    </label>
  )
}

export type RadioGroupProps = ComponentPropsWithRef<typeof BaseRadioGroup> & {
  orientation?: 'vertical' | 'horizontal'
}

function RadioGroupRoot({ orientation = 'vertical', className, ...props }: RadioGroupProps) {
  return (
    <BaseRadioGroup
      {...props}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-4',
        className,
      )}
    />
  )
}

export type RadioProps = ComponentPropsWithRef<typeof BaseRadio.Root> & {
  label?: ReactNode
  description?: ReactNode
}

function RadioItem({ label, description, className, ...props }: RadioProps) {
  const control = (
    <BaseRadio.Root
      {...props}
      className={cn(
        controlBox,
        'size-4 rounded-full data-[checked]:bg-transparent data-[checked]:border-accent',
        className,
      )}
    >
      <BaseRadio.Indicator className="bg-accent size-2 rounded-full data-[unchecked]:hidden" />
    </BaseRadio.Root>
  )

  if (!label && !description) return control

  return (
    <label className="flex cursor-pointer items-start gap-2">
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
      <span className="min-w-0">
        <span className="text-ui text-fg block">{label}</span>
        {description ? <span className="text-fg-muted block text-xs">{description}</span> : null}
      </span>
    </label>
  )
}

export const RadioGroup = Object.assign(RadioGroupRoot, { Item: RadioItem })

export type SwitchProps = ComponentPropsWithRef<typeof BaseSwitch.Root> & {
  label?: ReactNode
  description?: ReactNode
}

/**
 * Use a Switch only when the change takes effect immediately. If the setting is
 * saved by a submit button, it is a Checkbox.
 */
export function Switch({ label, description, className, ...props }: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      {...props}
      className={cn(
        'bg-line-strong relative h-4 w-7 shrink-0 rounded-full p-px',
        'transition-control focus-ring',
        'data-[checked]:bg-accent',
        'data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
    >
      <BaseSwitch.Thumb
        className={cn(
          'block size-3.5 rounded-full bg-white shadow-xs',
          'transition-transform duration-[var(--duration-fast)] ease-standard',
          'data-[checked]:translate-x-3',
        )}
      />
    </BaseSwitch.Root>
  )

  if (!label && !description) return control

  return (
    <label className="flex cursor-pointer items-start justify-between gap-4">
      <span className="min-w-0">
        <span className="text-ui text-fg block">{label}</span>
        {description ? <span className="text-fg-muted block text-xs">{description}</span> : null}
      </span>
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
    </label>
  )
}
