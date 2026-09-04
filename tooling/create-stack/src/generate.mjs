import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ALWAYS_EXCLUDE,
  PLAYWRIGHT_DEPENDENCIES,
  PLAYWRIGHT_PATHS,
  TEMPLATES,
  WORKSPACE_PACKAGE_DIRECTORIES,
  WORKSPACE_PACKAGES,
} from './templates.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const PACKAGE_ROOT = resolve(HERE, '..')

/** The monorepo root, resolved from this file rather than the cwd. */
export const REPO_ROOT = resolve(PACKAGE_ROOT, '..', '..')

/**
 * Templates live in the monorepo during development and are copied into the
 * package by `prepack` for publishing, so an installed CLI is self-contained.
 *
 * The monorepo copy wins when it exists: a stale bundle left over from a local
 * `prepack` must never shadow the templates you are actually editing.
 */
export function templateDirectory(type) {
  const name = TEMPLATES[type].directory
  const local = join(REPO_ROOT, 'templates', name)
  return existsSync(local) ? local : join(PACKAGE_ROOT, 'templates', name)
}

/** Versions baked in at publish time, used only when the monorepo is absent. */
function bundledVersions() {
  if (existsSync(join(REPO_ROOT, 'pnpm-workspace.yaml'))) return null
  const path = join(PACKAGE_ROOT, 'templates', 'versions.json')
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}

/**
 * A project name that is valid as an npm package name and as a directory.
 * Returns an error message, or null when it is fine.
 */
export function validateName(name) {
  if (!name || !name.trim()) return 'Enter a project name.'
  if (name.length > 200) return 'That name is too long.'
  if (name.startsWith('.') || name.startsWith('_')) return 'Names cannot start with . or _'
  if (!/^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(name)) {
    return 'Use lower-case letters, digits and dashes (an npm scope is allowed).'
  }
  return null
}

/** `@acme/my-app` → `my-app`, for the default directory name. */
export function directoryNameFor(projectName) {
  return projectName.startsWith('@') ? (projectName.split('/')[1] ?? projectName) : projectName
}

/** True when `target` sits inside this monorepo, where workspace: links work. */
export function isInsideRepo(target) {
  const rel = relative(REPO_ROOT, resolve(target))
  // `relative` returns an absolute path when the two are on different drives.
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel)
}

async function copyTemplate(from, to) {
  await mkdir(to, { recursive: true })

  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (ALWAYS_EXCLUDE.has(entry.name)) continue

    const source = join(from, entry.name)
    const destination = join(to, entry.name)

    if (entry.isDirectory()) await copyTemplate(source, destination)
    else await cp(source, destination)
  }
}

async function removePaths(root, paths) {
  for (const path of paths) {
    await rm(join(root, path), { recursive: true, force: true })
  }
}

/**
 * Rewrite package.json for the generated project.
 *
 * Inside the monorepo the `workspace:*` links are kept, so a generated project
 * picks up local changes to the shared packages immediately. Outside it they
 * are pinned to the published versions.
 */
async function writePackageJson(root, { projectName, external, playwright, example, type }) {
  const path = join(root, 'package.json')
  const pkg = JSON.parse(await readFile(path, 'utf8'))

  pkg.name = projectName
  pkg.version = '0.1.0'
  pkg.private = true
  delete pkg.publishConfig

  if (external) {
    const versions = await publishedVersions()
    for (const field of ['dependencies', 'devDependencies']) {
      const deps = pkg[field]
      if (!deps) continue
      for (const name of WORKSPACE_PACKAGES) {
        if (deps[name] === undefined) continue
        deps[name] = versions[name] ?? '^0.1.0'
      }
      // `catalog:` only resolves inside the workspace that declares it.
      for (const [name, range] of Object.entries(deps)) {
        if (range === 'catalog:') deps[name] = await catalogVersion(name)
      }
    }
  }

  if (!playwright) {
    for (const name of PLAYWRIGHT_DEPENDENCIES) delete pkg.devDependencies?.[name]
    delete pkg.scripts?.['test:e2e']
  }

  if (!example) {
    for (const name of TEMPLATES[type].exampleDependencies) {
      delete pkg.dependencies?.[name]
      delete pkg.devDependencies?.[name]
    }
  }

  await writeFile(path, `${JSON.stringify(pkg, null, 2)}\n`)
}

let catalogCache = null

/** Read the workspace catalog so external projects get the same versions. */
async function catalogVersion(name) {
  if (!catalogCache) {
    const bundled = bundledVersions()
    if (bundled) {
      catalogCache = bundled.catalog
      return catalogCache[name] ?? 'latest'
    }
    const yaml = await readFile(join(REPO_ROOT, 'pnpm-workspace.yaml'), 'utf8')
    catalogCache = {}
    const section = yaml.split(/^catalog:\s*$/m)[1] ?? ''
    for (const line of section.split('\n')) {
      const match = /^\s{2}'?([^':\s]+)'?:\s*(.+?)\s*$/.exec(line)
      if (!match) {
        if (line.trim() && !line.startsWith('  ')) break
        continue
      }
      catalogCache[match[1]] = match[2]
    }
  }
  return catalogCache[name] ?? 'latest'
}

