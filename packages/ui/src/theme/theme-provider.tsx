import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react'
import type { Appearance, Density } from '@stack/tokens'
import { useMediaQuery } from '@stack/hooks'

export type AppearanceSetting = Appearance | 'system'

export type ThemeState = {
  /** What the user chose, including `system`. */
  appearance: AppearanceSetting
  /** What is actually applied right now. */
  resolvedAppearance: Appearance
  setAppearance: (appearance: AppearanceSetting) => void
  density: Density
  setDensity: (density: Density) => void
  /** The `data-theme` brand, or `undefined` for the base tokens. */
  theme: string | undefined
  setTheme: (theme: string | undefined) => void
}

const ThemeContext = createContext<ThemeState | null>(null)

export type ThemeProviderProps = {
  children: React.ReactNode
  defaultAppearance?: AppearanceSetting
  defaultDensity?: Density
  /** Brand name written to `data-theme`. */
  theme?: string
  /**
   * localStorage key prefix. Set it per project so two apps on the same origin
   * do not fight over one preference. Pass `null` to disable persistence.
   */
  storageKey?: string | null
  /** The element the attributes are written to. Defaults to `<html>`. */
  element?: HTMLElement | null
}

type StoredPreferences = {
  appearance?: AppearanceSetting
  density?: Density
  theme?: string
}

function readStored(key: string | null): StoredPreferences {
  if (!key || typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as StoredPreferences) : {}
  } catch {
    return {}
  }
}

/**
 * The store is a module-level singleton so that reading it during render is
 * consistent across every consumer, and so the pre-hydration inline script and
 * React agree on the same source of truth.
 */
function createPreferenceStore(key: string | null) {
  let snapshot = readStored(key)
  const listeners = new Set<() => void>()

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    get: () => snapshot,
    set(next: StoredPreferences) {
      snapshot = { ...snapshot, ...next }
      if (key && typeof localStorage !== 'undefined') {
        try {
          localStorage.setItem(key, JSON.stringify(snapshot))
        } catch {
          // Storage disabled; the preference simply does not survive a reload.
        }
      }
      for (const listener of listeners) listener()
    },
  }
}

const emptyPreferences: StoredPreferences = {}

export function ThemeProvider({
  children,
  defaultAppearance = 'system',
  defaultDensity = 'comfortable',
  theme: themeProp,
  storageKey = 'stack:theme',
  element,
}: ThemeProviderProps) {
  const store = useMemo(() => createPreferenceStore(storageKey), [storageKey])
  const stored = useSyncExternalStore(store.subscribe, store.get, () => emptyPreferences)

  const appearance = stored.appearance ?? defaultAppearance
  const density = stored.density ?? defaultDensity
  const theme = themeProp ?? stored.theme

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const resolvedAppearance: Appearance =
    appearance === 'system' ? (prefersDark ? 'dark' : 'light') : appearance

  // The token CSS reads these attributes; nothing else in React needs to know.
  useEffect(() => {
    const target = element ?? document.documentElement
    target.setAttribute('data-appearance', resolvedAppearance)
    target.setAttribute('data-density', density)
    if (theme) target.setAttribute('data-theme', theme)
    else target.removeAttribute('data-theme')
  }, [element, resolvedAppearance, density, theme])

  const value = useMemo<ThemeState>(
    () => ({
      appearance,
      resolvedAppearance,
      density,
      theme,
      setAppearance: (next) => store.set({ appearance: next }),
      setDensity: (next) => store.set({ density: next }),
      setTheme: (next) => store.set(next === undefined ? {} : { theme: next }),
    }),
    [appearance, resolvedAppearance, density, theme, store],
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeState {
  const context = use(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside a <ThemeProvider>')
  return context
}

/** Convenience toggle between light and dark, leaving `system` behind. */
export function useAppearanceToggle(): () => void {
  const { resolvedAppearance, setAppearance } = useTheme()
  return useCallback(
    () => setAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark'),
    [resolvedAppearance, setAppearance],
  )
}

/**
 * Script to run before first paint so the page never flashes the wrong theme.
 *
 * Inline it in `<head>`:
 * `<script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />`
 *
 * It sets the same attributes the provider does, from the same storage key.
 */
export function themeInitScript(storageKey = 'stack:theme', defaultDensity: Density = 'comfortable') {
  return `(function(){try{var p=JSON.parse(localStorage.getItem(${JSON.stringify(storageKey)})||"{}");var a=p.appearance||"system";if(a==="system"){a=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var e=document.documentElement;e.setAttribute("data-appearance",a);e.setAttribute("data-density",p.density||${JSON.stringify(defaultDensity)});if(p.theme){e.setAttribute("data-theme",p.theme)}}catch(_){}})()`
}
