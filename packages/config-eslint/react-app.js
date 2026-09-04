import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { react } from './react.js'

/** Rules for Vite-powered React applications (adds fast-refresh safety). */
export const reactApp = tseslint.config(...react, {
  files: ['**/*.{ts,tsx}'],
  plugins: { 'react-refresh': reactRefresh },
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
})

export default reactApp
