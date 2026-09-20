import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function SlaContent() {
  return (
    <>
      <LegalSection number="1" title="Überblick & Geltungsbereich">
        <p>
          Dieses Service Level Agreement (&bdquo;SLA&ldquo;) legt die Uptime-Ziele fest, die
          WSLATL LLC (&bdquo;WSLATL&ldquo;, &bdquo;wir&ldquo;, &bdquo;unser&ldquo; oder
          &bdquo;uns&ldquo;) für jeden Servicetyp zu erreichen anstrebt, wie wir mit
          Wartungsarbeiten umgehen und welche Servicegutschrift Sie geltend machen können,
          wenn wir diese Ziele verfehlen.
        </p>
        <Callout tone="note" title="Dies ist eine Wiedergabe, keine neue Zusage">
          Diese Seite gibt Abschnitt 5 unserer{' '}
          <Link href={siteConfig.paths.terms}>Nutzungsbedingungen</Link>{' '}
          als eigenständiges Dokument wieder, damit er leichter zu finden und zu zitieren ist.
          Die Zusagen hier sind dieselben Zusagen, die bereits in den Nutzungsbedingungen
          stehen. Es wurde nichts hinzugefügt, entfernt oder geändert. Sollten die beiden
          Dokumente jemals in Widerspruch zueinander stehen, sind die Nutzungsbedingungen
          maßgeblich.
        </Callout>
        <p>
          Dieses SLA gilt für Kunden mit aktiven, bezahlten Services in einwandfreiem Status.
          Es gilt nicht für gesperrte Services, Services in einer Nachfrist wegen Nichtzahlung,
          Test- oder Gratisvereinbarungen sowie Services, die aus wichtigem Grund gekündigt
          wurden.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Uptime-Ziele">
        <UptimeTable />
        <p>
          Die Uptime wird je Kalendermonat gemessen und schließt geplante Wartungsfenster sowie
          Ausfallzeiten aus, die durch Ereignisse außerhalb unseres zumutbaren Einflussbereichs
          verursacht werden (siehe Abschnitt 15 der Nutzungsbedingungen, Höhere Gewalt).
        </p>
      </LegalSection>

      <LegalSection number="3" title="Geplante Wartungsarbeiten">
        <p>
          Geplante Wartungsfenster kündigen wir mindestens{' '}
          <strong>24 Stunden im Voraus</strong> über
          unsere Statusseite (status.wslatl.com) und/oder per E-Mail an betroffene Kunden an.
          Notfallwartungen, die zum Schutz der Integrität oder Sicherheit der Services
          erforderlich sind, können ohne vorherige Ankündigung durchgeführt werden, wobei wir so
          schnell wie möglich informieren.
        </p>
        <p>
          Unsere Statusseite finden Sie unter{' '}
          <ShortLink name="status" />.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Servicegutschriften">
        <p>
          Verfehlen wir das jeweils geltende Uptime-Ziel aus einem von uns zu vertretenden
          Grund, können Sie je anerkanntem Vorfall eine Servicegutschrift in Höhe von{' '}
          <strong>10% der monatlichen Kosten des betroffenen Service</strong> verlangen.
          Gutschriften werden auf Ihrem Kontostand verbucht und überschreiten nicht die Kosten
          eines vollen Monats des betroffenen Service. Servicegutschriften sind Ihr einziger und
          ausschließlicher Rechtsbehelf bei Verfehlen der Uptime-Ziele und begründen keinen
          Anspruch auf eine Barerstattung.
        </p>
        <p>
          Um eine Gutschrift zu beantragen, wenden Sie sich innerhalb von 15 Tagen nach dem
          Vorfall unter <Email name="support" /> an uns und geben Sie Datum, Dauer und Art des
          Ausfalls an.
        </p>

        <LegalSubSection title="4.1 Wie Gutschriften geführt werden">
          <p>
            Eine nach diesem SLA ausgestellte Servicegutschrift wird als Guthaben auf Ihrem
            Kontostand verbucht. Einmal ausgestellt, verhält sie sich wie jedes andere Guthaben:
            Auf WSLATL Rechnungen ist sie anrechenbar, sie verfällt nicht und sie ist nicht in
            Bargeld auszahlbar. Die vollständige Regelung finden Sie in unseren{' '}
            <Link href={siteConfig.paths.accountCredit}>Bedingungen für Guthaben</Link>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Verhältnis zur Erstattungsrichtlinie">
          <p>
            Eine Servicegutschrift nach diesem SLA und eine Erstattung nach unserer{' '}
            <Link href={siteConfig.paths.refund}>Erstattungsrichtlinie</Link>{' '}
            sind getrennte Rechtsbehelfe. Wie in Abschnitt 3.1 der Erstattungsrichtlinie
            ausgeführt, kann ein Ausfall, der das jeweils geltende Uptime-Ziel überschreitet,
            innerhalb der 14-Tage-Frist zugleich ein anerkannter Grund für eine Erstattung sein,
            und dieses Erstattungsrecht besteht zusätzlich zur Servicegutschrift von 10% und
            nicht an deren Stelle. Über die Erstattungsfähigkeit wird nach der
            Erstattungsrichtlinie entschieden, nicht nach diesem SLA.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Ausschlüsse">
        <p>
          In Übereinstimmung mit Abschnitt 2 oben decken die Uptime-Ziele in diesem SLA keine
          Ausfallzeiten ab, die zurückzuführen sind auf:
        </p>
        <ul>
          <li>Geplante Wartungsfenster, die gemäß Abschnitt 3 angekündigt wurden</li>
          <li>Ereignisse außerhalb unseres zumutbaren Einflussbereichs, wie in Abschnitt 15 der Nutzungsbedingungen beschrieben</li>
        </ul>
        <p>
          Die Zeile zu Dedicated Servern in der Tabelle oben ist ein Ziel nach bestem Bemühen
          und kein gemessener Prozentsatz, weil die Verfügbarkeit von der Hardware und vom
          Rechenzentrum abhängt, in dem sie untergebracht ist.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Änderungen dieses SLA">
        <p>
          Da dieses Dokument Abschnitt 5 der Nutzungsbedingungen wiedergibt, erfolgen Änderungen
          der hier genannten Zusagen über die Nutzungsbedingungen und richten sich nach dem
          Ankündigungsverfahren in Abschnitt 14 der Nutzungsbedingungen. Ändern sich die
          Zusagen, aktualisieren wir das Datum des Inkrafttretens oben auf dieser Seite und
          veröffentlichen das aktualisierte SLA unter{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Kontakt">
        <p>
          Ansprüche auf Servicegutschriften und Fragen zu diesem SLA sind zu richten an:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
