import {
  Badge,
  Button,
  PropertyPanel,
  SettingsSection,
  Switch,
  Toolbar,
  SearchInput,
  SplitPane,
} from '@bwmp-dev/ui'
import { useState } from 'react'
import { Filter, RefreshCw } from 'lucide-react'

export default function AppLayoutDemo() {
  const [query, setQuery] = useState('')

  return (
    <div className="h-96 overflow-hidden rounded-md border border-line">
      <Toolbar>
        <SearchInput value={query} onValueChange={setQuery} className="w-56" />
        <Toolbar.Button
          render={
            <Button size="sm" icon={Filter} variant="ghost">
              Filter
            </Button>
          }
        />
        <Toolbar.Separator />
        <Toolbar.Button
          render={
            <Button size="sm" icon={RefreshCw} variant="ghost">
              Refresh
            </Button>
          }
        />
        <Toolbar.Spacer />
        <Toolbar.Button
          render={
            <Button size="sm" variant="primary">
              New
            </Button>
          }
        />
      </Toolbar>

      <SplitPane
        className="h-[calc(100%-var(--navbar-h))]"
        defaultSize={58}
        label="Resize details"
        start={
          <div className="h-full overflow-y-auto p-4">
            <SettingsSection title="Telemetry" description="Sampling applies per device.">
              <Switch label="Collect traces" defaultChecked />
              <Switch label="Collect profiles" description="Adds about 2% CPU overhead." />
            </SettingsSection>
          </div>
        }
        end={
          <aside className="h-full overflow-y-auto border-l border-line">
            <PropertyPanel>
              <PropertyPanel.Group title="Status">
                <PropertyPanel.Property label="State">
                  <Badge tone="success" dot>
                    online
                  </Badge>
                </PropertyPanel.Property>
                <PropertyPanel.Property label="Region">eu-west-1</PropertyPanel.Property>
                <PropertyPanel.Property label="Firmware">2.5.10</PropertyPanel.Property>
              </PropertyPanel.Group>
            </PropertyPanel>
          </aside>
        }
      />
    </div>
  )
}
