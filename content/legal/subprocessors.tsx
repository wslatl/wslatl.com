import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function SubprocessorsContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          This page lists the third parties that process personal data on behalf of WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) so that
          we can operate our website, billing portal, hosting panels, and support channels. It
          supports Section 4.1 of our{' '}
          <a href={siteConfig.paths.privacy} className="text-primary hover:underline">Privacy Policy</a>,
          which describes these recipients only by category.
        </p>
        <p>
          A subprocessor is a company we engage that may handle personal data in the course of
          providing a service to us. Each one receives only the data needed for its function. We
          do not sell personal data and we do not share it for advertising.
        </p>
        <p>
          This list covers processing carried out by WSLATL. It does not cover services that you
          choose to install and run yourself on a server we host for you. For that data, see
          Section 5 below.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Subprocessors">
        <p>
          The following third parties may process personal data on our behalf. The
          &ldquo;Location&rdquo; column describes where the provider is established and, where
          relevant, the general footprint of the infrastructure it uses.
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Subprocessor</th>
                <th>Purpose</th>
                <th>Data Categories</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Stripe</td>
                <td>Card payment processing and billing in the client portal</td>
                <td>Name, email address, billing address, payment card details, transaction records, IP address</td>
                <td>United States, with global processing</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">PayPal</td>
                <td>Alternative payment processing in the client portal</td>
                <td>Name, email address, PayPal account identifiers, transaction records</td>
                <td>United States, with global processing</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (Turnstile)</td>
                <td>Bot and abuse protection on sign-up, login, and other public forms</td>
                <td>IP address, browser and device signals, challenge tokens</td>
                <td>United States, with a global edge network</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (CDN and DNS)</td>
                <td>Content delivery, DNS resolution, and denial-of-service protection for our public sites</td>
                <td>IP address, request metadata, HTTP headers, TLS connection data</td>
                <td>United States, with a global edge network</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">WSLATL mail gateway (smtp.wslatl.com)</td>
                <td>Delivery of transactional email such as invoices, account notices, and password resets</td>
                <td>Name, email address, and the content of the messages we send you</td>
                <td>Operated by WSLATL on its own infrastructure</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pterodactyl</td>
                <td>Game server control panel used to provision and manage game hosting</td>
                <td>Account identifiers, email address, server configuration, panel activity logs</td>
                <td>Open-source software operated by WSLATL on its own infrastructure</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VirtFusion</td>
                <td>VPS control panel used to provision and manage virtual servers</td>
                <td>Account identifiers, email address, VPS configuration, IP allocations, panel activity logs</td>
                <td>Licensed software operated by WSLATL on its own infrastructure; vendor support access is possible during troubleshooting</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Datacenter partner(s)</td>
                <td>Physical hosting, rack space, power, and network transit for our servers</td>
                <td>Physical custody of the servers, and therefore of any data stored on them</td>
                <td>See note below</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">jsDelivr and cdnjs</td>
                <td>Delivery of common front-end libraries used by our panels</td>
                <td>IP address, user agent, and request metadata, sent by your browser when it loads an asset</td>
                <td>Public CDN networks with globally distributed edge nodes</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Photon (OpenStreetMap data)</td>
                <td>Address autocomplete suggestions on sign-up and profile forms</td>
                <td>The partial address text you type into an address field</td>
                <td>Europe</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/*
          OWNER DECISION NEEDED: datacenter partner identity and location.

          The datacenter partner or partners could not be determined from the codebase, and this
          is the single most important entry on the page: the datacenter has physical custody of
          every server and therefore of all client data at rest.

          Fill in, for each facility actually in use:
            - the legal entity name of the operator
            - the city and country of the facility
            - whether any facility is outside the United States (this changes the transfer
              analysis in Section 4)

          A GDPR subprocessor list that omits the entity holding the hardware is not complete,
          and a client asking for a data processing agreement will ask for exactly this.
        */}
        <div className="mt-4">
          <div className="legal-callout border-yellow-500/30 text-yellow-300">
            <strong>Datacenter partner: to be published</strong>
            The operator and location of the facilities housing our servers are being confirmed
            and will be named here. If you need this information before it is published, for
            example to complete your own vendor review, contact us at {siteConfig.email.support}
            and we will provide it.
          </div>
        </div>

        <p className="mt-4">
          We may add or replace a subprocessor as our infrastructure changes. When we do, we will
          update this page. Active clients who have asked to be notified of subprocessor changes
          will be told by email; you can opt in by writing to{' '}
          <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
            {siteConfig.email.support}
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Notes on Specific Entries">

        <LegalSubSection title="3.1 Payment Processors">
          <p>
            Card details are entered directly into the payment processor and are handled by that
            processor. As stated in Section 2.2 of our Privacy Policy, we do not store your full
            card number or CVV. What we retain is the payment method type, the last four digits,
            and transaction identifiers.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Address Autocomplete">
          <p>
            Address suggestions are requested by our own server rather than by your browser. Your
            IP address is therefore not exposed to the geocoding service; only the partial address
            text you have typed is sent. We do not send the rest of your form, your account
            identity, or your email address with the lookup.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Public CDNs">
          <p>
            Where a page loads a front-end library from a public CDN, your browser makes a direct
            request to that CDN, which necessarily reveals your IP address and user agent to it.
            This is standard for CDN-delivered assets and is not something we transmit to them
            ourselves.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.4 Self-Operated Systems">
          <p>
            Our mail gateway, the Pterodactyl panel, and the VirtFusion panel run on
            infrastructure we control rather than as hosted third-party services. They are listed
            here for completeness because they process personal data, and because a software
            vendor may in some circumstances be given access during a support investigation. Where
            that happens, the access is limited to what is needed to resolve the issue.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="International Transfers">
        <p>
          WSLATL LLC is established in the State of Missouri, United States, and our services are
          operated from the United States. If you are located in the European Economic Area, the
          United Kingdom, or Switzerland, using our services involves transferring your personal
          data to the United States and, where a subprocessor operates a global network, to other
          countries.
        </p>
        <p>
          The United States has not been the subject of a general adequacy decision covering all
          recipients. Where we transfer personal data out of the EEA or the UK, we rely on the
          following:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Necessity for the contract.</span> For
            most transfers, the transfer is necessary to perform the contract you have asked us to
            perform. You cannot be given a server in our facility without your data reaching our
            facility.
          </li>
          <li>
            <span className="text-foreground font-medium">Standard Contractual Clauses.</span>{' '}
            Where a subprocessor offers them, we rely on the European Commission&rsquo;s Standard
            Contractual Clauses, and on the UK International Data Transfer Addendum for UK
            transfers. Several of the providers listed above incorporate these clauses into their
            standard data processing terms.
          </li>
          <li>
            <span className="text-foreground font-medium">Provider-level frameworks.</span> Some
            of the providers listed above maintain their own certifications or transfer mechanisms
            covering the data they receive. Those mechanisms are the provider&rsquo;s, not ours,
            and you should consult the provider&rsquo;s own privacy documentation for detail.
          </li>
        </ul>

        {/*
          OWNER DECISION NEEDED: EEA/UK compliance posture.

          Two items on this page state a position about WSLATL itself rather than about a vendor,
          and both need to be confirmed before publication:

            1. EU-US Data Privacy Framework. The paragraph below states that WSLATL does not
               maintain its own DPF certification. Confirm this is correct. If a certification
               has been obtained, replace the paragraph with the certification detail. Do not
               leave a claim of certification on the page that is not backed by an active
               listing.

            2. Article 27 representative. A controller or processor established outside the EEA
               that offers services to data subjects in the EEA is generally required by GDPR
               Article 27 to designate a representative in the Union, and by UK GDPR Article 27
               to designate one in the UK, unless an exemption applies. WSLATL has no such
               representative listed anywhere in these documents. Counsel should determine
               whether an exemption applies given the volume and nature of EEA/UK clients, and
               if not, a representative must be appointed and named on this page and in the
               Privacy Policy.
        */}
        <p className="mt-4">
          WSLATL does not currently maintain its own certification under the EU-US Data Privacy
          Framework. We do not claim adequacy on that basis.
        </p>
        <p className="mt-3">
          If you require a data processing agreement, a copy of the Standard Contractual Clauses
          as we apply them, or a transfer impact assessment for your own compliance file, contact
          us at{' '}
          <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
            {siteConfig.email.support}
          </a>{' '}
          and we will work through it with you.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Data You Put on Your Own Servers">
        <p>
          There is an important distinction between the two kinds of data involved in hosting.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Your account data.</span> The
            information you give us to open and run your account, such as your name, email
            address, billing address, and invoice history. WSLATL is the controller of this data
            and the subprocessors listed above are engaged by us.
          </li>
          <li>
            <span className="text-foreground font-medium">Data on your services.</span> Whatever
            you or your users store on a server we host for you, including databases, game server
            data, uploaded files, and application logs. You decide what is collected and why.
            WSLATL is a processor of that data, not the controller, and this subprocessor list is
            not a list of your subprocessors.
          </li>
        </ul>
        <p className="mt-4">
          If you are hosting other people&rsquo;s personal data on a WSLATL service, the
          obligations of a controller under the GDPR or other applicable law fall on you. That
          includes having a lawful basis, providing notice to your own users, and maintaining your
          own record of processing. See Section 12 of our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>{' '}
          for the related indemnity.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Changes to This List">
        <p>
          We will keep this page current as our infrastructure changes. When a subprocessor is
          added or replaced, we will update the effective date at the top of this page and post
          the updated list at{' '}
          <a href={siteConfig.paths.subprocessors} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.subprocessors}
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contact">
        <p>
          Questions about this list, requests for a data processing agreement, and privacy
          requests generally should be directed to:
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
