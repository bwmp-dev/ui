import { useState } from 'react'
import {
  AlertDialog,
  Button,
  CommandMenu,
  ContextMenu,
  Dialog,
  Drawer,
  DropdownMenu,
  IconButton,
  Input,
  Kbd,
  Popover,
  Tooltip,
  type CommandAction,
} from '@stack/ui'
import { Copy, Info, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useClipboard } from '@stack/hooks'
import { Row, Stack } from './shared'

export function OverlaysSection() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { copy, copied } = useClipboard()

  const actions: CommandAction[] = [
    { id: 'a', label: 'Go to devices', group: 'Navigation', onSelect: () => {} },
    { id: 'b', label: 'Go to settings', group: 'Navigation', onSelect: () => {} },
    { id: 'c', label: 'Sign out', group: 'Account', onSelect: () => {} },
  ]

  return (
    <Stack>
      <Row label="Modal">
        <Dialog>
          <Dialog.Trigger render={<Button>Dialog</Button>} />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Rename device</Dialog.Title>
              <Dialog.Description>Takes effect on the next check-in.</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
              <Input defaultValue="edge-01" />
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Close render={<Button>Cancel</Button>} />
              <Dialog.Close render={<Button variant="primary">Save</Button>} />
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog>

        <AlertDialog>
          <AlertDialog.Trigger render={<Button variant="danger">Alert dialog</Button>} />
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Delete edge-01?</AlertDialog.Title>
              <AlertDialog.Description>This cannot be undone.</AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Close render={<Button>Cancel</Button>} />
              <AlertDialog.Close render={<Button variant="danger">Delete</Button>} />
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog>

        <Drawer>
          <Drawer.Trigger render={<Button>Drawer</Button>} />
          <Drawer.Content side="right">
            <Drawer.Header>
              <Drawer.Title>Filters</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="text-xs text-fg-muted">
              Swipe or press Escape to dismiss.
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>

        <Button onClick={() => setPaletteOpen(true)}>Command palette</Button>
        <CommandMenu open={paletteOpen} onOpenChange={setPaletteOpen} actions={actions} />
      </Row>

      <Row label="Anchored">
        <Popover>
          <Popover.Trigger render={<Button>Popover</Button>} />
          <Popover.Content>
            <Popover.Title>Throughput</Popover.Title>
            <Popover.Description>Averaged across replicas over five minutes.</Popover.Description>
          </Popover.Content>
        </Popover>

        <DropdownMenu>
          <DropdownMenu.Trigger render={<IconButton icon={MoreHorizontal} label="Actions" />} />
          <DropdownMenu.Content>
            <DropdownMenu.GroupLabel>Device</DropdownMenu.GroupLabel>
            <DropdownMenu.Item icon={Pencil} shortcut={<Kbd>E</Kbd>}>
              Rename
            </DropdownMenu.Item>
            <DropdownMenu.CheckboxItem defaultChecked>Show offline</DropdownMenu.CheckboxItem>
            <DropdownMenu.Separator />
            <DropdownMenu.Item icon={Trash2} destructive>
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>

        <Tooltip content="Tooltips label; they never hold instructions">
          <IconButton icon={Info} label="About" variant="ghost" />
        </Tooltip>

        <IconButton
          icon={Copy}
          label={copied ? 'Copied' : 'Copy id'}
          variant="ghost"
          onClick={() => void copy('dev_0015')}
        />
      </Row>

      <ContextMenu>
        <ContextMenu.Trigger
          render={
            <div className="grid h-24 place-items-center rounded-md border border-dashed border-line bg-surface-sunken text-xs text-fg-muted" />
          }
        >
          Right-click anywhere in this box
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item icon={Pencil}>Rename</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item icon={Trash2} destructive>
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </Stack>
  )
}
