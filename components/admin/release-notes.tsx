import { Fragment, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Release notes, rendered from their Markdown as React elements for the
 * dashboard. The notes are whatever was typed into the release on GitHub,
 * shown on a page that holds an admin session, so none of it is ever taken
 * as HTML: every piece of it reaches the page as a React text node, which
 * React escapes, and the only elements and attributes are the ones written
 * below. Every href comes from safeHref, and no HTML string is ever handed
 * to React. tests/admin-release-notes.test.ts renders our own notes,
 * GitHub's generated ones and a list of attacks, and reads what comes out.
 *
 * It reads what release notes use: paragraphs, # to ###### headings, -, *
 * and + lists and 1. lists with one level of nesting, **bold**, *italic*,
 * `code`, fenced code blocks, [text](url) links, bare https:// addresses,
 * #123 (a pull request or issue of the repository the releases come from)
 * and @user. A line on its own directly above a list is that list's
 * subheading, the way our notes are written ("New logo", then the changes).
 * Anything else shows as the text it is, raw HTML included. An image is
 * never shown: its alt text at most, as a link when the address is allowed.
 *
 * Every scan is linear or bounded, so no note can make the page slow.
 */

type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'code'; text: string }
  | { kind: 'strong' | 'em'; children: Inline[] }
  | { kind: 'link'; href: string; children: Inline[] }

