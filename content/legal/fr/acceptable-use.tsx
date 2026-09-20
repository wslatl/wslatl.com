import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow, ScrollTable, Tier, Tiers } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AcceptableUseContent() {
  return (
    <>
      <LegalSection number="1" title="Introduction et champ d’application">
        <p>
          La présente politique d&rsquo;usage acceptable (&laquo;&nbsp;AUP&nbsp;&raquo;)
          s&rsquo;applique à tous les clients, utilisateurs et personnes qui accèdent aux services
          fournis par WSLATL LLC, y compris, sans s&rsquo;y limiter, les serveurs dédiés,
          l&rsquo;hébergement de serveurs de jeu, l&rsquo;hébergement VPS et les services
          d&rsquo;hébergement web.
        </p>
        <p>
          La présente AUP est incorporée à nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>, dont elle fait partie intégrante. En utilisant
          un service WSLATL, vous acceptez de vous conformer à la présente politique. Les
          violations peuvent entraîner la suspension ou la résiliation immédiate de vos services
          sans remboursement, et éventuellement un signalement aux forces de l&rsquo;ordre.
        </p>
        <p>
          Nous sommes un petit hébergeur privé. Notre infrastructure sert de vrais clients dont les
          activités et les projets dépendent d&rsquo;une disponibilité fiable. Nous protégeons cette
          infrastructure avec fermeté et nous avons une tolérance zéro pour toute activité qui la
          met en danger, elle ou ces clients.
        </p>

        <Tiers title="Conditions d’âge">
          <Tier tone="critical" title="Moins de 13 ans : interdit">
            Les personnes de moins de 13 ans ne sont pas autorisées à utiliser un service WSLATL.
            Les comptes dont il s&rsquo;avère qu&rsquo;ils appartiennent à des utilisateurs de moins
            de 13 ans sont immédiatement bannis de façon permanente et toutes les données sont
            supprimées. Aucune exception.
          </Tier>
          <Tier tone="caution" title="De 13 à 17 ans : consentement d’un adulte requis">
            Les utilisateurs âgés de 13 à 17 ans sont les bienvenus, mais un parent ou un tuteur
            légal doit avoir examiné les présentes conditions et y avoir consenti en leur nom avant
            que le compte ne soit utilisé. L&rsquo;adulte qui consent est responsable de toute
            l&rsquo;activité du compte et de tous les frais.
          </Tier>
          <Tier tone="good" title="18 ans et plus : pleinement autorisé">
            Aucune condition supplémentaire liée à l&rsquo;âge au-delà de la validation standard du
            compte.
          </Tier>
        </Tiers>
      </LegalSection>

      <LegalSection number="2" title="Utilisations autorisées">
        <p>Les services WSLATL sont fournis à des fins licites. Les utilisations autorisées comprennent&nbsp;:</p>
        <ul>
          <li>L&rsquo;hébergement de sites web, d&rsquo;applications web, d&rsquo;API REST et de contenus statiques</li>
          <li>L&rsquo;exploitation de serveurs de jeu à usage personnel ou communautaire (conformément aux conditions de l&rsquo;éditeur du jeu)</li>
          <li>Les environnements de développement et de préproduction, les dépôts de code et les pipelines CI/CD</li>
          <li>Les projets personnels, les portfolios et les applications de loisir</li>
          <li>Les applications commerciales légitimes et les infrastructures d&rsquo;entreprise</li>
          <li>Les bases de données, le stockage de fichiers et les infrastructures backend</li>
          <li>Les services VPN ou proxy utilisés pour la protection de votre vie privée personnelle (doivent être déclarés à l&rsquo;inscription&nbsp;; exploiter un service VPN public nécessite une approbation préalable)</li>
          <li>Les serveurs de messagerie pour des e-mails transactionnels ou personnels légitimes (doivent être déclarés à l&rsquo;inscription&nbsp;; l&rsquo;e-mailing en masse nécessite une approbation écrite préalable)</li>
          <li>Les tests logiciels et la recherche en sécurité sur des systèmes que vous possédez ou pour lesquels vous disposez d&rsquo;une autorisation écrite explicite de test</li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Contenus interdits">
        <p>
          Les contenus suivants sont strictement interdits sur l&rsquo;infrastructure WSLATL, en
          toute circonstance. Une violation de la présente section entraînera une résiliation
          immédiate sans préavis ni remboursement&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Contenus d&rsquo;abus sexuels sur mineurs (CSAM)&nbsp;:</strong>{' '}
            Tout contenu qui exploite sexuellement des mineurs, les représente sexuellement ou les
            met en danger. Tolérance zéro. Les violations seront signalées immédiatement au
            National Center for Missing &amp; Exploited Children (NCMEC) et aux forces de
            l&rsquo;ordre.
          </li>
          <li>
            <strong>Terrorisme et extrémisme violent&nbsp;:</strong>{' '}
            Les contenus qui font la promotion du terrorisme, de la violence de masse ou des
            mouvements extrémistes violents, qui recrutent pour eux, les financent ou les facilitent.
          </li>
          <li>
            <strong>Malwares et logiciels malveillants&nbsp;:</strong>{' '}
            L&rsquo;hébergement, la distribution ou le développement de virus, ransomwares,
            spywares, chevaux de Troie, keyloggers, rootkits, ou de tout autre logiciel conçu pour
            endommager ou perturber des systèmes informatiques, ou pour y accéder sans autorisation.
          </li>
          <li>
            <strong>Phishing et fraude&nbsp;:</strong>{' '}
            Les pages, domaines ou applications conçus pour amener par tromperie les utilisateurs à
            fournir des identifiants, des informations financières ou des données personnelles sous
            de faux prétextes.
          </li>
          <li>
            <strong>Contenus portant atteinte au droit d&rsquo;auteur&nbsp;:</strong>{' '}
            L&rsquo;hébergement ou la distribution de contenus qui portent atteinte aux droits
            d&rsquo;auteur, aux marques ou à d&rsquo;autres droits de propriété intellectuelle
            d&rsquo;une personne ou d&rsquo;une entité.
          </li>
          <li>
            <strong>Contenus contrefaits ou frauduleux&nbsp;:</strong>{' '}
            Fausses boutiques, produits contrefaits, usines à diplômes, ou toute activité
            commerciale frauduleuse.
          </li>
          <li>
            <strong>Armes illégales et substances réglementées&nbsp;:</strong>{' '}
            Les contenus qui facilitent la vente, la fabrication ou la distribution illégales
            d&rsquo;armes, de substances réglementées ou d&rsquo;autres marchandises de contrebande.
          </li>
          <li>
            <strong>Jeux d&rsquo;argent sans licence&nbsp;:</strong>{' '}
            L&rsquo;exploitation de services de jeux d&rsquo;argent en ligne sans l&rsquo;ensemble des licences et autorisations légales applicables.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="4" title="Activités interdites">

        <LegalSubSection title="4.1 Attaques réseau et abus d’infrastructure">
          <p>Les activités suivantes sont strictement interdites et entraîneront une résiliation immédiate&nbsp;:</p>
          <ul>
            <li>
              <strong>Attaques DDoS&nbsp;:</strong> Mener,
              faciliter ou lancer des attaques par déni de service distribué contre une cible
              quelconque, ou y participer, y compris contre d&rsquo;autres clients WSLATL, des
              services externes ou toute infrastructure internet. C&rsquo;est la règle que nous
              faisons respecter le plus strictement.
            </li>
            <li>
              <strong>Scan de ports et de vulnérabilités&nbsp;:</strong>{' '}
              Scanner, sonder ou cartographier le réseau ou les services de systèmes que vous ne
              possédez pas ou pour lesquels vous ne disposez pas d&rsquo;une autorisation écrite
              explicite de test
            </li>
            <li>
              <strong>Interception réseau&nbsp;:</strong>{' '}
              Attaques de l&rsquo;homme du milieu, empoisonnement ARP, détournement DNS, SSL
              stripping, ou toute technique destinée à intercepter ou à altérer le trafic réseau
            </li>
            <li>L&rsquo;usurpation d&rsquo;adresse IP ou l&rsquo;envoi de trafic avec des adresses source falsifiées</li>
            <li>Tenter d&rsquo;exploiter des vulnérabilités de l&rsquo;infrastructure WSLATL ou des services d&rsquo;autres clients</li>
            <li>Utiliser l&rsquo;infrastructure WSLATL comme point de préparation ou de relais pour des attaques contre des systèmes externes</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.2 Spam et communications non sollicitées">
          <ul>
            <li>Envoyer des e-mails en masse non sollicités (spam) de quelque nature que ce soit</li>
            <li>Exploiter un relais de messagerie ouvert pouvant servir à envoyer du spam</li>
            <li>L&rsquo;usurpation d&rsquo;adresse e-mail, les campagnes de phishing ou l&rsquo;usurpation d&rsquo;identité</li>
            <li>Le spam par SMS ou toute forme de messagerie de masse non sollicitée</li>
            <li>Extraire, collecter ou compiler des adresses e-mail ou des données personnelles sans consentement</li>
            <li>Envoyer des e-mails commerciaux en masse sans mécanisme de désinscription conforme au CAN-SPAM</li>
          </ul>
          <p>
            Les clients qui ont besoin d&rsquo;envoyer en volume des e-mails transactionnels ou
            marketing légitimes doivent déclarer ce cas d&rsquo;usage à l&rsquo;inscription et
            rester en conformité avec le CAN-SPAM Act et toute autre législation anti-spam
            applicable.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.3 Accès non autorisé">
          <ul>
            <li>Tenter d&rsquo;accéder à un système informatique, un compte, une base de données ou un réseau auquel vous n&rsquo;êtes pas autorisé à accéder</li>
            <li>Les attaques par brute-force contre une interface de connexion quelconque, y compris SSH, RDP, applications web et API</li>
            <li>Le credential stuffing à l&rsquo;aide de jeux d&rsquo;identifiants fuités ou volés</li>
            <li>L&rsquo;ingénierie sociale visant le personnel de WSLATL, d&rsquo;autres clients ou tout tiers</li>
            <li>Utiliser nos services pour faciliter un accès non autorisé à des systèmes tiers</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.4 Minage de cryptomonnaies">
          <ul>
            <li>Le minage de cryptomonnaies ou de blockchain, de quelque nature que ce soit, est <strong>interdit par défaut</strong> sur les offres d&rsquo;hébergement de jeu et d&rsquo;hébergement web</li>
            <li>Le minage sur les offres VPS ou serveurs dédiés nécessite une <strong>approbation écrite</strong> préalable de WSLATL avant le début des opérations</li>
            <li>Les opérations de minage approuvées ne doivent pas nuire à la consommation électrique du datacenter, aux systèmes de refroidissement ou à l&rsquo;infrastructure partagée</li>
            <li>Nous nous réservons le droit de révoquer une approbation de minage à tout moment si elle a un impact sur notre infrastructure ou sur d&rsquo;autres clients</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.5 Activités illégales">
          <ul>
            <li>Utiliser l&rsquo;infrastructure WSLATL pour toute activité qui enfreint le droit local, étatique, fédéral ou international applicable</li>
            <li>Faciliter la fraude, le blanchiment d&rsquo;argent, la fraude par voie électronique ou les délits financiers</li>
            <li>Exploiter des places de marché illégales ou des services du darknet</li>
            <li>Contourner des décisions de justice légales ou faire obstruction aux forces de l&rsquo;ordre</li>
            <li>Contourner des sanctions ou se livrer à des activités interdites par les lois applicables en matière de contrôle des exportations</li>
          </ul>
        </LegalSubSection>

        <LegalSubSection title="4.6 Atteintes à la vie privée">
          <ul>
            <li>Collecter, traiter ou stocker des données personnelles sans base légale appropriée ni consentement</li>
            <li>Exploiter des services en violation du RGPD, du CCPA, du COPPA ou d&rsquo;autres lois applicables en matière de protection des données</li>
            <li>Le doxxing ou la publication d&rsquo;informations personnelles privées concernant des personnes sans leur consentement</li>
            <li>Les stalkerwares ou logiciels de surveillance qui fonctionnent à l&rsquo;insu de la personne surveillée</li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Règles d’utilisation des ressources">
        <p>
          Une utilisation responsable des ressources est nécessaire pour maintenir un environnement
          équitable et stable pour tous les clients. Les règles suivantes s&rsquo;appliquent&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Bande passante&nbsp;:</strong> Vous pouvez utiliser la bande passante
            jusqu&rsquo;à l&rsquo;allocation incluse dans votre offre. Les dépassements sont
            facturés aux tarifs indiqués dans votre portail de facturation. Les offres à bande
            passante non limitée sont soumises à un usage raisonnable&nbsp;; l&rsquo;abus
            d&rsquo;une offre non limitée peut entraîner une limitation du débit ou une montée en
            gamme obligatoire.
          </li>
          <li>
            <strong>CPU et RAM&nbsp;:</strong> La consommation
            intentionnelle de ressources au-delà de l&rsquo;allocation de votre offre, au détriment
            d&rsquo;autres clients (sur infrastructure partagée) ou pour contourner les limites de
            l&rsquo;offre, est interdite.
          </li>
          <li>
            <strong>I/O disque&nbsp;:</strong> Les charges de
            travail qui génèrent des I/O disque élevées et soutenues affectant l&rsquo;infrastructure
            de stockage partagée doivent être discutées avec nous à l&rsquo;avance.
          </li>
          <li>
            <strong>Connexions sortantes&nbsp;:</strong> Générer
            des volumes anormalement élevés de connexions réseau sortantes (par exemple des floods
            de connexions) sans notification préalable est interdit.
          </li>
        </ul>
        <p>
          Si vous avez un cas d&rsquo;usage légitime qui nécessite une forte consommation de
          ressources, parlez-nous-en avant que cela ne pose problème. Nous sommes souples avec les
          clients qui communiquent ouvertement.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Règles propres aux serveurs de jeu">
        <p>Pour les clients qui utilisent nos services d&rsquo;hébergement de serveurs de jeu&nbsp;:</p>
        <ul>
          <li>Les serveurs de jeu doivent exécuter des logiciels et des configurations conformes aux conditions de service et au contrat de licence utilisateur final de l&rsquo;éditeur du jeu concerné</li>
          <li>Héberger des logiciels de serveur de jeu piratés, des clients crackés ou tout contenu de jeu portant atteinte au droit d&rsquo;auteur est interdit</li>
          <li>N&rsquo;exécutez pas de processus sans rapport avec votre serveur de jeu sur les offres d&rsquo;hébergement de jeu sans approbation préalable (par exemple minage, bots, scraping)</li>
          <li>Les mods, plugins et configurations de serveur ne doivent pas servir à mener l&rsquo;une des activités interdites listées dans la présente AUP</li>
          <li>Notre protection DDoS est fournie pour la défense de votre serveur&nbsp;; n&rsquo;essayez pas de la contourner, de la désactiver ni d&rsquo;en abuser</li>
          <li>Dépasser la limite de slots joueurs de votre offre ou les ressources allouées nécessite une montée en gamme avant utilisation, et non après</li>
          <li>Les serveurs de jeu utilisés pour harceler, menacer ou nuire à d&rsquo;autres joueurs peuvent faire l&rsquo;objet d&rsquo;une suspension le temps d&rsquo;une enquête</li>
        </ul>
      </LegalSection>

      <LegalSection number="7" title="Tests et recherche en sécurité">
        <p>
          La recherche en sécurité et les tests d&rsquo;intrusion ne sont autorisés que dans les conditions suivantes&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Vos propres systèmes&nbsp;:</strong> Vous pouvez mener
            des tests de sécurité sur les serveurs et services que vous possédez et contrôlez, sans
            restriction au-delà des interdictions de la section 4.
          </li>
          <li>
            <strong>Systèmes tiers autorisés&nbsp;:</strong>{' '}
            Vous ne pouvez mener des tests de sécurité sur des systèmes tiers que si vous disposez
            d&rsquo;une autorisation écrite explicite et documentée du propriétaire du système. Nous pouvons demander une preuve de cette autorisation.
          </li>
          <li>
            <strong>Infrastructure WSLATL&nbsp;:</strong> Les tests
            contre l&rsquo;infrastructure WSLATL elle-même (nos panneaux, nos réseaux ou les serveurs d&rsquo;autres clients)
            sont interdits sans notre autorisation écrite préalable, quelle que soit l&rsquo;intention.
          </li>
        </ul>
        <p>
          Les infrastructures de compétition CTF (Capture the Flag) et les honeypots délibérés sont
          autorisés moyennant une information préalable de notre équipe.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Signaler un abus">
        <p>
          Si vous pensez que l&rsquo;infrastructure WSLATL est utilisée à des fins abusives,
          illégales ou nuisibles, merci de nous le signaler immédiatement. Nous prenons au sérieux
          tous les signalements d&rsquo;abus et nous enquêtons rapidement.
        </p>
        <InfoCard title="Signaler un abus à">
          <InfoRow label="E-mail">
            <Email name="abuse" /> (Objet&nbsp;: Abuse Report)
          </InfoRow>
          <InfoRow label="Discord">
            <ShortLink name="discord" />
          </InfoRow>
        </InfoCard>
        <p>
          Merci d&rsquo;inclure autant de détails que possible dans votre signalement&nbsp;: les
          adresses IP concernées, les horodatages (avec le fuseau horaire), des extraits de logs, des URL et une description de l&rsquo;activité abusive.
          Plus vous fournissez de détails, plus vite nous pouvons enquêter et répondre.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Application des règles">
        <p>
          WSLATL se réserve le droit de prendre toute mesure que nous jugeons appropriée en réponse
          aux violations de l&rsquo;AUP. L&rsquo;application des règles est proportionnelle à la
          gravité, mais nous donnons toujours la priorité à la protection de notre réseau et des
          autres clients.
        </p>

        <ScrollTable label="Mesures selon la gravité">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Gravité</th>
                <th scope="col">Exemples</th>
                <th scope="col">Réponse</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Mineure</td>
                <td>Premier dépassement de ressources, écart mineur aux Conditions de service</td>
                <td>Avertissement + remise en conformité obligatoire dans un délai précisé</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Modérée</td>
                <td>Spam, scan non autorisé, violations mineures répétées</td>
                <td>Suspension immédiate le temps de l&rsquo;enquête&nbsp;; rétablissement possible après remise en conformité</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Grave</td>
                <td>Attaques DDoS, hébergement de malwares, CSAM, activité illégale</td>
                <td>Résiliation immédiate, aucun remboursement, données conservées pour les forces de l&rsquo;ordre, signalement aux autorités</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>WSLATL se réserve le droit&nbsp;:</p>
        <ul>
          <li>De suspendre des services immédiatement et sans préavis lorsqu&rsquo;il existe une menace active et en cours pour notre réseau ou pour des tiers</li>
          <li>De coopérer pleinement et de façon proactive avec les enquêtes des forces de l&rsquo;ordre</li>
          <li>De partager les signalements d&rsquo;abus, les logs et les informations permettant d&rsquo;identifier la source avec les autorités compétentes et les registres d&rsquo;abus (AbuseIPDB, SpamCop, etc.)</li>
          <li>De résilier les comptes des contrevenants récidivistes sans droit à remboursement</li>
          <li>D&rsquo;engager des recours civils ou pénaux contre les clients qui causent un préjudice important</li>
        </ul>

        <Callout tone="caution" title="Remarque sur les abus réseau">
          Si votre serveur est la
          source d&rsquo;un trafic d&rsquo;abus sortant (DDoS, spam, scan), nous suspendrons le
          service d&rsquo;abord et enquêterons ensuite. C&rsquo;est pour protéger les autres clients
          et l&rsquo;internet au sens large. Nous vous contacterons rapidement après la suspension
          pour discuter de nos constatations.
        </Callout>
      </LegalSection>

      <LegalSection number="10" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique d&rsquo;usage acceptable de temps à
          autre pour répondre à de nouvelles menaces, à de nouveaux services ou à de nouvelles
          exigences légales. Lorsque nous apportons des modifications substantielles, nous&nbsp;:
        </p>
        <ul>
          <li>Mettrons à jour la date d&rsquo;effet en haut de cette page</li>
          <li>Informerons les clients actifs par e-mail avec un résumé de ce qui a changé</li>
          <li>Publierons l&rsquo;AUP mise à jour à l&rsquo;adresse {siteConfig.paths.acceptableUse}</li>
        </ul>
        <p>
          La poursuite de votre utilisation des services WSLATL après la date d&rsquo;effet de toute
          modification vaut acceptation de la politique mise à jour.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contact">
        <p>
          Les questions sur la présente politique d&rsquo;usage acceptable, ou sur le fait de savoir
          si un cas d&rsquo;usage précis est autorisé, doivent nous être adressées avant que vous ne
          commenciez, pas après.
        </p>
        <CompanyContact>
          <InfoRow label="E-mail">
            <Email name="support" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
