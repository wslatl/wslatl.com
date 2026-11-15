#!/usr/bin/env node
import { readdir, readFile, realpath, stat } from 'node:fs/promises'
import { isAbsolute, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { i18nProblems } from '../config.mjs'

/**
 * Checks an app's translations, and the kit's own, in all five languages,
 * so CI can fail on what a reader would trip over:
 *
 *   npm run i18n:check     ("i18n:check": "node platform/tools/i18n-check.mjs")
 *
 * For each folder of messages (the app's messages/<locale>.json, and the
 * kit's platform/i18n/messages/<locale>.json), against English:
 *
 * - a key missing from a language, or one English does not have;
 * - an ICU argument or tag that differs from English ({count, plural} where
 *   English has {count}, {name} where it has {brand}, a missing <link>);
 * - a message that is not valid ICU, or is not text;
 * - an empty message;
 * - an em dash, an en dash or a middle dot, which the brand never uses.
 *
 * And for each folder of long pages that platform.config.mjs names
 * (i18n.pages): a page with no file in a language, and the same three
 * characters in any page. A page is a file a page is written in (Markdown,
 * MDX, a module, HTML, text, JSON or YAML); a picture beside the pages is
 * none. Every one of these is a problem, and the tool exits with 1. A
 * message left the same as English is only a warning: names, brands and
 * codes stay as they are.
 *
 * It reads its folders from platform.config.mjs in the folder it is run
 * from: `i18n.messages` (the app's messages, "messages" unless set) and
 * `i18n.pages`, held to the same rules as definePlatformConfig holds them.
 * Every folder must be inside the app, and no link is followed out of it.
 * What the report prints from the app, a key or a file's name, has its
 * control characters written as escapes, so it cannot fake a line of the
 * CI log. Nothing here imports the app or the kit's TypeScript, so it runs
 * on plain Node in CI.
 */

/** The five languages, as platform/i18n/config.ts has them; a test holds the two together. */
export const locales = Object.freeze(['en', 'es', 'fr', 'de', 'pt'])

/** @type {Record<string, string>} */
const languageNames = { en: 'English', es: 'Spanish', fr: 'French', de: 'German', pt: 'Portuguese' }

/** What the brand never writes, with what to call each one in a report. Made from their code points, so this file holds none of them. */
const forbidden = Object.freeze([
  [String.fromCharCode(0x2014), 'an em dash'],
  [String.fromCharCode(0x2013), 'an en dash'],
  [String.fromCharCode(0xb7), 'a middle dot'],
])

/**
 * The characters among the forbidden ones that a text holds, by name.
 * @param {string} text
 */
function forbiddenIn(text) {
  return forbidden.filter(([character]) => text.includes(character)).map(([, name]) => name)
}

/** Control characters, and the two separators some logs start a line at. Made from code points, as above. */
const unprintable = new RegExp(`[\\x00-\\x1f\\x7f-\\x9f${String.fromCharCode(0x2028, 0x2029)}]`, 'g')

/**
 * Text read from the app, a key or a file's name, as the report shows it:
 * each control character as an escape, such as \x0a for a line break, so
 * nothing in a file can start a line of its own in a CI log, where a line
 * that starts with :: is an instruction to the runner.
 * @param {string} text
 */
export function printable(text) {
  return text.replace(unprintable, (character) => {
    const code = character.charCodeAt(0)
    return code > 0xff ? `\\u${code.toString(16)}` : `\\x${code.toString(16).padStart(2, '0')}`
  })
}

/**
 * A key as the report names it: in double quotes, with anything in it
 * that could break the line written as an escape.
 * @param {string} key
 */
const keyName = (key) => printable(JSON.stringify(key))

// ----- ICU -----

export class IcuError extends Error {}

/**
 * A character an ICU name may hold, as formatjs reads names: anything but
 * white space and the characters ICU keeps for its own syntax, among them
 * . - : and every other ASCII mark but _.
 */
const nameCharacter = /[^\p{White_Space}\p{Pattern_Syntax}]/u
/** The white space formatjs skips between the parts of an argument. */
const spaceCharacter = /\p{Pattern_White_Space}/u
/** A character of a rich text tag's name. */
const tagCharacter = /[\w.-]/
/** The types an argument may have, as formatjs knows them. */
const simpleTypes = Object.freeze(['number', 'date', 'time'])
const optionTypes = Object.freeze(['plural', 'select', 'selectordinal'])

/**
 * What an ICU message takes, as next-intl reads it: each argument by name
 * with the kinds it is used as ("" for a plain {name}, "plural", "select",
 * "date:admin" for {at, date, admin}), and the names of its rich text tags.
 * Throws an IcuError for a message that is not valid ICU, as formatjs, the
 * parser next-intl uses, would refuse it: a name with a character ICU keeps
 * for itself ({user.name}, {a-b}), a type it does not know ({x, foo}), an
 * option given twice, a "=" option that is no whole number, a plural or
 * select with no "other". Quoting follows formatjs too: an apostrophe
 * quotes only when the next character is one of { } < > or, inside a
 * plural, #, and two apostrophes are one. <b/> is plain text, as formatjs
 * reads it, and no tag.
 * @param {string} message
 * @returns {{ args: Map<string, Set<string>>, tags: Set<string> }}
 */
export function icuShape(message) {
  /** @type {Map<string, Set<string>>} */
  const args = new Map()
  /** @type {Set<string>} */
  const tags = new Set()
  const end = message.length
  let at = 0

  /** @param {string} what @returns {never} */
  const fail = (what) => {
    throw new IcuError(`${what} (at character ${at + 1})`)
  }
  const skipSpace = () => {
    while (at < end && spaceCharacter.test(message[at])) at++
  }
  /** A name: of an argument, its type, or an option. Empty when there is none here. */
  const readIdentifier = () => {
    const start = at
    while (at < end && nameCharacter.test(message[at])) at++
    return message.slice(start, at)
  }
  /** A whole number, with a sign or none, as an offset or a "=" option takes. @param {string} what */
  const readInteger = (what) => {
    const start = at
    if (message[at] === '+' || message[at] === '-') at++
    const digits = at
    while (at < end && message[at] >= '0' && message[at] <= '9') at++
    if (at === digits) fail(`${what} is not a whole number`)
    if (!Number.isSafeInteger(Number(message.slice(start, at)))) fail(`${what} is too large a number`)
  }
  /** @param {string} argName @param {string} kind */
  const record = (argName, kind) => {
    const kinds = args.get(argName) ?? new Set()
    kinds.add(kind)
    args.set(argName, kinds)
  }

  /**
   * An apostrophe that starts quoted text, which runs to the next lone one,
   * or to the end when there is none, as formatjs reads it.
   * @param {boolean} inPlural
   */
  function quote(inPlural) {
    const next = message[at + 1]
    if (next === "'") {
      at += 2
      return
    }
    if (!['{', '}', '<', '>'].includes(next) && !(inPlural && next === '#')) {
      at++
      return
    }
    at += 2
    for (;;) {
      if (at >= end) return
      if (message[at] === "'") {
        if (message[at + 1] === "'") {
          at += 2
          continue
        }
        at++
        return
      }
      at++
    }
  }

  /**
   * Text, arguments and tags, up to the end, the "}" that closes an option
   * or cuts a tag short (nested), or the "</" that closes a tag (tag). A
   * "}" outside any option or tag is plain text, as formatjs reads it.
   * @param {boolean} nested
   * @param {boolean} inPlural
   * @param {string | undefined} tag
   */
  function body(nested, inPlural, tag) {
    while (at < end) {
      const character = message[at]
      if (character === "'") quote(inPlural)
      else if (character === '{') argument()
      else if (character === '}') {
        if (nested) return
        at++
      } else if (character === '<' && message[at + 1] === '/') {
        if (tag === undefined) fail('a closing tag with no opening one')
        return
      } else if (character === '<' && /[A-Za-z]/.test(message[at + 1] ?? '')) element(inPlural)
      else at++
    }
    if (tag !== undefined) fail(`<${tag}> is never closed`)
    if (nested) fail('a "{" that is never closed')
  }

  function argument() {
    at++
    skipSpace()
    if (at >= end) fail('a "{" that is never closed')
    if (message[at] === '}') fail('an argument with no name')
    const argName = readIdentifier()
    if (!argName) fail(`an argument whose name starts with "${message[at]}", which ICU keeps for itself`)
    skipSpace()
    let kind = ''
    if (message[at] === ',') {
      at++
      skipSpace()
      const type = readIdentifier()
      if (!type) fail(`{${argName}, } has no type`)
      if (optionTypes.includes(type)) {
        skipSpace()
        if (message[at] !== ',') fail(`{${argName}, ${type}} has no options`)
        at++
        options(argName, type)
        kind = type
      } else if (simpleTypes.includes(type)) {
        skipSpace()
        let style = ''
        if (message[at] === ',') {
          at++
          skipSpace()
          style = argumentStyle(argName, type)
          if (!style) fail(`{${argName}, ${type}, } has no style`)
          if (style.startsWith('::')) skeleton(argName, type, style.slice(2))
        }
        kind = style ? `${type}:${style}` : type
      } else {
        fail(`{${argName}, ${type}}: ICU has no type "${type}", only number, date, time, plural, select and selectordinal`)
      }
    } else if (at < end && message[at] !== '}') {
      fail(`{${argName}${message[at]}...}: an argument's name may not hold "${message[at]}"`)
    }
    if (message[at] !== '}') fail(`{${argName}} is never closed`)
    at++
    record(argName, kind)
  }

  /**
   * The style of a number, date or time, as formatjs reads it: up to the "}"
   * that closes the argument, past any pair of braces or quoted text inside.
   * @param {string} argName @param {string} type
   */
  function argumentStyle(argName, type) {
    const start = at
    let depth = 0
    while (at < end) {
      const character = message[at]
      if (character === "'") {
        const close = message.indexOf("'", at + 1)
        if (close === -1) fail(`the style of {${argName}, ${type}} has a quote that is never closed`)
        at = close + 1
      } else if (character === '{') {
        depth++
        at++
      } else if (character === '}') {
        if (depth === 0) break
        depth--
        at++
      } else at++
    }
    return message.slice(start, at).trimEnd()
  }

  /**
   * A skeleton, the style after "::": never empty, and in a number's, no
   * option left empty, as in ::currency/ (formatjs refuses both).
   * @param {string} argName @param {string} type @param {string} text
   */
  function skeleton(argName, type, text) {
    if (!text) fail(`{${argName}, ${type}, ::} has an empty skeleton`)
    if (type !== 'number') {
      for (const [field] of text.matchAll(dateTimeFields)) {
        const letter = field[0]
        if (unsupportedDateLetters.includes(letter) || ('ec'.includes(letter) && field.length < 4)) {
          fail(`{${argName}, ${type}, ::${text}}: "${field}" is not supported in a date or time skeleton, and next-intl throws on it. ${dateLetterAdvice(letter)}`)
        }
      }
      return
    }
    for (const token of text.split(/\p{Pattern_White_Space}+/u).filter(Boolean)) {
      if (token.split('/').some((part, index) => index > 0 && part === '')) fail(`the skeleton of {${argName}, ${type}} has an empty option in "${token}"`)
    }
  }

  /**
   * The options of a plural, a selectordinal or a select: each a name, or
   * for a plural "=" and a whole number, then its message in braces. A
   * plural may start with offset:<number>. Every one needs "other", and no
   * option may come twice.
   * @param {string} argName @param {string} type
   */
  function options(argName, type) {
    const plural = type !== 'select'
    /** @type {Set<string>} */
    const seen = new Set()
    skipSpace()
    let selector = readIdentifier()
    if (plural && selector === 'offset') {
      if (message[at] !== ':') fail(`{${argName}, ${type}} has "offset" with no ":" and number after it`)
      at++
      skipSpace()
      readInteger(`the offset of {${argName}, ${type}}`)
      skipSpace()
      selector = readIdentifier()
    }
    for (;;) {
      if (!selector) {
        if (!plural || message[at] !== '=') break
        const start = at
        at++
        readInteger(`the option "${message.slice(start, at + 1)}" of {${argName}, ${type}}`)
        selector = message.slice(start, at)
      }
      if (seen.has(selector)) fail(`{${argName}, ${type}} has the option "${selector}" twice`)
      skipSpace()
      if (message[at] !== '{') fail(`the option "${selector}" of {${argName}, ${type}} has no message`)
      at++
      body(true, plural, undefined)
      if (message[at] !== '}') fail(`the option "${selector}" of {${argName}, ${type}} is never closed`)
      at++
      seen.add(selector)
      skipSpace()
      selector = readIdentifier()
    }
    if (seen.size === 0) fail(`{${argName}, ${type}} has no options`)
    if (!seen.has('other')) fail(`{${argName}, ${type}} has no "other" option`)
  }

  /**
   * A rich text tag, <b>...</b>, as formatjs reads one: a "}" inside it
   * ends it too early, as inside an option. <b/> is plain text, and no tag.
   * @param {boolean} inPlural
   */
  function element(inPlural) {
    at++
    const start = at
    while (at < end && tagCharacter.test(message[at])) at++
    const tagName = message.slice(start, at)
    skipSpace()
    if (message.startsWith('/>', at)) {
      at += 2
      return
    }
    if (message[at] !== '>') fail(`<${tagName} is not a whole tag`)
    at++
    body(true, inPlural, tagName)
    if (!message.startsWith('</', at)) fail(`<${tagName}> is never closed`)
    at += 2
    const closeStart = at
    while (at < end && tagCharacter.test(message[at])) at++
    const closing = message.slice(closeStart, at)
    if (closing !== tagName) fail(`<${tagName}> is closed by </${closing}>`)
    skipSpace()
    if (message[at] !== '>') fail(`</${tagName} is not a whole tag`)
    at++
    tags.add(tagName)
  }

  body(false, false, undefined)
  return { args, tags }
}

/**
 * A message's shape as one sorted list of words, to compare two languages by.
 * @param {ReturnType<typeof icuShape>} shape
 * @returns {string[]}
 */
function shapeWords({ args, tags }) {
  /** @type {string[]} */
  const words = []
  for (const [argName, kinds] of args) for (const kind of kinds) words.push(kind ? `{${argName}, ${kind.replace(':', ', ')}}` : `{${argName}}`)
  for (const tag of tags) words.push(`<${tag}>`)
  return words.toSorted()
}

// ----- Messages -----

/**
 * Every message in a file, by its dotted key, in the file's order. What is
 * not text or an object of messages is a problem.
 * @param {unknown} value
 * @param {string} prefix
 * @param {Map<string, string>} into
 * @param {string[]} problems
 * @param {string} file
 */
function flatten(value, prefix, into, problems, file) {
  for (const [key, inner] of Object.entries(/** @type {Record<string, unknown>} */ (value))) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof inner === 'string') into.set(path, inner)
    else if (typeof inner === 'object' && inner !== null && !Array.isArray(inner)) flatten(inner, path, into, problems, file)
    else problems.push(`${file}: ${keyName(path)} is not text.`)
  }
}

