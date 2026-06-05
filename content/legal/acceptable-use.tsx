import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function AcceptableUseContent() {
  return (
    <>
      <LegalSection number="1" title="Introduction & Scope">
        <p>
          This Acceptable Use Policy (&ldquo;AUP&rdquo;) applies to all clients, users, and
          individuals accessing services provided by WSLATL LLC, including but not limited to
          dedicated servers, game server hosting, VPS hosting, and web hosting services.
        </p>
        <p>
          This AUP is incorporated into and made part of our{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>. By using
          any WSLATL service, you agree to comply with this policy. Violations may result in
          immediate suspension or termination of your services without refund, and potentially
          referral to law enforcement.
        </p>
        <p>
          We are a small, private hosting company. Our infrastructure serves real clients whose
          businesses and projects depend on reliable uptime. We protect that infrastructure
          aggressively and have zero tolerance for activity that puts it or those clients at risk.
        </p>

        <div className="mt-2 p-5 rounded-xl border border-border/70 bg-card/30 space-y-3">
          <p className="font-semibold text-foreground mb-2 text-sm">Age Requirements</p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="mt-2 w-2 h-2 rounded-full bg-red-500 flex-shrink-0 ring-4 ring-red-500/15" />
              <p>
                <span className="text-foreground font-medium">Under 13: Banned.</span>{' '}
                Individuals under 13 are not permitted to use any WSLATL service. Accounts found
                to belong to users under 13 are permanently banned immediately and all data is deleted.
                No exceptions.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="mt-2 w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0 ring-4 ring-yellow-500/15" />
              <p>
                <span className="text-foreground font-medium">Ages 13 to 17: Adult consent required.</span>{' '}
                Users aged 13 through 17 are welcome, but a parent or legal guardian must have
                reviewed and consented to these terms on their behalf before the account is used.
                The consenting adult is responsible for all account activity and charges.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="mt-2 w-2 h-2 rounded-full bg-green-500 flex-shrink-0 ring-4 ring-green-500/15" />
              <p>
                <span className="text-foreground font-medium">18 and over: Fully permitted.</span>{' '}
                No additional age-related requirements beyond standard account approval.
              </p>
            </div>
          </div>
        </div>
      </LegalSection>

      <LegalSection number="2" title="Permitted Uses">
        <p>WSLATL services are provided for lawful purposes. Permitted uses include:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Hosting websites, web applications, REST APIs, and static content</li>
          <li>Running game servers for personal or community use (in accordance with the game publisher&apos;s terms)</li>
          <li>Development and staging environments, code repositories, and CI/CD pipelines</li>
          <li>Personal projects, portfolios, and hobby applications</li>
          <li>Legitimate commercial applications and business infrastructure</li>
          <li>Databases, file storage, and backend infrastructure</li>
          <li>VPN or proxy services used for personal privacy protection (must be disclosed at signup; operating a public VPN service requires prior approval)</li>
          <li>Mail servers for legitimate transactional or personal email (must be disclosed at signup; bulk email requires prior written approval)</li>
          <li>Software testing and security research on systems you own or have explicit written authorization to test</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Prohibited Content">
        <p>
          The following content is strictly prohibited on WSLATL infrastructure under any
          circumstance. Violation of this section will result in immediate termination without
          notice or refund:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Child Sexual Abuse Material (CSAM):</span>{' '}
            Any content that sexually exploits, depicts, or endangers minors. Zero tolerance.
            Violations will be reported immediately to the National Center for Missing &amp; Exploited
            Children (NCMEC) and law enforcement.
          </li>
          <li>
            <span className="text-foreground font-medium">Terrorism & Violent Extremism:</span>{' '}
            Content that promotes, recruits for, finances, or facilitates terrorism, mass violence,
            or violent extremist movements.
          </li>
          <li>
            <span className="text-foreground font-medium">Malware & Malicious Software:</span>{' '}
            Hosting, distributing, or developing viruses, ransomware, spyware, trojans, keyloggers,
            rootkits, or any other software designed to damage, disrupt, or gain unauthorized access
            to computer systems.
          </li>
          <li>
            <span className="text-foreground font-medium">Phishing & Fraud:</span>{' '}
            Pages, domains, or applications designed to deceive users into providing credentials,
            financial information, or personal data under false pretenses.
          </li>
          <li>
            <span className="text-foreground font-medium">Copyright Infringing Content:</span>{' '}
            Hosting or distributing content that infringes on the copyrights, trademarks, or other
            intellectual property rights of any person or entity.
          </li>
          <li>
            <span className="text-foreground font-medium">Counterfeit or Fraudulent Content:</span>{' '}
            Fake storefronts, counterfeit goods, diploma mills, or any fraudulent commercial activity.
          </li>
          <li>
            <span className="text-foreground font-medium">Illegal Weapons & Controlled Substances:</span>{' '}
            Content that facilitates the illegal sale, manufacture, or distribution of weapons,
            controlled substances, or other contraband.
          </li>
          <li>
            <span className="text-foreground font-medium">Unlicensed Gambling:</span>{' '}
            Operating online gambling services without all applicable licenses and legal authorizations.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Prohibited Activities">

        <LegalSubSection title="4.1 Network Attacks & Infrastructure Abuse">
          <p>The following activities are strictly prohibited and will result in immediate termination:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <span className="text-foreground font-medium">DDoS Attacks:</span> Conducting,
              facilitating, launching, or participating in Distributed Denial of Service attacks
              against any target, including other WSLATL clients, external services, or any internet
              infrastructure. This is our most strictly enforced rule.
            </li>
            <li>
              <span className="text-foreground font-medium">Port & Vulnerability Scanning:</span>{' '}
              Scanning, probing, or mapping the network or services of systems you do not own or have
              explicit written authorization to test
            </li>
            <li>
              <span className="text-foreground font-medium">Network Interception:</span>{' '}
              Man-in-the-middle attacks, ARP poisoning, DNS hijacking, SSL stripping, or any
              technique intended to intercept or alter network traffic
            </li>
            <li>IP spoofing or sending traffic with falsified source addresses</li>
            <li>Attempting to exploit vulnerabilities in WSLATL infrastructure or other clients&apos; services</li>
            <li>Using WSLATL infrastructure as a staging or relay point for attacks against external systems</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Spam & Unsolicited Communications">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Sending unsolicited bulk email (spam) of any kind</li>
            <li>Operating an open mail relay that can be used to send spam</li>
            <li>Email spoofing, phishing campaigns, or impersonation</li>
            <li>SMS spam or any form of unsolicited mass messaging</li>
            <li>Scraping, harvesting, or compiling email addresses or personal data without consent</li>
            <li>Sending bulk commercial email without CAN-SPAM compliant opt-out mechanisms</li>
          </ul>
          <p className="mt-2">
            Clients who need to send legitimate transactional or marketing email in volume must
            disclose this use case at signup and maintain compliance with the CAN-SPAM Act and any
            other applicable anti-spam legislation.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Unauthorized Access">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Attempting to access any computer system, account, database, or network that you are not authorized to access</li>
            <li>Brute-force attacks against any login interface, including SSH, RDP, web apps, and APIs</li>
            <li>Credential stuffing using leaked or stolen credential sets</li>
            <li>Social engineering targeting WSLATL staff, other clients, or any third party</li>
            <li>Using our services to facilitate unauthorized access to third-party systems</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Cryptocurrency Mining">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Cryptocurrency or blockchain mining of any kind is <span className="text-foreground font-medium">prohibited by default</span> on game hosting and web hosting plans</li>
            <li>Mining on VPS or dedicated server plans requires prior <span className="text-foreground font-medium">written approval</span> from WSLATL before commencing operations</li>
            <li>Approved mining operations must not negatively impact data center power consumption, cooling systems, or shared infrastructure</li>
            <li>We reserve the right to revoke mining approval at any time if it impacts our infrastructure or other clients</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.5 Illegal Activities">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Using WSLATL infrastructure for any activity that violates applicable local, state, federal, or international law</li>
            <li>Facilitating fraud, money laundering, wire fraud, or financial crimes</li>
            <li>Operating illegal marketplaces or darknet services</li>
            <li>Circumventing lawful court orders or obstruction of law enforcement</li>
            <li>Evading sanctions or engaging in activities prohibited by applicable export control laws</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.6 Privacy Violations">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Collecting, processing, or storing personal data without appropriate legal basis or consent</li>
            <li>Operating services in violation of GDPR, CCPA, COPPA, or other applicable data protection laws</li>
            <li>Doxxing or publishing private personal information about individuals without their consent</li>
            <li>Stalkerware or surveillance software that operates without the knowledge of the monitored individual</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Resource Usage Guidelines">
        <p>
          Responsible resource usage is required to maintain a fair and stable environment for
          all clients. The following guidelines apply:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Bandwidth:</span> You may use bandwidth
            up to your plan&apos;s included allocation. Overages are billed at the rates listed in
            your billing portal. Unmetered bandwidth plans are subject to fair use; abuse of
            unmetered plans may result in throttling or required upgrade.
          </li>
          <li>
            <span className="text-foreground font-medium">CPU & RAM:</span> Intentional
            consumption of resources beyond your plan allocation to the detriment of other clients
            (on shared infrastructure) or to circumvent plan limits is prohibited.
          </li>
          <li>
            <span className="text-foreground font-medium">Disk I/O:</span> Workloads that
            generate sustained high disk I/O impacting shared storage infrastructure must be
            discussed with us in advance.
          </li>
          <li>
            <span className="text-foreground font-medium">Outbound Connections:</span> Generating
            abnormally high volumes of outbound network connections (e.g., connection floods)
            without prior notification is prohibited.
          </li>
        </ul>
        <p className="mt-4">
          If you have a legitimate use case that requires high resource consumption, talk to us
          before it becomes an issue. We are flexible for clients who communicate openly.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Game Server Specific Rules">
        <p>For clients using our game server hosting services:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Game servers must run software and configurations that comply with the applicable game publisher&apos;s terms of service and end-user license agreement</li>
          <li>Hosting pirated game server software, cracked clients, or any copyright-infringing game content is prohibited</li>
          <li>Do not run processes unrelated to your game server on game hosting plans without prior approval (e.g., mining, bots, scraping)</li>
          <li>Mods, plugins, and server configurations must not be used to conduct any of the prohibited activities listed in this AUP</li>
          <li>Our DDoS protection is provided for your server&apos;s defense; do not attempt to circumvent, disable, or abuse it</li>
          <li>Exceeding your plan&apos;s player slot limit or allocated resources requires an upgrade before use, not after</li>
          <li>Game servers used to harass, threaten, or harm other players may be subject to suspension pending investigation</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" title="Security Testing & Research">
        <p>
          Security research and penetration testing are permitted only under the following conditions:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Your own systems:</span> You may conduct
            security testing on servers and services that you own and control, with no restrictions
            beyond the prohibitions in Section 4.
          </li>
          <li>
            <span className="text-foreground font-medium">Authorized third-party systems:</span>{' '}
            You may conduct security testing on third-party systems only if you have documented,
            explicit written authorization from the system owner. We may request proof of authorization.
          </li>
          <li>
            <span className="text-foreground font-medium">WSLATL infrastructure:</span> Testing
            against WSLATL infrastructure itself (our panels, networks, or other clients&apos; servers)
            is prohibited without our prior written authorization, regardless of intent.
          </li>
        </ul>
        <p className="mt-4">
          CTF (Capture the Flag) competition infrastructure and deliberate honeypots are permitted
          with prior notice to our team.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Reporting Abuse">
        <p>
          If you believe WSLATL infrastructure is being used for abusive, illegal, or harmful
          activity, please report it to us immediately. We take all abuse reports seriously and
          investigate them promptly.
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-2 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">Report abuse to:</p>
          <p>
            Email:{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
              {siteConfig.email.support}
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
          Please include as much detail as possible in your report: IP addresses involved,
          timestamps (with timezone), log excerpts, URLs, and a description of the abusive activity.
          The more detail you provide, the faster we can investigate and respond.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Enforcement">
        <p>
          WSLATL reserves the right to take any action we deem appropriate in response to AUP
          violations. Enforcement is proportional to severity but we always prioritize protecting
          our network and other clients.
        </p>

        <div className="overflow-x-auto mt-4">
          <table className="legal-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Examples</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Minor</td>
                <td>First-time resource overage, minor ToS deviation</td>
                <td>Warning + required remediation within specified timeframe</td>
              </tr>
              <tr>
                <td className="font-medium text-yellow-400">Moderate</td>
                <td>Spam, unauthorized scanning, repeat minor violations</td>
                <td>Immediate suspension pending investigation; reinstatement possible with remediation</td>
              </tr>
              <tr>
                <td className="font-medium text-red-400">Severe</td>
                <td>DDoS attacks, malware hosting, CSAM, illegal activity</td>
                <td>Immediate termination, no refund, data preserved for law enforcement, referral to authorities</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-5">WSLATL reserves the right to:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Suspend services immediately and without prior notice when there is an active, ongoing threat to our network or third parties</li>
          <li>Cooperate fully and proactively with law enforcement investigations</li>
          <li>Share abuse reports, logs, and identifying information with relevant authorities and abuse registries (AbuseIPDB, SpamCop, etc.)</li>
          <li>Terminate accounts of repeat offenders with no right to refund</li>
          <li>Pursue civil or criminal legal remedies against clients who cause significant harm</li>
        </ul>

        <p className="mt-4 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-200 text-sm">
          <span className="font-semibold text-yellow-300">Note on network abuse:</span> If your server is the
          source of outbound abuse traffic (DDoS, spam, scanning), we will suspend the service first
          and investigate second. This is to protect other clients and the broader internet. We will
          reach out to you promptly after suspension to discuss findings.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Changes to This Policy">
        <p>
          We may update this Acceptable Use Policy from time to time to address new threats,
          services, or legal requirements. When we make material changes, we will:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>Update the effective date at the top of this page</li>
          <li>Notify active clients via email with a summary of what changed</li>
          <li>Post the updated AUP at {siteConfig.paths.acceptableUse}</li>
        </ul>
        <p className="mt-4">
          Your continued use of WSLATL services after the effective date of any changes constitutes
          acceptance of the updated policy.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contact">
        <p>
          Questions about this Acceptable Use Policy or whether a specific use case is permitted
          should be directed to us before you start, not after.
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-1.5 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">WSLATL LLC</p>
          <p>Missouri, United States</p>
          <p>
            Email:{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">{siteConfig.email.support}</a>
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
