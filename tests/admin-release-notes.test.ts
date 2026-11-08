import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ReleaseNotes, safeHref } from '@/components/admin/release-notes'

/**
 * The dashboard renders the latest release's notes from their Markdown
 * (components/admin/release-notes.tsx). The notes come from GitHub and the
 * page holds an admin session, so these tests render them the way the page
 * does, on the server, and read the HTML that comes out.
 */
const root = join(__dirname, '..')
const repo = 'wslatl/wslatl.com'
const render = (markdown: string, forRepo = repo) =>
  renderToStaticMarkup(createElement(ReleaseNotes, { markdown, repo: forRepo }))

/** The HTML without classes or the screen-reader note on new-tab links, so a test reads as the structure it checks. */
const outline = (html: string) =>
  html.replace(/ class="[^"]*"/g, '').replaceAll('<span> (opens in a new tab)</span>', '')

const newTab = 'target="_blank" rel="noopener noreferrer"'
const github = (path: string) => `https://github.com/${repo}/${path}`

/** Every tag in the HTML, with its attributes. */
function tags(html: string) {
  return [...html.matchAll(/<([a-z][a-z\d]*)([^>]*)>/g)].map(([, name, rest]) => ({
    name,
    attributes: Object.fromEntries([...rest.matchAll(/([^\s=/]+)(?:="([^"]*)")?/g)].map(([, key, value]) => [key, value ?? ''])),
  }))
}

const allowedTags = ['div', 'p', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'strong', 'em', 'code', 'pre', 'a', 'br', 'hr', 'span']
const allowedAttributes = ['class', 'href', 'target', 'rel', 'start']

/** Only what the renderer writes itself: its own elements and attributes, and links to https, http and mailto alone. */
function problems(html: string): string[] {
  return tags(html).flatMap(({ name, attributes }) => [
    ...(allowedTags.includes(name) ? [] : [`<${name}>`]),
    ...Object.keys(attributes)
      .filter((key) => !allowedAttributes.includes(key))
      .map((key) => `${key} on <${name}>`),
    ...(name === 'a' && !/^(?:https?:\/\/|mailto:)/.test(attributes.href ?? '') ? [`href ${attributes.href}`] : []),
  ])
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(name) ? [path] : []
  })
}

describe('our own release notes', () => {
  // Saved from `gh release view v1.1.0 --repo wslatl/wslatl.com --json body --jq .body`.
  const notes = readFileSync(join(__dirname, 'fixtures', 'release-notes-v1.1.0.md'), 'utf8')
  const html = render(notes)
  const page = outline(html)

  it('read as they are written: an opening line, then a subheading over each list', () => {
    expect([...page.matchAll(/<(p|h\d|ul|ol)>/g)].map((match) => match[1])).toEqual([
      'p', 'h3', 'ul', 'h3', 'ul', 'h3', 'ul', 'h3', 'ul', 'p',
    ])
    expect([...page.matchAll(/<h3>(.*?)<\/h3>/g)].map((match) => match[1])).toEqual([
      'New logo',
      'Partners',
      'Packages',
      'Pull requests',
    ])
    expect(page).toMatch(
      /^<div><p>The new WSLATL logo, two partner banners, NxtLyfe&#x27;s new profile, and November&#x27;s package updates\.<\/p><h3>New logo<\/h3><ul><li>The logo from the November 2026 brand kit replaces the old white mark everywhere:/,
    )
    expect(page.match(/<li>/g)).toHaveLength(10)
  })

  it('link the pull requests, and show the changelog the way GitHub does', () => {
    const link = (number: number) => `<a href="${github(`pull/${number}`)}" ${newTab}>#${number}</a>`
    expect(page).toContain(
      `<h3>Pull requests</h3><ul><li>${link(46)} Package updates (closes ${link(45)}, replaces ${link(44)})</li><li>${link(47)} The new logo</li><li>${link(48)} Partner banners and NxtLyfe&#x27;s profile</li></ul>`,
    )
    // The last line, to the end of the notes.
    const changelog = `<p>Full changelog: <a href="${github('compare/v1.0.0...v1.1.0')}" ${newTab}>v1.0.0...v1.1.0</a></p></div>`
    expect(page.slice(-changelog.length)).toBe(changelog)
  })

  it('leave the rest as text, and tell screen readers which links open a new tab', () => {
    expect(page).toContain('<li>The cards on /partners now load small copies of the banners,')
    expect(page).toContain('so favicon.svg is gone;')
    expect(html.match(/<a /g)).toHaveLength(html.match(/<span class="sr-only"> \(opens in a new tab\)<\/span>/g)?.length ?? -1)
    expect(problems(html)).toEqual([])
  })
})

