/**
 * Formatting helpers.
 *
 * `Intl.*` constructors are expensive relative to the format call itself, so
 * instances are memoised by locale + options.
 */

const numberFormatters = new Map<string, Intl.NumberFormat>()
const dateFormatters = new Map<string, Intl.DateTimeFormat>()
const relativeFormatters = new Map<string, Intl.RelativeTimeFormat>()

function cached<T>(cache: Map<string, T>, key: string, create: () => T): T {
  let value = cache.get(key)
  if (!value) {
    value = create()
    cache.set(key, value)
  }
  return value
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale?: string,
): string {
  const key = `${locale ?? ''}|${JSON.stringify(options)}`
  return cached(numberFormatters, key, () => new Intl.NumberFormat(locale, options)).format(value)
}

const BYTE_UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'] as const

/** Decimal (SI) byte sizes, matching what most APIs and dashboards report. */
export function formatBytes(bytes: number, fractionDigits = 1): string {
  if (!Number.isFinite(bytes)) return '—'
  const sign = bytes < 0 ? '-' : ''
  let value = Math.abs(bytes)
  let unit = 0
  while (value >= 1000 && unit < BYTE_UNITS.length - 1) {
    value /= 1000
    unit += 1
  }
  const digits = unit === 0 ? 0 : fractionDigits
  return `${sign}${formatNumber(value, { maximumFractionDigits: digits })} ${BYTE_UNITS[unit]}`
}

export function formatDateTime(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium', timeStyle: 'short' },
  locale?: string,
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const key = `${locale ?? ''}|${JSON.stringify(options)}`
  return cached(dateFormatters, key, () => new Intl.DateTimeFormat(locale, options)).format(date)
}

const RELATIVE_STEPS = [
  { unit: 'year', ms: 31_536_000_000 },
  { unit: 'month', ms: 2_592_000_000 },
  { unit: 'week', ms: 604_800_000 },
  { unit: 'day', ms: 86_400_000 },
  { unit: 'hour', ms: 3_600_000 },
  { unit: 'minute', ms: 60_000 },
  { unit: 'second', ms: 1000 },
] as const satisfies ReadonlyArray<{ unit: Intl.RelativeTimeFormatUnit; ms: number }>

export function formatRelativeTime(
  value: Date | string | number,
  now: Date | number = Date.now(),
  locale?: string,
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const delta = date.getTime() - (now instanceof Date ? now.getTime() : now)
  const magnitude = Math.abs(delta)

  const step = RELATIVE_STEPS.find((candidate) => magnitude >= candidate.ms)
  if (!step) return 'just now'

  const formatter = cached(
    relativeFormatters,
    locale ?? '',
    () => new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }),
  )
  return formatter.format(Math.round(delta / step.ms), step.unit)
}

/** Human-readable elapsed time, e.g. `1h 12m` or `340ms`. */
export function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds)) return '—'
  if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`

  const totalSeconds = Math.round(milliseconds / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours) return `${hours}h ${minutes}m`
  if (minutes) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

/** Shorten from the middle, keeping both ends legible (ids, hashes, paths). */
export function truncateMiddle(value: string, maxLength = 24, ellipsis = '…'): string {
  if (value.length <= maxLength) return value
  const keep = maxLength - ellipsis.length
  const head = Math.ceil(keep / 2)
  const tail = Math.floor(keep / 2)
  return `${value.slice(0, head)}${ellipsis}${value.slice(value.length - tail)}`
}
