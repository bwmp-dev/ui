import { useMemo, useState } from 'react'
import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useTable, type SortingState } from '@tanstack/react-table'
import { DataTable, DataTablePagination, defaultTableFeatures } from '@bwmp-dev/ui/table'
import { Button, EmptyState, ErrorState, PageHeader, SplitPane } from '@bwmp-dev/ui'
import { useDebouncedValue, useMediaQuery } from '@bwmp-dev/hooks'
import { Plus, Server } from 'lucide-react'
import { z } from 'zod'
import { userMessage } from '~/api/errors'
import { deviceColumns } from '~/features/devices/components/device-columns'
import { DeviceDetails } from '~/features/devices/components/device-details'
import { DeviceFilters } from '~/features/devices/components/device-filters'
import { emptyDeviceFilters } from '~/features/devices/filters'
import { DeviceFormDialog } from '~/features/devices/components/device-form'
import { deviceListQuery, prefetchDeviceList } from '~/features/devices/queries'
import { deviceStatusSchema } from '~/features/devices/schema'

/**
 * Filters, sorting, paging and the selected row all live in the URL.
 *
 * That makes any view of this page linkable, restores it on reload, and gives
 * the back button the behaviour people expect. It also means the loader can
 * prefetch exactly the data the page is about to request.
 */
const searchSchema = z.object({
  q: z.string().default(''),
  status: z.array(deviceStatusSchema).default([]),
  region: z.array(z.string()).default([]),
  sort: z.string().default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().int().min(0).default(0),
  selected: z.string().optional(),
})

type DeviceSearch = z.infer<typeof searchSchema>

/**
 * Values equal to these are removed from the URL, so the default view is a
 * clean `/devices` instead of a query string full of empty defaults.
 */
const searchDefaults = {
  q: '',
  status: [],
  region: [],
  sort: 'name',
  order: 'asc',
  page: 0,
} satisfies Partial<DeviceSearch>

const PAGE_SIZE = 20

function toListParams(search: DeviceSearch) {
  return {
    search: search.q,
    status: search.status,
    region: search.region,
    sort: search.sort,
    order: search.order,
    page: search.page,
    pageSize: PAGE_SIZE,
  }
}

export const Route = createFileRoute('/_app/devices')({
  validateSearch: searchSchema,
  search: { middlewares: [stripSearchParams(searchDefaults)] },
  // Only the parts of `search` the data depends on; `selected` must not refetch.
  loaderDeps: ({ search }) => toListParams(search),
  loader: ({ context, deps }) => prefetchDeviceList(context.queryClient, deps),
  component: DevicesPage,
})

function DevicesPage() {
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const [creating, setCreating] = useState(false)

  // Typing should not fire a request per keystroke, but it must still be in the
  // URL immediately so the field stays responsive and shareable.
  const debouncedQuery = useDebouncedValue(search.q, 250)
  const params = useMemo(
    () => toListParams({ ...search, q: debouncedQuery }),
    [search, debouncedQuery],
  )

  const devices = useQuery(deviceListQuery(params))
  const isWide = useMediaQuery('(min-width: 72rem)', true)

  const sorting = useMemo<SortingState>(
    () => [{ id: search.sort, desc: search.order === 'desc' }],
    [search.sort, search.order],
  )

  const table = useTable({
    features: defaultTableFeatures,
    columns: deviceColumns,
    data: devices.data?.items ?? [],
    getRowId: (row) => row.id,
    // The server does the work; the table only renders the page it is given.
    manualSorting: true,
    manualPagination: true,
    rowCount: devices.data?.total ?? 0,
    state: {
      sorting,
      pagination: { pageIndex: search.page, pageSize: PAGE_SIZE },
    },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      const first = next[0]
      void navigate({
        search: (previous) => ({
          ...previous,
          sort: first?.id ?? 'name',
          order: first?.desc ? 'desc' : 'asc',
          page: 0,
        }),
      })
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: search.page, pageSize: PAGE_SIZE }
      const next = typeof updater === 'function' ? updater(current) : updater
      void navigate({ search: (previous) => ({ ...previous, page: next.pageIndex }) })
    },
  })

  const selectedDevice = devices.data?.items.find((device) => device.id === search.selected) ?? null

  const setSelected = (id: string | undefined) =>
    void navigate({ search: (previous) => ({ ...previous, selected: id }) })

  const filtersActive = search.q !== '' || search.status.length > 0 || search.region.length > 0

  const tableArea = (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <PageHeader
        title="Devices"
        description="Every device reporting to this workspace."
        actions={
          <Button variant="primary" icon={Plus} onClick={() => setCreating(true)}>
            New device
          </Button>
        }
        below={
          <DeviceFilters
            value={{ search: search.q, status: search.status, region: search.region }}
            onChange={(next) =>
              void navigate({
                search: (previous) => ({
                  ...previous,
                  q: next.search,
                  status: next.status,
                  region: next.region,
                  page: 0,
                }),
              })
            }
          />
        }
      />

      {devices.isError ? (
        <ErrorState
          title="Could not load devices"
          description={userMessage(devices.error)}
          error={devices.error}
          onRetry={() => void devices.refetch()}
        />
      ) : (
        <>
          <DataTable
            table={table}
            label="Devices"
            className="min-h-0 flex-1"
            isLoading={devices.isPending}
            onRowClick={(row) => setSelected(row.id)}
            isRowActive={(row) => row.id === search.selected}
            empty={
              filtersActive ? (
                <EmptyState
                  icon={Server}
                  title="No devices match these filters"
                  description="Try a broader search or clear the filters."
                  action={
                    <Button
                      size="sm"
                      onClick={() =>
                        void navigate({
                          search: (previous) => ({
                            ...previous,
                            ...{ q: emptyDeviceFilters.search, status: [], region: [] },
                            page: 0,
                          }),
                        })
                      }
                    >
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <EmptyState
                  icon={Server}
                  title="No devices yet"
                  description="Register your first device to start collecting telemetry."
                  action={
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Plus}
                      onClick={() => setCreating(true)}
                    >
                      New device
                    </Button>
                  }
                />
              )
            }
          />

          <DataTablePagination table={table} summary={`${devices.data?.total ?? 0} devices`} />
        </>
      )}
    </div>
  )

  return (
    <>
      {isWide ? (
        <SplitPane
          className="h-full"
          defaultSize={68}
          minSize={45}
          maxSize={82}
          label="Resize device details"
          start={tableArea}
          end={
            <aside className="h-full border-l border-line">
              <DeviceDetails device={selectedDevice} onDeleted={() => setSelected(undefined)} />
            </aside>
          }
        />
      ) : (
        tableArea
      )}

      <DeviceFormDialog open={creating} onOpenChange={setCreating} />
    </>
  )
}
