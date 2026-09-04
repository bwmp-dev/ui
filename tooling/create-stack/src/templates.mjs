/**
 * What each template is, and what the generator is allowed to change about it.
 *
 * The templates are ordinary workspace packages that CI builds and tests, so
 * they cannot rot. Generation is therefore a copy plus a small, explicit set of
 * edits — never a code generator with its own idea of what the project is.
 */

export const TEMPLATES = {
  app: {
    directory: 'app',
    title: 'Application',
    summary: 'Vite, TanStack Router, Query, Table and Form. A dashboard or internal tool.',
    supportsPlaywright: true,
    supportsExample: true,
    /**
     * Everything that exists purely to demonstrate the architecture. Removing
     * it leaves the wiring — routing, auth, the API client, error handling —
     * with nothing on top.
     *
     * `src/mocks` is deliberately absent from this list. It is wiring, not
     * example content: the API client imports it, and a generated project wants
     * a working stand-in backend from the first run. It declares its own
     * shapes, so removing the devices feature does not break it.
     */
    examplePaths: [
      'src/features/devices',
      'src/routes/_app/devices.tsx',
      'e2e/devices-crud.spec.ts',
      'e2e/overlays.spec.ts',
    ],
    /** Dependencies only the example needs. */
    exampleDependencies: ['@tanstack/react-table', '@tanstack/react-form'],
  },

  site: {
    directory: 'site',
    title: 'Website',
    summary: 'Astro with React islands. A project or marketing site.',
    supportsPlaywright: false,
    supportsExample: false,
    examplePaths: [],
    exampleDependencies: [],
  },

  fullstack: {
    directory: 'fullstack',
    title: 'Full-stack',
    summary: 'TanStack Start. SSR with server functions, for a JavaScript backend.',
    supportsPlaywright: false,
    supportsExample: false,
    examplePaths: [],
    exampleDependencies: [],
  },
}

export const TEMPLATE_IDS = Object.keys(TEMPLATES)

/** Never copied into a generated project. */
export const ALWAYS_EXCLUDE = new Set([
  'node_modules',
  'dist',
  '.output',
  '.astro',
  '.turbo',
  'coverage',
  'playwright-report',
  'test-results',
  '.env',
  'routeTree.gen.ts',
  'CHANGELOG.md',
])

export const PLAYWRIGHT_PATHS = ['e2e', 'playwright.config.ts']
export const PLAYWRIGHT_DEPENDENCIES = ['@playwright/test']

/**
 * Workspace packages a generated project depends on. Outside the monorepo the
 * `workspace:*` protocol is meaningless, so these are rewritten to a version
 * range against the published packages.
 */
export const WORKSPACE_PACKAGES = [
  '@stack/tokens',
  '@stack/ui',
  '@stack/hooks',
  '@stack/utils',
  '@stack/icons',
  '@stack/config-eslint',
  '@stack/config-typescript',
]
