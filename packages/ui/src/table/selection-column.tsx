import { Checkbox } from '../forms/toggles'

/**
 * The slice of the table and row APIs this column uses.
 *
 * Stated structurally rather than through `TFeatures`. TanStack derives a
 * column definition's shape from the registered features with a conditional
 * type, which cannot be satisfied from inside a generic wrapper — so the column
 * is built plainly here and typed at the call site by `helper.display()`.
 */
type SelectionTable = {
  getIsAllRowsSelected: () => boolean
  getIsSomeRowsSelected: () => boolean
  toggleAllRowsSelected: (selected: boolean) => void
}

type SelectionRow = {
  getIsSelected: () => boolean
  getCanSelect: () => boolean
  toggleSelected: (selected: boolean) => void
}

/**
 * A leading checkbox column for row selection.
 *
 * It is a plain column definition rather than a `DataTable` prop, so it lives in
 * your `columns` array where you can reorder, pin or omit it like any other
 * column. Requires `rowSelectionFeature` — a feature set without it fails to
 * type-check at the `helper.display()` call.
 *
 * ```ts
 * const helper = createColumnHelper<Features, Device>()
 * const columns = helper.columns([
 *   helper.display(selectionColumn()),
 *   helper.accessor('name', { header: 'Name' }),
 * ])
 * ```
 */
export function selectionColumn() {
  return {
    id: '__select',
    size: 36,
    enableSorting: false,
    enableHiding: false,
    header: ({ table }: { table: SelectionTable }) => (
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked === true)}
        aria-label="Select all rows"
      />
    ),
    cell: ({ row }: { row: SelectionRow }) => (
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        aria-label="Select row"
        // The row itself may be clickable; selecting must not also open it.
        onClick={(event) => event.stopPropagation()}
      />
    ),
  }
}
