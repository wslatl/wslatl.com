import { Download as DownloadIcon } from 'lucide-react'
import { BrandPicture, BrandSection, Prose, SubSection } from '@/components/brand/brand-section'
import { WithEnglish } from '@/components/brand/with-english'
import { Button } from '@/components/ui/button'
import {
  downloadsPath,
  gradientCss,
  gradients,
  ink,
  lockupDownloads,
  markDownloads,
  markSizes,
  pictures,
  subline,
  type Download,
  type PictureId,
} from '@/data/brand'
import { languageTag } from '@/i18n/dates'
import { copy } from '@/i18n/copy'
import { getLocale } from '@/i18n/locale'
import { cn } from '@/lib/utils'

/** The mark or the lockup on a solid panel, with room around it: more than the clear space the guide asks for. */
function Specimen({
  picture,
  alt,
  caption,
  surface,
}: {
  picture: Extract<PictureId, 'mark' | 'lockup'>
  alt: string
  caption: string
  surface: 'white' | 'ink'
}) {
  return (
    <figure className="overflow-hidden rounded-2xl border">
      <div
        className={cn(
          'relative flex min-h-60 items-center justify-center px-6 py-12 sm:px-10',
          surface === 'white' && 'bg-white',
        )}
        style={surface === 'ink' ? { backgroundColor: ink.hex } : undefined}
      >
        <BrandPicture id={picture} alt={alt} />
        {/* The guide's own example: an Ink panel with the gradient as an accent bar along its edge. Never behind the logo. */}
        {surface === 'ink' && (
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1"
            style={{ backgroundImage: gradientCss(gradients[0]) }}
          />
        )}
      </div>
      <figcaption className="border-t px-4 py-3 text-sm text-muted-foreground">{caption}</figcaption>
    </figure>
  )
}

/** A PNG to download: its size, and "PNG". The name it saves under is the kit's. */
function DownloadLink({ file, width, height }: Download) {
  const t = copy().brand.logo.downloads
  return (
    <Button asChild variant="outline" size="sm" className="tabular-nums">
      <a href={`${downloadsPath}/${file}`} download>
        <DownloadIcon aria-hidden="true" />
        <span className="sr-only">{t.download} </span>
        {width} × {height}
        <span className="text-xs font-normal text-muted-foreground">PNG</span>
      </a>
    </Button>
  )
}

