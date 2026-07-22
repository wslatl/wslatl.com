import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function AbuseContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          This Abuse Policy explains how to report abuse of infrastructure operated by WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), what we
          do with a report once we receive it, and how we deal with services on our network that
          are the source of abuse.
        </p>
        <p>
          It sits alongside our{' '}
          <a href={siteConfig.paths.acceptableUse} className="text-primary hover:underline">Acceptable Use Policy</a>,
          which defines what is and is not permitted on our infrastructure, and our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>,
          into which both are incorporated by reference. Copyright complaints are handled through
          our{' '}
          <a href={siteConfig.paths.dmca} className="text-primary hover:underline">DMCA Policy</a>{' '}
          rather than through this page.
        </p>
        <p>
          We are a small, private hosting company, and we take abuse of our network seriously,
          both because it harms other people and because it puts the clients who share our
          infrastructure at risk. Every credible report is investigated.
        </p>
      </LegalSection>

      <LegalSection number="2" title="How to Report Abuse">
        <p>
          If you believe any WSLATL infrastructure (a server, IP address, website, game server, or
          email) is being used for abusive, illegal, or harmful activity, report it to our abuse
          team. This is the fastest way to reach the people who can act on it.
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-2 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">Report abuse to:</p>
          <p>
            Email:{' '}
            <a href={`mailto:${siteConfig.email.abuse}`} className="text-primary hover:underline">
              {siteConfig.email.abuse}
            </a>{' '}
            (Subject: Abuse Report)
          </p>
          <p>
            Discord:{' '}
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {siteConfig.legal.discordVanity}
            </a>
          </p>
        </div>
        <p className="mt-4">
          Email is the channel we monitor for abuse and the one that creates a record we can act
          on. A report made only in a Discord channel may be missed; if a matter is time-sensitive,
          email it.
        </p>
      </LegalSection>

      <LegalSection number="3" title="What to Include in a Report">
        <p>
          The more precise your report, the faster we can find the source and act. Please include
          as much of the following as you have:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>The IP address, domain, URL, or server involved</li>
          <li>Timestamps of the activity, with the time zone or an offset from UTC</li>
          <li>Relevant log excerpts, email headers, or packet captures, pasted as text where possible</li>
          <li>A clear description of the activity and why you believe it is abusive</li>
          <li>How to contact you if we need more information</li>
        </ul>
        <p className="mt-4">
          Logs are most useful in their original text form with full headers intact. Screenshots
          are fine as a supplement, but they are harder to verify on their own.
        </p>
      </LegalSection>

      <LegalSection number="4" title="What We Treat as Abuse">
        <p>
          Abuse is any use of our infrastructure that violates our{' '}
          <a href={siteConfig.paths.acceptableUse} className="text-primary hover:underline">Acceptable Use Policy</a>{' '}
          or applicable law. Common categories we act on include:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Network attacks.</span> DDoS traffic,
            port and vulnerability scanning, brute-force attempts, or intrusion attempts
            originating from our IP space.
          </li>
          <li>
            <span className="text-foreground font-medium">Spam and unsolicited mail.</span> Bulk or
            unsolicited email, open mail relays, and mail spoofing.
          </li>
          <li>
            <span className="text-foreground font-medium">Phishing and fraud.</span> Pages or
            services built to steal credentials or payment details, or to deceive people for
            financial gain.
          </li>
          <li>
            <span className="text-foreground font-medium">Malware.</span> Hosting or distributing
            viruses, ransomware, command-and-control servers, or other malicious software.
          </li>
          <li>
            <span className="text-foreground font-medium">Illegal content.</span> Content that is
            unlawful to host, including the material described in Section 3 of our Acceptable Use
            Policy.
          </li>
          <li>
            <span className="text-foreground font-medium">Harassment and threats.</span> Using our
            services to harass, threaten, dox, or endanger a person.
          </li>
        </ul>
        <p className="mt-4">
          For the full account of what is prohibited, see Sections 3 and 4 of the Acceptable Use
          Policy. Copyright infringement is handled separately under the{' '}
          <a href={siteConfig.paths.dmca} className="text-primary hover:underline">DMCA Policy</a>.
        </p>
      </LegalSection>

      <LegalSection number="5" title="What Happens After You Report">
        <p>We review every credible report. Our general process is:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">We acknowledge it.</span> We aim to
            confirm receipt of an emailed report as quickly as we can, and we prioritize active,
            ongoing abuse over routine work.
          </li>
          <li>
            <span className="text-foreground font-medium">We investigate.</span> We identify the
            service involved, review the evidence, and determine whether our policies or the law
            have been broken.
          </li>
          <li>
            <span className="text-foreground font-medium">We act proportionately.</span> Depending
            on severity, we may contact the client for remediation, remove or disable specific
            content, suspend the service, or terminate the account. Enforcement follows Section 9
            of the Acceptable Use Policy.
          </li>
        </ul>

        <LegalSubSection title="5.1 Active Outbound Abuse: Suspend First">
          <p>
            When a service on our network is the active source of outbound abuse, such as a live
            DDoS, an ongoing spam run, or active scanning, we will suspend the service first and
            investigate second, to protect other clients and the broader internet. We reach out to
            the affected client promptly after suspension to explain what we found.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 What We Can Tell You">
          <p>
            We will confirm that a report has been received and acted on where we reasonably can.
            We do not share another client&rsquo;s account details, the specifics of an
            investigation, or the outcome of enforcement against a third party, and we may be
            limited in what we can disclose while an investigation is open or where the law requires
            confidentiality.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Cooperation with Registries & Authorities">
        <p>
          Where appropriate, we cooperate with abuse registries and reporting services and may
          share relevant logs and identifying information with them or with the operators of
          affected networks. We preserve evidence and report to law enforcement where the law
          requires it or where the conduct warrants it.
        </p>
        <div className="mt-4">
          <div className="legal-callout border-red-500/30 text-red-300">
            <strong>Child sexual abuse material</strong>
            We have zero tolerance for child sexual abuse material (CSAM). Confirmed CSAM is
            reported immediately to the National Center for Missing &amp; Exploited Children
            (NCMEC) and to law enforcement, the account is terminated, and evidence is preserved.
            To report suspected CSAM on our infrastructure, email {siteConfig.email.abuse} with
            &ldquo;CSAM&rdquo; in the subject line, or report directly to NCMEC through its
            CyberTipline.
          </div>
        </div>
      </LegalSection>

      <LegalSection number="7" title="Law Enforcement Requests">
        <p>
          Law enforcement seeking records or preservation should contact us at{' '}
          <a href={`mailto:${siteConfig.email.abuse}`} className="text-primary hover:underline">
            {siteConfig.email.abuse}
          </a>{' '}
          with &ldquo;Law Enforcement Request&rdquo; in the subject line. We respond to valid legal
          process served on WSLATL LLC, and we will preserve relevant records on a properly scoped
          preservation request while the appropriate process is obtained. We do not disclose client
          data without valid legal process, except where the law permits or requires it, such as an
          emergency involving a risk of death or serious physical harm.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Reports We Cannot Action Here">
        <p>Some matters belong in a different channel:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Copyright.</span> Copyright takedown
            notices and counter-notices go through our{' '}
            <a href={siteConfig.paths.dmca} className="text-primary hover:underline">DMCA Policy</a>,
            not this page.
          </li>
          <li>
            <span className="text-foreground font-medium">Content we do not host.</span> For a
            domain registered elsewhere, content on a third-party network, or an account on a
            platform we do not operate, we are not the correct recipient and cannot remove the
            material. Report it to the operator of that service.
          </li>
          <li>
            <span className="text-foreground font-medium">Billing and account questions.</span>{' '}
            Questions about your own service or billing go to{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
              {siteConfig.email.support}
            </a>, not the abuse channel.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Good-Faith Reporting">
        <p>
          Report honestly and in good faith. Knowingly false or bad-faith abuse reports, reports
          filed to harass another client, and attempts to weaponize this channel against a
          competitor waste the time we would otherwise spend on real harm. We may decline to act on
          reports from a source that has repeatedly abused this process.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Changes to This Policy">
        <p>
          We may update this Abuse Policy to reflect changes in our practices, our services, or
          applicable law. When we make material changes, we will update the effective date at the
          top of this page and post the updated policy at{' '}
          <a href={siteConfig.paths.abuse} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.abuse}
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contact">
        <p>
          Abuse reports should go to our abuse team. General questions about this policy can be sent
          to the addresses below.
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-1.5 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">WSLATL LLC</p>
          <p>Missouri, United States</p>
          <p>
            Abuse:{' '}
            <a href={`mailto:${siteConfig.email.abuse}`} className="text-primary hover:underline">{siteConfig.email.abuse}</a>
          </p>
          <p>
            General:{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">{siteConfig.email.support}</a>
            {' '}or{' '}
            <a href={`mailto:${siteConfig.email.info}`} className="text-primary hover:underline">{siteConfig.email.info}</a>
          </p>
          <p>
            Discord:{' '}
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {siteConfig.legal.discordVanity}
            </a>
          </p>
        </div>
      </LegalSection>
    </>
  )
}
