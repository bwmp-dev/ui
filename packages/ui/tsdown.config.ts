import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    table: 'src/table/index.ts',
    form: 'src/form/index.tsx',
  },
  format: 'esm',
  dts: true,
  clean: true,
  external: ['@tanstack/react-table', '@tanstack/react-form'],
})
