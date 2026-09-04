import type { ReactNode } from 'react'
import type {
  PaginationState,
  ReactTable,
  Row,
  RowData,
  TableFeatures,
  TableState,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@stack/utils'
import { Skeleton } from '../core/primitives'
import { Pagination } from '../navigation/pagination'
import type { StackColumnMeta } from './features'

/**
 * `DataTable` renders a table instance you own.
 *
 * It deliberately does not create the table: you call `useTable` yourself, so
 * every TanStack capability — faceting, grouping, virtualisation, manual
 * server-driven state — stays reachable. What this provides is the markup,
 * the sorting affordances, selection styling, the loading skeleton and the
 * empty state.
 *
 * Sorting, selection and column visibility are all optional: the component
 * detects which of them the instance actually registered.
 *
 * ```tsx
 * const table = useTable({ features, columns, data, state, onSortingChange })
 * <DataTable table={table} isLoading={query.isPending} empty={<EmptyState … />} />
 * ```
 */
export type DataTableProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
> = {
  table: ReactTable<TFeatures, TData, TSelected>
  /** Replaces the body with skeleton rows. */
  isLoading?: boolean
  skeletonRows?: number
  /** Shown when there are no rows and `isLoading` is false. */
  empty?: ReactNode
  /** Makes rows activatable by click and by Enter. */
  onRowClick?: (row: Row<TFeatures, TData>) => void
  /** Highlights the row currently shown in a details panel. */
  isRowActive?: (row: Row<TFeatures, TData>) => boolean
  /** Keeps the header visible while the table body scrolls. */
  stickyHeader?: boolean
  className?: string
  /** Accessible name for the table. */
  label?: string
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const

function metaOf(meta: unknown): StackColumnMeta {
  return (meta ?? {}) as StackColumnMeta
}

export function DataTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>({
  table,
  isLoading = false,
  skeletonRows = 8,
  empty,
  onRowClick,
  isRowActive,
  stickyHeader = true,
  className,
  label,
}: DataTableProps<TFeatures, TData, TSelected>) {
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows
  const columnCount = headerGroups.at(-1)?.headers.length ?? 1

  return (
    <div className={cn('overflow-auto rounded-md border border-line bg-surface', className)}>
      <table className="w-full border-collapse text-ui" aria-label={label}>
        <thead
          className={cn(
            'bg-surface-sunken text-fg-muted',
            stickyHeader && 'sticky top-0 z-[var(--z-sticky)]',
          )}
        >
          {headerGroups.map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b border-line">
              {headerGroup.headers.map((header) => {
                const { column } = header
                const meta = metaOf(column.columnDef.meta)
                // `in` narrows the feature union without a cast.
                const sortable = 'getCanSort' in column && column.getCanSort()
                const sorted = 'getIsSorted' in column ? column.getIsSorted() : false
                const width = 'getSize' in header ? header.getSize() : undefined

                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    scope="col"
                    aria-sort={
                      !sortable
                        ? undefined
                        : sorted === 'asc'
                          ? 'ascending'
                          : sorted === 'desc'
                            ? 'descending'
                            : 'none'
                    }
                    style={width === undefined ? undefined : { width }}
                    className={cn(
                      'h-8 px-3 text-2xs font-medium tracking-wide whitespace-nowrap uppercase',
                      alignClass[meta.align ?? 'left'],
                      meta.hideBelowMd && 'hidden md:table-cell',
                      meta.className,
                    )}
                  >
                    {header.isPlaceholder ? null : sortable &&
                      'getToggleSortingHandler' in column ? (
                      <button
                        type="button"
                        onClick={column.getToggleSortingHandler()}
                        className="-mx-1 flex items-center gap-1 rounded-xs px-1 uppercase focus-ring hover:text-fg"
                      >
                        <table.FlexRender header={header} />
                        {sorted === 'asc' ? (
                          <ArrowUp size={11} aria-hidden />
                        ) : sorted === 'desc' ? (
                          <ArrowDown size={11} aria-hidden />
                        ) : (
                          <ChevronsUpDown size={11} aria-hidden className="opacity-40" />
                        )}
                      </button>
                    ) : (
                      <table.FlexRender header={header} />
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: skeletonRows }, (_, index) => (
              <tr key={index} className="border-b border-line-muted last:border-b-0">
                {Array.from({ length: columnCount }, (_, cellIndex) => (
                  <td key={cellIndex} className="h-row px-3">
                    <Skeleton className="h-3 w-full max-w-40" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="p-0">
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const selected = 'getIsSelected' in row && row.getIsSelected()
              const active = isRowActive?.(row) ?? false
              const cells = 'getVisibleCells' in row ? row.getVisibleCells() : row.getAllCells()

              return (
                <tr
                  key={row.id}
                  data-selected={selected || undefined}
                  data-active={active || undefined}
                  aria-selected={selected || active || undefined}
                  tabIndex={onRowClick ? 0 : undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  onKeyDown={
                    onRowClick
                      ? (event) => {
                          if (event.key !== 'Enter' && event.key !== ' ') return
                          // Space would otherwise scroll the container.
                          event.preventDefault()
                          onRowClick(row)
                        }
                      : undefined
                  }
                  className={cn(
                    'border-b border-line-muted transition-control last:border-b-0',
                    onRowClick && 'cursor-pointer focus-ring hover:bg-hover',
                    'data-[active]:bg-selected data-[selected]:bg-selected',
                  )}
                >
                  {cells.map((cell) => {
                    const meta = metaOf(cell.column.columnDef.meta)
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          'h-row px-3 align-middle text-fg',
                          alignClass[meta.align ?? 'left'],
                          meta.hideBelowMd && 'hidden md:table-cell',
                          meta.className,
                        )}
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

/**
 * The slice of the table API the pagination control uses.
 *
 * Stated structurally rather than through `TFeatures`, so a table built with
 * `rowPaginationFeature` is simply assignable and one without it fails with a
 * message that names the missing methods.
 */
export type PaginatedTable = {
  state: { pagination: PaginationState }
  getPageCount: () => number
  getRowCount: () => number
  setPageIndex: (index: number) => void
}

export type DataTablePaginationProps = {
  table: PaginatedTable
  /** Overrides the left-hand summary text. */
  summary?: ReactNode
  className?: string
}

/**
 * Page controls bound to a table's pagination slice.
 *
 * If pagination lives on the server, drive the table with `manualPagination`
 * and `rowCount`; this component does not change.
 */
export function DataTablePagination({ table, summary, className }: DataTablePaginationProps) {
  const rowCount = table.getRowCount()

  return (
    <Pagination
      page={table.state.pagination.pageIndex}
      pageCount={table.getPageCount()}
      onPageChange={(page) => table.setPageIndex(page)}
      summary={summary ?? `${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`}
      className={className}
    />
  )
}
