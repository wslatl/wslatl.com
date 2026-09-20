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
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Diese Erstattungsrichtlinie regelt alle Erstattungsanfragen für Services, die von
          WSLATL LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) erbracht werden. Sie gilt für Dedicated Server,
          Gameserver-Hosting, VPS-Hosting und Webhosting.
        </p>
        <p>
          Diese Richtlinie ist durch Verweis in unsere{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link> einbezogen und Teil
          davon. Die nachstehenden Regeln sind die maßgebliche Quelle für
          Erstattungsberechtigung, Fristen und Abwicklung. Im Fall eines Widerspruchs zwischen
          dieser Erstattungsrichtlinie und einem anderen WSLATL Dokument ist diese
          Erstattungsrichtlinie maßgeblich.
        </p>
        <p>
          Wir sind ein kleines, privates Hosting-Unternehmen. Diese Richtlinie gibt es, um fair
          zu sein, nicht um zu streiten. Wir behandeln Erstattungsanfragen immer ehrlich und
          nach Treu und Glauben. Wenn etwas unten nicht abgedeckt ist, wenden Sie sich an uns
          und wir klären das direkt mit Ihnen.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Erstattungsfristen">
        <p>
          Wir arbeiten mit einer zweistufigen Erstattungsfrist, gemessen ab dem Datum Ihres
          ursprünglichen Kaufs des Service. Beide Stufen sind unten zusammengefasst:
        </p>

        <ScrollTable label="Erstattungsfristen">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Frist</th>
                <th scope="col">Anspruchsvoraussetzung</th>
                <th scope="col">Erstattungsbetrag</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">0 bis 48 Stunden</td>
                <td>Jeder Grund, auch eine Meinungsänderung. Ohne Nachfragen.</td>
                <td>Volle Erstattung</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">49 Stunden bis 14 Tage</td>
                <td>Einzelfallprüfung. Es gelten nur die in Abschnitt 3 aufgeführten anerkannten Gründe.</td>
                <td>Volle Erstattung für berechtigte Services</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Nach 14 Tagen</td>
                <td>Keine Erstattungen.</td>
                <td>Keine</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>
          Das <strong>ursprüngliche Kaufdatum</strong> ist das Datum,
          an dem der Service erstmals für Sie aktiviert und bereitgestellt wurde, nicht das
          Datum einer späteren Verlängerung. Verlängerungen setzen ihre eigene 14-Tage-Frist
          neu in Gang (siehe Abschnitt 9).
        </p>

        <LegalSubSection title="2.1 48-Stunden-Frist, jeder Grund">
          <p>
            Wenn Sie innerhalb von{' '}
            <strong>48 Stunden</strong> nach dem ursprünglichen
            Kaufdatum eines Service eine Erstattung beantragen, erstatten wir den vollen Betrag.
            Das ist die Frist für eine Meinungsänderung. Wir verlangen keinen Grund und wir
            bitten Sie nicht, Ihre Entscheidung zu begründen.
          </p>
          <p>
            Die in Abschnitt 5 (Nicht erstattungsfähige Posten) aufgeführten Posten sind auch
            innerhalb der 48-Stunden-Frist ausgeschlossen. Insbesondere sind Dedicated Server
            unter keinen Umständen erstattungsfähig (siehe Abschnitt 5.1).
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 14-Tage-Frist, Einzelfallprüfung">
          <p>
            Zwischen <strong>49 Stunden und 14 Kalendertagen</strong>{' '}
            nach dem ursprünglichen Kaufdatum werden volle Erstattungen nur für die in Abschnitt
            3 aufgeführten anerkannten Gründe gewährt. Erstattungsanfragen außerhalb dieser
            Gründe sind in dieser Frist nicht berechtigt.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Anerkannte Gründe (14-Tage-Frist)">
        <p>
          Die folgenden Gründe berechtigen während der 14-tägigen Frist zur Einzelfallprüfung zu
          einer vollen Erstattung. Wir können Sie bitten, Belege beizubringen (Zeitstempel,
          Fehlermeldungen, Ticketverlauf usw.), um den Grund zu überprüfen.
        </p>

        <LegalSubSection title="3.1 Ausfall über das SLA hinaus">
          <p>
            Wenn Ihr Service einen Ausfall erleidet, der das jeweils geltende Uptime-Ziel in
            unserem{' '}
            <Link href={siteConfig.paths.sla}>Service Level Agreement</Link>{' '}
            überschreitet ({uptimeTarget('vps')} für VPS- und Webhosting, {uptimeTarget('game')} für Gameserver-Hosting), können Sie für den betroffenen Service eine
            volle Erstattung beantragen. Ausfälle, die durch Ereignisse außerhalb unseres
            zumutbaren Einflussbereichs verursacht werden (höhere Gewalt), sind nicht anerkannt.
          </p>
          <p>
            Um anerkannt zu werden, muss der Ausfall über unsere Statusseite, unsere
            Monitoringsysteme oder Ihre eigenen dokumentierten Nachweise überprüfbar sein. Die
            im Service Level Agreement beschriebene SLA-Gutschrift von 10% bleibt als
            gesonderter Rechtsbehelf verfügbar; dieses Erstattungsrecht besteht zusätzlich dazu
            und nicht an seiner Stelle.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Abrechnungsfehler">
          <p>
            Wenn Ihnen ein falscher Betrag berechnet wurde, Sie doppelt abgerechnet wurden oder
            Ihnen ein Service berechnet wurde, den Sie nicht beauftragt haben, haben Sie
            Anspruch auf eine volle Erstattung der fehlerhaften Belastung. Das gilt unabhängig
            davon, in welcher Frist der Fehler entdeckt wird. Bitte melden Sie vermutete
            Abrechnungsfehler, sobald Sie sie bemerken.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Der Service hat nicht funktioniert">
          <p>
            Wenn der von Ihnen gekaufte Service nie funktioniert hat oder einen kritischen
            Mangel hatte, den wir nicht beheben konnten, können Sie Anspruch auf eine volle
            Erstattung haben.
          </p>
          <p>
            <strong>Sie müssen uns zuerst kontaktiert haben.</strong>{' '}
            Um nach diesem Abschnitt anerkannt zu werden, müssen Sie sich in angemessener Weise
            bemüht haben, uns wegen des Problems zu erreichen, bevor Sie eine Erstattung
            beantragen. Zulässige Kontaktkanäle sind:
          </p>
          <ul>
            <li>Ein Supportticket, das in unserem Abrechnungsportal eröffnet wurde</li>
            <li>Eine E-Mail an <Email name="support" /></li>
            <li>Eine Nachricht in unserem Discord-Server oder eine Direktnachricht an unser Team</li>
          </ul>
          <p>
            Wir müssen einen Nachweis der Kontaktaufnahme sehen (eine Ticketnummer, einen
            E-Mail-Verlauf oder ein Nachrichtenprotokoll), um zu bestätigen, dass wir die
            Gelegenheit hatten, das Problem zu diagnostizieren und zu beheben.
            Erstattungsanfragen auf dieser Grundlage ohne vorherigen Kontaktversuch werden
            abgelehnt.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Meinungsänderung">
        <p>
          Eine Meinungsänderung ist nur innerhalb der in Abschnitt 2.1 beschriebenen
          48-Stunden-Frist ein anerkannter Grund. Nach Ablauf von 48 Stunden ab dem
          ursprünglichen Kaufdatum ist eine Meinungsänderung nach dieser Richtlinie kein
          berechtigter Grund für eine Erstattung.
        </p>
        <p>
          Wenn Sie unsicher sind, ob ein Service der richtige für Sie ist, empfehlen wir
          dringend, sich vor dem Kauf auf Discord an uns zu wenden. Wir beantworten gern
          technische Fragen und helfen Ihnen, den richtigen Tarif zu wählen. Auch die Aufnahme
          nur auf Bewerbung ist eine gute Gelegenheit, Fragen zu stellen und die Passung zu
          bestätigen.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Nicht erstattungsfähige Posten">
        <p>
          Das Folgende ist <strong>nicht erstattungsfähig</strong>,
          unter keinen Umständen. Diese Liste gilt sowohl für die 48-Stunden- als auch für die
          14-Tage-Frist.
        </p>

        <Callout tone="critical" title="5.1 Dedicated Server">
          Dedicated Server sind zu keiner Zeit und aus keinem Grund für Erstattungen jeglicher
          Art berechtigt. Hardwarebeschaffung, IP-Zuweisungen, Rackplatz im Rechenzentrum und
          Bandbreitenzusagen erfolgen in der Annahme einer langfristigen Nutzung. Dieser
          Ausschluss gilt auch innerhalb der 48-stündigen Frist für eine Meinungsänderung.
        </Callout>

        <ul>
          <li>
            <strong>Einrichtungsgebühren und individuelle Bereitstellung:</strong>{' '}
            Einmalige Einrichtungsgebühren, Installation des Betriebssystems, individuelle
            Konfigurationsarbeiten, manuelle Migrationen und ähnliche einmalige Entgelte. Diese
            decken Arbeit und Ressourcen ab, die sich nach der Ausführung nicht
            zurückgewinnen lassen.
          </li>
          <li>
            <strong>Lizenzgebühren Dritter:</strong>{' '}
            Durchgereichte Kosten, die wir vom Anbieter nicht zurückerhalten, einschließlich
            cPanel-Lizenzen, Pterodactyl-Lizenzierung und anderer Software, die wir als Teil
            eines Tarifs weiterverkaufen.
          </li>
          <li>
            <strong>Gebühren für Domainregistrierung und -verlängerung:</strong>{' '}
            Alle domainbezogenen Entgelte, die über uns anfallen. Domainregistrierungen laufen
            über einen Registrar und unterliegen dessen eigenen Erstattungsbedingungen.
          </li>
          <li>
            <strong>Bereits verbrauchte Zusatzleistungen:</strong>{' '}
            Zusätzliche IP-Adressen, Bandbreitenüberschreitungen, Wiederherstellungen aus
            Backups und alle anderen verbrauchsabhängigen oder einmaligen Entgelte für
            Zusatzleistungen, die zum Zeitpunkt der Erstattungsanfrage bereits erbracht oder
            angefallen sind.
          </li>
          <li>
            <strong>Services, die wegen Verstößen gegen die Richtlinie zur zulässigen Nutzung oder die Nutzungsbedingungen gekündigt wurden:</strong>{' '}
            Wenn Ihr Service wegen eines Verstoßes gegen unsere{' '}
            <Link href={siteConfig.paths.acceptableUse}>Richtlinie zur zulässigen Nutzung</Link>{' '}
            oder unsere Nutzungsbedingungen gesperrt oder gekündigt wurde, wird keine Erstattung
            gewährt. Das gilt auch dann, wenn die Kündigung innerhalb von 48 Stunden oder
            innerhalb der 14-Tage-Frist erfolgt ist.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Wie Sie eine Erstattung beantragen">
        <p>
          Um eine Erstattung zu beantragen, wenden Sie sich über einen der folgenden Kanäle an
          uns. Das Ticket im Abrechnungsportal ist uns am liebsten, weil es uns den direktesten
          Zugang zu Ihrem Konto und Ihrer Rechnungshistorie gibt.
        </p>
        <ul>
          <li>
            <strong>Ticket im Abrechnungsportal:</strong> Melden Sie sich unter{' '}
            <ShortLink name="billing" />{' '}
            an und eröffnen Sie ein Supportticket
          </li>
          <li>
            <strong>E-Mail:</strong>{' '}
            <Email name="support" />
          </li>
          <li>
            <strong>Discord:</strong>{' '}
            <ShortLink name="discord" />
          </li>
        </ul>
        <p>
          Damit wir Ihre Anfrage schnell bearbeiten können, geben Sie bitte an:
        </p>
        <ul>
          <li>Die E-Mail-Adresse Ihres WSLATL Kontos</li>
          <li>Den Service, für den Sie eine Erstattung beantragen</li>
          <li>Die betroffene Rechnungsnummer oder die betroffenen Rechnungsnummern</li>
          <li>Den Grund für die Erstattung</li>
          <li>Alle Belege (Ticketnummern, Fehlerprotokolle, Screenshots) bei Anfragen nach Abschnitt 3</li>
        </ul>
        <p>
          Erstattungsanfragen werden in der Regel innerhalb von{' '}
          <strong>5 Werktagen</strong> nach Eingang geprüft. Wir
          antworten Ihnen mit einer Entscheidung und, bei Genehmigung, mit einer geschätzten
          Bearbeitungsdauer.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Abwicklung & Methode">
        <p>
          Eine genehmigte Erstattung erfolgt in einer von zwei Formen: zurück auf das
          ursprüngliche Zahlungsmittel oder als Guthaben. Wir sagen Ihnen bei der Genehmigung
          Ihrer Anfrage, welche Form gilt.
        </p>

        <LegalSubSection title="7.1 Erstattung auf das ursprüngliche Zahlungsmittel">
          <p>
            Wo eine Erstattung auf Ihr Zahlungsmittel zurückgeht, geht sie auf das{' '}
            <strong>ursprüngliche Zahlungsmittel</strong>, das für
            den Kauf verwendet wurde. Wir erstatten nicht auf eine andere Karte oder ein anderes
            Konto als das ursprünglich belastete.
          </p>
          <p>
            Sobald wir die Erstattung veranlasst haben, hängt die Bearbeitungsdauer von Ihrem
            Zahlungsanbieter ab:
          </p>
          <ul>
            <li>Erstattungen auf Kredit- und Debitkarten erscheinen je nach Herausgeber in der Regel innerhalb von <strong>5 bis 10 Werktagen</strong></li>
            <li>Erstattungen per Banküberweisung und ACH können bis zu 10 Werktage dauern</li>
            <li>Erstattungen über jede andere von uns akzeptierte Zahlungsplattform unterliegen der Bearbeitungsdauer dieser Plattform</li>
          </ul>
          <p>
            Wenn eine Erstattung nach 15 Werktagen nicht auf Ihrem Kontoauszug erscheint,
            wenden Sie sich an uns und wir gehen der Sache mit dem Zahlungsdienstleister nach.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.2 Erstattung als Guthaben">
          <p>
            Wir können eine Erstattung stattdessen als{' '}
            <strong>Guthaben</strong> genehmigen, das dem Saldo
            Ihres WSLATL Kontos gutgeschrieben wird. Guthaben ist auf jede WSLATL Rechnung
            anrechenbar und verfällt nicht, es ist aber{' '}
            <strong>nicht in Bargeld auszahlbar</strong> und kann
            nicht auf ein Bankkonto oder eine Karte ausgezahlt werden. Die vollständigen
            Bedingungen stehen auf unserer Seite{' '}
            <Link href={siteConfig.paths.accountCredit}>Guthaben</Link>.
          </p>
          <p>
            Guthaben ist in Situationen wie diesen das angemessene Ergebnis:
          </p>
          <ul>
            <li>Sie haben um Guthaben statt um Geld zurück gebeten, weil Sie weiterhin bei uns hosten wollen</li>
            <li>Das ursprüngliche Zahlungsmittel ist geschlossen, abgelaufen oder kann keine Rückzahlung mehr annehmen</li>
            <li>Die ursprüngliche Belastung wurde von vornherein mit Guthaben beglichen</li>
            <li>Die Belastung liegt so lange zurück, dass der Zahlungsdienstleister sie nicht mehr rückgängig macht</li>
          </ul>
          <p>
            Wo Sie Anspruch auf eine Erstattung haben und um die Rückzahlung auf Ihr
            Zahlungsmittel gebeten haben, drängen wir Ihnen kein Guthaben als Ersatz auf, nur
            weil es für uns bequemer ist. Wenn wir Guthaben vorschlagen und Sie das Geld lieber
            zurückhätten, sagen Sie es und wir besprechen das.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.3 Erstattungen werden nicht anteilig berechnet">
          <p>
            Erstattungen nach dieser Richtlinie erfolgen{' '}
            <strong>nur für ganze Abrechnungszeiträume</strong>. Wir
            berechnen keine Teilerstattung auf Grundlage der Anzahl der Tage, die Sie den
            Service vor der Erstattungsanfrage genutzt haben. Eine anerkannte Anfrage innerhalb
            einer berechtigten Frist wird für den betreffenden Zeitraum vollständig erstattet,
            und eine Anfrage außerhalb dieser Fristen wird überhaupt nicht erstattet.
          </p>
          <p>
            Das schneidet in beide Richtungen und ist so gewollt. Sie werden nicht für die Tage
            bestraft, die Sie innerhalb der Erstattungsfrist genutzt haben, und ebenso können
            Sie keinen Teilmonat zurückholen, indem Sie mitten in einem Zeitraum kündigen. Wie
            in Abschnitt 9.1 unserer{' '}
            <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
            dargelegt, wird für die verbleibenden Tage eines gekündigten Abrechnungszeitraums
            keine Erstattung gewährt, es sei denn, diese Richtlinie greift.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="8" title="Kündigung des Service bei Erstattung">
        <p>
          Wenn eine Erstattung genehmigt wird, wird der zugehörige Service als Teil des
          Erstattungsvorgangs gekündigt. Der Zugang zum Service und zu allen zugehörigen Panels
          wird entzogen, sobald die Erstattung abgewickelt ist.
        </p>
        <p>
          Nach der Kündigung gelten die Regeln zur Datenaufbewahrung in Abschnitt 9.3 unserer
          Nutzungsbedingungen. Ihre Daten können auf Anfrage für einen begrenzten Zeitraum von
          bis zu{' '}
          <strong>14 Tagen</strong> nach der Kündigung
          wiederhergestellt werden; nach diesem Zeitraum werden alle verbleibenden Daten
          dauerhaft und unwiderruflich gelöscht, in jedem Fall spätestens 90 Tage nach
          Kontoschließung. Wenn Sie versuchen möchten, Daten aus einem erstatteten Service
          wiederherzustellen, müssen Sie das innerhalb dieses 14-tägigen
          Wiederherstellungszeitraums beantragen.
        </p>
        <p>
          WSLATL haftet nicht für Datenverluste, die aus einer durch eine Erstattung
          ausgelösten Kündigung entstehen.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Verlängerungen & automatische Abrechnung">
        <p>
          Die 14-Tage-Fristen in dieser Richtlinie werden ab dem Datum des ursprünglichen Kaufs
          gemessen. Bei Services mit wiederkehrenden Abrechnungszyklen eröffnet jede
          Verlängerungszahlung eine neue 14-Tage-Frist, gemessen ab dem Datum dieser
          Verlängerung.
        </p>
        <p>
          Wenn Sie nicht möchten, dass sich ein Service verlängert, müssen Sie ihn vor dem
          Verlängerungsdatum kündigen. Wir erstatten eine automatisch verlängerte Belastung
          nicht, nur weil Sie das Kündigen vergessen haben. Wenn Sie sich jedoch innerhalb von
          14 Tagen nach einer unerwarteten Verlängerung an uns wenden, prüfen wir die Anfrage
          nach Abschnitt 3 (Anerkannte Gründe) genauso wie bei jedem anderen Kauf.
        </p>
        <p>
          Wir senden vor automatischen Verlängerungen Rechnungserinnerungen. Wenn Sie
          Verlängerungen erhalten, die Sie nicht beabsichtigt haben, wenden Sie sich sofort an
          uns unter{' '}
          <Email name="support" />{' '}
          und wir bringen das in Ordnung.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Schutz vor Missbrauch & Betrug">
        <p>
          Diese Erstattungsrichtlinie gibt es, um echte Kunden zu schützen. Um Missbrauch zu
          verhindern, behalten wir uns das Recht vor, Erstattungsanfragen abzulehnen, wenn
          Hinweise auf koordiniertes oder wiederholtes erstattungssuchendes Verhalten vorliegen,
          einschließlich, aber nicht beschränkt auf:
        </p>
        <ul>
          <li>Wiederholte Zyklen aus Anmeldung, Erstattung und erneuter Anmeldung auf denselben oder verbundenen Konten</li>
          <li>Koordinierte Erstattungsanfragen über mehrere Konten in gemeinsamem Eigentum hinweg</li>
          <li>Verwendung falscher Angaben bei der Bewerbung oder bei Erstattungsanfragen</li>
          <li>Erstattungsanfragen im Zusammenhang mit betrügerischen Zahlungsmitteln oder Chargebacks</li>
        </ul>
        <p>
          Wird eine Erstattung nach diesem Abschnitt abgelehnt, erläutern wir den Grund
          schriftlich. In Fällen bestätigten Missbrauchs kann zusätzlich das Konto gekündigt
          werden.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese Erstattungsrichtlinie von Zeit zu Zeit aktualisieren, um Änderungen
          unserer Praktiken, rechtlicher Anforderungen oder unserer Services abzubilden. Bei
          wesentlichen Änderungen werden wir:
        </p>
        <ul>
          <li>Das Feld &bdquo;Gültig ab&ldquo; oben auf dieser Seite aktualisieren</li>
          <li>Aktive Kunden per E-Mail mit einer Zusammenfassung der Änderungen benachrichtigen</li>
          <li>Die aktualisierte Richtlinie unter {siteConfig.paths.refund} veröffentlichen</li>
        </ul>
        <p>
          Erstattungsanfragen, die vor dem Inkrafttreten einer Änderung eingereicht werden,
          werden nach der zum Zeitpunkt der Anfrage geltenden Fassung der Richtlinie geprüft.
          Ihre fortgesetzte Nutzung unserer Services nach dem Inkrafttreten von Änderungen gilt
          als Ihre Annahme der aktualisierten Erstattungsrichtlinie.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Kontakt">
        <p>
          Fragen zu dieser Erstattungsrichtlinie, zum Stand einer Erstattungsanfrage oder zu
          allem anderen rund um die Abrechnung sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
