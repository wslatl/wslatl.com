import { fileURLToPath } from 'node:url'
import { configDefaults, defineConfig } from 'vitest/config'

// Two sets of tests. `npm test` runs everything under tests/ but tests/http,
// which needs a build: `npm run test:http` (vitest --mode http) runs only
// that, after `npm run build`, against `next start`.
export default defineConfig(({ mode }) => ({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./', import.meta.url)) },
  },
  test: {
    include: mode === 'http' ? ['tests/http/**/*.test.ts'] : ['tests/**/*.test.ts'],
    exclude: mode === 'http' ? configDefaults.exclude : [...configDefaults.exclude, 'tests/http/**'],
    environment: 'node',
  },
}))
