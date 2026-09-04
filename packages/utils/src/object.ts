/**
 * Typed wrappers around the `Object.*` statics.
 *
 * These exist only because the built-ins widen keys to `string`, which forces a
 * cast at every call site. They add no runtime behaviour.
 */

export function keys<T extends object>(source: T): Array<Extract<keyof T, string>> {
  return Object.keys(source) as Array<Extract<keyof T, string>>
}

export function entries<T extends object>(
  source: T,
): Array<[Extract<keyof T, string>, T[Extract<keyof T, string>]]> {
  return Object.entries(source) as Array<[Extract<keyof T, string>, T[Extract<keyof T, string>]]>
}

export function pick<T extends object, K extends keyof T>(
  source: T,
  wanted: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of wanted) {
    if (key in source) result[key] = source[key]
  }
  return result
}

export function omit<T extends object, K extends keyof T>(
  source: T,
  unwanted: readonly K[],
): Omit<T, K> {
  const result = { ...source }
  for (const key of unwanted) delete result[key]
  return result
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
