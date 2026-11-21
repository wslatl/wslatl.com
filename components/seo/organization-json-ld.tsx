import { JsonLd } from '@/components/seo/json-ld'
import { shortLinks } from '@/config/links'
import { siteConfig } from '@/config/site'
import { defaultLocale, localePath, locales, type Locale } from '@/i18n/config'
import { wordsFor } from '@/i18n/words'

/** The id every other page of the site points at when it names the company. */
export const organizationId = `${siteConfig.siteUrl}/#organization`

/**
 * The company, for Google's knowledge panel. It is written once per
 * language, in full, on the five home pages only; every other page refers to
 * it by `organizationId` and does not repeat it.
 *
 * Everything that names the entity is the same in every language (the id,
 * the names, the address of the site, the logo and the profiles in sameAs),
 * so the five are read as one company. What is in the reader's language is
 * the description, which is the sentence in messages/<locale>.json, and the
 * contact point's address. The slogan is deliberately English, so it says so.
 *
 * The contact point links the contact section of the home page rather than an
 * email address: components/ui/email.tsx scrambles the address in the page on
 * purpose, and this would publish it in plain text.
 */
export function OrganizationJsonLd({ locale }: { locale: Locale }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': organizationId,
        // The name the site goes by everywhere (WebSite, og:site_name,
        // application-name); the company's full name is the legal name.
        name: siteConfig.brand,
        legalName: siteConfig.legal.companyName,
        alternateName: [siteConfig.name, `${siteConfig.brand} Hosting`],
        url: siteConfig.siteUrl,
        // 512px square, a white mark on near-black: legible on a white results page.
        logo: { '@type': 'ImageObject', url: `${siteConfig.siteUrl}/logo.png`, width: 512, height: 512 },
        slogan: { '@language': defaultLocale, '@value': siteConfig.slogan },
        description: wordsFor(locale, 'organization')('description'),
        address: {
          '@type': 'PostalAddress',
          addressRegion: 'MO',
          addressCountry: 'US',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            url: `${siteConfig.siteUrl}${localePath(locale, siteConfig.paths.contact)}`,
            availableLanguage: [...locales],
            areaServed: 'Worldwide',
          },
        ],
        // Profiles by their real addresses: search engines match these, not redirects.
        sameAs: [shortLinks.discord.url, shortLinks.trustpilot.url, shortLinks.github.url],
      }}
    />
  )
}
