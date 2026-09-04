import { react } from '@bwmp-dev/eslint-config/react'

export default [
  ...react,
  { ignores: ['**/*.astro', '.astro/**', 'dist/**', 'src/generated/**'] },
  // Build scripts report what they did; that is their job.
  { files: ['scripts/**/*.mjs'], rules: { 'no-console': 'off' } },
  {
    // Demos show `render` element templates, whose children arrive later.
    files: ['src/demos/**/*.tsx'],
    rules: { 'jsx-a11y/anchor-has-content': 'off', 'jsx-a11y/anchor-is-valid': 'off' },
  },
]