/** @param {string} path */
const shown = (path) => path.split(sep).join('/')

/** @param {string} path */
async function exists(path) {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * One folder of <locale>.json files, against English.
 * @param {{ root: string, folder: string, app: boolean }} folder app is true for the app's own, which may not use the kit's `platform` key
 * @param {{ problems: string[], warnings: string[], summary: string[] }} report
 */
async function checkMessages({ root, folder, app }, report) {
  const where = printable(shown(relative(root, folder)) || '.')
  // The kit's own folder is beside this tool; the app's must be inside the app.
  const problem = app ? await folderProblem(root, folder, where) : null
  if (problem) {
    report.problems.push(problem)
    return
  }
  /** @type {Map<string, Map<string, string>>} */
  const files = new Map()
  for (const locale of locales) {
    const file = `${where}/${locale}.json`
    let text
    try {
      text = await readFile(join(folder, `${locale}.json`), 'utf8')
    } catch {
      report.problems.push(`${file} is missing: every language needs its file.`)
      continue
    }
    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (error) {
      report.problems.push(`${file} is not valid JSON: ${printable(error instanceof Error ? error.message : String(error))}`)
      continue
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      report.problems.push(`${file} must hold an object of messages.`)
      continue
    }
    if (app && 'platform' in parsed) report.problems.push(`${file} has a top-level "platform" key, which is the kit's own messages. Give it another name.`)
    const messages = new Map()
    flatten(parsed, '', messages, report.problems, file)
    files.set(locale, messages)
  }

  const english = files.get('en')
  /** @type {Map<string, ReturnType<typeof icuShape> | null>} */
  const englishShapes = new Map()
  for (const [locale, messages] of files) {
    const file = `${where}/${locale}.json`
    for (const [key, value] of messages) {
      const named = keyName(key)
      if (value.trim() === '') report.problems.push(`${file}: ${named} is empty.`)
      for (const name of forbiddenIn(value)) report.problems.push(`${file}: ${named} has ${name}.`)
      let shape = null
      try {
        shape = icuShape(value)
      } catch (error) {
        report.problems.push(`${file}: ${named} is not valid ICU: ${printable(error instanceof Error ? error.message : String(error))}.`)
      }
      if (locale === 'en') {
        englishShapes.set(key, shape)
        continue
      }
      if (!english) continue
      const source = english.get(key)
      if (source === undefined) {
        report.problems.push(`${file}: ${named} is not in English, so nothing uses it. Remove it, or add it to en.json.`)
        continue
      }
      const sourceShape = englishShapes.has(key) ? englishShapes.get(key) : safeShape(source)
      if (shape && sourceShape) {
        const ours = shapeWords(shape)
        const theirs = shapeWords(sourceShape)
        const missing = theirs.filter((word) => !ours.includes(word))
        const extra = ours.filter((word) => !theirs.includes(word))
        if (missing.length || extra.length) {
          const parts = [missing.length && `lacks ${missing.join(', ')}`, extra.length && `has ${extra.join(', ')} where English has none`].filter(Boolean)
          report.problems.push(`${file}: ${named} ${printable(parts.join(' and '))}.`)
        }
      }
      if (value === source && /\p{L}/u.test(value)) report.warnings.push(`${file}: ${named} is the same as English: ${printable(JSON.stringify(value))}`)
    }
    if (english && locale !== 'en') {
      for (const key of english.keys()) {
        if (!messages.has(key)) report.problems.push(`${file}: ${keyName(key)} is missing. English has ${printable(JSON.stringify(english.get(key)))}.`)
      }
    }
  }
  if (english) report.summary.push(`${where}: ${files.size} of ${locales.length} languages, ${english.size} messages in English`)
}

/** @param {string} message */
function safeShape(message) {
  try {
    return icuShape(message)
  } catch {
    return null
  }
}

// ----- Long pages -----

/**
 * Every file under a folder, relative to it, with forward slashes. Only
 * files and folders: a link is never followed, so nothing outside the
 * folder is read through one.
 * @param {string} folder
 * @param {string} [prefix]
 * @returns {Promise<string[]>}
 */
async function filesUnder(folder, prefix = '') {
  /** @type {string[]} */
  const found = []
  for (const entry of await readdir(join(folder, prefix), { withFileTypes: true })) {
    const path = prefix ? `${prefix}/${entry.name}` : entry.name
    if (entry.isDirectory()) found.push(...(await filesUnder(folder, path)))
    else if (entry.isFile()) found.push(path)
  }
  return found
}

/** What a long page is written in: Markdown or MDX, a module, HTML, plain text, JSON or YAML. */
const pageFile = /\.(?:mdx?|markdown|[cm]?[jt]sx?|html?|txt|json|ya?ml)$/i

/**
 * A page of a folder: a file of a kind a page is written in. A picture or
 * a font beside the pages is none, and neither is a folder's index
 * (index.ts, index.js), which wires its pages together.
 * @param {string} path
 */
const isPage = (path) => pageFile.test(path) && !/(?:^|\/)index\.[cm]?[jt]sx?$/.test(path)

/** True for a path, relative to the app's root, that is not inside it. @param {string} path */
const isOutside = (path) => path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path)

