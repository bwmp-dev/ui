import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
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

/**
 * Ids for the inline label and description.
 *
 * Base UI points a control's `aria-labelledby` at the nearest label provider,
 * which inside a `<Field>` is the field's own label. For a group of choices
 * that is wrong: every radio would be announced as "Colour scheme" rather than
 * "Light" or "Dark". Naming each control from its own label fixes that, and
 * leaves the group label doing its actual job on the group.
 */
function useControlLabelling(label: ReactNode, description: ReactNode) {
  const id = useId()
  return {
    labelId: label === undefined ? undefined : `${id}-label`,
    descriptionId: description === undefined ? undefined : `${id}-description`,
  }
}

export type CheckboxProps = ComponentPropsWithRef<typeof BaseCheckbox.Root> & {
  /** Convenience label rendered beside the box. */
  label?: ReactNode
  description?: ReactNode
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  const { labelId, descriptionId } = useControlLabelling(label, description)

  const control = (
    <BaseCheckbox.Root
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      {...props}
      className={cn(controlBox, 'size-4 rounded-xs', className)}
    >
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
    // Still a <label>, so clicking the text toggles the control. The explicit
    // `aria-labelledby` above is what supplies the name.
    <label className="flex cursor-pointer items-start gap-2">
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
      <span className="min-w-0">
        <span id={labelId} className="block text-ui text-fg">
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className="block text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
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
  const { labelId, descriptionId } = useControlLabelling(label, description)

  const control = (
    <BaseRadio.Root
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      {...props}
      className={cn(
        controlBox,
        'size-4 rounded-full data-[checked]:border-accent data-[checked]:bg-transparent',
        className,
      )}
    >
      <BaseRadio.Indicator className="size-2 rounded-full bg-accent data-[unchecked]:hidden" />
    </BaseRadio.Root>
  )

  if (!label && !description) return control

  return (
    // Still a <label>, so clicking the text toggles the control. The explicit
    // `aria-labelledby` above is what supplies the name.
    <label className="flex cursor-pointer items-start gap-2">
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
      <span className="min-w-0">
        <span id={labelId} className="block text-ui text-fg">
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className="block text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
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
  const { labelId, descriptionId } = useControlLabelling(label, description)

  const control = (
    <BaseSwitch.Root
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      {...props}
      className={cn(
        'relative h-4 w-7 shrink-0 rounded-full bg-line-strong p-px',
        'focus-ring transition-control',
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
        <span id={labelId} className="block text-ui text-fg">
          {label}
        </span>
        {description ? (
          <span id={descriptionId} className="block text-xs text-fg-muted">
            {description}
          </span>
        ) : null}
      </span>
      <span className="flex h-[var(--ui-line-height)] items-center">{control}</span>
    </label>
  )
}
