# Stack

A React design system and three project templates, so a new project starts at
the interesting part instead of at Tailwind configuration.

```bash
pnpm stack create provenance --type app
cd provenance
pnpm install
pnpm dev
```

That gives you React, TypeScript, TanStack Router, TanStack Query, design
tokens, the component library, an API layer, error handling, linting, tests and
a sensible project structure — running, with a mock backend, before you have
written anything.

## What is here

```
apps/
├── docs/           the documentation site, with live previews
└── playground/     a sandbox for working on components
packages/
├── tokens/         design tokens as CSS custom properties
├── ui/             the React component system
├── hooks/          reusable React hooks
├── utils/          cn, cv, and small framework-independent helpers
├── icons/          the icon contract and the brand marks Lucide omits
├── config-eslint/  shared flat ESLint configurations
└── config-typescript/
templates/
├── app/            Vite + TanStack Router — dashboards and internal tools
├── site/           Astro with React islands — project and marketing sites
└── fullstack/      TanStack Start — SSR with server functions
tooling/
└── create-stack/   the project generator
```

## The idea

A small stable core, and progressively more opinionated layers on top:

```
project code  →  features  →  template  →  @stack/ui  →  Base UI  →  @stack/tokens
```

The lower something sits, the more stable and generic it has to be. Things move
down only when they have earned it — not because they might be reusable one day.

Three things follow from that:

**Tokens are CSS, not JavaScript.** `@stack/tokens` has no dependencies and no
React. Colours are declared once with `light-dark()`, so a brand override is one
block and the whole system works with JavaScript disabled.

**Base UI does what is genuinely hard.** Focus trapping, focus restoration,
Escape, scroll locking, typeahead, roving focus. We own the API, the styling,
the variants and the composition; we do not rewrite the parts that are invisible
when they are wrong.

**Escape hatches are real.** `className` always wins, every component exports
its variant map so you can extend rather than fork, and nothing depends on you
using our components at all. A canvas editor has no business being expressed in
`Button` and `Card`.

## Templates are the examples

There is no `examples/` directory. The templates _are_ the worked examples,
because a template nobody runs rots, and an example nobody generates from drifts
from the template it was copied out of.

They are ordinary workspace packages. CI builds, lints, type-checks and tests
them on every change, and the application template's end-to-end suite runs
against a real browser.

## Commands

```bash
pnpm dev              # every dev server
pnpm docs             # just the documentation site
pnpm playground       # just the component sandbox
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm format
```

Working on one thing:

```bash
pnpm --filter @stack/ui test:watch
pnpm --filter @stack/template-app dev
pnpm turbo run build --filter=@stack/ui...   # and everything it depends on
```

Turbo knows the dependency graph, so packages build before their consumers and
unchanged packages are not rebuilt.

## Versions

Every third-party version lives in the `catalog:` block of
`pnpm-workspace.yaml`. Packages reference `catalog:` rather than pinning their
own ranges, so nothing drifts and an upgrade is one edit.

Two constraints worth knowing:

- **TypeScript is on 6.x, not 7.x.** typescript-eslint supports
  `>=4.8.4 <6.1.0`; moving to 7 means losing type-aware linting until it
  catches up.
- **The Base UI package is `@base-ui/react`.** `@base-ui-components/react` is
  the deprecated old name.

## Releasing

```bash
pnpm changeset          # describe the change
pnpm version-packages   # apply it
pnpm release            # build and publish
```

Packages version independently, and the architecture is not tied to a registry.
See the [publishing guide](apps/docs/src/pages/guides/publishing.mdx).

## Documentation

`pnpm docs`, or read the source under `apps/docs/src/pages`:

- [Getting started](apps/docs/src/pages/guides/getting-started.mdx)
- [Architecture](apps/docs/src/pages/guides/architecture.mdx)
- [Theming](apps/docs/src/pages/guides/theming.mdx)
- [Styling](apps/docs/src/pages/guides/styling.mdx)
- [Data and API](apps/docs/src/pages/guides/data.mdx)
- [Forms](apps/docs/src/pages/guides/forms.mdx)
- [Testing](apps/docs/src/pages/guides/testing.mdx)
- [Adding a component](apps/docs/src/pages/guides/adding-a-component.mdx)
- [Publishing](apps/docs/src/pages/guides/publishing.mdx)
- [Upgrading](apps/docs/src/pages/guides/upgrading.mdx)

Component API tables are extracted from the TypeScript declarations at build
time, so they cannot drift from the source.

## Requirements

Node 22.12 or newer, and pnpm 11. `corepack enable` if you do not have pnpm.