/**
 * Why a folder the check is given cannot be read, or null when it can: it
 * must be a folder, inside the app's root once every link on the way is
 * followed, so nothing outside the app is ever read.
 * @param {string} root
 * @param {string} folder
 * @param {string} where the folder as the report names it
 */
async function folderProblem(root, folder, where) {
  if (isOutside(relative(root, folder))) return `${where} is outside the app. The check reads only folders inside it.`
  let real
  try {
    real = await realpath(folder)
  } catch {
    // Not there: the caller says so in its own words.
    return null
  }
  if (isOutside(relative(await realpath(root), real))) return `${where} leads outside the app through a link. The check reads only folders inside it.`
  if (!(await stat(real)).isDirectory()) return `${where} is a file, not a folder.`
  return null
}

/**
 * A folder of long pages, as platform.config.mjs names it:
 * - layout "folder", the default: the English files in it, and each other
 *   language's in <folder>/<locale>/ under the same names, as the main
 *   website keeps its legal pages;
 * - layout "suffix": each other language's beside the English one, as
 *   <name>.<locale>.<ext>, as the knowledge base keeps its guides.
 * `missing: "list"` lists a missing page among the warnings instead of
 * failing, for a folder whose translations are still being written (6.8:
 * the English shows, marked lang="en", until then).
 * @typedef {{ folder: string, layout?: 'folder' | 'suffix', missing?: 'fail' | 'list' }} PagesFolder
 */

