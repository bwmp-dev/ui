import { useEffect, useEffectEvent, type RefObject } from 'react'

type Target = EventTarget | RefObject<EventTarget | null> | null | undefined

function resolve(target: Target): EventTarget | null {
  if (!target) return null
  return 'current' in target ? target.current : target
}

/**
 * Subscribe to a DOM event for the lifetime of the component.
 *
 * `handler` is read through a ref, so an inline arrow function does not cause
 * the listener to be torn down and re-attached on every render.
 *
 * ```ts
 * useEventListener('keydown', (event) => { ... })            // window
 * useEventListener('scroll', onScroll, containerRef, { passive: true })
 * ```
 */
export function useEventListener<K extends keyof WindowEventMap>(
  type: K,
  handler: (event: WindowEventMap[K]) => void,
  target?: undefined,
  options?: AddEventListenerOptions,
): void
export function useEventListener<K extends keyof DocumentEventMap>(
  type: K,
  handler: (event: DocumentEventMap[K]) => void,
  target: Document | RefObject<Document | null>,
  options?: AddEventListenerOptions,
): void
export function useEventListener<K extends keyof HTMLElementEventMap>(
  type: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  target: Target,
  options?: AddEventListenerOptions,
): void
export function useEventListener(
  type: string,
  handler: (event: Event) => void,
  target?: Target,
  options?: AddEventListenerOptions,
): void {
  // An Effect Event always sees the latest handler without the effect having to
  // re-subscribe when an inline arrow function changes identity.
  const onEvent = useEffectEvent(handler)
  const { capture, passive, once } = options ?? {}

  useEffect(() => {
    const element = target === undefined ? globalThis.window : resolve(target)
    if (!element) return

    const listener = (event: Event) => onEvent(event)
    element.addEventListener(type, listener, { capture, passive, once })
    return () => element.removeEventListener(type, listener, { capture })
    // `target` may be a ref object, whose identity is stable; a raw element is
    // compared by reference, which is the behaviour we want.
  }, [type, target, capture, passive, once])
}
