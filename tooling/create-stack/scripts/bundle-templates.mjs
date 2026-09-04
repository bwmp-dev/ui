import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ALWAYS_EXCLUDE,
  TEMPLATES,
  WORKSPACE_PACKAGE_DIRECTORIES,
  WORKSPACE_PACKAGES,
} from '../src/templates.mjs'

/**
 * Copy the templates into the package so a published CLI is self-contained,
 * and freeze the versions it would otherwise read from the monorepo.
 *
 * Run by `prepack`. The output is gitignored: the templates in `templates/`
 * remain the only editable copy.
 */
const PACKAGE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const REPO_ROOT = resolve(PACKAGE_ROOT, '..', '..')
const OUT = join(PACKAGE_ROOT, 'templates')

async function copyFiltered(from, to) {
  await mkdir(to, { recursive: true })
  for (const entry of await readdir(from, { withFileTypes: true })) {
    if (ALWAYS_EXCLUDE.has(entry.name)) continue
    const source = join(from, entry.name)
    const destination = join(to, entry.name)
    if (entry.isDirectory()) await copyFiltered(source, destination)
    else await cp(source, destination)
  }
}

await rm(OUT, { recursive: true, force: true })

for (const template of Object.values(TEMPLATES)) {
  await copyFiltered(
    join(REPO_ROOT, 'templates', template.directory),
    join(OUT, template.directory),
  )
}

const packages = {}
for (const name of WORKSPACE_PACKAGES) {
  const path = join(REPO_ROOT, 'packages', WORKSPACE_PACKAGE_DIRECTORIES[name], 'package.json')
  try {
    packages[name] = `^${JSON.parse(await readFile(path, 'utf8')).version}`
  } catch {
    // Not every workspace package is published; the generator falls back.
  }
}

const catalog = {}
const yaml = await readFile(join(REPO_ROOT, 'pnpm-workspace.yaml'), 'utf8')
for (const line of (yaml.split(/^catalog:\s*$/m)[1] ?? '').split('\n')) {
  const match = /^\s{2}'?([^':\s]+)'?:\s*(.+?)\s*$/.exec(line)
  if (!match) {
    if (line.trim() && !line.startsWith('  ')) break
    continue
  }
  catalog[match[1]] = match[2]
}

await writeFile(join(OUT, 'versions.json'), `${JSON.stringify({ packages, catalog }, null, 2)}\n`)

console.log(`Bundled ${Object.keys(TEMPLATES).length} templates into ${OUT}`)
