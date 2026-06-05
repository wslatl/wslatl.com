import type { Metadata } from 'next'
import { LegalLayout, LegalSection, LegalSubSection } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Privacy Policy | WSLATL LLC',
  description: 'How WSLATL LLC collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      description="We collect only what we need to run your services. We do not sell your data, ever. Here is exactly what we do with the information you share with us."
      effectiveDate="June 3, 2026"
      currentPath="/privacy"
    >

      <LegalSection number="1" title="Who We Are">
        <p>
          WSLATL LLC is a Missouri limited liability company providing private hosting services including
          dedicated servers, game server hosting, VPS hosting, and web hosting. References to
          &ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo; in this policy
          refer to WSLATL LLC.
        </p>
        <p>
          This Privacy Policy applies to information collected through our website (wslatl.com), billing
          portal (billing.wslatl.com), hosting panels (panel.wslatl.com, vps.wslatl.com), and all services
          and communications provided by WSLATL. By using any of our services, you agree to the practices
          described in this policy.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Information We Collect">
        <p>We collect the following categories of information:</p>

        <LegalSubSection title="2.1 Account & Registration Information">
          <p>When you apply for or create an account, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Full name</li>
            <li>Email address</li>
            <li>Billing address</li>
            <li>Phone number (optional, may be required for account recovery)</li>
            <li>Account username and password (stored as a secure hash, we never see your plaintext password)</li>
            <li>Any information you voluntarily provide during the application or onboarding process</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.2 Billing & Payment Information">
          <p>
            Payments are processed through our billing portal using third-party payment processors that
            are PCI-DSS compliant. We do not store your full card number or CVV. We retain:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Invoice history and billing records</li>
            <li>Payment method type (card brand, last four digits)</li>
            <li>Transaction IDs and dates</li>
            <li>Records required for accounting and legal compliance</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Service & Usage Data">
          <p>When you use our hosting services, we collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>IP addresses assigned to or used by your services</li>
            <li>Server resource utilization (CPU, RAM, bandwidth, disk usage)</li>
            <li>Access and activity logs for control panels and dashboards</li>
            <li>Network traffic metadata (not content) used for abuse detection and performance monitoring</li>
            <li>Game server activity logs including connection timestamps and session data</li>
            <li>Uptime and availability records</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.4 Communications Data">
          <p>When you contact us, we retain records of:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Support tickets and their full contents</li>
            <li>Discord communications (messages in our server or direct messages with our team)</li>
            <li>Email correspondence</li>
            <li>Files, screenshots, or logs you share when seeking support</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Website Data">
          <p>When you visit wslatl.com, we may collect:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>IP address and general geographic region</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and time spent on the site</li>
            <li>Referring URL</li>
            <li>Session cookies (see Section 7)</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="How We Use Your Information">
        <p>We use the information we collect exclusively to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Provision, operate, and maintain your hosting services</li>
          <li>Process payments, generate invoices, and manage your billing account</li>
          <li>Verify your identity and prevent fraudulent account creation</li>
          <li>Respond to support requests, questions, and inquiries</li>
          <li>Monitor network performance, uptime, and infrastructure health</li>
          <li>Detect, investigate, and prevent abuse, unauthorized access, and violations of our Acceptable Use Policy</li>
          <li>Comply with applicable laws, regulations, and legal obligations</li>
          <li>Enforce our Terms of Service</li>
          <li>Send service-related communications such as maintenance notices, billing alerts, and account updates</li>
          <li>Improve our services and infrastructure based on usage patterns</li>
        </ul>
        <p className="mt-4 font-medium text-foreground">
          We do not use your data for advertising. We do not sell, rent, or trade your personal information
          to any third party for any commercial purpose.
        </p>
      </LegalSection>

      <LegalSection number="4" title="How We Share Your Information">
        <p>
          We share your information only in the following limited circumstances, and only to the extent
          necessary for each purpose:
        </p>

        <LegalSubSection title="4.1 Service Providers">
          <p>
            We work with third-party vendors that help us deliver our services. These providers receive
            only the data necessary to perform their function and are contractually required to protect
            that data. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Payment processors (to handle billing transactions)</li>
            <li>Data center and infrastructure partners (for physical server hosting)</li>
            <li>Status monitoring services (e.g., status.wslatl.com)</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Legal Requirements">
          <p>
            We may disclose your information when required by law, valid court order, subpoena, or
            lawful request from government authorities. Where legally permitted, we will attempt to
            notify you before complying with such requests.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Abuse Prevention & Law Enforcement">
          <p>
            We may share IP addresses, network logs, or other technical data with:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>Other hosting providers investigating abuse originating from our network</li>
            <li>Abuse registries (e.g., AbuseIPDB) when addressing confirmed network abuse</li>
            <li>Law enforcement agencies when investigating illegal activity</li>
            <li>NCMEC or other authorities in cases involving child safety</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Business Transfers">
          <p>
            If WSLATL LLC is acquired, merged with another entity, or undergoes a significant business
            transition, your information may be transferred as part of that transaction. We will notify
            active clients via email of any such change before it occurs.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Data Retention">
        <p>We retain your data for the following periods:</p>
        <div className="overflow-x-auto mt-3">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Data Type</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account records</td>
                <td>Duration of account + 3 years</td>
              </tr>
              <tr>
                <td>Billing records</td>
                <td>7 years (tax and legal requirements)</td>
              </tr>
              <tr>
                <td>Server and network logs</td>
                <td>Up to 90 days (longer if needed for an active investigation)</td>
              </tr>
              <tr>
                <td>Support communications</td>
                <td>2 years from last interaction</td>
              </tr>
              <tr>
                <td>Post-termination data</td>
                <td>Deleted or anonymized within 90 days of account closure</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">
          Data may be retained beyond these periods if required by applicable law, an ongoing legal
          proceeding, or a legitimate business dispute.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Data Security">
        <p>
          Protecting your data is a core responsibility we take seriously. Our security measures include:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Encryption of sensitive data at rest and in transit (HTTPS/TLS for all panels and portals)</li>
          <li>Hashed and salted password storage: plaintext passwords are never stored or visible to us</li>
          <li>Strict internal access controls limiting who on our team can view customer data</li>
          <li>Regular review and hardening of our hosting infrastructure</li>
          <li>Monitoring for unusual access patterns and potential intrusions</li>
        </ul>
        <p className="mt-4">
          No transmission over the internet is 100% secure. While we use industry-standard protections,
          we cannot guarantee absolute security. If you believe your account has been compromised,
          contact us immediately at{' '}
          <a href="mailto:support@wslatl.com" className="text-primary hover:underline">support@wslatl.com</a>.
        </p>
        <p className="mt-3">
          In the event of a data breach that affects your information, we will notify you in accordance
          with applicable law, including Missouri&apos;s data breach notification statute
          (Mo. Rev. Stat. &sect;&nbsp;407.1500), as promptly as circumstances allow.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          We use cookies minimally and only where necessary. Our use of cookies includes:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Session cookies:</span> Required to keep you
            logged in to our billing portal and hosting panels. These expire when you close your browser
            or log out.
          </li>
          <li>
            <span className="text-foreground font-medium">Preference cookies:</span> May store display
            preferences or settings you have chosen within our panels.
          </li>
        </ul>
        <p className="mt-4">
          We do not use third-party advertising cookies, tracking pixels, or behavioral analytics tools
          on wslatl.com. You can manage or disable cookies in your browser settings, but doing so may
          affect the functionality of authenticated areas like our billing portal and hosting panels.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Your Rights & Choices">
        <p>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li><span className="text-foreground font-medium">Access:</span> Request a copy of the personal data we hold about you.</li>
          <li><span className="text-foreground font-medium">Correction:</span> Request that we correct inaccurate or incomplete data.</li>
          <li><span className="text-foreground font-medium">Deletion:</span> Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><span className="text-foreground font-medium">Portability:</span> Request your data in a structured, machine-readable format.</li>
          <li><span className="text-foreground font-medium">Restriction:</span> Request that we limit how we process your data.</li>
          <li><span className="text-foreground font-medium">Objection:</span> Object to certain types of data processing.</li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, contact us at{' '}
          <a href="mailto:support@wslatl.com" className="text-primary hover:underline">support@wslatl.com</a>.
          We will respond within 30 days. We may need to verify your identity before processing your request.
        </p>
        <p className="mt-3">
          <span className="text-foreground font-medium">California residents</span> may have additional
          rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA),
          including the right to know what personal information is sold or shared and the right to opt out.
          We do not sell personal information, so opt-out rights under CCPA do not apply.
        </p>
        <p className="mt-3">
          <span className="text-foreground font-medium">EEA/UK residents</span> have rights under the
          GDPR and UK GDPR, including the rights listed above. Our legal basis for processing your data
          is primarily the performance of a contract (providing services you requested) and compliance
          with legal obligations.
        </p>
      </LegalSection>

        <LegalSection number="9" title="Age Requirements & Children's Privacy">
        <p>We have a strict three-tier age policy that applies to our website, billing portal, and all hosting services:</p>

        <div className="mt-4 space-y-4">
          <div className="legal-callout border-red-500/30 text-red-300">
            <strong>Under 13: Not Permitted</strong>
            Individuals under the age of 13 are strictly prohibited from using any WSLATL service,
            including our website, billing portal, and hosting panels. We do not knowingly collect
            personal information from anyone under 13. If we discover or are notified that a user
            is under 13, their account will be immediately and permanently banned and all associated
            data will be deleted. We take this seriously and have zero tolerance for underage access.
          </div>

          <div className="legal-callout border-yellow-500/30 text-yellow-300">
            <strong>Ages 13 to 17: Permitted With Adult Consent</strong>
            We welcome users aged 13 through 17, but a parent or legal guardian must provide
            explicit consent before the account is used. By registering or using our services,
            users in this age group confirm that a parent or guardian has reviewed and agreed to
            our Terms of Service, Privacy Policy, and Acceptable Use Policy on their behalf.
            The consenting adult assumes full responsibility for the minor&apos;s account activity
            and any associated charges. If we discover an account in this age range was created
            without adult consent, we will suspend the account until valid consent is provided.
          </div>

          <div className="legal-callout border-green-500/30 text-green-300">
            <strong>18 and Over: Fully Permitted</strong>
            Adults 18 years of age or older may register and use our services without any
            additional consent requirements, subject to account approval under our application-only
            model and compliance with our Terms and Acceptable Use Policy.
          </div>
        </div>

        <p className="mt-4">
          If you are a parent or guardian and believe your child under 13 has registered with us or
          provided us with personal information without your knowledge, contact us immediately at{' '}
          <a href="mailto:support@wslatl.com" className="text-primary hover:underline">support@wslatl.com</a>.
          We will permanently remove the account and all associated data as quickly as possible.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Third-Party Links & Services">
        <p>
          Our website and panels may contain links to or integrations with third-party services, including
          Discord, GitHub, and others. This Privacy Policy does not apply to those third-party services.
          We encourage you to review the privacy policies of any third-party service you use in connection
          with our platform. We are not responsible for the privacy practices of third parties.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices,
          legal requirements, or services. When we make material changes, we will:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Update the &ldquo;Effective Date&rdquo; at the top of this page</li>
          <li>Notify active clients via email with a summary of what changed</li>
          <li>Post the updated policy at wslatl.com/privacy</li>
        </ul>
        <p className="mt-4">
          Your continued use of our services after the effective date of any changes constitutes your
          acceptance of the updated Privacy Policy. If you disagree with material changes, you may
          cancel your service before the effective date.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contact Us">
        <p>
          Questions, concerns, or requests related to this Privacy Policy should be directed to:
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-1.5 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">WSLATL LLC</p>
          <p>Missouri, United States</p>
          <p>
            Email:{' '}
            <a href="mailto:support@wslatl.com" className="text-primary hover:underline">support@wslatl.com</a>
            {' '}or{' '}
            <a href="mailto:info@wslatl.com" className="text-primary hover:underline">info@wslatl.com</a>
          </p>
          <p>
            Discord:{' '}
            <a
              href="https://discord.gg/3eKawhSbAF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              discord.gg/3eKawhSbAF
            </a>
          </p>
        </div>
      </LegalSection>

    </LegalLayout>
  )
}