describe("GitHub's generated release notes", () => {
  const generated = [
    "## What's Changed",
    `* Package updates by @octocat in ${github('pull/46')}`,
    `* Bump next from 16.4.4 to 16.4.5 by @dependabot[bot] in ${github('pull/44')}`,
    '',
    '## New Contributors',
    `* @octocat made their first contribution in ${github('pull/46')}`,
    '',
    `**Full Changelog**: ${github('compare/v1.0.0...v1.1.0')}`,
    '',
  ].join('\n')

  it('read as GitHub shows them, with people and pull requests linked', () => {
    const pull = (number: number) => `<a href="${github(`pull/${number}`)}" ${newTab}>#${number}</a>`
    const octocat = `<a href="https://github.com/octocat" ${newTab}>@octocat</a>`
    const dependabot = `<a href="https://github.com/apps/dependabot" ${newTab}>@dependabot[bot]</a>`
    expect(outline(render(generated))).toBe(
      [
        '<div>',
        '<h3>What&#x27;s Changed</h3>',
        `<ul><li>Package updates by ${octocat} in ${pull(46)}</li><li>Bump next from 16.4.4 to 16.4.5 by ${dependabot} in ${pull(44)}</li></ul>`,
        '<h3>New Contributors</h3>',
        `<ul><li>${octocat} made their first contribution in ${pull(46)}</li></ul>`,
        `<p><strong>Full Changelog</strong>: <a href="${github('compare/v1.0.0...v1.1.0')}" ${newTab}>v1.0.0...v1.1.0</a></p>`,
        '</div>',
      ].join(''),
    )
  })

  it('keep a full address for anything outside the repository', () => {
    const page = outline(render('* Thanks to https://github.com/other/repo/pull/3 and https://example.com/x'))
    expect(page).toContain(`<a href="https://github.com/other/repo/pull/3" ${newTab}>https://github.com/other/repo/pull/3</a>`)
    expect(page).toContain(`<a href="https://example.com/x" ${newTab}>https://example.com/x</a>`)
  })
})

