import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { TEMPLATES, TEMPLATE_IDS } from './templates.mjs'
import { directoryNameFor, generate, isInsideRepo, validateName } from './generate.mjs'

const HELP = `
Create a project from one of the stack templates.

Usage
  stack create [name] [options]

Options
  --type <app|site|fullstack>   Which template to use
  --dir <path>                  Where to create it (default: ./<name>)
  --no-example                  Application only: omit the sample feature
  --no-playwright               Application only: omit the end-to-end tests
  --no-install                  Skip installing dependencies
  --no-git                      Skip initialising a git repository
  --pm <pnpm|npm|yarn|bun>      Package manager (default: pnpm)
  -y, --yes                     Accept defaults instead of prompting
  -h, --help                    Show this

Examples
  stack create provenance --type app
  stack create provenance-site --type site --no-install
  stack create summa --type app --no-example
`

/**
 * Only the flags below are offered, and each one changes something separable.
 *
 * There is deliberately no `--no-query` or `--no-table`: in the application
 * template those are not add-ons, they are the data layer. Removing Query would
 * mean rewriting every route, which is a different template rather than a flag.
 * `--no-example` is the honest version of that question — it removes the sample
 * feature, which is the only thing using Table and Form.
 */
export function parseArgs(argv) {
  const options = {
    command: null,
    name: null,
    type: null,
    dir: null,
    example: true,
    playwright: true,
    install: true,
    git: true,
    packageManager: 'pnpm',
    yes: false,
    help: false,
  }

  const positional = []

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = () => argv[(index += 1)]

    switch (arg) {
      case '-h':
      case '--help':
        options.help = true
        break
      case '-y':
      case '--yes':
        options.yes = true
        break
      case '--type':
        options.type = next()
        break
      case '--dir':
        options.dir = next()
        break
      case '--pm':
        options.packageManager = next()
        break
      case '--example':
        options.example = true
        break
      case '--no-example':
        options.example = false
        break
      case '--playwright':
        options.playwright = true
        break
      case '--no-playwright':
        options.playwright = false
        break
      case '--no-install':
        options.install = false
        break
      case '--no-git':
        options.git = false
        break
      default:
        if (arg?.startsWith('-')) throw new Error(`Unknown option: ${arg}`)
        if (arg !== undefined) positional.push(arg)
    }
  }

  // `stack create name` and `stack name` both work; the verb is optional.
  if (positional[0] === 'create') positional.shift()
  options.command = 'create'
  options.name = positional[0] ?? null

  return options
}

const style = {
  bold: (text) => `[1m${text}[0m`,
  dim: (text) => `[2m${text}[0m`,
  accent: (text) => `[36m${text}[0m`,
  error: (text) => `[31m${text}[0m`,
  ok: (text) => `[32m${text}[0m`,
}

async function prompt(rl, question, fallback) {
  const suffix = fallback === undefined ? '' : style.dim(` (${fallback})`)
  const answer = (await rl.question(`${style.accent('?')} ${question}${suffix} `)).trim()
  return answer || fallback
}

async function promptChoice(rl, question, choices) {
  console.log(`${style.accent('?')} ${question}`)
  for (const [index, choice] of choices.entries()) {
    console.log(`  ${style.bold(String(index + 1))}. ${choice.title} ${style.dim(choice.summary)}`)
  }

  for (;;) {
    const answer = (await rl.question('  Choose 1-' + choices.length + ' (1) ')).trim() || '1'
    const index = Number(answer) - 1
    if (Number.isInteger(index) && choices[index]) return choices[index]
    console.log(style.error('  Enter one of the numbers above.'))
  }
}

async function promptYesNo(rl, question, fallback) {
  const answer = await prompt(rl, question, fallback ? 'Y/n' : 'y/N')
  if (answer === 'Y/n') return true
  if (answer === 'y/N') return false
  return /^y(es)?$/i.test(answer)
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' })
  return result.status === 0
}

export async function main(argv) {
  let options
  try {
    options = parseArgs(argv)
  } catch (error) {
    console.error(style.error(error.message))
    console.log(HELP)
    return 1
  }

  if (options.help) {
    console.log(HELP)
    return 0
  }

  const interactive = stdin.isTTY && !options.yes
  const rl = interactive ? createInterface({ input: stdin, output: stdout }) : null

  try {
    let name = options.name
    if (!name) {
      if (!rl) {
        console.error(style.error('A project name is required in non-interactive mode.'))
        return 1
      }
      for (;;) {
        name = await prompt(rl, 'Project name?', 'my-app')
        const problem = validateName(name)
        if (!problem) break
        console.log(style.error(`  ${problem}`))
      }
    }

    const problem = validateName(name)
    if (problem) {
      console.error(style.error(problem))
      return 1
    }

    let type = options.type
    if (type && !TEMPLATE_IDS.includes(type)) {
      console.error(style.error(`Unknown type "${type}". Expected one of: ${TEMPLATE_IDS.join(', ')}`))
      return 1
    }
    if (!type) {
      if (!rl) {
        console.error(style.error('--type is required in non-interactive mode.'))
        return 1
      }
      const choice = await promptChoice(
        rl,
        'Project type?',
        TEMPLATE_IDS.map((id) => ({ id, ...TEMPLATES[id] })),
      )
      type = choice.id
    }

    const template = TEMPLATES[type]
    let { example, playwright } = options

    if (rl && template.supportsExample && options.example) {
      example = await promptYesNo(rl, 'Include the sample feature (table, form, CRUD)?', true)
    }
    if (rl && template.supportsPlaywright && options.playwright) {
      playwright = await promptYesNo(rl, 'Include Playwright end-to-end tests?', true)
    }
    if (!template.supportsPlaywright) playwright = false
    if (!template.supportsExample) example = true

    const target = resolve(options.dir ?? directoryNameFor(name))
    rl?.close()

    console.log()
    console.log(`Creating ${style.bold(name)} in ${style.dim(relative(process.cwd(), target) || '.')}`)

    const { external } = await generate({ type, projectName: name, target, playwright, example })

    console.log(
      style.dim(
        external
          ? '  Shared packages pinned to their published versions.'
          : '  Inside the monorepo: shared packages linked with workspace:*.',
      ),
    )

    if (options.git && !existsSync(resolve(target, '.git')) && !isInsideRepo(target)) {
      if (run('git', ['init', '--quiet'], target)) {
        run('git', ['add', '-A'], target)
        console.log(style.dim('  Initialised a git repository.'))
      }
    }

    if (options.install) {
      console.log(style.dim(`  Installing with ${options.packageManager}…`))
      if (!run(options.packageManager, ['install'], target)) {
        console.log(style.error('  Install failed. Run it yourself once the problem is fixed.'))
      }
    }

    const directory = relative(process.cwd(), target)
    console.log()
    console.log(style.ok('Done.'))
    console.log()
    if (directory) console.log(`  cd ${directory}`)
    if (!options.install) console.log(`  ${options.packageManager} install`)
    console.log(`  ${options.packageManager} dev`)
    console.log()

    return 0
  } catch (error) {
    console.error(style.error(error instanceof Error ? error.message : String(error)))
    return 1
  } finally {
    rl?.close()
  }
}
