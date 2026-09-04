# @stack/create-stack

Generates a project from one of the templates in `templates/`.

```bash
pnpm stack create provenance --type app
```

## What it does

Generation is a copy plus a small, explicit set of edits. The templates are
ordinary workspace packages that CI builds, lints and tests, so they cannot rot
into something that no longer compiles — and the generator never patches
template source, only deletes whole files and writes new ones.

It renames the package, rewrites the dependency ranges, creates `.env` from
`.env.example`, writes a README, and optionally initialises git and installs.

Inside this monorepo the shared packages stay on `workspace:*`, so a generated
project picks up local changes immediately. Outside it, `workspace:*` and
`catalog:` are rewritten to real version ranges.

## Options

```
--type <app|site|fullstack>   Which template to use
--dir <path>                  Where to create it (default: ./<name>)
--no-example                  Application only: omit the sample feature
--no-playwright               Application only: omit the end-to-end tests
--no-install                  Skip installing dependencies
--no-git                      Skip initialising a git repository
--pm <pnpm|npm|yarn|bun>      Package manager (default: pnpm)
-y, --yes                     Accept defaults instead of prompting
```

With a name and `--type` it runs without prompting, which is what you want in a
script.

## Why there is no `--no-query` or `--no-table`

Those are not add-ons in the application template; they are its data layer.
Removing TanStack Query would mean rewriting every route and the whole API
integration — that is a different template, not a flag, and maintaining both
means one of them is always the broken one.

`--no-example` is the honest version of the same question. It removes the
sample feature, which is the only thing using Table and Form, and leaves the
wiring: routing, protected routes, the API client, error handling, the app
shell, the command palette and the settings page.

`--no-playwright` exists because the end-to-end tests genuinely are separable —
a directory, a config file and one dependency.

## Publishing

`prepack` copies the templates into the package and freezes the versions it
would otherwise read from the monorepo, so an installed CLI is self-contained.
That copy is gitignored; the templates in `/templates` remain the only editable
ones, and they win whenever the monorepo is present.
