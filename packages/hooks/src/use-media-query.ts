import { useCallback, useSyncExternalStore } from 'react'

/**
 * Track a CSS media query.
 *
 * Backed by `useSyncExternalStore` rather than an effect, so the first client
 * render already has the right answer and there is no post-hydration flash.
 * During SSR it returns `false`; pass `serverFallback` when a different default
 * produces less layout shift.
 *
 * ```ts
 * const isDesktop = useMediaQuery('(min-width: 64rem)')
 * ```
 */
export function useMediaQuery(query: string, serverFallback = false): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverFallback,
  )
}

/** True when the user has asked the OS to minimise animation. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
