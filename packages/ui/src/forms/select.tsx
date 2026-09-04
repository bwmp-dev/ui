import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Select as BaseSelect } from '@base-ui/react/select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@stack/utils'
import { controlVariants, type ControlVariants } from './input'

/**
 * A single- or multi-select listbox.
 *
 * The compound parts are exposed rather than hidden behind an `options` array,
 * because real selects need groups, custom item content and separators.
 *
 * Pass `items` to the root as well: that is what lets the trigger render the
 * selected item's *label* rather than its raw value.
 *
 * ```tsx
 * <Select items={{ stable: 'Stable', beta: 'Beta' }} defaultValue="stable">
 *   <Select.Trigger placeholder="Channel" />
 *   <Select.Content>
 *     <Select.Item value="stable">Stable</Select.Item>
 *     <Select.Item value="beta">Beta</Select.Item>
 *   </Select.Content>
 * </Select>
 * ```
 */
const SelectRoot = BaseSelect.Root

export type SelectTriggerProps = ComponentPropsWithRef<typeof BaseSelect.Trigger> &
  ControlVariants & {
    placeholder?: ReactNode
    /** Replaces the rendered value; receives the current value. */
    renderValue?: (value: unknown) => ReactNode
  }

function SelectTrigger({
  size = 'md',
  variant,
  placeholder,
  renderValue,
  className,
  children,
  ...props
}: SelectTriggerProps) {
  return (
    <BaseSelect.Trigger
      {...props}
      className={cn(
        controlVariants({ size, variant }),
        'flex items-center justify-between gap-2 text-left',
        'data-[popup-open]:border-line-strong',
        className,
      )}
    >
      {children ?? (
        <BaseSelect.Value placeholder={placeholder} className="truncate">
          {renderValue}
        </BaseSelect.Value>
      )}
      <BaseSelect.Icon className="shrink-0 text-fg-subtle">
        <ChevronDown size={14} aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  )
}

export type SelectContentProps = ComponentPropsWithRef<typeof BaseSelect.Popup> & {
  /** Forwarded to the positioner. */
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
}

function SelectContent({
  className,
  sideOffset = 4,
  align = 'start',
  ...props
}: SelectContentProps) {
  return (
    <BaseSelect.Portal>
      <BaseSelect.Positioner
        sideOffset={sideOffset}
        align={align}
        alignItemWithTrigger={false}
        className="z-[var(--z-popover)]"
      >
        <BaseSelect.Popup
          {...props}
          className={cn(
            'popup-motion surface-panel',
            'max-h-[var(--available-height)] min-w-[var(--anchor-width)] overflow-y-auto p-1',
            'origin-[var(--transform-origin)]',
            className,
          )}
        />
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  )
}

export type SelectItemProps = ComponentPropsWithRef<typeof BaseSelect.Item>

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <BaseSelect.Item
      {...props}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1 pr-2 pl-6 text-ui text-fg select-none',
        'data-[highlighted]:bg-hover',
        'data-[disabled]:pointer-events-none data-[disabled]:text-fg-disabled',
        className,
      )}
    >
      <BaseSelect.ItemIndicator className="absolute left-1.5 flex text-accent-text">
        <Check size={13} strokeWidth={2.5} aria-hidden />
      </BaseSelect.ItemIndicator>
      <BaseSelect.ItemText className="truncate">{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  )
}

function SelectGroupLabel({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseSelect.GroupLabel>) {
  return (
    <BaseSelect.GroupLabel
      {...props}
      className={cn('px-2 pt-2 pb-1 text-2xs font-medium text-fg-subtle uppercase', className)}
    />
  )
}

function SelectSeparator({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseSelect.Separator>) {
  return <BaseSelect.Separator {...props} className={cn('my-1 h-px bg-line', className)} />
}

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Content: SelectContent,
  Item: SelectItem,
  Group: BaseSelect.Group,
  GroupLabel: SelectGroupLabel,
  Separator: SelectSeparator,
  Value: BaseSelect.Value,
})
