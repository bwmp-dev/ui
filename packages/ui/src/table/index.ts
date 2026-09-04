/**
 * @stack/ui/table
 *
 * Separate entry point because it carries `@tanstack/react-table` as an
 * optional peer dependency — nothing in `@stack/ui` imports it.
 */
export { DataTable, DataTablePagination } from './data-table'
export type { DataTableProps, DataTablePaginationProps, PaginatedTable } from './data-table'
export { selectionColumn } from './selection-column'
export { defaultTableFeatures } from './features'
export type { DefaultTableFeatures, StackColumnMeta } from './features'
