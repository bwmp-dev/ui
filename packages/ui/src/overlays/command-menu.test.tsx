import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CommandMenu, type CommandAction } from './command-menu'

function makeActions(run: (id: string) => void): CommandAction[] {
  return [
    { id: 'devices', label: 'Go to devices', group: 'Navigation', onSelect: () => run('devices') },
    { id: 'billing', label: 'Go to billing', group: 'Navigation', onSelect: () => run('billing') },
    {
      id: 'deploy',
      label: 'Deploy latest build',
      group: 'Actions',
      keywords: ['ship', 'release'],
      onSelect: () => run('deploy'),
    },
  ]
}

function Harness({ run }: { run: (id: string) => void }) {
  const [open, setOpen] = useState(true)
  return <CommandMenu open={open} onOpenChange={setOpen} actions={makeActions(run)} />
}

describe('CommandMenu', () => {
  it('lists grouped actions when it opens', async () => {
    render(<Harness run={vi.fn()} />)

    expect(await screen.findByRole('option', { name: /Go to devices/ })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /Deploy latest build/ })).toBeInTheDocument()
    expect(screen.getByText('Navigation')).toBeInTheDocument()
  })

  it('filters as you type', async () => {
    const user = userEvent.setup()
    render(<Harness run={vi.fn()} />)

    await user.type(await screen.findByRole('combobox'), 'billing')

    await waitFor(() =>
      expect(screen.queryByRole('option', { name: /Go to devices/ })).not.toBeInTheDocument(),
    )
    expect(screen.getByRole('option', { name: /Go to billing/ })).toBeInTheDocument()
  })

  it('matches on keywords, not just the visible label', async () => {
    const user = userEvent.setup()
    render(<Harness run={vi.fn()} />)

    await user.type(await screen.findByRole('combobox'), 'ship')

    expect(await screen.findByRole('option', { name: /Deploy latest build/ })).toBeInTheDocument()
  })

  it('runs the highlighted action on Enter and closes', async () => {
    const user = userEvent.setup()
    const run = vi.fn()
    render(<Harness run={run} />)

    const input = await screen.findByRole('combobox')
    await user.type(input, 'deploy')
    await screen.findByRole('option', { name: /Deploy latest build/ })
    await user.keyboard('{ArrowDown}{Enter}')

    await waitFor(() => expect(run).toHaveBeenCalledWith('deploy'))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows the empty message when nothing matches', async () => {
    const user = userEvent.setup()
    render(<Harness run={vi.fn()} />)

    await user.type(await screen.findByRole('combobox'), 'zzzz')
    expect(await screen.findByText('No matching commands.')).toBeInTheDocument()
  })
})
