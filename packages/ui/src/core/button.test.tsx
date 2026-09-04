import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Plus } from 'lucide-react'
import { Button, IconButton, LinkButton } from './button'

describe('Button', () => {
  it('is a real button that forwards refs and DOM props', () => {
    const ref = createRef<HTMLButtonElement>()
    render(
      <Button ref={ref} form="settings" data-testid="save">
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBe(ref.current)
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('form', 'settings')
    expect(button).toHaveAttribute('data-testid', 'save')
  })

  it('marks itself busy and stops responding while loading', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    )

    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button).toBeDisabled()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('composes into another element through render', () => {
    render(<Button render={<a href="/settings" />}>Settings</Button>)

    const link = screen.getByRole('link', { name: 'Settings' })
    expect(link).toHaveAttribute('href', '/settings')
    // `type` and `disabled` are button-only; they must not leak onto an anchor.
    expect(link).not.toHaveAttribute('type')
  })

  it('uses aria-disabled when it is not a native button', () => {
    render(
      <Button render={<a href="/settings" />} disabled>
        Settings
      </Button>,
    )
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true')
  })

  it('lets className override variant styles', () => {
    render(
      <Button variant="primary" className="bg-danger">
        Delete
      </Button>,
    )
    const classes = screen.getByRole('button').className.split(' ')
    expect(classes).toContain('bg-danger')
    // The base colour is dropped, but state variants of it survive.
    expect(classes).not.toContain('bg-accent')
    expect(classes).toContain('hover:bg-accent-hover')
  })
})

describe('IconButton', () => {
  it('takes its accessible name from label', () => {
    render(<IconButton icon={Plus} label="Add device" />)
    expect(screen.getByRole('button', { name: 'Add device' })).toBeInTheDocument()
  })
})

describe('LinkButton', () => {
  it('renders an anchor by default', () => {
    render(<LinkButton href="https://example.test">Docs</LinkButton>)
    const link = screen.getByRole('link', { name: 'Docs' })
    expect(link.tagName).toBe('A')
    expect(link).not.toHaveAttribute('type')
  })
})
