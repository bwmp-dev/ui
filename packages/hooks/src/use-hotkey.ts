import { useMemo } from 'react'
import { useEventListener } from './use-event-listener'

export type HotkeyOptions = {
  /** Fire even when focus is inside an input, textarea or contenteditable. */
  enableInFormFields?: boolean
  /** Call `preventDefault()` when the hotkey matches. Defaults to true. */
  preventDefault?: boolean
  enabled?: boolean
  /** Defaults to `window`. */
  target?: Document | HTMLElement | null
}

type ParsedHotkey = {
  key: string
  mod: boolean
  ctrl: boolean
  meta: boolean
  alt: boolean
  shift: boolean
}

/**
 * `mod` resolves to Command on Apple platforms and Control everywhere else,
 * which is what users of a keyboard-driven app expect.
 */
function isApplePlatform(): boolean {
  if (typeof navigator === 'undefined') return false
  return /mac|iphone|ipad|ipod/i.test(navigator.userAgent)
}

function parse(combo: string): ParsedHotkey {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean)

  const parsed: ParsedHotkey = {
    key: '',
    mod: false,
    ctrl: false,
    meta: false,
    alt: false,
    shift: false,
  }

  for (const part of parts) {
    if (part === 'mod') parsed.mod = true
    else if (part === 'ctrl' || part === 'control') parsed.ctrl = true
    else if (part === 'meta' || part === 'cmd' || part === 'command') parsed.meta = true
    else if (part === 'alt' || part === 'option') parsed.alt = true
    else if (part === 'shift') parsed.shift = true
    else parsed.key = part
  }

  return parsed
}

function isFormField(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

/**
 * Bind a keyboard shortcut.
 *
 * Accepts one combo or a list of them. `mod` maps to Command/Control.
 *
 * ```ts
 * useHotkey('mod+k', () => setCommandMenuOpen(true))
 * useHotkey(['escape'], close, { enableInFormFields: true })
 * ```
 */
export function useHotkey(
  combo: string | readonly string[],
  handler: (event: KeyboardEvent) => void,
  options: HotkeyOptions = {},
): void {
  const {
    enableInFormFields = false,
    preventDefault = true,
    enabled = true,
    target = null,
  } = options

  const comboKey = Array.isArray(combo) ? combo.join('|') : (combo as string)
  const parsed = useMemo(() => comboKey.split('|').map(parse), [comboKey])

  useEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (!enabled) return
      if (!enableInFormFields && isFormField(event.target)) return

      const apple = isApplePlatform()
      const pressed = event.key.toLowerCase()

      const match = parsed.some((hotkey) => {
        if (hotkey.key && hotkey.key !== pressed) return false
        const wantsCtrl = hotkey.ctrl || (hotkey.mod && !apple)
        const wantsMeta = hotkey.meta || (hotkey.mod && apple)
        return (
          event.ctrlKey === wantsCtrl &&
          event.metaKey === wantsMeta &&
          event.altKey === hotkey.alt &&
          event.shiftKey === hotkey.shift
        )
      })

      if (!match) return
      if (preventDefault) event.preventDefault()
      handler(event)
    },
    target ?? undefined,
  )
}
