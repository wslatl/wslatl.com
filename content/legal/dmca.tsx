import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function DmcaContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          WSLATL LLC (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
          respects the intellectual property rights of others and expects our clients to do the
          same. This DMCA Policy explains how to report material hosted on WSLATL infrastructure
          that you believe infringes your copyright, how a client may dispute a removal, and how we
          handle clients who repeatedly infringe.
        </p>
        <p>
          This policy is written to align with the Digital Millennium Copyright Act,
          17 U.S.C. &sect;&nbsp;512. It replaces and expands the summary previously contained in
          Section 8 of our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>,
          and is incorporated into those Terms by reference.
        </p>
        <p>
          WSLATL is a hosting provider. In most cases we do not create, select, or review the
          material stored on our infrastructure by clients. We act on copyright complaints that
          comply with the requirements below.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Designated Copyright Agent">
        <p>
          Notices of claimed infringement must be sent to our designated agent. Notices sent to
          other addresses, staff members, or our Discord server may be delayed and may not be
          treated as valid notice.
        </p>

        {/*
          Designated agent registration status.

          WSLATL acts as its own designated copyright agent; there is no separate named
          individual. The contact details below are the channel we monitor for copyright
          complaints.

          Note that the DMCA safe harbor under 17 U.S.C. 512(c)(2) requires the designated agent
          to be registered with the US Copyright Office through the DMCA Designated Agent
          Directory (dmca.copyright.gov), a paid filing renewed every three years. Publishing
          this page does NOT create the safe harbor on its own. Until that filing is completed and
          kept current, do not add any statement to this page claiming the agent is registered.
        */}
        <div className="mt-3 p-5 rounded-xl border border-border/70 bg-card/30 text-sm space-y-1.5 relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">Designated Copyright Agent</p>
          <p><span className="text-foreground font-medium">Agent:</span> WSLATL Copyright Agent</p>
          <p><span className="text-foreground font-medium">Company:</span> WSLATL LLC</p>
          <p><span className="text-foreground font-medium">Mailing address:</span> 2414 County Road 1310, Moberly, MO 65270, United States</p>
          <p><span className="text-foreground font-medium">Telephone:</span> 1-660-998-8016</p>
          <p>
            <span className="text-foreground font-medium">Email:</span>{' '}
            <a href={`mailto:${siteConfig.email.dmca}`} className="text-primary hover:underline">
              {siteConfig.email.dmca}
            </a>
          </p>
          <p><span className="text-foreground font-medium">Subject line:</span> DMCA Takedown Notice</p>
        </div>

        <div className="mt-4">
          <div className="legal-callout border-yellow-500/30 text-yellow-300">
            <strong>Agent registration status</strong>
            The contact details above are the channel we monitor for copyright complaints. We do
            not claim on this page that a designated agent registration has been completed with
            the United States Copyright Office. If you need to confirm the current registration
            status before serving notice, contact us at {siteConfig.email.support} and we will
            tell you.
          </div>
        </div>
      </LegalSection>

      <LegalSection number="3" title="Filing a Takedown Notice">
        <p>
          To be effective under 17 U.S.C. &sect;&nbsp;512(c)(3), a notification of claimed
          infringement must be a written communication that includes substantially all of the
          following six elements:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-3">
          <li>
            A physical or electronic signature of a person authorized to act on behalf of the
            owner of an exclusive right that is allegedly infringed.
          </li>
          <li>
            Identification of the copyrighted work claimed to have been infringed. If multiple
            works at a single site are covered by one notification, a representative list of
            those works at that site.
          </li>
          <li>
            Identification of the material that is claimed to be infringing or to be the subject
            of infringing activity, and information reasonably sufficient to permit us to locate
            it. A direct URL, IP address and port, file path, or server identifier is the most
            useful form.
          </li>
          <li>
            Information reasonably sufficient to permit us to contact you, including your name,
            address, telephone number, and, if available, an email address.
          </li>
          <li>
            A statement that you have a good faith belief that use of the material in the manner
            complained of is not authorized by the copyright owner, its agent, or the law.
          </li>
          <li>
            A statement that the information in the notification is accurate, and under penalty
            of perjury, that you are authorized to act on behalf of the owner of an exclusive
            right that is allegedly infringed.
          </li>
        </ol>
        <p className="mt-4">
          A notice that does not substantially comply with all six elements may not be treated as
          valid notice. If your notice is incomplete, we will tell you what is missing where we
          reasonably can.
        </p>

        <LegalSubSection title="3.1 What Happens Next">
          <p>
            On receipt of a compliant notice, we will respond expeditiously to remove or disable
            access to the identified material, and we will take reasonable steps to notify the
            affected client that the material has been removed or disabled. Depending on the
            service, removal may take the form of taking down a specific file, disabling a
            specific application, or suspending the affected service where the material cannot be
            isolated.
          </p>
          <p>
            We forward a copy of the notice, including the contact information it contains, to the
            affected client. Do not include information in a notice that you are not willing to
            have shared with the client.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Misrepresentation">
          <p>
            Under 17 U.S.C. &sect;&nbsp;512(f), any person who knowingly materially misrepresents
            that material is infringing, or that material was removed or disabled by mistake or
            misidentification, may be liable for damages, including costs and attorneys&rsquo;
            fees. Please consider whether the use you are reporting may be authorized by the
            copyright owner, by license, or by law before filing.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Counter-Notice">
        <p>
          If you are a WSLATL client and material of yours was removed or disabled, and you
          believe the removal was the result of mistake or misidentification, you may submit a
          counter-notification to our designated agent at the address in Section 2.
        </p>
        <p>
          To be effective under 17 U.S.C. &sect;&nbsp;512(g)(3), a counter-notification must be a
          written communication that includes substantially all of the following:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-3">
          <li>Your physical or electronic signature.</li>
          <li>
            Identification of the material that has been removed or to which access has been
            disabled, and the location at which the material appeared before it was removed or
            access to it was disabled.
          </li>
          <li>
            A statement under penalty of perjury that you have a good faith belief that the
            material was removed or disabled as a result of mistake or misidentification of the
            material.
          </li>
          <li>
            Your name, address, and telephone number, and a statement that you consent to the
            jurisdiction of the Federal District Court for the judicial district in which your
            address is located, or, if your address is outside of the United States, for any
            judicial district in which WSLATL LLC may be found, and that you will accept service
            of process from the person who provided the original notification or an agent of that
            person.
          </li>
        </ol>

        <LegalSubSection title="4.1 Restoration Timeline">
          <p>
            On receipt of a compliant counter-notification, we will promptly provide a copy to the
            person who filed the original takedown notice and inform that person that we will
            replace the removed material or cease disabling access to it.
          </p>
          <p>
            Under 17 U.S.C. &sect;&nbsp;512(g)(2)(C), we will replace the removed material or
            restore access{' '}
            <span className="text-foreground font-medium">
              not less than 10 and not more than 14 business days
            </span>{' '}
            following receipt of the counter-notification, unless our designated agent first
            receives notice from the original complaining party that they have filed an action
            seeking a court order to restrain the client from engaging in infringing activity
            relating to the material on our infrastructure.
          </p>
          <p>
            Restoration is subject to the service still being active and in good standing.
            Material cannot be restored from a service that has been terminated or whose data
            has already been deleted under our retention rules, and a counter-notice does not
            pause billing, suspension for non-payment, or any separate enforcement action taken
            under our{' '}
            <a href={siteConfig.paths.acceptableUse} className="text-primary hover:underline">Acceptable Use Policy</a>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Counter-Notice Misrepresentation">
          <p>
            The penalties in 17 U.S.C. &sect;&nbsp;512(f) apply to counter-notifications as well
            as to takedown notices. Filing a counter-notice that knowingly materially
            misrepresents that material was removed by mistake or misidentification may expose
            you to liability for damages.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Repeat Infringer Policy">
        <p>
          As required by 17 U.S.C. &sect;&nbsp;512(i), WSLATL has adopted and reasonably
          implements a policy providing for the termination, in appropriate circumstances, of the
          accounts of clients who are repeat infringers.
        </p>
        <p>How we implement that policy:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">We record every notice.</span> Each
            compliant takedown notice we act on is recorded against the client account
            responsible for the affected service.
          </li>
          <li>
            <span className="text-foreground font-medium">We notify the client.</span> The client
            is informed of the complaint, what was removed or disabled, and that the complaint
            has been recorded against their account.
          </li>
          <li>
            <span className="text-foreground font-medium">Repeat complaints escalate.</span>{' '}
            Further compliant notices against the same account lead to escalating action, which
            may include a formal warning, suspension of the affected service, and termination of
            the account.
          </li>
          <li>
            <span className="text-foreground font-medium">Successful counter-notices do not count.</span>{' '}
            A complaint that is withdrawn, or that is resolved in the client&rsquo;s favor through
            a counter-notification with no court action following, is not counted against the
            account.
          </li>
          <li>
            <span className="text-foreground font-medium">Egregious cases are immediate.</span>{' '}
            Where the infringement is flagrant, commercial in scale, or accompanied by other
            violations of our Acceptable Use Policy, we may terminate an account without waiting
            for a further notice.
          </li>
        </ul>

        {/*
          OWNER DECISION NEEDED: repeat-infringer threshold.

          Decide whether to publish a specific number of recorded, unresolved notices that
          triggers each escalation step (for example a defined warning step, a defined
          suspension step, and a defined termination step), or to keep the escalation
          discretionary as written above.

          A published number is easier to defend as "reasonably implemented" but binds you to
          apply it consistently. Do NOT publish a number here unless the billing panel actually
          tracks strikes per account and you intend to enforce it exactly as written.
        */}
        <p className="mt-4">
          Termination under this section is a termination for cause. As set out in our{' '}
          <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>,
          services terminated for violations of our Terms or Acceptable Use Policy are not
          eligible for a refund.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Material We Do Not Control">
        <p>
          WSLATL provides infrastructure. Where a client operates their own service on that
          infrastructure and controls what is stored on it, the client is the party responsible
          for the material. Where we can identify the client, we will forward your notice to
          them and expect them to act on it.
        </p>
        <p>
          For services that we do not host, including domains registered elsewhere, content
          delivered by a third-party network, or accounts on platforms we do not operate, we are
          not the correct recipient of your notice and cannot remove the material. Please direct
          your notice to the operator of that service.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Trademark & Other Complaints">
        <p>
          This policy covers copyright only. Complaints about trademark infringement,
          defamation, privacy violations, or other unlawful content should be sent to{' '}
          <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
            {siteConfig.email.support}
          </a>{' '}
          with a clear description of the material, its location, and the legal basis for your
          complaint. Those complaints are handled under our{' '}
          <a href={siteConfig.paths.acceptableUse} className="text-primary hover:underline">Acceptable Use Policy</a>{' '}
          rather than under the DMCA.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Changes to This Policy">
        <p>
          We may update this DMCA Policy to reflect changes in our practices or in applicable
          law. When we make material changes, we will update the effective date at the top of
          this page and post the updated policy at{' '}
          <a href={siteConfig.paths.dmca} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </a>.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Contact">
        <p>
          Copyright notices and counter-notices should go to the designated agent listed in
          Section 2. General questions about this policy can be sent to:
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
