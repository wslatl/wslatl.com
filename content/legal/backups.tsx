import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function BackupsContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          This Backup Policy explains what backups WSLATL LLC (&ldquo;WSLATL,&rdquo;
          &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) takes, what those backups are
          and are not, who is responsible for your data, and how to request a restore.
        </p>
        <p>
          It is incorporated into our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>{' '}
          by reference and should be read alongside Section 2 (Description of Services), Section
          9.3 (Effect of Termination), and Section 11 (Limitation of Liability).
        </p>
        <p>
          This policy exists as its own document rather than as a clause in the Terms for a
          practical reason: what is included with each plan changes as our plans change, and a
          plan change should not require a revision to the Terms of Service and the notice period
          that comes with it. The responsibility allocation below does not change; only the plan
          detail does.
        </p>
      </LegalSection>

      <LegalSection number="2" title="The Short Version">
        <div className="mt-1">
          <div className="legal-callout border-red-500/30 text-red-300">
            <strong>Keep your own backups</strong>
            Any backup we provide is a convenience, not a guarantee. It is best-effort and it is
            not a substitute for your own independent copies of your data. If your data matters
            to you, you must maintain your own backups, stored somewhere other than the service
            they came from. Do not rely on us as your only copy.
          </div>
        </div>
        <p className="mt-4">
          We take backups because they are useful and because they help us help you. We take them
          seriously. But backups can fail, can be incomplete, can be corrupted, and can be
          unavailable at the moment you need them most. Every hosting provider that tells you
          otherwise is overselling. The rest of this page sets out honestly what you get.
        </p>
      </LegalSection>

      <LegalSection number="3" title="What Is Included">
        <p>
          What is backed up, how often it is taken, and how long it is kept depends on the service
          and the plan. The table below summarizes what is included by service. Exact retention
          windows for your specific service are shown in your billing portal, and you can always
          confirm them with our team.
        </p>

        <div className="overflow-x-auto mt-3">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Backups Included</th>
                <th>What Is Captured</th>
                <th>Frequency</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Dedicated Servers</td>
                <td>Not included (self-managed)</td>
                <td>Not applicable</td>
                <td>Not applicable</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Game Server Hosting</td>
                <td>Included</td>
                <td>Full server container</td>
                <td>Monthly</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VPS Hosting</td>
                <td>Included <span className="text-muted-foreground">(launching soon)</span></td>
                <td>Full disk image</td>
                <td>Monthly</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Web Hosting</td>
                <td>Included</td>
                <td>The website and its state</td>
                <td>Monthly</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-5 space-y-3 text-[0.9375rem]">
          <p>A few specifics behind the table:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <span className="text-foreground font-medium">Dedicated Servers.</span> A dedicated
              server is your machine. You have full control of the operating system and everything
              on it, and we do not take backups of it for you. Running and storing backups of a
              dedicated server is your responsibility. We are happy to discuss a managed backup
              arrangement on request.
            </li>
            <li>
              <span className="text-foreground font-medium">Game Server Hosting.</span> We take a
              backup of the full game server container on a monthly cycle.
            </li>
            <li>
              <span className="text-foreground font-medium">VPS Hosting.</span> VPS hosting is
              launching soon. When it goes live, we take a monthly backup of the full disk image of
              each VPS. Until then, this row describes what is planned, not something already
              running.
            </li>
            <li>
              <span className="text-foreground font-medium">Web Hosting.</span> We take a monthly
              backup of the website itself and its current state (its files and data), not the
              whole hosting account around it.
            </li>
          </ul>
          <p>
            Where a backup is described as monthly, it is taken on an approximately monthly cycle,
            not on a guaranteed calendar date. As set out in Section 4, every backup we take is
            best-effort, and it is not a replacement for the independent copies you keep yourself.
          </p>
        </div>
      </LegalSection>

      <LegalSection number="4" title="Backups Are Best-Effort">
        <p>
          Where backups are included with your service, we provide them on a best-effort basis. We
          do not warrant that:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>A backup exists for any particular service at any particular point in time</li>
          <li>A backup taken is complete, uncorrupted, or restorable</li>
          <li>A restore will succeed, or will succeed within any particular timeframe</li>
          <li>Data recovered from a backup will be current as of any particular moment</li>
          <li>A backup will survive the loss of the underlying infrastructure</li>
        </ul>
        <p className="mt-4">
          This is consistent with the disclaimers in Section 10 and the limitation of liability in
          Section 11 of our Terms of Service. Nothing in this policy creates a warranty that those
          sections exclude.
        </p>

        <LegalSubSection title="4.1 Things Backups Do Not Protect Against">
          <p>
            A backup is a copy of your data taken at a point in time. It does not protect you from
            everything, and in particular it does not protect against:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              Damage that is itself backed up, such as a corrupted database or a bad deployment
              that was captured before you noticed the problem
            </li>
            <li>
              Deletion that falls between two backups, meaning any work done since the last
              backup ran
            </li>
            <li>
              Loss of a service that has been terminated, where the data has already been removed
              under Section 9.3 of the Terms of Service
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Your Responsibilities">
        <p>
          You are responsible for the data you store on our infrastructure. Specifically, you
          agree that:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">You maintain your own backups.</span>{' '}
            You are responsible for keeping current, independent copies of any data you cannot
            afford to lose, stored off the WSLATL service that produced it.
          </li>
          <li>
            <span className="text-foreground font-medium">You verify that your backups work.</span>{' '}
            A backup you have never restored from is a hypothesis, not a backup. Test yours.
          </li>
          <li>
            <span className="text-foreground font-medium">You take a copy before risky changes.</span>{' '}
            Before an operating system reinstall, a plan change, a migration, a cancellation, or
            any other operation that may destroy data, take your own copy first. We will not be
            able to undo a destructive action you asked for.
          </li>
          <li>
            <span className="text-foreground font-medium">You export before you leave.</span> If
            you cancel a service or let it lapse, export your data before the termination takes
            effect. Post-termination retention is limited and is described in Section 9.3 of the
            Terms of Service.
          </li>
          <li>
            <span className="text-foreground font-medium">You keep your own users&rsquo; data safe.</span>{' '}
            If other people rely on the service you run on our infrastructure, their backup
            expectations are your responsibility, not ours.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Requesting a Restore">
        <p>
          To request a restore, open a ticket in the billing portal at{' '}
          <a href={siteConfig.links.billing} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            billing.wslatl.com
          </a>{' '}
          or email{' '}
          <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
            {siteConfig.email.support}
          </a>. Tell us:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>The service the restore is for</li>
          <li>What was lost, and as precisely as you can, when it was lost</li>
          <li>The point in time you would like to restore to</li>
          <li>Whether you want a full restore over the running service, or a copy delivered alongside it</li>
        </ul>

        <LegalSubSection title="6.1 How We Handle Restore Requests">
          <p>
            We will tell you what backups we actually hold for the service and what restoring from
            them would involve before we do anything. Where a backup exists and a restore is
            possible, we will carry it out or make the data available to you.
          </p>
          <p>
            A restore is destructive by nature. Restoring over a running service replaces its
            current state, including anything created since the backup was taken. We will not
            begin a restore that overwrites live data without your explicit confirmation of the
            restore point.
          </p>
          <p>
            We do not commit to a restore turnaround time. How long a restore takes depends
            entirely on the size of the data, the service type, and where the backup is held. We
            will give you an estimate when we confirm what is available, and we prioritize
            restores over routine work.
          </p>
        </LegalSubSection>

        <LegalSubSection title="6.2 When a Restore Is Chargeable">
          <p>
            Some restores are a paid service rather than an included one. Whether a restore is
            chargeable, and at what price, depends on your plan and on the nature of the request.
            We will tell you the cost before carrying out any chargeable work, and you can decline
            it.
          </p>
          <p>
            Where a restore has been carried out as a paid add-on, it is a consumed service and is
            not refundable, as set out in Section 5 of our{' '}
            <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Backups and Termination">
        <p>
          Backups are part of your service, not something held separately from it. When a service
          is terminated, its backups are subject to the same retention and deletion rules as the
          service itself, described in Section 9.3 of our Terms of Service. Once that period has
          elapsed, the data is gone and we cannot recover it for you regardless of the reason for
          the request.
        </p>
        <p>
          If you need data from a terminated service, ask immediately. Do not assume it will still
          be there next week.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Security of Backups">
        <p>
          Backups contain your data and are protected with the same controls described in Section
          6 of our{' '}
          <a href={siteConfig.paths.privacy} className="text-primary hover:underline">Privacy Policy</a>,
          including access controls limiting which members of our team can reach them. Where a
          backup is held on infrastructure operated by a partner, the recipients listed on our{' '}
          <a href={siteConfig.paths.subprocessors} className="text-primary hover:underline">Subprocessors</a>{' '}
          page apply to that copy as well.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Changes to This Policy">
        <p>
          We may update this Backup Policy to reflect changes in our infrastructure or our plans.
          When we make material changes, we will update the effective date at the top of this page
          and post the updated policy at{' '}
          <a href={siteConfig.paths.backups} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.backups}
          </a>. Changes that reduce what is included with a service you already hold will be
          notified by email before they take effect.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contact">
        <p>
          Restore requests and questions about backups should be directed to:
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
