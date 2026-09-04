import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Menu as BaseMenu } from '@base-ui/react/menu'
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu'
import { Check, ChevronRight } from 'lucide-react'
import { cn } from '@stack/utils'
import type { IconComponent } from '@stack/icons'

const popupClass = [
  'surface-panel popup-motion',
  'min-w-44 origin-[var(--transform-origin)] p-1',
  'max-h-[var(--available-height)] overflow-y-auto',
]

const itemClass = [
  'text-ui text-fg relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1 select-none',
  'data-[highlighted]:bg-hover',
  'data-[disabled]:text-fg-disabled data-[disabled]:pointer-events-none',
]

export type MenuItemProps = ComponentPropsWithRef<typeof BaseMenu.Item> & {
  icon?: IconComponent
  /** Right-aligned hint, typically a `<Kbd>` chord. */
  shortcut?: ReactNode
  /** Applies the destructive treatment. */
  destructive?: boolean
}

function MenuItem({ icon: Icon, shortcut, destructive, className, children, ...props }: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      className={cn(
        itemClass,
        destructive && 'text-danger-text data-[highlighted]:bg-danger-subtle',
        className,
      )}
    >
      {Icon ? <Icon width={14} height={14} aria-hidden className="shrink-0" /> : null}
      <span className="flex-1 truncate">{children}</span>
      {shortcut ? <span className="ml-4 shrink-0">{shortcut}</span> : null}
    </BaseMenu.Item>
  )
}

function MenuCheckboxItem({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseMenu.CheckboxItem>) {
  return (
    <BaseMenu.CheckboxItem {...props} className={cn(itemClass, 'pl-6', className)}>
      <BaseMenu.CheckboxItemIndicator className="text-accent-text absolute left-1.5 flex">
        <Check size={13} strokeWidth={2.5} aria-hidden />
      </BaseMenu.CheckboxItemIndicator>
      <span className="flex-1 truncate">{children}</span>
    </BaseMenu.CheckboxItem>
  )
}

function MenuRadioItem({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseMenu.RadioItem>) {
  return (
    <BaseMenu.RadioItem {...props} className={cn(itemClass, 'pl-6', className)}>
      <BaseMenu.RadioItemIndicator className="text-accent-text absolute left-2.5 flex">
        <span className="bg-current size-1.5 rounded-full" />
      </BaseMenu.RadioItemIndicator>
      <span className="flex-1 truncate">{children}</span>
    </BaseMenu.RadioItem>
  )
}

function MenuGroupLabel({ className, ...props }: ComponentPropsWithRef<typeof BaseMenu.GroupLabel>) {
  return (
    <BaseMenu.GroupLabel
      {...props}
      className={cn('text-fg-subtle px-2 pt-1.5 pb-1 text-2xs font-medium uppercase', className)}
    />
  )
}

function MenuSeparator({ className, ...props }: ComponentPropsWithRef<typeof BaseMenu.Separator>) {
  return <BaseMenu.Separator {...props} className={cn('bg-line my-1 h-px', className)} />
}

export type MenuContentProps = ComponentPropsWithRef<typeof BaseMenu.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

function MenuContent({
  className,
  side = 'bottom',
  align = 'start',
  sideOffset = 4,
  ...props
}: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-[var(--z-popover)]"
      >
        <BaseMenu.Popup {...props} className={cn(popupClass, className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  )
}

function MenuSubmenuTrigger({
  className,
  children,
  ...props
}: ComponentPropsWithRef<typeof BaseMenu.SubmenuTrigger>) {
  return (
    <BaseMenu.SubmenuTrigger {...props} className={cn(itemClass, className)}>
      <span className="flex-1 truncate">{children}</span>
      <ChevronRight size={13} aria-hidden className="text-fg-subtle shrink-0" />
    </BaseMenu.SubmenuTrigger>
  )
}

/**
 * A menu opened by a trigger.
 *
 * ```tsx
 * <DropdownMenu>
 *   <DropdownMenu.Trigger render={<IconButton icon={MoreHorizontal} label="Actions" />} />
 *   <DropdownMenu.Content>
 *     <DropdownMenu.Item icon={Pencil}>Rename</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item icon={Trash2} destructive>Delete</DropdownMenu.Item>
 *   </DropdownMenu.Content>
 * </DropdownMenu>
 * ```
 */
export const DropdownMenu = Object.assign(BaseMenu.Root, {
  Trigger: BaseMenu.Trigger,
  Content: MenuContent,
  Item: MenuItem,
  LinkItem: BaseMenu.LinkItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem: MenuRadioItem,
  Group: BaseMenu.Group,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  Submenu: BaseMenu.SubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
})

export type ContextMenuContentProps = ComponentPropsWithRef<typeof BaseContextMenu.Popup>

function ContextMenuContent({ className, ...props }: ContextMenuContentProps) {
  return (
    <BaseContextMenu.Portal>
      <BaseContextMenu.Positioner className="z-[var(--z-popover)]">
        <BaseContextMenu.Popup {...props} className={cn(popupClass, className)} />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  )
}

/**
 * The same menu, opened by right click (or a long press on touch).
 *
 * Anything reachable only from a context menu is invisible to keyboard users,
 * so mirror these actions in a visible DropdownMenu as well.
 */
export const ContextMenu = Object.assign(BaseContextMenu.Root, {
  Trigger: BaseContextMenu.Trigger,
  Content: ContextMenuContent,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: BaseContextMenu.RadioGroup,
  RadioItem: MenuRadioItem,
  Group: BaseContextMenu.Group,
  GroupLabel: MenuGroupLabel,
  Separator: MenuSeparator,
  Submenu: BaseContextMenu.SubmenuRoot,
  SubmenuTrigger: MenuSubmenuTrigger,
})
