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
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          Le présent accord de niveau de service (&laquo;&nbsp;SLA&nbsp;&raquo;) définit les
          objectifs de disponibilité que WSLATL LLC (&laquo;&nbsp;WSLATL&nbsp;&raquo;,
          &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou
          &laquo;&nbsp;nos&nbsp;&raquo;) vise à atteindre pour chaque type de service, notre façon
          de gérer la maintenance, et l&rsquo;avoir de service que vous pouvez demander quand nous
          manquons un objectif.
        </p>
        <Callout tone="note" title="Il s’agit d’une reprise, pas d’un nouvel engagement">
          Cette page reproduit la section 5 de nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>{' '}
          sous la forme d&rsquo;un document autonome, afin qu&rsquo;elle soit plus facile à trouver
          et à citer. Les engagements qui figurent ici sont les mêmes que ceux qui figurent déjà
          dans les Conditions. Rien n&rsquo;a été ajouté, retiré ni modifié. En cas de
          contradiction entre les deux documents, ce sont les Conditions de service qui prévalent.
        </Callout>
        <p>
          Le présent SLA s&rsquo;applique aux clients dont les services sont actifs, payés et en
          règle. Il ne s&rsquo;applique pas aux services suspendus, aux services placés dans un
          délai de grâce pour défaut de paiement, aux formules d&rsquo;essai ou consenties à titre
          gracieux, ni aux services résiliés pour juste motif.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Objectifs de disponibilité">
        <UptimeTable />
        <p>
          La disponibilité est mesurée par mois calendaire et exclut les fenêtres de maintenance
          planifiée ainsi que les périodes d&rsquo;indisponibilité causées par des événements
          échappant à notre contrôle raisonnable (voir la section 15 des Conditions de service,
          Force majeure).
        </p>
      </LegalSection>

      <LegalSection number="3" title="Maintenance planifiée">
        <p>
          Nous donnerons au moins{' '}
          <strong>24 heures de préavis</strong> pour
          les fenêtres de maintenance planifiée, via notre page d&rsquo;état (status.wslatl.com)
          et/ou par e-mail aux clients concernés. La maintenance d&rsquo;urgence nécessaire pour
          préserver l&rsquo;intégrité ou la sécurité du service peut être effectuée sans préavis,
          mais nous communiquerons aussi vite que possible.
        </p>
        <p>
          Notre page d&rsquo;état se trouve à l&rsquo;adresse{' '}
          <ShortLink name="status" />.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Avoirs de service">
        <p>
          Si nous n&rsquo;atteignons pas l&rsquo;objectif de disponibilité applicable par notre
          faute, vous pouvez demander un avoir de service égal à <strong>10&nbsp;% du coût mensuel du service concerné</strong> par
          incident éligible. Les avoirs sont portés au solde de votre compte et ne dépasseront pas
          le coût d&rsquo;un mois complet du service concerné. Les avoirs de service constituent
          votre seul et unique recours en cas de manquement aux objectifs de disponibilité et ne
          vous donnent droit à aucun remboursement en espèces.
        </p>
        <p>
          Pour demander un avoir, contactez-nous dans les 15 jours suivant l&rsquo;incident à <Email name="support" /> en
          indiquant la date, la durée et la nature de l&rsquo;interruption.
        </p>

        <LegalSubSection title="4.1 Comment les avoirs sont conservés">
          <p>
            Un avoir de service émis au titre du présent SLA est porté au solde de votre compte
            sous forme d&rsquo;avoir de compte. Une fois émis, il se comporte comme
            n&rsquo;importe quel autre avoir de compte&nbsp;: il est utilisable sur les factures
            WSLATL, il n&rsquo;expire pas et il n&rsquo;est pas échangeable contre des espèces.
            Consultez nos{' '}
            <Link href={siteConfig.paths.accountCredit}>Conditions de l&rsquo;avoir de compte</Link>{' '}
            pour le régime complet.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Articulation avec la Politique de remboursement">
          <p>
            Un avoir de service au titre du présent SLA et un remboursement au titre de notre{' '}
            <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>{' '}
            sont deux recours distincts. Comme l&rsquo;indique la section 3.1 de la Politique de
            remboursement, une interruption dépassant l&rsquo;objectif de disponibilité applicable
            peut également constituer un motif éligible à un remboursement pendant le délai de
            14 jours, et ce droit au remboursement s&rsquo;ajoute à l&rsquo;avoir de service de
            10&nbsp;% au lieu de s&rsquo;y substituer. L&rsquo;éligibilité au remboursement est
            déterminée au titre de la Politique de remboursement, et non du présent SLA.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Exclusions">
        <p>
          Conformément à la section 2 ci-dessus, les objectifs de disponibilité du présent SLA ne
          couvrent pas les périodes d&rsquo;indisponibilité imputables à&nbsp;:
        </p>
        <ul>
          <li>Les fenêtres de maintenance planifiée notifiées conformément à la section 3</li>
          <li>Les événements échappant à notre contrôle raisonnable, tels que décrits à la section 15 des Conditions de service</li>
        </ul>
        <p>
          La ligne des serveurs dédiés dans le tableau ci-dessus correspond à un objectif au mieux
          (best-effort) plutôt qu&rsquo;à un pourcentage mesuré, car la disponibilité dépend du
          matériel et du datacenter qui l&rsquo;héberge.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Modifications du présent SLA">
        <p>
          Parce que ce document reprend la section 5 des Conditions de service, les modifications
          des engagements qui y figurent passent par les Conditions et suivent la procédure de
          notification prévue à la section 14 des Conditions de service. Lorsque les engagements
          changent, nous mettrons à jour la date d&rsquo;effet en haut de cette page et publierons
          le SLA mis à jour à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contact">
        <p>
          Les demandes d&rsquo;avoir de service et les questions relatives au présent SLA doivent
          être adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
