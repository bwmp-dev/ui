import { useState } from 'react'
import { Select, Separator, useTheme } from '@bwmp-dev/ui'
import { SECTIONS } from './sections'

/**
 * A sandbox for working on components.
 *
 * The docs explain things; this exists to put a component on screen next to its
 * source with instant HMR, under every combination of appearance, density and
 * brand. It is the fastest way to notice that a control is two pixels short in
 * compact mode, which is not something a test will tell you.
 */
export function Playground() {
  const { appearance, setAppearance, density, setDensity, theme, setTheme } = useTheme()
  const [active, setActive] = useState(SECTIONS[0]?.id ?? '')

  const section = SECTIONS.find((entry) => entry.id === active) ?? SECTIONS[0]

  return (
    <div className="flex h-dvh bg-canvas">
      <aside className="flex w-sidebar shrink-0 flex-col border-r border-line bg-surface">
        <header className="flex h-navbar items-center gap-2 border-b border-line-muted px-3">
          <span className="grid size-5 place-items-center rounded-sm bg-accent text-2xs font-bold text-accent-fg">
            S
          </span>
          <span className="text-ui font-semibold text-fg">Playground</span>
        </header>

        <nav
          aria-label="Sections"
          className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto p-2"
        >
          {SECTIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActive(entry.id)}
              aria-current={entry.id === section?.id ? 'true' : undefined}
              className="h-control-md rounded-md px-2 text-left text-ui text-fg-muted focus-ring hover:bg-hover hover:text-fg aria-[current]:bg-selected aria-[current]:text-fg"
            >
              {entry.title}
            </button>
          ))}
        </nav>

        <footer className="flex flex-col gap-2 border-t border-line-muted p-3">
          <ControlRow label="Appearance">
            <Select
              items={{ dark: 'Dark', light: 'Light', system: 'System' }}
              value={appearance}
              onValueChange={(value) => setAppearance(value as typeof appearance)}
            >
              <Select.Trigger size="sm" aria-label="Appearance" />
              <Select.Content>
                <Select.Item value="dark">Dark</Select.Item>
                <Select.Item value="light">Light</Select.Item>
                <Select.Item value="system">System</Select.Item>
              </Select.Content>
            </Select>
          </ControlRow>

          <ControlRow label="Density">
            <Select
              items={{ comfortable: 'Comfortable', compact: 'Compact' }}
              value={density}
              onValueChange={(value) => setDensity(value as typeof density)}
            >
              <Select.Trigger size="sm" aria-label="Density" />
              <Select.Content>
                <Select.Item value="comfortable">Comfortable</Select.Item>
                <Select.Item value="compact">Compact</Select.Item>
              </Select.Content>
            </Select>
          </ControlRow>

          <ControlRow label="Brand">
            <Select
              items={{
                default: 'Default',
                provenance: 'Provenance',
                summa: 'Summa',
                mochi: 'Mochi',
                luma: 'Luma',
              }}
              value={theme ?? 'default'}
              onValueChange={(value) =>
                setTheme(value === 'default' ? undefined : (value as string))
              }
            >
              <Select.Trigger size="sm" aria-label="Brand" />
              <Select.Content>
                <Select.Item value="default">Default</Select.Item>
                <Select.Item value="provenance">Provenance</Select.Item>
                <Select.Item value="summa">Summa</Select.Item>
                <Select.Item value="mochi">Mochi</Select.Item>
                <Select.Item value="luma">Luma</Select.Item>
              </Select.Content>
            </Select>
          </ControlRow>
        </footer>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-content flex-col gap-section p-6">
          <header>
            <h1 className="text-xl font-semibold tracking-tight text-fg">{section?.title}</h1>
            {section?.description ? (
              <p className="mt-1 max-w-prose text-xs text-fg-muted">{section.description}</p>
            ) : null}
          </header>

          <Separator />

          {section?.render()}
        </div>
      </main>
    </div>
  )
}

function ControlRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-2xs text-fg-subtle">{label}</span>
      <span className="w-32">{children}</span>
    </label>
  )
}