let versionCache = null

async function publishedVersions() {
  if (versionCache) return versionCache

  const bundled = bundledVersions()
  if (bundled) {
    versionCache = bundled.packages
    return versionCache
  }

  versionCache = {}
  for (const name of WORKSPACE_PACKAGES) {
    const directory = WORKSPACE_PACKAGE_DIRECTORIES[name]
    const path = join(REPO_ROOT, 'packages', directory, 'package.json')
    if (!existsSync(path)) continue
    const pkg = JSON.parse(await readFile(path, 'utf8'))
    versionCache[name] = `^${pkg.version}`
  }
  return versionCache
}

/**
 * Rewrite the navigation so it no longer points at the removed feature.
 *
 * The template keeps its sections in one file precisely so this is a whole-file
 * replacement. The generator never patches template source — a search-and-
 * replace would break silently the next time the template changes.
 */
async function writeNavigation(root) {
  await writeFile(
    join(root, 'src/config/navigation.ts'),
    `import { Settings } from 'lucide-react'
import type { IconComponent } from '@bwmp-dev/icons'

/**
 * The application's navigation, in one place.
 *
 * The sidebar and the command palette read from here, so adding a section is a
 * one-line change. \`to\` is checked against the generated route tree.
 */
export type NavItem = {
  to: '/settings'
  label: string
  icon: IconComponent
  /** Extra terms that should match this entry in the command palette. */
  keywords?: string[]
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: Settings, keywords: ['preferences', 'theme'] },
]
`,
  )
}

/**
 * Replace the sample feature's route with a starting page.
 */
async function writeStarterRoute(root, projectName) {
  const path = join(root, 'src/routes/_app/index.tsx')
  await mkdir(dirname(path), { recursive: true })
  await writeFile(
    path,
    `import { createFileRoute } from '@tanstack/react-router'
import { EmptyState, Page, PageHeader } from '@bwmp-dev/ui'
import { Rocket } from 'lucide-react'

export const Route = createFileRoute('/_app/')({
  component: HomePage,
})

function HomePage() {
  return (
    <Page>
      <PageHeader
        title="${projectName}"
        description="The shell, routing, auth and API layer are wired up. Add your first feature under src/features."
      />
      <EmptyState
        icon={Rocket}
        title="Nothing here yet"
        description="Create a folder under src/features, add a route beside this one, and delete this page."
      />
    </Page>
  )
}
`,
  )
}

async function writeReadme(root, { projectName, type, playwright }) {
  const template = TEMPLATES[type]
  const commands = [
    '```bash',
    'pnpm install',
    'pnpm dev',
    '```',
    '',
    '## Commands',
    '',
    '```bash',
    'pnpm dev        # development server',
    'pnpm build      # production build',
    'pnpm lint',
    'pnpm typecheck',
    type === 'site' ? null : 'pnpm test       # unit tests',
    playwright ? 'pnpm test:e2e   # end-to-end tests' : null,
    '```',
  ].filter((line) => line !== null)

  await writeFile(
    join(root, 'README.md'),
    `# ${projectName}

${template.summary}

## Getting started

${commands.join('\n')}

## Where things go

Application code is organised by feature, not by file type. A feature owns its
components, hooks, queries, API calls and schema; anything genuinely shared
moves up into \`src/components\` or \`src/lib\` once there is a second user.

Design tokens come from \`@bwmp-dev/tokens\` and components from \`@bwmp-dev/ui\`.
To rebrand, override the custom properties in \`src/styles.css\` — there is
never a reason to fork the component library.
`,
  )
}

export async function generate(options) {
  const { type, projectName, target, playwright, example } = options
  const source = templateDirectory(type)

  if (!existsSync(source)) throw new Error(`Template not found: ${source}`)
  if (existsSync(target) && (await readdir(target)).length > 0) {
    throw new Error(`${target} already exists and is not empty.`)
  }

  await copyTemplate(source, target)

  const external = !isInsideRepo(target)

  if (!playwright) await removePaths(target, PLAYWRIGHT_PATHS)

  if (!example && TEMPLATES[type].supportsExample) {
    await removePaths(target, TEMPLATES[type].examplePaths)
    await writeStarterRoute(target, projectName)
    await writeNavigation(target)
  }

  await writePackageJson(target, { projectName, external, playwright, example, type })
  await writeReadme(target, { projectName, type, playwright })

  // `.env` is gitignored, so the template ships `.env.example`; a generated
  // project needs the real file to run at all.
  const envExample = join(target, '.env.example')
  if (existsSync(envExample)) await cp(envExample, join(target, '.env'))

  return { external }
}
