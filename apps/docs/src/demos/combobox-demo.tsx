import { Combobox, Field } from '@stack/ui'

const REGIONS = [
  'eu-west-1',
  'eu-central-1',
  'us-east-1',
  'us-east-2',
  'us-west-2',
  'ap-south-1',
  'ap-southeast-2',
  'sa-east-1',
]

export default function ComboboxDemo() {
  return (
    <div className="max-w-xs">
      <Field name="region">
        <Field.Label>Region</Field.Label>
        <Combobox items={REGIONS}>
          <Combobox.Input placeholder="Search regions…" clearable aria-label="Region" />
          <Combobox.Content>
            <Combobox.Empty>No matching region.</Combobox.Empty>
            <Combobox.List>
              {(region: string) => (
                <Combobox.Item key={region} value={region}>
                  {region}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Content>
        </Combobox>
      </Field>
    </div>
  )
}
