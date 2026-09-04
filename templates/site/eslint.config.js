import { react } from '@stack/config-eslint/react'

export default [
  ...react,
  // .astro files need the Astro parser; the React rules do not apply to them.
  { ignores: ['**/*.astro', '.astro/**', 'dist/**'] },
]
