import Image from 'next/image'
import { Pause } from 'lucide-react'
import { PartnerAvatar } from '@/components/partners/partner-pictures'
import type { Partner } from '@/data/partners'
import { clientStrip, stripName, type StripEntry } from '@/lib/clients'
import { partnerStripAvatar, stripAvatarSize } from '@/lib/partners'
import { cn } from '@/lib/utils'
import { copy } from '@/i18n/copy'

/** Two copies make one seamless loop. */
const LOOP_COPIES = 2
/** Each copy holds at least this many logos, repeating the list if it has to, so it is wider than the strip on any screen. */
const MIN_PER_COPY = 10
/** How long each logo takes to pass, so the strip keeps its pace however many clients and partners it holds. */
const SECONDS_PER_LOGO = 4.5

const entryKey = (entry: StripEntry) => (entry.kind === 'client' ? `client-${entry.client.name}` : `partner-${entry.partner.slug}`)

/**
 * A partner has a square picture rather than a wordmark, so the strip shows
 * it small and round beside their name, in the same tone as the logos. It
 * loads the picture's small copy (partnerStripAvatar), or shows their
 * initials when they gave none.
 */
function PartnerMark({ partner }: { partner: Partner }) {
  const picture = partnerStripAvatar(partner)
  return (
    <span className="flex items-center gap-2.5 opacity-75 grayscale sm:gap-3">
      {picture ? (
        <Image
          src={picture}
          alt=""
          width={stripAvatarSize}
          height={stripAvatarSize}
          className="size-7 rounded-full sm:size-10"
        />
      ) : (
        <PartnerAvatar name={partner.name} alt="" className="size-7 text-[0.5rem] ring-0 sm:size-10 sm:text-[0.625rem]" />
      )}
      <span className="text-lg font-semibold tracking-tight whitespace-nowrap text-foreground sm:text-2xl">{partner.name}</span>
    </span>
  )
}

export function Clients() {
  const t = copy().home.clients
  const strip = clientStrip()
  if (strip.length === 0) return null
  const repeats = Math.ceil(MIN_PER_COPY / strip.length)
  const duration = `${strip.length * repeats * SECONDS_PER_LOGO}s`

  return (
    <section aria-labelledby="clients-heading" className="marquee shell pb-6">
      <div className="flex items-center justify-center gap-3">
        <h2 id="clients-heading" className="text-sm text-muted-foreground">
          {t.heading}
        </h2>
        {/* Moving content needs a way to stop it (WCAG 2.2.2). A checkbox works without JavaScript. */}
        <label className="marquee-toggle inline-flex cursor-pointer items-center rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
          <input type="checkbox" className="sr-only" />
          <Pause aria-hidden="true" className="size-3.5" />
          <span className="sr-only">{t.pause}</span>
        </label>
      </div>

      {/* Announced once as a list; the moving strip below is decorative. */}
      <ul className="sr-only">
        {strip.map((entry) => (
          <li key={entryKey(entry)}>{stripName(entry)}</li>
        ))}
      </ul>

      <div aria-hidden="true" className="marquee-viewport mt-7 overflow-hidden">
        <div className="marquee-track flex w-max" style={{ animationDuration: duration }}>
          {Array.from({ length: LOOP_COPIES }, (_slot, loop) => (
            <div key={loop} className={cn('flex shrink-0 items-center', loop > 0 && 'marquee-dup')}>
              {Array.from({ length: repeats }, (_set, repeat) =>
                strip.map((entry) => (
                  <div
                    key={`${repeat}-${entryKey(entry)}`}
                    className={cn('flex shrink-0 items-center px-7 sm:px-10', repeat > 0 && 'marquee-dup')}
                  >
                    {entry.kind === 'client' ? (
                      <Image
                        src={entry.client.logo}
                        alt=""
                        width={entry.client.width}
                        height={entry.client.height}
                        className={cn(entry.client.heightClass, 'w-auto opacity-75 grayscale')}
                      />
                    ) : (
                      <PartnerMark partner={entry.partner} />
                    )}
                  </div>
                )),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
