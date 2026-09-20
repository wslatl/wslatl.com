import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AcceptableUseContent() {
  return (
    <>
      <LegalSection number="1" title="Einführung & Geltungsbereich">
        <p>
          Diese Richtlinie zur zulässigen Nutzung (&bdquo;AUP&ldquo;) gilt für alle Kunden,
          Nutzer und Personen, die auf Services von WSLATL LLC zugreifen, einschließlich, aber
          nicht beschränkt auf Dedicated Server, Gameserver-Hosting, VPS-Hosting und Webhosting.
        </p>
        <p>
          Diese AUP ist in unsere{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link> einbezogen und Teil
          davon. Mit der Nutzung eines WSLATL Service stimmen Sie zu, diese Richtlinie
          einzuhalten. Verstöße können zur sofortigen Sperrung oder Kündigung Ihrer Services
          ohne Erstattung führen und möglicherweise zur Anzeige bei den Strafverfolgungsbehörden.
        </p>
        <p>
          Wir sind ein kleines, privates Hosting-Unternehmen. Unsere Infrastruktur bedient echte
          Kunden, deren Geschäfte und Projekte auf zuverlässiger Uptime beruhen. Wir schützen
          diese Infrastruktur entschieden und haben null Toleranz für Aktivitäten, die sie oder
          diese Kunden gefährden.
        </p>

        <Tiers title="Altersanforderungen">
          <Tier tone="critical" title="Unter 13: gesperrt">
            Personen unter 13 Jahren dürfen keinen WSLATL Service nutzen. Konten, bei denen sich
            herausstellt, dass sie Nutzern unter 13 Jahren gehören, werden sofort dauerhaft
            gesperrt und alle Daten werden gelöscht. Keine Ausnahmen.
          </Tier>
          <Tier tone="caution" title="13 bis 17 Jahre: Zustimmung eines Erwachsenen erforderlich">
            Nutzer im Alter von 13 bis 17 Jahren sind willkommen, ein Elternteil oder
            Erziehungsberechtigter muss diese Bedingungen jedoch geprüft und ihnen in ihrem
            Namen zugestimmt haben, bevor das Konto genutzt wird. Der zustimmende Erwachsene ist
            für alle Kontoaktivitäten und Entgelte verantwortlich.
          </Tier>
          <Tier tone="good" title="Ab 18: uneingeschränkt zulässig">
            Über die übliche Freigabe des Kontos hinaus keine weiteren altersbezogenen
            Anforderungen.
          </Tier>
        </Tiers>
      </LegalSection>

      <LegalSection number="2" title="Zulässige Nutzungen">
        <p>WSLATL Services werden für rechtmäßige Zwecke bereitgestellt. Zulässige Nutzungen sind unter anderem:</p>
        <ul>
          <li>Hosting von Websites, Webanwendungen, REST-APIs und statischen Inhalten</li>
          <li>Betrieb von Gameservern für den persönlichen Gebrauch oder für Communitys (im Einklang mit den Bedingungen des jeweiligen Spieleherausgebers)</li>
          <li>Entwicklungs- und Staging-Umgebungen, Code-Repositories und CI/CD-Pipelines</li>
          <li>Persönliche Projekte, Portfolios und Hobbyanwendungen</li>
          <li>Rechtmäßige kommerzielle Anwendungen und Geschäftsinfrastruktur</li>
          <li>Datenbanken, Dateispeicher und Backend-Infrastruktur</li>
          <li>VPN- oder Proxy-Dienste zum Schutz der eigenen Privatsphäre (muss bei der Anmeldung angegeben werden; der Betrieb eines öffentlichen VPN-Dienstes bedarf der vorherigen Genehmigung)</li>
          <li>Mailserver für rechtmäßige transaktionale oder persönliche E-Mails (muss bei der Anmeldung angegeben werden; Massen-E-Mails bedürfen der vorherigen schriftlichen Genehmigung)</li>
          <li>Softwaretests und Sicherheitsforschung an Systemen, die Ihnen gehören oder für deren Test Sie eine ausdrückliche schriftliche Befugnis haben</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Verbotene Inhalte">
        <p>
          Die folgenden Inhalte sind auf WSLATL Infrastruktur unter allen Umständen streng
          verboten. Ein Verstoß gegen diesen Abschnitt führt zur sofortigen Kündigung ohne
          Ankündigung und ohne Erstattung:
        </p>
        <ul>
          <li>
            <strong>Darstellungen sexuellen Kindesmissbrauchs (CSAM):</strong>{' '}
            Jeder Inhalt, der Minderjährige sexuell ausbeutet, darstellt oder gefährdet. Null
            Toleranz. Verstöße werden unverzüglich dem National Center for Missing &amp; Exploited
            Children (NCMEC) und den Strafverfolgungsbehörden gemeldet.
          </li>
          <li>
            <strong>Terrorismus & gewaltbereiter Extremismus:</strong>{' '}
            Inhalte, die Terrorismus, Massengewalt oder gewaltbereite extremistische Bewegungen
            fördern, dafür rekrutieren, sie finanzieren oder ermöglichen.
          </li>
          <li>
            <strong>Malware & Schadsoftware:</strong>{' '}
            Das Hosten, Verbreiten oder Entwickeln von Viren, Ransomware, Spyware, Trojanern,
            Keyloggern, Rootkits oder jeder anderen Software, die darauf ausgelegt ist,
            Computersysteme zu schädigen, zu stören oder sich unbefugt Zugang zu ihnen zu
            verschaffen.
          </li>
          <li>
            <strong>Phishing & Betrug:</strong>{' '}
            Seiten, Domains oder Anwendungen, die darauf ausgelegt sind, Nutzer unter
            Vorspiegelung falscher Tatsachen zur Preisgabe von Zugangsdaten, Finanzinformationen
            oder personenbezogenen Daten zu verleiten.
          </li>
          <li>
            <strong>Urheberrechtsverletzende Inhalte:</strong>{' '}
            Das Hosten oder Verbreiten von Inhalten, die Urheberrechte, Markenrechte oder andere
            geistige Eigentumsrechte einer Person oder Einrichtung verletzen.
          </li>
          <li>
            <strong>Gefälschte oder betrügerische Inhalte:</strong>{' '}
            Vorgetäuschte Shops, gefälschte Waren, Titelmühlen oder jede betrügerische
            gewerbliche Tätigkeit.
          </li>
          <li>
            <strong>Illegale Waffen & kontrollierte Substanzen:</strong>{' '}
            Inhalte, die den illegalen Verkauf, die Herstellung oder den Vertrieb von Waffen,
            kontrollierten Substanzen oder sonstiger Schmuggelware ermöglichen.
          </li>
          <li>
            <strong>Glücksspiel ohne Lizenz:</strong>{' '}
            Der Betrieb von Online-Glücksspielangeboten ohne alle erforderlichen Lizenzen und
            rechtlichen Genehmigungen.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Verbotene Aktivitäten">

        <LegalSubSection title="4.1 Netzwerkangriffe & Missbrauch der Infrastruktur">
          <p>Die folgenden Aktivitäten sind streng verboten und führen zur sofortigen Kündigung:</p>
          <ul>
            <li>
              <strong>DDoS-Angriffe:</strong> Das Durchführen,
              Ermöglichen, Starten von oder Teilnehmen an Distributed-Denial-of-Service-Angriffen
              gegen jedes Ziel, einschließlich anderer WSLATL Kunden, externer Dienste oder
              beliebiger Internetinfrastruktur. Das ist unsere am strengsten durchgesetzte Regel.
            </li>
            <li>
              <strong>Port- & Schwachstellen-Scans:</strong>{' '}
              Das Scannen, Sondieren oder Kartieren des Netzwerks oder der Dienste von Systemen,
              die Ihnen nicht gehören oder für deren Test Sie keine ausdrückliche schriftliche
              Befugnis haben
            </li>
            <li>
              <strong>Abfangen von Netzwerkverkehr:</strong>{' '}
              Man-in-the-Middle-Angriffe, ARP-Poisoning, DNS-Hijacking, SSL-Stripping oder jede
              Technik, die darauf abzielt, Netzwerkverkehr abzufangen oder zu verändern
            </li>
            <li>IP-Spoofing oder das Senden von Traffic mit gefälschten Absenderadressen</li>
            <li>Der Versuch, Schwachstellen in der WSLATL Infrastruktur oder in Services anderer Kunden auszunutzen</li>
            <li>Die Nutzung von WSLATL Infrastruktur als Ausgangs- oder Relaispunkt für Angriffe auf externe Systeme</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Spam & unerwünschte Nachrichten">
          <ul>
            <li>Das Versenden unerwünschter Massen-E-Mails (Spam) jeder Art</li>
            <li>Der Betrieb eines offenen Mail-Relays, über das Spam versendet werden kann</li>
            <li>E-Mail-Spoofing, Phishing-Kampagnen oder das Vortäuschen einer fremden Identität</li>
            <li>SMS-Spam oder jede Form unerwünschter Massennachrichten</li>
            <li>Das Auslesen, Sammeln oder Zusammenstellen von E-Mail-Adressen oder personenbezogenen Daten ohne Einwilligung</li>
            <li>Das Versenden kommerzieller Massen-E-Mails ohne CAN-SPAM-konforme Abmeldemöglichkeit</li>
          </ul>
          <p>
            Kunden, die rechtmäßige transaktionale E-Mails oder Marketing-E-Mails in größerem
            Umfang versenden müssen, haben diesen Anwendungsfall bei der Anmeldung anzugeben und
            den CAN-SPAM Act sowie alle sonstigen anwendbaren Anti-Spam-Gesetze einzuhalten.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Unbefugter Zugriff">
          <ul>
            <li>Der Versuch, auf ein Computersystem, ein Konto, eine Datenbank oder ein Netzwerk zuzugreifen, für das Sie keine Zugriffsbefugnis haben</li>
            <li>Brute-Force-Angriffe gegen jede Anmeldeschnittstelle, einschließlich SSH, RDP, Webanwendungen und APIs</li>
            <li>Credential Stuffing mit geleakten oder gestohlenen Zugangsdatensätzen</li>
            <li>Social Engineering gegen WSLATL Mitarbeiter, andere Kunden oder Dritte</li>
            <li>Die Nutzung unserer Services, um unbefugten Zugriff auf fremde Systeme zu ermöglichen</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Kryptomining">
          <ul>
            <li>Kryptowährungs- oder Blockchain-Mining jeder Art ist auf Gameserver- und Webhosting-Tarifen <strong>standardmäßig verboten</strong></li>
            <li>Mining auf VPS- oder Dedicated-Server-Tarifen bedarf vor Aufnahme des Betriebs der vorherigen <strong>schriftlichen Genehmigung</strong> durch WSLATL</li>
            <li>Genehmigte Mining-Vorgänge dürfen den Stromverbrauch des Rechenzentrums, die Kühlsysteme oder geteilte Infrastruktur nicht beeinträchtigen</li>
            <li>Wir behalten uns das Recht vor, eine Mining-Genehmigung jederzeit zu widerrufen, wenn sie unsere Infrastruktur oder andere Kunden beeinträchtigt</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.5 Illegale Aktivitäten">
          <ul>
            <li>Die Nutzung von WSLATL Infrastruktur für jede Tätigkeit, die gegen anwendbares lokales, bundesstaatliches, föderales oder internationales Recht verstößt</li>
            <li>Die Ermöglichung von Betrug, Geldwäsche, Überweisungsbetrug oder Finanzkriminalität</li>
            <li>Der Betrieb illegaler Marktplätze oder von Darknet-Diensten</li>
            <li>Die Umgehung rechtmäßiger gerichtlicher Anordnungen oder die Behinderung der Strafverfolgung</li>
            <li>Die Umgehung von Sanktionen oder Tätigkeiten, die nach anwendbaren Exportkontrollgesetzen verboten sind</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.6 Verletzungen des Datenschutzes">
          <ul>
            <li>Das Erheben, Verarbeiten oder Speichern personenbezogener Daten ohne geeignete Rechtsgrundlage oder Einwilligung</li>
            <li>Der Betrieb von Diensten unter Verstoß gegen die DSGVO, den CCPA, den COPPA oder andere anwendbare Datenschutzgesetze</li>
            <li>Doxxing oder das Veröffentlichen privater personenbezogener Informationen über Personen ohne deren Einwilligung</li>
            <li>Stalkerware oder Überwachungssoftware, die ohne Wissen der überwachten Person arbeitet</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Richtlinien zur Ressourcennutzung">
        <p>
          Eine verantwortungsvolle Ressourcennutzung ist erforderlich, um für alle Kunden eine
          faire und stabile Umgebung zu erhalten. Es gelten die folgenden Richtlinien:
        </p>
        <ul>
          <li>
            <strong>Bandbreite:</strong> Sie dürfen Bandbreite
            bis zu dem in Ihrem Tarif enthaltenen Kontingent nutzen. Überschreitungen werden zu
            den in Ihrem Abrechnungsportal aufgeführten Sätzen abgerechnet. Tarife mit
            unbegrenzter Bandbreite unterliegen der fairen Nutzung; ein Missbrauch unbegrenzter
            Tarife kann zu Drosselung oder zu einem erforderlichen Upgrade führen.
          </li>
          <li>
            <strong>CPU & RAM:</strong> Der absichtliche
            Verbrauch von Ressourcen über Ihr Tarifkontingent hinaus zum Nachteil anderer Kunden
            (auf geteilter Infrastruktur) oder zur Umgehung von Tarifgrenzen ist verboten.
          </li>
          <li>
            <strong>Disk-I/O:</strong> Workloads, die
            dauerhaft hohe Disk-I/O erzeugen und geteilte Storage-Infrastruktur beeinträchtigen,
            müssen vorab mit uns besprochen werden.
          </li>
          <li>
            <strong>Ausgehende Verbindungen:</strong> Das Erzeugen
            ungewöhnlich hoher Mengen ausgehender Netzwerkverbindungen (z.&nbsp;B. Connection
            Floods) ohne vorherige Ankündigung ist verboten.
          </li>
        </ul>
        <p>
          Wenn Sie einen rechtmäßigen Anwendungsfall haben, der einen hohen Ressourcenverbrauch
          erfordert, sprechen Sie mit uns, bevor daraus ein Problem wird. Wir sind flexibel bei
          Kunden, die offen kommunizieren.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Besondere Regeln für Gameserver">
        <p>Für Kunden, die unser Gameserver-Hosting nutzen:</p>
        <ul>
          <li>Gameserver müssen Software und Konfigurationen betreiben, die den Nutzungsbedingungen und dem Endnutzer-Lizenzvertrag des jeweiligen Spieleherausgebers entsprechen</li>
          <li>Das Hosten raubkopierter Gameserver-Software, gecrackter Clients oder urheberrechtsverletzender Spielinhalte ist verboten</li>
          <li>Betreiben Sie auf Gameserver-Tarifen ohne vorherige Genehmigung keine Prozesse, die nichts mit Ihrem Gameserver zu tun haben (z.&nbsp;B. Mining, Bots, Scraping)</li>
          <li>Mods, Plugins und Serverkonfigurationen dürfen nicht dazu verwendet werden, eine der in dieser AUP aufgeführten verbotenen Aktivitäten auszuführen</li>
          <li>Unser DDoS-Schutz dient der Verteidigung Ihres Servers; versuchen Sie nicht, ihn zu umgehen, zu deaktivieren oder zu missbrauchen</li>
          <li>Das Überschreiten des Slot-Limits oder der zugewiesenen Ressourcen Ihres Tarifs erfordert ein Upgrade vor der Nutzung, nicht danach</li>
          <li>Gameserver, die dazu genutzt werden, andere Spieler zu belästigen, zu bedrohen oder zu schädigen, können bis zum Abschluss einer Untersuchung gesperrt werden</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" title="Sicherheitstests & Forschung">
        <p>
          Sicherheitsforschung und Penetrationstests sind nur unter den folgenden Bedingungen zulässig:
        </p>
        <ul>
          <li>
            <strong>Ihre eigenen Systeme:</strong> Sie dürfen
            Sicherheitstests an Servern und Diensten durchführen, die Ihnen gehören und die Sie
            kontrollieren, ohne Einschränkungen über die Verbote in Abschnitt 4 hinaus.
          </li>
          <li>
            <strong>Befugte fremde Systeme:</strong>{' '}
            Sie dürfen Sicherheitstests an fremden Systemen nur durchführen, wenn Sie eine
            dokumentierte, ausdrückliche schriftliche Befugnis des Systeminhabers haben. Wir
            können einen Nachweis dieser Befugnis verlangen.
          </li>
          <li>
            <strong>WSLATL Infrastruktur:</strong> Tests
            gegen die WSLATL Infrastruktur selbst (unsere Panels, Netzwerke oder Server anderer
            Kunden) sind ohne unsere vorherige schriftliche Befugnis verboten, unabhängig von der
            Absicht.
          </li>
        </ul>
        <p>
          Infrastruktur für CTF-Wettbewerbe (Capture the Flag) und bewusst aufgestellte Honeypots
          sind nach vorheriger Ankündigung an unser Team zulässig.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Missbrauch melden">
        <p>
          Wenn Sie glauben, dass WSLATL Infrastruktur für missbräuchliche, illegale oder
          schädliche Aktivitäten genutzt wird, melden Sie es uns bitte sofort. Wir nehmen alle
          Missbrauchsmeldungen ernst und gehen ihnen zügig nach.
        </p>
        <InfoCard title="Missbrauch melden an">
          <InfoRow label="E-Mail">
            <Email name="abuse" /> (Betreff: Abuse Report)
          </InfoRow>
          <InfoRow label="Discord">
            <ShortLink name="discord" />
          </InfoRow>
        </InfoCard>
        <p>
          Bitte geben Sie in Ihrer Meldung so viele Einzelheiten wie möglich an: beteiligte
          IP-Adressen, Zeitstempel (mit Zeitzone), Log-Auszüge, URLs und eine Beschreibung der
          missbräuchlichen Aktivität. Je mehr Einzelheiten Sie liefern, desto schneller können
          wir untersuchen und reagieren.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Durchsetzung">
        <p>
          WSLATL behält sich das Recht vor, auf Verstöße gegen die AUP mit jeder Maßnahme zu
          reagieren, die wir für angemessen halten. Die Durchsetzung ist der Schwere angemessen,
          wir priorisieren aber stets den Schutz unseres Netzwerks und der anderen Kunden.
        </p>

        <ScrollTable label="Durchsetzung nach Schwere">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Schwere</th>
                <th scope="col">Beispiele</th>
                <th scope="col">Reaktion</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Gering</td>
                <td>Erstmalige Überschreitung von Ressourcen, geringfügige Abweichung von den Nutzungsbedingungen</td>
                <td>Verwarnung und erforderliche Behebung innerhalb einer gesetzten Frist</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Mittel</td>
                <td>Spam, unbefugtes Scanning, wiederholte geringfügige Verstöße</td>
                <td>Sofortige Sperrung bis zum Abschluss der Untersuchung; Wiederherstellung nach Behebung möglich</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Schwer</td>
                <td>DDoS-Angriffe, Hosten von Malware, CSAM, illegale Aktivitäten</td>
                <td>Sofortige Kündigung, keine Erstattung, Sicherung der Daten für die Strafverfolgung, Weitergabe an die Behörden</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>WSLATL behält sich das Recht vor:</p>
        <ul>
          <li>Services sofort und ohne vorherige Ankündigung zu sperren, wenn eine aktive, laufende Bedrohung für unser Netzwerk oder für Dritte besteht</li>
          <li>Mit Ermittlungen der Strafverfolgungsbehörden umfassend und aktiv zusammenzuarbeiten</li>
          <li>Missbrauchsmeldungen, Logs und identifizierende Informationen an zuständige Behörden und Abuse-Register weiterzugeben (AbuseIPDB, SpamCop usw.)</li>
          <li>Konten von Wiederholungstätern ohne Anspruch auf Erstattung zu kündigen</li>
          <li>Zivil- oder strafrechtliche Schritte gegen Kunden zu verfolgen, die erheblichen Schaden verursachen</li>
        </ul>

        <Callout tone="caution" title="Hinweis zu Netzwerkmissbrauch">
          Wenn Ihr Server die
          Quelle ausgehenden Missbrauchsverkehrs ist (DDoS, Spam, Scanning), sperren wir den
          Service zuerst und untersuchen danach. Das schützt andere Kunden und das Internet
          insgesamt. Wir wenden uns nach der Sperrung umgehend an Sie, um die Erkenntnisse zu
          besprechen.
        </Callout>
      </LegalSection>

      <LegalSection number="10" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese Richtlinie zur zulässigen Nutzung von Zeit zu Zeit aktualisieren, um
          neuen Bedrohungen, Services oder rechtlichen Anforderungen zu begegnen. Bei
          wesentlichen Änderungen werden wir:
        </p>
        <ul>
          <li>Das Datum des Inkrafttretens oben auf dieser Seite aktualisieren</li>
          <li>Aktive Kunden per E-Mail mit einer Zusammenfassung der Änderungen benachrichtigen</li>
          <li>Die aktualisierte AUP unter {siteConfig.paths.acceptableUse} veröffentlichen</li>
        </ul>
        <p>
          Ihre fortgesetzte Nutzung der WSLATL Services nach dem Inkrafttreten von Änderungen
          gilt als Annahme der aktualisierten Richtlinie.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Kontakt">
        <p>
          Fragen zu dieser Richtlinie zur zulässigen Nutzung oder dazu, ob ein bestimmter
          Anwendungsfall zulässig ist, richten Sie bitte an uns, bevor Sie anfangen, nicht
          danach.
        </p>
        <CompanyContact>
          <InfoRow label="E-Mail">
            <Email name="support" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
