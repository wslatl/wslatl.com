import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function BackupsContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Diese Backup-Richtlinie erklärt, welche Backups WSLATL LLC (&bdquo;WSLATL&ldquo;,
          &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder &bdquo;uns&ldquo;) erstellt, was diese
          Backups sind und was nicht, wer für Ihre Daten verantwortlich ist und wie Sie eine
          Wiederherstellung anfordern.
        </p>
        <p>
          Sie ist durch Verweis in unsere{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          einbezogen und sollte zusammen mit Abschnitt 2 (Beschreibung der Services), Abschnitt
          9.3 (Wirkung der Kündigung) und Abschnitt 11 (Haftungsbeschränkung) gelesen werden.
        </p>
        <p>
          Diese Richtlinie besteht als eigenes Dokument und nicht als Klausel in den
          Nutzungsbedingungen, und zwar aus einem praktischen Grund: Was in welchem Tarif
          enthalten ist, ändert sich mit unseren Tarifen, und eine Tarifänderung sollte keine
          Überarbeitung der Nutzungsbedingungen und die damit verbundene Ankündigungsfrist
          erfordern. Die Verteilung der Verantwortung weiter unten ändert sich dadurch nicht;
          nur die Tarifdetails ändern sich.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Die Kurzfassung">
        <Callout tone="critical" title="Behalten Sie eigene Backups">
          Jedes Backup, das wir bereitstellen, ist eine Annehmlichkeit, keine Garantie. Es
          erfolgt nach bestem Bemühen und ersetzt nicht Ihre eigenen unabhängigen Kopien Ihrer
          Daten. Wenn Ihnen Ihre Daten wichtig sind, müssen Sie eigene Backups vorhalten,
          gespeichert an einem anderen Ort als dem Service, von dem sie stammen. Verlassen Sie
          sich nicht auf uns als Ihre einzige Kopie.
        </Callout>
        <p>
          Wir erstellen Backups, weil sie nützlich sind und weil sie uns helfen, Ihnen zu
          helfen. Wir nehmen sie ernst. Aber Backups können fehlschlagen, unvollständig sein,
          beschädigt sein und genau in dem Moment nicht verfügbar sein, in dem Sie sie am
          dringendsten brauchen. Jeder Hosting-Anbieter, der Ihnen etwas anderes erzählt,
          verspricht zu viel. Der Rest dieser Seite legt ehrlich dar, was Sie bekommen.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Was enthalten ist">
        <p>
          Was gesichert wird, wie oft ein Backup erstellt wird und wie lange es aufbewahrt wird,
          hängt vom Service und vom Tarif ab. Die Tabelle unten fasst zusammen, was je Dienst
          enthalten ist. Die genauen Aufbewahrungsfristen für Ihren konkreten Service werden in
          Ihrem Abrechnungsportal angezeigt, und Sie können sie jederzeit bei unserem Team
          bestätigen lassen.
        </p>

        <ScrollTable label="Backups nach Dienst">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Dienst</th>
                <th scope="col">Backups enthalten</th>
                <th scope="col">Was erfasst wird</th>
                <th scope="col">Häufigkeit</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Dedicated Server</td>
                <td>Nicht enthalten (selbst verwaltet)</td>
                <td>Nicht anwendbar</td>
                <td>Nicht anwendbar</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Gameserver-Hosting</td>
                <td>Enthalten</td>
                <td>Vollständiger Server-Container</td>
                <td>Monatlich</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VPS-Hosting</td>
                <td>Enthalten <span className="text-muted-foreground">(startet bald)</span></td>
                <td>Vollständiges Disk-Image</td>
                <td>Monatlich</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Webhosting</td>
                <td>Enthalten</td>
                <td>Die Website und ihr Zustand</td>
                <td>Monatlich</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>Einige Einzelheiten hinter der Tabelle:</p>
        <ul>
          <li>
            <strong>Dedicated Server.</strong> Ein Dedicated
            Server ist Ihre Maschine. Sie haben die volle Kontrolle über das Betriebssystem und
            alles darauf, und wir erstellen für Sie keine Backups davon. Backups eines Dedicated
            Servers zu erstellen und zu speichern, liegt in Ihrer Verantwortung. Über eine
            verwaltete Backup-Lösung sprechen wir auf Anfrage gern.
          </li>
          <li>
            <strong>Gameserver-Hosting.</strong> Wir erstellen im
            monatlichen Zyklus ein Backup des vollständigen Gameserver-Containers.
          </li>
          <li>
            <strong>VPS-Hosting.</strong> VPS-Hosting startet
            bald. Wenn es live geht, erstellen wir monatlich ein Backup des vollständigen
            Disk-Images jedes VPS. Bis dahin beschreibt diese Zeile, was geplant ist, und nicht
            etwas, das bereits läuft.
          </li>
          <li>
            <strong>Webhosting.</strong> Wir erstellen monatlich
            ein Backup der Website selbst und ihres aktuellen Zustands (ihrer Dateien und
            Daten), nicht des gesamten Hosting-Kontos darum herum.
          </li>
        </ul>
        <p>
          Wo ein Backup als monatlich beschrieben wird, erfolgt es in einem ungefähr monatlichen
          Zyklus, nicht an einem garantierten Kalenderdatum. Wie in Abschnitt 4 dargelegt,
          erfolgt jedes Backup, das wir erstellen, nach bestem Bemühen und ersetzt nicht die
          unabhängigen Kopien, die Sie selbst aufbewahren.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Backups erfolgen nach bestem Bemühen">
        <p>
          Wo Backups in Ihrem Service enthalten sind, stellen wir sie nach bestem Bemühen
          bereit. Wir gewährleisten nicht, dass:
        </p>
        <ul>
          <li>für einen bestimmten Service zu einem bestimmten Zeitpunkt ein Backup existiert</li>
          <li>ein erstelltes Backup vollständig, unbeschädigt oder wiederherstellbar ist</li>
          <li>eine Wiederherstellung gelingt oder innerhalb eines bestimmten Zeitrahmens gelingt</li>
          <li>aus einem Backup wiedergewonnene Daten auf dem Stand eines bestimmten Zeitpunkts sind</li>
          <li>ein Backup den Verlust der zugrunde liegenden Infrastruktur übersteht</li>
        </ul>
        <p>
          Das steht im Einklang mit den Haftungsausschlüssen in Abschnitt 10 und der
          Haftungsbeschränkung in Abschnitt 11 unserer Nutzungsbedingungen. Nichts in dieser
          Richtlinie begründet eine Gewährleistung, die jene Abschnitte ausschließen.
        </p>

        <LegalSubSection title="4.1 Wogegen Backups nicht schützen">
          <p>
            Ein Backup ist eine Kopie Ihrer Daten zu einem bestimmten Zeitpunkt. Es schützt Sie
            nicht vor allem, und insbesondere schützt es nicht vor:
          </p>
          <ul>
            <li>
              Schäden, die selbst mitgesichert werden, etwa eine beschädigte Datenbank oder ein
              fehlerhaftes Deployment, das erfasst wurde, bevor Sie das Problem bemerkt haben
            </li>
            <li>
              Löschungen, die zwischen zwei Backups fallen, also jeder Arbeit seit dem letzten
              Backup-Lauf
            </li>
            <li>
              dem Verlust eines gekündigten Service, bei dem die Daten bereits nach Abschnitt
              9.3 der Nutzungsbedingungen entfernt wurden
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Ihre Verantwortung">
        <p>
          Sie sind für die Daten verantwortlich, die Sie auf unserer Infrastruktur speichern. Im
          Einzelnen stimmen Sie zu:
        </p>
        <ul>
          <li>
            <strong>Sie führen eigene Backups.</strong>{' '}
            Sie sind dafür verantwortlich, aktuelle, unabhängige Kopien aller Daten
            aufzubewahren, deren Verlust Sie sich nicht leisten können, und zwar außerhalb des
            WSLATL Service, von dem sie stammen.
          </li>
          <li>
            <strong>Sie prüfen, dass Ihre Backups funktionieren.</strong>{' '}
            Ein Backup, aus dem Sie noch nie wiederhergestellt haben, ist eine Vermutung, kein
            Backup. Testen Sie Ihre.
          </li>
          <li>
            <strong>Sie erstellen eine Kopie vor riskanten Änderungen.</strong>{' '}
            Vor einer Neuinstallation des Betriebssystems, einem Tarifwechsel, einer Migration,
            einer Kündigung oder einem anderen Vorgang, der Daten zerstören kann, erstellen Sie
            zuerst Ihre eigene Kopie. Wir werden eine zerstörerische Aktion, um die Sie gebeten
            haben, nicht rückgängig machen können.
          </li>
          <li>
            <strong>Sie exportieren, bevor Sie gehen.</strong> Wenn
            Sie einen Service kündigen oder auslaufen lassen, exportieren Sie Ihre Daten, bevor
            die Kündigung wirksam wird. Die Aufbewahrung nach der Kündigung ist begrenzt und in
            Abschnitt 9.3 der Nutzungsbedingungen beschrieben.
          </li>
          <li>
            <strong>Sie halten die Daten Ihrer eigenen Nutzer sicher.</strong>{' '}
            Wenn andere Menschen sich auf den Service verlassen, den Sie auf unserer
            Infrastruktur betreiben, liegen deren Backup-Erwartungen in Ihrer Verantwortung,
            nicht in unserer.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Eine Wiederherstellung anfordern">
        <p>
          Um eine Wiederherstellung anzufordern, öffnen Sie ein Ticket im Abrechnungsportal
          unter{' '}
          <ShortLink name="billing" />{' '}
          oder schreiben Sie an{' '}
          <Email name="support" />. Teilen Sie uns mit:
        </p>
        <ul>
          <li>Den Service, für den die Wiederherstellung gilt</li>
          <li>Was verloren gegangen ist und, so genau Sie können, wann es verloren ging</li>
          <li>Den Zeitpunkt, auf den Sie wiederherstellen möchten</li>
          <li>Ob Sie eine vollständige Wiederherstellung über den laufenden Service hinweg möchten oder eine Kopie daneben</li>
        </ul>

        <LegalSubSection title="6.1 Wie wir Wiederherstellungsanfragen bearbeiten">
          <p>
            Wir sagen Ihnen, welche Backups wir für den Service tatsächlich vorhalten und was
            eine Wiederherstellung daraus bedeuten würde, bevor wir irgendetwas tun. Wo ein
            Backup existiert und eine Wiederherstellung möglich ist, führen wir sie durch oder
            stellen Ihnen die Daten bereit.
          </p>
          <p>
            Eine Wiederherstellung ist ihrer Natur nach zerstörerisch. Eine Wiederherstellung
            über einen laufenden Service hinweg ersetzt dessen aktuellen Zustand, einschließlich
            allem, was seit der Erstellung des Backups entstanden ist. Wir beginnen keine
            Wiederherstellung, die Live-Daten überschreibt, ohne Ihre ausdrückliche Bestätigung
            des Wiederherstellungspunkts.
          </p>
          <p>
            Wir sagen keine Bearbeitungszeit für eine Wiederherstellung zu. Wie lange eine
            Wiederherstellung dauert, hängt vollständig von der Datenmenge, vom Servicetyp und
            davon ab, wo das Backup liegt. Wir geben Ihnen eine Schätzung, wenn wir bestätigen,
            was verfügbar ist, und wir priorisieren Wiederherstellungen gegenüber Routinearbeit.
          </p>
        </LegalSubSection>

        <LegalSubSection title="6.2 Wann eine Wiederherstellung kostenpflichtig ist">
          <p>
            Manche Wiederherstellungen sind eine kostenpflichtige Leistung und keine enthaltene.
            Ob eine Wiederherstellung kostenpflichtig ist und zu welchem Preis, hängt von Ihrem
            Tarif und von der Art der Anfrage ab. Wir nennen Ihnen die Kosten, bevor wir
            kostenpflichtige Arbeiten ausführen, und Sie können sie ablehnen.
          </p>
          <p>
            Wo eine Wiederherstellung als kostenpflichtige Zusatzleistung ausgeführt wurde, ist
            sie eine verbrauchte Leistung und nicht erstattungsfähig, wie in Abschnitt 5 unserer{' '}
            <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link> dargelegt.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Backups und Kündigung">
        <p>
          Backups sind Teil Ihres Service und werden nicht getrennt davon vorgehalten. Wenn ein
          Service gekündigt wird, gelten für seine Backups dieselben Aufbewahrungs- und
          Löschregeln wie für den Service selbst, beschrieben in Abschnitt 9.3 unserer
          Nutzungsbedingungen. Ist dieser Zeitraum abgelaufen, sind die Daten weg und wir können
          sie unabhängig vom Grund der Anfrage nicht für Sie wiederherstellen.
        </p>
        <p>
          Wenn Sie Daten aus einem gekündigten Service brauchen, fragen Sie sofort. Gehen Sie
          nicht davon aus, dass sie nächste Woche noch da sind.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Sicherheit der Backups">
        <p>
          Backups enthalten Ihre Daten und sind mit denselben Maßnahmen geschützt, die in
          Abschnitt 6 unserer{' '}
          <Link href={siteConfig.paths.privacy}>Datenschutzerklärung</Link>{' '}
          beschrieben sind, einschließlich Zugriffskontrollen, die begrenzen, welche Mitglieder
          unseres Teams sie erreichen können. Wo ein Backup auf Infrastruktur liegt, die von
          einem Partner betrieben wird, gelten die auf unserer Seite{' '}
          <Link href={siteConfig.paths.subprocessors}>Unterauftragsverarbeiter</Link>{' '}
          aufgeführten Empfänger auch für diese Kopie.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese Backup-Richtlinie aktualisieren, um Änderungen unserer Infrastruktur
          oder unserer Tarife abzubilden. Bei wesentlichen Änderungen aktualisieren wir das
          Datum des Inkrafttretens oben auf dieser Seite und veröffentlichen die aktualisierte
          Richtlinie unter{' '}
          <Link href={siteConfig.paths.backups}>
            {siteConfig.siteUrl}{siteConfig.paths.backups}
          </Link>. Änderungen, die den Umfang eines Service verringern, den Sie bereits halten,
          kündigen wir vor ihrem Wirksamwerden per E-Mail an.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Kontakt">
        <p>
          Wiederherstellungsanfragen und Fragen zu Backups sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
