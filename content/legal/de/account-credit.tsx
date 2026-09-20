import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AccountCreditContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Diese Bedingungen für Guthaben regeln das Guthaben, das in Ihrem Abrechnungskonto bei
          WSLATL LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) geführt wird. Guthaben ist ein im Voraus bezahlter Saldo, den Sie
          auf WSLATL Rechnungen anrechnen können.
        </p>
        <p>
          Diese Bedingungen sind durch Verweis in unsere{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          einbezogen und Teil davon. Wo Guthaben als Ergebnis einer Erstattungsanfrage gewährt
          wird, regelt unsere{' '}
          <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link>,
          ob die Erstattung genehmigt wird, und diese Bedingungen regeln, was das daraus
          entstehende Guthaben ist und wie es sich verhält.
        </p>
        <p>Guthaben kann auf drei Wegen auf Ihr Konto gelangen:</p>
        <ul>
          <li>Sie kaufen es direkt als Aufladung über das Abrechnungsportal</li>
          <li>Wir stellen es Ihnen aus, etwa als Ergebnis einer genehmigten Erstattungsanfrage oder als Servicegutschrift nach unserem{' '}
            <Link href={siteConfig.paths.sla}>Service Level Agreement</Link>
          </li>
          <li>Ein anderer WSLATL Kunde schenkt es Ihnen und Sie nehmen das Geschenk an (siehe Abschnitt 5)</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="Was Guthaben nicht ist">
        <p>
          Guthaben ist gespeicherter Wert zur Verwendung für WSLATL Services. Es ist wichtig,
          dass Sie verstehen, was es nicht ist:
        </p>
        <Callout tone="caution" title="Kein Einlagenkonto">
          Guthaben ist keine Bankeinlage, wird nicht auf einem Einlagenkonto geführt, ist weder
          durch die FDIC noch durch einen anderen Versicherer abgesichert und ist kein von einer
          Bank ausgegebenes Instrument mit gespeichertem Wert. WSLATL ist keine Bank und kein
          Finanztransferdienstleister, und Ihr Guthaben ist nicht in der Weise geschützt, wie es
          bei einem Finanzinstitut verwahrte Mittel sind.
        </Callout>
        <ul>
          <li>
            <strong>Es wird nicht verzinst.</strong> Ein Guthaben
            erwirtschaftet keine Zinsen, keine Rendite und keinen sonstigen Ertrag, wie lange es
            auch gehalten wird.
          </li>
          <li>
            <strong>Es ist nicht in Bargeld auszahlbar.</strong>{' '}
            Guthaben kann nicht abgehoben, ausgezahlt, auf ein Bankkonto überwiesen oder auf das
            Zahlungsmittel zurückgeführt werden, mit dem es finanziert wurde.
          </li>
          <li>
            <strong>Es ist außerhalb von WSLATL nicht übertragbar.</strong>{' '}
            Guthaben darf nur auf WSLATL Rechnungen angerechnet oder wie in Abschnitt 5
            beschrieben an ein anderes WSLATL Konto verschenkt werden. Es kann nicht verkauft,
            abgetreten oder an Dritte übertragen werden.
          </li>
          <li>
            <strong>Es ist keine Kreditlinie.</strong> Guthaben ist
            Geld, das Sie oder jemand anderes bereits gezahlt hat oder das wir Ihnen bereits
            gewährt haben. Es erlaubt Ihnen nicht, einen negativen Saldo zu führen.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Guthaben kaufen & verwenden">

        <LegalSubSection title="3.1 Aufladungen">
          <p>
            Guthaben können Sie Ihrem Konto über das Abrechnungsportal unter{' '}
            <ShortLink name="billing" /> hinzufügen. Aufladungen werden zum Zeitpunkt des Kaufs
            über das von Ihnen gewählte Zahlungsmittel abgerechnet und Ihrem Saldo
            gutgeschrieben, sobald die Zahlung eingegangen ist.
          </p>
          <p>
            Aufladungsbeträge sind derzeit auf mindestens{' '}
            <strong>$5.00</strong> und höchstens{' '}
            <strong>$1,000.00</strong> pro Transaktion
            begrenzt. Diese Grenzen sind betrieblicher und nicht vertraglicher Natur und können
            im Portal jederzeit geändert werden. Das Portal zeigt die Grenzen an, die zum
            Zeitpunkt Ihres Kaufs gelten.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Wie Guthaben angerechnet wird">
          <p>
            Guthaben wird in Ihrer Kontowährung auf WSLATL Rechnungen angerechnet. Wo ein Saldo
            verfügbar ist, kann er je nach den Einstellungen Ihres Kontos automatisch auf
            Rechnungen angerechnet werden, sobald diese fällig werden, oder von Ihnen bei der
            Zahlung manuell angerechnet werden. Übersteigt eine Rechnung Ihr verfügbares
            Guthaben, wird der Rest über Ihr Zahlungsmittel abgerechnet.
          </p>
          <p>
            Die Anrechnung von Guthaben ändert keine andere Bedingung Ihres Service. Für
            Rechnungen, die mit Guthaben beglichen werden, gelten dieselben Nutzungsbedingungen,
            dieselbe Richtlinie zur zulässigen Nutzung und dieselbe Erstattungsrichtlinie wie
            für Rechnungen, die per Karte beglichen werden.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Transaktionsverlauf">
          <p>
            Jede Änderung Ihres Saldos wird in einem Transaktionsverlauf festgehalten, der in
            Ihrem Abrechnungsportal sichtbar ist und Datum, Betrag, Richtung der Bewegung und
            Grund zeigt. Der Verlauf ist der maßgebliche Nachweis Ihres Saldos. Wenn Sie
            glauben, dass ein Eintrag falsch ist, wenden Sie sich an uns unter{' '}
            <Email name="support" />{' '}
            und wir prüfen das.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Verfall & Erstattungsfähigkeit">
        <Callout tone="good" title="Guthaben verfällt nicht">
          Ihr Guthaben hat kein Verfallsdatum. Wir erheben keine Gebühren für ruhende Konten,
          keine Verwaltungsgebühren, keine Inaktivitätsgebühren und keinen sonstigen Abzug, der
          ein ungenutztes Guthaben mit der Zeit verringert. Guthaben bleibt verfügbar, solange
          Ihr Konto offen ist.
        </Callout>

        <LegalSubSection title="4.1 Guthaben ist nicht erstattungsfähig">
          <p>
            Gekauftes Guthaben ist{' '}
            <strong>nicht erstattungsfähig</strong>. Sobald eine
            Aufladung Ihrem Saldo gutgeschrieben wurde, machen wir den Kauf nicht rückgängig und
            zahlen das Geld nicht auf Ihr Zahlungsmittel zurück. Weil Guthaben nicht verfällt,
            bleibt ein ungenutzter Saldo Ihrer, um ihn für WSLATL Services auszugeben, statt zu
            verfallen.
          </p>
          <p>
            Guthaben, das wir Ihnen gewährt haben, und nicht Guthaben, das Sie gekauft haben,
            ist ebenfalls nicht in Bargeld auszahlbar. Dazu gehört Guthaben, das als Ergebnis
            einer genehmigten Erstattungsanfrage gewährt wurde, sowie Servicegutschriften, die
            nach unserem Service Level Agreement gewährt wurden.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Als Guthaben gewährte Erstattungen">
          <p>
            Wenn Sie eine Erstattung beantragen, ist ein mögliches Ergebnis, dass wir sie als
            Guthaben und nicht als Rückzahlung auf Ihr ursprüngliches Zahlungsmittel genehmigen.
            Als Guthaben gewährte Erstattungen unterliegen nach ihrer Gewährung diesen
            Bedingungen: Auf WSLATL Rechnungen sind sie anrechenbar, sie verfallen nicht und sie
            sind nicht in Bargeld auszahlbar. Unsere{' '}
            <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link>{' '}
            legt fest, wann welches Ergebnis gilt.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Guthaben an ein anderes Konto verschenken">
        <p>
          Sie können Guthaben aus Ihrem Saldo an ein anderes WSLATL Konto verschenken. Das
          Verschenken bewegt Wert zwischen Konten innerhalb unserer Plattform; es sendet kein
          Geld an eine Person und ist kein Zahlungsdienst.
        </p>
        <ul>
          <li>
            <strong>Sie müssen den Saldo haben.</strong> Der
            Geschenkbetrag wird in dem Moment von Ihrem verfügbaren Guthaben abgezogen, in dem
            Sie ihn senden. Sie können nicht mehr verschenken, als Sie halten.
          </li>
          <li>
            <strong>Die empfangende Person muss es annehmen.</strong> Ein
            Geschenk bleibt in der Schwebe, bis die empfangende Person es annimmt. Bis zur
            Annahme ist der Betrag für keine der beiden Seiten ausgebbar. Er ist auf Ihrem Saldo
            reserviert und noch nicht Teil des Saldos der empfangenden Person.
          </li>
          <li>
            <strong>Geschenke sind nach der Annahme endgültig.</strong>{' '}
            Sobald die empfangende Person ein Geschenk annimmt, gehört das Guthaben ihrem Konto.
            Wir machen ein angenommenes Geschenk auf Anfrage nicht rückgängig, auch nicht, wenn
            Sie es an das falsche Konto gesendet oder es sich anders überlegt haben. Prüfen Sie
            die empfangende Person, bevor Sie senden.
          </li>
          <li>
            <strong>Verschenken begründet keine Erstattungsrechte.</strong>{' '}
            Ein Geschenk ist kein Kauf durch die empfangende Person. Weder die sendende noch die
            empfangende Person erlangt hinsichtlich des geschenkten Betrags ein Erstattungsrecht
            über das hinaus, was der ursprüngliche Kauf mit sich brachte.
          </li>
          <li>
            <strong>Beide Konten müssen in einwandfreiem Status sein.</strong>{' '}
            Wir können ein Geschenk ablehnen oder zurückhalten, wenn eines der Konten gesperrt
            ist, überprüft wird oder mit einem Zahlungsstreit in Verbindung steht.
          </li>
        </ul>
        <p>
          Das Verschenken gibt es, damit Sie jemandem helfen können, den Sie kennen. Es zu
          nutzen, um Guthaben außerhalb unserer Plattform gegen Wert zu verkaufen, um Mittel
          zwischen unbeteiligten Parteien zu bewegen oder um die Herkunft einer Zahlung zu
          verschleiern, ist verboten und wird nach Abschnitt 6 behandelt.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Betrug, Chargebacks & Stornierung">
        <p>
          Wir behalten uns das Recht vor, Guthaben ganz oder teilweise zu stornieren,
          einzufrieren oder für ungültig zu erklären, wenn das Guthaben nicht rechtmäßig erlangt
          wurde oder wenn die zugrunde liegende Zahlung fehlgeschlagen ist. Das gilt
          insbesondere für:
        </p>
        <ul>
          <li>
            <strong>Zurückgebuchte oder stornierte Käufe.</strong>{' '}
            Wenn die Zahlung, die eine Aufladung finanziert hat, zurückgebucht, bestritten,
            storniert wird oder auf andere Weise fehlschlägt, nachdem das Guthaben
            gutgeschrieben wurde, entfernen wir das entsprechende Guthaben vom Saldo. Wurde das
            Guthaben bereits ausgegeben, wird der entstehende Fehlbetrag zu einem auf Ihrem
            Konto fälligen Betrag.
          </li>
          <li>
            <strong>Betrügerisch erlangtes Guthaben.</strong>{' '}
            Guthaben, das mit einem gestohlenen oder unbefugt genutzten Zahlungsmittel gekauft,
            durch falsche Angaben erlangt oder durch Ausnutzen eines Fehlers in unserem
            Abrechnungssystem erlangt wurde, kann unabhängig davon storniert werden, wie viel
            Zeit vergangen ist.
          </li>
          <li>
            <strong>Zur Umgehung einer Stornierung bewegtes Guthaben.</strong>{' '}
            Wo Guthaben, das einer Stornierung unterliegt, weiterverschenkt wurde, können wir es
            vom empfangenden Konto stornieren. Die Annahme eines Geschenks schützt das Guthaben
            nicht vor einer Stornierung, wenn es betrügerisch erlangt wurde.
          </li>
          <li>
            <strong>Irrtümlich gewährtes Guthaben.</strong> Guthaben,
            das Ihrem Konto durch einen Verwaltungs- oder Systemfehler gutgeschrieben wurde,
            kann berichtigt werden. Wir sagen Ihnen Bescheid, wenn wir das tun, und erklären die
            Berichtigung.
          </li>
        </ul>
        <p>
          Wo wir Guthaben stornieren, halten wir die Stornierung mit Begründung in Ihrem
          Transaktionsverlauf fest. Konten, die in Guthabenbetrug verwickelt sind, können
          zusätzlich nach Abschnitt 9.2 unserer{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          gesperrt oder gekündigt werden.
        </p>
        <p>
          Wenn Sie glauben, dass eine Belastung auf Ihrem Konto falsch ist, wenden Sie sich an
          uns, bevor Sie einen Chargeback einleiten. Wir prüfen einen Abrechnungsfehler nach
          Abschnitt 3.2 unserer{' '}
          <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link>{' '}
          und das geht schneller als ein Streitfall über Ihren Kartenherausgeber.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Kontoschließung">
        <p>
          Guthaben ist an Ihr WSLATL Konto gebunden. Es bleibt verfügbar, solange Ihr Konto
          offen ist, auch wenn Sie keine aktiven Services haben.
        </p>

        {/*
          OWNER DECISION NEEDED: what happens to a remaining credit balance on account closure.

          This has to be decided before publication because the answer has real consequences and
          there is no defensible default to fall back on. The realistic options are:

            (a) Balance is forfeited on closure. Simplest operationally, but forfeiture of
                prepaid stored value is restricted or prohibited in a number of US states and is
                the option most likely to attract unclaimed-property exposure.
            (b) Balance is paid out to the client on closure. Most client-friendly, but it turns
                credit into something cash-redeemable, which conflicts with the non-redeemable
                position taken in Section 2 and changes the analysis of what the product is.
            (c) Balance is held for a defined period after closure and restored if the client
                returns, then handled under the applicable state unclaimed-property law.

          Whichever is chosen, the text must also say who initiates closure (client request
          versus termination for cause) because the answer may differ between the two. Counsel
          should confirm the Missouri unclaimed-property treatment, and the treatment for any
          state where a meaningful number of clients are located, before this is filled in.

          Do not publish a number, a holding period, or a forfeiture rule here until that
          decision is made.
        */}
        <Callout tone="caution" title="Saldo bei Schließung: offen">
          Wie ein verbleibendes Guthaben behandelt wird, wenn ein Konto geschlossen wird, wird
          derzeit final geklärt und ist in diesem Dokument noch nicht festgelegt. Bis es hier
          veröffentlicht ist gilt: Wenn Sie Ihr Konto mit einem Saldo schließen, wenden Sie sich
          an uns unter <Email name="support" />, und wir regeln das direkt und nach Treu und
          Glauben mit Ihnen.
        </Callout>

        <p>
          Nichts in diesem Abschnitt beschränkt unser Recht, Guthaben nach Abschnitt 6 zu
          stornieren oder ein Guthaben auf Rechnungen anzurechnen, die zum Zeitpunkt der
          Schließung offen sind. Beträge, die Sie uns bei der Schließung schulden, bleiben nach
          Abschnitt 9.3 unserer Nutzungsbedingungen fällig und zahlbar.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Steuern">
        <p>
          Der Kauf von Guthaben ist für sich genommen nicht der Kauf einer steuerpflichtigen
          Leistung. Anfallende Steuern werden auf der Rechnung für den Service erhoben, auf den
          das Guthaben angerechnet wird, im Einklang mit Abschnitt 4.6 unserer{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>.
          Sie bleiben für alle Steuern verantwortlich, die auf Ihre Nutzung unserer Services
          anfallen.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Änderungen dieser Bedingungen">
        <p>
          Wir können diese Bedingungen für Guthaben aktualisieren, um Änderungen unserer
          Praktiken, unseres Abrechnungssystems oder des geltenden Rechts abzubilden. Bei
          wesentlichen Änderungen aktualisieren wir das Datum des Inkrafttretens oben auf dieser
          Seite, benachrichtigen aktive Kunden per E-Mail mit einer Zusammenfassung der
          Änderungen und veröffentlichen die aktualisierten Bedingungen unter{' '}
          <Link href={siteConfig.paths.accountCredit}>
            {siteConfig.siteUrl}{siteConfig.paths.accountCredit}
          </Link>.
        </p>
        <p>
          Wir werden kein Verfallsdatum, keine Gebühr für ruhende Konten und keinen sonstigen
          Abzug einführen, der ein bestehendes ungenutztes Guthaben verringert. Guthaben, das
          sich beim Wirksamwerden einer Änderung bereits auf Ihrem Konto befindet, behält die
          Behandlung, die es bei seiner Gewährung hatte, wenn diese Behandlung für Sie
          günstiger war.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Kontakt">
        <p>
          Fragen zu Ihrem Guthaben, zu einem Eintrag im Transaktionsverlauf oder zu einem
          Geschenk sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
