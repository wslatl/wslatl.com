import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function SlaContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          This Service Level Agreement (&ldquo;SLA&rdquo;) sets out the uptime targets WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) aims to
          meet for each service type, how we handle maintenance, and the service credit you can
          claim when we fall short.
        </p>
        <div className="mt-3">
          <div className="legal-callout border-primary/30 text-primary">
            <strong>This is a restatement, not a new commitment</strong>
            This page reproduces Section 5 of our{' '}
            <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>{' '}
            as a standalone document so it is easier to find and cite. The commitments here are
            the same commitments already in the Terms. Nothing has been added, removed, or
            changed. If the two documents ever conflict, the Terms of Service controls.
          </div>
        </div>
        <p className="mt-4">
          This SLA applies to clients with active, paid services in good standing. It does not
          apply to suspended services, services in a non-payment grace period, trial or
          complimentary arrangements, or services terminated for cause.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Uptime Targets">
        <div className="overflow-x-auto mt-2">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Monthly Uptime Target</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>VPS Hosting</td>
                <td>99.9%</td>
              </tr>
              <tr>
                <td>Web Hosting</td>
                <td>99.9%</td>
              </tr>
              <tr>
                <td>Game Server Hosting</td>
                <td>99.5%</td>
              </tr>
              <tr>
                <td>Dedicated Servers</td>
                <td>Best-effort; subject to hardware and datacenter availability</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Uptime is measured per calendar month and excludes scheduled maintenance windows and
          downtime caused by events outside our reasonable control (see Section 15 of the Terms of
          Service, Force Majeure).
        </p>
      </LegalSection>

      <LegalSection number="3" title="Scheduled Maintenance">
        <p>
          We will provide at least{' '}
          <span className="text-foreground font-medium">24 hours&rsquo; advance notice</span> for
          scheduled maintenance windows via our status page (status.wslatl.com) and/or email to
          affected clients. Emergency maintenance required to protect service integrity or security
          may be performed without prior notice, though we will communicate as quickly as possible.
        </p>
        <p>
          Our status page is at{' '}
          <a
            href={siteConfig.links.status}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            status.wslatl.com
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Service Credits">
        <p>
          If we fail to meet the applicable uptime target due to our fault, you may request a service
          credit equal to <span className="text-foreground font-medium">10% of the affected service&apos;s monthly cost</span> per
          qualifying incident. Credits are applied to your account balance and will not exceed the
          cost of one full month of the affected service. Service credits are your sole and exclusive
          remedy for uptime failures and do not entitle you to a cash refund.
        </p>
        <p className="mt-2">
          To request a credit, contact us within 15 days of the incident at {siteConfig.email.support} with
          the date, duration, and nature of the outage.
        </p>

        <LegalSubSection title="4.1 How Credits Are Held">
          <p>
            A service credit issued under this SLA is applied to your account balance as account
            credit. Once issued, it behaves like any other account credit: it is spendable on
            WSLATL invoices, it does not expire, and it is not redeemable for cash. See our{' '}
            <a href={siteConfig.paths.accountCredit} className="text-primary hover:underline">Account Credit Terms</a>{' '}
            for the full treatment.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Relationship to the Refund Policy">
          <p>
            A service credit under this SLA and a refund under our{' '}
            <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>{' '}
            are separate remedies. As stated in Section 3.1 of the Refund Policy, an outage
            exceeding the applicable uptime target may also be a qualifying reason for a refund
            during the 14-day window, and that refund right is in addition to the 10% service
            credit rather than in place of it. Refund eligibility is decided under the Refund
            Policy, not under this SLA.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Exclusions">
        <p>
          Consistent with Section 2 above, the uptime targets in this SLA do not cover downtime
          attributable to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Scheduled maintenance windows notified in accordance with Section 3</li>
          <li>Events outside our reasonable control, as described in Section 15 of the Terms of Service</li>
        </ul>
        <p className="mt-3">
          The dedicated server line in the table above is a best-effort target rather than a
          measured percentage, because availability depends on hardware and on the datacenter
          hosting it.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Changes to This SLA">
        <p>
          Because this document restates Section 5 of the Terms of Service, changes to the
          commitments here are made through the Terms and follow the notice process in Section 14
          of the Terms of Service. When the commitments change, we will update the effective date
          at the top of this page and post the updated SLA at{' '}
          <a href={siteConfig.paths.sla} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contact">
        <p>
          Service credit claims and questions about this SLA should be directed to:
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-1.5 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">WSLATL LLC</p>
          <p>Missouri, United States</p>
          <p>
            Email:{' '}
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
