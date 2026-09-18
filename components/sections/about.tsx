import Image from 'next/image'
import { sectionHeadingClass } from '@/components/ui/section-header'
import { team } from '@/data/team'

export function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="py-20 md:py-28">
      <div className="shell grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        <div>
          <h2 id="about-heading" className={sectionHeadingClass}>
            We built WSLATL because we got tired of watching hosting companies ignore their clients.
          </h2>
          <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
            <p>
              We have worked inside hosting companies. We have seen how tickets pile up, how clients get
              passed around, how no one actually knows your setup. It is frustrating and it is entirely
              avoidable.
            </p>
            <p>
              So we started WSLATL. Based in Missouri, privately run, and small enough that every client
              actually gets our attention. We are not trying to be the biggest hosting company. We are
              trying to be the one you would actually recommend to a friend.
            </p>
            <p className="font-medium text-foreground">
              Every client here is treated like family. That is the only way we know how to do this.
            </p>
          </div>
        </div>

        <div className="space-y-10">
          <figure className="border-l-2 border-primary/60 pl-6">
            <blockquote className="font-serif text-2xl leading-snug text-foreground italic md:text-[1.7rem]">
              &ldquo;In the hosting industry it is tough and you have to stand out. We just want to treat
              our clients like family and make sure they get the best experience they can.&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-sm text-muted-foreground">The WSLATL team</figcaption>
          </figure>

          <div>
            <h3 className="text-sm font-semibold text-foreground">The people behind WSLATL</h3>
            <ul className="mt-5 space-y-6">
              {team.map((member) => (
                <li key={member.name} className="flex gap-4">
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
