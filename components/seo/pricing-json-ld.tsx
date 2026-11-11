import { JsonLd } from '@/components/seo/json-ld'
import type { ProductLine } from '@/data/pricing'
import type { Locale } from '@/i18n/config'
import { pageUrl } from '@/lib/metadata'
import { siteConfig } from '@/config/site'

/**
 * Every plan on the pricing page as a Product with one Offer, so a search
 * engine can read the monthly price the page shows. Everything comes from
 * data/pricing.ts, through the same lines the page renders: a plan's name is
 * its code, its price is its monthly price in US dollars, and its
 * description is its specification. Nothing here is written by hand.
 */
export function PricingJsonLd({ lines, locale }: { lines: ProductLine[]; locale: Locale }) {
  const url = pageUrl(locale, '/pricing')
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: lines
          .flatMap((line) => line.groups.map((group) => ({ line, group })))
          .flatMap(({ line, group }) => group.plans.map((plan) => ({ line, group, plan })))
          .map(({ line, group, plan }, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: plan.name,
              category: group.label,
              description: `${plan.cpu} ${line.cpuUnit}, ${plan.ramGb} GB RAM, ${plan.storageGb} GB ${group.storageType}`,
              brand: { '@id': `${siteConfig.siteUrl}/#organization` },
              url: `${url}#${line.anchor}`,
              offers: {
                '@type': 'Offer',
                price: plan.price.toFixed(2),
                priceCurrency: 'USD',
                url: `${url}#${line.anchor}`,
                priceSpecification: {
                  '@type': 'UnitPriceSpecification',
                  price: plan.price.toFixed(2),
                  priceCurrency: 'USD',
                  unitCode: 'MON',
                },
              },
            },
          })),
      }}
    />
  )
}
