import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { afterAll, describe, expect, it } from 'vitest'

/**
 * A design token is only real once Tailwind emits a utility for it. Renaming a
 * token or breaking the `@theme inline` bridge type-checks fine and silently
 * removes styling from every consumer, so compile the stylesheet for real.
 */
// Kept inside the package so `@import "@stack/ui/styles.css"` and the
// `@source` globs it contains resolve exactly as they do for a consumer.
const workspace = mkdtempSync(join(process.cwd(), '.css-test-'))
const input = join(workspace, 'in.css')
const output = join(workspace, 'out.css')

writeFileSync(
  input,
  ['@import "tailwindcss";', '@import "@stack/tokens/theme.css";', '@import "@stack/ui/styles.css";'].join('\n'),
)

const cli = createRequire(import.meta.url).resolve('@tailwindcss/cli/package.json')
execFileSync('node', [join(cli, '..', 'dist', 'index.mjs'), '-i', input, '-o', output], {
  cwd: process.cwd(),
  stdio: 'pipe',
})

const css = readFileSync(output, 'utf8')

afterAll(() => rmSync(workspace, { recursive: true, force: true }))

describe('token to utility bridge', () => {
  it.each([
    'bg-canvas',
    'bg-surface',
    'bg-surface-raised',
    'text-fg',
    'text-fg-muted',
    'border-line',
    'bg-accent',
    'text-accent-fg',
    'bg-danger-subtle',
    'text-ui',
    'text-2xs',
    'rounded-md',
    'shadow-md',
    'h-control-md',
    'px-gutter-md',
    'h-row',
    'w-sidebar',
    'h-navbar',
    'gap-stack',
    'max-w-page',
    'ease-standard',
    'focus-ring',
    'surface-panel',
    'transition-control',
    'popup-motion',
  ])('emits .%s', (utility) => {
    expect(css).toContain(`.${utility} {`)
  })

  it('resolves colour tokens through light-dark() so both schemes work unstyled', () => {
    expect(css).toContain('light-dark(')
    expect(css).toContain('color-scheme: dark')
  })

  it('keeps utilities pointing at the live custom property, not a copied value', () => {
    // `@theme inline` is what makes data-theme overrides reach the utilities.
    const rule = css.slice(css.indexOf('.bg-accent {'))
    expect(rule.slice(0, 80)).toContain('background-color: var(--accent)')
  })
})