describe('the Markdown release notes use', () => {
  it('puts the top heading level under the section, and each subheading one below the heading above it', () => {
    expect(outline(render('# One\n\nText\n\n## Two\n\nPartners\n- a\n\n###### Six'))).toBe(
      '<div><h3>One</h3><p>Text</p><h4>Two</h4><h5>Partners</h5><ul><li>a</li></ul><h6>Six</h6></div>',
    )
    expect(outline(render('### Fixed ###\n#not a heading'))).toBe('<div><h3>Fixed</h3><p>#not a heading</p></div>')
  })

  it('takes a line on its own above a list as its subheading, but not a sentence', () => {
    expect(outline(render('Fixes\n- One\n- Two'))).toBe('<div><h3>Fixes</h3><ul><li>One</li><li>Two</li></ul></div>')
    expect(outline(render('This release fixes two bugs.\n- One'))).toBe(
      '<div><p>This release fixes two bugs.</p><ul><li>One</li></ul></div>',
    )
    expect(outline(render('Two lines\nof text\n- One'))).toBe('<div><p>Two lines<br/>of text</p><ul><li>One</li></ul></div>')
    expect(outline(render('Fixes\n\n- One'))).toBe('<div><p>Fixes</p><ul><li>One</li></ul></div>')
  })

  it('reads bullet and numbered lists, one level deep', () => {
    expect(outline(render('- Top\n  - Inner one\n  * Inner two\n- Next\n\n- After a blank line\n\n3. Third\n4. Fourth'))).toBe(
      '<div><ul><li>Top<ul><li>Inner one</li><li>Inner two</li></ul></li><li>Next</li><li>After a blank line</li></ul>' +
        '<ol start="3"><li>Third</li><li>Fourth</li></ol></div>',
    )
    expect(outline(render('1. One\n   1. One point one\n      1. Deeper still\n2. Two\n   with more of it'))).toBe(
      '<div><ol><li>One<ol><li>One point one</li><li>Deeper still</li></ol></li><li>Two<br/>with more of it</li></ol></div>',
    )
    expect(outline(render('- a\n---\n* b'))).toBe('<div><ul><li>a</li></ul><hr/><ul><li>b</li></ul></div>')
  })

  it('reads bold, italic and code, and leaves snake_case and escaped marks alone', () => {
    expect(outline(render('Some **bold**, *italic*, __bold__, _italic_, ***both*** and `code`.'))).toBe(
      '<div><p>Some <strong>bold</strong>, <em>italic</em>, <strong>bold</strong>, <em>italic</em>, <strong><em>both</em></strong> and <code>code</code>.</p></div>',
    )
    expect(outline(render('snake_case_name, \\*not italic\\*, 2 * 3 * 4, `` a `tick` ``, **`code` in bold**'))).toBe(
      '<div><p>snake_case_name, *not italic*, 2 * 3 * 4, <code>a `tick`</code>, <strong><code>code</code> in bold</strong></p></div>',
    )
    expect(outline(render('**never closed and `**` in code'))).toBe('<div><p>**never closed and <code>**</code> in code</p></div>')
  })

  it('shows fenced code exactly, and a fence left open runs to the end', () => {
    expect(outline(render("```js\nconst tag = '<b>'\n  indented\n```\nAfter\n\n~~~\nopen"))).toBe(
      '<div><pre><code>const tag = &#x27;&lt;b&gt;&#x27;\n  indented</code></pre><p>After</p><pre><code>open</code></pre></div>',
    )
  })

  it('links [text](url) and bare https addresses, without the punctuation after them', () => {
    expect(outline(render('[The guide](https://example.com/guide?a=1&b=2), [mail](mailto:team@example.com) and [](https://example.com/empty)'))).toBe(
      `<div><p><a href="https://example.com/guide?a=1&amp;b=2" ${newTab}>The guide</a>, <a href="mailto:team@example.com">mail</a> and <a href="https://example.com/empty" ${newTab}>https://example.com/empty</a></p></div>`,
    )
    expect(outline(render('See https://example.com/a_(b). Or (https://example.com/c), https://example.com/d!'))).toBe(
      `<div><p>See <a href="https://example.com/a_(b)" ${newTab}>https://example.com/a_(b)</a>. Or (<a href="https://example.com/c" ${newTab}>https://example.com/c</a>), <a href="https://example.com/d" ${newTab}>https://example.com/d</a>!</p></div>`,
    )
    // Bare addresses are linked for https only.
    expect(outline(render('http://example.com and www.example.com'))).toBe('<div><p>http://example.com and www.example.com</p></div>')
    expect(outline(render('**[Bold link](https://example.com)** and [**bold inside**](https://example.com)'))).toBe(
      `<div><p><strong><a href="https://example.com/" ${newTab}>Bold link</a></strong> and <a href="https://example.com/" ${newTab}><strong>bold inside</strong></a></p></div>`,
    )
  })

  it('links #123 and @user only where GitHub would', () => {
    const pull = (number: number) => `<a href="${github(`pull/${number}`)}" ${newTab}>#${number}</a>`
    expect(outline(render('#12 fixed (#13), not #0, PR#14, &#15; or #16th'))).toBe(
      `<div><p>${pull(12)} fixed (${pull(13)}), not #0, PR#14, &amp;#15; or #16th</p></div>`,
    )
    expect(outline(render('@octocat, team@example.com, @org/team, @user_name, @-dash, @trailing- and `@code`'))).toBe(
      `<div><p><a href="https://github.com/octocat" ${newTab}>@octocat</a>, team@example.com, @org/team, @user_name, @-dash, @trailing- and <code>@code</code></p></div>`,
    )
    // Without a repository name it can trust, #123 stays text.
    expect(outline(render('#12', 'not a repository'))).toBe('<div><p>#12</p></div>')
  })

  it('never shows an image: its alt text at most, linked when the address is allowed', () => {
    expect(outline(render('![The new logo](https://example.com/logo.png) ![](https://example.com/blank.png) ![Alt](javascript:alert(1))'))).toBe(
      `<div><p><a href="https://example.com/logo.png" ${newTab}>The new logo</a>  Alt</p></div>`,
    )
    expect(outline(render('[![Build](https://example.com/badge.svg)](https://example.com/ci)'))).toBe(
      `<div><p><a href="https://example.com/ci" ${newTab}>Build</a></p></div>`,
    )
  })

  it('reads Windows line endings the same', () => {
    expect(render('New logo\r\n- One\r\n\r\nText\rmore')).toBe(render('New logo\n- One\n\nText\nmore'))
  })
})

