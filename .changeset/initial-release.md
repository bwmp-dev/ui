---
'@bwmp-dev/tsconfig': minor
'@bwmp-dev/eslint-config': minor
'@bwmp-dev/create-stack': minor
'@bwmp-dev/tokens': minor
'@bwmp-dev/hooks': minor
'@bwmp-dev/icons': minor
'@bwmp-dev/utils': minor
'@bwmp-dev/ui': minor
---

First release.

- `@bwmp-dev/tokens`: design tokens as CSS custom properties, declared once with
  `light-dark()`, plus the Tailwind v4 theme bridge. Appearance, brand and
  density are three independent attributes.
- `@bwmp-dev/ui`: around 45 components over Base UI, with `DataTable` (TanStack
  Table v9) and the TanStack Form bindings behind optional subpaths.
- `@bwmp-dev/hooks`, `@bwmp-dev/utils`, `@bwmp-dev/icons`: the supporting packages.
- `@bwmp-dev/create-stack`: `pnpm stack create <name> --type app|site|fullstack`.
