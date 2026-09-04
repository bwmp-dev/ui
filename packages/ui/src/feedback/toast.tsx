import { Toast as BaseToast } from '@base-ui/react/toast'
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@stack/utils'
import type { IconComponent } from '@stack/icons'

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

const toneIcon: Record<ToastTone, IconComponent | null> = {
  neutral: null,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
  info: Info,
}

const toneClass: Record<ToastTone, string> = {
  neutral: 'text-fg-muted',
  success: 'text-success-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
  info: 'text-info-text',
}

export type ToastProviderProps = {
  children?: React.ReactNode
  /** Auto-dismiss delay in ms. `0` keeps toasts until dismissed. */
  timeout?: number
  /** How many toasts are visible at once before older ones collapse. */
  limit?: number
}

/**
 * Mount once near the app root, above anything that calls `useToast`.
 *
 * ```tsx
 * <ToastProvider>
 *   <App />
 *   <Toaster />
 * </ToastProvider>
 * ```
 */
export function ToastProvider({ children, timeout = 5000, limit = 3 }: ToastProviderProps) {
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
    </BaseToast.Provider>
  )
}

/**
 * Queue and dismiss toasts.
 *
 * `add` returns an id you can pass to `update` or `close`, and `promise` wires
 * a pending/success/error toast to an async action in one call.
 */
export const useToast = BaseToast.useToastManager

export type ToasterProps = {
  /** Screen corner. Bottom-right stays out of the way of primary navigation. */
  position?: 'top-right' | 'bottom-right' | 'bottom-center'
  className?: string
}

const positionClass = {
  'top-right': 'top-4 right-4 items-end',
  'bottom-right': 'right-4 bottom-4 items-end',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
} as const

/** Renders the queued toasts. Mount once, inside `ToastProvider`. */
export function Toaster({ position = 'bottom-right', className }: ToasterProps) {
  const { toasts } = useToast()

  return (
    <BaseToast.Portal>
      <BaseToast.Viewport
        className={cn(
          'fixed z-[var(--z-toast)] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2',
          positionClass[position],
          className,
        )}
      >
        {toasts.map((toast) => {
          const tone = (toast.type as ToastTone | undefined) ?? 'neutral'
          const Icon = toneIcon[tone]

          return (
            <BaseToast.Root
              key={toast.id}
              toast={toast}
              className={cn(
                'surface-panel drawer-motion relative flex gap-2.5 p-3 shadow-md',
                'data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0',
                'data-[ending-style]:translate-y-1 data-[ending-style]:opacity-0',
              )}
            >
              {Icon ? (
                <Icon width={15} height={15} aria-hidden className={cn('mt-0.5 shrink-0', toneClass[tone])} />
              ) : null}

              <div className="min-w-0 flex-1">
                <BaseToast.Title className="text-ui text-fg font-medium" />
                <BaseToast.Description className="text-fg-muted mt-0.5 text-xs" />
                {toast.actionProps ? (
                  <BaseToast.Action className="text-accent-text focus-ring mt-2 rounded-xs text-xs font-medium hover:underline" />
                ) : null}
              </div>

              <BaseToast.Close
                aria-label="Dismiss"
                className="text-fg-subtle hover:text-fg hover:bg-hover focus-ring -mt-0.5 -mr-0.5 grid size-5 shrink-0 place-items-center rounded-xs"
              >
                <X size={12} aria-hidden />
              </BaseToast.Close>
            </BaseToast.Root>
          )
        })}
      </BaseToast.Viewport>
    </BaseToast.Portal>
  )
}
