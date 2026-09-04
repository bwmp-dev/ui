import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * `false` during SSR and the hydrating render, `true` afterwards.
 *
 * Only reach for this when markup genuinely cannot match between server and
 * client — reading `matchMedia`, rendering a locale-dependent timestamp, or
 * mounting something that touches `window` on first paint. Using it to gate an
 * entire subtree throws away server rendering.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
