import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function TermsContent() {
  return (
    <>
      <LegalSection number="1" title="Acceptance of Terms">
        <p>
          By applying for, registering for, accessing, or using any service provided by WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you
          (&ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo;) confirm that:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>
            You meet our age requirements: you are either (a) 18 years of age or older, or (b) between
            the ages of 13 and 17 and have obtained the explicit consent of a parent or legal guardian
            who has reviewed and agrees to these Terms on your behalf. Individuals under the age of 13
            are strictly prohibited from using any WSLATL service and will be permanently banned upon
            discovery.
          </li>
          <li>You have the full legal authority to enter into a binding agreement</li>
          <li>You have read, understood, and agree to be bound by these Terms of Service, our Privacy Policy, and our Acceptable Use Policy</li>
          <li>If you are accepting on behalf of a company or other legal entity, you have the authority to bind that entity to these terms</li>
        </ul>
        <p className="mt-4">
          If you do not agree to these terms, do not use our services. These Terms, together with our
          Privacy Policy and Acceptable Use Policy, form the complete agreement between you and WSLATL LLC.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Description of Services">
        <p>
          WSLATL LLC provides private, application-based hosting services to approved clients. Our
          services include, but are not limited to:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li><span className="text-foreground font-medium">Dedicated Servers:</span> Physical server hardware provisioned exclusively for a single client, available managed or unmanaged</li>
          <li><span className="text-foreground font-medium">Game Server Hosting:</span> Game servers managed through the Pterodactyl panel, supporting titles including Minecraft, Rust, CS2, ARK, Valheim, FiveM, and others</li>
          <li><span className="text-foreground font-medium">VPS Hosting:</span> Isolated virtual private servers with full root access and your choice of operating system</li>
          <li><span className="text-foreground font-medium">Web Hosting:</span> Managed hosting for websites and web applications including SSL, backups, and support</li>
        </ul>
        <p className="mt-4">
          Services are subject to availability and may be modified, expanded, or discontinued at our
          discretion with reasonable notice to affected clients.
        </p>

        <LegalSubSection title="2.1 Backups & Responsibility for Your Data">
          <p>
            Where a service includes backups, those backups are provided on a{' '}
            <span className="text-foreground font-medium">best-effort basis</span> and are a
            convenience rather than a guarantee. We do not warrant that a backup exists for any
            particular service at any particular time, that a backup is complete or restorable, or
            that a restore will succeed.
          </p>
          <p>
            <span className="text-foreground font-medium">
              You are responsible for maintaining your own independent backups
            </span>{' '}
            of any data you cannot afford to lose, stored somewhere other than the WSLATL service
            that produced it. Any backup we provide is not a substitute for your own copies. This
            allocation of responsibility is a material part of the pricing of our services and
            should be read together with Section 10 (Disclaimer of Warranties) and Section 11
            (Limitation of Liability).
          </p>
          <p>
            What is included with each plan, how restores are requested, and what a restore
            involves are set out in our{' '}
            <a href={siteConfig.paths.backups} className="text-primary hover:underline">Backup Policy</a>{' '}
            at{' '}
            <a href={siteConfig.paths.backups} className="text-primary hover:underline">
              {siteConfig.siteUrl}{siteConfig.paths.backups}
            </a>, which is incorporated into these Terms by reference.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Application & Account Registration">
        <p>
          WSLATL operates as a private, application-only hosting company. Access to our services is
          not automatic and requires review and approval by our team. The following conditions apply:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>You must submit an application through our billing portal at billing.wslatl.com and be explicitly approved before any services are provisioned</li>
          <li>We reserve the right to decline any application at our sole discretion, without obligation to provide a reason</li>
          <li>You must provide accurate, current, and complete information during registration and keep it up to date</li>
          <li>You are solely responsible for maintaining the security of your account credentials, including your password and any API keys</li>
          <li>One account per individual or business entity is permitted unless we have expressly authorized additional accounts in writing</li>
          <li>You must notify us immediately at {siteConfig.email.support} if you suspect unauthorized access to your account</li>
          <li>Sharing your account credentials with any third party is prohibited unless explicitly permitted in writing</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Payment Terms">

        <LegalSubSection title="4.1 Billing Cycles">
          <p>
            Services are billed in advance on a cycle you select at signup. Available billing intervals
            (monthly, quarterly, semi-annual, or annual) depend on the service type. Invoices are
            generated automatically and sent to your registered email address before the due date.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Payment Methods & Processing">
          <p>
            Payment must be made through our billing portal at billing.wslatl.com. Accepted payment
            methods are listed in the portal. Payments are processed by third-party payment processors.
            By providing payment information, you authorize us to charge your selected payment method
            for all fees due.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Late Payments & Service Suspension">
          <p>
            Services are considered past due if payment is not received by the invoice due date.
            The following applies to overdue accounts:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Services may be suspended if payment is not received within <span className="text-foreground font-medium">7 days</span> of the due date</li>
            <li>Suspended services may be terminated and data permanently deleted if payment is not received within <span className="text-foreground font-medium">14 days</span> of suspension</li>
            <li>WSLATL is not liable for data loss, business interruption, or any other damages resulting from service suspension or termination due to non-payment</li>
            <li>A reactivation fee may apply to services that were suspended for non-payment</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Refund Policy">
          <p>
            Our refund policy is maintained as a separate document at{' '}
            <a href={siteConfig.paths.refund} className="text-primary hover:underline">{siteConfig.siteUrl}{siteConfig.paths.refund}</a>{' '}
            and is incorporated into these Terms by reference. The Refund Policy is the
            authoritative source for all questions about refund eligibility, windows, eligible
            reasons, processing, and non-refundable items. The rules in the Refund Policy control
            over any conflicting language elsewhere in these Terms.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Price Changes">
          <p>
            WSLATL reserves the right to change service pricing. We will provide at least{' '}
            <span className="text-foreground font-medium">30 days&rsquo; written notice</span> of any
            price increase via email to your registered address. Existing services will be honored at
            the current price until the first renewal date following that notice period.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.6 Taxes">
          <p>
            Service fees do not include applicable taxes. You are responsible for paying all taxes,
            duties, or government-imposed charges applicable to your use of our services, unless
            specifically included in your invoice.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Service Level Agreement (SLA)">
        <p>
          Our Service Level Agreement is also published as a standalone document at{' '}
          <a href={siteConfig.paths.sla} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </a>, which is easier to find and to cite. That page restates this section; it does not
          add to or change it. The commitments below are reproduced there in full, and if the two
          ever differ, this section controls.
        </p>

        <LegalSubSection title="5.1 Uptime Targets">
          <div className="overflow-x-auto mt-2">
            <table className="legal-table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">Monthly Uptime Target</th>
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
            downtime caused by events outside our reasonable control (see Section 15, Force Majeure).
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Scheduled Maintenance">
          <p>
            We will provide at least <span className="text-foreground font-medium">24 hours&rsquo; advance notice</span> for
            scheduled maintenance windows via our status page (status.wslatl.com) and/or email to
            affected clients. Emergency maintenance required to protect service integrity or security
            may be performed without prior notice, though we will communicate as quickly as possible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.3 SLA Credits">
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
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Acceptable Use">
        <p>
          All use of WSLATL services is governed by our Acceptable Use Policy (AUP), which is
          incorporated into these Terms by reference and available at{' '}
          <a href={siteConfig.paths.acceptableUse} className="text-primary hover:underline">{siteConfig.siteUrl}{siteConfig.paths.acceptableUse}</a>.
          You agree to comply with the AUP at all times.
        </p>
        <p>
          Violations of the AUP may result in immediate suspension or termination of your services
          without notice and without any right to a refund. Severe violations may be referred to
          law enforcement.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Intellectual Property">
        <p>
          All software, tooling, documentation, and materials developed and provided by WSLATL
          (excluding third-party software such as Pterodactyl, which is subject to its own license)
          are and remain the intellectual property of WSLATL LLC. You may not reproduce, distribute,
          reverse-engineer, or create derivative works of our proprietary materials without our
          prior written consent.
        </p>
        <p>
          You retain full ownership of all data, content, and software you upload to or run on WSLATL
          infrastructure. You grant WSLATL a limited, non-exclusive, non-transferable license to store,
          process, and transmit your content solely as necessary to provide the services you have
          contracted for.
        </p>
      </LegalSection>

      <LegalSection number="8" title="DMCA & Copyright">
        <p>
          WSLATL LLC complies with the Digital Millennium Copyright Act (DMCA), 17 U.S.C. &sect;&nbsp;512.
          Our full DMCA Policy is published at{' '}
          <a href={siteConfig.paths.dmca} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </a>{' '}
          and is incorporated into these Terms by reference. It sets out our designated agent, the
          counter-notice process, the statutory restoration timeline, and our repeat infringer
          policy. Read it before serving notice on us or disputing a removal.
        </p>
        <p>
          In summary: if you believe that content hosted on WSLATL infrastructure infringes your
          copyright, send a written DMCA takedown notice to:
        </p>
        <div className="mt-3 p-4 rounded-xl border border-border/70 bg-card/30 text-sm space-y-1 relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/3 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p><span className="text-foreground font-medium">Email:</span> {siteConfig.email.support}</p>
          <p><span className="text-foreground font-medium">Subject Line:</span> DMCA Takedown Notice</p>
        </div>
        <p className="mt-4">Your notice must include, under penalty of perjury:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Your contact information (name, address, phone number, email)</li>
          <li>A description of the copyrighted work you claim has been infringed</li>
          <li>Identification of the allegedly infringing material and its location on our infrastructure</li>
          <li>A statement that you have a good faith belief the disputed use is not authorized by the copyright owner, its agent, or the law</li>
          <li>A statement that the information in the notice is accurate and, under penalty of perjury, that you are the copyright owner or authorized to act on behalf of the owner</li>
          <li>Your physical or electronic signature</li>
        </ul>
        <p className="mt-4">
          Counter-notices may be submitted to the same email address, and must meet the
          requirements set out in Section 4 of our{' '}
          <a href={siteConfig.paths.dmca} className="text-primary hover:underline">DMCA Policy</a>.
          We reserve the right to terminate the accounts of clients who are repeat copyright
          infringers, in accordance with the repeat infringer policy in Section 5 of that
          document.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Termination">

        <LegalSubSection title="9.1 Cancellation by You">
          <p>
            You may cancel your service at any time by submitting a cancellation request through
            our billing portal or by contacting us via Discord or email. Cancellations take effect
            at the end of the current billing cycle unless an immediate cancellation is explicitly
            requested. No refunds are issued for the remaining days in a cancelled billing period
            unless our refund policy applies (see Section 4.4).
          </p>
        </LegalSubSection>

        <LegalSubSection title="9.2 Termination by WSLATL">
          <p>
            We may suspend or terminate your services immediately and without prior notice if:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>You violate these Terms, the Acceptable Use Policy, or our Privacy Policy</li>
            <li>You have outstanding unpaid invoices past the grace period (see Section 4.3)</li>
            <li>Your activities pose an active risk to our network infrastructure, other clients, or third parties on the internet</li>
            <li>We receive a valid legal order requiring termination or suspension</li>
            <li>Continued provision of services would expose WSLATL LLC to legal liability</li>
            <li>You provide false or fraudulent information at any point during your account lifecycle</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="9.3 Effect of Termination">
          {/*
            OWNER DECISION NEEDED: retention period must be reconciled across ToS 9.3, Privacy 5,
            and config/accounts.php purge_grace_days.

            There are currently THREE different numbers describing how long data survives after
            termination, and they contradict each other:

              - Terms of Service 9.3 (this section): "up to 14 days"
              - Privacy Policy Section 5, "Post-termination data": "within 90 days"
              - Application config, config/accounts.php purge_grace_days: 7

            The Refund Policy Section 8 also restates the 14-day figure from this section.

            This is the single most important item on this page to resolve. Publishing a
            retention period the system does not implement is a misstatement to clients and a
            regulatory problem under GDPR/CCPA storage-limitation and disclosure requirements;
            deleting earlier than the published period means data a client was told they could
            still recover is already gone.

            Whatever is decided, ALL FOUR must be changed together:
              1. this section
              2. Privacy Policy Section 5
              3. Refund Policy Section 8
              4. config/accounts.php purge_grace_days in the billing panel

            Note also that "post-termination data" in the Privacy Policy may be intended to mean
            something broader than the server data this section is about. If so, they should be
            separated explicitly rather than both being left to look like the same commitment.

            Do not change the number below in isolation.
          */}
          <p>
            Upon termination of your account:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Access to all services and panels will be revoked immediately</li>
            <li>Your data may be retained for up to 14 days after termination to allow for recovery requests, after which it will be permanently and irreversibly deleted</li>
            <li>Any data recovery requests must be made within the 14-day window and are subject to our discretion</li>
            <li>WSLATL is not liable for any data loss resulting from account termination</li>
            <li>All outstanding invoices remain due and payable following termination</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="10" title="Disclaimer of Warranties">
        <p>
          SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTY
          OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW,
          WSLATL LLC EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2 uppercase text-sm">
          <li>Implied warranties of merchantability and fitness for a particular purpose</li>
          <li>Warranties of non-infringement</li>
          <li>Warranties that services will be uninterrupted, error-free, or free of harmful components</li>
          <li>Warranties that defects will be corrected within any specific timeframe</li>
          <li>Warranties regarding the accuracy or completeness of any content</li>
        </ul>
        <p className="mt-4">
          Some jurisdictions do not allow the exclusion of certain warranties. In those jurisdictions,
          our disclaimers apply to the maximum extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Limitation of Liability">
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WSLATL LLC AND ITS MEMBERS, MANAGERS,
          OFFICERS, EMPLOYEES, CONTRACTORS, AND AGENTS SHALL NOT BE LIABLE FOR ANY:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2 uppercase text-sm">
          <li>Indirect, incidental, special, consequential, or punitive damages</li>
          <li>Loss of profits, revenue, data, goodwill, or business opportunities</li>
          <li>Damages arising from unauthorized access to or alteration of your data</li>
          <li>Damages arising from your reliance on information obtained through our services</li>
          <li>Damages caused by events outside our reasonable control</li>
        </ul>
        <p className="mt-4">
          OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THESE
          TERMS OR YOUR USE OF OUR SERVICES SHALL NOT EXCEED THE TOTAL AMOUNT YOU PAID TO WSLATL LLC
          IN THE <span className="font-bold">THREE (3) MONTHS</span> IMMEDIATELY PRECEDING THE EVENT
          GIVING RISE TO THE CLAIM.
        </p>
        <p className="mt-3">
          Some jurisdictions do not permit certain liability limitations. In those jurisdictions,
          our liability is limited to the fullest extent permitted by law.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless WSLATL LLC, its members, managers,
          officers, employees, contractors, and agents from and against any and all claims,
          liabilities, damages, losses, costs, and expenses (including reasonable attorneys&rsquo;
          fees) arising out of or in connection with:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Your use of our services in violation of these Terms, the AUP, or applicable law</li>
          <li>Content you host, transmit, or store on WSLATL infrastructure</li>
          <li>Your violation of any third-party rights, including intellectual property rights</li>
          <li>Any false or fraudulent information you provide to WSLATL</li>
          <li>Any dispute between you and a third party arising from your use of our services</li>
        </ul>
        <p className="mt-4">
          WSLATL reserves the right to assume the exclusive defense and control of any matter subject
          to indemnification by you, at your expense, and you agree to cooperate with our defense.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Governing Law & Dispute Resolution">
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of the
          State of Missouri, United States, without regard to conflict-of-law principles.
        </p>
        <p>
          Any legal dispute, claim, or controversy arising from or related to these Terms or your
          use of WSLATL services shall be resolved exclusively in the state or federal courts located
          in the State of Missouri. You consent to the personal jurisdiction of such courts and waive
          any objection to venue in Missouri.
        </p>
        <p>
          Before initiating formal legal proceedings, both parties agree to attempt to resolve
          disputes informally. To initiate informal resolution, contact us at {siteConfig.email.support}
          with a written description of the dispute. If the dispute is not resolved within{' '}
          <span className="text-foreground font-medium">30 days</span> of that notice, either party
          may pursue formal legal remedies.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Modification of Terms">
        <p>
          WSLATL reserves the right to modify these Terms at any time. For material changes, we will:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Provide at least <span className="text-foreground font-medium">14 days&rsquo; advance notice</span> via email to your registered address</li>
          <li>Post the updated Terms at {siteConfig.paths.terms} with a revised effective date</li>
          <li>Summarize the changes in the notification email</li>
        </ul>
        <p className="mt-4">
          Your continued use of our services after the effective date of any revised Terms constitutes
          your acceptance of those changes. If you object to material changes, you may cancel your
          service before the effective date and receive a pro-rated refund for any prepaid period,
          at our discretion.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Miscellaneous">

        <LegalSubSection title="Force Majeure">
          <p>
            WSLATL is not liable for delays or failures in performance resulting from causes beyond
            our reasonable control, including natural disasters, acts of god, government actions,
            internet infrastructure failures, datacenter outages caused by third parties, labor
            disputes, or other extraordinary events. We will make reasonable efforts to notify
            affected clients and restore service as quickly as possible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Entire Agreement">
          <p>
            These Terms of Service, together with our Privacy Policy and Acceptable Use Policy,
            constitute the entire agreement between you and WSLATL LLC with respect to your use
            of our services and supersede all prior agreements, representations, or understandings.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Severability">
          <p>
            If any provision of these Terms is found to be invalid, illegal, or unenforceable by a
            court of competent jurisdiction, that provision will be modified to the minimum extent
            necessary to make it enforceable, and the remaining provisions will continue in full
            force and effect.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Waiver">
          <p>
            Our failure to enforce any right or provision of these Terms on any occasion does not
            constitute a waiver of that right or provision. Any waiver must be in writing and signed
            by an authorized representative of WSLATL LLC.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Assignment">
          <p>
            You may not assign or transfer these Terms, or any rights or obligations under them,
            without our prior written consent. WSLATL may assign or transfer these Terms, in whole
            or in part, in connection with a merger, acquisition, or sale of substantially all assets,
            with notice to you.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="16" title="Contact">
        <p>
          Questions about these Terms of Service should be directed to:
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
