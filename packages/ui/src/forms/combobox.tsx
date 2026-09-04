import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@stack/utils'
import { controlVariants, type ControlVariants } from './input'

/**
 * A filterable single- or multi-select.
 *
 * Base UI owns the filtering, virtual focus and typeahead behaviour. `items` on
 * the root is what makes filtering work, so pass the full collection there and
 * render `Combobox.List` with a function child.
 *
 * ```tsx
 * <Combobox items={regions}>
 *   <Combobox.Input placeholder="Region" />
 *   <Combobox.Content>
 *     <Combobox.Empty>No matching region.</Combobox.Empty>
 *     <Combobox.List>
 *       {(region: string) => <Combobox.Item key={region} value={region}>{region}</Combobox.Item>}
 *     </Combobox.List>
 *   </Combobox.Content>
 * </Combobox>
 * ```
 */
const ComboboxRoot = BaseCombobox.Root

export type ComboboxInputProps = Omit<ComponentPropsWithRef<typeof BaseCombobox.Input>, 'size'> &
  ControlVariants & {
    /** Show a button that clears the current value. */
    clearable?: boolean
  }

function ComboboxInput({
  size = 'md',
  variant,
  clearable = false,
  className,
  ...props
}: ComboboxInputProps) {
  return (
    <div className="relative flex w-full items-center">
      <BaseCombobox.Input
        {...props}
        className={cn(controlVariants({ size, variant }), 'pr-8', className)}
      />
      <div className="absolute right-1 flex items-center gap-0.5">
        {clearable ? (
          <BaseCombobox.Clear
            aria-label="Clear"
            className="grid size-5 place-items-center rounded-xs text-fg-subtle focus-ring hover:bg-hover hover:text-fg"
          >
            <X size={12} aria-hidden />
          </BaseCombobox.Clear>
        ) : null}
        <BaseCombobox.Trigger
          aria-label="Open"
          className="grid size-5 place-items-center rounded-xs text-fg-subtle focus-ring hover:bg-hover hover:text-fg"
        >
          <ChevronsUpDown size={12} aria-hidden />
        </BaseCombobox.Trigger>
      </div>
    </div>
  )
}

export type ComboboxContentProps = ComponentPropsWithRef<typeof BaseCombobox.Popup> & {
  sideOffset?: number
}

function ComboboxContent({ className, sideOffset = 4, children, ...props }: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={sideOffset} className="z-[var(--z-popover)]">
        <BaseCombobox.Popup
          {...props}
          className={cn(
            'popup-motion surface-panel',
            'max-h-[min(20rem,var(--available-height))] w-[var(--anchor-width)] overflow-y-auto p-1',
            'origin-[var(--transform-origin)]',
            className,
          )}
        >
          {children}
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseCombobox.Item>) {
  return (
    <BaseCombobox.Item
      {...props}
      className={cn(
        'relative flex cursor-default items-center gap-2 rounded-sm py-1 pr-2 pl-6 text-ui text-fg select-none',
        'data-[highlighted]:bg-hover',
        'data-[disabled]:pointer-events-none data-[disabled]:text-fg-disabled',
        className,
      )}
    >
      <BaseCombobox.ItemIndicator className="absolute left-1.5 flex text-accent-text">
        <Check size={13} strokeWidth={2.5} aria-hidden />
      </BaseCombobox.ItemIndicator>
      <span className="truncate">{children}</span>
    </BaseCombobox.Item>
  )
}

/**
 * Base UI keeps this element mounted so screen readers announce the change;
 * only its children come and go. The padding therefore lives on the inner
 * element, otherwise the list carries a permanent gap at the bottom.
 */
function ComboboxEmpty({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseCombobox.Empty>) {
  return (
    <BaseCombobox.Empty {...props}>
      <p className={cn('px-2 py-3 text-center text-xs text-fg-muted', className)}>
        {children ?? 'No results.'}
      </p>
    </BaseCombobox.Empty>
  )
}

function ComboboxGroupLabel({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseCombobox.GroupLabel>) {
  return (
    <BaseCombobox.GroupLabel
      {...props}
      className={cn('px-2 pt-2 pb-1 text-2xs font-medium text-fg-subtle uppercase', className)}
    />
  )
}

export type ComboboxChipsProps = { children?: ReactNode; className?: string }

/** Renders the selected values of a multi-select as removable chips. */
function ComboboxChips({ className, children }: ComboboxChipsProps) {
  return (
    <BaseCombobox.Chips className={cn('flex flex-wrap items-center gap-1', className)}>
      {children}
    </BaseCombobox.Chips>
  )
}

function ComboboxChip({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseCombobox.Chip>) {
  return (
    <BaseCombobox.Chip
      {...props}
      className={cn(
        'flex h-5 items-center gap-1 rounded-sm bg-surface-sunken pr-0.5 pl-1.5 text-2xs text-fg',
        className,
      )}
    >
      {children}
      <BaseCombobox.ChipRemove
        aria-label="Remove"
        className="grid size-4 place-items-center rounded-xs text-fg-subtle hover:text-fg"
      >
        <X size={10} aria-hidden />
      </BaseCombobox.ChipRemove>
    </BaseCombobox.Chip>
  )
}

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  List: BaseCombobox.List,
  Item: ComboboxItem,
  Empty: ComboboxEmpty,
  Group: BaseCombobox.Group,
  GroupLabel: ComboboxGroupLabel,
  Collection: BaseCombobox.Collection,
  Chips: ComboboxChips,
  Chip: ComboboxChip,
  Value: BaseCombobox.Value,
  useFilter: BaseCombobox.useFilter,
})