/**
 * Where a language's file of an English page is, by layout: beside it as
 * <name>.<locale>.<ext>, or in <locale>/ under the same name.
 * @param {string} path
 * @param {string} locale
 */
const besideIt = (path, locale) => (locale === 'en' ? path : path.replace(/(\.[^./]+)$/, `.${locale}$1`))
/** @param {string} path @param {string} locale */
const inItsFolder = (path, locale) => (locale === 'en' ? path : `${locale}/${path}`)

/**
 * The pages of a folder, by language, each relative to the folder.
 * @param {string} folder
 * @param {'folder' | 'suffix'} layout
 * @returns {Promise<{ english: string[], translated: Map<string, string[]>, fileOf: (path: string, locale: string) => string }>}
 */
async function pagesOf(folder, layout) {
  const others = locales.filter((locale) => locale !== 'en')
  /** @type {Map<string, string[]>} */
  const translated = new Map(others.map((locale) => [locale, []]))
  if (layout === 'suffix') {
    const suffix = new RegExp(`^(.*)\\.(${others.join('|')})(\\.[^./]+)$`)
    /** @type {string[]} */
    const english = []
    for (const path of (await filesUnder(folder)).filter(isPage)) {
      const match = suffix.exec(path)
      if (match) translated.get(match[2])?.push(`${match[1]}${match[3]}`)
      else english.push(path)
    }
    return { english, translated, fileOf: besideIt }
  }
  // One walk of the whole folder, which follows no link, a language's own folder included.
  const pages = (await filesUnder(folder)).filter(isPage)
  const english = pages.filter((path) => !others.some((locale) => path.startsWith(`${locale}/`)))
  for (const locale of others) {
    translated.set(
      locale,
      pages.filter((path) => path.startsWith(`${locale}/`)).map((path) => path.slice(locale.length + 1)),
    )
  }
  return { english, translated, fileOf: inItsFolder }
}

