import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLatest } from './use-latest'

/**
 * A copy of `value` that only updates once it has been stable for `delay` ms.
 *
 * Use this for derived work such as search requests. Do not use it for the
 * input's own `value` — that would make the field feel laggy.
 *
 * ```ts
 * const [query, setQuery] = useState('')
 * const debouncedQuery = useDebouncedValue(query, 250)
 * ```
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    if (delay <= 0) return
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  // With no delay there is nothing to debounce; returning `value` directly
  // avoids a pointless state write on every change.
  return delay <= 0 ? value : debounced
}

export type DebouncedCallback<Args extends unknown[]> = ((...args: Args) => void) & {
  cancel: () => void
  /** Run any pending call immediately. */
  flush: () => void
}

/**
 * A stable debounced wrapper around `callback`.
 *
 * The identity never changes, so it is safe in dependency arrays; the latest
 * `callback` is always the one invoked. Pending calls are cancelled on unmount.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay = 250,
): DebouncedCallback<Args> {
  const latest = useLatest(callback)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pendingArgs = useRef<Args | undefined>(undefined)

  const cancel = useCallback(() => {
    if (timer.current !== undefined) clearTimeout(timer.current)
    timer.current = undefined
    pendingArgs.current = undefined
  }, [])

  const flush = useCallback(() => {
    if (timer.current === undefined || !pendingArgs.current) return
    const args = pendingArgs.current
    cancel()
    latest.current(...args)
  }, [cancel, latest])

  useEffect(() => cancel, [cancel])

  return useMemo(() => {
    const debounced = ((...args: Args) => {
      if (timer.current !== undefined) clearTimeout(timer.current)
      pendingArgs.current = args
      timer.current = setTimeout(() => {
        timer.current = undefined
        pendingArgs.current = undefined
        latest.current(...args)
      }, delay)
    }) as DebouncedCallback<Args>

    debounced.cancel = cancel
    debounced.flush = flush
    return debounced
  }, [delay, cancel, flush, latest])
}
