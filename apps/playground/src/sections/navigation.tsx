import { useState } from 'react'
import { Badge, Button, FilterBar, Pagination, SearchInput, Tabs, Toolbar } from '@stack/ui'
import { Plus } from 'lucide-react'
import { Stack } from './shared'

export function NavigationSection() {
  const [page, setPage] = useState(0)
  const [query, setQuery] = useState('')

  return (
    <Stack>
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview" className="pt-3 text-xs text-fg-muted">
          Underlined tabs, for page-level sections.
        </Tabs.Panel>
        <Tabs.Panel value="logs" className="pt-3 text-xs text-fg-muted">
          Panels render only when selected.
        </Tabs.Panel>
        <Tabs.Panel value="settings" className="pt-3 text-xs text-fg-muted">
          Arrow keys move; Home and End jump.
        </Tabs.Panel>
      </Tabs>

      <Tabs defaultValue="table">
        <Tabs.List variant="segmented" className="w-fit">
          <Tabs.Tab value="table">Table</Tabs.Tab>
          <Tabs.Tab value="board">Board</Tabs.Tab>
          <Tabs.Tab value="timeline">Timeline</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <div className="rounded-md border border-line">
        <Toolbar>
          <SearchInput value={query} onValueChange={setQuery} className="w-56" />
          <Toolbar.Separator />
          <Toolbar.Button
            render={
              <Button size="sm" variant="ghost">
                Export
              </Button>
            }
          />
          <Toolbar.Spacer />
          <Toolbar.Button
            render={
              <Button size="sm" variant="primary" icon={Plus}>
                New
              </Button>
            }
          />
        </Toolbar>
        <div className="p-3">
          <FilterBar activeCount={query ? 1 : 0} onClear={() => setQuery('')}>
            <Badge variant="outline">status: online</Badge>
            <Badge variant="outline">region: eu-west-1</Badge>
          </FilterBar>
        </div>
      </div>

      <Pagination page={page} pageCount={12} onPageChange={setPage} summary="240 devices" />
    </Stack>
  )
}
