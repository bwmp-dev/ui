import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@stack/utils'
import { Button, IconButton } from '../core/button'

export type PaginationProps = {
  /** Zero-based, to line up with TanStack Table's `pageIndex`. */
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  /** How many numbered buttons to show around the current page. */
  siblings?: number
  /** Summary text on the left, e.g. "120 devices". */
  summary?: React.ReactNode
  className?: string
  label?: string
}

type PageSlot = number | 'gap'

/**
 * Always render the first and last page plus a window around the current one,
 * collapsing the rest. Keeping the slot count stable stops the control from
 * reflowing as you page through.
 */
function pageSlots(page: number, pageCount: number, siblings: number): PageSlot[] {
  if (pageCount <= siblings * 2 + 5) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const first = 0
  const last = pageCount - 1
  const start = Math.max(first + 1, page - siblings)
  const end = Math.min(last - 1, page + siblings)

  const slots: PageSlot[] = [first]
  if (start > first + 1) slots.push('gap')
  for (let index = start; index <= end; index += 1) slots.push(index)
  if (end < last - 1) slots.push('gap')
  slots.push(last)
  return slots
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  summary,
  className,
  label = 'Pagination',
}: PaginationProps) {
  if (pageCount <= 1 && !summary) return null

  const slots = pageSlots(page, pageCount, siblings)

  return (
    <nav
      aria-label={label}
      className={cn('flex items-center justify-between gap-4', className)}
    >
      <p className="text-fg-muted text-xs">{summary}</p>

      <div className="flex items-center gap-1">
        <IconButton
          icon={ChevronLeft}
          label="Previous page"
          variant="ghost"
          size="sm"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
        />

        {slots.map((slot, index) =>
          slot === 'gap' ? (
            <span
              key={`gap-${index}`}
              aria-hidden
              className="text-fg-subtle px-1 text-xs select-none"
            >
              …
            </span>
          ) : (
            <Button
              key={slot}
              size="sm"
              variant={slot === page ? 'subtle' : 'ghost'}
              aria-current={slot === page ? 'page' : undefined}
              onClick={() => onPageChange(slot)}
              className="min-w-control-sm tabular-nums"
            >
              {slot + 1}
            </Button>
          ),
        )}

        <IconButton
          icon={ChevronRight}
          label="Next page"
          variant="ghost"
          size="sm"
          disabled={page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        />
      </div>
    </nav>
  )
}
