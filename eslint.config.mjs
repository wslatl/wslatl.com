import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import oxlint from 'eslint-plugin-oxlint'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // The shared kit's files (platform/, scripts/serve.mjs, scripts/updater/)
  // are linted here with everything else, so nothing the kit ships may give
  // this site a warning. npm run lint:fix leaves them alone: they change only
  // by npm run platform:sync, and platform:check fails if one is edited here.
  globalIgnores(['.next/**', '.next-static-history/**', '.updater/**', 'out/**', 'build/**', 'next-env.d.ts']),
  // Oxlint runs first (see the lint script); this turns off every ESLint rule
  // it already covers, so ESLint only adds what Oxlint cannot check yet (the
  // React Compiler hook rules and the rest of the Next.js set). Keep it last.
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
])
