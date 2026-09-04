import { useState } from 'react'
import {
  AlertDialog,
  Button,
  Dialog,
  Drawer,
  DropdownMenu,
  IconButton,
  Input,
  Kbd,
  Popover,
  Tooltip,
} from '@bwmp-dev/ui'
import { Info, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

export default function OverlaysDemo() {
  const [name, setName] = useState('edge-01')

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog>
        <Dialog.Trigger render={<Button>Dialog</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Rename device</Dialog.Title>
            <Dialog.Description>Takes effect on the next check-in.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cancel</Button>} />
            <Dialog.Close render={<Button variant="primary">Save</Button>} />
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>

      <AlertDialog>
        <AlertDialog.Trigger render={<Button variant="danger">Delete</Button>} />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete {name}?</AlertDialog.Title>
            <AlertDialog.Description>
              The device stops reporting immediately. This cannot be undone.
            </AlertDialog.Description>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button>Cancel</Button>} />
            <AlertDialog.Close render={<Button variant="danger">Delete device</Button>} />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Drawer>
        <Drawer.Trigger render={<Button>Drawer</Button>} />
        <Drawer.Content side="right">
          <Drawer.Header>
            <Drawer.Title>Filters</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <p className="text-xs text-fg-muted">
              Swipe or press Escape to dismiss. Focus is trapped while it is open.
            </p>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>

      <Popover>
        <Popover.Trigger render={<Button>Popover</Button>} />
        <Popover.Content>
          <Popover.Title>Throughput</Popover.Title>
          <Popover.Description>
            Measured over the last five minutes, averaged across replicas.
          </Popover.Description>
        </Popover.Content>
      </Popover>

      <DropdownMenu>
        <DropdownMenu.Trigger render={<IconButton icon={MoreHorizontal} label="Actions" />} />
        <DropdownMenu.Content>
          <DropdownMenu.Item icon={Pencil} shortcut={<Kbd>E</Kbd>}>
            Rename
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item icon={Trash2} destructive>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      <Tooltip content="Tooltips label; they never hold instructions">
        <IconButton icon={Info} label="About" variant="ghost" />
      </Tooltip>
    </div>
  )
}
