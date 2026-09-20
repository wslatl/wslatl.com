import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function DmcaContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          WSLATL LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) achtet die geistigen Eigentumsrechte anderer und erwartet von
          unseren Kunden dasselbe. Diese DMCA-Richtlinie erklärt, wie Sie Material melden, das
          auf WSLATL Infrastruktur gehostet wird und nach Ihrer Auffassung Ihr Urheberrecht
          verletzt, wie ein Kunde einer Entfernung widersprechen kann und wie wir mit Kunden
          umgehen, die wiederholt Rechte verletzen.
        </p>
        <p>
          Diese Richtlinie ist auf den Digital Millennium Copyright Act,
          17 U.S.C. &sect;&nbsp;512, abgestimmt. Sie ersetzt und erweitert die Zusammenfassung,
          die zuvor in Abschnitt 8 unserer{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          enthalten war, und ist durch Verweis in diese Nutzungsbedingungen einbezogen.
        </p>
        <p>
          WSLATL ist ein Hosting-Anbieter. In den meisten Fällen erstellen, wählen oder prüfen
          wir das Material nicht, das Kunden auf unserer Infrastruktur speichern. Wir handeln
          auf urheberrechtliche Beschwerden hin, die den nachstehenden Anforderungen genügen.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Benannter Urheberrechtsvertreter">
        <p>
          Beschwerden wegen behaupteter Rechtsverletzung sind an unseren benannten Vertreter zu
          senden. Beschwerden, die an andere Adressen, an einzelne Mitarbeiter oder an unseren
          Discord-Server gehen, können sich verzögern und werden möglicherweise nicht als
          wirksame Beschwerde behandelt.
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
        <InfoCard title="Benannter Urheberrechtsvertreter">
          <InfoRow label="Vertreter">
            WSLATL Copyright Agent
          </InfoRow>
          <InfoRow label="Unternehmen">
            WSLATL LLC
          </InfoRow>
          <InfoRow label="Postanschrift">
            2414 County Road 1310, Moberly, MO 65270, United States
          </InfoRow>
          <InfoRow label="Telefon">
            1-660-998-8016
          </InfoRow>
          <InfoRow label="E-Mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Betreffzeile">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>

        <Callout tone="caution" title="Stand der Registrierung des Vertreters">
          Die Kontaktdaten oben sind der Kanal, den wir auf urheberrechtliche Beschwerden
          überwachen. Wir behaupten auf dieser Seite nicht, dass eine Registrierung des
          benannten Vertreters beim United States Copyright Office abgeschlossen wurde. Wenn Sie
          den aktuellen Stand der Registrierung bestätigt haben möchten, bevor Sie eine
          Beschwerde zustellen, wenden Sie sich an uns unter <Email name="support" />, und wir
          sagen es Ihnen.
        </Callout>
      </LegalSection>

      <LegalSection number="3" title="Eine urheberrechtliche Beschwerde einreichen">
        <p>
          Um nach 17 U.S.C. &sect;&nbsp;512(c)(3) wirksam zu sein, muss eine Beschwerde wegen
          behaupteter Rechtsverletzung eine schriftliche Mitteilung sein, die im Wesentlichen
          alle der folgenden sechs Elemente enthält:
        </p>
        <ol>
          <li>
            Eine eigenhändige oder elektronische Unterschrift einer Person, die befugt ist, im
            Namen des Inhabers eines angeblich verletzten ausschließlichen Rechts zu handeln.
          </li>
          <li>
            Die Bezeichnung des urheberrechtlich geschützten Werks, dessen Verletzung behauptet
            wird. Wenn mehrere Werke an einem einzigen Ort von einer Beschwerde erfasst werden,
            eine repräsentative Liste dieser Werke an diesem Ort.
          </li>
          <li>
            Die Bezeichnung des Materials, das angeblich rechtsverletzend ist oder Gegenstand
            rechtsverletzender Tätigkeit ist, sowie Angaben, die vernünftigerweise ausreichen,
            damit wir es auffinden können. Eine direkte URL, IP-Adresse mit Port, ein Dateipfad
            oder eine Serverkennung ist die nützlichste Form.
          </li>
          <li>
            Angaben, die vernünftigerweise ausreichen, damit wir Sie kontaktieren können,
            einschließlich Ihres Namens, Ihrer Anschrift, Ihrer Telefonnummer und, sofern
            vorhanden, einer E-Mail-Adresse.
          </li>
          <li>
            Eine Erklärung, dass Sie in gutem Glauben davon ausgehen, dass die beanstandete
            Nutzung des Materials nicht vom Urheberrechtsinhaber, seinem Vertreter oder vom
            Gesetz gestattet ist.
          </li>
          <li>
            Eine Erklärung, dass die Angaben in der Beschwerde zutreffend sind, und, unter
            Strafandrohung wegen Meineids, dass Sie befugt sind, im Namen des Inhabers eines
            angeblich verletzten ausschließlichen Rechts zu handeln.
          </li>
        </ol>
        <p>
          Eine Beschwerde, die nicht im Wesentlichen allen sechs Elementen genügt, wird
          möglicherweise nicht als wirksame Beschwerde behandelt. Ist Ihre Beschwerde
          unvollständig, teilen wir Ihnen mit, was fehlt, soweit uns das vernünftigerweise
          möglich ist.
        </p>

        <LegalSubSection title="3.1 Was als Nächstes passiert">
          <p>
            Nach Eingang einer ordnungsgemäßen Beschwerde entfernen wir das bezeichnete Material
            unverzüglich oder sperren den Zugang dazu, und wir unternehmen angemessene Schritte,
            um den betroffenen Kunden darüber zu informieren, dass das Material entfernt oder
            gesperrt wurde. Je nach Service kann die Entfernung darin bestehen, eine bestimmte
            Datei zu entfernen, eine bestimmte Anwendung zu deaktivieren oder den betroffenen
            Service zu sperren, wenn sich das Material nicht isolieren lässt.
          </p>
          <p>
            Wir leiten eine Kopie der Beschwerde einschließlich der darin enthaltenen
            Kontaktdaten an den betroffenen Kunden weiter. Nehmen Sie keine Angaben in eine
            Beschwerde auf, die Sie nicht mit dem Kunden teilen möchten.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Falschdarstellung">
          <p>
            Nach 17 U.S.C. &sect;&nbsp;512(f) kann jede Person, die wissentlich in wesentlicher
            Hinsicht falsch darstellt, dass Material rechtsverletzend sei oder dass Material
            irrtümlich oder aufgrund einer Verwechslung entfernt oder gesperrt worden sei, für
            Schäden einschließlich Kosten und Anwaltskosten haften. Bitte prüfen Sie vor dem
            Einreichen, ob die von Ihnen gemeldete Nutzung vom Urheberrechtsinhaber, durch
            Lizenz oder durch Gesetz gestattet sein könnte.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Gegendarstellung">
        <p>
          Wenn Sie WSLATL Kunde sind und Material von Ihnen entfernt oder gesperrt wurde und Sie
          der Auffassung sind, dass die Entfernung auf einem Irrtum oder einer Verwechslung
          beruht, können Sie bei unserem benannten Vertreter unter der Anschrift in Abschnitt 2
          eine Gegendarstellung einreichen.
        </p>
        <p>
          Um nach 17 U.S.C. &sect;&nbsp;512(g)(3) wirksam zu sein, muss eine Gegendarstellung
          eine schriftliche Mitteilung sein, die im Wesentlichen alles Folgende enthält:
        </p>
        <ol>
          <li>Ihre eigenhändige oder elektronische Unterschrift.</li>
          <li>
            Die Bezeichnung des Materials, das entfernt wurde oder zu dem der Zugang gesperrt
            wurde, sowie den Ort, an dem das Material erschien, bevor es entfernt oder der
            Zugang dazu gesperrt wurde.
          </li>
          <li>
            Eine Erklärung unter Strafandrohung wegen Meineids, dass Sie in gutem Glauben davon
            ausgehen, dass das Material infolge eines Irrtums oder einer Verwechslung des
            Materials entfernt oder gesperrt wurde.
          </li>
          <li>
            Ihren Namen, Ihre Anschrift und Ihre Telefonnummer sowie eine Erklärung, dass Sie
            sich der Zuständigkeit des Federal District Court für den Gerichtsbezirk
            unterwerfen, in dem Ihre Anschrift liegt, oder, wenn Ihre Anschrift außerhalb der
            Vereinigten Staaten liegt, für jeden Gerichtsbezirk, in dem WSLATL LLC angetroffen
            werden kann, und dass Sie die Zustellung von Schriftstücken durch die Person
            annehmen, die die ursprüngliche Beschwerde eingereicht hat, oder durch einen
            Vertreter dieser Person.
          </li>
        </ol>

        <LegalSubSection title="4.1 Fristen für die Wiederherstellung">
          <p>
            Nach Eingang einer ordnungsgemäßen Gegendarstellung stellen wir der Person, die die
            ursprüngliche Beschwerde eingereicht hat, umgehend eine Kopie zur Verfügung und
            teilen ihr mit, dass wir das entfernte Material wieder einstellen oder die Sperrung
            des Zugangs dazu aufheben werden.
          </p>
          <p>
            Nach 17 U.S.C. &sect;&nbsp;512(g)(2)(C) stellen wir das entfernte Material wieder
            ein oder geben den Zugang{' '}
            <strong>
              nicht weniger als 10 und nicht mehr als 14 Werktage
            </strong>{' '}
            nach Eingang der Gegendarstellung wieder frei, es sei denn, unser benannter
            Vertreter erhält zuvor eine Mitteilung der ursprünglich beschwerdeführenden Partei,
            dass diese Klage erhoben hat, um eine gerichtliche Anordnung zu erwirken, die dem
            Kunden rechtsverletzende Handlungen in Bezug auf das Material auf unserer
            Infrastruktur untersagt.
          </p>
          <p>
            Die Wiederherstellung setzt voraus, dass der Service noch aktiv und in einwandfreiem
            Status ist. Material kann nicht aus einem Service wiederhergestellt werden, der
            gekündigt wurde oder dessen Daten nach unseren Aufbewahrungsregeln bereits gelöscht
            wurden, und eine Gegendarstellung setzt weder die Abrechnung noch eine Sperrung
            wegen Nichtzahlung noch eine gesonderte Durchsetzungsmaßnahme aus, die nach unserer{' '}
            <Link href={siteConfig.paths.acceptableUse}>Richtlinie zur zulässigen Nutzung</Link>{' '}
            ergriffen wurde.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Falschdarstellung in einer Gegendarstellung">
          <p>
            Die Sanktionen nach 17 U.S.C. &sect;&nbsp;512(f) gelten für Gegendarstellungen
            ebenso wie für Beschwerden. Eine Gegendarstellung einzureichen, die wissentlich in
            wesentlicher Hinsicht falsch darstellt, dass Material irrtümlich oder aufgrund einer
            Verwechslung entfernt wurde, kann Sie einer Haftung für Schäden aussetzen.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Richtlinie zu wiederholten Verstößen">
        <p>
          Wie von 17 U.S.C. &sect;&nbsp;512(i) verlangt, hat WSLATL eine Richtlinie verabschiedet
          und setzt sie in angemessener Weise um, die unter geeigneten Umständen die Kündigung
          der Konten von Kunden vorsieht, die wiederholt Rechte verletzen.
        </p>
        <p>Wie wir diese Richtlinie umsetzen:</p>
        <ul>
          <li>
            <strong>Wir erfassen jede Beschwerde.</strong> Jede
            ordnungsgemäße Beschwerde, auf die wir hin handeln, wird dem Kundenkonto zugeordnet,
            das für den betroffenen Service verantwortlich ist.
          </li>
          <li>
            <strong>Wir informieren den Kunden.</strong> Der Kunde
            wird über die Beschwerde informiert, darüber, was entfernt oder gesperrt wurde, und
            darüber, dass die Beschwerde seinem Konto zugeordnet wurde.
          </li>
          <li>
            <strong>Wiederholte Beschwerden eskalieren.</strong>{' '}
            Weitere ordnungsgemäße Beschwerden gegen dasselbe Konto führen zu eskalierenden
            Maßnahmen, die eine förmliche Verwarnung, die Sperrung des betroffenen Service und
            die Kündigung des Kontos umfassen können.
          </li>
          <li>
            <strong>Erfolgreiche Gegendarstellungen zählen nicht.</strong>{' '}
            Eine Beschwerde, die zurückgenommen wird oder die durch eine Gegendarstellung ohne
            nachfolgendes Gerichtsverfahren zugunsten des Kunden erledigt wird, wird dem Konto
            nicht angerechnet.
          </li>
          <li>
            <strong>Schwerwiegende Fälle wirken sofort.</strong>{' '}
            Wo die Rechtsverletzung eklatant ist, gewerbliches Ausmaß hat oder mit weiteren
            Verstößen gegen unsere Richtlinie zur zulässigen Nutzung einhergeht, können wir ein
            Konto kündigen, ohne eine weitere Beschwerde abzuwarten.
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
        <p>
          Eine Kündigung nach diesem Abschnitt ist eine Kündigung aus wichtigem Grund. Wie in
          unserer{' '}
          <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link>{' '}
          dargelegt, sind Services, die wegen Verstößen gegen unsere Nutzungsbedingungen oder
          unsere Richtlinie zur zulässigen Nutzung gekündigt wurden, nicht erstattungsfähig.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Material, das wir nicht kontrollieren">
        <p>
          WSLATL stellt Infrastruktur bereit. Wo ein Kunde seinen eigenen Dienst auf dieser
          Infrastruktur betreibt und steuert, was darauf gespeichert wird, ist der Kunde die für
          das Material verantwortliche Partei. Wo wir den Kunden ermitteln können, leiten wir
          Ihre Beschwerde an ihn weiter und erwarten, dass er darauf reagiert.
        </p>
        <p>
          Für Dienste, die wir nicht hosten, einschließlich anderswo registrierter Domains, über
          ein fremdes Netzwerk ausgelieferter Inhalte oder Konten auf Plattformen, die wir nicht
          betreiben, sind wir nicht der richtige Empfänger Ihrer Beschwerde und können das
          Material nicht entfernen. Bitte richten Sie Ihre Beschwerde an den Betreiber des
          jeweiligen Dienstes.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Marken- und sonstige Beschwerden">
        <p>
          Diese Richtlinie betrifft ausschließlich das Urheberrecht. Beschwerden über
          Markenrechtsverletzungen, Verleumdung, Verletzungen der Privatsphäre oder sonstige
          rechtswidrige Inhalte senden Sie bitte an{' '}
          <Email name="support" />{' '}
          mit einer klaren Beschreibung des Materials, seines Orts und der rechtlichen Grundlage
          Ihrer Beschwerde. Diese Beschwerden werden nach unserer{' '}
          <Link href={siteConfig.paths.acceptableUse}>Richtlinie zur zulässigen Nutzung</Link>{' '}
          und nicht nach dem DMCA behandelt.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Änderungen dieser Richtlinie">
        <p>
          Wir können diese DMCA-Richtlinie aktualisieren, um Änderungen unserer Praktiken oder
          des geltenden Rechts abzubilden. Bei wesentlichen Änderungen aktualisieren wir das
          Datum des Inkrafttretens oben auf dieser Seite und veröffentlichen die aktualisierte
          Richtlinie unter{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Kontakt">
        <p>
          Urheberrechtliche Beschwerden und Gegendarstellungen gehen an den in Abschnitt 2
          aufgeführten benannten Vertreter. Allgemeine Fragen zu dieser Richtlinie können Sie
          senden an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
