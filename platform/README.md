# platform/

This folder is a copy of one version of WSLATL's shared kit, from the private repo `wslatl/platform`. So are `scripts/serve.mjs` and `scripts/updater/`.

**Do not edit these files here.** `npm run platform:check` fails when any of them differs from the version in `platform/VERSION`. Make the change in the kit, release a new kit version, then run `npm run platform:sync -- <version>` in this app.

`platform/MANIFEST.json` lists every file the kit owns in this app, with a hash of each.
