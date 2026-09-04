import { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Field } from './field'
import { Input } from './input'
import { Select } from './select'
import { Checkbox, RadioGroup, Switch } from './toggles'

describe('Field', () => {
  it('wires the label, description and error to the control', () => {
    render(
      <Field name="email" invalid>
        <Field.Label required>Email</Field.Label>
        <Input type="email" required defaultValue="" />
        <Field.Description>Used for build notifications.</Field.Description>
        <Field.Error match>Enter a valid address.</Field.Error>
      </Field>,
    )

    // The asterisk is decorative; `required` on the control is what is announced.
    const input = screen.getByRole('textbox', { name: 'Email' })
    expect(input).toBeRequired()
    expect(input).toHaveAccessibleDescription(/Used for build notifications/)
    expect(input).toHaveAccessibleDescription(/Enter a valid address/)
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })
})

describe('Select', () => {
  function Channels({ onChange }: { onChange?: (value: string) => void }) {
    const [value, setValue] = useState<string | null>(null)
    return (
      <Select
        items={{ stable: 'Stable', beta: 'Beta', nightly: 'Nightly' }}
        value={value}
        onValueChange={(next) => {
          setValue(next)
          onChange?.(next as string)
        }}
      >
        <Select.Trigger placeholder="Choose a channel" aria-label="Release channel" />
        <Select.Content>
          <Select.Item value="stable">Stable</Select.Item>
          <Select.Item value="beta">Beta</Select.Item>
          <Select.Item value="nightly">Nightly</Select.Item>
        </Select.Content>
      </Select>
    )
  }

  it('opens with the keyboard and selects with arrows and Enter', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Channels onChange={onChange} />)

    const trigger = screen.getByRole('combobox', { name: 'Release channel' })
    trigger.focus()
    await user.keyboard('{Enter}')

    const listbox = await screen.findByRole('listbox')
    expect(listbox).toBeInTheDocument()

    // Opening already highlights the first item, so one press reaches the second.
    await user.keyboard('{ArrowDown}{Enter}')

    await waitFor(() => expect(onChange).toHaveBeenCalledWith('beta'))
    expect(trigger).toHaveTextContent('Beta')
  })

  it('closes on Escape without changing the value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Channels onChange={onChange} />)

    await user.click(screen.getByRole('combobox', { name: 'Release channel' }))
    await screen.findByRole('listbox')

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument())
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('Checkbox and Switch', () => {
  it('toggles with Space and reports the new value', async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Checkbox label="Notify on failure" onCheckedChange={onCheckedChange} />)

    const checkbox = screen.getByRole('checkbox', { name: 'Notify on failure' })
    checkbox.focus()
    await user.keyboard(' ')

    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything())
    expect(checkbox).toBeChecked()
  })

  it('exposes a switch role and a label', async () => {
    const user = userEvent.setup()
    render(<Switch label="Auto-deploy" description="Runs on every push to main." />)

    const toggle = screen.getByRole('switch', { name: /Auto-deploy/ })
    await user.click(toggle)
    expect(toggle).toBeChecked()
  })
})

describe('grouped choices', () => {
  it('names each radio from its own label, not the field label', () => {
    render(
      <Field name="appearance">
        <Field.Label>Colour scheme</Field.Label>
        <RadioGroup defaultValue="system" aria-labelledby="scheme-label">
          <RadioGroup.Item value="system" label="System" />
          <RadioGroup.Item value="light" label="Light" />
          <RadioGroup.Item value="dark" label="Dark" />
        </RadioGroup>
      </Field>,
    )

    // Without an explicit label id, Base UI names every radio after the field,
    // and the group becomes three identically-announced options.
    expect(screen.getByRole('radio', { name: 'Light' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Dark' })).toBeInTheDocument()
    expect(screen.queryByRole('radio', { name: 'Colour scheme' })).not.toBeInTheDocument()
  })

  it('describes a switch from its own description', () => {
    render(<Switch label="Auto-deploy" description="Runs on every push to main." />)
    expect(screen.getByRole('switch', { name: 'Auto-deploy' })).toHaveAccessibleDescription(
      'Runs on every push to main.',
    )
  })
})
