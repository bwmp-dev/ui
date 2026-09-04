import { useState } from 'react'
import { AlertDialog, Badge, Button, Code, EmptyState, PropertyPanel, useToast } from '@bwmp-dev/ui'
import { formatDateTime, formatNumber, formatRelativeTime } from '@bwmp-dev/utils'
import { MousePointerSquareDashed, Pencil, Trash2 } from 'lucide-react'
import { userMessage } from '~/api/errors'
import { useAuth } from '~/features/auth/auth-context'
import { canEdit } from '~/features/auth/schema'
import { statusTone, type Device } from '../schema'
import { useDeleteDevice } from '../queries'
import { DeviceFormDialog } from './device-form'

export type DeviceDetailsProps = {
  device: Device | null
  onDeleted?: () => void
}

/**
 * The right-hand pane of the devices page.
 *
 * It renders from the row that is already in the cache rather than fetching
 * again — selecting a row should not cost a round trip.
 */
export function DeviceDetails({ device, onDeleted }: DeviceDetailsProps) {
  const { user } = useAuth()
  const toast = useToast()
  const remove = useDeleteDevice()
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  if (!device) {
    return (
      <EmptyState
        className="h-full"
        icon={MousePointerSquareDashed}
        title="No device selected"
        description="Choose a row to see its configuration and recent activity."
      />
    )
  }

  const editable = canEdit(user)

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-3 border-b border-line-muted px-3 py-2.5">
        <div className="min-w-0">
          <h2 className="truncate text-ui font-semibold text-fg">{device.name}</h2>
          <p className="mt-0.5 text-2xs text-fg-subtle">{device.id}</p>
        </div>
        {editable ? (
          <div className="flex shrink-0 items-center gap-1">
            <Button size="xs" icon={Pencil} onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button
              size="xs"
              variant="ghost"
              icon={Trash2}
              onClick={() => setConfirming(true)}
              aria-label={`Delete ${device.name}`}
            />
          </div>
        ) : null}
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <PropertyPanel>
          <PropertyPanel.Group title="Status">
            <PropertyPanel.Property label="State">
              <Badge tone={statusTone[device.status]} dot>
                {device.status}
              </Badge>
            </PropertyPanel.Property>
            <PropertyPanel.Property label="Last seen">
              <span title={formatDateTime(device.lastSeen)}>
                {formatRelativeTime(device.lastSeen)}
              </span>
            </PropertyPanel.Property>
            <PropertyPanel.Property label="Throughput">
              {formatNumber(device.throughputKbps)} kbps
            </PropertyPanel.Property>
          </PropertyPanel.Group>

          <PropertyPanel.Group title="Configuration">
            <PropertyPanel.Property label="Kind">{device.kind}</PropertyPanel.Property>
            <PropertyPanel.Property label="Region">
              <Code>{device.region}</Code>
            </PropertyPanel.Property>
            <PropertyPanel.Property label="Firmware">
              <Code>{device.firmware}</Code>
            </PropertyPanel.Property>
          </PropertyPanel.Group>

          {device.notes ? (
            <PropertyPanel.Group title="Notes">
              <PropertyPanel.Property label="Notes" stacked>
                {device.notes}
              </PropertyPanel.Property>
            </PropertyPanel.Group>
          ) : null}
        </PropertyPanel>
      </div>

      <DeviceFormDialog open={editing} onOpenChange={setEditing} device={device} />

      <AlertDialog open={confirming} onOpenChange={setConfirming}>
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete {device.name}?</AlertDialog.Title>
            <AlertDialog.Description>
              The device stops reporting immediately and its history is removed. This cannot be
              undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button>Cancel</Button>} />
            <Button
              variant="danger"
              loading={remove.isPending}
              onClick={async () => {
                try {
                  await remove.mutateAsync(device.id)
                  toast.add({ title: 'Device deleted', description: device.name })
                  setConfirming(false)
                  onDeleted?.()
                } catch (error) {
                  toast.add({ title: userMessage(error), type: 'danger' })
                }
              }}
            >
              Delete device
            </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </div>
  )
}
