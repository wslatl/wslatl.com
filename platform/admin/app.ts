import 'server-only'
// The one place the kit reads the app it sits in: platform.config.mjs at
// the app's root, two folders up from platform/admin/. The kit's own repo
// has no app around it, so there is nothing at that path there, and its
// tests give this module a config of their own.
// @ts-ignore: the file is the app's own, and exists only in an app.
import platformConfig from '../../platform.config.mjs'
import type { PlatformConfig } from '../config.mjs'
import { createAdmin } from './admin'
import { sharedPassword } from './server/auth'
import { adminApp } from './server/core'

const config = platformConfig as PlatformConfig

/** The app's settings as the admin uses them. */
export const app = adminApp(config)

/**
 * The app's admin as the ready-made files under pages/ and routes/ use it:
 * the shared password when platform.config.mjs says admin.auth "password".
 * With "custom" it is off, and the app makes its own with createAdmin.
 */
export const admin = createAdmin({ config, auth: config.admin.auth === 'password' ? sharedPassword : null })
