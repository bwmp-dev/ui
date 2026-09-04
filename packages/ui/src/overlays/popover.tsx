import type { ComponentPropsWithRef } from 'react'
import { Popover as BasePopover } from '@base-ui/react/popover'
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip'
import { cn } from '@stack/utils'

export type PopoverContentProps = ComponentPropsWithRef<typeof BasePopover.Popup> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
}

function PopoverContent({
  className,
  side = 'bottom',
  align = 'center',
  sideOffset = 6,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="z-[var(--z-popover)]"
      >
        <BasePopover.Popup
          {...props}
          className={cn(
            'surface-panel popup-motion',
            'max-w-[min(20rem,var(--available-width))] p-3 text-ui',
            'origin-[var(--transform-origin)]',
            className,
          )}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

/**
 * A non-modal panel anchored to a trigger.
 *
 * Use it for secondary controls and detail. If the content demands a decision
 * before anything else can happen, use a Dialog instead.
 */
export const Popover = Object.assign(BasePopover.Root, {
  Trigger: BasePopover.Trigger,
  Close: BasePopover.Close,
  Content: PopoverContent,
  Title: function PopoverTitle({
    className,
    ...props
  }: ComponentPropsWithRef<typeof BasePopover.Title>) {
    return (
      <BasePopover.Title {...props} className={cn('text-ui text-fg font-semibold', className)} />
    )
  },
  Description: function PopoverDescription({
    className,
    ...props
  }: ComponentPropsWithRef<typeof BasePopover.Description>) {
    return (
      <BasePopover.Description {...props} className={cn('text-fg-muted mt-1 text-xs', className)} />
    )
  },
})

export type TooltipProps = ComponentPropsWithRef<typeof BaseTooltip.Root> & {
  /** The tooltip text. Keep it short — it is not a place for instructions. */
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

/**
 * A short label for a control that has no visible text.
 *
 * Tooltips never contain interactive content and are not announced on touch
 * devices, so the information in one must always be available elsewhere. Icon
 * buttons still need their own `label`.
 *
 * ```tsx
 * <Tooltip content="Refresh">
 *   <IconButton icon={RefreshCw} label="Refresh" />
 * </Tooltip>
 * ```
 */
export function Tooltip({ content, side = 'top', sideOffset = 6, children, ...props }: TooltipProps) {
  return (
    <BaseTooltip.Root {...props}>
      <BaseTooltip.Trigger render={children as React.ReactElement} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner
          side={side}
          sideOffset={sideOffset}
          className="z-[var(--z-tooltip)]"
        >
          <BaseTooltip.Popup
            className={cn(
              'popup-motion origin-[var(--transform-origin)]',
              'bg-fg text-canvas rounded-sm px-1.5 py-1 text-2xs font-medium shadow-md',
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  )
}

/**
 * Share hover timing between tooltips so that moving between adjacent controls
 * does not re-trigger the opening delay. Mount it once near the app root.
 */
export const TooltipProvider = BaseTooltip.Provider
