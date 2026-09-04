import type { ComponentPropsWithRef } from 'react'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { cn, cv, type VariantProps } from '@stack/utils'
import { IconButton } from '../core/button'

/**
 * A modal dialog.
 *
 * Base UI handles focus trapping, focus restoration, Escape, scroll locking and
 * the `aria-labelledby`/`aria-describedby` wiring; this layer is the surface,
 * the layout slots and the motion.
 *
 * ```tsx
 * <Dialog>
 *   <Dialog.Trigger render={<Button>Rename</Button>} />
 *   <Dialog.Content>
 *     <Dialog.Header>
 *       <Dialog.Title>Rename environment</Dialog.Title>
 *     </Dialog.Header>
 *     <Dialog.Body>…</Dialog.Body>
 *     <Dialog.Footer>
 *       <Dialog.Close render={<Button>Cancel</Button>} />
 *       <Button variant="primary">Save</Button>
 *     </Dialog.Footer>
 *   </Dialog.Content>
 * </Dialog>
 * ```
 */
const DialogRoot = BaseDialog.Root

export const dialogContentVariants = cv({
  base: [
    'surface-panel popup-motion',
    'relative flex max-h-[calc(100dvh-4rem)] w-full flex-col overflow-hidden',
    'shadow-lg',
  ],
  variants: {
    size: {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
      full: 'h-[calc(100dvh-4rem)] max-w-[calc(100vw-4rem)]',
    },
  },
  defaultVariants: { size: 'md' },
})

export type DialogContentProps = ComponentPropsWithRef<typeof BaseDialog.Popup> &
  VariantProps<typeof dialogContentVariants> & {
    /** Renders a close button in the top-right of the popup. */
    showCloseButton?: boolean
  }

function DialogContent({
  size,
  showCloseButton = true,
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="bg-overlay overlay-motion fixed inset-0 z-[var(--z-overlay)]" />
      <BaseDialog.Viewport className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center overflow-y-auto p-8">
        <BaseDialog.Popup {...props} className={dialogContentVariants({ size, className })}>
          {showCloseButton ? (
            <BaseDialog.Close
              render={<IconButton icon={X} label="Close" variant="ghost" size="sm" />}
              className="absolute top-2 right-2 z-10"
            />
          ) : null}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  )
}

function DialogHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('border-line-muted shrink-0 border-b px-4 py-3 pr-10', className)}
    />
  )
}

function DialogTitle({ className, ...props }: ComponentPropsWithRef<typeof BaseDialog.Title>) {
  return <BaseDialog.Title {...props} className={cn('text-ui text-fg font-semibold', className)} />
}

function DialogDescription({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseDialog.Description>) {
  return (
    <BaseDialog.Description {...props} className={cn('text-fg-muted mt-1 text-xs', className)} />
  )
}

function DialogBody({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('min-h-0 flex-1 overflow-y-auto px-4 py-4', className)} />
}

function DialogFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn(
        'border-line-muted flex shrink-0 items-center justify-end gap-2 border-t px-4 py-3',
        className,
      )}
    />
  )
}

export const Dialog = Object.assign(DialogRoot, {
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Content: DialogContent,
  Header: DialogHeader,
  Title: DialogTitle,
  Description: DialogDescription,
  Body: DialogBody,
  Footer: DialogFooter,
})
