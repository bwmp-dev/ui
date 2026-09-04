import { createContext, use, type ComponentPropsWithRef } from 'react'
import { Tabs as BaseTabs } from '@base-ui/react/tabs'
import { cn, cv, type VariantProps } from '@stack/utils'

export const tabsListVariants = cv({
  base: 'relative flex items-center',
  variants: {
    variant: {
      /** Underlined tabs for page-level sections. */
      line: 'border-line gap-4 border-b',
      /** Segmented control for switching a view in place. */
      segmented: 'bg-surface-sunken border-line gap-0.5 rounded-md border p-0.5',
    },
  },
  defaultVariants: { variant: 'line' },
})

const tabVariants = cv({
  base: 'text-ui focus-ring transition-control relative font-medium whitespace-nowrap data-[disabled]:opacity-50',
  variants: {
    variant: {
      line: 'text-fg-muted hover:text-fg data-[selected]:text-fg data-[selected]:border-accent -mb-px border-b-2 border-transparent py-1.5',
      segmented:
        'text-fg-muted hover:text-fg data-[selected]:text-fg data-[selected]:bg-surface rounded-sm px-2.5 py-1 data-[selected]:shadow-xs',
    },
  },
  defaultVariants: { variant: 'line' },
})

type TabsVariant = NonNullable<VariantProps<typeof tabsListVariants>['variant']>

/** The variant belongs to the group, so tabs read it instead of repeating it. */
const TabsVariantContext = createContext<TabsVariant>('line')

export type TabsProps = ComponentPropsWithRef<typeof BaseTabs.Root>
export type TabsListProps = ComponentPropsWithRef<typeof BaseTabs.List> &
  VariantProps<typeof tabsListVariants>
export type TabProps = ComponentPropsWithRef<typeof BaseTabs.Tab>

function TabsList({ variant = 'line', className, children, ...props }: TabsListProps) {
  return (
    <TabsVariantContext value={variant}>
      <BaseTabs.List {...props} className={tabsListVariants({ variant, className })}>
        {children}
      </BaseTabs.List>
    </TabsVariantContext>
  )
}

function Tab({ className, ...props }: TabProps) {
  const variant = use(TabsVariantContext)
  return <BaseTabs.Tab {...props} className={tabVariants({ variant, className })} />
}

function TabsPanel({ className, ...props }: ComponentPropsWithRef<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel {...props} className={cn('focus-ring rounded-sm outline-none', className)} />
  )
}

/**
 * Tabs switch between views of the same subject.
 *
 * They are not navigation — if each tab is a distinct URL, use links inside a
 * `Navbar` or `Sidebar` instead, so history and middle-click both behave.
 *
 * ```tsx
 * <Tabs defaultValue="overview">
 *   <Tabs.List>
 *     <Tabs.Tab value="overview">Overview</Tabs.Tab>
 *     <Tabs.Tab value="logs">Logs</Tabs.Tab>
 *   </Tabs.List>
 *   <Tabs.Panel value="overview">…</Tabs.Panel>
 * </Tabs>
 * ```
 */
export const Tabs = Object.assign(BaseTabs.Root, {
  List: TabsList,
  Tab,
  Panel: TabsPanel,
})
