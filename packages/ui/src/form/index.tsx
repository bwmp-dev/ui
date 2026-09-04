import type { ReactNode } from 'react'
import { useStore, type AnyFieldApi, type AnyFormApi } from '@tanstack/react-form'
import { Field } from '../forms/field'
import { Button, type ButtonProps } from '../core/button'

/**
 * @stack/ui/form
 *
 * Thin bindings between TanStack Form and the `Field` primitives. Separate
 * entry point because `@tanstack/react-form` is an optional peer dependency.
 *
 * This is deliberately not a form framework: you still call `useForm` and
 * `form.Field` yourself, keeping validators, array fields, async validation and
 * every other TanStack capability directly available.
 */

/**
 * Normalise TanStack's error array into displayable strings.
 *
 * Validators may return a string, an `{ message }` object, or a Standard Schema
 * issue — all three end up in the same array.
 */
export function fieldErrorMessages(field: AnyFieldApi): string[] {
  const messages: string[] = []
  for (const error of field.state.meta.errors as unknown[]) {
    if (error == null) continue
    if (typeof error === 'string') messages.push(error)
    else if (typeof error === 'object' && 'message' in error) messages.push(String(error.message))
    else messages.push(String(error))
  }
  return messages
}

export type FormFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  description?: ReactNode
  required?: boolean
  orientation?: 'vertical' | 'horizontal'
  className?: string
  /**
   * The control. Receives the field so it can bind value and handlers:
   * `{(f) => <Input value={f.state.value} onChange={e => f.handleChange(e.target.value)} />}`
   */
  children: (field: AnyFieldApi) => ReactNode
}

/**
 * Label, control, description and error for one TanStack Form field.
 *
 * Errors are only shown once the field has been touched, so a pristine form
 * does not open covered in red.
 *
 * ```tsx
 * <form.Field name="email" validators={{ onBlur: emailSchema }}>
 *   {(field) => (
 *     <FormField field={field} label="Email" required>
 *       {(f) => (
 *         <Input
 *           value={f.state.value}
 *           onBlur={f.handleBlur}
 *           onChange={(event) => f.handleChange(event.target.value)}
 *         />
 *       )}
 *     </FormField>
 *   )}
 * </form.Field>
 * ```
 */
export function FormField({
  field,
  label,
  description,
  required,
  orientation,
  className,
  children,
}: FormFieldProps) {
  const messages = fieldErrorMessages(field)
  const showError = field.state.meta.isTouched && messages.length > 0

  return (
    <Field
      name={field.name}
      invalid={showError}
      orientation={orientation}
      className={className}
    >
      <Field.Label required={required}>{label}</Field.Label>
      {children(field)}
      {description ? <Field.Description>{description}</Field.Description> : null}
      {showError ? <Field.Error match>{messages[0]}</Field.Error> : null}
    </Field>
  )
}

export type SubmitButtonProps = Omit<
  ButtonProps,
  // `form` on a <button> is an id string; here it is the form instance.
  'type' | 'loading' | 'disabled' | 'form'
> & {
  form: AnyFormApi
  /** Also disable while the form is untouched. */
  requireDirty?: boolean
}

/**
 * A submit button wired to the form's own state.
 *
 * It subscribes to `canSubmit` and `isSubmitting` only, so typing in a field
 * does not re-render the button.
 */
export function SubmitButton({
  form,
  requireDirty = false,
  variant = 'primary',
  children = 'Save',
  ...props
}: SubmitButtonProps) {
  // Subscribing through the store rather than rendering the whole form means
  // typing in a field does not re-render the button.
  const { canSubmit, isSubmitting, isDirty } = useStore(form.store, (state) => ({
    canSubmit: state.canSubmit,
    isSubmitting: state.isSubmitting,
    isDirty: state.isDirty,
  }))

  return (
    <Button
      {...props}
      type="submit"
      variant={variant}
      loading={isSubmitting}
      disabled={!canSubmit || (requireDirty && !isDirty)}
    >
      {children}
    </Button>
  )
}

/**
 * Push server-side validation errors onto the matching fields.
 *
 * Most APIs answer a failed write with a map of field paths to messages; this
 * puts them where the user is looking instead of in a banner at the top. Errors
 * for unknown fields are returned so the caller can surface them itself.
 *
 * ```ts
 * const unmatched = applyServerErrors(form, error.fields)
 * if (unmatched.length) toast.add({ title: unmatched.join('\n'), type: 'danger' })
 * ```
 */
export function applyServerErrors(
  form: AnyFormApi,
  errors: Record<string, string | string[]>,
): string[] {
  const unmatched: string[] = []

  for (const [path, message] of Object.entries(errors)) {
    const text = Array.isArray(message) ? message.join(' ') : message
    const meta = form.getFieldMeta(path)

    if (!meta) {
      unmatched.push(text)
      continue
    }

    // `errors` is derived from `errorMap`, so writing the map is enough.
    form.setFieldMeta(path, (previous) => ({
      ...previous,
      isTouched: true,
      errorMap: { ...previous.errorMap, onServer: text },
    }))
  }

  return unmatched
}
