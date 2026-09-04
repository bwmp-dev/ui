import { useMemo, type ReactNode } from 'react'
import { Combobox as BaseCombobox } from '@base-ui/react/combobox'
import { Dialog as BaseDialog } from '@base-ui/react/dialog'
import { Search } from 'lucide-react'
import { cn } from '@stack/utils'
import type { IconComponent } from '@stack/icons'
import { Kbd } from '../core/primitives'

export type CommandAction = {
  id: string
  label: string
  /** Optional group heading. Items are rendered in first-seen group order. */
  group?: string
  /** Extra terms that should match this action, e.g. an alias or a route path. */
  keywords?: string[]
  icon?: IconComponent
  /** Rendered as `<Kbd>` chips on the right, e.g. `['⌘', 'K']`. */
  shortcut?: string[]
  description?: string
  disabled?: boolean
  onSelect: () => void
}

export type CommandMenuProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  actions: readonly CommandAction[]
  /**
   * The dialog's accessible name. Rendered visually hidden — the palette has no
   * visible heading, but a dialog without a name is unusable with a screen
   * reader.
   */
  title?: string
  placeholder?: string
  emptyMessage?: ReactNode
  /** Rendered under the list, typically a hint row. */
  footer?: ReactNode
  className?: string
}

type CommandGroup = { value: string; items: CommandAction[] }

function groupActions(actions: readonly CommandAction[]): CommandGroup[] {
  const groups: CommandGroup[] = []
  const index = new Map<string, CommandGroup>()

  for (const action of actions) {
    const name = action.group ?? ''
    let group = index.get(name)
    if (!group) {
      group = { value: name, items: [] }
      index.set(name, group)
      groups.push(group)
    }
    group.items.push(action)
  }

  return groups
}

/**
 * Matching includes the keywords, so "logs" can find "Open build output".
 * Base UI's default filter only looks at the string label.
 */
function matches(action: CommandAction, query: string): boolean {
  if (!query) return true
  const needle = query.toLowerCase()
  if (action.label.toLowerCase().includes(needle)) return true
  if (action.group?.toLowerCase().includes(needle)) return true
  return Boolean(action.keywords?.some((keyword) => keyword.toLowerCase().includes(needle)))
}

/**
 * A keyboard-first command palette.
 *
 * Open state is owned by the application so that a hotkey, a menu item and a
 * button can all drive it:
 *
 * ```tsx
 * const [open, setOpen] = useState(false)
 * useHotkey('mod+k', () => setOpen(true))
 * <CommandMenu open={open} onOpenChange={setOpen} actions={actions} />
 * ```
 *
 * For anything beyond a flat action list, compose the parts directly —
 * `CommandMenu.Root` is Base UI's Combobox and takes all of its props.
 */
export function CommandMenu({
  open,
  onOpenChange,
  actions,
  title = 'Command palette',
  placeholder = 'Search…',
  emptyMessage = 'No matching commands.',
  footer,
  className,
}: CommandMenuProps) {
  const groups = useMemo(() => groupActions(actions), [actions])

  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="bg-overlay overlay-motion fixed inset-0 z-[var(--z-overlay)]" />
        <BaseDialog.Viewport className="fixed inset-0 z-[var(--z-dialog)] flex justify-center overflow-y-auto p-4 pt-[12vh]">
          <BaseDialog.Popup
            /*
             * The combobox is permanently open, so it treats Escape as "close
             * the list" and stops the event before the dialog sees it. Handling
             * it in the capture phase keeps Escape meaning "close the palette".
             */
            onKeyDownCapture={(event) => {
              if (event.key !== 'Escape') return
              event.preventDefault()
              onOpenChange(false)
            }}
            className={cn(
              'surface-panel popup-motion flex h-fit w-full max-w-lg flex-col overflow-hidden shadow-lg',
              className,
            )}
          >
            <BaseDialog.Title className="sr-only">{title}</BaseDialog.Title>

            <BaseCombobox.Root
              open
              items={groups}
              filter={(item: CommandAction, query) => matches(item, query)}
              onValueChange={(action: CommandAction | null) => {
                if (!action || action.disabled) return
                onOpenChange(false)
                action.onSelect()
              }}
            >
              <div className="border-line-muted flex items-center gap-2 border-b px-3">
                <Search size={14} aria-hidden className="text-fg-subtle shrink-0" />
                <BaseCombobox.Input
                  placeholder={placeholder}
                  aria-label={placeholder}
                  className="text-ui text-fg placeholder:text-fg-subtle h-9 w-full bg-transparent outline-none"
                />
              </div>

              <BaseCombobox.List className="max-h-80 overflow-y-auto p-1">
                {(group: CommandGroup) => (
                  <BaseCombobox.Group key={group.value || 'ungrouped'} items={group.items}>
                    {group.value ? (
                      <BaseCombobox.GroupLabel className="text-fg-subtle px-2 pt-2 pb-1 text-2xs font-medium uppercase">
                        {group.value}
                      </BaseCombobox.GroupLabel>
                    ) : null}
                    <BaseCombobox.Collection>
                      {(action: CommandAction) => (
                        <CommandMenuItem key={action.id} action={action} />
                      )}
                    </BaseCombobox.Collection>
                  </BaseCombobox.Group>
                )}
              </BaseCombobox.List>

              {/*
                Base UI keeps this element mounted so screen readers announce
                the change; only its children come and go. Padding therefore
                belongs inside, or the palette carries a permanent gap.
              */}
              <BaseCombobox.Empty>
                <p className="text-fg-muted px-3 py-8 text-center text-xs">{emptyMessage}</p>
              </BaseCombobox.Empty>

              {footer ? (
                <div className="border-line-muted text-fg-subtle border-t px-3 py-2 text-2xs">
                  {footer}
                </div>
              ) : null}
            </BaseCombobox.Root>
          </BaseDialog.Popup>
        </BaseDialog.Viewport>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  )
}

function CommandMenuItem({ action }: { action: CommandAction }) {
  const Icon = action.icon
  return (
    <BaseCombobox.Item
      value={action}
      disabled={action.disabled}
      className={cn(
        'text-ui text-fg flex cursor-default items-center gap-2.5 rounded-sm px-2 py-1.5 select-none',
        'data-[highlighted]:bg-hover',
        'data-[disabled]:text-fg-disabled data-[disabled]:pointer-events-none',
      )}
    >
      {Icon ? <Icon width={14} height={14} aria-hidden className="text-fg-muted shrink-0" /> : null}
      <span className="min-w-0 flex-1">
        <span className="block truncate">{action.label}</span>
        {action.description ? (
          <span className="text-fg-subtle block truncate text-xs">{action.description}</span>
        ) : null}
      </span>
      {action.shortcut?.length ? (
        <span className="flex shrink-0 items-center gap-0.5">
          {action.shortcut.map((key) => (
            <Kbd key={key}>{key}</Kbd>
          ))}
        </span>
      ) : null}
    </BaseCombobox.Item>
  )
}

/** The underlying parts, for palettes that need more than a flat action list. */
CommandMenu.Root = BaseCombobox.Root
CommandMenu.Input = BaseCombobox.Input
CommandMenu.List = BaseCombobox.List
CommandMenu.Item = BaseCombobox.Item
CommandMenu.Group = BaseCombobox.Group
CommandMenu.Collection = BaseCombobox.Collection
CommandMenu.Empty = BaseCombobox.Empty
