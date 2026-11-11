// This site's settings for the shared kit in platform/. platform/config.mjs
// describes every setting. No updater settings: the release that brings the
// kit is installed by the updater the server already has, which reads none.
import { definePlatformConfig } from './platform/config.mjs'

export default definePlatformConfig({
  name: 'WSLATL',
  url: 'https://wslatl.com',
  repo: 'wslatl/wslatl.com',
  admin: { auth: 'password' },
})
