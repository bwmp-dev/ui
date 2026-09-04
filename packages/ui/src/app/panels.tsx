import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@bwmp-dev/utils'

export type PropertyPanelProps = ComponentPropsWithRef<'div'>

function PropertyPanelRoot({ className, ...props }: PropertyPanelProps) {
  return <div {...props} className={cn('flex flex-col', className)} />
}

export type PropertyGroupProps = ComponentPropsWithRef<'section'> & {
  title?: ReactNode
}

function PropertyGroup({ title, className, children, ...props }: PropertyGroupProps) {
  return (
    <section
      {...props}
      className={cn('border-b border-line-muted px-3 py-2.5 last:border-b-0', className)}
    >
      {title ? (
        <h3 className="mb-1.5 text-2xs font-medium tracking-wide text-fg-subtle uppercase">
          {title}
        </h3>
      ) : null}
      <dl className="flex flex-col gap-1.5">{children}</dl>
    </section>
  )
}

export type PropertyProps = {
  label: ReactNode
  children: ReactNode
  /** Stack the value under the label, for long values like a description. */
  stacked?: boolean
  className?: string
}

/**
 * One label/value pair.
 *
 * Rendered as `<dt>`/`<dd>` so the relationship survives in the accessibility
 * tree; a two-column grid of `<div>`s does not.
 */
function Property({ label, children, stacked = false, className }: PropertyProps) {
  return (
    <div
      className={cn(
        'min-w-0 text-xs',
        stacked ? 'flex flex-col gap-0.5' : 'grid grid-cols-[minmax(0,7rem)_1fr] gap-2',
        className,
      )}
    >
      <dt className="truncate text-fg-muted">{label}</dt>
      <dd className="min-w-0 break-words text-fg">{children}</dd>
    </div>
  )
}

/**
 * The metadata rail beside a selected record.
 *
 * ```tsx
 * <PropertyPanel>
 *   <PropertyPanel.Group title="Identity">
 *     <PropertyPanel.Property label="ID"><Code>dev_01H…</Code></PropertyPanel.Property>
 *     <PropertyPanel.Property label="Status"><Badge tone="success" dot>Online</Badge></PropertyPanel.Property>
 *   </PropertyPanel.Group>
 * </PropertyPanel>
 * ```
 */
export const PropertyPanel = Object.assign(PropertyPanelRoot, {
  Group: PropertyGroup,
  Property,
})

export type SettingsSectionProps = ComponentPropsWithRef<'section'> & {
  title: ReactNode
  description?: ReactNode
  /** Right-aligned control for the section as a whole. */
  actions?: ReactNode
  /** A footer strip, typically holding the save button or a warning. */
  footer?: ReactNode
}

/**
 * One block of a settings page: a described group of controls.
 *
 * The title column sits beside the controls on wide screens and stacks below
 * `md`, which keeps long settings pages scannable without a card per setting.
 */
export function SettingsSection({
  title,
  description,
  actions,
  footer,
  className,
  children,
  ...props
}: SettingsSectionProps) {
  return (
    <section
      {...props}
      className={cn(
        'grid gap-4 border-b border-line-muted pb-section last:border-b-0',
        'md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] md:gap-8',
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-ui font-semibold text-fg">{title}</h2>
        {description ? <p className="mt-1 text-xs text-fg-muted">{description}</p> : null}
        {actions ? <div className="mt-2 flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        {children}
        {footer ? <div className="flex items-center justify-end gap-2">{footer}</div> : null}
      </div>
    </section>
  )
}
