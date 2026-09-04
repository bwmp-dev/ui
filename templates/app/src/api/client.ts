import { buildUrl, type QueryValue } from '@bwmp-dev/utils'
import { env } from '~/lib/env'
import { mockFetch } from '~/mocks/backend'
import { ApiError } from './errors'
import type { ApiResult } from './types'

/**
 * The single transport for the whole app.
 *
 * Everything above this line speaks in typed functions and TanStack Query;
 * nothing above it sees `fetch`, status codes, or JSON parsing. Keeping that
 * boundary is what lets the backend be Go, .NET or Node without any of the
 * feature code caring.
 *
 * To swap in a generated OpenAPI client, replace the body of `request` with the
 * generated call and keep the `ApiError` contract — the rest of the app does
 * not change.
 */

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
  signal?: AbortSignal
  headers?: Record<string, string>
  /** Skip the credentials the client would normally attach. */
  anonymous?: boolean
}

type AuthTokenProvider = () => string | null

let getAuthToken: AuthTokenProvider = () => null
let onUnauthorized: (() => void) | null = null

/**
 * Wire the client to the app's auth strategy.
 *
 * Called once from the auth provider. It is a setter rather than an argument on
 * every call so features never have to thread a token through, and rather than
 * a React context so non-component code (route loaders) can use the client too.
 *
 * For cookie-session backends, leave the token provider alone and set
 * `credentials: 'include'` below instead.
 */
export function configureApiAuth(options: {
  token?: AuthTokenProvider
  onUnauthorized?: () => void
}) {
  if (options.token) getAuthToken = options.token
  onUnauthorized = options.onUnauthorized ?? null
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null
  const type = response.headers.get('content-type') ?? ''
  try {
    return type.includes('json') ? await response.json() : await response.text()
  } catch (cause) {
    throw new ApiError('The server sent a malformed response.', {
      kind: 'parse',
      status: response.status,
      cause,
    })
  }
}

/**
 * Pull field errors out of a failed response.
 *
 * Adjust the shapes here rather than in every feature — this is the one place
 * that knows what your backend's validation payload looks like.
 */
function extractFields(body: unknown): Record<string, string> | undefined {
  if (typeof body !== 'object' || body === null) return undefined

  // `{ errors: { email: "…" } }` and `{ errors: { email: ["…"] } }`
  const errors = (body as { errors?: unknown }).errors
  if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
    const fields: Record<string, string> = {}
    for (const [key, value] of Object.entries(errors)) {
      fields[key] = Array.isArray(value) ? String(value[0]) : String(value)
    }
    return Object.keys(fields).length > 0 ? fields : undefined
  }

  return undefined
}

function messageOf(body: unknown, fallback: string): string {
  if (typeof body === 'string' && body.trim()) return body
  if (typeof body === 'object' && body !== null) {
    const candidate = body as { message?: unknown; detail?: unknown; title?: unknown }
    for (const value of [candidate.message, candidate.detail, candidate.title]) {
      if (typeof value === 'string' && value.trim()) return value
    }
  }
  return fallback
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', query, body, signal, headers = {}, anonymous = false } = options

  const url = buildUrl(env.apiUrl, path, query)
  const token = anonymous ? null : getAuthToken()

  const init: RequestInit = {
    method,
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    // Harmless for token auth and required for cookie sessions.
    credentials: 'include',
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    ...(signal ? { signal } : {}),
  }

  let response: Response
  try {
    response = env.useMockApi ? await mockFetch(url, init) : await fetch(url, init)
  } catch (cause) {
    // An aborted request is a normal part of navigation, not a failure.
    if (cause instanceof DOMException && cause.name === 'AbortError') throw cause
    throw new ApiError('The request could not be sent.', { kind: 'network', cause })
  }

  const payload = await readBody(response)

  if (response.ok) return payload as T

  if (response.status === 401 || response.status === 403) {
    onUnauthorized?.()
    throw new ApiError(messageOf(payload, 'Not authorised.'), {
      kind: 'auth',
      status: response.status,
      body: payload,
    })
  }

  const fields = extractFields(payload)
  if (fields || response.status === 422) {
    throw new ApiError(messageOf(payload, 'Some values are not valid.'), {
      kind: 'validation',
      status: response.status,
      ...(fields ? { fields } : {}),
      body: payload,
    })
  }

  throw new ApiError(messageOf(payload, `Request failed with status ${response.status}.`), {
    kind: 'http',
    status: response.status,
    body: payload,
  })
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}

export type { ApiResult }
