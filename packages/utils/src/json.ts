export type JsonResult<T> = { ok: true; value: T } | { ok: false; error: Error }

/**
 * Parse without throwing.
 *
 * The error is returned rather than swallowed, so callers can log it during
 * development instead of silently falling back to a default.
 */
export function safeJsonParse<T = unknown>(text: string): JsonResult<T> {
  try {
    return { ok: true, value: JSON.parse(text) as T }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

/** Stringify without throwing on cyclic structures or BigInt values. */
export function safeJsonStringify(value: unknown, space?: number): JsonResult<string> {
  try {
    return { ok: true, value: JSON.stringify(value, null, space) ?? 'undefined' }
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error : new Error(String(error)) }
  }
}

export function parseJsonOr<T>(text: string | null | undefined, fallback: T): T {
  if (text == null) return fallback
  const result = safeJsonParse<T>(text)
  return result.ok ? result.value : fallback
}
