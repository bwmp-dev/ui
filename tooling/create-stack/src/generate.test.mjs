import { strict as assert } from 'node:assert'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'
import { directoryNameFor, generate, validateName } from './generate.mjs'
import { parseArgs } from './cli.mjs'

const workspaces = []

async function scratch() {
  const dir = await mkdtemp(join(tmpdir(), 'stack-create-'))
  workspaces.push(dir)
  return join(dir, 'project')
}

after(async () => {
  for (const dir of workspaces) await rm(dir, { recursive: true, force: true })
})

describe('validateName', () => {
  it('accepts plain and scoped names', () => {
    assert.equal(validateName('provenance'), null)
    assert.equal(validateName('@acme/provenance'), null)
  })

  it('rejects anything npm would', () => {
    assert.ok(validateName(''))
    assert.ok(validateName('My App'))
    assert.ok(validateName('.hidden'))
  })
})

describe('directoryNameFor', () => {
  it('drops the scope', () => {
    assert.equal(directoryNameFor('@acme/provenance'), 'provenance')
    assert.equal(directoryNameFor('provenance'), 'provenance')
  })
})

describe('parseArgs', () => {
  it('reads a name with or without the verb', () => {
    assert.equal(parseArgs(['create', 'provenance']).name, 'provenance')
    assert.equal(parseArgs(['provenance']).name, 'provenance')
  })

  it('defaults the optional features on', () => {
    const options = parseArgs(['create', 'x', '--type', 'app'])
    assert.equal(options.type, 'app')
    assert.equal(options.example, true)
    assert.equal(options.playwright, true)
  })

  it('turns them off', () => {
    const options = parseArgs(['x', '--no-example', '--no-playwright', '--no-install'])
    assert.equal(options.example, false)
    assert.equal(options.playwright, false)
    assert.equal(options.install, false)
  })

  it('rejects unknown options rather than ignoring them', () => {
    assert.throws(() => parseArgs(['x', '--turbo-mode']), /Unknown option/)
  })
})

describe('generate', () => {
  it('produces a renamed project with published dependency ranges', async () => {
    const target = await scratch()
    await generate({ type: 'app', projectName: 'provenance', target, playwright: true, example: true })

    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'))
    assert.equal(pkg.name, 'provenance')
    assert.equal(pkg.private, true)

    // Outside the monorepo, workspace: and catalog: protocols are meaningless.
    const ranges = Object.values({ ...pkg.dependencies, ...pkg.devDependencies })
    assert.ok(!ranges.some((range) => range.startsWith('workspace:')))
    assert.ok(!ranges.some((range) => range === 'catalog:'))

    assert.ok(existsSync(join(target, 'src/routes/_app/devices.tsx')))
    assert.ok(existsSync(join(target, '.env')), '.env is created from .env.example')
    assert.ok(!existsSync(join(target, 'node_modules')))
    assert.ok(!existsSync(join(target, 'dist')))
  })

  it('omits the sample feature and its dependencies', async () => {
    const target = await scratch()
    await generate({ type: 'app', projectName: 'summa', target, playwright: false, example: false })

    assert.ok(!existsSync(join(target, 'src/features/devices')))
    assert.ok(!existsSync(join(target, 'src/routes/_app/devices.tsx')))
    assert.ok(!existsSync(join(target, 'e2e')))
    assert.ok(!existsSync(join(target, 'playwright.config.ts')))

    // The wiring stays: routing, auth, the API client, error handling.
    assert.ok(existsSync(join(target, 'src/api/client.ts')))
    assert.ok(existsSync(join(target, 'src/features/auth/auth-provider.tsx')))
    assert.ok(existsSync(join(target, 'src/routes/_app/index.tsx')))

    // The mock API is wiring, not example content: the API client imports it,
    // so removing it would leave the project unable to compile.
    assert.ok(existsSync(join(target, 'src/mocks/backend.ts')))

    // Navigation is rewritten rather than patched, so nothing points at the
    // route that was just deleted.
    const navigation = await readFile(join(target, 'src/config/navigation.ts'), 'utf8')
    assert.ok(!navigation.includes('/devices'))
    assert.ok(navigation.includes('/settings'))

    const pkg = JSON.parse(await readFile(join(target, 'package.json'), 'utf8'))
    assert.equal(pkg.dependencies['@tanstack/react-table'], undefined)
    assert.equal(pkg.devDependencies['@playwright/test'], undefined)
    assert.equal(pkg.scripts['test:e2e'], undefined)
    // Query stays: it is the data layer, not an optional extra.
    assert.ok(pkg.dependencies['@tanstack/react-query'])
  })

  it('refuses to overwrite a non-empty directory', async () => {
    const target = await scratch()
    await generate({ type: 'site', projectName: 'a-site', target, playwright: false, example: true })
    await assert.rejects(
      generate({ type: 'site', projectName: 'a-site', target, playwright: false, example: true }),
      /already exists/,
    )
  })
})