describe('notes written to attack the page', () => {
  const linkAttacks = [
    '[x](javascript:alert(1))',
    '[x](JaVaScRiPt:alert(1))',
    '[x](javascript:alert`1`)',
    '[x]( javascript:alert(1))',
    '[x](java\tscript:alert(1))',
    '[x](javascript&#58;alert(1))',
    '[x](javascript&colon;alert(1))',
    '[x](&#106;avascript:alert(1))',
    '[x](&#x6A;&#x61;vascript:alert(1))',
    '[x](%6Aavascript:alert(1))',
    '[x](data:text/html,<script>alert(1)</script>)',
    '[x](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
    '[x](vbscript:msgbox(1))',
    '[x](file:///etc/passwd)',
    '[x](/admin/api/update)',
    '[x](admin/api/update)',
    '[x](//evil.example/)',
    '[x](\\\\evil.example)',
    '[x](https:\\\\evil.example)',
    '[x](https://example.com/a b)',
    '[x](https://example.com/" onmouseover="alert(1))',
    "[x](https://example.com/' onmouseover='alert(1))",
    '[x](https://example.com/"><script>alert(1)</script>)',
    '[x](https://example.com "A title")',
    '[x](<https://example.com>)',
    '![x](javascript:alert(1))',
    '![x](data:image/svg+xml,<svg onload=alert(1)>)',
  ]

  it('gives no link to an address that is not https, http or mailto, or that has spaces or quotes in it', () => {
    for (const attack of linkAttacks) {
      const html = render(attack)
      expect(html, attack).not.toContain('<a')
      expect(problems(html), attack).toEqual([])
      // The link's text is all that is left of it.
      expect(outline(html), attack).toBe('<div><p>x</p></div>')
    }
  })

  it('shows raw HTML as the text it is', () => {
    const cases: [string, string][] = [
      ['<script>alert(1)</script>', '&lt;script&gt;alert(1)&lt;/script&gt;'],
      ['<img src=x onerror=alert(1)>', '&lt;img src=x onerror=alert(1)&gt;'],
      ['<a href="javascript:alert(1)">x</a>', '&lt;a href=&quot;javascript:alert(1)&quot;&gt;x&lt;/a&gt;'],
      ['<svg onload=alert(1)>', '&lt;svg onload=alert(1)&gt;'],
      ['<iframe srcdoc="&lt;script&gt;alert(1)&lt;/script&gt;"></iframe>', '&lt;iframe srcdoc=&quot;&amp;lt;script&amp;gt;alert(1)&amp;lt;/script&amp;gt;&quot;&gt;&lt;/iframe&gt;'],
      ['<details open ontoggle=alert(1)>', '&lt;details open ontoggle=alert(1)&gt;'],
      ['<!-- a comment -->', '&lt;!-- a comment --&gt;'],
      ['**<b onclick="alert(1)">bold</b>**', '<strong>&lt;b onclick=&quot;alert(1)&quot;&gt;bold&lt;/b&gt;</strong>'],
      ['`<script>`', '<code>&lt;script&gt;</code>'],
    ]
    for (const [attack, shown] of cases) {
      const html = render(attack)
      expect(outline(html), attack).toBe(`<div><p>${shown}</p></div>`)
      expect(problems(html), attack).toEqual([])
    }
    expect(outline(render('```\n<script>alert(1)</script>\n```'))).toBe(
      '<div><pre><code>&lt;script&gt;alert(1)&lt;/script&gt;</code></pre></div>',
    )
  })

  it('ends a bare address where markup would start, so nothing after it gets into the link', () => {
    for (const attack of [
      'https://example.com/"onmouseover="alert(1)',
      'https://example.com/<script>alert(1)</script>',
      'https://example.com/`onclick`',
    ]) {
      const html = render(attack)
      expect(tags(html).filter((tag) => tag.name === 'a').map((tag) => tag.attributes.href), attack).toEqual(['https://example.com/'])
      expect(problems(html), attack).toEqual([])
    }
    expect(render('javascript:alert(1) and data:text/html,x')).not.toContain('<a')
  })

  it('opens every web link in a new tab, without the opener or the referrer', () => {
    const html = render(['[a](https://example.com)', 'http://example.com', '[b](http://example.com)', '#5 @octocat', '[c](mailto:team@example.com)'].join(' '))
    const links = tags(html).filter((tag) => tag.name === 'a')
    expect(links.map((link) => link.attributes.href)).toEqual([
      'https://example.com/',
      'http://example.com/',
      github('pull/5'),
      'https://github.com/octocat',
      'mailto:team@example.com',
    ])
    for (const link of links.slice(0, 4)) expect(link.attributes, link.attributes.href).toMatchObject({ target: '_blank', rel: 'noopener noreferrer' })
    expect(links[4].attributes.target).toBeUndefined()
  })

  it('stays quick on input built to slow a parser down', () => {
    // 20,000 characters each, the most github.ts keeps of a release's notes,
    // made to send a naive parser back over the same text again and again.
    const hostile = [
      '*a '.repeat(7000),
      '_a '.repeat(7000),
      '**a '.repeat(5000),
      `*a${' *b'.repeat(6666)}`,
      'a* '.repeat(7000),
      '['.repeat(20_000),
      '[a]('.repeat(5000),
      '![x'.repeat(7000),
      '`'.repeat(20_000),
      '``a `'.repeat(4000),
      '#'.repeat(20_000),
      '@a'.repeat(10_000),
      'https://'.repeat(2500),
      `https://example.com/${'('.repeat(2000)}`,
      `https://example.com/${')'.repeat(2000)}`,
      '  - a\n'.repeat(3000),
      `- a\n${'      b\n'.repeat(2500)}`,
      `${'['.repeat(500)}x${']'.repeat(500)}(https://example.com)`,
      `${'*a _b '.repeat(50)}c${' d_ e*'.repeat(50)}`,
    ]
    const started = performance.now()
    for (const text of hostile) expect(problems(render(text)), text.slice(0, 20)).toEqual([])
    // About 0.2 seconds for all of them. Searching the rest of the text again
    // for every mark (no Misses) takes 1.5 to 3 seconds on each of the first four.
    expect(performance.now() - started).toBeLessThan(5000)
  }, 30_000)

  it('renders images nested as deep as a note allows, quickly and within the stack', () => {
    // An image in an image's alt text is read one call deeper each time, and
    // only bold and italic have a depth limit. The deepest a note can nest
    // them is 4,000: 20,000 characters, all lib/admin/github.ts keeps.
    let nested = 'x'
    for (let depth = 0; depth < 4000; depth++) nested = `![${nested}]()`
    const started = performance.now()
    expect(problems(render(nested))).toEqual([])
    expect(performance.now() - started).toBeLessThan(5000)
  }, 30_000)
})

