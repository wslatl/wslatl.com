import type { ReactNode } from 'react'

/**
 * The tags in the admin's messages, as next-intl's rich text takes them:
 * `t.rich('updates.off.fix', { count, code })`. Made once, here, rather than
 * inside a component on every render.
 */

/** <hidden>: words only a screen reader hears, such as the brand before "Admin". */
export const hidden = (chunks: ReactNode) => <span className="sr-only">{chunks}</span>

/** <code>: a file, a folder or a command. */
export const code = (chunks: ReactNode) => <code className="font-mono">{chunks}</code>

/** <code> for a long path, which may break anywhere on a phone. */
export const longCode = (chunks: ReactNode) => <code className="font-mono break-all">{chunks}</code>

/** <mono>: a release tag or a commit, in the monospace face. */
export const mono = (chunks: ReactNode) => <span className="font-mono">{chunks}</span>
