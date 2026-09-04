export type QueryValue =
  string | number | boolean | null | undefined | ReadonlyArray<string | number | boolean>

/**
 * Serialise a query object.
 *
 * `null` and `undefined` are dropped rather than encoded as the strings
 * `"null"`/`"undefined"`, which is almost never what an API wants. Arrays are
 * emitted as repeated keys (`?tag=a&tag=b`), the form every backend in this
 * stack's target set parses without configuration.
 */
export function toQueryString(params: Record<string, QueryValue>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, String(item))
    } else {
      search.append(key, String(value))
    }
  }
  return search.toString()
}

/** Join path segments with exactly one slash between each. */
export function joinPath(...segments: Array<string | number>): string {
  return segments
    .map((segment, index) => {
      const part = String(segment)
      return index === 0 ? part.replace(/\/+$/, '') : part.replace(/^\/+|\/+$/g, '')
    })
    .filter((part, index) => part !== '' || index === 0)
    .join('/')
}

export function buildUrl(
  baseUrl: string,
  path: string,
  query?: Record<string, QueryValue>,
): string {
  const url = joinPath(baseUrl, path)
  const search = query ? toQueryString(query) : ''
  return search ? `${url}${url.includes('?') ? '&' : '?'}${search}` : url
}

/** True when `href` points at a different origin, or at a non-http scheme. */
export function isExternalUrl(href: string, origin?: string): boolean {
  if (/^(mailto|tel|sms):/i.test(href)) return true
  if (!/^https?:\/\//i.test(href)) return false
  const base = origin ?? (typeof location === 'undefined' ? undefined : location.origin)
  if (!base) return true
  try {
    return new URL(href).origin !== new URL(base).origin
  } catch {
    return true
  }
}
