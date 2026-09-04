import { useForm } from '@tanstack/react-form'
import { Button, Dialog, Input, Select, Textarea, useToast } from '@bwmp-dev/ui'
import { FormField, SubmitButton, applyServerErrors } from '@bwmp-dev/ui/form'
import { isApiError, userMessage } from '~/api/errors'
import {
  DEVICE_REGIONS,
  deviceInputSchema,
  deviceKindSchema,
  type Device,
  type DeviceInput,
} from '../schema'
import { useCreateDevice, useUpdateDevice } from '../queries'

export type DeviceFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Omit to create a new device. */
  device?: Device
}

const emptyDevice: DeviceInput = { name: '', kind: 'sensor', region: DEVICE_REGIONS[0], notes: '' }

/**
 * Create and edit share one form: the fields, the validation and the error
 * handling are identical, and only the mutation differs.
 *
 * Validation is the Zod schema from `schema.ts` — the same one the API contract
 * uses — passed straight to TanStack Form as a Standard Schema validator, so
 * there is no second copy of the rules to drift.
 */
export function DeviceFormDialog({ open, onOpenChange, device }: DeviceFormDialogProps) {
  const toast = useToast()
  const create = useCreateDevice()
  const update = useUpdateDevice(device?.id ?? '')
  const isEdit = device !== undefined

  const form = useForm({
    defaultValues: isEdit
      ? { name: device.name, kind: device.kind, region: device.region, notes: device.notes }
      : emptyDevice,
    validators: { onSubmit: deviceInputSchema },
    onSubmit: async ({ value, formApi }) => {
      try {
        if (isEdit) await update.mutateAsync(value)
        else await create.mutateAsync(value)

        toast.add({
          title: isEdit ? 'Device updated' : 'Device created',
          description: value.name,
          type: 'success',
        })
        onOpenChange(false)
        formApi.reset()
      } catch (error) {
        // Server-side validation belongs on the fields, not in a banner.
        if (isApiError(error) && error.fields) {
          const unmatched = applyServerErrors(formApi, error.fields)
          if (unmatched.length === 0) return
        }
        toast.add({ title: userMessage(error), type: 'danger' })
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content size="md">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit()
          }}
        >
          <Dialog.Header>
            <Dialog.Title>{isEdit ? `Edit ${device.name}` : 'New device'}</Dialog.Title>
            <Dialog.Description>
              {isEdit
                ? 'Changes take effect on the next check-in.'
                : 'The device will appear once it completes its first check-in.'}
            </Dialog.Description>
          </Dialog.Header>

          <Dialog.Body className="flex flex-col gap-4">
            <form.Field name="name">
              {(field) => (
                <FormField
                  field={field}
                  label="Name"
                  required
                  description="Lower-case letters, numbers and hyphens."
                >
                  {(f) => (
                    <Input
                      value={f.state.value}
                      required
                      onBlur={f.handleBlur}
                      onChange={(event) => f.handleChange(event.target.value)}
                      placeholder="gateway-014"
                    />
                  )}
                </FormField>
              )}
            </form.Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="kind">
                {(field) => (
                  <FormField field={field} label="Kind" required>
                    {(f) => (
                      <Select
                        items={{ gateway: 'Gateway', sensor: 'Sensor', controller: 'Controller' }}
                        value={f.state.value}
                        onValueChange={(value) => f.handleChange(value as DeviceInput['kind'])}
                      >
                        <Select.Trigger aria-label="Kind" />
                        <Select.Content>
                          {deviceKindSchema.options.map((kind) => (
                            <Select.Item key={kind} value={kind}>
                              {kind}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  </FormField>
                )}
              </form.Field>

              <form.Field name="region">
                {(field) => (
                  <FormField field={field} label="Region" required>
                    {(f) => (
                      <Select
                        value={f.state.value}
                        onValueChange={(value) => f.handleChange(value as string)}
                      >
                        <Select.Trigger aria-label="Region" placeholder="Choose a region" />
                        <Select.Content>
                          {DEVICE_REGIONS.map((region) => (
                            <Select.Item key={region} value={region}>
                              {region}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select>
                    )}
                  </FormField>
                )}
              </form.Field>
            </div>

            <form.Field name="notes">
              {(field) => (
                <FormField
                  field={field}
                  label="Notes"
                  description="Optional. Visible to your team."
                >
                  {(f) => (
                    <Textarea
                      value={f.state.value}
                      rows={3}
                      onBlur={f.handleBlur}
                      onChange={(event) => f.handleChange(event.target.value)}
                    />
                  )}
                </FormField>
              )}
            </form.Field>
          </Dialog.Body>

          <Dialog.Footer>
            <Dialog.Close render={<Button type="button">Cancel</Button>} />
            <SubmitButton form={form}>{isEdit ? 'Save changes' : 'Create device'}</SubmitButton>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog>
  )
}
