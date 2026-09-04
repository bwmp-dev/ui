import { Badge, Code, PropertyPanel, SettingsSection, SplitPane, Switch } from '@stack/ui'
import { Stack } from './shared'

export function LayoutSection() {
  return (
    <Stack>
      <div className="h-72 overflow-hidden rounded-md border border-line">
        <SplitPane
          className="h-full"
          defaultSize={55}
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
                  <PropertyPanel.Property label="Region">
                    <Code>eu-west-1</Code>
                  </PropertyPanel.Property>
                  <PropertyPanel.Property label="Firmware">
                    <Code>2.5.10</Code>
                  </PropertyPanel.Property>
                </PropertyPanel.Group>
                <PropertyPanel.Group title="Notes">
                  <PropertyPanel.Property label="Notes" stacked>
                    Scheduled for firmware rollout in the next maintenance window.
                  </PropertyPanel.Property>
                </PropertyPanel.Group>
              </PropertyPanel>
            </aside>
          }
        />
      </div>
    </Stack>
  )
}
