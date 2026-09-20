import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function SubprocessorsContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Diese Seite listet die Dritten auf, die personenbezogene Daten im Auftrag von WSLATL
          LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) verarbeiten, damit wir unsere Website, das Abrechnungsportal, die
          Hosting-Panels und die Supportkanäle betreiben können. Sie ergänzt Abschnitt 4.1
          unserer{' '}
          <Link href={siteConfig.paths.privacy}>Datenschutzerklärung</Link>,
          die diese Empfänger nur nach Kategorie beschreibt.
        </p>
        <p>
          Ein Unterauftragsverarbeiter ist ein Unternehmen, das wir beauftragen und das im
          Rahmen einer Dienstleistung für uns personenbezogene Daten verarbeiten kann. Jeder
          erhält nur die Daten, die für seine Funktion nötig sind. Wir verkaufen keine
          personenbezogenen Daten und wir geben sie nicht für Werbung weiter.
        </p>
        <p>
          Diese Liste umfasst die Verarbeitung durch WSLATL. Sie umfasst nicht die Dienste, die
          Sie selbst auf einem von uns für Sie gehosteten Server installieren und betreiben. Zu
          diesen Daten siehe Abschnitt 5 unten.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Unterauftragsverarbeiter">
        <p>
          Die folgenden Dritten können personenbezogene Daten in unserem Auftrag verarbeiten.
          Die Spalte &bdquo;Standort&ldquo; beschreibt, wo der Anbieter niedergelassen ist, und,
          wo relevant, die grobe Ausdehnung der von ihm genutzten Infrastruktur.
        </p>

        <ScrollTable label="Unterauftragsverarbeiter">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Unterauftragsverarbeiter</th>
                <th scope="col">Zweck</th>
                <th scope="col">Datenkategorien</th>
                <th scope="col">Standort</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Stripe</td>
                <td>Kartenzahlungsabwicklung und Abrechnung im Kundenportal</td>
                <td>Name, E-Mail-Adresse, Rechnungsadresse, Zahlungskartendaten, Transaktionsdaten, IP-Adresse</td>
                <td>Vereinigte Staaten, mit weltweiter Verarbeitung</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">PayPal</td>
                <td>Alternative Zahlungsabwicklung im Kundenportal</td>
                <td>Name, E-Mail-Adresse, PayPal-Kontokennungen, Transaktionsdaten</td>
                <td>Vereinigte Staaten, mit weltweiter Verarbeitung</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (Turnstile)</td>
                <td>Bot- und Missbrauchsschutz bei Registrierung, Login und anderen öffentlichen Formularen</td>
                <td>IP-Adresse, Browser- und Gerätesignale, Challenge-Tokens</td>
                <td>Vereinigte Staaten, mit einem globalen Edge-Netzwerk</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (CDN und DNS)</td>
                <td>Content Delivery, DNS-Auflösung und Schutz vor Denial-of-Service für unsere öffentlichen Seiten</td>
                <td>IP-Adresse, Anfrage-Metadaten, HTTP-Header, TLS-Verbindungsdaten</td>
                <td>Vereinigte Staaten, mit einem globalen Edge-Netzwerk</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">WSLATL Mail-Gateway (smtp.wslatl.com)</td>
                <td>Zustellung transaktionaler E-Mails wie Rechnungen, Kontomitteilungen und Passwort-Zurücksetzungen</td>
                <td>Name, E-Mail-Adresse und der Inhalt der Nachrichten, die wir Ihnen senden</td>
                <td>Von WSLATL auf eigener Infrastruktur betrieben</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pterodactyl</td>
                <td>Gameserver-Control-Panel zur Bereitstellung und Verwaltung von Gameserver-Hosting</td>
                <td>Kontokennungen, E-Mail-Adresse, Serverkonfiguration, Aktivitätslogs des Panels</td>
                <td>Open-Source-Software, von WSLATL auf eigener Infrastruktur betrieben</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VirtFusion</td>
                <td>VPS-Control-Panel zur Bereitstellung und Verwaltung virtueller Server</td>
                <td>Kontokennungen, E-Mail-Adresse, VPS-Konfiguration, IP-Zuweisungen, Aktivitätslogs des Panels</td>
                <td>Lizenzierte Software, von WSLATL auf eigener Infrastruktur betrieben; ein Supportzugriff des Herstellers ist bei der Fehlersuche möglich</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Rechenzentrumspartner</td>
                <td>Physisches Hosting, Rackplatz, Strom und Netzwerk-Transit für unsere Server</td>
                <td>Physischer Gewahrsam über die Server und damit über alle darauf gespeicherten Daten</td>
                <td>Siehe Hinweis unten</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">jsDelivr und cdnjs</td>
                <td>Auslieferung gängiger Frontend-Bibliotheken, die unsere Panels verwenden</td>
                <td>IP-Adresse, User Agent und Anfrage-Metadaten, die Ihr Browser beim Laden eines Assets sendet</td>
                <td>Öffentliche CDN-Netzwerke mit weltweit verteilten Edge-Knoten</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Photon (OpenStreetMap-Daten)</td>
                <td>Vorschläge zur Adressvervollständigung in Registrierungs- und Profilformularen</td>
                <td>Der Teiltext der Adresse, den Sie in ein Adressfeld eingeben</td>
                <td>Europa</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

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
        <Callout tone="caution" title="Rechenzentrumspartner: wird noch veröffentlicht">
          Betreiber und Standort der Einrichtungen, in denen unsere Server stehen, werden
          derzeit bestätigt und hier benannt. Wenn Sie diese Information vor der
          Veröffentlichung benötigen, etwa um Ihre eigene Lieferantenprüfung abzuschließen,
          wenden Sie sich an uns unter <Email name="support" />,
          und wir stellen sie bereit.
        </Callout>

        <p>
          Wir können einen Unterauftragsverarbeiter hinzufügen oder ersetzen, wenn sich unsere
          Infrastruktur ändert. Wenn wir das tun, aktualisieren wir diese Seite. Aktive Kunden,
          die um Benachrichtigung über Änderungen bei Unterauftragsverarbeitern gebeten haben,
          werden per E-Mail informiert; Sie können sich dafür anmelden, indem Sie an{' '}
          <Email name="support" /> schreiben.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Hinweise zu einzelnen Einträgen">

        <LegalSubSection title="3.1 Zahlungsdienstleister">
          <p>
            Kartendaten werden direkt beim Zahlungsdienstleister eingegeben und von diesem
            verarbeitet. Wie in Abschnitt 2.2 unserer Datenschutzerklärung dargelegt, speichern
            wir weder Ihre vollständige Kartennummer noch die Prüfziffer (CVV). Was wir
            behalten, sind die Art des Zahlungsmittels, die letzten vier Ziffern und
            Transaktionskennungen.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Adressvervollständigung">
          <p>
            Adressvorschläge werden von unserem eigenen Server angefragt und nicht von Ihrem
            Browser. Ihre IP-Adresse wird dem Geocoding-Dienst daher nicht offengelegt; gesendet
            wird nur der Teiltext der Adresse, den Sie eingegeben haben. Wir senden mit der
            Abfrage weder den Rest Ihres Formulars noch Ihre Kontoidentität noch Ihre
            E-Mail-Adresse.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Öffentliche CDNs">
          <p>
            Wenn eine Seite eine Frontend-Bibliothek von einem öffentlichen CDN lädt, stellt Ihr
            Browser eine direkte Anfrage an dieses CDN, wodurch ihm zwangsläufig Ihre IP-Adresse
            und Ihr User Agent offengelegt werden. Das ist bei über ein CDN ausgelieferten
            Assets üblich und nichts, was wir selbst an sie übermitteln.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.4 Selbst betriebene Systeme">
          <p>
            Unser Mail-Gateway, das Pterodactyl-Panel und das VirtFusion-Panel laufen auf
            Infrastruktur, die wir kontrollieren, und nicht als gehostete Dienste Dritter. Sie
            sind hier der Vollständigkeit halber aufgeführt, weil sie personenbezogene Daten
            verarbeiten und weil einem Softwarehersteller unter Umständen während einer
            Supportuntersuchung Zugriff gewährt werden kann. Wo das geschieht, ist der Zugriff
            auf das beschränkt, was zur Lösung des Problems nötig ist.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Internationale Übermittlungen">
        <p>
          WSLATL LLC ist im Bundesstaat Missouri, Vereinigte Staaten, niedergelassen, und unsere
          Services werden von den Vereinigten Staaten aus betrieben. Wenn Sie sich im
          Europäischen Wirtschaftsraum, im Vereinigten Königreich oder in der Schweiz befinden,
          ist mit der Nutzung unserer Services eine Übermittlung Ihrer personenbezogenen Daten
          in die Vereinigten Staaten verbunden und, wo ein Unterauftragsverarbeiter ein globales
          Netzwerk betreibt, in weitere Länder.
        </p>
        <p>
          Für die Vereinigten Staaten besteht kein allgemeiner Angemessenheitsbeschluss, der
          alle Empfänger erfasst. Wo wir personenbezogene Daten aus dem EWR oder dem Vereinigten
          Königreich übermitteln, stützen wir uns auf Folgendes:
        </p>
        <ul>
          <li>
            <strong>Erforderlichkeit für den Vertrag.</strong> Bei
            den meisten Übermittlungen ist die Übermittlung erforderlich, um den Vertrag zu
            erfüllen, dessen Erfüllung Sie von uns verlangt haben. Sie können keinen Server in
            unserer Einrichtung erhalten, ohne dass Ihre Daten unsere Einrichtung erreichen.
          </li>
          <li>
            <strong>Standardvertragsklauseln.</strong>{' '}
            Wo ein Unterauftragsverarbeiter sie anbietet, stützen wir uns auf die
            Standardvertragsklauseln der Europäischen Kommission und für Übermittlungen in das
            Vereinigte Königreich auf das UK International Data Transfer Addendum. Mehrere der
            oben aufgeführten Anbieter nehmen diese Klauseln in ihre Standardbedingungen zur
            Auftragsverarbeitung auf.
          </li>
          <li>
            <strong>Rahmenwerke auf Anbieterebene.</strong> Einige
            der oben aufgeführten Anbieter unterhalten eigene Zertifizierungen oder
            Übermittlungsmechanismen für die Daten, die sie erhalten. Diese Mechanismen sind die
            des Anbieters, nicht unsere, und für Einzelheiten sollten Sie die eigene
            Datenschutzdokumentation des Anbieters heranziehen.
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
        <p>
          WSLATL unterhält derzeit keine eigene Zertifizierung nach dem EU-US Data Privacy
          Framework. Wir berufen uns nicht auf eine Angemessenheit auf dieser Grundlage.
        </p>
        <p>
          Wenn Sie einen Auftragsverarbeitungsvertrag, eine Ausfertigung der
          Standardvertragsklauseln in der von uns verwendeten Fassung oder ein Transfer Impact
          Assessment für Ihre eigene Compliance-Akte benötigen, wenden Sie sich an uns unter{' '}
          <Email name="support" />{' '}
          und wir arbeiten es mit Ihnen durch.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Daten, die Sie auf Ihre eigenen Server legen">
        <p>
          Es gibt einen wichtigen Unterschied zwischen den beiden Arten von Daten, um die es
          beim Hosting geht.
        </p>
        <ul>
          <li>
            <strong>Ihre Kontodaten.</strong> Die
            Informationen, die Sie uns geben, um Ihr Konto zu eröffnen und zu führen, etwa Ihr
            Name, Ihre E-Mail-Adresse, Ihre Rechnungsadresse und Ihre Rechnungshistorie. WSLATL
            ist der Verantwortliche für diese Daten, und die oben aufgeführten
            Unterauftragsverarbeiter werden von uns beauftragt.
          </li>
          <li>
            <strong>Daten auf Ihren Services.</strong> Alles,
            was Sie oder Ihre Nutzer auf einem Server speichern, den wir für Sie hosten,
            einschließlich Datenbanken, Gameserver-Daten, hochgeladener Dateien und
            Anwendungslogs. Sie entscheiden, was erhoben wird und warum. WSLATL ist
            Auftragsverarbeiter dieser Daten, nicht der Verantwortliche, und diese Liste von
            Unterauftragsverarbeitern ist nicht die Liste Ihrer Unterauftragsverarbeiter.
          </li>
        </ul>
        <p>
          Wenn Sie personenbezogene Daten anderer Menschen auf einem WSLATL Service hosten,
          treffen Sie die Pflichten eines Verantwortlichen nach der DSGVO oder nach anderem
          geltenden Recht. Dazu gehören eine Rechtsgrundlage, die Information Ihrer eigenen
          Nutzer und das Führen eines eigenen Verzeichnisses von Verarbeitungstätigkeiten. Siehe
          Abschnitt 12 unserer{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          für die zugehörige Freistellung.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Änderungen dieser Liste">
        <p>
          Wir halten diese Seite aktuell, wenn sich unsere Infrastruktur ändert. Wenn ein
          Unterauftragsverarbeiter hinzukommt oder ersetzt wird, aktualisieren wir das Datum des
          Inkrafttretens oben auf dieser Seite und veröffentlichen die aktualisierte Liste
          unter{' '}
          <Link href={siteConfig.paths.subprocessors}>
            {siteConfig.siteUrl}{siteConfig.paths.subprocessors}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Kontakt">
        <p>
          Fragen zu dieser Liste, Anfragen nach einem Auftragsverarbeitungsvertrag und
          Datenschutzanfragen allgemein sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
