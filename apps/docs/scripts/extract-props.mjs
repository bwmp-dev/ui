import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

/**
 * Read the props of every exported `*Props` type in @bwmp-dev/ui straight from the
 * source, using the TypeScript compiler, and write them to a JSON file the docs
 * import.
 *
 * This runs as a build step rather than inside a component: the extractor needs
 * real filesystem paths, and Astro bundles component code to a location where
 * `import.meta.url` no longer points anywhere useful.
 *
 * Hand-written API tables drift the moment someone adds a prop, and nobody
 * notices until a reader is confused. This reads the same declarations the
 * compiler reads, so the tables are wrong only if the code is.
 *
 * Props inherited from the underlying DOM element are deliberately excluded:
 * listing all 250 attributes of `<button>` is noise. The component pages say
 * which element the rest come from instead.
 */
const HERE = dirname(fileURLToPath(import.meta.url))
const UI_SRC = resolve(HERE, '..', '..', '..', 'packages', 'ui', 'src')
const OUTPUT = resolve(HERE, '..', 'src', 'generated', 'props.json')

function isOwnDeclaration(declaration) {
  const file = declaration?.getSourceFile()?.fileName
  return Boolean(file && resolve(file).startsWith(UI_SRC))
}

function jsDocOf(symbol, checker) {
  const comment = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()
  return comment || null
}

/** `'a' | 'b' | undefined` reads better as `'a' | 'b'` next to an Optional flag. */
function formatType(text) {
  return text
    .replace(/ \| undefined$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function defaultValueOf(symbol) {
  for (const tag of symbol.getJsDocTags()) {
    if (tag.name !== 'default' && tag.name !== 'defaultValue') continue
    return ts.displayPartsToString(tag.text).trim()
  }
  return null
}

function extractProps() {
  const configPath = join(UI_SRC, '..', 'tsconfig.json')
  const raw = ts.readConfigFile(configPath, (path) => readFileSync(path, 'utf8'))
  const parsed = ts.parseJsonConfigFileContent(raw.config, ts.sys, join(UI_SRC, '..'))

  const program = ts.createProgram(parsed.fileNames, {
    ...parsed.options,
    noEmit: true,
    skipLibCheck: true,
  })
  const checker = program.getTypeChecker()

  const result = {}

  for (const sourceFile of program.getSourceFiles()) {
    if (!resolve(sourceFile.fileName).startsWith(UI_SRC)) continue
    if (sourceFile.fileName.includes('.test.')) continue

    const moduleSymbol = checker.getSymbolAtLocation(sourceFile)
    if (!moduleSymbol) continue

    for (const exported of checker.getExportsOfModule(moduleSymbol)) {
      const name = exported.getName()
      if (!name.endsWith('Props')) continue

      const declaration = exported.declarations?.[0]
      if (!declaration) continue

      const type = checker.getDeclaredTypeOfSymbol(exported)
      const props = []

      for (const property of checker.getPropertiesOfType(type)) {
        const propDeclaration = property.declarations?.[0]
        // Keep only what this design system declares; the rest are the DOM's.
        if (!isOwnDeclaration(propDeclaration)) continue

        const propType = checker.getTypeOfSymbolAtLocation(property, propDeclaration)
        props.push({
          name: property.getName(),
          type: formatType(checker.typeToString(propType)),
          optional: Boolean(property.flags & ts.SymbolFlags.Optional),
          description: jsDocOf(property, checker),
          defaultValue: defaultValueOf(property),
        })
      }

      if (props.length === 0) continue

      result[name] = {
        name,
        description: jsDocOf(exported, checker),
        props: props.sort((a, b) => {
          if (a.optional !== b.optional) return a.optional ? 1 : -1
          return a.name.localeCompare(b.name)
        }),
      }
    }
  }

  return result
}

const props = extractProps()
mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(
  OUTPUT,
  `${JSON.stringify(props, null, 2)}
`,
)
console.log(`Extracted ${Object.keys(props).length} prop types to src/generated/props.json`)
