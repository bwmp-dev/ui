import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Enforce the dependency direction the architecture depends on.
 *
 * ```
 * tokens  ←  utils  ←  hooks  ←  ui  ←  templates  ←  projects
 * ```
 *
 * These rules are documented, and a documented rule that nothing checks stops
 * being true the first time someone is in a hurry. The cost of getting this
 * wrong is not abstract: a React import in `@stack/tokens` makes the tokens
 * unusable from Astro markup or plain CSS, which is most of why they exist.
 */
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const RULES = [
  {
    package: 'tokens',
    /** Runtime dependencies allowed in package.json. */
    allowedDependencies: [],
    /** Import specifiers that must not appear anywhere in src. */
    forbiddenImports: ['react', 'react-dom', '@stack/'],
    because: 'the tokens must work outside React, and outside JavaScript entirely',
  },
  {
    package: 'utils',
    allowedDependencies: ['@stack/tokens', 'clsx', 'tailwind-merge'],
    forbiddenImports: ['react', 'react-dom', '@stack/ui', '@stack/hooks'],
    because: 'the utilities are framework-independent',
  },
  {
    package: 'hooks',
    allowedDependencies: [],
    forbiddenImports: ['@stack/ui', '@stack/tokens', 'lucide-react'],
    because: 'hooks are React and nothing else — no design system, no styling',
  },
  {
    package: 'icons',
    allowedDependencies: [],
    forbiddenImports: ['@stack/ui', '@stack/hooks', 'lucide-react'],
    because: 'icons must not re-export Lucide; a 1500-icon barrel defeats tree shaking',
  },
  {
    package: 'ui',
    allowedDependencies: [
      '@base-ui/react',
      '@stack/hooks',
      '@stack/icons',
      '@stack/tokens',
      '@stack/utils',
      'lucide-react',
    ],
    forbiddenImports: ['@tanstack/react-router', '@tanstack/react-query'],
    because: 'the component system must not know about routing or data fetching',
  },
]

const IMPORT_PATTERN = /(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+['"]([^'"]+)['"]/g

async function sourceFiles(directory) {
  const found = []
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) found.push(...(await sourceFiles(path)))
    else if (/\.(ts|tsx)$/.test(entry.name) && !entry.name.includes('.test.')) found.push(path)
  }
  return found
}

const problems = []

for (const rule of RULES) {
  const root = join(ROOT, 'packages', rule.package)
  const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))

  for (const name of Object.keys(manifest.dependencies ?? {})) {
    if (rule.allowedDependencies.includes(name)) continue
    problems.push(
      `@stack/${rule.package} depends on ${name}, which is not allowed — ${rule.because}.`,
    )
  }

  const source = join(root, 'src')
  if (!existsSync(source)) continue

  for (const file of await sourceFiles(source)) {
    // The optional-peer subpaths are excluded by their own entry points, not
    // by this rule: nothing in the main entry imports them.
    if (file.includes(`${join('src', 'table')}`) || file.includes(`${join('src', 'form')}`))
      continue

    const contents = await readFile(file, 'utf8')
    for (const [, specifier] of contents.matchAll(IMPORT_PATTERN)) {
      const forbidden = rule.forbiddenImports.find(
        (entry) => specifier === entry || specifier.startsWith(entry),
      )
      if (!forbidden) continue
      problems.push(`${file.replace(ROOT, '.')} imports "${specifier}" — ${rule.because}.`)
    }
  }
}

if (problems.length > 0) {
  console.error('Dependency boundaries violated:\n')
  for (const problem of problems) console.error(`  ${problem}`)
  console.error('\nSee apps/docs/src/pages/guides/architecture.mdx.')
  process.exit(1)
}

console.log(`Dependency boundaries hold across ${RULES.length} packages.`)
