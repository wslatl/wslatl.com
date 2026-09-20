import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function SubprocessorsContent() {
  return (
    <>
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          Cette page liste les tiers qui traitent des données personnelles pour le compte de
          WSLATL LLC (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;,
          &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;) afin que nous puissions
          exploiter notre site web, notre portail de facturation, nos panneaux
          d&rsquo;hébergement et nos canaux de support. Elle vient à l&rsquo;appui de la
          section 4.1 de notre{' '}
          <Link href={siteConfig.paths.privacy}>Politique de confidentialité</Link>,
          qui ne décrit ces destinataires que par catégorie.
        </p>
        <p>
          Un sous-traitant ultérieur est une société que nous engageons et qui peut manipuler des
          données personnelles dans le cadre de la fourniture d&rsquo;un service à notre profit.
          Chacun ne reçoit que les données nécessaires à sa fonction. Nous ne vendons pas de
          données personnelles et nous ne les partageons pas à des fins publicitaires.
        </p>
        <p>
          Cette liste couvre les traitements effectués par WSLATL. Elle ne couvre pas les services
          que vous choisissez d&rsquo;installer et de faire tourner vous-même sur un serveur que
          nous hébergeons pour vous. Pour ces données, voir la section 5 ci-dessous.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Sous-traitants ultérieurs">
        <p>
          Les tiers suivants peuvent traiter des données personnelles pour notre compte. La
          colonne &laquo;&nbsp;Localisation&nbsp;&raquo; indique où le prestataire est établi et,
          le cas échéant, l&rsquo;empreinte générale de l&rsquo;infrastructure qu&rsquo;il utilise.
        </p>

        <ScrollTable label="Sous-traitants ultérieurs">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Sous-traitant ultérieur</th>
                <th scope="col">Finalité</th>
                <th scope="col">Catégories de données</th>
                <th scope="col">Localisation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Stripe</td>
                <td>Traitement des paiements par carte et facturation dans le portail client</td>
                <td>Nom, adresse e-mail, adresse de facturation, données de carte de paiement, enregistrements de transactions, adresse IP</td>
                <td>États-Unis, avec traitement mondial</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">PayPal</td>
                <td>Traitement de paiement alternatif dans le portail client</td>
                <td>Nom, adresse e-mail, identifiants de compte PayPal, enregistrements de transactions</td>
                <td>États-Unis, avec traitement mondial</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (Turnstile)</td>
                <td>Protection contre les bots et les abus à l&rsquo;inscription, à la connexion et sur d&rsquo;autres formulaires publics</td>
                <td>Adresse IP, signaux de navigateur et d&rsquo;appareil, jetons de challenge</td>
                <td>États-Unis, avec un réseau edge mondial</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Cloudflare (CDN et DNS)</td>
                <td>Diffusion de contenu, résolution DNS et protection contre les attaques par déni de service pour nos sites publics</td>
                <td>Adresse IP, métadonnées de requête, en-têtes HTTP, données de connexion TLS</td>
                <td>États-Unis, avec un réseau edge mondial</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Passerelle e-mail WSLATL (smtp.wslatl.com)</td>
                <td>Envoi des e-mails transactionnels tels que les factures, les avis de compte et les réinitialisations de mot de passe</td>
                <td>Nom, adresse e-mail, et le contenu des messages que nous vous envoyons</td>
                <td>Exploitée par WSLATL sur sa propre infrastructure</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Pterodactyl</td>
                <td>Panneau de contrôle de serveurs de jeu utilisé pour provisionner et gérer l&rsquo;hébergement de jeu</td>
                <td>Identifiants de compte, adresse e-mail, configuration du serveur, logs d&rsquo;activité du panneau</td>
                <td>Logiciel open source exploité par WSLATL sur sa propre infrastructure</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">VirtFusion</td>
                <td>Panneau de contrôle VPS utilisé pour provisionner et gérer les serveurs virtuels</td>
                <td>Identifiants de compte, adresse e-mail, configuration du VPS, attributions d&rsquo;adresses IP, logs d&rsquo;activité du panneau</td>
                <td>Logiciel sous licence exploité par WSLATL sur sa propre infrastructure&nbsp;; un accès du support de l&rsquo;éditeur est possible pendant un dépannage</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Partenaire(s) datacenter</td>
                <td>Hébergement physique, espace en baie, alimentation et transit réseau pour nos serveurs</td>
                <td>Garde physique des serveurs, et donc de toutes les données qui y sont stockées</td>
                <td>Voir la note ci-dessous</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">jsDelivr et cdnjs</td>
                <td>Diffusion des bibliothèques front-end courantes utilisées par nos panneaux</td>
                <td>Adresse IP, user agent et métadonnées de requête, envoyés par votre navigateur lorsqu&rsquo;il charge une ressource</td>
                <td>Réseaux CDN publics avec des nœuds edge répartis dans le monde entier</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Photon (données OpenStreetMap)</td>
                <td>Suggestions de saisie automatique d&rsquo;adresse sur les formulaires d&rsquo;inscription et de profil</td>
                <td>Le texte d&rsquo;adresse partiel que vous saisissez dans un champ d&rsquo;adresse</td>
                <td>Europe</td>
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
        <Callout tone="caution" title="Partenaire datacenter : à publier">
          L&rsquo;exploitant et la localisation des installations qui hébergent nos serveurs sont
          en cours de confirmation et seront nommés ici. Si vous avez besoin de cette information
          avant sa publication, par exemple pour compléter votre propre évaluation de
          fournisseurs, contactez-nous à <Email name="support" />{' '}
          et nous vous la communiquerons.
        </Callout>

        <p>
          Nous pouvons ajouter ou remplacer un sous-traitant ultérieur à mesure que notre
          infrastructure évolue. Lorsque nous le faisons, nous mettons cette page à jour. Les
          clients actifs qui ont demandé à être informés des changements de sous-traitants
          ultérieurs en seront avisés par e-mail&nbsp;; vous pouvez vous y inscrire en écrivant
          à{' '}
          <Email name="support" />.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Notes sur certaines entrées">

        <LegalSubSection title="3.1 Prestataires de paiement">
          <p>
            Les données de carte sont saisies directement auprès du prestataire de paiement et
            sont traitées par ce prestataire. Comme indiqué à la section 2.2 de notre Politique de
            confidentialité, nous ne stockons ni votre numéro de carte complet ni votre CVV. Ce
            que nous conservons, c&rsquo;est le type de moyen de paiement, les quatre derniers
            chiffres et les identifiants de transaction.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Saisie automatique d’adresse">
          <p>
            Les suggestions d&rsquo;adresse sont demandées par notre propre serveur plutôt que par
            votre navigateur. Votre adresse IP n&rsquo;est donc pas exposée au service de
            géocodage&nbsp;; seul le texte d&rsquo;adresse partiel que vous avez saisi est envoyé.
            Nous n&rsquo;envoyons pas le reste de votre formulaire, l&rsquo;identité de votre
            compte, ni votre adresse e-mail avec la recherche.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 CDN publics">
          <p>
            Lorsqu&rsquo;une page charge une bibliothèque front-end depuis un CDN public, votre
            navigateur effectue une requête directe vers ce CDN, ce qui lui révèle nécessairement
            votre adresse IP et votre user agent. C&rsquo;est le fonctionnement normal des
            ressources diffusées par CDN, et ce n&rsquo;est pas quelque chose que nous leur
            transmettons nous-mêmes.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.4 Systèmes que nous exploitons nous-mêmes">
          <p>
            Notre passerelle e-mail, le panneau Pterodactyl et le panneau VirtFusion tournent sur
            une infrastructure que nous contrôlons plutôt que comme des services tiers hébergés.
            Ils sont listés ici par souci d&rsquo;exhaustivité parce qu&rsquo;ils traitent des
            données personnelles, et parce qu&rsquo;un éditeur de logiciel peut, dans certaines
            circonstances, se voir accorder un accès pendant une investigation de support.
            Lorsque cela se produit, l&rsquo;accès est limité à ce qui est nécessaire pour
            résoudre le problème.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Transferts internationaux">
        <p>
          WSLATL LLC est établie dans l&rsquo;État du Missouri, aux États-Unis, et nos services
          sont exploités depuis les États-Unis. Si vous êtes situé dans l&rsquo;Espace économique
          européen, au Royaume-Uni ou en Suisse, l&rsquo;utilisation de nos services implique le
          transfert de vos données personnelles vers les États-Unis et, lorsqu&rsquo;un
          sous-traitant ultérieur exploite un réseau mondial, vers d&rsquo;autres pays.
        </p>
        <p>
          Les États-Unis n&rsquo;ont pas fait l&rsquo;objet d&rsquo;une décision
          d&rsquo;adéquation générale couvrant tous les destinataires. Lorsque nous transférons
          des données personnelles hors de l&rsquo;EEE ou du Royaume-Uni, nous nous appuyons sur
          les éléments suivants&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Nécessité pour le contrat.</strong> Pour
            la plupart des transferts, le transfert est nécessaire à l&rsquo;exécution du contrat
            dont vous nous avez demandé l&rsquo;exécution. On ne peut pas vous fournir un serveur
            dans notre installation sans que vos données parviennent à notre installation.
          </li>
          <li>
            <strong>Clauses contractuelles types.</strong>{' '}
            Lorsqu&rsquo;un sous-traitant ultérieur les propose, nous nous appuyons sur les clauses
            contractuelles types de la Commission européenne, et sur l&rsquo;UK International Data
            Transfer Addendum pour les transferts vers le Royaume-Uni. Plusieurs des prestataires
            listés ci-dessus intègrent ces clauses dans leurs conditions standard de traitement des
            données.
          </li>
          <li>
            <strong>Cadres au niveau du prestataire.</strong> Certains
            des prestataires listés ci-dessus maintiennent leurs propres certifications ou
            mécanismes de transfert couvrant les données qu&rsquo;ils reçoivent. Ces mécanismes
            sont ceux du prestataire, pas les nôtres, et il vous appartient de consulter la
            documentation de confidentialité du prestataire lui-même pour le détail.
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
          WSLATL ne maintient pas actuellement sa propre certification au titre de l&rsquo;EU-US
          Data Privacy Framework. Nous ne revendiquons pas d&rsquo;adéquation sur cette base.
        </p>
        <p>
          Si vous avez besoin d&rsquo;un accord de traitement des données, d&rsquo;une copie des
          clauses contractuelles types telles que nous les appliquons, ou d&rsquo;une analyse
          d&rsquo;impact du transfert pour votre propre dossier de conformité, contactez-nous
          à{' '}
          <Email name="support" />{' '}
          et nous étudierons cela avec vous.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Les données que vous placez sur vos propres serveurs">
        <p>
          Il existe une distinction importante entre les deux types de données impliqués dans
          l&rsquo;hébergement.
        </p>
        <ul>
          <li>
            <strong>Vos données de compte.</strong> Les
            informations que vous nous donnez pour ouvrir et faire fonctionner votre compte, comme
            votre nom, votre adresse e-mail, votre adresse de facturation et votre historique de
            factures. WSLATL est le responsable du traitement de ces données et les sous-traitants
            ultérieurs listés ci-dessus sont engagés par nous.
          </li>
          <li>
            <strong>Les données sur vos services.</strong> Tout
            ce que vous ou vos utilisateurs stockez sur un serveur que nous hébergeons pour vous, y
            compris les bases de données, les données de serveur de jeu, les fichiers téléversés et
            les logs applicatifs. Vous décidez de ce qui est collecté et pourquoi. WSLATL est
            sous-traitant de ces données, et non le responsable du traitement, et cette liste de
            sous-traitants ultérieurs n&rsquo;est pas la liste de vos sous-traitants ultérieurs.
          </li>
        </ul>
        <p>
          Si vous hébergez les données personnelles d&rsquo;autres personnes sur un service
          WSLATL, les obligations d&rsquo;un responsable du traitement au titre du RGPD ou
          d&rsquo;une autre loi applicable vous incombent. Cela comprend le fait d&rsquo;avoir une
          base légale, d&rsquo;informer vos propres utilisateurs et de tenir votre propre registre
          des traitements. Voir la section 12 de nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>{' '}
          pour l&rsquo;indemnisation correspondante.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Modifications de la présente liste">
        <p>
          Nous tiendrons cette page à jour à mesure que notre infrastructure évolue.
          Lorsqu&rsquo;un sous-traitant ultérieur est ajouté ou remplacé, nous mettrons à jour la
          date d&rsquo;effet en haut de cette page et publierons la liste mise à jour à
          l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.subprocessors}>
            {siteConfig.siteUrl}{siteConfig.paths.subprocessors}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Contact">
        <p>
          Les questions sur cette liste, les demandes d&rsquo;accord de traitement des données et
          les demandes relatives à la vie privée en général doivent être adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