type Item = { text: string; lists: List[] }
type List = { ordered: boolean; start: number; items: Item[] }
type Block =
  | { kind: 'heading'; depth: number; text: string }
  | { kind: 'subheading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; list: List }
  | { kind: 'code'; text: string }
  | { kind: 'rule' }

/** A repository name as lib/admin/settings.ts accepts one. Anything else turns the #123 links off. */
const repoName = /^[\w.-]+\/[\w.-]+$/
/** The longest address that gets a link, and the longest text a link may have. */
const maxUrl = 2048
const maxLinkText = 1000
/** How deep bold, italic and link text may nest. Marks deeper than that show as they are. */
const maxDepth = 4

// ----- Addresses -----

const allowedProtocols = new Set(['https:', 'http:', 'mailto:'])

/**
 * The address as an href, or null when it gets no link. Only https:, http:
 * and mailto: addresses written out in full: a relative path, //host and
 * every other scheme (javascript:, data:, vbscript: and the rest) get none.
 * Spaces, quotes, angle brackets, backslashes and control characters are
 * refused outright, since a browser quietly drops or reinterprets some of
 * them while it parses an address, and the scheme is checked as written
 * before the parser has tidied anything. The href returned is the URL
 * parser's own spelling of the address.
 */
export function safeHref(address: string): string | null {
  if (!address || address.length > maxUrl || /[\s"'<>\\`]/.test(address) || hasControl(address)) return null
  const scheme = /^([a-z][a-z\d+.-]*):/i.exec(address)
  if (!scheme || !allowedProtocols.has(`${scheme[1].toLowerCase()}:`)) return null
  let url: URL
  try {
    url = new URL(address)
  } catch {
    return null
  }
  if (!allowedProtocols.has(url.protocol) || (url.protocol !== 'mailto:' && !url.hostname)) return null
  return url.href
}

function hasControl(text: string): boolean {
  for (let at = 0; at < text.length; at++) {
    const code = text.charCodeAt(at)
    if (code < 0x20 || code === 0x7f) return true
  }
  return false
}

// ----- Blocks, read a line at a time -----

/** Leading spaces, a tab counting to the next multiple of 4, as Markdown counts them. */
function indentOf(line: string): number {
  let width = 0
  for (const char of line) {
    if (char === ' ') width++
    else if (char === '\t') width += 4 - (width % 4)
    else break
  }
  return width
}

const isBlank = (line: string) => line.trim() === ''

function outdent(line: string, spaces: number): string {
  let cut = 0
  while (cut < spaces && line[cut] === ' ') cut++
  return line.slice(cut)
}

type Fence = { mark: string; size: number; indent: number }

function fenceAt(line: string): Fence | null {
  const match = /^( {0,3})(`{3,}|~{3,})/.exec(line)
  if (!match) return null
  const [, spaces, run] = match
  // What follows a backtick fence has no backticks: ```a``` on one line is inline code.
  if (run[0] === '`' && line.includes('`', spaces.length + run.length)) return null
  return { mark: run[0], size: run.length, indent: spaces.length }
}

function closesFence(line: string, fence: Fence): boolean {
  const match = /^ {0,3}(`{3,}|~{3,})[ \t]*$/.exec(line)
  return match !== null && match[1][0] === fence.mark && match[1].length >= fence.size
}

function headingAt(line: string): { depth: number; text: string } | null {
  const match = /^ {0,3}(#{1,6})(?:[ \t]|$)/.exec(line)
  if (!match) return null
  let text = line.slice(match[0].length).trim()
  // A closing run of #, as in "## Title ##", is not part of the title.
  let end = text.length
  while (end > 0 && text[end - 1] === '#') end--
  if (end === 0) text = ''
  else if (end < text.length && (text[end - 1] === ' ' || text[end - 1] === '\t')) text = text.slice(0, end).trimEnd()
  return { depth: match[1].length, text }
}

/** ---, *** or ___, spaced out or not. */
function isRule(line: string): boolean {
  if (indentOf(line) > 3) return false
  const marks = line.replace(/[ \t]/g, '')
  return marks.length >= 3 && /^(?:-+|\*+|_+)$/.test(marks)
}

type Marker = { indent: number; ordered: boolean; start: number; text: string }

function markerAt(line: string): Marker | null {
  if (isRule(line)) return null
  const match = /^([ \t]*)(?:[-*+]|(\d{1,9})[.)])(?:[ \t]+|$)/.exec(line)
  if (!match) return null
  const number = match[2]
  return {
    indent: indentOf(match[1]),
    ordered: number !== undefined,
    start: number === undefined ? 1 : Number(number),
    text: line.slice(match[0].length).trim(),
  }
}

/** What ends a paragraph without a blank line: a fence, a heading, a rule, or a list (a numbered one only from 1). */
function interrupts(line: string): boolean {
  if (fenceAt(line) || headingAt(line) || isRule(line)) return true
  const marker = markerAt(line)
  return marker !== null && marker.indent <= 3 && marker.text !== '' && (!marker.ordered || marker.start === 1)
}

function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (isBlank(line)) {
      i++
      continue
    }
    const fence = fenceAt(line)
    if (fence) {
      const body: string[] = []
      for (i++; i < lines.length && !closesFence(lines[i], fence); i++) body.push(outdent(lines[i], fence.indent))
      // Past the closing fence. A block never closed runs to the end.
      i++
      blocks.push({ kind: 'code', text: body.join('\n') })
      continue
    }
    const heading = headingAt(line)
    if (heading) {
      blocks.push({ kind: 'heading', ...heading })
      i++
      continue
    }
    if (isRule(line)) {
      blocks.push({ kind: 'rule' })
      i++
      continue
    }
    const marker = markerAt(line)
    if (marker && marker.indent <= 3) {
      const read = readList(lines, i, marker)
      blocks.push({ kind: 'list', list: read.list })
      i = read.next
      continue
    }
    const start = i
    i++
    while (i < lines.length && !isBlank(lines[i]) && !interrupts(lines[i])) i++
    const text = lines
      .slice(start, i)
      .map((part) => part.trim())
      .join('\n')
    // A line on its own directly above a list is that list's subheading, unless it ends like a sentence.
    const next = lines[i]
    const subheading = i - start === 1 && next !== undefined && markerAt(next) !== null && !/[.!?,;]$/.test(text)
    blocks.push(subheading ? { kind: 'subheading', text } : { kind: 'paragraph', text })
  }
  return blocks
}

function readList(lines: string[], from: number, first: Marker): { list: List; next: number } {
  const base = first.indent
  const list: List = { ordered: first.ordered, start: first.start, items: [] }
  // The last item at the list's own level, the list open under it, and the item a continued line belongs to.
  let parent: Item | null = null
  let nested: List | null = null
  let last: Item | null = null
  let i = from
  while (i < lines.length) {
    const line = lines[i]
    if (isBlank(line)) {
      // A blank line ends the list, unless what follows carries on with it.
      let next = i + 1
      while (next < lines.length && isBlank(lines[next])) next++
      if (next === lines.length || !carriesOn(lines[next], base, list.ordered)) break
      i = next
      continue
    }
    const marker = markerAt(line)
    if (marker && parent && marker.indent >= base + 2) {
      // One level down, under the last item. Deeper items join that level: release notes need no more.
      if (!nested || nested.ordered !== marker.ordered) {
        nested = { ordered: marker.ordered, start: marker.start, items: [] }
        parent.lists.push(nested)
      }
      last = { text: marker.text, lists: [] }
      nested.items.push(last)
    } else if (marker && marker.ordered === list.ordered) {
      parent = last = { text: marker.text, lists: [] }
      nested = null
      list.items.push(parent)
    } else if (!marker && last && indentOf(line) >= base + 2) {
      // A line indented under an item continues it.
      last.text += `\n${line.trim()}`
    } else {
      break
    }
    i++
  }
  return { list, next: i }
}

/** After a blank line, the list goes on with another of its items, or with text indented under its last one. */
function carriesOn(line: string, base: number, ordered: boolean): boolean {
  const marker = markerAt(line)
  if (marker) return marker.indent >= base + 2 || marker.ordered === ordered
  return indentOf(line) >= base + 2
}

// ----- Inline: a paragraph, heading or list item at a time -----

type Context = { repo: string | null; inLink: boolean; depth: number }
/**
 * For each delimiter, the earliest place it was looked for after and not
 * found, so a later search for it can stop at once. This keeps a long run
 * of marks that never close linear.
 */
type Misses = Map<string, number>

const punctuation = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'
const isWordChar = (char: string | undefined) => char !== undefined && /[\p{L}\p{N}_]/u.test(char)
/** Where a bare address, #123 or @user may begin: the start of the text, or after a space, an opening bracket or quote, or an emphasis mark. */
const startsWord = (before: string | undefined) => before === undefined || /[\s([{<"'*_~]/.test(before)

function runOf(text: string, from: number, char: string): number {
  let end = from
  while (text[end] === char) end++
  return end - from
}

/** Where the run of exactly size backticks that closes a code span starts, or -1. */
function codeClose(text: string, from: number, size: number, misses: Misses): number {
  const key = `code ${size}`
  if ((misses.get(key) ?? Infinity) <= from) return -1
  for (let at = text.indexOf('`', from); at !== -1; ) {
    const run = runOf(text, at, '`')
    if (run === size) return at
    at = text.indexOf('`', at + run)
  }
  misses.set(key, from)
  return -1
}

/** A code span's text: line breaks become spaces, and one space comes off each end when both have one. */
function codeText(raw: string): string {
  const text = raw.replaceAll('\n', ' ')
  return text.length > 2 && text.startsWith(' ') && text.endsWith(' ') && text.trim() ? text.slice(1, -1) : text
}

/** For each opening bracket, where the bracket that closes it is (-1 for none), skipping escaped ones. One pass. */
function pairsOf(text: string, open: string, close: string): Int32Array {
  const pairs = new Int32Array(text.length).fill(-1)
  const opened: number[] = []
  for (let at = 0; at < text.length; at++) {
    const char = text[at]
    if (char === '\\') at++
    else if (char === open) opened.push(at)
    else if (char === close && opened.length > 0) pairs[opened.pop() as number] = at
  }
  return pairs
}

/** Where the [ and ( of one text close, worked out the first time a link is looked for in it. */
type Pairs = { text: string; brackets?: Int32Array; parens?: Int32Array }

/** [text](address) from the [ at open: its text, its address as written, and where it ends. */
function linkAt(pairs: Pairs, open: number): { label: string; address: string; end: number } | null {
  const { text } = pairs
  pairs.brackets ??= pairsOf(text, '[', ']')
  const close = pairs.brackets[open]
  if (close === -1 || close - open > maxLinkText || text[close + 1] !== '(') return null
  pairs.parens ??= pairsOf(text, '(', ')')
  const end = pairs.parens[close + 1]
  if (end === -1 || end - close > maxUrl) return null
  return { label: text.slice(open + 1, close), address: text.slice(close + 2, end), end: end + 1 }
}

/** Bold or italic from the marks at i: what is inside and where it ends, or null when the marks are only marks. */
function emphasisAt(text: string, i: number, misses: Misses): { inner: string; size: number; end: number } | null {
  const mark = text[i]
  const size = runOf(text, i, mark)
  const after = text[i + size]
  // Marks open only before a non-space character, and _ only at the start of a word, so snake_case_names stay as they are.
  if (size > 3 || after === undefined || /\s/.test(after) || (mark === '_' && isWordChar(text[i - 1]))) return null
  const key = mark.repeat(size)
  if ((misses.get(key) ?? Infinity) <= i) return null
  for (let at = i + size; at < text.length; ) {
    const char = text[at]
    if (char === '\\') {
      at += 2
    } else if (char === '`') {
      // A code span is passed over whole: a mark inside it is code.
      const run = runOf(text, at, '`')
      const end = codeClose(text, at + run, run, misses)
      at = end === -1 ? at + run : end + run
    } else if (char === mark) {
      const run = runOf(text, at, mark)
      const closes = run >= size && !/\s/.test(text[at - 1]) && (mark === '*' || !isWordChar(text[at + run]))
      if (closes && at > i + size) return { inner: text.slice(i + size, at), size, end: at + size }
      at += run
    } else {
      at++
    }
  }
  misses.set(key, i)
  return null
}

/** Where a bare https:// address from start ends, leaving off the punctuation after it; -1 if there is none. */
function bareUrlEnd(text: string, start: number): number {
  if (text.slice(start, start + 8).toLowerCase() !== 'https://') return -1
  let end = start + 8
  let opened = 0
  let closed = 0
  while (end < text.length && !/[\s<>"`]/.test(text[end])) {
    if (end - start >= maxUrl) return -1
    if (text[end] === '(') opened++
    else if (text[end] === ')') closed++
    end++
  }
  // The sentence's punctuation is not part of the address, and nor is a ) it did not open.
  for (;;) {
    const last = text[end - 1]
    if ("?!.,:;*_~'".includes(last)) {
      end--
    } else if (last === ')' && closed > opened) {
      end--
      closed--
    } else {
      break
    }
  }
  return end > start + 8 ? end : -1
}

/** How GitHub shows an address in the repository itself: #123 for a pull request or issue, v1.0.0...v1.1.0 for a comparison. */
function shortLabel(address: string, repo: string | null): string {
  if (!repo) return address
  const own = `https://github.com/${repo}/`
  if (address.slice(0, own.length).toLowerCase() !== own.toLowerCase()) return address
  const rest = address.slice(own.length)
  const number = /^(?:pull|issues)\/(\d+)$/.exec(rest)
  if (number) return `#${number[1]}`
  const compare = /^compare\/([^/?#]+)$/.exec(rest)
  return compare ? compare[1] : address
}

/** A link labelled with text, or just the text when safeHref turns the address down. */
function linkTo(address: string, label: string): Inline {
  const href = safeHref(address)
  const text: Inline = { kind: 'text', text: label }
  return href ? { kind: 'link', href, children: [text] } : text
}

/** A bare https:// address, #123 or @user starting at i, as a link. */
function referenceAt(text: string, i: number, repo: string | null): { node: Inline; end: number } | null {
  const char = text[i]
  if (!'hH#@'.includes(char) || !startsWord(text[i - 1])) return null
  if (char === '#') {
    if (!repo) return null
    let end = i + 1
    while (end - i <= 10 && /\d/.test(text[end] ?? '')) end++
    const number = text.slice(i + 1, end)
    if (!/^[1-9]\d{0,9}$/.test(number) || isWordChar(text[end])) return null
    // A pull request's address. GitHub sends it on to the issue when the number is an issue's.
    return { node: linkTo(`https://github.com/${repo}/pull/${number}`, `#${number}`), end }
  }
  if (char === '@') {
    let end = i + 1
    while (end - i <= 40 && /[A-Za-z\d-]/.test(text[end] ?? '')) end++
    const name = text.slice(i + 1, end)
    // A GitHub username: letters, digits and single hyphens, none at either end, 39 at most.
    if (name.length > 39 || !/^[A-Za-z\d](?:-?[A-Za-z\d])*$/.test(name)) return null
    if (text.startsWith('[bot]', end)) {
      return { node: linkTo(`https://github.com/apps/${name}`, `@${name}[bot]`), end: end + 5 }
    }
    // Not a username when it runs on into something else: @org/team, user_name, a letter from outside A to Z.
    if (/[\p{L}\p{N}_@/]/u.test(text[end] ?? '')) return null
    return { node: linkTo(`https://github.com/${name}`, `@${name}`), end }
  }
  const end = bareUrlEnd(text, i)
  if (end === -1) return null
  const address = text.slice(i, end)
  const node = linkTo(address, shortLabel(address, repo))
  // An address safeHref turns down stays text, a character at a time like any other.
  return node.kind === 'link' ? { node, end } : null
}

function linkNodes(link: { label: string; address: string }, image: boolean, context: Context): Inline[] {
  const label = parseInline(link.label, { ...context, inLink: true, depth: context.depth + 1 })
  const href = context.inLink ? null : safeHref(link.address)
  // An image is never shown: its alt text at most, as a link when the address is allowed.
  if (image) return href && label.length > 0 ? [{ kind: 'link', href, children: label }] : label
  // A link to an address that is not allowed is its text alone.
  if (!href) return label
  return [{ kind: 'link', href, children: label.length > 0 ? label : [{ kind: 'text', text: link.address }] }]
}

function parseInline(text: string, context: Context): Inline[] {
  const nodes: Inline[] = []
  const misses: Misses = new Map()
  const pairs: Pairs = { text }
  let plain = ''
  const push = (...more: Inline[]) => {
    if (plain) nodes.push({ kind: 'text', text: plain })
    plain = ''
    nodes.push(...more)
  }
  let i = 0
  while (i < text.length) {
    const char = text[i]
    if (char === '\\' && i + 1 < text.length && punctuation.includes(text[i + 1])) {
      plain += text[i + 1]
      i += 2
      continue
    }
    if (char === '`') {
      const size = runOf(text, i, '`')
      const close = codeClose(text, i + size, size, misses)
      if (close === -1) {
        plain += text.slice(i, i + size)
        i += size
      } else {
        push({ kind: 'code', text: codeText(text.slice(i + size, close)) })
        i = close + size
      }
      continue
    }
    const image = char === '!' && text[i + 1] === '['
    if (image || (char === '[' && !context.inLink)) {
      const link = linkAt(pairs, image ? i + 1 : i)
      if (link) {
        push(...linkNodes(link, image, context))
        i = link.end
        continue
      }
    }
    if ((char === '*' || char === '_') && context.depth < maxDepth) {
      const emphasis = emphasisAt(text, i, misses)
      if (emphasis) {
        const inner = parseInline(emphasis.inner, { ...context, depth: context.depth + 1 })
        if (emphasis.size === 1) push({ kind: 'em', children: inner })
        else if (emphasis.size === 2) push({ kind: 'strong', children: inner })
        else push({ kind: 'strong', children: [{ kind: 'em', children: inner }] })
        i = emphasis.end
      } else {
        // Marks that open nothing are text, the whole run at once.
        const size = runOf(text, i, char)
        plain += text.slice(i, i + size)
        i += size
      }
      continue
    }
    const reference = context.inLink ? null : referenceAt(text, i, context.repo)
    if (reference) {
      push(reference.node)
      i = reference.end
      continue
    }
    plain += char
    i++
  }
  push()
  return nodes
}

// ----- Rendering -----

const linkClass = 'text-link underline decoration-link/50 underline-offset-2 hover:text-foreground hover:decoration-current'

function lineBreaks(text: string): ReactNode {
  if (!text.includes('\n')) return text
  return text.split('\n').flatMap((line, index) => (index === 0 ? [line] : [<br key={index} />, line]))
}

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.kind) {
      case 'text':
        return <Fragment key={index}>{lineBreaks(node.text)}</Fragment>
      case 'code':
        return (
          <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.8125rem]">
            {node.text}
          </code>
        )
      case 'strong':
        return (
          <strong key={index} className="font-semibold text-foreground">
            {renderInline(node.children)}
          </strong>
        )
      case 'em':
        return <em key={index}>{renderInline(node.children)}</em>
      case 'link':
        if (node.href.startsWith('mailto:')) {
          return (
            <a key={index} href={node.href} className={linkClass}>
              {renderInline(node.children)}
            </a>
          )
        }
        // A new tab, without window.opener or a referrer: this page holds the admin session.
        return (
          <a key={index} href={node.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {renderInline(node.children)}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )
    }
  })
}

type Render = (text: string) => ReactNode[]

function renderList(list: List, key: number, inline: Render, nested = false): ReactNode {
  const items = list.items.map((item, index) => (
    <li key={index}>
      {inline(item.text)}
      {item.lists.map((child, childIndex) => renderList(child, childIndex, inline, true))}
    </li>
  ))
  const className = cn('space-y-1.5 pl-5 marker:text-muted-foreground', nested && 'mt-1.5')
  if (list.ordered) {
    return (
      <ol key={key} start={list.start === 1 ? undefined : list.start} className={cn('list-decimal', className)}>
        {items}
      </ol>
    )
  }
  return (
    <ul key={key} className={cn(nested ? 'list-[circle]' : 'list-disc', className)}>
      {items}
    </ul>
  )
}

const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

function renderBlocks(blocks: Block[], context: Context, base: number): ReactNode[] {
  const inline: Render = (text) => renderInline(parseInline(text, context))
  // The notes' own top heading level sits at base, whatever it was written as (## in GitHub's generated notes).
  const top = blocks.reduce((least, block) => (block.kind === 'heading' ? Math.min(least, block.depth) : least), 6)
  // The level of the heading above, which a subheading goes one below.
  let above = base - 1
  const out: ReactNode[] = []
  for (const [index, block] of blocks.entries()) {
    if (block.kind === 'heading' || block.kind === 'subheading') {
      const level = block.kind === 'heading' ? Math.min(6, base + block.depth - top) : Math.min(6, above + 1)
      if (block.kind === 'heading') above = level
      const Tag = headingTags[level - 1]
      out.push(
        <Tag
          key={index}
          className={cn('mt-6 mb-2 font-semibold text-foreground first:mt-0', level === base ? 'text-base' : 'text-sm')}
        >
          {inline(block.text)}
        </Tag>,
      )
    } else if (block.kind === 'paragraph') {
      out.push(<p key={index}>{inline(block.text)}</p>)
    } else if (block.kind === 'list') {
      out.push(renderList(block.list, index, inline))
    } else if (block.kind === 'code') {
      out.push(
        <pre key={index} className="overflow-x-auto rounded-lg border bg-background p-3 font-mono text-xs leading-relaxed">
          <code>{block.text}</code>
        </pre>,
      )
    } else {
      out.push(<hr key={index} />)
    }
  }
  return out
}

/**
 * headingLevel is the level the notes' top headings take on this page, so
 * they sit under the heading of the section that holds them.
 */
export function ReleaseNotes({
  markdown,
  repo,
  headingLevel = 3,
  className,
}: {
  markdown: string
  repo: string
  headingLevel?: number
  className?: string
}) {
  const context: Context = { repo: repoName.test(repo) ? repo : null, inLink: false, depth: 0 }
  const base = Math.min(6, Math.max(1, Math.round(headingLevel)))
  return (
    <div className={cn('space-y-3 text-sm leading-relaxed break-words', className)}>
      {renderBlocks(parseBlocks(markdown), context, base)}
    </div>
  )
}
