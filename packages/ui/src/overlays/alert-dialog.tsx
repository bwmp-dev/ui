import type { ComponentPropsWithRef } from 'react'
import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog'
import { cn } from '@stack/utils'
import { dialogContentVariants, type DialogContentProps } from './dialog'

/**
 * A dialog that requires an explicit decision.
 *
 * It cannot be dismissed by clicking outside, so reserve it for choices where
 * an accidental dismissal would lose work or hide a destructive consequence. A
 * louder confirmation for routine actions just trains people to click through.
 *
 * Escape still closes it — a modal that traps focus and cannot be escaped is an
 * accessibility failure, so treat dismissal as equivalent to cancelling.
 *
 * ```tsx
 * <AlertDialog>
 *   <AlertDialog.Trigger render={<Button variant="danger">Delete</Button>} />
 *   <AlertDialog.Content>
 *     <AlertDialog.Header>
 *       <AlertDialog.Title>Delete this environment?</AlertDialog.Title>
 *       <AlertDialog.Description>
 *         Deployments and logs are removed. This cannot be undone.
 *       </AlertDialog.Description>
 *     </AlertDialog.Header>
 *     <AlertDialog.Footer>
 *       <AlertDialog.Close render={<Button>Cancel</Button>} />
 *       <Button variant="danger" onClick={remove}>Delete</Button>
 *     </AlertDialog.Footer>
 *   </AlertDialog.Content>
 * </AlertDialog>
 * ```
 */
function AlertDialogContent({
  size = 'sm',
  className,
  children,
  ...props
}: Omit<DialogContentProps, 'showCloseButton'>) {
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className="bg-overlay overlay-motion fixed inset-0 z-[var(--z-overlay)]" />
      <BaseAlertDialog.Viewport className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center overflow-y-auto p-8">
        <BaseAlertDialog.Popup {...props} className={dialogContentVariants({ size, className })}>
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  )
}

function AlertDialogHeader({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return <div {...props} className={cn('shrink-0 px-4 pt-4 pb-2', className)} />
}

function AlertDialogTitle({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseAlertDialog.Title>) {
  return (
    <BaseAlertDialog.Title {...props} className={cn('text-ui text-fg font-semibold', className)} />
  )
}

function AlertDialogDescription({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseAlertDialog.Description>) {
  return (
    <BaseAlertDialog.Description
      {...props}
      className={cn('text-fg-muted mt-1.5 text-xs', className)}
    />
  )
}

function AlertDialogFooter({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      {...props}
      className={cn('flex shrink-0 items-center justify-end gap-2 px-4 pt-3 pb-4', className)}
    />
  )
}

export const AlertDialog = Object.assign(BaseAlertDialog.Root, {
  Trigger: BaseAlertDialog.Trigger,
  Close: BaseAlertDialog.Close,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Footer: AlertDialogFooter,
})
