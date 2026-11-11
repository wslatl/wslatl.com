import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import oxlint from 'eslint-plugin-oxlint'

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    '.next-static-history/**',
    '.updater/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // The shared kit's files, copied in whole by npm run platform:sync. Oxlint
    // still lints them with this site's rules; ESLint's Next.js set is left to
    // the kit's own repo, and platform:check fails if one is edited here. The
    // knowledge base leaves out the same three.
    'platform/**',
    'scripts/serve.mjs',
    'scripts/updater/**',
  ]),
  // Oxlint runs first (see the lint script); this turns off every ESLint rule
  // it already covers, so ESLint only adds what Oxlint cannot check yet (the
  // React Compiler hook rules and the rest of the Next.js set). Keep it last.
  ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
])
