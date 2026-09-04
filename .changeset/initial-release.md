---
'@stack/config-typescript': minor
'@stack/config-eslint': minor
'@stack/create-stack': minor
'@stack/tokens': minor
'@stack/hooks': minor
'@stack/icons': minor
'@stack/utils': minor
'@stack/ui': minor
---

First release.

- `@stack/tokens`: design tokens as CSS custom properties, declared once with
  `light-dark()`, plus the Tailwind v4 theme bridge. Appearance, brand and
  density are three independent attributes.
- `@stack/ui`: around 45 components over Base UI, with `DataTable` (TanStack
  Table v9) and the TanStack Form bindings behind optional subpaths.
- `@stack/hooks`, `@stack/utils`, `@stack/icons`: the supporting packages.
- `@stack/create-stack`: `pnpm stack create <name> --type app|site|fullstack`.
