import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { CompanyContact, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function PrivacyContent() {
  return (
    <>
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

        <LegalSubSection title="1.1 Controller and Processor">
          <p>
            Hosting involves two different kinds of data, and our legal role is different for
            each. The distinction matters, so it is worth stating plainly.
          </p>
          <ul>
            <li>
              <strong>Your account data.</strong> The
              information you give us so we can open and run your account: your name, contact
              details, billing records, support tickets, and the panel activity described in
              Section 2. For this data, WSLATL is the{' '}
              <strong>controller</strong>. We decide what is
              collected and why, and this Privacy Policy describes that decision.
            </li>
            <li>
              <strong>Data you put on your own services.</strong>{' '}
              Whatever you or your users store on a server we host for you: databases, game server
              data, uploaded files, website content, application logs. For this data, WSLATL is a{' '}
              <strong>processor</strong>, not the controller.
              We store and transmit it so the service works, and we do not decide what you collect
              or why you collect it.
            </li>
          </ul>
          <p>
            If you host other people&rsquo;s personal data on a WSLATL service, you are the
            controller of it. The obligations that come with that role are yours: having a lawful
            basis for the processing, giving notice to your own users, honoring their rights
            requests, and keeping your own record of processing activities. This Privacy Policy
            does not do any of that for you, and it is not a privacy policy your users can rely
            on.
          </p>
          <p>
            We act on your instructions in respect of that data, and we access it only where
            necessary to provide, maintain, or secure the service, or where we are legally
            required to. If you need a data processing agreement covering our role as processor,
            contact us at{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="2" title="Information We Collect">
        <p>We collect the following categories of information:</p>

        <LegalSubSection title="2.1 Account & Registration Information">
          <p>When you apply for or create an account, we collect:</p>
          <ul>
            <li>Full name</li>
            <li>Email address</li>
            <li>Country</li>
            <li>Date of birth</li>
            <li>Phone number</li>
            <li>Billing address: street, city, postal code, and state or region where your country has them</li>
            <li>
              Tax identification number, where you provide one so that we can invoice you as a
              business or apply a tax exemption
            </li>
            <li>Account username and password (stored as a secure hash, we never see your plaintext password)</li>
            <li>
              Discord account identity, where you choose to link your Discord account to your
              WSLATL account. Linking gives us your Discord user ID, username, and avatar so that
              we can associate you with support conversations and role access in our server.
              Linking is optional and can be disconnected.
            </li>
            <li>Any information you voluntarily provide during the application or onboarding process</li>
          </ul>
          <p>Here is why we ask for these details:</p>
          <ul>
            <li>
              <strong>Phone number:</strong> to keep your account secure, and to check your
              identity if your account is locked. We may send a code by text message to the number
              on file to confirm it is you.
            </li>
            <li>
              <strong>Billing address and country:</strong> for billing and invoices, to prevent
              fraud, and to meet sanctions and tax rules.
            </li>
            <li>
              <strong>Date of birth:</strong> to check the minimum age in Section 9.
            </li>
          </ul>
          <p>
            You can ask us to set up your account without a phone number, a billing address, or
            both. See Section 2.6.
          </p>
          <p>
            We also maintain an{' '}
            <strong>account credit ledger</strong> for your
            account, recording every change to your credit balance including top-up purchases,
            credits we issue, amounts applied to invoices, gifts sent or received, and the date,
            amount, and reason for each entry. This ledger is retained as part of your billing
            records. See our{' '}
            <Link href={siteConfig.paths.accountCredit}>Account Credit Terms</Link>{' '}
            for how the balance itself works.
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Billing & Payment Information">
          <p>
            Payments are processed through our billing portal using third-party payment processors that
            are PCI-DSS compliant. Payment cards are handled by the payment provider, Stripe or
            PayPal, which may ask for your card&rsquo;s postal code to check the card. We do not
            store your full card number or CVV. We retain:
          </p>
          <ul>
            <li>Invoice history and billing records</li>
            <li>Payment method type (card brand, last four digits)</li>
            <li>Transaction IDs and dates</li>
            <li>Records required for accounting and legal compliance</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Service & Usage Data">
          <p>When you use our hosting services, we collect:</p>
          <ul>
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
          <ul>
            <li>Support tickets and their full contents</li>
            <li>Discord communications (messages in our server or direct messages with our team)</li>
            <li>Email correspondence</li>
            <li>Files, screenshots, or logs you share when seeking support</li>
            <li>
              Your conversations with Ask Ava, the help chat in the client area, including the
              copy added to a ticket when you ask to talk to a person
            </li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Website Data">
          <p>When you visit wslatl.com, we may collect:</p>
          <ul>
            <li>IP address and general geographic region</li>
            <li>Browser type and operating system</li>
            <li>Pages visited and time spent on the site</li>
            <li>Referring URL</li>
            <li>Session cookies (see Section 7)</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.6 Accounts Without a Phone Number or Billing Address">
          <p>
            If you would rather not share a phone number, a billing address, or both, ask us before
            or during sign-up. Open a support ticket or email{' '}
            <Email name="support" />. Our staff can then set up your account so that it does not
            need them. This suits, for example, partners who prefer not to share these details. A
            PO box is also accepted as an address.
          </p>
          <p>On an account set up this way:</p>
          <ul>
            <li>Country and date of birth are still required. Every account needs them.</li>
            <li>
              If sales tax or VAT applies in your country, we may ask for the state and postal code we
              need to work out the tax. We never ask for your street or city for that.
            </li>
            <li>
              Without a phone number on file, text-message recovery is not available. Account
              recovery then uses your email address, two-factor sign-in, and a support ticket.
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="How We Use Your Information">
        <p>We use the information we collect exclusively to:</p>
        <ul>
          <li>Provision, operate, and maintain your hosting services</li>
          <li>Process payments, generate invoices, and manage your billing account</li>
          <li>Verify your identity and prevent fraudulent account creation</li>
          <li>Respond to support requests, questions, and inquiries</li>
          <li>Monitor network performance, uptime, and infrastructure health</li>
          <li>Detect, investigate, and prevent abuse, unauthorized access, and violations of our Acceptable Use Policy</li>
          <li>Comply with applicable laws, regulations, and legal obligations</li>
          <li>Enforce our Terms of Service</li>
          <li>Send service-related communications such as maintenance notices, billing alerts, and account updates</li>
          <li>
            Only if you say yes, send you occasional news and offers by email. You can change your
            mind at any time in your profile under Data and privacy, or with the unsubscribe link
            in those emails. Service emails such as invoices and security notices are not
            affected.
          </li>
          <li>Improve our services and infrastructure based on usage patterns</li>
        </ul>
        <p className="font-medium text-foreground">
          We do not use your data for third-party advertising. We do not sell, rent, or trade your personal information
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
            only the data necessary to perform their function and, except for the AI provider
            described below, are contractually required to protect that data. This includes:
          </p>
          <ul>
            <li>Payment processors (to handle billing transactions)</li>
            <li>Data center and infrastructure partners (for physical server hosting)</li>
            <li>Bot and abuse protection, content delivery, and DNS providers</li>
            <li>Email delivery for transactional messages such as invoices and account notices</li>
            <li>Address autocomplete and geocoding for address entry forms</li>
            <li>Status monitoring services (e.g., status.wslatl.com)</li>
            <li>An AI provider for our help chat and the support tools our staff use</li>
            <li>Text message delivery for one-time identity verification codes</li>
          </ul>
          <p>
            We publish the individual providers, not just these categories. Each subprocessor is
            named on our{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessors</Link>{' '}
            page, together with what it is used for, what data categories it receives, and where
            it is located. That page is kept current as our infrastructure changes.
          </p>
          <p>
            We use an AI provider, currently MiniMax, for Ask Ava, the help chat in the client
            area, and for tools our staff use to look up records, draft ticket replies, and
            prepare changes that a member of staff approves. It
            receives what each answer needs, such as your questions, your ticket messages, and the
            account and billing details looked up for you. It processes them to produce the answer
            under its own terms; we have not yet confirmed what those terms require of it or where
            it processes requests (see Section 4.5). Ask Ava&rsquo;s answers are written by the
            AI, not by a person, and you can turn Ask Ava off in your profile under Data and
            privacy. Ask Ava never changes anything on its own: when it offers to do something,
            such as restarting a server or paying an invoice, nothing happens until you press the
            button on its card. The AI never answers a ticket by itself: a member of our team approves every
            reply it writes before it is sent. Our look-ups never send the AI provider your
            password or payment card details, but anything you type into Ask Ava or a ticket can
            reach it, so please never type them there. When we need to confirm who owns an
            account, for example to recover it or lift a freeze, we can text a one-time code to
            the phone number on your account through Telnyx. The{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessors</Link>{' '}
            page lists what each of them receives.
          </p>
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
          <ul>
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

        <LegalSubSection title="4.5 International Transfers">
          <p>
            WSLATL LLC is established in the State of Missouri, United States, and our services
            are operated from the United States. If you are located in the European Economic Area,
            the United Kingdom, or Switzerland, using our services means your personal data is
            transferred to the United States, and where a subprocessor operates a global network,
            potentially to other countries.
          </p>
          <p>
            The United States is not covered by a general adequacy decision applying to all
            recipients. Where we transfer personal data out of the EEA or the UK, we rely on the
            transfer being necessary to perform the contract you have asked us to perform, and on
            the European Commission&rsquo;s Standard Contractual Clauses together with the UK
            International Data Transfer Addendum where a subprocessor offers them.
          </p>
          <p>
            This does not cover our AI provider yet. We have not confirmed where it processes
            requests or which transfer mechanism applies to it, so data it receives may be
            processed in a country other than the United States. See Section 3.5 of our{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessors</Link>{' '}
            page.
          </p>
          <p>
            The mechanisms that apply to each recipient, and further detail on our transfer
            position, are set out on our{' '}
            <Link href={siteConfig.paths.subprocessors}>Subprocessors</Link>{' '}
            page. If you need a data processing agreement or a copy of the clauses as we apply
            them, contact us at{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Data Retention">
        <p>We retain your data for the following periods:</p>
        <ScrollTable label="Data retention periods">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Data Type</th>
                <th scope="col">Retention Period</th>
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
                <td>Recoverable on request for up to 14 days after termination; deleted or anonymized no later than 90 days after account closure (service data is removed sooner, per Terms of Service Section 9.3)</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          Data may be retained beyond these periods if required by applicable law, an ongoing legal
          proceeding, or a legitimate business dispute.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Data Security">
        <p>
          Protecting your data is a core responsibility we take seriously. Our security measures include:
        </p>
        <ul>
          <li>Encryption of sensitive data at rest and in transit (HTTPS/TLS for all panels and portals)</li>
          <li>Hashed and salted password storage: plaintext passwords are never stored or visible to us</li>
          <li>Strict internal access controls limiting who on our team can view customer data</li>
          <li>Regular review and hardening of our hosting infrastructure</li>
          <li>Monitoring for unusual access patterns and potential intrusions</li>
        </ul>
        <p>
          No transmission over the internet is 100% secure. While we use industry-standard protections,
          we cannot guarantee absolute security. If you believe your account has been compromised,
          contact us immediately at{' '}
          <Email name="support" />.
        </p>
        <p>
          In the event of a data breach that affects your information, we will notify you in accordance
          with applicable law, including Missouri&apos;s data breach notification statute
          (Mo. Rev. Stat. &sect;&nbsp;407.1500), as promptly as circumstances allow.
        </p>

        <LegalSubSection title="6.1 Staff Access to Your Account">
          <p>
            To help with a problem, a member of our team with the right permission can open a
            support session, which signs them in to your client area as you. To open one, they
            need the verification code shown on your support tickets in the billing portal, which
            you give them. It changes every 12 hours. A small number of senior administrators can
            open a session without it. Every session is recorded on our side with the name of the
            staff member who opened it, and the Activity tab in your profile shows that our
            support team accessed your account.
          </p>
          <p>
            A support session cannot change your sign-in email, password, phone number, or
            two-factor settings.
          </p>
          <p>
            Staff can open the VPS panel for your server during a support session only if you
            have turned on &ldquo;Let WSLATL support open my VPS panel during a support
            session&rdquo; in your profile under Data and privacy. It is off unless you turn it
            on, only you can change it, and each time staff open your panel, your Activity tab
            shows who did it and when.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          We use cookies minimally and only where necessary. Our use of cookies includes:
        </p>
        <ul>
          <li>
            <strong>Session cookies:</strong> Required to keep you
            logged in to our billing portal and hosting panels. These expire when you close your browser
            or log out.
          </li>
          <li>
            <strong>Preference cookies:</strong> May store display
            preferences or settings you have chosen within our panels.
          </li>
        </ul>
        <p>
          We do not use third-party advertising cookies, tracking pixels, or behavioral analytics tools
          on wslatl.com. You can manage or disable cookies in your browser settings, but doing so may
          affect the functionality of authenticated areas like our billing portal and hosting panels.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Your Rights & Choices">
        <p>
          Depending on your location, you may have the following rights regarding your personal data:
        </p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> Request that we correct inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements.</li>
          <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
          <li><strong>Restriction:</strong> Request that we limit how we process your data.</li>
          <li><strong>Objection:</strong> Object to certain types of data processing.</li>
        </ul>
        <p>
          <strong>Download your data yourself.</strong> In the billing portal, go to your profile
          under Data and privacy. You enter your password first, and you can download a copy once
          a day. The file holds your profile, services, invoices and payments, the brand, last
          four digits and expiry date of your saved cards, your credit history, your tickets and
          replies, your Ask Ava chats, your refund and name change requests, and your activity.
          It leaves out your password, security secrets such as two-factor keys, and our internal
          staff notes and fraud checks. The activity in it matches the Activity tab in your
          profile: it shows when our support team accessed your account, but not the sign-in
          records or IP addresses of our staff. If our team produces the file for you, we email you to let you know.
        </p>
        <p>
          <strong>Ask for your account to be deleted.</strong> You can do this from the same
          place, after entering your password. Our team approves or declines the request. If it is
          approved, you are signed out and we email you the date your personal details will be
          erased. That date is the end of the recovery window for post-termination data in
          Section 5, so it is never more than 14 days after the approval. Until then, you can ask
          us to restore your account. Invoices, payments, and your credit history are kept as
          financial records, with your personal details removed.
        </p>
        <p>
          To exercise any of these rights, contact us at{' '}
          <Email name="support" />.
          We will respond within 30 days. We may need to verify your identity before processing your request.
        </p>
        <p>
          <strong>California residents</strong> may have additional
          rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA),
          including the right to know what personal information is sold or shared and the right to opt out.
          We do not sell personal information, so opt-out rights under CCPA do not apply.
        </p>
        <p>
          <strong>EEA/UK residents</strong> have rights under the
          GDPR and UK GDPR, including the rights listed above. Our legal basis for processing your data
          is primarily the performance of a contract (providing services you requested) and compliance
          with legal obligations. Transfers of your data outside the EEA or UK are described in
          Section 4.5.
        </p>

        <LegalSubSection title="8.1 Right to Complain to a Supervisory Authority">
          <p>
            If you are in the European Economic Area, the United Kingdom, or Switzerland, you have
            the right under Article 77 of the GDPR, and the equivalent provision of the UK GDPR,
            to lodge a complaint with a data protection supervisory authority. You can complain to
            the authority in the country where you live, where you work, or where you believe the
            problem occurred.
          </p>
          <p>
            In the United Kingdom, that authority is the Information Commissioner&rsquo;s Office.
            In the EEA, each member state has its own authority, and the European Data Protection
            Board publishes the current list.
          </p>
          <p>
            You do not have to come to us first, and exercising this right does not affect any
            other remedy available to you. That said, we would genuinely rather hear about a
            problem directly. Write to{' '}
            <Email name="support" />{' '}
            and we will take it seriously.
          </p>
        </LegalSubSection>

        <LegalSubSection title="8.2 Requests About Data on Someone Else's Service">
          <p>
            If your personal data is held on a service that a WSLATL client runs on our
            infrastructure, we are the processor of that data and not the controller, as explained
            in Section 1.1. We are generally not able to access, correct, or delete it on your
            request, because it is not ours to decide about.
          </p>
          <p>
            Direct your request to the operator of the service you used. If you cannot identify or
            reach them, contact us and we will forward your request to the client where we
            reasonably can.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="9" title="Age Requirements & Children's Privacy">
        <p>We have a strict three-tier age policy that applies to our website, billing portal, and all hosting services:</p>

        <Tiers>
          <Tier tone="critical" title="Under 13: Not Permitted">
            Individuals under the age of 13 are strictly prohibited from using any WSLATL service,
            including our website, billing portal, and hosting panels. We do not knowingly collect
            personal information from anyone under 13. If we discover or are notified that a user
            is under 13, their account will be immediately and permanently banned and all associated
            data will be deleted. We take this seriously and have zero tolerance for underage access.
          </Tier>
          <Tier tone="caution" title="Ages 13 to 17: Permitted With Adult Consent">
            We welcome users aged 13 through 17, but a parent or legal guardian must provide
            explicit consent before the account is used. By registering or using our services,
            users in this age group confirm that a parent or guardian has reviewed and agreed to
            our Terms of Service, Privacy Policy, and Acceptable Use Policy on their behalf.
            The consenting adult assumes full responsibility for the minor&apos;s account activity
            and any associated charges. If we discover an account in this age range was created
            without adult consent, we will suspend the account until valid consent is provided.
          </Tier>
          <Tier tone="good" title="18 and Over: Fully Permitted">
            Adults 18 years of age or older may register and use our services without any
            additional consent requirements, subject to account approval under our application-only
            model and compliance with our Terms and Acceptable Use Policy.
          </Tier>
        </Tiers>

        <p>
          If you are a parent or guardian and believe your child under 13 has registered with us or
          provided us with personal information without your knowledge, contact us immediately at{' '}
          <Email name="support" />.
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
        <ul>
          <li>Update the effective date shown at the top of this page</li>
          <li>Notify active clients via email with a summary of what changed</li>
          <li>Post the updated policy at {siteConfig.paths.privacy}</li>
        </ul>
        <p>
          Your continued use of our services after the effective date of any changes constitutes your
          acceptance of the updated Privacy Policy. If you disagree with material changes, you may
          cancel your service before the effective date.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contact Us">
        <p>
          Questions, concerns, or requests related to this Privacy Policy should be directed to:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
