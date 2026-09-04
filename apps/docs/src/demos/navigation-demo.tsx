import { useState } from 'react'
import { Breadcrumbs, Pagination, Tabs } from '@bwmp-dev/ui'

export default function NavigationDemo() {
  const [page, setPage] = useState(0)

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="#">Devices</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">eu-west-1</Breadcrumbs.Item>
        <Breadcrumbs.Item current>edge-01</Breadcrumbs.Item>
      </Breadcrumbs>

      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Tab value="overview">Overview</Tabs.Tab>
          <Tabs.Tab value="logs">Logs</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="overview" className="pt-3 text-sm text-fg-muted">
          Tabs switch between views of the same subject. If each tab is its own URL, use links.
        </Tabs.Panel>
        <Tabs.Panel value="logs" className="pt-3 text-sm text-fg-muted">
          The panel is only rendered when selected.
        </Tabs.Panel>
        <Tabs.Panel value="settings" className="pt-3 text-sm text-fg-muted">
          Arrow keys move between tabs; Home and End jump to the ends.
        </Tabs.Panel>
      </Tabs>

      <Tabs defaultValue="table">
        <Tabs.List variant="segmented" className="w-fit">
          <Tabs.Tab value="table">Table</Tabs.Tab>
          <Tabs.Tab value="board">Board</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Pagination page={page} pageCount={12} onPageChange={setPage} summary="240 devices" />
    </div>
  )
}
