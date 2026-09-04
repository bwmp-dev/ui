import { useState } from 'react'
import { Button, Field, Input } from '@bwmp-dev/ui'

/**
 * `Field` wires the label, description and error to the control. Errors appear
 * only once the field has been touched, so a pristine form is not red.
 */
export default function FormValidation() {
  const [value, setValue] = useState('Not A Valid Name')
  const [touched, setTouched] = useState(false)

  const error = /^[a-z0-9-]+$/.test(value)
    ? null
    : 'Use lower-case letters, numbers and hyphens only.'
  const invalid = touched && error !== null

  return (
    <form className="flex max-w-sm items-end gap-2" onSubmit={(event) => event.preventDefault()}>
      <Field name="service" invalid={invalid} className="flex-1">
        <Field.Label required>Service name</Field.Label>
        <Input
          required
          value={value}
          onBlur={() => setTouched(true)}
          onChange={(event) => setValue(event.target.value)}
        />
        {invalid ? <Field.Error match>{error}</Field.Error> : null}
      </Field>
      <Button type="submit" variant="primary">
        Save
      </Button>
    </form>
  )
}
