import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_includesString,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table'

/**
 * A ready-made feature set covering what a typical dashboard table needs:
 * sorting, per-column and global filtering, pagination, row selection and
 * column visibility.
 *
 * TanStack Table v9 only ships the features you register, so this is a
 * convenience, not a requirement — a table that just sorts should compose its
 * own smaller set and keep the rest out of the bundle:
 *
 * ```ts
 * const features = tableFeatures({
 *   rowSortingFeature,
 *   sortedRowModel: createSortedRowModel(),
 *   sortFns: { alphanumeric: sortFn_alphanumeric },
 * })
 * ```
 */
export const defaultTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  columnVisibilityFeature,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  filterFns: {
    includesString: filterFn_includesString,
    equals: filterFn_equals,
    arrIncludesSome: filterFn_arrIncludesSome,
  },
})

export type DefaultTableFeatures = typeof defaultTableFeatures

/**
 * Column-level display hints read by `DataTable`.
 *
 * Declare it on your feature set so `meta` is typed at the column definition:
 * `tableFeatures({ …, columnMeta: {} as StackColumnMeta })`.
 */
export type StackColumnMeta = {
  align?: 'left' | 'center' | 'right'
  /** Applied to both the header cell and the body cells. */
  className?: string
  /** Hides the column below the `md` breakpoint. */
  hideBelowMd?: boolean
}
