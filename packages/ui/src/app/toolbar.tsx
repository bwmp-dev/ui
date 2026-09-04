import { useId, type ComponentPropsWithRef, type ReactNode } from 'react'
import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar'
import { Search, X } from 'lucide-react'
import { cn } from '@stack/utils'
import { Input, type InputProps } from '../forms/input'
import { Separator } from '../core/primitives'

export type ToolbarProps = ComponentPropsWithRef<typeof BaseToolbar.Root> & {
  /** Adds a bottom border, for a toolbar that sits above scrolling content. */
  bordered?: boolean
}

/**
 * A horizontal band of controls.
 *
 * Base UI gives it roving tab focus, so the whole toolbar is one tab stop and
 * arrow keys move between the controls — the behaviour people expect from an
 * editor or an IDE, and tedious to implement by hand.
 */
function ToolbarRoot({ bordered = true, className, ...props }: ToolbarProps) {
  return (
    <BaseToolbar.Root
      {...props}
      className={cn(
        'bg-surface flex h-navbar shrink-0 items-center gap-2 px-3',
        bordered && 'border-line border-b',
        className,
      )}
    />
  )
}

function ToolbarGroup({ className, ...props }: ComponentPropsWithRef<typeof BaseToolbar.Group>) {
  return <BaseToolbar.Group {...props} className={cn('flex items-center gap-1', className)} />
}

function ToolbarSpacer(props: ComponentPropsWithRef<'div'>) {
  return <div aria-hidden {...props} className={cn('flex-1', props.className)} />
}

function ToolbarSeparator({ className, ...props }: ComponentPropsWithRef<typeof BaseToolbar.Separator>) {
  return <BaseToolbar.Separator {...props} className={cn('bg-line mx-1 h-4 w-px', className)} />
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  /** Wraps a control so it participates in roving focus. */
  Button: BaseToolbar.Button,
  Link: BaseToolbar.Link,
  Input: BaseToolbar.Input,
  Separator: ToolbarSeparator,
  Spacer: ToolbarSpacer,
})

export type SearchInputProps = Omit<InputProps, 'icon' | 'type' | 'suffix'> & {
  value: string
  onValueChange: (value: string) => void
  /** Accessible name. Rendered visually hidden when there is no visible label. */
  label?: string
}

/**
 * A text field for filtering a list.
 *
 * It is `type="search"` with an explicit clear button rather than the browser's
 * inconsistent native one, and it keeps its own label so the field is still
 * identifiable when the placeholder is the only visible text.
 */
export function SearchInput({
  value,
  onValueChange,
  label = 'Search',
  placeholder = 'Search…',
  className,
  ...props
}: SearchInputProps) {
  const id = useId()

  return (
    <div className={cn('relative flex min-w-0 items-center', className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Input
        {...props}
        id={id}
        type="search"
        icon={Search}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onValueChange(event.target.value)}
        className="pr-7 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onValueChange('')}
          aria-label="Clear search"
          className="text-fg-subtle hover:text-fg hover:bg-hover focus-ring absolute right-1.5 grid size-5 place-items-center rounded-xs"
        >
          <X size={12} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}

export type FilterBarProps = ComponentPropsWithRef<'div'> & {
  /** Rendered on the right, e.g. a result count or a "Clear all" button. */
  trailing?: ReactNode
  /** Shown between the filters and `trailing` when any filter is active. */
  onClear?: () => void
  activeCount?: number
}

/**
 * A row of filter controls above a collection.
 *
 * Wrapping is the default so a long set of filters degrades onto a second line
 * instead of scrolling horizontally.
 */
export function FilterBar({
  trailing,
  onClear,
  activeCount = 0,
  className,
  children,
  ...props
}: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filters"
      {...props}
      className={cn('flex flex-wrap items-center gap-2', className)}
    >
      {children}
      {activeCount > 0 && onClear ? (
        <>
          <Separator orientation="vertical" className="h-4" />
          <button
            type="button"
            onClick={onClear}
            className="text-fg-muted hover:text-fg focus-ring rounded-xs text-xs font-medium"
          >
            Clear {activeCount} {activeCount === 1 ? 'filter' : 'filters'}
          </button>
        </>
      ) : null}
      {trailing ? <div className="ml-auto flex items-center gap-2">{trailing}</div> : null}
    </div>
  )
}
