import { useState } from 'react'
import { Button, CommandMenu, Kbd, type CommandAction } from '@stack/ui'
import { useHotkey } from '@stack/hooks'
import { Contrast, LogOut, Server, Settings } from 'lucide-react'

export default function CommandMenuDemo() {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<string | null>(null)

  useHotkey('mod+k', () => setOpen(true), { enableInFormFields: true })

  const actions: CommandAction[] = [
    {
      id: 'devices',
      label: 'Go to devices',
      group: 'Navigation',
      icon: Server,
      keywords: ['fleet'],
      onSelect: () => setLast('devices'),
    },
    {
      id: 'settings',
      label: 'Go to settings',
      group: 'Navigation',
      icon: Settings,
      onSelect: () => setLast('settings'),
    },
    {
      id: 'theme',
      label: 'Toggle dark mode',
      group: 'Preferences',
      icon: Contrast,
      onSelect: () => setLast('theme'),
    },
    {
      id: 'signout',
      label: 'Sign out',
      group: 'Account',
      icon: LogOut,
      onSelect: () => setLast('sign out'),
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={() => setOpen(true)}>
        Open palette <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Button>
      {last ? <span className="text-xs text-fg-muted">Ran: {last}</span> : null}
      <CommandMenu open={open} onOpenChange={setOpen} actions={actions} />
    </div>
  )
}
