import { useState } from 'react'
import { createColumnHelper, useTable, type SortingState } from '@tanstack/react-table'
import {
  DataTable,
  DataTablePagination,
  defaultTableFeatures,
  selectionColumn,
  type DefaultTableFeatures,
} from '@stack/ui/table'
import { Badge, Code, EmptyState, SearchInput } from '@stack/ui'
import { formatNumber } from '@stack/utils'
import { Server } from 'lucide-react'

type Device = {
  id: string
  name: string
  status: 'online' | 'degraded' | 'offline'
  region: string
  throughput: number
}

const DEVICES: Device[] = [
  { id: '1', name: 'gateway-001', status: 'online', region: 'eu-west-1', throughput: 4210 },
  { id: '2', name: 'sensor-014', status: 'degraded', region: 'us-east-1', throughput: 880 },
  { id: '3', name: 'controller-002', status: 'offline', region: 'eu-central-1', throughput: 0 },
  { id: '4', name: 'gateway-009', status: 'online', region: 'ap-south-1', throughput: 3120 },
  { id: '5', name: 'sensor-031', status: 'online', region: 'us-west-2', throughput: 1740 },
]

const tone = { online: 'success', degraded: 'warning', offline: 'danger' } as const

const helper = createColumnHelper<DefaultTableFeatures, Device>()

const columns = helper.columns([
  helper.display(selectionColumn()),
  helper.accessor('name', {
    header: 'Name',
    cell: (info) => <span className="font-medium text-fg">{info.getValue()}</span>,
  }),
  helper.accessor('status', {
    header: 'Status',
    cell: (info) => (
      <Badge tone={tone[info.getValue()]} dot>
        {info.getValue()}
      </Badge>
    ),
  }),
  helper.accessor('region', {
    header: 'Region',
    cell: (info) => <Code>{info.getValue()}</Code>,
  }),
  helper.accessor('throughput', {
    header: 'Throughput',
    meta: { align: 'right' },
    cell: (info) => <span className="tabular-nums">{formatNumber(info.getValue())} kbps</span>,
  }),
])

/**
 * `DataTable` renders a table instance you own. Sorting, filtering and
 * pagination stay TanStack's; the component supplies the markup, the sorting
 * affordances, selection styling and the empty state.
 */
export default function DataTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [search, setSearch] = useState('')

  const table = useTable({
    features: defaultTableFeatures,
    columns,
    data: DEVICES,
    getRowId: (row) => row.id,
    state: { sorting, globalFilter: search, pagination: { pageIndex: 0, pageSize: 5 } },
    onSortingChange: setSorting,
  })

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onValueChange={setSearch}
        placeholder="Filter devices…"
        className="max-w-xs"
      />
      <DataTable
        table={table}
        label="Devices"
        empty={
          <EmptyState icon={Server} title="No devices match" description="Try a broader search." />
        }
      />
      <DataTablePagination table={table} />
    </div>
  )
}
