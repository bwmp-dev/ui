import { react } from '@bwmp-dev/eslint-config/react'

export default [
  ...react,
  // .astro files need the Astro parser; the React rules do not apply to them.
  { ignores: ['**/*.astro', '.astro/**', 'dist/**'] },
]
