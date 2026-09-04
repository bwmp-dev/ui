import type { ComponentPropsWithRef, ReactNode } from 'react'
import { Field as BaseField } from '@base-ui/react/field'
import { cn } from '@bwmp-dev/utils'

/**
 * Field wires a label, description, error message and control together.
 *
 * Base UI generates the ids and the `aria-describedby` / `aria-invalid`
 * relationships, which is exactly the part that is easy to get subtly wrong by
 * hand. Everything visual is ours.
 *
 * ```tsx
 * <Field name="email" invalid={Boolean(error)}>
 *   <Field.Label required>Email</Field.Label>
 *   <Input type="email" required />
 *   <Field.Description>Used for build notifications.</Field.Description>
 *   <Field.Error>{error}</Field.Error>
 * </Field>
 * ```
 */
export type FieldProps = ComponentPropsWithRef<typeof BaseField.Root> & {
  /** Lay the label out beside the control instead of above it. */
  orientation?: 'vertical' | 'horizontal'
}

function FieldRoot({ orientation = 'vertical', className, ...props }: FieldProps) {
  return (
    <BaseField.Root
      {...props}
      className={cn(
        'group/field flex min-w-0',
        orientation === 'vertical'
          ? 'flex-col gap-1.5'
          : 'flex-row items-center justify-between gap-4',
        className,
      )}
    />
  )
}

export type FieldLabelProps = ComponentPropsWithRef<typeof BaseField.Label> & {
  /**
   * Renders the required indicator.
   *
   * Presentational only — the asterisk is hidden from assistive technology, so
   * the control itself still needs `required`, which is what actually gets
   * announced.
   */
  required?: boolean
}

function FieldLabel({ className, children, required, ...props }: FieldLabelProps) {
  return (
    <BaseField.Label
      {...props}
      className={cn(
        'flex items-center gap-1 text-xs font-medium text-fg',
        'data-[disabled]:text-fg-disabled',
        className,
      )}
    >
      {children}
      {required ? (
        <span className="text-danger-text" aria-hidden>
          *
        </span>
      ) : null}
    </BaseField.Label>
  )
}

function FieldDescription({
  className,
  ...props
}: ComponentPropsWithRef<typeof BaseField.Description>) {
  return <BaseField.Description {...props} className={cn('text-xs text-fg-muted', className)} />
}

/**
 * Renders only when the field is invalid. Pass `children` for a server-supplied
 * message, or leave it empty to show the browser's own validation message.
 */
function FieldError({ className, ...props }: ComponentPropsWithRef<typeof BaseField.Error>) {
  return <BaseField.Error {...props} className={cn('text-xs text-danger-text', className)} />
}

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
  Validity: BaseField.Validity,
})

export type FormSectionProps = ComponentPropsWithRef<'section'> & {
  title: ReactNode
  description?: ReactNode
  /** Actions aligned with the section heading, e.g. a "Reset" button. */
  actions?: ReactNode
}

/**
 * A titled group of fields.
 *
 * A heading plus a rule does the grouping; there is deliberately no card here,
 * so long forms do not turn into a stack of floating boxes.
 */
export function FormSection({
  title,
  description,
  actions,
  className,
  children,
  ...props
}: FormSectionProps) {
  return (
    <section {...props} className={cn('flex flex-col gap-stack', className)}>
      <header className="flex items-start justify-between gap-4 border-b border-line-muted pb-2">
        <div className="min-w-0">
          <h3 className="text-ui font-semibold text-fg">{title}</h3>
          {description ? <p className="mt-0.5 text-xs text-fg-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}
