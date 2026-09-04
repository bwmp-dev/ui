import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'
import { base } from './base.js'

/** Rules for portable React libraries: no bundler/runtime assumptions. */
export const react = tseslint.config(
  ...base,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 19 passes `ref` as a normal prop; forwardRef is legacy.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'react',
              importNames: ['forwardRef'],
              message:
                'React 19 accepts `ref` as a regular prop. Type it on the props interface instead.',
            },
          ],
        },
      ],
    },
  },
  {
    // Base UI's `render` prop takes element *templates* whose children and href
    // are supplied later. The static a11y checks cannot see that.
    files: ['**/*.test.{ts,tsx}', '**/*.stories.tsx'],
    rules: {
      'jsx-a11y/anchor-has-content': 'off',
      'jsx-a11y/anchor-is-valid': 'off',
      'jsx-a11y/heading-has-content': 'off',
    },
  },
)

export default react
