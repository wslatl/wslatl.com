import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { UptimeTable } from '@/components/legal/uptime-table'
import { CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function TermsContent() {
  return (
    <>
      <LegalSection number="1" title="Acceptation des conditions">
        <p>
          En faisant une demande, en vous inscrivant, en accédant à un service fourni par WSLATL LLC
          (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;) ou en l&rsquo;utilisant, vous
          (&laquo;&nbsp;Client&nbsp;&raquo;, &laquo;&nbsp;vous&nbsp;&raquo; ou &laquo;&nbsp;votre&nbsp;&raquo;) confirmez que&nbsp;:
        </p>
        <ul>
          <li>
            Vous remplissez nos conditions d&rsquo;âge&nbsp;: vous êtes soit (a) âgé de 18 ans ou plus, soit (b) âgé
            de 13 à 17 ans et vous avez obtenu le consentement explicite d&rsquo;un parent ou d&rsquo;un tuteur légal
            qui a examiné les présentes Conditions et les accepte en votre nom. Il est strictement interdit
            aux personnes âgées de moins de 13 ans d&rsquo;utiliser un service WSLATL, et elles seront
            définitivement bannies dès leur découverte.
          </li>
          <li>Vous disposez de la pleine capacité juridique pour conclure un accord contraignant</li>
          <li>Vous avez lu et compris les présentes Conditions de service, notre Politique de confidentialité et notre Politique d&rsquo;usage acceptable, et vous acceptez d&rsquo;être lié par elles</li>
          <li>Si vous acceptez au nom d&rsquo;une société ou d&rsquo;une autre entité juridique, vous avez le pouvoir d&rsquo;engager cette entité par les présentes conditions</li>
        </ul>
        <p>
          Si vous n&rsquo;acceptez pas ces conditions, n&rsquo;utilisez pas nos services. Les présentes Conditions, avec notre
          Politique de confidentialité et notre Politique d&rsquo;usage acceptable, forment l&rsquo;intégralité de l&rsquo;accord entre vous et WSLATL LLC.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Description des services">
        <p>
          WSLATL LLC fournit des services d&rsquo;hébergement privés, sur candidature, à des clients validés. Nos
          services comprennent, sans s&rsquo;y limiter&nbsp;:
        </p>
        <ul>
          <li><strong>Serveurs dédiés&nbsp;:</strong> du matériel serveur physique provisionné exclusivement pour un seul client, disponible en version gérée ou non gérée</li>
          <li><strong>Hébergement de serveurs de jeu&nbsp;:</strong> des serveurs de jeu gérés via le panneau Pterodactyl, prenant en charge des titres comme Minecraft, Rust, CS2, ARK, Valheim, FiveM et d&rsquo;autres</li>
          <li><strong>Hébergement VPS&nbsp;:</strong> des serveurs privés virtuels isolés avec un accès root complet et l&rsquo;OS de votre choix</li>
          <li><strong>Hébergement web&nbsp;:</strong> de l&rsquo;hébergement géré pour les sites web et les applications web, avec SSL, sauvegardes et support</li>
        </ul>
        <p>
          Les services sont soumis à disponibilité et peuvent être modifiés, étendus ou interrompus à notre
          discrétion, moyennant un préavis raisonnable aux clients concernés.
        </p>

        <LegalSubSection title="2.1 Sauvegardes et responsabilité de vos données">
          <p>
            Lorsqu&rsquo;un service inclut des sauvegardes, ces sauvegardes sont fournies{' '}
            <strong>au mieux (best-effort)</strong> et constituent une
            commodité plutôt qu&rsquo;une garantie. Nous ne garantissons pas qu&rsquo;une sauvegarde existe pour un
            service donné à un instant donné, qu&rsquo;une sauvegarde est complète ou restaurable, ni
            qu&rsquo;une restauration réussira.
          </p>
          <p>
            <strong>
              Vous êtes responsable de tenir vos propres sauvegardes indépendantes
            </strong>{' '}
            de toute donnée que vous ne pouvez pas vous permettre de perdre, stockées ailleurs que sur le
            service WSLATL qui les a produites. Aucune sauvegarde que nous fournissons ne remplace vos
            propres copies. Cette répartition des responsabilités est un élément substantiel de la
            tarification de nos services et doit être lue avec la section 10 (Exclusion de garanties) et la
            section 11 (Limitation de responsabilité).
          </p>
          <p>
            Ce qui est inclus avec chaque offre, la façon de demander une restauration et ce
            qu&rsquo;implique une restauration sont exposés dans notre{' '}
            <Link href={siteConfig.paths.backups}>Politique de sauvegarde</Link>{' '}
            à l&rsquo;adresse{' '}
            <Link href={siteConfig.paths.backups}>
              {siteConfig.siteUrl}{siteConfig.paths.backups}
            </Link>, qui est incorporée aux présentes Conditions par référence.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Candidature et création de compte">
        <p>
          WSLATL fonctionne comme un hébergeur privé, accessible uniquement sur candidature. L&rsquo;accès à nos services
          n&rsquo;est pas automatique et nécessite un examen et une validation par notre équipe. Les conditions suivantes s&rsquo;appliquent&nbsp;:
        </p>
        <ul>
          <li>Vous devez soumettre une candidature via notre portail de facturation à billing.wslatl.com et être explicitement validé avant qu&rsquo;un service ne soit provisionné</li>
          <li>Nous nous réservons le droit de refuser toute candidature à notre seule discrétion, sans obligation d&rsquo;en indiquer le motif</li>
          <li>Vous devez fournir des informations exactes, à jour et complètes lors de l&rsquo;inscription, et les tenir à jour</li>
          <li>Vous êtes seul responsable du maintien de la sécurité des identifiants de votre compte, y compris votre mot de passe et toute clé d&rsquo;API</li>
          <li>Un seul compte par personne ou par entité commerciale est autorisé, sauf si nous avons expressément autorisé des comptes supplémentaires par écrit</li>
          <li>Vous devez nous en informer immédiatement à <Email name="support" /> si vous soupçonnez un accès non autorisé à votre compte</li>
          <li>Le partage des identifiants de votre compte avec un tiers est interdit sauf autorisation écrite explicite</li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Conditions de paiement">

        <LegalSubSection title="4.1 Cycles de facturation">
          <p>
            Les services sont facturés d&rsquo;avance selon un cycle que vous choisissez à l&rsquo;inscription. Les intervalles de facturation
            disponibles (mensuel, trimestriel, semestriel ou annuel) dépendent du type de service. Les factures sont
            générées automatiquement et envoyées à l&rsquo;adresse e-mail enregistrée sur votre compte avant la date d&rsquo;échéance.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Moyens de paiement et traitement">
          <p>
            Le paiement doit être effectué via notre portail de facturation à billing.wslatl.com. Les moyens de paiement
            acceptés sont listés dans le portail. Les paiements sont traités par des prestataires de paiement tiers.
            En fournissant des informations de paiement, vous nous autorisez à débiter le moyen de paiement que vous avez choisi
            de tous les frais dus.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Retards de paiement et suspension de service">
          <p>
            Les services sont considérés comme impayés si le paiement n&rsquo;est pas reçu à la date d&rsquo;échéance de la facture.
            Ce qui suit s&rsquo;applique aux comptes en retard de paiement&nbsp;:
          </p>
          <ul>
            <li>Les services peuvent être suspendus si le paiement n&rsquo;est pas reçu dans les <strong>7 jours</strong> suivant la date d&rsquo;échéance</li>
            <li>Les services suspendus peuvent être résiliés et les données définitivement supprimées si le paiement n&rsquo;est pas reçu dans les <strong>14 jours</strong> suivant la suspension</li>
            <li>WSLATL n&rsquo;est pas responsable de la perte de données, de l&rsquo;interruption d&rsquo;activité ni de tout autre dommage résultant de la suspension ou de la résiliation d&rsquo;un service pour défaut de paiement</li>
            <li>Des frais de réactivation peuvent s&rsquo;appliquer aux services qui ont été suspendus pour défaut de paiement</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Politique de remboursement">
          <p>
            Notre politique de remboursement est tenue comme document distinct à l&rsquo;adresse{' '}
            <Link href={siteConfig.paths.refund}>{siteConfig.siteUrl}{siteConfig.paths.refund}</Link>{' '}
            et est incorporée aux présentes Conditions par référence. La Politique de remboursement fait
            foi pour toutes les questions relatives à l&rsquo;éligibilité au remboursement, aux délais, aux
            motifs éligibles, au traitement et aux éléments non remboursables. Les règles de la Politique
            de remboursement prévalent sur toute formulation contraire ailleurs dans les présentes Conditions.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Changements de tarifs">
          <p>
            WSLATL se réserve le droit de modifier les tarifs de ses services. Nous donnerons au moins{' '}
            <strong>30 jours de préavis écrit</strong> pour toute
            augmentation de tarif, par e-mail à l&rsquo;adresse enregistrée sur votre compte. Les services existants seront honorés au
            tarif en vigueur jusqu&rsquo;à la première date de renouvellement suivant ce délai de préavis.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.6 Taxes">
          <p>
            Les frais de service ne comprennent pas les taxes applicables. Vous êtes responsable du paiement de toutes les taxes,
            droits ou prélèvements imposés par les pouvoirs publics qui s&rsquo;appliquent à votre utilisation de nos services, sauf
            s&rsquo;ils sont spécifiquement inclus dans votre facture.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Accord de niveau de service (SLA)">
        <p>
          Notre accord de niveau de service est également publié comme document autonome à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.sla}>
            {siteConfig.siteUrl}{siteConfig.paths.sla}
          </Link>, plus facile à trouver et à citer. Cette page reprend la présente section&nbsp;; elle n&rsquo;y
          ajoute rien et ne la modifie pas. Les engagements ci-dessous y sont reproduits intégralement et,
          si les deux venaient à différer, c&rsquo;est la présente section qui prévaut.
        </p>

        <LegalSubSection title="5.1 Objectifs de disponibilité">
          <UptimeTable />
          <p>
            La disponibilité est mesurée par mois calendaire et exclut les fenêtres de maintenance planifiée
            ainsi que les périodes d&rsquo;indisponibilité causées par des événements échappant à notre contrôle
            raisonnable (voir la section 15, Force majeure).
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Maintenance planifiée">
          <p>
            Nous donnerons au moins <strong>24 heures de préavis</strong> pour
            les fenêtres de maintenance planifiée, via notre page d&rsquo;état (status.wslatl.com) et/ou par
            e-mail aux clients concernés. La maintenance d&rsquo;urgence nécessaire pour préserver
            l&rsquo;intégrité ou la sécurité du service peut être effectuée sans préavis, mais nous
            communiquerons aussi vite que possible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.3 Avoirs SLA">
          <p>
            Si nous n&rsquo;atteignons pas l&rsquo;objectif de disponibilité applicable par notre faute,
            vous pouvez demander un avoir de service égal à <strong>10&nbsp;% du coût mensuel du service concerné</strong> par
            incident éligible. Les avoirs sont portés au solde de votre compte et ne dépasseront pas le coût
            d&rsquo;un mois complet du service concerné. Les avoirs de service constituent votre seul et
            unique recours en cas de manquement aux objectifs de disponibilité et ne vous donnent droit à
            aucun remboursement en espèces.
          </p>
          <p>
            Pour demander un avoir, contactez-nous dans les 15 jours suivant l&rsquo;incident à <Email name="support" /> en
            indiquant la date, la durée et la nature de l&rsquo;interruption.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Usage acceptable">
        <p>
          Toute utilisation des services WSLATL est régie par notre Politique d&rsquo;usage acceptable (AUP), qui est
          incorporée aux présentes Conditions par référence et disponible à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.acceptableUse}>{siteConfig.siteUrl}{siteConfig.paths.acceptableUse}</Link>.
          Vous acceptez de vous conformer à l&rsquo;AUP à tout moment.
        </p>
        <p>
          Les violations de l&rsquo;AUP peuvent entraîner la suspension ou la résiliation immédiate de vos services
          sans préavis et sans aucun droit à remboursement. Les violations graves peuvent être signalées aux
          forces de l&rsquo;ordre.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Propriété intellectuelle">
        <p>
          L&rsquo;ensemble des logiciels, outils, documentations et éléments développés et fournis par WSLATL
          (à l&rsquo;exclusion des logiciels tiers tels que Pterodactyl, qui est soumis à sa propre licence)
          sont et demeurent la propriété intellectuelle de WSLATL LLC. Vous ne pouvez pas reproduire, distribuer,
          faire de la rétro-ingénierie ni créer des œuvres dérivées de nos éléments propriétaires sans notre
          consentement écrit préalable.
        </p>
        <p>
          Vous conservez la pleine propriété de l&rsquo;ensemble des données, contenus et logiciels que vous téléversez sur
          l&rsquo;infrastructure WSLATL ou que vous y exécutez. Vous accordez à WSLATL une licence limitée, non exclusive et non transférable pour stocker,
          traiter et transmettre vos contenus uniquement dans la mesure nécessaire à la fourniture des services que vous
          avez souscrits.
        </p>
      </LegalSection>

      <LegalSection number="8" title="DMCA et droit d’auteur">
        <p>
          WSLATL LLC se conforme au Digital Millennium Copyright Act (DMCA), 17 U.S.C. &sect;&nbsp;512.
          Notre politique DMCA complète est publiée à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>{' '}
          et est incorporée aux présentes Conditions par référence. Elle expose notre agent désigné, la
          procédure de contre-notification, le délai légal de rétablissement et notre politique relative aux
          contrevenants récidivistes. Lisez-la avant de nous signifier une notification ou de contester un retrait.
        </p>
        <p>
          En résumé&nbsp;: si vous estimez qu&rsquo;un contenu hébergé sur l&rsquo;infrastructure WSLATL porte atteinte à votre
          droit d&rsquo;auteur, envoyez une notification de retrait DMCA écrite à&nbsp;:
        </p>
        <InfoCard>
          <InfoRow label="E-mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Objet">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>
        <p>Votre notification doit comprendre, sous peine de parjure&nbsp;:</p>
        <ul>
          <li>Vos coordonnées (nom, adresse, numéro de téléphone, e-mail)</li>
          <li>Une description de l&rsquo;œuvre protégée par le droit d&rsquo;auteur dont vous alléguez qu&rsquo;elle a été enfreinte</li>
          <li>L&rsquo;identification du contenu prétendument contrefaisant et de son emplacement sur notre infrastructure</li>
          <li>Une déclaration selon laquelle vous avez la conviction de bonne foi que l&rsquo;usage contesté n&rsquo;est autorisé ni par le titulaire du droit d&rsquo;auteur, ni par son agent, ni par la loi</li>
          <li>Une déclaration selon laquelle les informations contenues dans la notification sont exactes et, sous peine de parjure, que vous êtes le titulaire du droit d&rsquo;auteur ou que vous êtes autorisé à agir en son nom</li>
          <li>Votre signature physique ou électronique</li>
        </ul>
        <p>
          Les contre-notifications peuvent être soumises à la même adresse e-mail et doivent satisfaire aux
          exigences exposées à la section 4 de notre{' '}
          <Link href={siteConfig.paths.dmca}>Politique DMCA</Link>.
          Nous nous réservons le droit de résilier les comptes des clients qui contreviennent de façon
          répétée au droit d&rsquo;auteur, conformément à la politique relative aux contrevenants récidivistes
          figurant à la section 5 de ce document.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Résiliation">

        <LegalSubSection title="9.1 Annulation par vous">
          <p>
            Vous pouvez annuler votre service à tout moment en soumettant une demande d&rsquo;annulation via
            notre portail de facturation ou en nous contactant sur Discord ou par e-mail. Les annulations prennent effet
            à la fin du cycle de facturation en cours, sauf si une annulation immédiate est expressément
            demandée. Aucun remboursement n&rsquo;est accordé pour les jours restants d&rsquo;une période de facturation annulée,
            sauf si notre politique de remboursement s&rsquo;applique (voir la section 4.4).
          </p>
        </LegalSubSection>

        <LegalSubSection title="9.2 Résiliation par WSLATL">
          <p>
            Nous pouvons suspendre ou résilier vos services immédiatement et sans préavis si&nbsp;:
          </p>
          <ul>
            <li>Vous enfreignez les présentes Conditions, la Politique d&rsquo;usage acceptable ou notre Politique de confidentialité</li>
            <li>Vous avez des factures impayées au-delà du délai de grâce (voir la section 4.3)</li>
            <li>Vos activités présentent un risque actif pour notre infrastructure réseau, pour d&rsquo;autres clients ou pour des tiers sur internet</li>
            <li>Nous recevons une injonction légale valable exigeant la résiliation ou la suspension</li>
            <li>La poursuite de la fourniture des services exposerait WSLATL LLC à une responsabilité juridique</li>
            <li>Vous fournissez des informations fausses ou frauduleuses à un moment quelconque de la vie de votre compte</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="9.3 Effets de la résiliation">
          <p>
            À la résiliation de votre compte&nbsp;:
          </p>
          <ul>
            <li>L&rsquo;accès à tous les services et panneaux sera révoqué immédiatement</li>
            <li>Vos données peuvent être récupérées sur demande pendant un délai limité pouvant aller jusqu&rsquo;à 14 jours après la résiliation&nbsp;; passé ce délai, toute donnée restante est supprimée de façon permanente et irréversible, et en tout état de cause au plus tard 90 jours après la clôture du compte, en cohérence avec le tableau de conservation de notre Politique de confidentialité</li>
            <li>Toute demande de récupération de données doit être formulée pendant le délai de récupération de 14 jours et relève de notre discrétion</li>
            <li>WSLATL n&rsquo;est pas responsable de la perte de données résultant de la résiliation d&rsquo;un compte</li>
            <li>Toutes les factures impayées restent dues et exigibles après la résiliation</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="10" title="Exclusion de garanties">
        <p>
          LES SERVICES SONT FOURNIS &laquo;&nbsp;EN L&rsquo;ÉTAT&nbsp;&raquo; ET &laquo;&nbsp;SELON DISPONIBILITÉ&nbsp;&raquo;, SANS GARANTIE
          D&rsquo;AUCUNE SORTE, EXPRESSE OU IMPLICITE. DANS TOUTE LA MESURE PERMISE PAR LE DROIT APPLICABLE,
          WSLATL LLC EXCLUT EXPRESSÉMENT TOUTE GARANTIE, Y COMPRIS, SANS S&rsquo;Y LIMITER&nbsp;:
        </p>
        <ul className="uppercase">
          <li>Les garanties implicites de qualité marchande et d&rsquo;adéquation à un usage particulier</li>
          <li>Les garanties d&rsquo;absence de contrefaçon</li>
          <li>Les garanties que les services seront ininterrompus, exempts d&rsquo;erreurs ou exempts de composants nuisibles</li>
          <li>Les garanties que les défauts seront corrigés dans un délai déterminé</li>
          <li>Les garanties concernant l&rsquo;exactitude ou l&rsquo;exhaustivité d&rsquo;un contenu quelconque</li>
        </ul>
        <p>
          Certaines juridictions n&rsquo;autorisent pas l&rsquo;exclusion de certaines garanties. Dans ces juridictions,
          nos exclusions s&rsquo;appliquent dans toute la mesure permise par la loi.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Limitation de responsabilité">
        <p>
          DANS TOUTE LA MESURE PERMISE PAR LE DROIT APPLICABLE, WSLATL LLC AINSI QUE SES ASSOCIÉS, GÉRANTS,
          DIRIGEANTS, SALARIÉS, PRESTATAIRES ET AGENTS NE SAURAIENT ÊTRE TENUS RESPONSABLES DE&nbsp;:
        </p>
        <ul className="uppercase">
          <li>Dommages indirects, accessoires, spéciaux, consécutifs ou punitifs</li>
          <li>Perte de bénéfices, de chiffre d&rsquo;affaires, de données, de clientèle ou d&rsquo;opportunités commerciales</li>
          <li>Dommages résultant d&rsquo;un accès non autorisé à vos données ou de leur altération</li>
          <li>Dommages résultant du fait que vous vous êtes fié à des informations obtenues via nos services</li>
          <li>Dommages causés par des événements échappant à notre contrôle raisonnable</li>
        </ul>
        <p>
          NOTRE RESPONSABILITÉ CUMULÉE TOTALE ENVERS VOUS POUR L&rsquo;ENSEMBLE DES RÉCLAMATIONS DÉCOULANT DES
          PRÉSENTES CONDITIONS OU DE VOTRE UTILISATION DE NOS SERVICES, OU S&rsquo;Y RAPPORTANT, NE SAURAIT
          EXCÉDER LE MONTANT TOTAL QUE VOUS AVEZ VERSÉ À WSLATL LLC AU COURS DES <strong>TROIS (3) MOIS</strong> PRÉCÉDANT
          IMMÉDIATEMENT L&rsquo;ÉVÉNEMENT DONNANT LIEU À LA RÉCLAMATION.
        </p>
        <p>
          Certaines juridictions n&rsquo;autorisent pas certaines limitations de responsabilité. Dans ces juridictions,
          notre responsabilité est limitée dans toute la mesure permise par la loi.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Indemnisation">
        <p>
          Vous acceptez d&rsquo;indemniser, de défendre et de garantir WSLATL LLC, ses associés, gérants,
          dirigeants, salariés, prestataires et agents contre l&rsquo;ensemble des réclamations,
          responsabilités, dommages, pertes, coûts et frais (y compris les honoraires d&rsquo;avocat
          raisonnables) découlant de ce qui suit, ou s&rsquo;y rapportant&nbsp;:
        </p>
        <ul>
          <li>Votre utilisation de nos services en violation des présentes Conditions, de l&rsquo;AUP ou du droit applicable</li>
          <li>Les contenus que vous hébergez, transmettez ou stockez sur l&rsquo;infrastructure WSLATL</li>
          <li>Votre violation de droits de tiers, y compris de droits de propriété intellectuelle</li>
          <li>Toute information fausse ou frauduleuse que vous fournissez à WSLATL</li>
          <li>Tout litige entre vous et un tiers découlant de votre utilisation de nos services</li>
        </ul>
        <p>
          WSLATL se réserve le droit d&rsquo;assumer la défense et le contrôle exclusifs de toute affaire faisant l&rsquo;objet
          d&rsquo;une indemnisation de votre part, à vos frais, et vous acceptez de coopérer à notre défense.
        </p>
      </LegalSection>

      <LegalSection number="13" title="Droit applicable et règlement des litiges">
        <p>
          Les présentes Conditions de service sont régies par le droit de l&rsquo;État du Missouri, aux États-Unis,
          et interprétées conformément à celui-ci, sans égard aux règles de conflit de lois.
        </p>
        <p>
          Tout litige, réclamation ou différend juridique découlant des présentes Conditions ou de votre
          utilisation des services WSLATL, ou s&rsquo;y rapportant, sera résolu exclusivement devant les tribunaux
          étatiques ou fédéraux situés dans l&rsquo;État du Missouri. Vous consentez à la compétence personnelle de ces tribunaux et renoncez
          à toute objection quant au lieu du for au Missouri.
        </p>
        <p>
          Avant d&rsquo;engager une procédure judiciaire formelle, les deux parties acceptent de tenter de résoudre
          les litiges de façon amiable. Pour engager une résolution amiable, contactez-nous à <Email name="support" />{' '}
          avec une description écrite du litige. Si le litige n&rsquo;est pas résolu dans les{' '}
          <strong>30 jours</strong> suivant cette notification, chaque partie
          peut exercer des recours judiciaires formels.
        </p>
      </LegalSection>

      <LegalSection number="14" title="Modification des conditions">
        <p>
          WSLATL se réserve le droit de modifier les présentes Conditions à tout moment. Pour les modifications substantielles, nous&nbsp;:
        </p>
        <ul>
          <li>Donnerons au moins <strong>14 jours de préavis</strong> par e-mail à l&rsquo;adresse enregistrée sur votre compte</li>
          <li>Publierons les Conditions mises à jour à l&rsquo;adresse {siteConfig.paths.terms} avec une date d&rsquo;effet révisée</li>
          <li>Résumerons les modifications dans l&rsquo;e-mail de notification</li>
        </ul>
        <p>
          La poursuite de votre utilisation de nos services après la date d&rsquo;effet de Conditions révisées vaut
          acceptation de ces modifications. Si vous vous opposez à des modifications substantielles, vous pouvez résilier votre
          service avant la date d&rsquo;effet et recevoir un remboursement au prorata de toute période prépayée,
          à notre discrétion.
        </p>
      </LegalSection>

      <LegalSection number="15" title="Dispositions diverses">

        <LegalSubSection title="Force majeure">
          <p>
            WSLATL n&rsquo;est pas responsable des retards ou des défauts d&rsquo;exécution résultant de causes échappant à
            notre contrôle raisonnable, notamment les catastrophes naturelles, les cas fortuits, les actions
            gouvernementales, les défaillances de l&rsquo;infrastructure internet, les pannes de datacenter causées par des tiers, les conflits
            sociaux ou d&rsquo;autres événements extraordinaires. Nous ferons des efforts raisonnables pour informer
            les clients concernés et rétablir le service aussi vite que possible.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Intégralité de l’accord">
          <p>
            Les présentes Conditions de service, avec notre Politique de confidentialité et notre Politique d&rsquo;usage acceptable,
            constituent l&rsquo;intégralité de l&rsquo;accord entre vous et WSLATL LLC concernant votre utilisation
            de nos services et remplacent tous les accords, déclarations ou ententes antérieurs.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Divisibilité">
          <p>
            Si une disposition des présentes Conditions est jugée invalide, illégale ou inapplicable par un
            tribunal compétent, cette disposition sera modifiée dans la mesure minimale
            nécessaire pour la rendre applicable, et les dispositions restantes conserveront leur plein
            effet.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Renonciation">
          <p>
            Le fait que nous n&rsquo;exercions pas un droit ou n&rsquo;appliquions pas une disposition des présentes Conditions à une occasion quelconque ne
            constitue pas une renonciation à ce droit ou à cette disposition. Toute renonciation doit être écrite et signée
            par un représentant autorisé de WSLATL LLC.
          </p>
        </LegalSubSection>

        <LegalSubSection title="Cession">
          <p>
            Vous ne pouvez pas céder ni transférer les présentes Conditions, ni aucun droit ou obligation en découlant,
            sans notre consentement écrit préalable. WSLATL peut céder ou transférer les présentes Conditions, en tout
            ou en partie, dans le cadre d&rsquo;une fusion, d&rsquo;une acquisition ou d&rsquo;une cession de la quasi-totalité de ses actifs,
            moyennant notification à vous.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="16" title="Contact">
        <p>
          Les questions sur les présentes Conditions de service doivent être adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