/**
 * One folder of long pages: a page with no file in a language, a
 * translation with no English page, and the dashes and dots in any page.
 * @param {{ root: string } & PagesFolder} folder
 * @param {{ problems: string[], warnings: string[], summary: string[] }} report
 */
async function checkPages({ root, folder, layout = 'folder', missing = 'fail' }, report) {
  const where = printable(shown(relative(root, folder)))
  const problem = await folderProblem(root, folder, where)
  if (problem) {
    report.problems.push(problem)
    return
  }
  if (!(await exists(folder))) {
    report.problems.push(`${where} is not there: i18n.pages in platform.config.mjs names it.`)
    return
  }
  const { english, translated, fileOf } = await pagesOf(folder, layout)
  /** @param {string} path */
  const at = (path) => `${where}/${printable(path)}`
  const all = [...english]
  let absent = 0
  for (const [locale, paths] of translated) {
    for (const path of english) {
      if (paths.includes(path)) continue
      absent++
      const line = `${at(fileOf(path, locale))} is missing: the ${languageNames[locale]} page has no file. English has ${at(path)}.`
      ;(missing === 'list' ? report.warnings : report.problems).push(line)
    }
    for (const path of paths) {
      if (!english.includes(path)) report.problems.push(`${at(fileOf(path, locale))} has no English page at ${at(path)}.`)
      all.push(fileOf(path, locale))
    }
  }
  for (const path of all) {
    const lines = (await readFile(join(folder, path), 'utf8')).split('\n')
    for (const [index, line] of lines.entries()) {
      for (const name of forbiddenIn(line)) report.problems.push(`${at(path)}, line ${index + 1}, has ${name}.`)
    }
  }
  const missingNote = missing === 'list' && absent > 0 ? `, ${absent} translation${absent === 1 ? '' : 's'} still to write` : ''
  report.summary.push(`${where}: ${english.length} page${english.length === 1 ? '' : 's'} in English, each in ${translated.size} more languages${missingNote}`)
}