function Downloads() {
  const t = copy().brand.logo.downloads
  return (
    <SubSection id="downloads" title={t.heading}>
      <Prose>{t.intro}</Prose>
      <div className="grid gap-5 pt-2 lg:grid-cols-2">
        <div className="rounded-2xl border bg-card/30 p-5 sm:p-6">
          <h4 className="font-semibold text-foreground">{t.markHeading}</h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.markBody}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {markDownloads.map((download) => (
              <li key={download.file}>
                <DownloadLink {...download} />
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card/30 p-5 sm:p-6">
          <h4 className="font-semibold text-foreground">{t.lockupHeading}</h4>
          <ul className="mt-2 divide-y">
            {lockupDownloads.map(({ use, ...download }) => (
              <li key={download.file} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
                <span className="text-sm text-muted-foreground">{t.uses[use]}</span>
                <DownloadLink {...download} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Prose className="text-sm">
        {t.morePrefix}{' '}
        <a href="#full-kit" className="text-link underline underline-offset-4 hover:text-foreground">
          {t.moreLink}
        </a>
        {t.moreSuffix}
      </Prose>
    </SubSection>
  )
}

function Specimens() {
  const t = copy().brand.logo
  return (
    <SubSection title={t.partsHeading}>
      <Prose>
        <WithEnglish text={t.parts} english={[subline]} />
      </Prose>
      <div className="grid gap-5 pt-2 md:grid-cols-2">
        <Specimen picture="mark" surface="white" alt={t.alt.markWhite} caption={t.specimens.markWhite} />
        <Specimen picture="mark" surface="ink" alt={t.alt.markInk} caption={`${t.specimens.markInk} (${ink.hex})`} />
        <Specimen picture="lockup" surface="white" alt={t.alt.lockupWhite} caption={t.specimens.lockupWhite} />
        <Specimen
          picture="lockup"
          surface="ink"
          alt={t.alt.lockupInk}
          caption={`${t.specimens.lockupInk} (${ink.hex})`}
        />
      </div>
      <Prose>{t.surfaces}</Prose>
      <Prose>
        <strong className="font-semibold text-foreground">{t.violetLead}</strong> {t.violet}
      </Prose>
    </SubSection>
  )
}

/** A diagram from the guide, on the white it was drawn on, with what it shows written under it. */
function Diagram({ id, alt, caption }: { id: PictureId; alt: string; caption?: string }) {
  return (
    <figure style={{ maxWidth: pictures[id].width }} className="w-full">
      <div className="overflow-hidden rounded-xl border bg-white">
        <BrandPicture id={id} alt={alt} />
      </div>
      {caption && <figcaption className="mt-2 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

function ClearSpace() {
  const t = copy().brand.logo
  return (
    <SubSection title={t.clearSpace.heading}>
      <Prose>{t.clearSpace.body}</Prose>
      <Prose>{t.clearSpace.lockup}</Prose>
      <div className="flex flex-wrap items-end gap-x-8 gap-y-6 pt-2">
        <Diagram id="clearSpaceMark" alt={t.alt.clearSpaceMark} caption={t.clearSpace.markCaption} />
        <Diagram id="clearSpaceLockup" alt={t.alt.clearSpaceLockup} caption={t.clearSpace.lockupCaption} />
      </div>
    </SubSection>
  )
}

function MinimumSizes() {
  const t = copy().brand.logo
  const locale = getLocale()
  // 16, 32, 48 ... 512 and 1024, joined the way the reader's language joins a list.
  const sizes = new Intl.ListFormat(languageTag(locale), { style: 'long', type: 'conjunction' }).format(
    markSizes.map(String),
  )
  const rows = [
    { name: t.minimum.mark, screen: t.minimum.markScreen, print: t.minimum.markPrint },
    { name: t.minimum.lockup, screen: t.minimum.lockupScreen, print: t.minimum.lockupPrint },
  ]
  return (
    <SubSection title={t.minimum.heading}>
      <Prose>
        <WithEnglish text={t.minimum.body} english={[subline]} />
      </Prose>
      <div className="max-w-2xl overflow-hidden rounded-xl border">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{t.minimum.heading}</caption>
          <thead className="bg-card/60 text-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t.minimum.artwork}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t.minimum.columnScreen}
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                {t.minimum.columnPrint}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y text-muted-foreground">
            {rows.map((row) => (
              <tr key={row.name}>
                <th scope="row" className="px-4 py-3 font-medium text-foreground">
                  {row.name}
                </th>
                <td className="px-4 py-3 tabular-nums">{row.screen}</td>
                <td className="px-4 py-3 tabular-nums">{row.print}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Prose>{t.minimum.shipped(sizes)}</Prose>
      <div className="pt-2">
        <Diagram id="minimumSizes" alt={t.alt.minimumSizes} />
      </div>
    </SubSection>
  )
}

function WhichFile() {
  const t = copy().brand.logo.which
  return (
    <SubSection title={t.heading}>
      <ul className="grid gap-5 pt-2 md:grid-cols-3">
        {t.rows.map((row) => (
          <li key={row.space} className="rounded-2xl border bg-card/30 p-5">
            <h4 className="font-semibold text-foreground">{row.space}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.examples}</p>
            <p className="mt-4 font-medium text-link">{row.pick}</p>
          </li>
        ))}
      </ul>
    </SubSection>
  )
}

/** Part 1: the mark and the lockup on white and on Ink, clear space, minimum sizes, the downloads and which one to pick. */
export function LogoSection() {
  const t = copy().brand
  return (
    <BrandSection id="logo" number="1" title={t.logo.heading} intro={t.logo.intro}>
      <Specimens />
      <ClearSpace />
      <MinimumSizes />
      <Downloads />
      <WhichFile />
    </BrandSection>
  )
}
