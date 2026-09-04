import { useState } from 'react'
import {
  Checkbox,
  Combobox,
  Field,
  Input,
  NumberInput,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from '@bwmp-dev/ui'
import { Stack } from './shared'
import { REGIONS } from './data'

export function FormsSection() {
  const [region, setRegion] = useState<string | null>('eu-west-1')

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Stack>
        <Field name="name">
          <Field.Label required>Service name</Field.Label>
          <Input required placeholder="checkout-api" />
          <Field.Description>Lower-case letters, numbers and hyphens.</Field.Description>
        </Field>

        <Field name="invalid">
          <Field.Label>Invalid</Field.Label>
          <Input defaultValue="Not A Valid Name" aria-invalid />
          <Field.Error match>Use lower-case letters, numbers and hyphens only.</Field.Error>
        </Field>

        <Field name="disabled">
          <Field.Label>Disabled</Field.Label>
          <Input disabled defaultValue="Read only" />
        </Field>

        <Field name="region">
          <Field.Label>Region (select)</Field.Label>
          <Select
            items={Object.fromEntries(REGIONS.map((region) => [region, region]))}
            value={region}
            onValueChange={setRegion}
          >
            <Select.Trigger placeholder="Choose a region" aria-label="Region" />
            <Select.Content>
              {REGIONS.map((entry) => (
                <Select.Item key={entry} value={entry}>
                  {entry}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Field>

        <Field name="combobox">
          <Field.Label>Region (combobox)</Field.Label>
          <Combobox items={REGIONS}>
            <Combobox.Input placeholder="Search…" clearable aria-label="Region search" />
            <Combobox.Content>
              <Combobox.Empty>No matching region.</Combobox.Empty>
              <Combobox.List>
                {(entry: string) => (
                  <Combobox.Item key={entry} value={entry}>
                    {entry}
                  </Combobox.Item>
                )}
              </Combobox.List>
            </Combobox.Content>
          </Combobox>
        </Field>
      </Stack>

      <Stack>
        <Field name="replicas">
          <Field.Label>Replicas</Field.Label>
          <NumberInput defaultValue={3} min={1} max={20} />
        </Field>

        <Field name="notes">
          <Field.Label>Notes</Field.Label>
          <Textarea rows={3} placeholder="Anything the on-call should know." />
        </Field>

        <Field name="strategy">
          <Field.Label>Strategy</Field.Label>
          <RadioGroup defaultValue="rolling">
            <RadioGroup.Item value="rolling" label="Rolling" description="One replica at a time." />
            <RadioGroup.Item value="blue-green" label="Blue/green" />
            <RadioGroup.Item value="recreate" label="Recreate" />
          </RadioGroup>
        </Field>

        <Slider label="CPU limit" defaultValue={40} />

        <Checkbox label="Run migrations first" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Switch label="Auto-rollback" description="Reverts if health checks fail." />
      </Stack>
    </div>
  )
}
