/**
 * One error shape for everything the transport can produce.
 *
 * Components and error boundaries should never have to guess whether they are
 * holding a `TypeError` from a dropped connection, a 422 with field errors, or
 * a JSON parse failure. Everything that leaves `src/api/client.ts` is an
 * `ApiError`.
 */
export type ApiErrorKind =
  /** The request never completed: offline, DNS, CORS, aborted. */
  | 'network'
  /** The server answered, but with a non-2xx status. */
  | 'http'
  /** 422 or equivalent, with per-field messages. */
  | 'validation'
  /** 401/403. Handled centrally so every feature does not re-implement it. */
  | 'auth'
  /** The response body was not what the contract promised. */
  | 'parse'
  | 'unknown'

export class ApiError extends Error {
  override readonly name = 'ApiError'
  readonly kind: ApiErrorKind
  readonly status: number | undefined
  /** Field path to message, for forms. See `applyServerErrors` in @bwmp-dev/ui/form. */
  readonly fields: Record<string, string> | undefined
  /** The decoded body, kept for debugging. Never render this to a user. */
  readonly body: unknown

  constructor(
    message: string,
    options: {
      kind: ApiErrorKind
      status?: number
      fields?: Record<string, string>
      body?: unknown
      cause?: unknown
    },
  ) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause })
    this.kind = options.kind
    this.status = options.status
    this.fields = options.fields
    this.body = options.body
  }

  /** True for the failures that are worth retrying automatically. */
  get isTransient(): boolean {
    if (this.kind === 'network') return true
    return this.status !== undefined && this.status >= 500
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Copy safe to show a user.
 *
 * Deliberately vague for server faults — a stack trace or a raw 500 body is
 * noise to them and a liability to us. The real error stays on `ApiError` for
 * logging and for `<ErrorState error={…} />`, which shows details in dev.
 */
export function userMessage(error: unknown): string {
  if (!isApiError(error)) return 'Something went wrong.'

  switch (error.kind) {
    case 'network':
      return 'Could not reach the server. Check your connection and try again.'
    case 'auth':
      return 'Your session has expired. Sign in again to continue.'
    case 'validation':
      return error.message || 'Some of the values entered are not valid.'
    case 'http':
      if (error.status === 404) return 'That item no longer exists.'
      if (error.status === 409) return 'Someone else changed this first. Reload and try again.'
      if (error.status !== undefined && error.status >= 500) return 'The server had a problem.'
      return error.message || 'The request was rejected.'
    default:
      return 'Something went wrong.'
  }
}
