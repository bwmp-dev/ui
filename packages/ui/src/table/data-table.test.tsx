import { useState } from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createColumnHelper, useTable, type SortingState } from '@tanstack/react-table'
import { EmptyState } from '../feedback/states'
import { DataTable, DataTablePagination } from './data-table'
import { defaultTableFeatures } from './features'
import { selectionColumn } from './selection-column'

type Device = { id: string; name: string; region: string }

const devices: Device[] = [
  { id: 'd1', name: 'edge-03', region: 'eu-west' },
  { id: 'd2', name: 'edge-01', region: 'us-east' },
  { id: 'd3', name: 'edge-02', region: 'eu-west' },
]

const helper = createColumnHelper<typeof defaultTableFeatures, Device>()
const columns = helper.columns([
  helper.display(selectionColumn()),
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('region', { header: 'Region', enableSorting: false }),
])

function Harness({ data = devices, isLoading = false }: { data?: Device[]; isLoading?: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useTable({
    features: defaultTableFeatures,
    columns,
    data,
    getRowId: (row) => row.id,
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <>
      <DataTable
        table={table}
        label="Devices"
        isLoading={isLoading}
        empty={<EmptyState title="No devices" description="Connect one to get started." />}
      />
      <DataTablePagination table={table} />
    </>
  )
}

function bodyNames() {
  const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
  return rows.map((row) => within(row).getAllByRole('cell')[1]?.textContent)
}

describe('DataTable', () => {
  it('renders the rows it is given', () => {
    render(<Harness />)
    expect(bodyNames()).toEqual(['edge-03', 'edge-01', 'edge-02'])
  })

  it('sorts through a real header button and reports the direction', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    const nameHeader = screen.getByRole('columnheader', { name: /Name/ })
    expect(nameHeader).toHaveAttribute('aria-sort', 'none')

    await user.click(within(nameHeader).getByRole('button'))
    await waitFor(() => expect(nameHeader).toHaveAttribute('aria-sort', 'ascending'))
    expect(bodyNames()).toEqual(['edge-01', 'edge-02', 'edge-03'])

    await user.click(within(nameHeader).getByRole('button'))
    await waitFor(() => expect(nameHeader).toHaveAttribute('aria-sort', 'descending'))
    expect(bodyNames()).toEqual(['edge-03', 'edge-02', 'edge-01'])
  })

  it('leaves columns that opt out of sorting as plain headers', () => {
    render(<Harness />)
    const regionHeader = screen.getByRole('columnheader', { name: 'Region' })
    expect(regionHeader).not.toHaveAttribute('aria-sort')
    expect(within(regionHeader).queryByRole('button')).not.toBeInTheDocument()
  })

  it('selects rows through the selection column', async () => {
    const user = userEvent.setup()
    render(<Harness />)

    await user.click(screen.getAllByRole('checkbox', { name: 'Select row' })[0]!)
    const firstRow = within(screen.getByRole('table')).getAllByRole('row')[1]
    expect(firstRow).toHaveAttribute('data-selected')

    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }))
    for (const checkbox of screen.getAllByRole('checkbox', { name: 'Select row' })) {
      expect(checkbox).toBeChecked()
    }
  })

  it('shows the empty state instead of an empty body', () => {
    render(<Harness data={[]} />)
    expect(screen.getByText('No devices')).toBeInTheDocument()
  })

  it('shows skeleton rows while loading rather than the empty state', () => {
    render(<Harness data={[]} isLoading />)
    expect(screen.queryByText('No devices')).not.toBeInTheDocument()
    expect(within(screen.getByRole('table')).getAllByRole('row').length).toBeGreaterThan(1)
  })

  it('summarises the row count in the pagination bar', () => {
    render(<Harness />)
    expect(screen.getByText('3 rows')).toBeInTheDocument()
  })
})

describe('DataTable row activation', () => {
  it('opens a row with click or Enter without swallowing checkbox clicks', async () => {
    const user = userEvent.setup()
    const onRowClick = vi.fn()

    function Clickable() {
      const table = useTable({
        features: defaultTableFeatures,
        columns,
        data: devices,
        getRowId: (row) => row.id,
      })
      return <DataTable table={table} label="Devices" onRowClick={onRowClick} />
    }

    render(<Clickable />)
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)

    await user.click(rows[0]!)
    expect(onRowClick).toHaveBeenCalledTimes(1)

    rows[1]!.focus()
    await user.keyboard('{Enter}')
    expect(onRowClick).toHaveBeenCalledTimes(2)

    // Selecting must not also activate the row.
    await user.click(within(rows[2]!).getByRole('checkbox'))
    expect(onRowClick).toHaveBeenCalledTimes(2)
  })
})
