/**
 * Transport-level shapes shared by every feature.
 *
 * Anything domain-specific belongs in that feature's own `schema.ts`, not here.
 */

/** A page of results. Match this to whatever your backend actually returns. */
export type Paginated<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

/** Standard list query parameters. */
export type ListParams = {
  page?: number
  pageSize?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
}

/** Used by mutations that answer with nothing but a status. */
export type ApiResult = { ok: true }
