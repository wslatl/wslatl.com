import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { CompanyContact, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function PrivacyContent() {
  return (
    <>
      <LegalSection number="1" title="Qui nous sommes">
        <p>
          WSLATL LLC est une société à responsabilité limitée du Missouri qui fournit des services
          d&rsquo;hébergement privés, dont des serveurs dédiés, de l&rsquo;hébergement de serveurs
          de jeu, de l&rsquo;hébergement VPS et de l&rsquo;hébergement web. Les références à
          &laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo; dans la présente politique
          désignent WSLATL LLC.
        </p>
        <p>
          La présente politique de confidentialité s&rsquo;applique aux informations collectées via notre site web (wslatl.com), notre portail
          de facturation (billing.wslatl.com), nos panneaux d&rsquo;hébergement (panel.wslatl.com, vps.wslatl.com), ainsi que l&rsquo;ensemble des services
          et communications fournis par WSLATL. En utilisant l&rsquo;un de nos services, vous acceptez les pratiques
          décrites dans la présente politique.
        </p>

        <LegalSubSection title="1.1 Responsable du traitement et sous-traitant">
          <p>
            L&rsquo;hébergement met en jeu deux types de données différents, et notre rôle
            juridique diffère pour chacun. La distinction compte, il vaut donc la peine de
            l&rsquo;énoncer clairement.
          </p>
          <ul>
            <li>
              <strong>Vos données de compte.</strong> Les
              informations que vous nous donnez pour que nous puissions ouvrir et faire fonctionner
              votre compte&nbsp;: votre nom, vos coordonnées, vos enregistrements de facturation,
              vos tickets de support et l&rsquo;activité sur les panneaux décrite à la
              section 2. Pour ces données, WSLATL est le{' '}
              <strong>responsable du traitement</strong>. Nous décidons de ce qui est
              collecté et pourquoi, et la présente politique de confidentialité décrit cette décision.
            </li>
            <li>
              <strong>Les données que vous placez sur vos propres services.</strong>{' '}
              Tout ce que vous ou vos utilisateurs stockez sur un serveur que nous hébergeons pour
              vous&nbsp;: bases de données, données de serveur de jeu, fichiers téléversés, contenu
              de site web, logs applicatifs. Pour ces données, WSLATL est{' '}
              <strong>sous-traitant</strong>, et non le responsable du traitement.
              Nous les stockons et les transmettons pour que le service fonctionne, et nous ne
              décidons ni de ce que vous collectez ni des raisons pour lesquelles vous le collectez.
            </li>
          </ul>
          <p>
            Si vous hébergez les données personnelles d&rsquo;autres personnes sur un service
            WSLATL, vous en êtes le responsable du traitement. Les obligations qui accompagnent ce
            rôle sont les vôtres&nbsp;: disposer d&rsquo;une base légale pour le traitement,
            informer vos propres utilisateurs, donner suite à leurs demandes d&rsquo;exercice de
            droits, et tenir votre propre registre des activités de traitement. La présente
            politique de confidentialité ne fait rien de tout cela à votre place, et ce n&rsquo;est
            pas une politique de confidentialité sur laquelle vos utilisateurs peuvent
            s&rsquo;appuyer.
          </p>
          <p>
            Nous agissons sur vos instructions à l&rsquo;égard de ces données, et nous n&rsquo;y
            accédons que lorsque cela est nécessaire pour fournir, maintenir ou sécuriser le
            service, ou lorsque la loi nous y oblige. Si vous avez besoin d&rsquo;un accord de
            traitement des données couvrant notre rôle de sous-traitant, contactez-nous à{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="2" title="Les informations que nous collectons">
        <p>Nous collectons les catégories d&rsquo;informations suivantes&nbsp;:</p>

        <LegalSubSection title="2.1 Informations de compte et d’inscription">
          <p>Lorsque vous faites une demande de compte ou que vous créez un compte, nous collectons&nbsp;:</p>
          <ul>
            <li>Le nom complet</li>
            <li>L&rsquo;adresse e-mail</li>
            <li>L&rsquo;adresse de facturation</li>
            <li>Le numéro de téléphone (obligatoire à l&rsquo;inscription, utilisé pour la récupération de compte et pour vérifier la propriété du compte)</li>
            <li>La date de naissance (utilisée pour appliquer les conditions d&rsquo;âge de la section 9)</li>
            <li>
              Le numéro d&rsquo;identification fiscale, lorsque vous en fournissez un afin que nous
              puissions vous facturer en tant qu&rsquo;entreprise ou appliquer une exonération de taxe
            </li>
            <li>Le nom d&rsquo;utilisateur et le mot de passe du compte (stockés sous forme de hachage sécurisé, nous ne voyons jamais votre mot de passe en clair)</li>
            <li>
              L&rsquo;identité de votre compte Discord, lorsque vous choisissez de lier votre compte
              Discord à votre compte WSLATL. La liaison nous donne votre identifiant utilisateur
              Discord, votre nom d&rsquo;utilisateur et votre avatar, afin que nous puissions vous
              associer aux conversations de support et à l&rsquo;accès aux rôles sur notre serveur.
              La liaison est facultative et peut être rompue.
            </li>
            <li>Toute information que vous fournissez volontairement pendant le processus de candidature ou de mise en route</li>
          </ul>
          <p>
            Nous tenons également un{' '}
            <strong>registre des avoirs de compte</strong> pour votre
            compte, consignant chaque mouvement de votre solde d&rsquo;avoir, y compris les achats
            de recharge, les avoirs que nous émettons, les montants imputés aux factures, les dons
            envoyés ou reçus, ainsi que la date, le montant et le motif de chaque écriture. Ce
            registre est conservé dans le cadre de vos enregistrements de facturation. Consultez
            nos{' '}
            <Link href={siteConfig.paths.accountCredit}>Conditions de l&rsquo;avoir de compte</Link>{' '}
            pour savoir comment le solde lui-même fonctionne.
          </p>
        </LegalSubSection>

        <LegalSubSection title="2.2 Informations de facturation et de paiement">
          <p>
            Les paiements sont traités via notre portail de facturation à l&rsquo;aide de prestataires de paiement tiers
            conformes à la norme PCI-DSS. Nous ne stockons ni votre numéro de carte complet ni votre CVV. Nous conservons&nbsp;:
          </p>
          <ul>
            <li>L&rsquo;historique des factures et les enregistrements de facturation</li>
            <li>Le type de moyen de paiement (réseau de la carte, quatre derniers chiffres)</li>
            <li>Les identifiants et les dates de transaction</li>
            <li>Les enregistrements requis pour la comptabilité et la conformité légale</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.3 Données de service et d’utilisation">
          <p>Lorsque vous utilisez nos services d&rsquo;hébergement, nous collectons&nbsp;:</p>
          <ul>
            <li>Les adresses IP attribuées à vos services ou utilisées par eux</li>
            <li>L&rsquo;utilisation des ressources serveur (CPU, RAM, bande passante, occupation disque)</li>
            <li>Les logs d&rsquo;accès et d&rsquo;activité des panneaux de contrôle et des tableaux de bord</li>
            <li>Les métadonnées du trafic réseau (pas le contenu) utilisées pour la détection des abus et la supervision des performances</li>
            <li>Les logs d&rsquo;activité des serveurs de jeu, dont les horodatages de connexion et les données de session</li>
            <li>Les relevés de disponibilité et de temps de fonctionnement</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.4 Données de communication">
          <p>Lorsque vous nous contactez, nous conservons des enregistrements&nbsp;:</p>
          <ul>
            <li>Des tickets de support et de leur contenu intégral</li>
            <li>Des communications Discord (messages sur notre serveur ou messages privés avec notre équipe)</li>
            <li>De la correspondance par e-mail</li>
            <li>Des fichiers, captures d&rsquo;écran ou logs que vous partagez lorsque vous demandez de l&rsquo;aide</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="2.5 Données du site web">
          <p>Lorsque vous visitez wslatl.com, nous pouvons collecter&nbsp;:</p>
          <ul>
            <li>L&rsquo;adresse IP et la région géographique générale</li>
            <li>Le type de navigateur et le système d&rsquo;exploitation</li>
            <li>Les pages visitées et le temps passé sur le site</li>
            <li>L&rsquo;URL de provenance</li>
            <li>Les cookies de session (voir la section 7)</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="3" title="Comment nous utilisons vos informations">
        <p>Nous utilisons les informations que nous collectons exclusivement pour&nbsp;:</p>
        <ul>
          <li>Provisionner, exploiter et maintenir vos services d&rsquo;hébergement</li>
          <li>Traiter les paiements, générer les factures et gérer votre compte de facturation</li>
          <li>Vérifier votre identité et empêcher la création frauduleuse de comptes</li>
          <li>Répondre aux demandes de support, aux questions et aux sollicitations</li>
          <li>Superviser les performances du réseau, la disponibilité et la santé de l&rsquo;infrastructure</li>
          <li>Détecter, investiguer et prévenir les abus, les accès non autorisés et les violations de notre Politique d&rsquo;usage acceptable</li>
          <li>Respecter les lois, réglementations et obligations légales applicables</li>
          <li>Faire appliquer nos Conditions de service</li>
          <li>Envoyer des communications liées au service, telles que des avis de maintenance, des alertes de facturation et des mises à jour de compte</li>
          <li>Améliorer nos services et notre infrastructure à partir des usages constatés</li>
        </ul>
        <p className="font-medium text-foreground">
          Nous n&rsquo;utilisons pas vos données à des fins publicitaires. Nous ne vendons, ne louons ni n&rsquo;échangeons vos informations personnelles
          auprès d&rsquo;un tiers, à quelque fin commerciale que ce soit.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Comment nous partageons vos informations">
        <p>
          Nous ne partageons vos informations que dans les circonstances limitées suivantes, et uniquement dans la mesure
          nécessaire à chaque finalité&nbsp;:
        </p>

        <LegalSubSection title="4.1 Prestataires de services">
          <p>
            Nous travaillons avec des fournisseurs tiers qui nous aident à fournir nos services. Ces prestataires ne reçoivent
            que les données nécessaires à l&rsquo;exercice de leur fonction et sont contractuellement tenus de protéger
            ces données. Cela comprend&nbsp;:
          </p>
          <ul>
            <li>Les prestataires de paiement (pour traiter les transactions de facturation)</li>
            <li>Les partenaires datacenter et infrastructure (pour l&rsquo;hébergement physique des serveurs)</li>
            <li>Les prestataires de protection contre les bots et les abus, de diffusion de contenu et de DNS</li>
            <li>L&rsquo;acheminement des e-mails pour les messages transactionnels tels que les factures et les avis de compte</li>
            <li>La saisie automatique d&rsquo;adresse et le géocodage pour les formulaires de saisie d&rsquo;adresse</li>
            <li>Les services de supervision d&rsquo;état (par exemple status.wslatl.com)</li>
          </ul>
          <p>
            Nous publions les prestataires individuellement, et pas seulement ces catégories.
            Chaque sous-traitant ultérieur est nommé sur notre page{' '}
            <Link href={siteConfig.paths.subprocessors}>Sous-traitants</Link>,
            avec l&rsquo;usage qui en est fait, les catégories de données qu&rsquo;il reçoit et sa
            localisation. Cette page est tenue à jour à mesure que notre infrastructure évolue.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Obligations légales">
          <p>
            Nous pouvons divulguer vos informations lorsque la loi, une décision de justice
            valable, une citation à comparaître ou une demande légale d&rsquo;autorités publiques
            l&rsquo;exige. Lorsque la loi le permet, nous tenterons de vous en informer avant de
            donner suite à ces demandes.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Prévention des abus et forces de l’ordre">
          <p>
            Nous pouvons partager des adresses IP, des logs réseau ou d&rsquo;autres données techniques avec&nbsp;:
          </p>
          <ul>
            <li>D&rsquo;autres hébergeurs enquêtant sur un abus provenant de notre réseau</li>
            <li>Les registres d&rsquo;abus (par exemple AbuseIPDB) lors du traitement d&rsquo;un abus réseau confirmé</li>
            <li>Les services des forces de l&rsquo;ordre enquêtant sur une activité illégale</li>
            <li>Le NCMEC ou d&rsquo;autres autorités dans les affaires touchant à la protection de l&rsquo;enfance</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Transferts d’activité">
          <p>
            Si WSLATL LLC est rachetée, fusionne avec une autre entité ou connaît une transition d&rsquo;activité
            importante, vos informations peuvent être transférées dans le cadre de cette opération. Nous informerons
            les clients actifs par e-mail de tout changement de ce type avant qu&rsquo;il n&rsquo;intervienne.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.5 Transferts internationaux">
          <p>
            WSLATL LLC est établie dans l&rsquo;État du Missouri, aux États-Unis, et nos services
            sont exploités depuis les États-Unis. Si vous êtes situé dans l&rsquo;Espace économique
            européen, au Royaume-Uni ou en Suisse, utiliser nos services signifie que vos données
            personnelles sont transférées vers les États-Unis et, lorsqu&rsquo;un sous-traitant
            ultérieur exploite un réseau mondial, potentiellement vers d&rsquo;autres pays.
          </p>
          <p>
            Les États-Unis ne sont pas couverts par une décision d&rsquo;adéquation générale
            s&rsquo;appliquant à tous les destinataires. Lorsque nous transférons des données
            personnelles hors de l&rsquo;EEE ou du Royaume-Uni, nous nous appuyons sur le fait que
            le transfert est nécessaire à l&rsquo;exécution du contrat dont vous nous avez demandé
            l&rsquo;exécution, ainsi que sur les clauses contractuelles types de la Commission
            européenne conjuguées à l&rsquo;UK International Data Transfer Addendum lorsqu&rsquo;un
            sous-traitant ultérieur les propose.
          </p>
          <p>
            Les mécanismes applicables à chaque destinataire, ainsi que des précisions sur notre
            position en matière de transferts, sont exposés sur notre page{' '}
            <Link href={siteConfig.paths.subprocessors}>Sous-traitants</Link>.
            Si vous avez besoin d&rsquo;un accord de traitement des données ou d&rsquo;une copie des
            clauses telles que nous les appliquons, contactez-nous à{' '}
            <Email name="support" />.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Conservation des données">
        <p>Nous conservons vos données pendant les durées suivantes&nbsp;:</p>
        <ScrollTable label="Durées de conservation des données">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Type de données</th>
                <th scope="col">Durée de conservation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Enregistrements de compte</td>
                <td>Durée du compte + 3 ans</td>
              </tr>
              <tr>
                <td>Enregistrements de facturation</td>
                <td>7 ans (obligations fiscales et légales)</td>
              </tr>
              <tr>
                <td>Logs serveur et réseau</td>
                <td>Jusqu&rsquo;à 90 jours (plus longtemps si nécessaire pour une enquête en cours)</td>
              </tr>
              <tr>
                <td>Communications de support</td>
                <td>2 ans à compter de la dernière interaction</td>
              </tr>
              <tr>
                <td>Données après résiliation</td>
                <td>Récupérables sur demande pendant 14 jours au maximum après la résiliation&nbsp;; supprimées ou anonymisées au plus tard 90 jours après la clôture du compte (les données de service sont supprimées plus tôt, conformément à la section 9.3 des Conditions de service)</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>
        <p>
          Les données peuvent être conservées au-delà de ces durées si le droit applicable, une
          procédure judiciaire en cours ou un litige commercial légitime l&rsquo;exige.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Sécurité des données">
        <p>
          Protéger vos données est une responsabilité essentielle que nous prenons au sérieux. Nos mesures de sécurité comprennent&nbsp;:
        </p>
        <ul>
          <li>Le chiffrement des données sensibles au repos et en transit (HTTPS/TLS pour tous les panneaux et portails)</li>
          <li>Le stockage des mots de passe hachés et salés&nbsp;: les mots de passe en clair ne sont jamais stockés ni visibles par nous</li>
          <li>Des contrôles d&rsquo;accès internes stricts limitant qui, dans notre équipe, peut consulter les données clients</li>
          <li>L&rsquo;examen et le durcissement réguliers de notre infrastructure d&rsquo;hébergement</li>
          <li>La surveillance des schémas d&rsquo;accès inhabituels et des intrusions potentielles</li>
        </ul>
        <p>
          Aucune transmission sur internet n&rsquo;est sûre à 100&nbsp;%. Bien que nous utilisions des protections conformes aux standards du secteur,
          nous ne pouvons pas garantir une sécurité absolue. Si vous pensez que votre compte a été compromis,
          contactez-nous immédiatement à{' '}
          <Email name="support" />.
        </p>
        <p>
          En cas de violation de données affectant vos informations, nous vous en informerons conformément
          au droit applicable, y compris la loi du Missouri sur la notification des violations de données
          (Mo. Rev. Stat. &sect;&nbsp;407.1500), aussi rapidement que les circonstances le permettent.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Cookies">
        <p>
          Nous utilisons les cookies de façon minimale et uniquement lorsque c&rsquo;est nécessaire. Notre usage des cookies comprend&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Les cookies de session&nbsp;:</strong> nécessaires pour vous maintenir
            connecté à notre portail de facturation et à nos panneaux d&rsquo;hébergement. Ils expirent lorsque vous fermez votre navigateur
            ou vous déconnectez.
          </li>
          <li>
            <strong>Les cookies de préférence&nbsp;:</strong> peuvent stocker des préférences
            d&rsquo;affichage ou des réglages que vous avez choisis dans nos panneaux.
          </li>
        </ul>
        <p>
          Nous n&rsquo;utilisons pas de cookies publicitaires tiers, de pixels de suivi ni d&rsquo;outils d&rsquo;analyse comportementale
          sur wslatl.com. Vous pouvez gérer ou désactiver les cookies dans les réglages de votre navigateur, mais cela peut
          affecter le fonctionnement des espaces authentifiés comme notre portail de facturation et nos panneaux d&rsquo;hébergement.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Vos droits et vos choix">
        <p>
          Selon l&rsquo;endroit où vous vous trouvez, vous pouvez disposer des droits suivants concernant vos données personnelles&nbsp;:
        </p>
        <ul>
          <li><strong>Accès&nbsp;:</strong> demander une copie des données personnelles que nous détenons à votre sujet.</li>
          <li><strong>Rectification&nbsp;:</strong> demander que nous corrigions des données inexactes ou incomplètes.</li>
          <li><strong>Effacement&nbsp;:</strong> demander la suppression de vos données personnelles, sous réserve des obligations légales de conservation.</li>
          <li><strong>Portabilité&nbsp;:</strong> demander vos données dans un format structuré et lisible par machine.</li>
          <li><strong>Limitation&nbsp;:</strong> demander que nous limitions la façon dont nous traitons vos données.</li>
          <li><strong>Opposition&nbsp;:</strong> vous opposer à certains types de traitement de données.</li>
        </ul>
        <p>
          Pour exercer l&rsquo;un de ces droits, contactez-nous à{' '}
          <Email name="support" />.
          Nous répondrons dans un délai de 30 jours. Nous pouvons avoir besoin de vérifier votre identité avant de traiter votre demande.
        </p>
        <p>
          <strong>Les résidents de Californie</strong> peuvent disposer de droits
          supplémentaires au titre du California Consumer Privacy Act (CCPA) et du California Privacy Rights Act (CPRA),
          dont le droit de savoir quelles informations personnelles sont vendues ou partagées et le droit de s&rsquo;y opposer.
          Nous ne vendons pas d&rsquo;informations personnelles, les droits d&rsquo;opposition prévus par le CCPA ne s&rsquo;appliquent donc pas.
        </p>
        <p>
          <strong>Les résidents de l&rsquo;EEE et du Royaume-Uni</strong> disposent de droits au titre du
          RGPD et du UK GDPR, dont les droits listés ci-dessus. Notre base légale pour traiter vos données
          est principalement l&rsquo;exécution d&rsquo;un contrat (la fourniture des services que vous avez demandés) et le respect
          d&rsquo;obligations légales. Les transferts de vos données hors de l&rsquo;EEE ou du Royaume-Uni sont décrits à la
          section 4.5.
        </p>

        <LegalSubSection title="8.1 Droit d’introduire une réclamation auprès d’une autorité de contrôle">
          <p>
            Si vous êtes situé dans l&rsquo;Espace économique européen, au Royaume-Uni ou en
            Suisse, vous avez le droit, au titre de l&rsquo;article 77 du RGPD et de la disposition
            équivalente du UK GDPR, d&rsquo;introduire une réclamation auprès d&rsquo;une autorité
            de contrôle en matière de protection des données. Vous pouvez saisir l&rsquo;autorité du
            pays où vous résidez, où vous travaillez, ou dans lequel vous estimez que le problème
            s&rsquo;est produit.
          </p>
          <p>
            Au Royaume-Uni, cette autorité est l&rsquo;Information Commissioner&rsquo;s Office.
            Dans l&rsquo;EEE, chaque État membre a sa propre autorité, et le Comité européen de la
            protection des données publie la liste à jour.
          </p>
          <p>
            Vous n&rsquo;êtes pas obligé de vous adresser d&rsquo;abord à nous, et exercer ce droit
            n&rsquo;affecte aucun autre recours à votre disposition. Cela dit, nous préférons
            sincèrement être informés directement d&rsquo;un problème. Écrivez à{' '}
            <Email name="support" />{' '}
            et nous le prendrons au sérieux.
          </p>
        </LegalSubSection>

        <LegalSubSection title="8.2 Demandes concernant des données hébergées sur le service d’un tiers">
          <p>
            Si vos données personnelles sont détenues sur un service qu&rsquo;un client WSLATL
            exploite sur notre infrastructure, nous sommes sous-traitant de ces données et non
            responsable du traitement, comme expliqué à la section 1.1. Nous ne sommes généralement
            pas en mesure d&rsquo;y accéder, de les corriger ou de les supprimer à votre demande,
            parce qu&rsquo;il ne nous appartient pas d&rsquo;en décider.
          </p>
          <p>
            Adressez votre demande à l&rsquo;exploitant du service que vous avez utilisé. Si vous
            ne parvenez pas à l&rsquo;identifier ou à le joindre, contactez-nous et nous
            transmettrons votre demande au client lorsque nous pouvons raisonnablement le faire.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="9" title="Conditions d’âge et vie privée des enfants">
        <p>Nous appliquons une politique d&rsquo;âge stricte à trois niveaux, qui s&rsquo;applique à notre site web, à notre portail de facturation et à tous nos services d&rsquo;hébergement&nbsp;:</p>

        <Tiers>
          <Tier tone="critical" title="Moins de 13 ans : non autorisé">
            Il est strictement interdit aux personnes âgées de moins de 13 ans d&rsquo;utiliser un
            service WSLATL, y compris notre site web, notre portail de facturation et nos panneaux
            d&rsquo;hébergement. Nous ne collectons pas sciemment d&rsquo;informations personnelles
            auprès de personnes de moins de 13 ans. Si nous découvrons ou si l&rsquo;on nous signale
            qu&rsquo;un utilisateur a moins de 13 ans, son compte sera immédiatement et
            définitivement banni et toutes les données associées seront supprimées. Nous prenons
            cela au sérieux et nous avons une tolérance zéro pour les accès en dessous de
            l&rsquo;âge requis.
          </Tier>
          <Tier tone="caution" title="De 13 à 17 ans : autorisé avec le consentement d’un adulte">
            Nous accueillons les utilisateurs âgés de 13 à 17 ans, mais un parent ou un tuteur légal
            doit donner un consentement explicite avant que le compte ne soit utilisé. En
            s&rsquo;inscrivant ou en utilisant nos services, les utilisateurs de cette tranche
            d&rsquo;âge confirment qu&rsquo;un parent ou un tuteur a examiné et accepté en leur nom
            nos Conditions de service, notre Politique de confidentialité et notre Politique
            d&rsquo;usage acceptable. L&rsquo;adulte qui consent assume l&rsquo;entière
            responsabilité de l&rsquo;activité du compte du mineur et de tous les frais associés. Si
            nous découvrons qu&rsquo;un compte de cette tranche d&rsquo;âge a été créé sans le
            consentement d&rsquo;un adulte, nous suspendrons le compte jusqu&rsquo;à ce qu&rsquo;un
            consentement valable soit fourni.
          </Tier>
          <Tier tone="good" title="18 ans et plus : pleinement autorisé">
            Les adultes âgés de 18 ans ou plus peuvent s&rsquo;inscrire et utiliser nos services
            sans aucune exigence de consentement supplémentaire, sous réserve de la validation du
            compte dans le cadre de notre modèle uniquement sur candidature et du respect de nos
            Conditions et de notre Politique d&rsquo;usage acceptable.
          </Tier>
        </Tiers>

        <p>
          Si vous êtes parent ou tuteur et que vous pensez que votre enfant de moins de 13 ans s&rsquo;est inscrit chez nous ou
          nous a fourni des informations personnelles à votre insu, contactez-nous immédiatement à{' '}
          <Email name="support" />.
          Nous supprimerons définitivement le compte et toutes les données associées aussi vite que possible.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Liens et services tiers">
        <p>
          Notre site web et nos panneaux peuvent contenir des liens vers des services tiers ou des intégrations avec eux, dont
          Discord, GitHub et d&rsquo;autres. La présente politique de confidentialité ne s&rsquo;applique pas à ces services tiers.
          Nous vous encourageons à consulter les politiques de confidentialité de tout service tiers que vous utilisez en lien
          avec notre plateforme. Nous ne sommes pas responsables des pratiques de confidentialité des tiers.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique de confidentialité de temps à autre pour refléter des changements dans nos pratiques,
          dans les exigences légales ou dans nos services. Lorsque nous apportons des modifications substantielles, nous&nbsp;:
        </p>
        <ul>
          <li>Mettrons à jour la date d&rsquo;effet affichée en haut de cette page</li>
          <li>Informerons les clients actifs par e-mail avec un résumé de ce qui a changé</li>
          <li>Publierons la politique mise à jour à l&rsquo;adresse {siteConfig.paths.privacy}</li>
        </ul>
        <p>
          La poursuite de votre utilisation de nos services après la date d&rsquo;effet de toute modification vaut
          acceptation de la politique de confidentialité mise à jour. Si vous êtes en désaccord avec des modifications substantielles, vous pouvez
          résilier votre service avant la date d&rsquo;effet.
        </p>
      </LegalSection>

      <LegalSection number="12" title="Nous contacter">
        <p>
          Les questions, préoccupations ou demandes relatives à la présente politique de confidentialité doivent être adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