describe('safeHref', () => {
  it('passes https, http and mailto addresses, spelled the way the URL parser spells them', () => {
    expect(safeHref('https://example.com/a?b=1#c')).toBe('https://example.com/a?b=1#c')
    expect(safeHref('HTTPS://EXAMPLE.com')).toBe('https://example.com/')
    expect(safeHref('http://example.com')).toBe('http://example.com/')
    expect(safeHref('mailto:team@example.com')).toBe('mailto:team@example.com')
  })

  it('refuses every other address', () => {
    for (const address of [
      '',
      'javascript:alert(1)',
      'JAVASCRIPT:alert(1)',
      ' javascript:alert(1)',
      'java\nscript:alert(1)',
      'java\tscript:alert(1)',
      '\u0001javascript:alert(1)',
      'javascript\u0000:alert(1)',
      '&#106;avascript:alert(1)',
      'javascript&#58;alert(1)',
      'data:text/html,x',
      'vbscript:msgbox(1)',
      'file:///etc/passwd',
      'ftp://example.com',
      '/admin',
      'admin',
      '#top',
      '//evil.example',
      '\\\\evil.example',
      'https:\\\\evil.example',
      'https://',
      'https://exa mple.com',
      'https://example.com/"',
      "https://example.com/'",
      'https://example.com/<b>',
      'https://example.com/\u007f',
      `https://example.com/${'a'.repeat(2048)}`,
    ]) {
      expect(safeHref(address), JSON.stringify(address)).toBeNull()
    }
  })
})

describe('the admin pages', () => {
  it('never hand React an HTML string', () => {
    const files = ['app/admin', 'components/admin'].flatMap((dir) => sourceFiles(join(root, dir)))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) expect(readFileSync(file, 'utf8'), file).not.toMatch(/dangerouslySetInnerHTML|__html|innerHTML/)
  })
})
