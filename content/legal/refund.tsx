import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { uptimeTarget } from '@/data/sla'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function RefundContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          This Refund Policy governs all refund requests for services provided by WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). It applies
          to dedicated servers, game server hosting, VPS hosting, and web hosting services.
        </p>
        <p>
          This policy is incorporated into and made part of our{' '}
          <Link href={siteConfig.paths.terms}>Terms of Service</Link> by reference.
          The rules below are the authoritative source for refund eligibility, windows, and
          processing. In the event of any conflict between this Refund Policy and any other WSLATL
          document, this Refund Policy controls.
        </p>
        <p>
          We are a small, private hosting company. This policy exists to be fair, not adversarial.
          We will always handle refund requests honestly and in good faith. If something is not
          covered below, contact us and we will work it out with you directly.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Refund Windows">
        <p>
          We operate a two-tier refund window measured from the date of your initial purchase of
          the service. Both tiers are summarized below:
        </p>

        <ScrollTable label="Refund windows">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Window</th>
                <th scope="col">Eligibility</th>
                <th scope="col">Refund Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">0 to 48 hours</td>
                <td>Any reason, including change of mind. No questions asked.</td>
                <td>Full refund</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">49 hours to 14 days</td>
                <td>Case-by-case. Only the qualifying reasons listed in Section 3 apply.</td>
                <td>Full refund for eligible services</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">After 14 days</td>
                <td>No refunds.</td>
                <td>None</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>
          The <strong>initial purchase date</strong> is the date
          the service was first activated and provisioned for you, not the date of any subsequent
          renewal. Renewals reset their own 14-day window (see Section 9).
        </p>

        <LegalSubSection title="2.1 48-Hour Window, Any Reason">
          <p>
            If you request a refund within{' '}
            <strong>48 hours</strong> of the initial purchase
            date of a service, we will issue a full refund. This is the change-of-mind window. We
            will not require a reason, and we will not ask you to justify your decision.
          </p>
          <p>
            Items listed in Section 5 (Non-Refundable Items) are excluded even within the 48-hour
            window. In particular, dedicated servers are not refundable under any circumstances
            (see Section 5.1).
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 14-Day Window, Case-by-Case">
          <p>
            Between <strong>49 hours and 14 calendar days</strong>{' '}
            of the initial purchase date, full refunds are issued only for the specific qualifying
            reasons listed in Section 3. Refund requests outside of those reasons are not eligible
            during this window.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Qualifying Reasons (14-Day Window)">
        <p>
          The following reasons qualify for a full refund during the 14-day case-by-case window.
          We may ask you to provide supporting information (timestamps, error messages, ticket
          history, etc.) to verify the reason.
        </p>

        <LegalSubSection title="3.1 Service Outage Exceeding SLA">
          <p>
            If your service experiences an outage that exceeds the applicable uptime target in our{' '}
            <Link href={siteConfig.paths.sla}>Service Level Agreement</Link>{' '}
            ({uptimeTarget('vps')} for VPS and Web hosting, {uptimeTarget('game')} for game server hosting), you may request a full
            refund for the affected service. Outages caused by events outside our reasonable
            control (force majeure) do not qualify.
          </p>
          <p>
            To qualify, the outage must be verifiable through our status page, monitoring systems,
            or your own documented evidence. The 10% SLA credit described in the Service Level
            Agreement remains available as a separate remedy; this refund right is in addition to
            it, not in place of it.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Billing Error">
          <p>
            If you were charged an incorrect amount, double-billed, or billed for a service you did
            not authorize, you are eligible for a full refund of the erroneous charge. This
            applies regardless of the time window in which the error is discovered. Please report
            suspected billing errors as soon as you notice them.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Service Did Not Function">
          <p>
            If the service you purchased never worked or had a critical defect that we were unable
            to resolve, you may be eligible for a full refund.
          </p>
          <p>
            <strong>You must have contacted us first.</strong>{' '}
            To qualify under this section, you must have made a reasonable effort to reach out to
            us about the issue before requesting a refund. Acceptable contact channels are:
          </p>
          <ul>
            <li>A support ticket opened in our billing portal</li>
            <li>An email to <Email name="support" /></li>
            <li>A message in our Discord server or a direct message to our team</li>
          </ul>
          <p>
            We need to see evidence of contact (a ticket number, email thread, or message log) to
            confirm we were given a chance to diagnose and fix the problem. Refund requests on
            this basis without any prior contact attempt will be declined.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Change of Mind">
        <p>
          Change of mind is a qualifying reason only within the 48-hour window described in
          Section 2.1. After 48 hours have elapsed from the initial purchase date, change of
          mind is not an eligible reason for a refund under this policy.
        </p>
        <p>
          If you are unsure whether a service is right for you, we strongly recommend reaching out
          to us on Discord before purchasing. We are happy to answer technical questions and help
          you pick the right plan. The application-only onboarding process is also a good
          opportunity to ask questions and confirm fit.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Non-Refundable Items">
        <p>
          The following are <strong>not refundable</strong>{' '}
          under any circumstances. This list applies to both the 48-hour and 14-day windows.
        </p>

        <Callout tone="critical" title="5.1 Dedicated Servers">
          Dedicated servers are not eligible for refunds of any kind, at any time, for any
          reason. Hardware procurement, IP allocations, datacenter rack space, and bandwidth
          commitments are made on the assumption of long-term tenancy. This exclusion applies
          even within the 48-hour change-of-mind window.
        </Callout>

        <ul>
          <li>
            <strong>Setup fees and custom provisioning:</strong>{' '}
            One-time setup fees, operating system installation, custom configuration work, manual
            migrations, and similar non-recurring charges. These cover labor and resources that
            cannot be recovered once performed.
          </li>
          <li>
            <strong>Third-party license fees:</strong>{' '}
            Pass-through costs we cannot recover from the vendor, including cPanel licenses,
            Pterodactyl licensing, and other software we resell as part of a plan.
          </li>
          <li>
            <strong>Domain registration and renewal fees:</strong>{' '}
            Any domain-related charges incurred through us. Domain registrations go through a
            registrar and are governed by the registrar&apos;s own refund terms.
          </li>
          <li>
            <strong>Add-ons already consumed:</strong>{' '}
            Additional IP addresses, bandwidth overages, backup restores, and any other
            consumption-based or one-time add-on charges that have already been delivered or
            incurred by the time of the refund request.
          </li>
          <li>
            <strong>Services terminated for AUP or Terms violations:</strong>{' '}
            If your service was suspended or terminated due to a violation of our{' '}
            <Link href={siteConfig.paths.acceptableUse}>Acceptable Use Policy</Link>{' '}
            or Terms of Service, no refund will be issued. This applies even if the termination
            occurred within 48 hours or within the 14-day window.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="How to Request a Refund">
        <p>
          To request a refund, contact us through any of the following channels. The billing portal
          ticket is preferred because it gives us the most direct access to your account and
          invoice history.
        </p>
        <ul>
          <li>
            <strong>Billing portal ticket:</strong> Log in at{' '}
            <ShortLink name="billing" />{' '}
            and open a support ticket
          </li>
          <li>
            <strong>Email:</strong>{' '}
            <Email name="support" />
          </li>
          <li>
            <strong>Discord:</strong>{' '}
            <ShortLink name="discord" />
          </li>
        </ul>
        <p>
          To help us process your request quickly, please include:
        </p>
        <ul>
          <li>The email address on your WSLATL account</li>
          <li>The service you are requesting a refund for</li>
          <li>The invoice number(s) involved</li>
          <li>The reason for the refund</li>
          <li>Any supporting evidence (ticket numbers, error logs, screenshots) for Section 3 requests</li>
        </ul>
        <p>
          Refund requests are typically reviewed within{' '}
          <strong>5 business days</strong> of receipt. We will
          respond to you with a decision and, if approved, an estimated processing timeline.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Processing & Method">
        <p>
          An approved refund is issued in one of two forms: back to the original payment method,
          or as account credit. We will tell you which form applies when we approve your request.
        </p>

        <LegalSubSection title="7.1 Refund to the Original Payment Method">
          <p>
            Where a refund is returned to your payment method, it goes to the{' '}
            <strong>original payment method</strong> used for
            the purchase. We do not refund to a different card or account than the one originally
            charged.
          </p>
          <p>
            Once we issue the refund, processing time depends on your payment provider:
          </p>
          <ul>
            <li>Credit and debit card refunds typically appear within <strong>5 to 10 business days</strong>, depending on the issuer</li>
            <li>Bank transfer and ACH refunds can take up to 10 business days</li>
            <li>Refunds through any other payment platform we accept are subject to the processing time of that platform</li>
          </ul>
          <p>
            If a refund has not appeared on your statement after 15 business days, contact us and
            we will investigate with the payment processor.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.2 Refund as Account Credit">
          <p>
            We may instead approve a refund as{' '}
            <strong>account credit</strong>, added to the
            balance on your WSLATL account. Account credit is spendable on any WSLATL invoice and
            it does not expire, but it is{' '}
            <strong>not redeemable for cash</strong> and
            cannot be withdrawn to a bank account or card. Full terms are on our{' '}
            <Link href={siteConfig.paths.accountCredit}>Account Credit</Link>{' '}
            page.
          </p>
          <p>
            Account credit is the appropriate outcome in situations such as these:
          </p>
          <ul>
            <li>You asked for credit rather than money back, because you intend to keep hosting with us</li>
            <li>The original payment method is closed, expired, or can no longer accept a return</li>
            <li>The original charge was settled using account credit in the first place</li>
            <li>The charge is old enough that the payment processor will no longer reverse it</li>
          </ul>
          <p>
            Where you are entitled to a refund and you have asked for it back on your payment
            method, we will not force credit on you as a substitute simply because it is more
            convenient for us. If we propose credit and you would rather have the money returned,
            say so and we will discuss it.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.3 Refunds Are Not Prorated">
          <p>
            Refunds under this policy are issued for{' '}
            <strong>whole billing terms only</strong>. We do
            not calculate a partial refund based on the number of days you used the service before
            requesting the refund. A qualifying request within an eligible window is refunded in
            full for the term in question, and a request outside those windows is not refunded at
            all.
          </p>
          <p>
            This cuts both ways and it is deliberate. You are not penalized for the days you used
            inside the refund window, and equally you cannot recover a part-month by cancelling
            partway through a term. As stated in Section 9.1 of our{' '}
            <Link href={siteConfig.paths.terms}>Terms of Service</Link>,
            no refund is issued for the remaining days in a cancelled billing period unless this
            policy applies.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="8" title="Service Cancellation on Refund">
        <p>
          When a refund is approved, the associated service is terminated as part of the refund
          process. Access to the service and any associated panels is revoked once the refund is
          processed.
        </p>
        <p>
          Following termination, the data retention rules in our Terms of Service Section 9.3
          apply. Your data may be recovered on request for a limited window of up to{' '}
          <strong>14 days</strong> after termination; after
          that window any remaining data is permanently and irreversibly deleted, and in all cases
          no later than 90 days after account closure. If you would like to attempt to recover data
          from a refunded service, you must request it within that 14-day recovery window.
        </p>
        <p>
          WSLATL is not liable for any data loss resulting from a refund-initiated termination.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Renewals & Auto-Billing">
        <p>
          The 14-day windows in this policy are measured from the date of the initial purchase.
          For services on recurring billing cycles, each renewal payment opens a new 14-day
          window measured from the date of that renewal.
        </p>
        <p>
          If you do not want a service to renew, you must cancel it before the renewal date. We
          will not refund an automatically renewed charge simply because you forgot to cancel.
          However, if you contact us within 14 days of an unexpected renewal, we will evaluate
          the request under Section 3 (Qualifying Reasons) the same as any other purchase.
        </p>
        <p>
          We send invoice reminders before automatic renewals. If you are receiving renewals you
          did not intend, contact us immediately at{' '}
          <Email name="support" />{' '}
          and we will sort it out.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Abuse & Fraud Protection">
        <p>
          This Refund Policy exists to protect genuine clients. To prevent abuse, we reserve the
          right to decline refund requests when there is evidence of coordinated or repeated
          refund-seeking behavior, including but not limited to:
        </p>
        <ul>
          <li>Repeated sign-up, refund, and re-sign-up cycles on the same or related accounts</li>
          <li>Coordinated refund requests across multiple accounts under common ownership</li>
          <li>Use of false information during application or refund requests</li>
          <li>Refund requests tied to fraudulent payment methods or chargebacks</li>
        </ul>
        <p>
          If a refund is denied under this section, we will explain the reason in writing.
          Account termination may also result in cases of confirmed abuse.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Changes to This Policy">
        <p>
          We may update this Refund Policy from time to time to reflect changes in our practices,
          legal requirements, or services. When we make material changes, we will:
        </p>
        <ul>
          <li>Update the effective date shown at the top of this page</li>
          <li>Notify active clients via email with a summary of what changed</li>
          <li>Post the updated policy at {siteConfig.paths.refund}</li>
        </ul>
        <p>
          Refund requests submitted before the effective date of any change will be evaluated
          under the policy version in effect at the time of the request. Your continued use of
          our services after the effective date of any changes constitutes your acceptance of
          the updated Refund Policy.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contact">
        <p>
          Questions about this Refund Policy, the status of a refund request, or anything else
          related to billing should be directed to:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