// ----- All of it -----

/**
 * @typedef {object} I18nReport
 * @property {string[]} problems what fails the check, one sentence each
 * @property {string[]} warnings messages left the same as English, and pages still to translate in a folder that lists them
 * @property {string[]} summary what was checked
 */

/**
 * Checks folders of messages and of long pages. Paths in the report are
 * relative to root. `problems` are ones found before, with the settings,
 * which the report starts with.
 * @param {{ root: string, messages: { folder: string, app?: boolean }[], pages?: (string | PagesFolder)[], problems?: string[] }} options
 * @returns {Promise<I18nReport>}
 */
export async function checkI18n({ root, messages, pages = [], problems = [] }) {
  /** @type {I18nReport} */
  const report = { problems: [...problems], warnings: [], summary: [] }
  for (const { folder, app = true } of messages) await checkMessages({ root, folder, app }, report)
  for (const entry of pages) await checkPages({ root, ...(typeof entry === 'string' ? { folder: entry } : entry) }, report)
  return report
}

/** The kit's own messages, beside this tool: platform/i18n/messages in an app, kit/i18n/messages in the kit. */
export const kitMessagesFolder = fileURLToPath(new URL('../i18n/messages/', import.meta.url))

/**
 * The date and time skeleton letters formatjs refuses, which next-intl then
 * throws on while it formats (@formatjs/icu-skeleton-parser): the years
 * Y u U r, the quarters Q q, the weeks w W, the days D F, the periods b B,
 * and the time zones Z O v V x X. The letters e and c are refused too, but
 * only up to three of them (a skeleton takes eeee, cccc and longer).
 */
