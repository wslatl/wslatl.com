import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { CompanyContact, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function PrivacyContent() {
  return (
    <>
      <LegalSection number="1" title="Wer wir sind">
        <p>
          WSLATL LLC ist eine Limited Liability Company nach dem Recht des Bundesstaates Missouri,
          die privates Hosting anbietet, darunter Dedicated Server, Gameserver-Hosting,
          VPS-Hosting und Webhosting. Verweise auf &bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;,
          &bdquo;unser&ldquo; oder &bdquo;uns&ldquo; in dieser Richtlinie beziehen sich auf
          WSLATL LLC.
        </p>
        <p>
          Diese Datenschutzerklärung gilt für Informationen, die über unsere Website
          (wslatl.com), das Abrechnungsportal (billing.wslatl.com), die Hosting-Panels
          (panel.wslatl.com, vps.wslatl.com) sowie alle von WSLATL bereitgestellten Services und
          Mitteilungen erhoben werden. Mit der Nutzung eines unserer Services stimmen Sie den in
          dieser Richtlinie beschriebenen Praktiken zu.
        </p>

        <LegalSubSection title="1.1 Verantwortlicher und Auftragsverarbeiter">
          <p>
            Beim Hosting geht es um zwei verschiedene Arten von Daten, und unsere rechtliche
            Rolle ist bei jeder eine andere. Der Unterschied ist wichtig, deshalb sei er klar
            gesagt.
          </p>
          <ul>
            <li>
              <strong>Ihre Kontodaten.</strong> Die
              Informationen, die Sie uns geben, damit wir Ihr Konto eröffnen und führen können:
              Ihr Name, Ihre Kontaktdaten, Abrechnungsunterlagen, Supporttickets und die in
              Abschnitt 2 beschriebene Panel-Aktivität. Für diese Daten ist WSLATL der{' '}
              <strong>Verantwortliche</strong>. Wir entscheiden,
              was erhoben wird und warum, und diese Datenschutzerklärung beschreibt diese
              Entscheidung.
            </li>
            <li>
              <strong>Daten, die Sie auf Ihre eigenen Services legen.</strong>{' '}
              Alles, was Sie oder Ihre Nutzer auf einem Server speichern, den wir für Sie
              hosten: Datenbanken, Gameserver-Daten, hochgeladene Dateien, Website-Inhalte,
              Anwendungslogs. Für diese Daten ist WSLATL{' '}
              <strong>Auftragsverarbeiter</strong> und nicht der
              Verantwortliche. Wir speichern und übertragen sie, damit der Service funktioniert,
              und wir entscheiden nicht, was Sie erheben oder warum Sie es erheben.
            </li>
          </ul>
          <p>
            Wenn Sie personenbezogene Daten anderer Menschen auf einem WSLATL Service hosten,
            sind Sie deren Verantwortlicher. Die Pflichten, die mit dieser Rolle einhergehen,
            sind Ihre: eine Rechtsgrundlage für die Verarbeitung zu haben, Ihre eigenen Nutzer
            zu informieren, deren Anfragen zu ihren Rechten nachzukommen und ein eigenes
            Verzeichnis von Verarbeitungstätigkeiten zu führen. Diese Datenschutzerklärung
            erledigt nichts davon für Sie, und sie ist keine Datenschutzerklärung, auf die sich
            Ihre Nutzer stützen können.
          </p>
          <p>
            Hinsichtlich dieser Daten handeln wir auf Ihre Weisung, und wir greifen nur darauf
            zu, wo es erforderlich ist, um den Service bereitzustellen, zu erhalten oder
            abzusichern, oder wo wir gesetzlich dazu verpflichtet sind. Wenn Sie einen
            Auftragsverarbeitungsvertrag über unsere Rolle als Auftragsverarbeiter benötigen,
            wenden Sie sich an uns unter{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="2" title="Informationen, die wir erheben">
        <p>Wir erheben die folgenden Kategorien von Informationen:</p>

        <LegalSubSection title="2.1 Konto- & Registrierungsinformationen">
          <p>Wenn Sie sich für ein Konto bewerben oder eines anlegen, erheben wir:</p>
          <ul>
            <li>Vollständigen Namen</li>
            <li>E-Mail-Adresse</li>
            <li>Rechnungsadresse</li>
            <li>Telefonnummer (bei der Anmeldung erforderlich, genutzt zur Kontowiederherstellung und zur Bestätigung der Kontoinhaberschaft)</li>
            <li>Geburtsdatum (genutzt, um die Altersanforderungen in Abschnitt 9 anzuwenden)</li>
            <li>
              Steuernummer, sofern Sie eine angeben, damit wir Ihnen als Unternehmen eine
              Rechnung stellen oder eine Steuerbefreiung anwenden können
            </li>
            <li>Benutzername und Passwort des Kontos (als sicherer Hash gespeichert, wir sehen Ihr Klartextpasswort nie)</li>
            <li>
              Discord-Identität, sofern Sie Ihr Discord-Konto mit Ihrem WSLATL Konto verknüpfen.
              Die Verknüpfung gibt uns Ihre Discord-Benutzer-ID, Ihren Benutzernamen und Ihr
              Avatarbild, damit wir Sie Supportgesprächen und Rollenzugriffen in unserem Server
              zuordnen können. Die Verknüpfung ist freiwillig und kann getrennt werden.
            </li>
            <li>Alle Informationen, die Sie im Bewerbungs- oder Einrichtungsprozess freiwillig angeben</li>
          </ul>
          <p>
            Wir führen außerdem einen{' '}
            <strong>Guthabenverlauf</strong> für Ihr Konto, in dem
            jede Änderung Ihres Guthabens festgehalten wird, darunter gekaufte Aufladungen, von
            uns gewährte Gutschriften, auf Rechnungen angerechnete Beträge, gesendete oder
            erhaltene Geschenke sowie Datum, Betrag und Grund jedes Eintrags. Dieser Verlauf
            wird als Teil Ihrer Abrechnungsunterlagen aufbewahrt. Wie das Guthaben selbst
            funktioniert, steht in unseren{' '}
            <Link href={siteConfig.paths.accountCredit}>Bedingungen für Guthaben</Link>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Abrechnungs- & Zahlungsinformationen">
          <p>
            Zahlungen werden über unser Abrechnungsportal mit PCI-DSS-konformen
            Zahlungsdienstleistern Dritter abgewickelt. Wir speichern weder Ihre vollständige
            Kartennummer noch die Prüfziffer (CVV). Wir bewahren auf:
          </p>
          <ul>
            <li>Rechnungshistorie und Abrechnungsunterlagen</li>
            <li>Art des Zahlungsmittels (Kartenmarke, letzte vier Ziffern)</li>
            <li>Transaktions-IDs und Datumsangaben</li>
            <li>Unterlagen, die für Buchhaltung und rechtliche Compliance erforderlich sind</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Service- & Nutzungsdaten">
          <p>Wenn Sie unsere Hosting-Services nutzen, erheben wir:</p>
          <ul>
            <li>IP-Adressen, die Ihren Services zugewiesen sind oder von ihnen genutzt werden</li>
            <li>Ressourcenauslastung der Server (CPU, RAM, Bandbreite, Speicherbelegung)</li>
            <li>Zugriffs- und Aktivitätslogs von Control Panels und Dashboards</li>
            <li>Metadaten des Netzwerkverkehrs (nicht dessen Inhalt), genutzt zur Missbrauchserkennung und zum Performance-Monitoring</li>
            <li>Aktivitätslogs von Gameservern einschließlich Verbindungszeitstempeln und Sitzungsdaten</li>
            <li>Aufzeichnungen zu Uptime und Verfügbarkeit</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.4 Kommunikationsdaten">
          <p>Wenn Sie uns kontaktieren, bewahren wir Aufzeichnungen auf über:</p>
          <ul>
            <li>Supporttickets und deren vollständigen Inhalt</li>
            <li>Discord-Kommunikation (Nachrichten in unserem Server oder Direktnachrichten mit unserem Team)</li>
            <li>E-Mail-Korrespondenz</li>
            <li>Dateien, Screenshots oder Logs, die Sie bei einer Supportanfrage teilen</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Website-Daten">
          <p>Wenn Sie wslatl.com besuchen, können wir erheben:</p>
          <ul>
            <li>IP-Adresse und ungefähre geografische Region</li>
            <li>Browsertyp und Betriebssystem</li>
            <li>Besuchte Seiten und auf der Website verbrachte Zeit</li>
            <li>Verweisende URL</li>
            <li>Sitzungscookies (siehe Abschnitt 7)</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Wie wir Ihre Informationen nutzen">
        <p>Wir nutzen die erhobenen Informationen ausschließlich dazu:</p>
        <ul>
          <li>Ihre Hosting-Services bereitzustellen, zu betreiben und zu erhalten</li>
          <li>Zahlungen abzuwickeln, Rechnungen zu erstellen und Ihr Abrechnungskonto zu verwalten</li>
          <li>Ihre Identität zu überprüfen und betrügerische Kontoanlagen zu verhindern</li>
          <li>Auf Supportanfragen, Fragen und Anliegen zu antworten</li>
          <li>Netzwerkleistung, Uptime und den Zustand der Infrastruktur zu überwachen</li>
          <li>Missbrauch, unbefugten Zugriff und Verstöße gegen unsere Richtlinie zur zulässigen Nutzung zu erkennen, zu untersuchen und zu verhindern</li>
          <li>Anwendbare Gesetze, Vorschriften und rechtliche Pflichten einzuhalten</li>
          <li>Unsere Nutzungsbedingungen durchzusetzen</li>
          <li>Servicebezogene Mitteilungen zu senden, etwa Wartungsankündigungen, Abrechnungshinweise und Kontoaktualisierungen</li>
          <li>Unsere Services und Infrastruktur anhand von Nutzungsmustern zu verbessern</li>
        </ul>
        <p className="font-medium text-foreground">
          Wir nutzen Ihre Daten nicht für Werbung. Wir verkaufen, vermieten oder tauschen Ihre
          personenbezogenen Informationen nicht an Dritte zu irgendeinem kommerziellen Zweck.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Wie wir Ihre Informationen weitergeben">
        <p>
          Wir geben Ihre Informationen nur in den folgenden begrenzten Fällen weiter, und nur in
          dem für den jeweiligen Zweck erforderlichen Umfang:
        </p>

        <LegalSubSection title="4.1 Dienstleister">
          <p>
            Wir arbeiten mit Anbietern Dritter zusammen, die uns helfen, unsere Services zu
            erbringen. Diese Anbieter erhalten nur die Daten, die für ihre Funktion erforderlich
            sind, und sind vertraglich verpflichtet, diese Daten zu schützen. Dazu gehören:
          </p>
          <ul>
            <li>Zahlungsdienstleister (zur Abwicklung von Abrechnungstransaktionen)</li>
            <li>Rechenzentrums- und Infrastrukturpartner (für das physische Hosting der Server)</li>
            <li>Anbieter von Bot- und Missbrauchsschutz, Content Delivery und DNS</li>
            <li>E-Mail-Zustellung für transaktionale Nachrichten wie Rechnungen und Kontomitteilungen</li>
            <li>Adressvervollständigung und Geocoding für Formulare zur Adresseingabe</li>
            <li>Dienste zur Statusüberwachung (z.&nbsp;B. status.wslatl.com)</li>
          </ul>
          <p>
            Wir veröffentlichen die einzelnen Anbieter, nicht nur diese Kategorien. Jeder
            Unterauftragsverarbeiter ist auf unserer Seite{' '}
            <Link href={siteConfig.paths.subprocessors}>Unterauftragsverarbeiter</Link>{' '}
            namentlich genannt, zusammen damit, wofür er genutzt wird, welche Datenkategorien er
            erhält und wo er sich befindet. Diese Seite wird aktuell gehalten, wenn sich unsere
            Infrastruktur ändert.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Gesetzliche Anforderungen">
          <p>
            Wir können Ihre Informationen offenlegen, wenn dies gesetzlich, durch eine wirksame
            gerichtliche Anordnung, eine Subpoena oder ein rechtmäßiges Ersuchen von Behörden
            verlangt wird. Soweit rechtlich zulässig, versuchen wir, Sie zu benachrichtigen,
            bevor wir einem solchen Ersuchen nachkommen.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Missbrauchsprävention & Strafverfolgung">
          <p>
            Wir können IP-Adressen, Netzwerk-Logs oder andere technische Daten weitergeben an:
          </p>
          <ul>
            <li>Andere Hosting-Anbieter, die Missbrauch untersuchen, der von unserem Netzwerk ausgeht</li>
            <li>Abuse-Register (z.&nbsp;B. AbuseIPDB), wenn bestätigter Netzwerkmissbrauch bearbeitet wird</li>
            <li>Strafverfolgungsbehörden, wenn illegale Aktivitäten untersucht werden</li>
            <li>NCMEC oder andere Behörden in Fällen, die den Kinderschutz betreffen</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Unternehmensübergänge">
          <p>
            Wenn WSLATL LLC übernommen wird, mit einer anderen Einheit verschmilzt oder einen
            wesentlichen unternehmerischen Übergang durchläuft, können Ihre Informationen im
            Rahmen dieser Transaktion übertragen werden. Wir benachrichtigen aktive Kunden vor
            einer solchen Änderung per E-Mail.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Internationale Übermittlungen">
          <p>
            WSLATL LLC ist im Bundesstaat Missouri, Vereinigte Staaten, niedergelassen, und
            unsere Services werden von den Vereinigten Staaten aus betrieben. Wenn Sie sich im
            Europäischen Wirtschaftsraum, im Vereinigten Königreich oder in der Schweiz
            befinden, bedeutet die Nutzung unserer Services, dass Ihre personenbezogenen Daten
            in die Vereinigten Staaten übermittelt werden und, wo ein Unterauftragsverarbeiter
            ein globales Netzwerk betreibt, möglicherweise in weitere Länder.
          </p>
          <p>
            Für die Vereinigten Staaten besteht kein allgemeiner Angemessenheitsbeschluss, der
            für alle Empfänger gilt. Wo wir personenbezogene Daten aus dem EWR oder dem
            Vereinigten Königreich übermitteln, stützen wir uns darauf, dass die Übermittlung
            für die Erfüllung des Vertrags erforderlich ist, dessen Erfüllung Sie von uns
            verlangt haben, sowie auf die Standardvertragsklauseln der Europäischen Kommission
            zusammen mit dem UK International Data Transfer Addendum, wo ein
            Unterauftragsverarbeiter sie anbietet.
          </p>
          <p>
            Die Mechanismen, die für den jeweiligen Empfänger gelten, und weitere Einzelheiten
            zu unserer Haltung bei Übermittlungen finden Sie auf unserer Seite{' '}
            <Link href={siteConfig.paths.subprocessors}>Unterauftragsverarbeiter</Link>.
            Wenn Sie einen Auftragsverarbeitungsvertrag oder eine Ausfertigung der Klauseln in
            der von uns verwendeten Fassung benötigen, wenden Sie sich an uns unter{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Aufbewahrung von Daten">
        <p>Wir bewahren Ihre Daten für die folgenden Zeiträume auf:</p>
        <ScrollTable label="Aufbewahrungsfristen">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Datenart</th>
                <th scope="col">Aufbewahrungsfrist</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Kontounterlagen</td>
                <td>Dauer des Kontos + 3 Jahre</td>
              </tr>
              <tr>
                <td>Abrechnungsunterlagen</td>
                <td>7 Jahre (steuerliche und rechtliche Anforderungen)</td>
              </tr>
              <tr>
                <td>Server- und Netzwerk-Logs</td>
                <td>Bis zu 90 Tage (länger, wenn für eine laufende Untersuchung erforderlich)</td>
              </tr>
              <tr>
                <td>Supportkommunikation</td>
                <td>2 Jahre ab der letzten Interaktion</td>
              </tr>
              <tr>
                <td>Daten nach der Kündigung</td>
                <td>Auf Anfrage bis zu 14 Tage nach der Kündigung wiederherstellbar; spätestens 90 Tage nach Kontoschließung gelöscht oder anonymisiert (Servicedaten werden früher entfernt, nach Abschnitt 9.3 der Nutzungsbedingungen)</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          Daten können über diese Zeiträume hinaus aufbewahrt werden, wenn anwendbares Recht,
          ein laufendes Rechtsverfahren oder eine berechtigte geschäftliche Streitigkeit dies
          erfordert.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Datensicherheit">
        <p>
          Der Schutz Ihrer Daten ist eine Kernaufgabe, die wir ernst nehmen. Zu unseren
          Sicherheitsmaßnahmen gehören:
        </p>
        <ul>
          <li>Verschlüsselung sensibler Daten im Ruhezustand und bei der Übertragung (HTTPS/TLS für alle Panels und Portale)</li>
          <li>Speicherung von Passwörtern als gesalzener Hash: Klartextpasswörter werden nie gespeichert und sind für uns nie sichtbar</li>
          <li>Strenge interne Zugriffskontrollen, die begrenzen, wer in unserem Team Kundendaten einsehen kann</li>
          <li>Regelmäßige Überprüfung und Härtung unserer Hosting-Infrastruktur</li>
          <li>Überwachung auf ungewöhnliche Zugriffsmuster und mögliche Eindringversuche</li>
        </ul>
        <p>
          Keine Übertragung über das Internet ist zu 100% sicher. Wir setzen zwar branchenübliche
          Schutzmaßnahmen ein, können absolute Sicherheit aber nicht garantieren. Wenn Sie
          glauben, dass Ihr Konto kompromittiert wurde, wenden Sie sich sofort an uns unter{' '}
          <Email name="support" />.
        </p>
        <p>
          Im Fall einer Datenschutzverletzung, die Ihre Informationen betrifft, benachrichtigen
          wir Sie im Einklang mit anwendbarem Recht, einschließlich des Gesetzes von Missouri
          zur Meldung von Datenschutzverletzungen (Mo. Rev. Stat. &sect;&nbsp;407.1500), so
          zügig, wie es die Umstände erlauben.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          Wir setzen Cookies nur minimal und nur dort ein, wo sie nötig sind. Unser Einsatz von
          Cookies umfasst:
        </p>
        <ul>
          <li>
            <strong>Sitzungscookies:</strong> Erforderlich, damit
            Sie in unserem Abrechnungsportal und in den Hosting-Panels angemeldet bleiben. Sie
            laufen ab, wenn Sie Ihren Browser schließen oder sich abmelden.
          </li>
          <li>
            <strong>Präferenzcookies:</strong> Können
            Anzeigeeinstellungen oder Einstellungen speichern, die Sie in unseren Panels gewählt
            haben.
          </li>
        </ul>
        <p>
          Wir setzen auf wslatl.com keine Werbecookies Dritter, keine Tracking-Pixel und keine
          Werkzeuge zur Verhaltensanalyse ein. Sie können Cookies in Ihren Browsereinstellungen
          verwalten oder deaktivieren, was jedoch die Funktion angemeldeter Bereiche wie unseres
          Abrechnungsportals und der Hosting-Panels beeinträchtigen kann.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Ihre Rechte & Wahlmöglichkeiten">
        <p>
          Je nachdem, wo Sie sich befinden, können Ihnen die folgenden Rechte in Bezug auf Ihre
          personenbezogenen Daten zustehen:
        </p>
        <ul>
          <li><strong>Auskunft:</strong> Eine Kopie der personenbezogenen Daten anfordern, die wir über Sie halten.</li>
          <li><strong>Berichtigung:</strong> Verlangen, dass wir unrichtige oder unvollständige Daten berichtigen.</li>
          <li><strong>Löschung:</strong> Die Löschung Ihrer personenbezogenen Daten verlangen, vorbehaltlich gesetzlicher Aufbewahrungspflichten.</li>
          <li><strong>Übertragbarkeit:</strong> Ihre Daten in einem strukturierten, maschinenlesbaren Format anfordern.</li>
          <li><strong>Einschränkung:</strong> Verlangen, dass wir die Verarbeitung Ihrer Daten einschränken.</li>
          <li><strong>Widerspruch:</strong> Bestimmten Arten der Datenverarbeitung widersprechen.</li>
        </ul>
        <p>
          Um eines dieser Rechte auszuüben, wenden Sie sich an uns unter{' '}
          <Email name="support" />.
          Wir antworten innerhalb von 30 Tagen. Wir müssen Ihre Identität möglicherweise
          überprüfen, bevor wir Ihre Anfrage bearbeiten.
        </p>
        <p>
          <strong>Einwohnern Kaliforniens</strong> können zusätzliche
          Rechte nach dem California Consumer Privacy Act (CCPA) und dem California Privacy
          Rights Act (CPRA) zustehen, darunter das Recht zu erfahren, welche personenbezogenen
          Informationen verkauft oder weitergegeben werden, und das Recht auf Widerspruch. Wir
          verkaufen keine personenbezogenen Informationen, daher greifen die
          Widerspruchsrechte nach dem CCPA nicht.
        </p>
        <p>
          <strong>Einwohner des EWR und des Vereinigten Königreichs</strong> haben Rechte nach
          der DSGVO und der UK-DSGVO, einschließlich der oben aufgeführten Rechte. Unsere
          Rechtsgrundlage für die Verarbeitung Ihrer Daten ist in erster Linie die Erfüllung
          eines Vertrags (die Bereitstellung der von Ihnen angeforderten Services) und die
          Erfüllung rechtlicher Pflichten. Übermittlungen Ihrer Daten außerhalb des EWR oder
          des Vereinigten Königreichs sind in Abschnitt 4.5 beschrieben.
        </p>

        <LegalSubSection title="8.1 Recht auf Beschwerde bei einer Aufsichtsbehörde">
          <p>
            Wenn Sie sich im Europäischen Wirtschaftsraum, im Vereinigten Königreich oder in der
            Schweiz befinden, haben Sie nach Artikel 77 der DSGVO und der entsprechenden
            Bestimmung der UK-DSGVO das Recht, Beschwerde bei einer Datenschutz-Aufsichtsbehörde
            einzulegen. Sie können sich an die Behörde des Landes wenden, in dem Sie leben, in
            dem Sie arbeiten oder in dem das Problem Ihrer Ansicht nach aufgetreten ist.
          </p>
          <p>
            Im Vereinigten Königreich ist das das Information Commissioner&rsquo;s Office. Im
            EWR hat jeder Mitgliedstaat seine eigene Behörde, und der Europäische
            Datenschutzausschuss veröffentlicht die aktuelle Liste.
          </p>
          <p>
            Sie müssen sich nicht zuerst an uns wenden, und die Ausübung dieses Rechts
            beeinträchtigt keinen anderen Ihnen zustehenden Rechtsbehelf. Dennoch würden wir
            ehrlich gesagt lieber direkt von einem Problem erfahren. Schreiben Sie an{' '}
            <Email name="support" />{' '}
            und wir nehmen es ernst.
          </p>
        </LegalSubSection>

        <LegalSubSection title="8.2 Anfragen zu Daten auf dem Service einer anderen Person">
          <p>
            Wenn Ihre personenbezogenen Daten auf einem Service liegen, den ein WSLATL Kunde auf
            unserer Infrastruktur betreibt, sind wir Auftragsverarbeiter dieser Daten und nicht
            der Verantwortliche, wie in Abschnitt 1.1 erläutert. Wir können sie auf Ihre Anfrage
            hin in der Regel nicht einsehen, berichtigen oder löschen, weil die Entscheidung
            darüber nicht bei uns liegt.
          </p>
          <p>
            Richten Sie Ihre Anfrage an den Betreiber des Service, den Sie genutzt haben. Wenn
            Sie ihn nicht ermitteln oder erreichen können, wenden Sie sich an uns und wir leiten
            Ihre Anfrage an den Kunden weiter, soweit uns das vernünftigerweise möglich ist.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="9" title="Altersanforderungen & Datenschutz für Kinder">
        <p>Wir haben eine strikte dreistufige Altersrichtlinie, die für unsere Website, das Abrechnungsportal und alle Hosting-Services gilt:</p>

        <Tiers>
          <Tier tone="critical" title="Unter 13: nicht zulässig">
            Personen unter 13 Jahren ist die Nutzung jedes WSLATL Service streng untersagt,
            einschließlich unserer Website, des Abrechnungsportals und der Hosting-Panels. Wir
            erheben wissentlich keine personenbezogenen Informationen von Personen unter 13
            Jahren. Wenn wir feststellen oder darauf hingewiesen werden, dass ein Nutzer unter
            13 Jahre alt ist, wird sein Konto sofort und dauerhaft gesperrt und alle zugehörigen
            Daten werden gelöscht. Wir nehmen das ernst und haben null Toleranz für einen
            Zugang Minderjähriger.
          </Tier>
          <Tier tone="caution" title="13 bis 17 Jahre: zulässig mit Zustimmung eines Erwachsenen">
            Wir heißen Nutzer im Alter von 13 bis 17 Jahren willkommen, ein Elternteil oder
            Erziehungsberechtigter muss jedoch ausdrücklich zustimmen, bevor das Konto genutzt
            wird. Mit der Registrierung oder der Nutzung unserer Services bestätigen Nutzer
            dieser Altersgruppe, dass ein Elternteil oder Erziehungsberechtigter unsere
            Nutzungsbedingungen, die Datenschutzerklärung und die Richtlinie zur zulässigen
            Nutzung in ihrem Namen geprüft und ihnen zugestimmt hat. Der zustimmende Erwachsene
            übernimmt die volle Verantwortung für die Kontoaktivitäten des Minderjährigen und
            alle damit verbundenen Entgelte. Wenn wir feststellen, dass ein Konto in dieser
            Altersgruppe ohne Zustimmung eines Erwachsenen angelegt wurde, sperren wir das Konto,
            bis eine wirksame Zustimmung vorliegt.
          </Tier>
          <Tier tone="good" title="Ab 18: uneingeschränkt zulässig">
            Erwachsene ab 18 Jahren können sich registrieren und unsere Services ohne
            zusätzliche Zustimmungsanforderungen nutzen, vorbehaltlich der Freigabe des Kontos
            nach unserem Modell der Aufnahme nur auf Bewerbung und der Einhaltung unserer
            Nutzungsbedingungen und unserer Richtlinie zur zulässigen Nutzung.
          </Tier>
        </Tiers>

        <p>
          Wenn Sie Elternteil oder Erziehungsberechtigter sind und glauben, dass sich Ihr Kind
          unter 13 Jahren ohne Ihr Wissen bei uns registriert oder uns personenbezogene
          Informationen gegeben hat, wenden Sie sich sofort an uns unter{' '}
          <Email name="support" />.
          Wir entfernen das Konto und alle zugehörigen Daten so schnell wie möglich dauerhaft.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Links & Dienste Dritter">
        <p>
          Unsere Website und unsere Panels können Links zu oder Integrationen mit Diensten
          Dritter enthalten, darunter Discord, GitHub und andere. Diese Datenschutzerklärung
          gilt nicht für diese Dienste Dritter. Wir empfehlen Ihnen, die Datenschutzerklärungen
          jedes Dienstes Dritter zu lesen, den Sie im Zusammenhang mit unserer Plattform nutzen.
          Für die Datenschutzpraktiken Dritter sind wir nicht verantwortlich.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren, um Änderungen
          unserer Praktiken, rechtlicher Anforderungen oder unserer Services abzubilden. Bei
          wesentlichen Änderungen werden wir:
        </p>
        <ul>
          <li>Das oben auf dieser Seite angezeigte Datum des Inkrafttretens aktualisieren</li>
          <li>Aktive Kunden per E-Mail mit einer Zusammenfassung der Änderungen benachrichtigen</li>
          <li>Die aktualisierte Richtlinie unter {siteConfig.paths.privacy} veröffentlichen</li>
        </ul>
        <p>
          Ihre fortgesetzte Nutzung unserer Services nach dem Inkrafttreten von Änderungen gilt
          als Ihre Annahme der aktualisierten Datenschutzerklärung. Wenn Sie mit wesentlichen
          Änderungen nicht einverstanden sind, können Sie Ihren Service vor dem Inkrafttreten
          kündigen.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Kontakt">
        <p>
          Fragen, Anliegen oder Anfragen zu dieser Datenschutzerklärung sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
