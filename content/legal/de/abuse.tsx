import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AbuseContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Diese Missbrauchsrichtlinie erklärt, wie Sie Missbrauch von Infrastruktur melden, die
          von WSLATL LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) betrieben wird, was wir mit einer Meldung machen, sobald sie bei
          uns ist, und wie wir mit Services in unserem Netzwerk umgehen, von denen der
          Missbrauch ausgeht.
        </p>
        <p>
          Sie steht neben unserer{' '}
          <Link href={siteConfig.paths.acceptableUse}>Richtlinie zur zulässigen Nutzung</Link>,
          die festlegt, was auf unserer Infrastruktur erlaubt ist und was nicht, und neben
          unseren{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>,
          in die beide durch Verweis einbezogen sind. Urheberrechtsbeschwerden werden über
          unsere{' '}
          <Link href={siteConfig.paths.dmca}>DMCA-Richtlinie</Link>{' '}
          und nicht über diese Seite bearbeitet.
        </p>
        <p>
          Wir sind ein kleines, privates Hosting-Unternehmen, und wir nehmen Missbrauch unseres
          Netzwerks ernst, sowohl weil er anderen Menschen schadet als auch weil er die Kunden
          gefährdet, die sich unsere Infrastruktur teilen. Jede glaubhafte Meldung wird
          untersucht.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Wie Sie Missbrauch melden">
        <p>
          Wenn Sie glauben, dass WSLATL Infrastruktur (ein Server, eine IP-Adresse, eine
          Website, ein Gameserver oder eine E-Mail) für missbräuchliche, illegale oder
          schädliche Aktivitäten genutzt wird, melden Sie das unserem Abuse-Team. Das ist der
          schnellste Weg zu den Menschen, die etwas unternehmen können.
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
          E-Mail ist der Kanal, den wir auf Missbrauch überwachen, und derjenige, der einen
          Vorgang erzeugt, auf den wir reagieren können. Eine Meldung, die nur in einem
          Discord-Kanal erfolgt, kann übersehen werden; wenn eine Sache zeitkritisch ist,
          schicken Sie sie per E-Mail.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Was in eine Meldung gehört">
        <p>
          Je genauer Ihre Meldung, desto schneller können wir die Quelle finden und handeln.
          Bitte geben Sie so viel des Folgenden an, wie Ihnen vorliegt:
        </p>
        <ul>
          <li>Die betroffene IP-Adresse, Domain, URL oder den betroffenen Server</li>
          <li>Zeitstempel der Aktivität, mit Zeitzone oder Abweichung von UTC</li>
          <li>Relevante Log-Auszüge, E-Mail-Header oder Packet Captures, nach Möglichkeit als Text eingefügt</li>
          <li>Eine klare Beschreibung der Aktivität und warum Sie sie für missbräuchlich halten</li>
          <li>Wie wir Sie erreichen, falls wir weitere Informationen brauchen</li>
        </ul>
        <p>
          Logs sind am nützlichsten in ihrer ursprünglichen Textform mit vollständigen Headern.
          Screenshots sind als Ergänzung in Ordnung, aber für sich genommen schwerer zu
          überprüfen.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Was wir als Missbrauch behandeln">
        <p>
          Missbrauch ist jede Nutzung unserer Infrastruktur, die gegen unsere{' '}
          <Link href={siteConfig.paths.acceptableUse}>Richtlinie zur zulässigen Nutzung</Link>{' '}
          oder gegen geltendes Recht verstößt. Häufige Kategorien, gegen die wir vorgehen, sind
          unter anderem:
        </p>
        <ul>
          <li>
            <strong>Netzwerkangriffe.</strong> DDoS-Traffic,
            Port- und Schwachstellen-Scans, Brute-Force-Versuche oder Eindringversuche, die von
            unserem IP-Bereich ausgehen.
          </li>
          <li>
            <strong>Spam und unerwünschte E-Mails.</strong> Massenhafte oder
            unerwünschte E-Mails, offene Mail-Relays und Mail-Spoofing.
          </li>
          <li>
            <strong>Phishing und Betrug.</strong> Seiten oder
            Services, die dazu gebaut sind, Zugangsdaten oder Zahlungsdaten zu stehlen oder
            Menschen zum eigenen finanziellen Vorteil zu täuschen.
          </li>
          <li>
            <strong>Malware.</strong> Das Hosten oder Verbreiten
            von Viren, Ransomware, Command-and-Control-Servern oder anderer Schadsoftware.
          </li>
          <li>
            <strong>Illegale Inhalte.</strong> Inhalte, deren
            Hosten rechtswidrig ist, einschließlich des in Abschnitt 3 unserer Richtlinie zur
            zulässigen Nutzung beschriebenen Materials.
          </li>
          <li>
            <strong>Belästigung und Drohungen.</strong> Unsere
            Services zu nutzen, um eine Person zu belästigen, zu bedrohen, zu doxxen oder zu
            gefährden.
          </li>
        </ul>
        <p>
          Die vollständige Darstellung dessen, was verboten ist, finden Sie in den Abschnitten 3
          und 4 der Richtlinie zur zulässigen Nutzung. Urheberrechtsverletzungen werden
          gesondert nach der{' '}
          <Link href={siteConfig.paths.dmca}>DMCA-Richtlinie</Link> behandelt.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Was nach Ihrer Meldung passiert">
        <p>Wir prüfen jede glaubhafte Meldung. Unser übliches Vorgehen ist:</p>
        <ul>
          <li>
            <strong>Wir bestätigen sie.</strong> Wir bemühen uns,
            den Eingang einer per E-Mail eingegangenen Meldung so schnell wie möglich zu
            bestätigen, und wir priorisieren aktiven, laufenden Missbrauch gegenüber
            Routinearbeit.
          </li>
          <li>
            <strong>Wir untersuchen.</strong> Wir ermitteln den
            betroffenen Service, prüfen die Belege und stellen fest, ob gegen unsere Richtlinien
            oder gegen das Gesetz verstoßen wurde.
          </li>
          <li>
            <strong>Wir handeln verhältnismäßig.</strong> Je nach
            Schwere können wir den Kunden zur Behebung kontaktieren, bestimmte Inhalte entfernen
            oder deaktivieren, den Service sperren oder das Konto kündigen. Die Durchsetzung
            richtet sich nach Abschnitt 9 der Richtlinie zur zulässigen Nutzung.
          </li>
        </ul>

        <LegalSubSection title="5.1 Aktiver ausgehender Missbrauch: erst sperren">
          <p>
            Wenn ein Service in unserem Netzwerk die aktive Quelle ausgehenden Missbrauchs ist,
            etwa bei einem laufenden DDoS, einer laufenden Spam-Welle oder aktivem Scanning,
            sperren wir den Service zuerst und untersuchen danach, um andere Kunden und das
            Internet insgesamt zu schützen. Nach der Sperrung wenden wir uns umgehend an den
            betroffenen Kunden und erklären, was wir gefunden haben.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Was wir Ihnen sagen können">
          <p>
            Wir bestätigen, dass eine Meldung eingegangen ist und bearbeitet wurde, soweit uns
            das vernünftigerweise möglich ist. Wir geben weder die Kontodaten eines anderen
            Kunden noch die Einzelheiten einer Untersuchung noch das Ergebnis einer Durchsetzung
            gegenüber Dritten weiter, und wir können in dem, was wir offenlegen dürfen,
            eingeschränkt sein, solange eine Untersuchung läuft oder wo das Gesetz
            Vertraulichkeit verlangt.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Zusammenarbeit mit Registern & Behörden">
        <p>
          Wo es angemessen ist, arbeiten wir mit Abuse-Registern und Meldediensten zusammen und
          können relevante Logs und identifizierende Informationen an sie oder an die Betreiber
          betroffener Netzwerke weitergeben. Wir sichern Beweise und erstatten Meldung an die
          Strafverfolgungsbehörden, wo das Gesetz es verlangt oder wo das Verhalten es
          rechtfertigt.
        </p>
        <Callout tone="critical" title="Darstellungen sexuellen Kindesmissbrauchs">
          Wir haben null Toleranz gegenüber Darstellungen sexuellen Kindesmissbrauchs (CSAM).
          Bestätigtes CSAM wird unverzüglich an das National Center for Missing &amp; Exploited
          Children (NCMEC) und an die Strafverfolgungsbehörden gemeldet, das Konto wird
          gekündigt und Beweise werden gesichert. Um vermutetes CSAM auf unserer Infrastruktur
          zu melden, schreiben Sie an <Email name="abuse" /> mit
          &bdquo;CSAM&ldquo; in der Betreffzeile, oder melden Sie es direkt über die
          CyberTipline an NCMEC.
        </Callout>
      </LegalSection>

      <LegalSection number="7" title="Anfragen von Strafverfolgungsbehörden">
        <p>
          Strafverfolgungsbehörden, die Unterlagen oder deren Sicherung anfordern, wenden sich
          an uns unter{' '}
          <Email name="abuse" />{' '}
          mit &bdquo;Law Enforcement Request&ldquo; in der Betreffzeile. Wir reagieren auf
          gültige behördliche oder gerichtliche Anordnungen, die WSLATL LLC zugestellt werden,
          und wir sichern relevante Unterlagen auf ein angemessen eingegrenztes
          Sicherungsersuchen hin, solange die zutreffende Anordnung eingeholt wird. Wir legen
          keine Kundendaten ohne eine gültige behördliche oder gerichtliche Anordnung offen,
          außer wo das Gesetz es erlaubt oder verlangt, etwa in einem Notfall mit Lebensgefahr
          oder der Gefahr schwerer körperlicher Schäden.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Meldungen, die wir hier nicht bearbeiten können">
        <p>Manche Anliegen gehören in einen anderen Kanal:</p>
        <ul>
          <li>
            <strong>Urheberrecht.</strong> Urheberrechtliche
            Beschwerden und Gegendarstellungen laufen über unsere{' '}
            <Link href={siteConfig.paths.dmca}>DMCA-Richtlinie</Link>,
            nicht über diese Seite.
          </li>
          <li>
            <strong>Inhalte, die wir nicht hosten.</strong> Bei
            einer anderswo registrierten Domain, bei Inhalten in einem fremden Netzwerk oder bei
            einem Konto auf einer Plattform, die wir nicht betreiben, sind wir nicht der
            richtige Empfänger und können das Material nicht entfernen. Melden Sie es dem
            Betreiber des jeweiligen Dienstes.
          </li>
          <li>
            <strong>Fragen zu Abrechnung und Konto.</strong>{' '}
            Fragen zu Ihrem eigenen Service oder zur Abrechnung gehen an{' '}
            <Email name="support" />, nicht an den Abuse-Kanal.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Meldungen in gutem Glauben">
        <p>
          Melden Sie ehrlich und in gutem Glauben. Wissentlich falsche oder bösgläubige
          Missbrauchsmeldungen, Meldungen, die eingereicht werden, um einen anderen Kunden zu
          belästigen, und Versuche, diesen Kanal gegen einen Wettbewerber als Waffe einzusetzen,
          verbrauchen die Zeit, die wir sonst für echten Schaden aufwenden würden. Wir können es
          ablehnen, auf Meldungen aus einer Quelle zu reagieren, die dieses Verfahren wiederholt
          missbraucht hat.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese Missbrauchsrichtlinie aktualisieren, um Änderungen unserer Praktiken,
          unserer Services oder des geltenden Rechts abzubilden. Bei wesentlichen Änderungen
          aktualisieren wir das Datum des Inkrafttretens oben auf dieser Seite und
          veröffentlichen die aktualisierte Richtlinie unter{' '}
          <Link href={siteConfig.paths.abuse}>
            {siteConfig.siteUrl}{siteConfig.paths.abuse}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Kontakt">
        <p>
          Missbrauchsmeldungen gehen an unser Abuse-Team. Allgemeine Fragen zu dieser Richtlinie
          können Sie an die unten stehenden Adressen senden.
        </p>
        <CompanyContact>
          <InfoRow label="Missbrauch">
            <Email name="abuse" />
          </InfoRow>
          <InfoRow label="Allgemein">
            <Email name="support" /> oder <Email name="hello" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