const unsupportedDateLetters = 'YuUrQqwWDFbBZOvVxX'

/**
 * A field of a date or time skeleton, as formatjs finds one: a run of a
 * letter, outside any quoted text. Copied from @formatjs/icu-skeleton-parser.
 */
const dateTimeFields = /(?:[Eec]{1,6}|G{1,5}|[Qq]{1,5}|(?:[yYur]+|U{1,5})|[ML]{1,5}|d{1,2}|D{1,3}|F{1}|[abB]{1,5}|[hkHK]{1,2}|w{1,2}|W{1}|m{1,2}|s{1,2}|[zZOvVxX]{1,4})(?=([^']*'[^']*')*[^']*$)/g

/** What to write in place of a refused letter. @param {string} letter */
function dateLetterAdvice(letter) {
  if ('YuUr'.includes(letter)) return 'Use y for the year.'
  if ('Zz'.includes(letter) || 'OvVxX'.includes(letter)) return 'Use z for the time zone.'
  if ('bB'.includes(letter)) return 'Use a for AM or PM.'
  if ('ec'.includes(letter)) return 'Use E, or four or more of e or c.'
  if ('DF'.includes(letter)) return 'Use d for the day.'
  return 'Write the field in the message with a plain argument instead.'
}

/**
 * What the check covers in an app, from its platform.config.mjs: the kit's
 * messages; the app's, when its folder is there or the settings name one;
 * and its long pages. The settings are checked here as well, by the rules
 * definePlatformConfig holds them to, so a config that skips it cannot
 * point the check outside the app: with any problem, only the kit's own
 * messages are read, and the problems are in the report.
 * @param {string} root
 */
export async function appFolders(root) {
  const configFile = join(root, 'platform.config.mjs')
  const config = (await exists(configFile)) ? (await import(pathToFileURL(configFile).href)).default : {}
  /** @type {{ folder: string, app?: boolean }[]} */
  const kitOnly = [{ folder: kitMessagesFolder, app: false }]
  const problems = i18nProblems(config?.i18n).map((problem) => `platform.config.mjs: ${problem}`)
  if (problems.length > 0) return { root, messages: kitOnly, pages: [], problems }
  const settings = config?.i18n ?? {}
  /** @type {{ folder: string, app?: boolean }[]} */
  const messages = [...kitOnly]
  const appMessages = join(root, ...(settings.messages ?? 'messages').split('/'))
  if (settings.messages !== undefined || (await exists(appMessages))) messages.push({ folder: appMessages })
  /** @type {PagesFolder[]} */
  const pages = (settings.pages ?? []).map((/** @type {string | PagesFolder} */ entry) => {
    const { folder, ...rest } = typeof entry === 'string' ? { folder: entry } : entry
    return { folder: join(root, ...folder.split('/')), ...rest }
  })
  return { root, messages, pages, problems: [] }
}

async function main() {
  const root = process.cwd()
  const { problems, warnings, summary } = await checkI18n(await appFolders(root))
  // Each line once more through printable, so whatever came from a file stays on its own line.
  for (const line of summary) console.log(`Checked ${printable(line)}.`)
  if (warnings.length > 0) {
    console.log(`\n${warnings.length} message${warnings.length === 1 ? ' is' : 's are'} the same as English. Fine for a name, a brand or a code; otherwise translate ${warnings.length === 1 ? 'it' : 'them'}:`)
    for (const warning of warnings) console.log(`- ${printable(warning)}`)
  }
  if (problems.length === 0) {
    console.log('\nNo problems: every language has every message and page, in the same shape as English.')
    return
  }
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`)
  for (const problem of problems) console.error(`- ${printable(problem)}`)
  process.exitCode = 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
