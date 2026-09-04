import { useCallback, useSyncExternalStore } from 'react'

type Serializer<T> = {
  parse: (raw: string) => T
  stringify: (value: T) => string
}

const jsonSerializer = { parse: JSON.parse, stringify: JSON.stringify } as Serializer<never>

/**
 * localStorage is a shared mutable store, so every hook instance for the same
 * key has to hear about a write. `storage` only fires in *other* tabs, so we
 * keep our own subscriber set for same-document updates.
 */
const listeners = new Map<string, Set<() => void>>()

function subscribeToKey(key: string, onChange: () => void) {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(onChange)

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) onChange()
  }
  window.addEventListener('storage', onStorage)

  return () => {
    set.delete(onChange)
    if (set.size === 0) listeners.delete(key)
    window.removeEventListener('storage', onStorage)
  }
}

function notify(key: string) {
  for (const listener of listeners.get(key) ?? []) listener()
}

export type UseLocalStorageOptions<T> = {
  serializer?: Serializer<T>
}

/**
 * Read and write a JSON value in `localStorage`, staying in sync with other
 * hook instances and other browser tabs.
 *
 * Returns the initial value during SSR and on the first client render, so the
 * markup matches; the stored value appears immediately after hydration.
 *
 * ```ts
 * const [sidebarOpen, setSidebarOpen] = useLocalStorage('sidebar:open', true)
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, (value: T | ((previous: T) => T)) => void, () => void] {
  const serializer = (options.serializer ?? jsonSerializer) as Serializer<T>

  const subscribe = useCallback((onChange: () => void) => subscribeToKey(key, onChange), [key])

  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  }, [key])

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null)

  let value = initialValue
  if (raw !== null) {
    try {
      value = serializer.parse(raw)
    } catch {
      value = initialValue
    }
  }

  const setValue = useCallback(
    (next: T | ((previous: T) => T)) => {
      let current = initialValue
      try {
        const stored = window.localStorage.getItem(key)
        if (stored !== null) current = serializer.parse(stored)
      } catch {
        current = initialValue
      }

      const resolved = typeof next === 'function' ? (next as (p: T) => T)(current) : next

      try {
        window.localStorage.setItem(key, serializer.stringify(resolved))
      } catch {
        // Quota exceeded or storage disabled; state simply does not persist.
      }
      notify(key)
    },
    [key, initialValue, serializer],
  )

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
    notify(key)
  }, [key])

  return [value, setValue, remove]
}
