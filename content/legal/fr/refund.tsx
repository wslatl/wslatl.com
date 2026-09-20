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
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          La présente politique de remboursement régit toutes les demandes de remboursement
          portant sur les services fournis par WSLATL LLC (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;). Elle s&rsquo;applique
          aux serveurs dédiés, à l&rsquo;hébergement de serveurs de jeu, à l&rsquo;hébergement VPS
          et aux services d&rsquo;hébergement web.
        </p>
        <p>
          La présente politique est incorporée à nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link> par référence et en fait partie intégrante.
          Les règles ci-dessous font foi en matière d&rsquo;éligibilité au remboursement, de délais
          et de traitement. En cas de contradiction entre la présente politique de remboursement et
          tout autre document WSLATL, c&rsquo;est la présente politique de remboursement qui prévaut.
        </p>
        <p>
          Nous sommes un petit hébergeur privé. La présente politique existe pour être équitable,
          pas conflictuelle. Nous traiterons toujours les demandes de remboursement honnêtement et
          de bonne foi. Si un point n&rsquo;est pas couvert ci-dessous, contactez-nous et nous le
          réglerons directement avec vous.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Délais de remboursement">
        <p>
          Nous appliquons un délai de remboursement à deux niveaux, calculé à partir de la date de
          votre achat initial du service. Les deux niveaux sont résumés ci-dessous&nbsp;:
        </p>

        <ScrollTable label="Délais de remboursement">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Délai</th>
                <th scope="col">Éligibilité</th>
                <th scope="col">Montant du remboursement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">0 à 48 heures</td>
                <td>Pour n&rsquo;importe quelle raison, y compris un changement d&rsquo;avis. Sans justification.</td>
                <td>Remboursement intégral</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">49 heures à 14 jours</td>
                <td>Au cas par cas. Seuls les motifs éligibles listés à la section 3 s&rsquo;appliquent.</td>
                <td>Remboursement intégral pour les services éligibles</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Après 14 jours</td>
                <td>Aucun remboursement.</td>
                <td>Aucun</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>
          La <strong>date d&rsquo;achat initial</strong> est la date
          à laquelle le service a été activé et provisionné pour vous pour la première fois, et non
          la date d&rsquo;un renouvellement ultérieur. Les renouvellements réinitialisent leur
          propre délai de 14 jours (voir la section 9).
        </p>

        <LegalSubSection title="2.1 Délai de 48 heures, pour n’importe quelle raison">
          <p>
            Si vous demandez un remboursement dans les{' '}
            <strong>48 heures</strong> suivant la date
            d&rsquo;achat initial d&rsquo;un service, nous procéderons à un remboursement intégral.
            C&rsquo;est le délai de changement d&rsquo;avis. Nous n&rsquo;exigerons pas de motif et
            nous ne vous demanderons pas de justifier votre décision.
          </p>
          <p>
            Les éléments listés à la section 5 (Éléments non remboursables) sont exclus, même
            pendant le délai de 48 heures. En particulier, les serveurs dédiés ne sont remboursables
            en aucune circonstance (voir la section 5.1).
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Délai de 14 jours, au cas par cas">
          <p>
            Entre <strong>49 heures et 14 jours calendaires</strong>{' '}
            après la date d&rsquo;achat initial, les remboursements intégraux ne sont accordés que
            pour les motifs éligibles précis listés à la section 3. Les demandes de remboursement
            qui sortent de ces motifs ne sont pas éligibles pendant ce délai.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Motifs éligibles (délai de 14 jours)">
        <p>
          Les motifs suivants ouvrent droit à un remboursement intégral pendant le délai de 14
          jours au cas par cas. Nous pouvons vous demander de fournir des éléments justificatifs
          (horodatages, messages d&rsquo;erreur, historique de tickets, etc.) pour vérifier le
          motif.
        </p>

        <LegalSubSection title="3.1 Interruption de service dépassant le SLA">
          <p>
            Si votre service subit une interruption qui dépasse l&rsquo;objectif de disponibilité
            applicable dans notre{' '}
            <Link href={siteConfig.paths.sla}>Accord de niveau de service</Link>{' '}
            ({uptimeTarget('vps')} pour l&rsquo;hébergement VPS et web, {uptimeTarget('game')} pour l&rsquo;hébergement de serveurs de jeu), vous pouvez demander un
            remboursement intégral du service concerné. Les interruptions causées par des
            événements échappant à notre contrôle raisonnable (force majeure) n&rsquo;ouvrent pas
            droit au remboursement.
          </p>
          <p>
            Pour ouvrir droit au remboursement, l&rsquo;interruption doit être vérifiable via notre
            page d&rsquo;état, nos systèmes de supervision, ou vos propres éléments documentés.
            L&rsquo;avoir SLA de 10&nbsp;% décrit dans l&rsquo;Accord de niveau de service reste
            disponible comme recours distinct&nbsp;; ce droit au remboursement s&rsquo;y ajoute, il
            ne s&rsquo;y substitue pas.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Erreur de facturation">
          <p>
            Si vous avez été débité d&rsquo;un montant incorrect, facturé deux fois, ou facturé
            pour un service que vous n&rsquo;avez pas autorisé, vous êtes éligible à un
            remboursement intégral du débit erroné. Cela s&rsquo;applique quel que soit le délai
            dans lequel l&rsquo;erreur est découverte. Merci de signaler les erreurs de facturation
            présumées dès que vous les remarquez.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Le service n’a pas fonctionné">
          <p>
            Si le service que vous avez acheté n&rsquo;a jamais fonctionné ou présentait un défaut
            critique que nous n&rsquo;avons pas pu résoudre, vous pouvez être éligible à un
            remboursement intégral.
          </p>
          <p>
            <strong>Vous devez nous avoir contactés au préalable.</strong>{' '}
            Pour être éligible au titre de la présente section, vous devez avoir fait un effort
            raisonnable pour nous joindre au sujet du problème avant de demander un remboursement.
            Les canaux de contact acceptables sont&nbsp;:
          </p>
          <ul>
            <li>Un ticket de support ouvert dans notre portail de facturation</li>
            <li>Un e-mail à <Email name="support" /></li>
            <li>Un message sur notre serveur Discord ou un message privé à notre équipe</li>
          </ul>
          <p>
            Nous avons besoin de voir une preuve de contact (un numéro de ticket, un fil
            d&rsquo;e-mails ou un historique de messages) pour confirmer que nous avons eu la
            possibilité de diagnostiquer et de corriger le problème. Les demandes de remboursement
            sur ce fondement, sans aucune tentative de contact préalable, seront refusées.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Changement d’avis">
        <p>
          Le changement d&rsquo;avis n&rsquo;est un motif éligible que pendant le délai de 48
          heures décrit à la section 2.1. Une fois 48 heures écoulées depuis la date d&rsquo;achat
          initial, le changement d&rsquo;avis n&rsquo;est pas un motif éligible à un remboursement
          au titre de la présente politique.
        </p>
        <p>
          Si vous n&rsquo;êtes pas sûr qu&rsquo;un service vous convienne, nous vous recommandons
          vivement de nous contacter sur Discord avant d&rsquo;acheter. Nous répondons volontiers
          aux questions techniques et nous vous aidons à choisir la bonne offre. Le processus
          d&rsquo;inscription uniquement sur candidature est aussi une bonne occasion de poser des
          questions et de vérifier que cela vous convient.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Éléments non remboursables">
        <p>
          Les éléments suivants sont <strong>non remboursables</strong>{' '}
          quelles que soient les circonstances. Cette liste s&rsquo;applique aussi bien au délai de
          48 heures qu&rsquo;à celui de 14 jours.
        </p>

        <Callout tone="critical" title="5.1 Serveurs dédiés">
          Les serveurs dédiés ne sont éligibles à aucun remboursement, à aucun moment et pour
          aucun motif. L&rsquo;approvisionnement en matériel, les attributions d&rsquo;adresses
          IP, l&rsquo;espace en baie en datacenter et les engagements de bande passante sont pris
          en partant du principe d&rsquo;une occupation de longue durée. Cette exclusion
          s&rsquo;applique même pendant le délai de changement d&rsquo;avis de 48 heures.
        </Callout>

        <ul>
          <li>
            <strong>Frais d&rsquo;installation et provisionnement sur mesure&nbsp;:</strong>{' '}
            Frais d&rsquo;installation uniques, installation du système d&rsquo;exploitation,
            travaux de configuration sur mesure, migrations manuelles et autres frais non
            récurrents similaires. Ils couvrent une main-d&rsquo;œuvre et des ressources qui ne
            peuvent pas être récupérées une fois engagées.
          </li>
          <li>
            <strong>Frais de licence de tiers&nbsp;:</strong>{' '}
            Coûts refacturés que nous ne pouvons pas récupérer auprès de l&rsquo;éditeur, y compris
            les licences cPanel, les licences Pterodactyl et les autres logiciels que nous
            revendons dans le cadre d&rsquo;une offre.
          </li>
          <li>
            <strong>Frais d&rsquo;enregistrement et de renouvellement de domaine&nbsp;:</strong>{' '}
            Tous frais liés à un domaine engagés par notre intermédiaire. Les enregistrements de
            domaine passent par un bureau d&rsquo;enregistrement et sont régis par les propres
            conditions de remboursement de ce bureau d&rsquo;enregistrement.
          </li>
          <li>
            <strong>Options déjà consommées&nbsp;:</strong>{' '}
            Adresses IP supplémentaires, dépassements de bande passante, restaurations de
            sauvegarde, et tous autres frais d&rsquo;option à la consommation ou ponctuels déjà
            fournis ou engagés au moment de la demande de remboursement.
          </li>
          <li>
            <strong>Services résiliés pour violation de la politique d&rsquo;usage acceptable ou des Conditions&nbsp;:</strong>{' '}
            Si votre service a été suspendu ou résilié en raison d&rsquo;une violation de notre{' '}
            <Link href={siteConfig.paths.acceptableUse}>Politique d&rsquo;usage acceptable</Link>{' '}
            ou de nos Conditions de service, aucun remboursement ne sera accordé. Cela
            s&rsquo;applique même si la résiliation est intervenue dans les 48 heures ou pendant le
            délai de 14 jours.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Comment demander un remboursement">
        <p>
          Pour demander un remboursement, contactez-nous par l&rsquo;un des canaux suivants. Le
          ticket dans le portail de facturation est préférable car il nous donne l&rsquo;accès le
          plus direct à votre compte et à votre historique de factures.
        </p>
        <ul>
          <li>
            <strong>Ticket dans le portail de facturation&nbsp;:</strong> Connectez-vous à{' '}
            <ShortLink name="billing" />{' '}
            et ouvrez un ticket de support
          </li>
          <li>
            <strong>E-mail&nbsp;:</strong>{' '}
            <Email name="support" />
          </li>
          <li>
            <strong>Discord&nbsp;:</strong>{' '}
            <ShortLink name="discord" />
          </li>
        </ul>
        <p>
          Pour nous aider à traiter votre demande rapidement, merci d&rsquo;inclure&nbsp;:
        </p>
        <ul>
          <li>L&rsquo;adresse e-mail de votre compte WSLATL</li>
          <li>Le service pour lequel vous demandez un remboursement</li>
          <li>Le ou les numéros de facture concernés</li>
          <li>Le motif du remboursement</li>
          <li>Tout élément justificatif (numéros de ticket, logs d&rsquo;erreur, captures d&rsquo;écran) pour les demandes relevant de la section 3</li>
        </ul>
        <p>
          Les demandes de remboursement sont généralement examinées dans les{' '}
          <strong>5 jours ouvrés</strong> suivant leur
          réception. Nous vous répondrons avec une décision et, en cas d&rsquo;approbation, un
          délai de traitement estimé.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Traitement et mode de remboursement">
        <p>
          Un remboursement approuvé est effectué sous l&rsquo;une des deux formes
          suivantes&nbsp;: restitution sur le moyen de paiement d&rsquo;origine, ou avoir de
          compte. Nous vous indiquerons la forme applicable lorsque nous approuverons votre demande.
        </p>

        <LegalSubSection title="7.1 Remboursement sur le moyen de paiement d’origine">
          <p>
            Lorsqu&rsquo;un remboursement est restitué sur votre moyen de paiement, il est versé
            sur le{' '}
            <strong>moyen de paiement d&rsquo;origine</strong> utilisé
            pour l&rsquo;achat. Nous ne remboursons pas sur une carte ou un compte autre que celui
            initialement débité.
          </p>
          <p>
            Une fois le remboursement émis, le délai de traitement dépend de votre prestataire de
            paiement&nbsp;:
          </p>
          <ul>
            <li>Les remboursements par carte de crédit et de débit apparaissent généralement sous <strong>5 à 10 jours ouvrés</strong>, selon l&rsquo;émetteur</li>
            <li>Les remboursements par virement bancaire et ACH peuvent prendre jusqu&rsquo;à 10 jours ouvrés</li>
            <li>Les remboursements passant par toute autre plateforme de paiement que nous acceptons sont soumis au délai de traitement de cette plateforme</li>
          </ul>
          <p>
            Si un remboursement n&rsquo;est pas apparu sur votre relevé au bout de 15 jours ouvrés,
            contactez-nous et nous enquêterons auprès du prestataire de paiement.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.2 Remboursement sous forme d’avoir de compte">
          <p>
            Nous pouvons au contraire approuver un remboursement sous la forme d&rsquo;un{' '}
            <strong>avoir de compte</strong>, ajouté au
            solde de votre compte WSLATL. L&rsquo;avoir de compte est dépensable sur n&rsquo;importe
            quelle facture WSLATL et il n&rsquo;expire pas, mais il n&rsquo;est{' '}
            <strong>pas échangeable contre des espèces</strong> et
            ne peut pas être retiré vers un compte bancaire ou une carte. Les conditions complètes
            figurent sur notre page{' '}
            <Link href={siteConfig.paths.accountCredit}>Avoir de compte</Link>.
          </p>
          <p>
            L&rsquo;avoir de compte est l&rsquo;issue appropriée dans des situations telles que
            celles-ci&nbsp;:
          </p>
          <ul>
            <li>Vous avez demandé un avoir plutôt qu&rsquo;un remboursement en argent, parce que vous comptez continuer à héberger chez nous</li>
            <li>Le moyen de paiement d&rsquo;origine est clôturé, expiré, ou ne peut plus accepter de restitution</li>
            <li>Le débit initial a été réglé avec de l&rsquo;avoir de compte dès le départ</li>
            <li>Le débit est assez ancien pour que le prestataire de paiement ne l&rsquo;annule plus</li>
          </ul>
          <p>
            Lorsque vous avez droit à un remboursement et que vous avez demandé qu&rsquo;il soit
            restitué sur votre moyen de paiement, nous ne vous imposerons pas un avoir en
            remplacement au seul motif que cela nous arrange davantage. Si nous proposons un avoir
            et que vous préférez que l&rsquo;argent vous soit restitué, dites-le et nous en
            discuterons.
          </p>
        </LegalSubSection>

        <LegalSubSection title="7.3 Les remboursements ne sont pas calculés au prorata">
          <p>
            Les remboursements au titre de la présente politique sont effectués pour{' '}
            <strong>des périodes de facturation entières uniquement</strong>. Nous
            ne calculons pas de remboursement partiel en fonction du nombre de jours pendant
            lesquels vous avez utilisé le service avant de demander le remboursement. Une demande
            éligible formulée pendant un délai éligible est remboursée intégralement pour la
            période concernée, et une demande formulée en dehors de ces délais n&rsquo;est pas
            remboursée du tout.
          </p>
          <p>
            Cela joue dans les deux sens et c&rsquo;est délibéré. Vous n&rsquo;êtes pas pénalisé
            pour les jours que vous avez utilisés à l&rsquo;intérieur du délai de remboursement, et
            de la même façon vous ne pouvez pas récupérer une fraction de mois en résiliant en
            cours de période. Comme indiqué à la section 9.1 de nos{' '}
            <Link href={siteConfig.paths.terms}>Conditions de service</Link>,
            aucun remboursement n&rsquo;est accordé pour les jours restants d&rsquo;une période de
            facturation résiliée, sauf si la présente politique s&rsquo;applique.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="8" title="Résiliation du service en cas de remboursement">
        <p>
          Lorsqu&rsquo;un remboursement est approuvé, le service associé est résilié dans le cadre
          du processus de remboursement. L&rsquo;accès au service et à tous les panneaux associés
          est révoqué une fois le remboursement traité.
        </p>
        <p>
          Après la résiliation, les règles de conservation des données de la section 9.3 de nos
          Conditions de service s&rsquo;appliquent. Vos données peuvent être récupérées sur demande
          pendant un délai limité pouvant aller jusqu&rsquo;à{' '}
          <strong>14 jours</strong> après la résiliation&nbsp;;
          passé ce délai, toute donnée restante est supprimée de façon permanente et irréversible,
          et en tout état de cause au plus tard 90 jours après la clôture du compte. Si vous
          souhaitez tenter de récupérer des données d&rsquo;un service remboursé, vous devez en
          faire la demande pendant ce délai de récupération de 14 jours.
        </p>
        <p>
          WSLATL n&rsquo;est pas responsable de la perte de données résultant d&rsquo;une
          résiliation initiée par un remboursement.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Renouvellements et facturation automatique">
        <p>
          Les délais de 14 jours prévus par la présente politique sont calculés à partir de la date
          de l&rsquo;achat initial. Pour les services sur des cycles de facturation récurrents,
          chaque paiement de renouvellement ouvre un nouveau délai de 14 jours calculé à partir de
          la date de ce renouvellement.
        </p>
        <p>
          Si vous ne voulez pas qu&rsquo;un service se renouvelle, vous devez le résilier avant la
          date de renouvellement. Nous ne rembourserons pas un débit de renouvellement automatique
          au seul motif que vous avez oublié de résilier. Toutefois, si vous nous contactez dans
          les 14 jours suivant un renouvellement inattendu, nous évaluerons la demande au titre de
          la section 3 (Motifs éligibles) comme pour tout autre achat.
        </p>
        <p>
          Nous envoyons des rappels de facture avant les renouvellements automatiques. Si vous
          recevez des renouvellements que vous n&rsquo;aviez pas prévus, contactez-nous
          immédiatement à{' '}
          <Email name="support" />{' '}
          et nous arrangerons cela.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Protection contre les abus et la fraude">
        <p>
          La présente politique de remboursement existe pour protéger les clients de bonne foi.
          Pour prévenir les abus, nous nous réservons le droit de refuser des demandes de
          remboursement lorsqu&rsquo;il existe des éléments indiquant un comportement coordonné ou
          répété de recherche de remboursement, notamment et sans s&rsquo;y limiter&nbsp;:
        </p>
        <ul>
          <li>Des cycles répétés d&rsquo;inscription, de remboursement et de réinscription sur les mêmes comptes ou sur des comptes liés</li>
          <li>Des demandes de remboursement coordonnées sur plusieurs comptes ayant un propriétaire commun</li>
          <li>L&rsquo;utilisation d&rsquo;informations fausses lors d&rsquo;une candidature ou d&rsquo;une demande de remboursement</li>
          <li>Des demandes de remboursement liées à des moyens de paiement frauduleux ou à des chargebacks</li>
        </ul>
        <p>
          Si un remboursement est refusé au titre de la présente section, nous en expliquerons le
          motif par écrit. La résiliation du compte peut également en découler en cas d&rsquo;abus
          confirmé.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique de remboursement de temps à autre pour
          refléter des changements dans nos pratiques, dans les exigences légales ou dans nos
          services. Lorsque nous apportons des modifications substantielles, nous&nbsp;:
        </p>
        <ul>
          <li>Mettrons à jour la date d&rsquo;effet affichée en haut de cette page</li>
          <li>Informerons les clients actifs par e-mail avec un résumé de ce qui a changé</li>
          <li>Publierons la politique mise à jour à l&rsquo;adresse {siteConfig.paths.refund}</li>
        </ul>
        <p>
          Les demandes de remboursement soumises avant la date d&rsquo;effet d&rsquo;une
          modification seront évaluées au titre de la version de la politique en vigueur au moment
          de la demande. La poursuite de votre utilisation de nos services après la date
          d&rsquo;effet de toute modification vaut acceptation de la politique de remboursement
          mise à jour.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Contact">
        <p>
          Les questions sur la présente politique de remboursement, sur l&rsquo;état d&rsquo;une
          demande de remboursement ou sur tout autre sujet lié à la facturation doivent être
          adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
