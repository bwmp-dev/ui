import { useState } from 'react'
import {
  Checkbox,
  Field,
  FormSection,
  Input,
  NumberInput,
  RadioGroup,
  Select,
  Slider,
  Switch,
  Textarea,
} from '@stack/ui'
import { Globe } from 'lucide-react'

export default function FormFields() {
  const [region, setRegion] = useState<string | null>('eu-west-1')

  return (
    <div className="max-w-md">
      <FormSection title="Deployment" description="Applied on the next release.">
        <Field name="name">
          <Field.Label required>Service name</Field.Label>
          <Input required placeholder="checkout-api" icon={Globe} defaultValue="" />
          <Field.Description>Lower-case letters, numbers and hyphens.</Field.Description>
        </Field>

        <Field name="region">
          <Field.Label required>Region</Field.Label>
          <Select
            items={{ 'eu-west-1': 'eu-west-1', 'us-east-1': 'us-east-1' }}
            value={region}
            onValueChange={setRegion}
          >
            <Select.Trigger placeholder="Choose a region" aria-label="Region" />
            <Select.Content>
              <Select.Item value="eu-west-1">eu-west-1</Select.Item>
              <Select.Item value="us-east-1">us-east-1</Select.Item>
            </Select.Content>
          </Select>
        </Field>

        <Field name="replicas">
          <Field.Label>Replicas</Field.Label>
          <NumberInput defaultValue={3} min={1} max={20} />
        </Field>

        <Field name="strategy">
          <Field.Label>Strategy</Field.Label>
          <RadioGroup defaultValue="rolling" orientation="horizontal">
            <RadioGroup.Item value="rolling" label="Rolling" />
            <RadioGroup.Item value="blue-green" label="Blue/green" />
            <RadioGroup.Item value="recreate" label="Recreate" />
          </RadioGroup>
        </Field>

        <Field name="cpu">
          <Slider label="CPU limit" defaultValue={40} />
        </Field>

        <Field name="notes">
          <Field.Label>Notes</Field.Label>
          <Textarea rows={3} placeholder="Anything the on-call should know." />
        </Field>

        <Checkbox label="Run migrations before switching traffic" defaultChecked />
        <Switch label="Auto-rollback" description="Reverts if health checks fail for 60 seconds." />
      </FormSection>
    </div>
  )
}
