import { useCallback, useState } from 'react'

export type UseControllableStateParams<T> = {
  /** When provided, the component is controlled and this value always wins. */
  value?: T | undefined
  defaultValue: T
  onChange?: ((value: T) => void) | undefined
}

/**
 * Let a component work in both controlled and uncontrolled mode.
 *
 * The returned setter accepts an updater function in either mode, and always
 * calls `onChange` — including while controlled, which is what a parent needs
 * in order to update the value it is passing down.
 *
 * The setter's identity changes with the current value, so treat it as a normal
 * dependency rather than assuming it is stable.
 *
 * ```ts
 * const [open, setOpen] = useControllableState({
 *   value: props.open,
 *   defaultValue: props.defaultOpen ?? false,
 *   onChange: props.onOpenChange,
 * })
 * ```
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateParams<T>): [T, (next: T | ((previous: T) => T)) => void] {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : uncontrolled

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(current) : next

      if (!isControlled) setUncontrolled(resolved)
      if (resolved !== current) onChange?.(resolved)
    },
    [current, isControlled, onChange],
  )

  return [current, setValue]
}
