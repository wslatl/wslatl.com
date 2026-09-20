import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function TermsContent() {
  return (
    <>
      <LegalSection number="1" title="Annahme der Bedingungen">
        <p>
          Indem Sie sich für einen Service von WSLATL LLC (&bdquo;WSLATL&ldquo;,
          &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder &bdquo;uns&ldquo;) bewerben, sich dafür
          registrieren, darauf zugreifen oder ihn nutzen, bestätigen Sie
          (&bdquo;Kunde&ldquo;, &bdquo;Sie&ldquo; oder &bdquo;Ihr&ldquo;), dass:
        </p>
        <ul>
          <li>
            Sie unsere Altersanforderungen erfüllen: Sie sind entweder (a) 18 Jahre alt oder
            älter oder (b) zwischen 13 und 17 Jahre alt und haben die ausdrückliche Zustimmung
            eines Elternteils oder Erziehungsberechtigten eingeholt, der diese Bedingungen in
            Ihrem Namen geprüft hat und ihnen zustimmt. Personen unter 13 Jahren ist die Nutzung
            jedes WSLATL Service streng untersagt und sie werden bei Entdeckung dauerhaft
            gesperrt.
          </li>
          <li>Sie über die volle Rechtsmacht verfügen, eine bindende Vereinbarung einzugehen</li>
          <li>Sie diese Nutzungsbedingungen, unsere Datenschutzerklärung und unsere Richtlinie zur zulässigen Nutzung gelesen und verstanden haben und sich daran binden</li>
          <li>Sie, falls Sie im Namen eines Unternehmens oder einer anderen juristischen Person annehmen, befugt sind, diese Person an diese Bedingungen zu binden</li>
        </ul>
        <p>
          Wenn Sie diesen Bedingungen nicht zustimmen, nutzen Sie unsere Services nicht. Diese
          Bedingungen bilden zusammen mit unserer Datenschutzerklärung und unserer Richtlinie
          zur zulässigen Nutzung die vollständige Vereinbarung zwischen Ihnen und WSLATL LLC.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Beschreibung der Services">
        <p>
          WSLATL LLC bietet privates Hosting nur auf Bewerbung für freigegebene Kunden an. Zu
          unseren Services gehören unter anderem:
        </p>
        <ul>
          <li><strong>Dedicated Server:</strong> Physische Serverhardware, die ausschließlich für einen einzelnen Kunden bereitgestellt wird, verfügbar als Managed oder Unmanaged</li>
          <li><strong>Gameserver-Hosting:</strong> Gameserver, die über das Pterodactyl-Panel verwaltet werden und Titel wie Minecraft, Rust, CS2, ARK, Valheim, FiveM und weitere unterstützen</li>
          <li><strong>VPS-Hosting:</strong> Isolierte virtuelle private Server mit vollem root-Zugriff und dem Betriebssystem Ihrer Wahl</li>
          <li><strong>Webhosting:</strong> Managed Hosting für Websites und Webanwendungen einschließlich SSL, Backups und Support</li>
        </ul>
        <p>
          Services stehen nach Verfügbarkeit zur Verfügung und können nach unserem Ermessen mit
          angemessener Ankündigung an betroffene Kunden geändert, erweitert oder eingestellt
          werden.
        </p>

        <LegalSubSection title="2.1 Backups & Verantwortung für Ihre Daten">
          <p>
            Wo ein Service Backups umfasst, werden diese Backups{' '}
            <strong>nach bestem Bemühen</strong> bereitgestellt
            und sind eine Annehmlichkeit, keine Garantie. Wir gewährleisten nicht, dass für
            einen bestimmten Service zu einem bestimmten Zeitpunkt ein Backup existiert, dass
            ein Backup vollständig oder wiederherstellbar ist oder dass eine Wiederherstellung
            gelingt.
          </p>
          <p>
            <strong>
              Sie sind dafür verantwortlich, eigene unabhängige Backups vorzuhalten
            </strong>{' '}
            von allen Daten, deren Verlust Sie sich nicht leisten können, gespeichert an einem
            anderen Ort als dem WSLATL Service, von dem sie stammen. Jedes Backup, das wir
            bereitstellen, ersetzt nicht Ihre eigenen Kopien. Diese Verteilung der Verantwortung
            ist ein wesentlicher Bestandteil der Preisgestaltung unserer Services und ist
            zusammen mit Abschnitt 10 (Gewährleistungsausschluss) und Abschnitt 11
            (Haftungsbeschränkung) zu lesen.
          </p>
          <p>
            Was in welchem Tarif enthalten ist, wie Wiederherstellungen angefordert werden und
            was eine Wiederherstellung umfasst, steht in unserer{' '}
            <Link href={siteConfig.paths.backups}>Backup-Richtlinie</Link>{' '}
            unter{' '}
            <Link href={siteConfig.paths.backups}>
              {siteConfig.siteUrl}{siteConfig.paths.backups}
            </Link>, die durch Verweis in diese Bedingungen einbezogen ist.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Bewerbung & Kontoregistrierung">
        <p>
          WSLATL arbeitet als privates Hosting-Unternehmen, das nur auf Bewerbung aufnimmt. Der
          Zugang zu unseren Services erfolgt nicht automatisch und erfordert die Prüfung und
          Freigabe durch unser Team. Es gelten die folgenden Bedingungen:
        </p>
        <ul>
          <li>Sie müssen über unser Abrechnungsportal unter billing.wslatl.com eine Bewerbung einreichen und ausdrücklich freigegeben werden, bevor Services bereitgestellt werden</li>
          <li>Wir behalten uns das Recht vor, jede Bewerbung nach unserem alleinigen Ermessen abzulehnen, ohne zur Angabe eines Grundes verpflichtet zu sein</li>
          <li>Sie müssen bei der Registrierung zutreffende, aktuelle und vollständige Angaben machen und diese aktuell halten</li>
          <li>Sie sind allein dafür verantwortlich, die Sicherheit Ihrer Zugangsdaten zu wahren, einschließlich Ihres Passworts und aller API-Schlüssel</li>
          <li>Pro Person oder Unternehmen ist ein Konto zulässig, sofern wir nicht ausdrücklich schriftlich weitere Konten genehmigt haben</li>
          <li>Sie müssen uns unter <Email name="support" /> sofort benachrichtigen, wenn Sie unbefugten Zugriff auf Ihr Konto vermuten</li>
          <li>Die Weitergabe Ihrer Zugangsdaten an Dritte ist verboten, sofern sie nicht ausdrücklich schriftlich gestattet wurde</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Zahlungsbedingungen">

        <LegalSubSection title="4.1 Abrechnungszyklen">
          <p>
            Services werden im Voraus in einem Zyklus abgerechnet, den Sie bei der Anmeldung
            wählen. Die verfügbaren Abrechnungsintervalle (monatlich, vierteljährlich,
            halbjährlich oder jährlich) hängen vom Servicetyp ab. Rechnungen werden automatisch
            erstellt und vor dem Fälligkeitsdatum an Ihre registrierte E-Mail-Adresse gesendet.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Zahlungsmittel & Abwicklung">
          <p>
            Die Zahlung muss über unser Abrechnungsportal unter billing.wslatl.com erfolgen. Die
            akzeptierten Zahlungsmittel sind im Portal aufgeführt. Zahlungen werden von
            Zahlungsdienstleistern Dritter abgewickelt. Mit der Angabe von Zahlungsinformationen
            ermächtigen Sie uns, Ihr gewähltes Zahlungsmittel mit allen fälligen Entgelten zu
            belasten.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Zahlungsverzug & Sperrung des Service">
          <p>
            Services gelten als überfällig, wenn die Zahlung nicht bis zum Fälligkeitsdatum der
            Rechnung eingegangen ist. Für überfällige Konten gilt Folgendes:
          </p>
          <ul>
            <li>Services können gesperrt werden, wenn die Zahlung nicht innerhalb von <strong>7 Tagen</strong> nach dem Fälligkeitsdatum eingeht</li>
            <li>Gesperrte Services können gekündigt und Daten dauerhaft gelöscht werden, wenn die Zahlung nicht innerhalb von <strong>14 Tagen</strong> nach der Sperrung eingeht</li>
            <li>WSLATL haftet nicht für Datenverlust, Betriebsunterbrechung oder sonstige Schäden, die aus einer Sperrung oder Kündigung des Service wegen Nichtzahlung entstehen</li>
            <li>Für Services, die wegen Nichtzahlung gesperrt wurden, kann eine Reaktivierungsgebühr anfallen</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Erstattungsrichtlinie">
          <p>
            Unsere Erstattungsrichtlinie wird als eigenständiges Dokument unter{' '}
            <Link href={siteConfig.paths.refund}>{siteConfig.siteUrl}{siteConfig.paths.refund}</Link>{' '}
            geführt und ist durch Verweis in diese Bedingungen einbezogen. Die
            Erstattungsrichtlinie ist die maßgebliche Quelle für alle Fragen zu
            Erstattungsberechtigung, Fristen, anerkannten Gründen, Abwicklung und nicht
            erstattungsfähigen Posten. Die Regeln der Erstattungsrichtlinie gehen
            entgegenstehenden Formulierungen an anderer Stelle in diesen Bedingungen vor.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Preisänderungen">
          <p>
            WSLATL behält sich das Recht vor, die Preise für Services zu ändern. Wir informieren
            Sie über jede Preiserhöhung mindestens{' '}
            <strong>30 Tage im Voraus schriftlich</strong> per
            E-Mail an Ihre registrierte Adresse. Bestehende Services werden bis zum ersten
            Verlängerungsdatum nach Ablauf dieser Frist zum aktuellen Preis fortgeführt.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.6 Steuern">
          <p>
            Die Entgelte für Services verstehen sich ohne anfallende Steuern. Sie sind
            verantwortlich für die Zahlung aller Steuern, Abgaben oder staatlich auferlegten
            Gebühren, die auf Ihre Nutzung unserer Services anfallen, sofern sie nicht
            ausdrücklich in Ihrer Rechnung enthalten sind.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Service Level Agreement (SLA)">
        <p>
          Unser Service Level Agreement ist zusätzlich als eigenständiges Dokument unter{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link> veröffentlicht, wo es leichter zu finden und zu zitieren ist. Jene Seite gibt
          diesen Abschnitt wieder; sie ergänzt oder ändert ihn nicht. Die nachstehenden Zusagen
          sind dort vollständig wiedergegeben, und sollten die beiden jemals voneinander
          abweichen, ist dieser Abschnitt maßgeblich.
        </p>

        <LegalSubSection title="5.1 Uptime-Ziele">
          <UptimeTable />
          <p>
            Die Uptime wird je Kalendermonat gemessen und schließt geplante Wartungsfenster
            sowie Ausfallzeiten aus, die durch Ereignisse außerhalb unseres zumutbaren
            Einflussbereichs verursacht werden (siehe Abschnitt 15, Höhere Gewalt).
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Geplante Wartungsarbeiten">
          <p>
            Geplante Wartungsfenster kündigen wir mindestens <strong>24 Stunden im Voraus</strong> über
            unsere Statusseite (status.wslatl.com) und/oder per E-Mail an betroffene Kunden an.
            Notfallwartungen, die zum Schutz der Integrität oder Sicherheit der Services
            erforderlich sind, können ohne vorherige Ankündigung durchgeführt werden, wobei wir
            so schnell wie möglich informieren.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.3 SLA-Gutschriften">
          <p>
            Verfehlen wir das jeweils geltende Uptime-Ziel aus einem von uns zu vertretenden
            Grund, können Sie je anerkanntem Vorfall eine Servicegutschrift in Höhe von{' '}
            <strong>10% der monatlichen Kosten des betroffenen Service</strong> verlangen.
            Gutschriften werden auf Ihrem Kontostand verbucht und überschreiten nicht die Kosten
            eines vollen Monats des betroffenen Service. Servicegutschriften sind Ihr einziger
            und ausschließlicher Rechtsbehelf bei Verfehlen der Uptime-Ziele und begründen
            keinen Anspruch auf eine Barerstattung.
          </p>
          <p>
            Um eine Gutschrift zu beantragen, wenden Sie sich innerhalb von 15 Tagen nach dem
            Vorfall unter <Email name="support" /> an uns und geben Sie Datum, Dauer und Art des
            Ausfalls an.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Zulässige Nutzung">
        <p>
          Jede Nutzung der WSLATL Services unterliegt unserer Richtlinie zur zulässigen Nutzung
          (AUP), die durch Verweis in diese Bedingungen einbezogen und verfügbar ist unter{' '}
          <Link href={siteConfig.paths.acceptableUse}>{siteConfig.siteUrl}{siteConfig.paths.acceptableUse}</Link>.
          Sie stimmen zu, die AUP jederzeit einzuhalten.
        </p>
        <p>
          Verstöße gegen die AUP können zur sofortigen Sperrung oder Kündigung Ihrer Services
          ohne Ankündigung und ohne jeden Anspruch auf Erstattung führen. Schwere Verstöße
          können an die Strafverfolgungsbehörden weitergegeben werden.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Geistiges Eigentum">
        <p>
          Sämtliche von WSLATL entwickelte und bereitgestellte Software, Werkzeuge,
          Dokumentation und Materialien (mit Ausnahme von Software Dritter wie Pterodactyl, die
          ihrer eigenen Lizenz unterliegt) sind und bleiben geistiges Eigentum der WSLATL LLC.
          Sie dürfen unsere geschützten Materialien ohne unsere vorherige schriftliche
          Zustimmung nicht vervielfältigen, verbreiten, zurückentwickeln oder davon abgeleitete
          Werke erstellen.
        </p>
        <p>
          Sie behalten das vollständige Eigentum an allen Daten, Inhalten und aller Software,
          die Sie auf die WSLATL Infrastruktur hochladen oder darauf betreiben. Sie gewähren
          WSLATL eine beschränkte, nicht ausschließliche, nicht übertragbare Lizenz, Ihre
          Inhalte zu speichern, zu verarbeiten und zu übertragen, ausschließlich soweit dies zur
          Erbringung der von Ihnen beauftragten Services erforderlich ist.
        </p>
      </LegalSection>

      <LegalSection number="8" title="DMCA & Urheberrecht">
        <p>
          WSLATL LLC hält den Digital Millennium Copyright Act (DMCA), 17 U.S.C. &sect;&nbsp;512, ein.
          Unsere vollständige DMCA-Richtlinie ist veröffentlicht unter{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>{' '}
          und ist durch Verweis in diese Bedingungen einbezogen. Sie legt unseren benannten
          Vertreter, das Verfahren der Gegendarstellung, die gesetzlichen Fristen für die
          Wiederherstellung und unsere Richtlinie zu wiederholten Verstößen fest. Lesen Sie sie,
          bevor Sie uns eine Beschwerde zustellen oder einer Entfernung widersprechen.
        </p>
        <p>
          Zusammengefasst: Wenn Sie der Auffassung sind, dass Inhalte auf der WSLATL
          Infrastruktur Ihr Urheberrecht verletzen, senden Sie eine schriftliche
          DMCA-Beschwerde an:
        </p>
        <InfoCard>
          <InfoRow label="E-Mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Betreffzeile">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>
        <p>Ihre Beschwerde muss unter Strafandrohung wegen Meineids enthalten:</p>
        <ul>
          <li>Ihre Kontaktdaten (Name, Anschrift, Telefonnummer, E-Mail)</li>
          <li>Eine Beschreibung des urheberrechtlich geschützten Werks, dessen Verletzung Sie behaupten</li>
          <li>Die Bezeichnung des angeblich rechtsverletzenden Materials und seines Orts auf unserer Infrastruktur</li>
          <li>Eine Erklärung, dass Sie in gutem Glauben davon ausgehen, dass die beanstandete Nutzung nicht vom Urheberrechtsinhaber, seinem Vertreter oder vom Gesetz gestattet ist</li>
          <li>Eine Erklärung, dass die Angaben in der Beschwerde zutreffend sind, und, unter Strafandrohung wegen Meineids, dass Sie der Urheberrechtsinhaber oder befugt sind, in dessen Namen zu handeln</li>
          <li>Ihre eigenhändige oder elektronische Unterschrift</li>
        </ul>
        <p>
          Gegendarstellungen können an dieselbe E-Mail-Adresse gesendet werden und müssen die in
          Abschnitt 4 unserer{' '}
          <Link href={siteConfig.paths.dmca}>DMCA-Richtlinie</Link>{' '}
          genannten Anforderungen erfüllen. Wir behalten uns das Recht vor, die Konten von
          Kunden zu kündigen, die wiederholt Urheberrechte verletzen, im Einklang mit der
          Richtlinie zu wiederholten Verstößen in Abschnitt 5 jenes Dokuments.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Kündigung">

        <LegalSubSection title="9.1 Kündigung durch Sie">
          <p>
            Sie können Ihren Service jederzeit kündigen, indem Sie über unser Abrechnungsportal
            eine Kündigungsanfrage einreichen oder uns über Discord oder per E-Mail
            kontaktieren. Kündigungen werden zum Ende des laufenden Abrechnungszyklus wirksam,
            sofern nicht ausdrücklich eine sofortige Kündigung verlangt wird. Für die
            verbleibenden Tage eines gekündigten Abrechnungszeitraums werden keine Erstattungen
            gewährt, es sei denn, unsere Erstattungsrichtlinie greift (siehe Abschnitt 4.4).
          </p>
        </LegalSubSection>

        <LegalSubSection title="9.2 Kündigung durch WSLATL">
          <p>
            Wir können Ihre Services sofort und ohne vorherige Ankündigung sperren oder kündigen,
            wenn:
          </p>
          <ul>
            <li>Sie gegen diese Bedingungen, die Richtlinie zur zulässigen Nutzung oder unsere Datenschutzerklärung verstoßen</li>
            <li>Sie offene unbezahlte Rechnungen über die Nachfrist hinaus haben (siehe Abschnitt 4.3)</li>
            <li>Ihre Aktivitäten ein aktives Risiko für unsere Netzwerkinfrastruktur, andere Kunden oder Dritte im Internet darstellen</li>
            <li>Wir eine wirksame gerichtliche Anordnung erhalten, die eine Kündigung oder Sperrung verlangt</li>
            <li>Die fortgesetzte Erbringung der Services WSLATL LLC einer rechtlichen Haftung aussetzen würde</li>
            <li>Sie zu irgendeinem Zeitpunkt während der Laufzeit Ihres Kontos falsche oder betrügerische Angaben machen</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="9.3 Wirkung der Kündigung">
          <p>
            Mit der Kündigung Ihres Kontos:
          </p>
          <ul>
            <li>Wird der Zugang zu allen Services und Panels sofort entzogen</li>
            <li>Können Ihre Daten auf Anfrage für einen begrenzten Zeitraum von bis zu 14 Tagen nach der Kündigung wiederhergestellt werden; nach diesem Zeitraum werden alle verbleibenden Daten dauerhaft und unwiderruflich gelöscht, in jedem Fall spätestens 90 Tage nach Kontoschließung, im Einklang mit der Aufbewahrungstabelle in unserer Datenschutzerklärung</li>
            <li>Müssen alle Anfragen zur Datenwiederherstellung innerhalb des 14-tägigen Wiederherstellungszeitraums gestellt werden und stehen in unserem Ermessen</li>
            <li>Haftet WSLATL nicht für Datenverluste, die aus der Kündigung des Kontos entstehen</li>
            <li>Bleiben alle offenen Rechnungen nach der Kündigung fällig und zahlbar</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="10" title="Gewährleistungsausschluss">
        <p>
          DIE SERVICES WERDEN &bdquo;WIE BESEHEN&ldquo; UND &bdquo;WIE VERFÜGBAR&ldquo; OHNE
          JEGLICHE GEWÄHRLEISTUNG BEREITGESTELLT, WEDER AUSDRÜCKLICH NOCH STILLSCHWEIGEND.
          SOWEIT NACH ANWENDBAREM RECHT ZULÄSSIG, SCHLIESST WSLATL LLC AUSDRÜCKLICH ALLE
          GEWÄHRLEISTUNGEN AUS, EINSCHLIESSLICH, ABER NICHT BESCHRÄNKT AUF:
        </p>
        <ul className="uppercase">
          <li>Stillschweigende Gewährleistungen der Marktgängigkeit und der Eignung für einen bestimmten Zweck</li>
          <li>Gewährleistungen der Nichtverletzung von Rechten Dritter</li>
          <li>Gewährleistungen, dass die Services ununterbrochen, fehlerfrei oder frei von schädlichen Bestandteilen sind</li>
          <li>Gewährleistungen, dass Mängel innerhalb eines bestimmten Zeitrahmens behoben werden</li>
          <li>Gewährleistungen hinsichtlich der Richtigkeit oder Vollständigkeit von Inhalten</li>
        </ul>
        <p>
          Manche Rechtsordnungen lassen den Ausschluss bestimmter Gewährleistungen nicht zu. In
          diesen Rechtsordnungen gelten unsere Ausschlüsse im größtmöglichen gesetzlich
          zulässigen Umfang.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Haftungsbeschränkung">
        <p>
          SOWEIT NACH ANWENDBAREM RECHT MAXIMAL ZULÄSSIG, HAFTEN WSLATL LLC SOWIE SEINE
          GESELLSCHAFTER, GESCHÄFTSFÜHRER, LEITENDEN ANGESTELLTEN, MITARBEITER, AUFTRAGNEHMER
          UND VERTRETER NICHT FÜR:
        </p>
        <ul className="uppercase">
          <li>Mittelbare, beiläufig entstandene, besondere, Folge- oder Strafschäden</li>
          <li>Entgangenen Gewinn, entgangene Einnahmen, Datenverluste, Verlust des Geschäftswerts oder entgangene Geschäftschancen</li>
          <li>Schäden aus unbefugtem Zugriff auf Ihre Daten oder deren Veränderung</li>
          <li>Schäden daraus, dass Sie sich auf Informationen verlassen haben, die Sie über unsere Services erhalten haben</li>
          <li>Schäden durch Ereignisse außerhalb unseres zumutbaren Einflussbereichs</li>
        </ul>
        <p>
          UNSERE GESAMTE KUMULIERTE HAFTUNG IHNEN GEGENÜBER FÜR ALLE ANSPRÜCHE, DIE SICH AUS
          DIESEN BEDINGUNGEN ODER IHRER NUTZUNG UNSERER SERVICES ERGEBEN ODER DAMIT
          ZUSAMMENHÄNGEN, ÜBERSTEIGT NICHT DEN GESAMTBETRAG, DEN SIE IN DEN{' '}
          <strong>DREI (3) MONATEN</strong> UNMITTELBAR VOR DEM
          EREIGNIS, DAS DEN ANSPRUCH AUSLÖST, AN WSLATL LLC GEZAHLT HABEN.
        </p>
        <p>
          Manche Rechtsordnungen lassen bestimmte Haftungsbeschränkungen nicht zu. In diesen
          Rechtsordnungen ist unsere Haftung im größtmöglichen gesetzlich zulässigen Umfang
          beschränkt.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Freistellung">
        <p>
          Sie stellen WSLATL LLC, seine Gesellschafter, Geschäftsführer, leitenden Angestellten,
          Mitarbeiter, Auftragnehmer und Vertreter von allen Ansprüchen, Verbindlichkeiten,
          Schäden, Verlusten, Kosten und Aufwendungen (einschließlich angemessener
          Anwaltskosten) frei, verteidigen sie und halten sie schadlos, die sich ergeben aus
          oder im Zusammenhang stehen mit:
        </p>
        <ul>
          <li>Ihrer Nutzung unserer Services unter Verstoß gegen diese Bedingungen, die AUP oder anwendbares Recht</li>
          <li>Inhalten, die Sie auf der WSLATL Infrastruktur hosten, übertragen oder speichern</li>
          <li>Ihrer Verletzung von Rechten Dritter, einschließlich geistiger Eigentumsrechte</li>
          <li>Allen falschen oder betrügerischen Angaben, die Sie gegenüber WSLATL machen</li>
          <li>Jeder Streitigkeit zwischen Ihnen und einem Dritten, die aus Ihrer Nutzung unserer Services entsteht</li>
        </ul>
        <p>
          WSLATL behält sich das Recht vor, die alleinige Verteidigung und Kontrolle über jede
          Angelegenheit zu übernehmen, die Ihrer Freistellungspflicht unterliegt, auf Ihre
          Kosten, und Sie stimmen zu, bei unserer Verteidigung mitzuwirken.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Anwendbares Recht & Streitbeilegung">
        <p>
          Diese Nutzungsbedingungen unterliegen dem Recht des Bundesstaates Missouri,
          Vereinigte Staaten, und werden nach diesem ausgelegt, ohne Rücksicht auf
          kollisionsrechtliche Grundsätze.
        </p>
        <p>
          Jede Rechtsstreitigkeit, jeder Anspruch und jede Auseinandersetzung, die sich aus
          diesen Bedingungen oder Ihrer Nutzung der WSLATL Services ergeben oder damit
          zusammenhängen, werden ausschließlich vor den Gerichten des Bundesstaates Missouri
          oder den dort gelegenen Bundesgerichten beigelegt. Sie stimmen der persönlichen
          Zuständigkeit dieser Gerichte zu und verzichten auf jeden Einwand gegen den
          Gerichtsstand in Missouri.
        </p>
        <p>
          Vor der Einleitung eines förmlichen Gerichtsverfahrens vereinbaren beide Parteien, zu
          versuchen, Streitigkeiten informell beizulegen. Um eine informelle Beilegung
          einzuleiten, wenden Sie sich an uns unter <Email name="support" />{' '}
          mit einer schriftlichen Beschreibung der Streitigkeit. Ist die Streitigkeit nicht
          innerhalb von{' '}
          <strong>30 Tagen</strong> nach dieser Mitteilung
          beigelegt, kann jede Partei förmliche Rechtsbehelfe verfolgen.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Änderung der Bedingungen">
        <p>
          WSLATL behält sich das Recht vor, diese Bedingungen jederzeit zu ändern. Bei
          wesentlichen Änderungen werden wir:
        </p>
        <ul>
          <li>Mindestens <strong>14 Tage im Voraus</strong> per E-Mail an Ihre registrierte Adresse benachrichtigen</li>
          <li>Die aktualisierten Bedingungen unter {siteConfig.paths.terms} mit einem überarbeiteten Datum des Inkrafttretens veröffentlichen</li>
          <li>Die Änderungen in der Benachrichtigungs-E-Mail zusammenfassen</li>
        </ul>
        <p>
          Ihre fortgesetzte Nutzung unserer Services nach dem Inkrafttreten überarbeiteter
          Bedingungen gilt als Ihre Annahme dieser Änderungen. Wenn Sie wesentlichen Änderungen
          widersprechen, können Sie Ihren Service vor dem Inkrafttreten kündigen und nach
          unserem Ermessen eine anteilige Erstattung für einen im Voraus bezahlten Zeitraum
          erhalten.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Sonstiges">

        <LegalSubSection title="Höhere Gewalt">
          <p>
            WSLATL haftet nicht für Verzögerungen oder Ausfälle bei der Leistungserbringung, die
            auf Ursachen außerhalb unseres zumutbaren Einflussbereichs zurückgehen, darunter
            Naturkatastrophen, höhere Gewalt, behördliche Maßnahmen, Ausfälle der
            Internetinfrastruktur, von Dritten verursachte Ausfälle des Rechenzentrums,
            Arbeitskämpfe oder andere außergewöhnliche Ereignisse. Wir unternehmen angemessene
            Anstrengungen, um betroffene Kunden zu benachrichtigen und den Service so schnell
            wie möglich wiederherzustellen.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Gesamte Vereinbarung">
          <p>
            Diese Nutzungsbedingungen bilden zusammen mit unserer Datenschutzerklärung und
            unserer Richtlinie zur zulässigen Nutzung die gesamte Vereinbarung zwischen Ihnen
            und WSLATL LLC hinsichtlich Ihrer Nutzung unserer Services und ersetzen alle
            früheren Vereinbarungen, Zusicherungen oder Absprachen.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Salvatorische Klausel">
          <p>
            Sollte eine Bestimmung dieser Bedingungen von einem zuständigen Gericht für
            unwirksam, rechtswidrig oder undurchsetzbar befunden werden, wird diese Bestimmung
            in dem geringstmöglichen Umfang angepasst, der erforderlich ist, um sie durchsetzbar
            zu machen, und die übrigen Bestimmungen bleiben in vollem Umfang wirksam.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Verzicht">
          <p>
            Wenn wir ein Recht oder eine Bestimmung dieser Bedingungen in einem Einzelfall nicht
            durchsetzen, liegt darin kein Verzicht auf dieses Recht oder diese Bestimmung. Jeder
            Verzicht bedarf der Schriftform und der Unterzeichnung durch einen bevollmächtigten
            Vertreter der WSLATL LLC.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Abtretung">
          <p>
            Sie dürfen diese Bedingungen sowie Rechte oder Pflichten daraus nicht ohne unsere
            vorherige schriftliche Zustimmung abtreten oder übertragen. WSLATL darf diese
            Bedingungen ganz oder teilweise im Zusammenhang mit einer Verschmelzung, einer
            Übernahme oder dem Verkauf im Wesentlichen aller Vermögenswerte abtreten oder
            übertragen, mit Mitteilung an Sie.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="16" title="Kontakt">
        <p>
          Fragen zu diesen Nutzungsbedingungen sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
