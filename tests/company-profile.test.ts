import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { GET, dynamic } from '@/app/company.json/route'
import { buildCompanyProfile, companyProfileVersion } from '@/lib/company-profile'
import { shortLinks } from '@/config/links'
import { siteConfig } from '@/config/site'
import { faqs } from '@/data/faqs'
import { legalPages, legalSlug } from '@/data/legal'
import { team } from '@/data/team'
import { en } from '@/i18n/copy/en'
import { entryPlan, formatPrice, startingPrice } from '@/lib/pricing'
import { rewriteTarget } from '@/i18n/routing'

const root = join(__dirname, '..')
const built = new Date('2026-10-11T12:00:00.000Z')

describe('the company profile', () => {
  const profile = buildCompanyProfile(built)

  it('has exactly the agreed shape', () => {
    expect(Object.keys(profile).toSorted()).toEqual(
      [
        'about',
        'description',
        'faqs',
        'legal',
        'legalName',
        'links',
        'location',
        'name',
        'shortDescription',
        'team',
        'updatedAt',
        'version',
        'website',
      ].toSorted(),
    )
    expect(profile.version).toBe(1)
    expect(companyProfileVersion).toBe(1)
    expect(Object.keys(profile.about).toSorted()).toEqual(['closing', 'heading', 'paragraphs'])
    for (const member of profile.team) expect(Object.keys(member).toSorted()).toEqual(['bio', 'name', 'role'])
    for (const faq of profile.faqs) expect(Object.keys(faq).toSorted()).toEqual(['answer', 'id', 'question'])
  })

  it('takes the company facts from the site config', () => {
    expect(profile.name).toBe(siteConfig.name)
    expect(profile.legalName).toBe(siteConfig.legal.companyName)
    expect(profile.location).toBe(siteConfig.location)
    expect(profile.description).toBe(siteConfig.description)
    expect(profile.shortDescription).toBe(siteConfig.shortDescription)
    expect(profile.website).toBe(siteConfig.siteUrl)
  })

  it('lists the same people as the team data, without their photos', () => {
    expect(profile.team).toEqual(team.map(({ name, role, bio }) => ({ name, role, bio })))
    expect(JSON.stringify(profile)).not.toContain('/owners/')
  })

  it('tells the story from the English home copy', () => {
    expect(profile.about).toEqual({
      heading: en.home.about.heading,
      paragraphs: en.home.about.paragraphs,
      closing: en.home.about.closing,
    })
  })

  it('links to every company address as a full https URL, and leaves out the site credit', () => {
    const expected = Object.entries(shortLinks)
      .filter(([key]) => key !== 'credits')
      .map(([key]) => key)
    expect(Object.keys(profile.links).toSorted()).toEqual(expected.toSorted())
    for (const [key, url] of Object.entries(profile.links)) {
      expect(url, key).toMatch(/^https:\/\//)
      expect(url, key).toBe(shortLinks[key as keyof typeof shortLinks].url)
    }
    expect(profile.links).not.toHaveProperty('credits')
  })

  it('links to every legal document by its address on this site', () => {
    expect(Object.keys(profile.legal).toSorted()).toEqual(legalPages.map(legalSlug).toSorted())
    for (const [slug, url] of Object.entries(profile.legal)) {
      expect(url).toBe(`https://wslatl.com/legal/${slug}`)
    }
  })

  it('carries every question, with the prices filled in', () => {
    expect(profile.faqs.map((faq) => faq.id)).toEqual(faqs.map((faq) => faq.id))
    expect(profile.faqs.map((faq) => faq.question)).toEqual(faqs.map((faq) => faq.question))

    const cost = profile.faqs.find((faq) => faq.id === 'game-server-cost')?.answer ?? ''
    expect(cost).toContain(formatPrice(entryPlan('game', 'budget').price))
    expect(cost).toContain(formatPrice(startingPrice('game', 'premium')))
    expect(cost).toContain(formatPrice(startingPrice('vps')))

    // The pricing tokens are filled everywhere; none is left as {gamePrice}.
    for (const faq of profile.faqs) expect(faq.answer, faq.id).not.toMatch(/\{\w+\}/)
  })

  it('records when it was built', () => {
    expect(profile.updatedAt).toBe('2026-10-11T12:00:00.000Z')
    expect(Number.isNaN(Date.parse(buildCompanyProfile().updatedAt))).toBe(false)
  })

  it('holds no secrets and no email addresses', () => {
    const text = JSON.stringify(profile)
    // Addresses are kept out of anything served on purpose (config/emails.ts).
    expect(text).not.toContain('@')
    expect(text).not.toMatch(/secret|password|passwd|api[_-]?key|bearer|token|private key/i)
    expect(text).not.toMatch(/process\.env|localhost|127\.0\.0\.1/)
    // Nothing but https links, and nothing with credentials or a query string in it.
    for (const url of [...Object.values(profile.links), ...Object.values(profile.legal), profile.website]) {
      const parsed = new URL(url)
      expect(parsed.protocol, url).toBe('https:')
      expect(parsed.username + parsed.password, url).toBe('')
      expect(parsed.search, url).toBe('')
    }
  })

  it('is small enough for the billing panel to accept', () => {
    expect(JSON.stringify(profile).length).toBeLessThan(100_000)
  })
})

describe('/company.json', () => {
  it('is written once at build time', () => {
    expect(dynamic).toBe('force-static')
  })

  it('answers with the profile as JSON that anyone may keep for an hour at most', async () => {
    const response = GET()
    expect(response.status).toBe(200)
    expect(response.headers.get('content-type')).toMatch(/^application\/json/)

    const cacheControl = response.headers.get('cache-control') ?? ''
    expect(cacheControl).toMatch(/\bpublic\b/)
    const maxAge = Number(/max-age=(\d+)/.exec(cacheControl)?.[1])
    expect(maxAge).toBeGreaterThan(0)
    expect(maxAge).toBeLessThanOrEqual(3600)

    const body = await response.json()
    expect(body).toEqual({ ...buildCompanyProfile(), updatedAt: body.updatedAt })
    expect(Number.isNaN(Date.parse(body.updatedAt))).toBe(false)
  })

  it('is left alone by the language rewrite, or it would answer with the 404 page', () => {
    expect(existsSync(join(root, 'app', 'company.json', 'route.ts'))).toBe(true)
    expect(rewriteTarget('/company.json')).toBeNull()
  })
})
