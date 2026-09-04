import { useState } from 'react'

/**
 * The value from the previous render, or `undefined` on the first one.
 *
 * Tracked in state and adjusted during render — the pattern React documents for
 * deriving from a changed prop — rather than in a ref, which cannot be read
 * during render safely.
 *
 * If you are comparing against the previous value to derive other state, prefer
 * computing that value during render instead; it is almost always simpler.
 */
export function usePrevious<T>(value: T): T | undefined {
  const [tracked, setTracked] = useState<{ current: T; previous: T | undefined }>({
    current: value,
    previous: undefined,
  })

  if (tracked.current !== value) {
    setTracked({ current: value, previous: tracked.current })
  }

  return tracked.current === value ? tracked.previous : tracked.current
}
