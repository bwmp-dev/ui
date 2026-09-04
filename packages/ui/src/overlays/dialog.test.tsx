import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from '../core/button'
import { Dialog } from './dialog'
import { AlertDialog } from './alert-dialog'

function Example({ onOpenChange }: { onOpenChange?: (open: boolean) => void } = {}) {
  return (
    <div>
      <button type="button">before</button>
      <Dialog {...(onOpenChange ? { onOpenChange } : {})}>
        <Dialog.Trigger render={<Button>Rename</Button>} />
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Rename environment</Dialog.Title>
            <Dialog.Description>Choose a new name.</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body>
            <input aria-label="Name" />
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cancel</Button>} />
            <Button variant="primary">Save</Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog>
    </div>
  )
}

describe('Dialog', () => {
  it('is labelled and described by its title and description', async () => {
    const user = userEvent.setup()
    render(<Example />)
    await user.click(screen.getByRole('button', { name: 'Rename' }))

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveAccessibleName('Rename environment')
    expect(dialog).toHaveAccessibleDescription('Choose a new name.')
  })

  it('traps Tab inside the dialog while it is open', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const outside = screen.getByRole('button', { name: 'before' })

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    await screen.findByRole('dialog')

    // The page behind a modal is removed from the accessibility tree.
    expect(screen.queryByRole('button', { name: 'before' })).not.toBeInTheDocument()

    // Cycle past the end of the dialog's focusable elements several times;
    // focus must never reach the page behind it.
    for (let step = 0; step < 8; step += 1) {
      await user.tab()
      expect(document.activeElement).not.toBe(outside)
      expect(document.activeElement).not.toBe(document.body)
    }
  })

  it('closes on Escape and restores focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<Example />)
    const trigger = screen.getByRole('button', { name: 'Rename' })

    await user.click(trigger)
    await screen.findByRole('dialog')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  it('reports open state changes to the caller', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(<Example onOpenChange={onOpenChange} />)

    await user.click(screen.getByRole('button', { name: 'Rename' }))
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything())
  })
})

describe('AlertDialog', () => {
  it('ignores an outside press but still closes on Escape', async () => {
    const user = userEvent.setup()
    render(
      <AlertDialog>
        <AlertDialog.Trigger render={<Button variant="danger">Delete</Button>} />
        <AlertDialog.Content>
          <AlertDialog.Header>
            <AlertDialog.Title>Delete this environment?</AlertDialog.Title>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button>Cancel</Button>} />
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>,
    )

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    const dialog = await screen.findByRole('alertdialog')

    // Clicking the backdrop must not discard the decision.
    await user.click(document.body)
    expect(dialog).toBeInTheDocument()

    // Escape must work: a modal that traps focus has to be escapable.
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument())
  })
})
