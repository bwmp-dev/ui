import { useEffect, useRef } from 'react'

/**
 * A ref that holds the most recent committed `value`.
 *
 * The escape hatch for reading changing props from a timer or a long-lived
 * subscription without re-creating it on every render. The write happens in an
 * effect, so the ref is only safe to read after commit — never during render.
 *
 * For work that runs inside an effect, prefer React's `useEffectEvent`, which
 * expresses the same intent without a ref.
 */
export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref
}
