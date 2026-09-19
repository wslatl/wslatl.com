import Image from 'next/image'
import { sectionHeadingClass } from '@/components/ui/section-header'
import { copy } from '@/i18n/copy'
import { localizedTeam } from '@/i18n/content'

export function About() {
  const t = copy().home.about
  const team = localizedTeam()

  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28">
      <div className="shell">
        <h2 id="about-heading" className={`${sectionHeadingClass} max-w-4xl`}>
          {t.heading}
        </h2>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <div className="space-y-4 leading-relaxed text-muted-foreground">
              {t.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p className="font-medium text-foreground">{t.closing}</p>
            </div>

            <figure className="mt-10 border-l-2 border-primary/60 pl-6">
              <blockquote className="font-serif text-2xl leading-snug text-foreground italic md:text-[1.7rem]">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted-foreground">{t.quoteAttribution}</figcaption>
            </figure>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t.teamHeading}</h3>
            <ul className="mt-5 divide-y border-y">
              {team.map((member) => (
                <li key={member.name} className="flex gap-4 py-6">
                  <Image
                    src={member.photo}
                    alt=""
                    width={64}
                    height={64}
                    className="size-16 shrink-0 rounded-full object-cover ring-1 ring-border"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-sm text-link">{member.role}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
