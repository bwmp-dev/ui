import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { react } from './react.js'

/** Rules for Vite-powered React applications (adds fast-refresh safety). */
export const reactApp = tseslint.config(
  ...react,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: {
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  {
    /*
     * The rule assumes fast refresh needs the component to be the export. In a
     * file-based router the component is registered through the `Route` export
     * and the router's own Vite plugin handles HMR, so the warning is noise for
     * every route file. Entry files have no exports at all.
     */
    files: ['**/routes/**/*.tsx', '**/main.tsx', '**/entry-*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
)

export default reactApp
