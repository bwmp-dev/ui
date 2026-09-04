import type { ComponentPropsWithRef } from 'react'
import { Drawer as BaseDrawer } from '@base-ui/react/drawer'
import { X } from 'lucide-react'
import { cn, cv, type VariantProps } from '@stack/utils'
import { IconButton } from '../core/button'

export const drawerContentVariants = cv({
  base: [
    'fixed flex flex-col border-line bg-surface-raised shadow-lg drawer-motion',
    'focus:outline-none',
  ],
  variants: {
    side: {
      right:
        'inset-y-0 right-0 h-dvh w-[min(28rem,calc(100vw-3rem))] border-l data-[ending-style]:translate-x-full data-[starting-style]:translate-x-full',
      left: 'inset-y-0 left-0 h-dvh w-[min(28rem,calc(100vw-3rem))] border-r data-[ending-style]:-translate-x-full data-[starting-style]:-translate-x-full',
      bottom:
        'inset-x-0 bottom-0 max-h-[85dvh] rounded-t-lg border-t data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full',
    },
  },
  defaultVariants: { side: 'right' },
})

export type DrawerContentProps = ComponentPropsWithRef<typeof BaseDrawer.Popup> &
  VariantProps<typeof drawerContentVariants> & {
    showCloseButton?: boolean
  }

function DrawerContent({
  side = 'right',
  showCloseButton = true,
  className,
  children,
  ...props
}: DrawerContentProps) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className="fixed inset-0 z-[var(--z-overlay)] bg-overlay overlay-motion" />
      <BaseDrawer.Popup
        {...props}
        className={cn('z-[var(--z-drawer)]', drawerContentVariants({ side, className }))}
      >
        {side === 'bottom' ? (
          <div className="flex justify-center pt-2" aria-hidden>
            <span className="h-1 w-9 rounded-full bg-line-strong" />
          </div>
        ) : null}
        {showCloseButton ? (
          <BaseDrawer.Close
            render={<IconButton icon={X} label="Close" variant="ghost" size="sm" />}
            className="absolute top-2 right-2 z-10"
          />
        ) : null}
        {children}
      </BaseDrawer.Popup>
    </BaseDrawer.Portal>
  )
}

function DrawerHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('shrink-0 border-b border-line-muted px-4 py-3 pr-10', className)}
    />
  )
}

function DrawerBody({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', className)} />
}

function DrawerFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'flex shrink-0 items-center justify-end gap-2 border-t border-line-muted px-4 py-3',
        className,
      )}
    />
  )
}

/**
 * A panel that slides in from an edge.
 *
 * Base UI's Drawer adds swipe-to-dismiss and virtual keyboard handling on top of
 * the dialog behaviour, which is why this is not just a Dialog with different
 * styling. Prefer it on touch and for long secondary flows; prefer a Dialog for
 * short, focused decisions.
 */
export const Drawer = Object.assign(BaseDrawer.Root, {
  Trigger: BaseDrawer.Trigger,
  Close: BaseDrawer.Close,
  Content: DrawerContent,
  Header: DrawerHeader,
  Title: function DrawerTitle({
    className,
    ...props
  }: ComponentPropsWithRef<typeof BaseDrawer.Title>) {
    return (
      <BaseDrawer.Title {...props} className={cn('text-ui font-semibold text-fg', className)} />
    )
  },
  Description: function DrawerDescription({
    className,
    ...props
  }: ComponentPropsWithRef<typeof BaseDrawer.Description>) {
    return (
      <BaseDrawer.Description {...props} className={cn('mt-1 text-xs text-fg-muted', className)} />
    )
  },
  Body: DrawerBody,
  Footer: DrawerFooter,
})
