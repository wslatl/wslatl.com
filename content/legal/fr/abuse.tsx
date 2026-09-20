import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AbuseContent() {
  return (
    <>
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          La présente politique en matière d&rsquo;abus explique comment signaler un abus de
          l&rsquo;infrastructure exploitée par WSLATL LLC (&laquo;&nbsp;WSLATL&nbsp;&raquo;,
          &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou
          &laquo;&nbsp;nos&nbsp;&raquo;), ce que nous faisons d&rsquo;un signalement une fois reçu,
          et comment nous traitons les services de notre réseau qui sont à l&rsquo;origine
          d&rsquo;un abus.
        </p>
        <p>
          Elle complète notre{' '}
          <Link href={siteConfig.paths.acceptableUse}>Politique d&rsquo;usage acceptable</Link>,
          qui définit ce qui est autorisé et ce qui ne l&rsquo;est pas sur notre infrastructure, et
          nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>,
          dans lesquelles les deux sont incorporées par référence. Les plaintes pour atteinte au
          droit d&rsquo;auteur sont traitées dans le cadre de notre{' '}
          <Link href={siteConfig.paths.dmca}>Politique DMCA</Link>{' '}
          plutôt que sur cette page.
        </p>
        <p>
          Nous sommes un petit hébergeur privé, et nous prenons au sérieux les abus de notre
          réseau, à la fois parce qu&rsquo;ils nuisent à autrui et parce qu&rsquo;ils mettent en
          danger les clients qui partagent notre infrastructure. Tout signalement crédible fait
          l&rsquo;objet d&rsquo;une enquête.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Comment signaler un abus">
        <p>
          Si vous pensez qu&rsquo;une infrastructure WSLATL (un serveur, une adresse IP, un site
          web, un serveur de jeu ou une adresse e-mail) est utilisée à des fins abusives, illégales
          ou nuisibles, signalez-le à notre équipe chargée des abus. C&rsquo;est le moyen le plus
          rapide de joindre les personnes qui peuvent agir.
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
          L&rsquo;e-mail est le canal que nous surveillons pour les abus et celui qui crée une
          trace sur laquelle nous pouvons agir. Un signalement fait uniquement dans un salon
          Discord peut passer inaperçu&nbsp;; si une affaire est urgente, envoyez-la par e-mail.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Ce qu’il faut inclure dans un signalement">
        <p>
          Plus votre signalement est précis, plus vite nous pouvons trouver la source et agir.
          Merci d&rsquo;inclure autant des éléments suivants que vous en avez&nbsp;:
        </p>
        <ul>
          <li>L&rsquo;adresse IP, le domaine, l&rsquo;URL ou le serveur concerné</li>
          <li>Les horodatages de l&rsquo;activité, avec le fuseau horaire ou un décalage par rapport à UTC</li>
          <li>Les extraits de logs pertinents, les en-têtes d&rsquo;e-mail ou les captures de paquets, collés sous forme de texte dans la mesure du possible</li>
          <li>Une description claire de l&rsquo;activité et des raisons pour lesquelles vous la jugez abusive</li>
          <li>Comment vous contacter si nous avons besoin de plus d&rsquo;informations</li>
        </ul>
        <p>
          Les logs sont les plus utiles dans leur forme texte d&rsquo;origine, avec les en-têtes
          complets intacts. Les captures d&rsquo;écran conviennent en complément, mais elles sont
          plus difficiles à vérifier à elles seules.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Ce que nous considérons comme un abus">
        <p>
          Un abus est toute utilisation de notre infrastructure qui enfreint notre{' '}
          <Link href={siteConfig.paths.acceptableUse}>Politique d&rsquo;usage acceptable</Link>{' '}
          ou le droit applicable. Les catégories courantes sur lesquelles nous intervenons sont
          notamment&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Attaques réseau.</strong> Trafic DDoS,
            scans de ports et de vulnérabilités, tentatives de brute-force ou tentatives
            d&rsquo;intrusion provenant de notre espace IP.
          </li>
          <li>
            <strong>Spam et courriers non sollicités.</strong> E-mails
            en masse ou non sollicités, relais de messagerie ouverts et usurpation
            d&rsquo;adresse e-mail.
          </li>
          <li>
            <strong>Phishing et fraude.</strong> Pages ou
            services conçus pour dérober des identifiants ou des données de paiement, ou pour
            tromper des personnes à des fins financières.
          </li>
          <li>
            <strong>Malwares.</strong> Hébergement ou
            distribution de virus, de ransomwares, de serveurs de commande et de contrôle, ou
            d&rsquo;autres logiciels malveillants.
          </li>
          <li>
            <strong>Contenus illégaux.</strong> Contenus dont
            l&rsquo;hébergement est illicite, y compris les éléments décrits à la section 3 de
            notre Politique d&rsquo;usage acceptable.
          </li>
          <li>
            <strong>Harcèlement et menaces.</strong> Utiliser
            nos services pour harceler, menacer, doxxer ou mettre en danger une personne.
          </li>
        </ul>
        <p>
          Pour l&rsquo;exposé complet de ce qui est interdit, voir les sections 3 et 4 de la
          Politique d&rsquo;usage acceptable. Les atteintes au droit d&rsquo;auteur sont traitées
          séparément au titre de la{' '}
          <Link href={siteConfig.paths.dmca}>Politique DMCA</Link>.
        </p>
      </LegalSection>

      <LegalSection number="5" title="Ce qui se passe après votre signalement">
        <p>Nous examinons tout signalement crédible. Notre processus général est le suivant&nbsp;:</p>
        <ul>
          <li>
            <strong>Nous en accusons réception.</strong> Nous
            nous efforçons de confirmer la réception d&rsquo;un signalement envoyé par e-mail aussi
            vite que nous le pouvons, et nous donnons la priorité aux abus actifs et en cours sur
            le travail de routine.
          </li>
          <li>
            <strong>Nous enquêtons.</strong> Nous identifions
            le service concerné, examinons les éléments de preuve et déterminons si nos politiques
            ou la loi ont été enfreintes.
          </li>
          <li>
            <strong>Nous agissons de façon proportionnée.</strong> Selon
            la gravité, nous pouvons contacter le client pour qu&rsquo;il remédie au problème,
            retirer ou désactiver des contenus précis, suspendre le service ou résilier le compte.
            L&rsquo;application des règles suit la section 9 de la Politique d&rsquo;usage
            acceptable.
          </li>
        </ul>

        <LegalSubSection title="5.1 Abus sortant actif : suspendre d’abord">
          <p>
            Lorsqu&rsquo;un service de notre réseau est la source active d&rsquo;un abus sortant,
            par exemple un DDoS en cours, une campagne de spam en cours ou du scan actif, nous
            suspendrons le service d&rsquo;abord et enquêterons ensuite, afin de protéger les
            autres clients et l&rsquo;internet au sens large. Nous contactons le client concerné
            rapidement après la suspension pour lui expliquer ce que nous avons constaté.
          </p>
        </LegalSubSection>

        <LegalSubSection title="5.2 Ce que nous pouvons vous dire">
          <p>
            Nous confirmerons qu&rsquo;un signalement a été reçu et traité lorsque nous pouvons
            raisonnablement le faire. Nous ne communiquons pas les détails du compte d&rsquo;un
            autre client, les éléments précis d&rsquo;une enquête, ni l&rsquo;issue d&rsquo;une
            mesure prise à l&rsquo;encontre d&rsquo;un tiers, et nous pouvons être limités dans ce
            que nous pouvons divulguer tant qu&rsquo;une enquête est ouverte ou lorsque la loi
            impose la confidentialité.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="6" title="Coopération avec les registres et les autorités">
        <p>
          Lorsque cela est approprié, nous coopérons avec les registres d&rsquo;abus et les
          services de signalement et pouvons partager avec eux, ou avec les exploitants des réseaux
          affectés, les logs pertinents et les informations permettant d&rsquo;identifier la
          source. Nous conservons les éléments de preuve et effectuons un signalement aux forces de
          l&rsquo;ordre lorsque la loi l&rsquo;exige ou lorsque les faits le justifient.
        </p>
        <Callout tone="critical" title="Contenus d’abus sexuels sur mineurs">
          Nous avons une tolérance zéro pour les contenus d&rsquo;abus sexuels sur mineurs (CSAM).
          Tout CSAM confirmé est signalé immédiatement au National Center for Missing &amp;
          Exploited Children (NCMEC) et aux forces de l&rsquo;ordre, le compte est résilié et les
          éléments de preuve sont conservés. Pour signaler un CSAM présumé sur notre
          infrastructure, écrivez à <Email name="abuse" /> avec
          &laquo;&nbsp;CSAM&nbsp;&raquo; en objet, ou signalez-le directement au NCMEC via sa
          CyberTipline.
        </Callout>
      </LegalSection>

      <LegalSection number="7" title="Demandes des forces de l’ordre">
        <p>
          Les forces de l&rsquo;ordre qui cherchent à obtenir des données ou leur conservation
          doivent nous contacter à{' '}
          <Email name="abuse" />{' '}
          avec &laquo;&nbsp;Law Enforcement Request&nbsp;&raquo; en objet. Nous répondons à toute
          procédure légale valable signifiée à WSLATL LLC, et nous conserverons les données
          pertinentes sur demande de conservation correctement délimitée, le temps que la procédure
          appropriée soit obtenue. Nous ne divulguons pas les données des clients sans procédure
          légale valable, sauf lorsque la loi le permet ou l&rsquo;exige, par exemple en cas
          d&rsquo;urgence impliquant un risque de décès ou de dommage corporel grave.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Signalements que nous ne pouvons pas traiter ici">
        <p>Certaines questions relèvent d&rsquo;un autre canal&nbsp;:</p>
        <ul>
          <li>
            <strong>Droit d&rsquo;auteur.</strong> Les
            notifications de retrait pour atteinte au droit d&rsquo;auteur et les
            contre-notifications passent par notre{' '}
            <Link href={siteConfig.paths.dmca}>Politique DMCA</Link>,
            et non par cette page.
          </li>
          <li>
            <strong>Contenus que nous n&rsquo;hébergeons pas.</strong> Pour
            un domaine enregistré ailleurs, un contenu sur un réseau tiers ou un compte sur une
            plateforme que nous n&rsquo;exploitons pas, nous ne sommes pas le bon destinataire et
            ne pouvons pas retirer les éléments en cause. Signalez-les à l&rsquo;exploitant de ce
            service.
          </li>
          <li>
            <strong>Questions de facturation et de compte.</strong>{' '}
            Les questions sur votre propre service ou votre facturation vont à{' '}
            <Email name="support" />, et non au canal dédié aux abus.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="9" title="Signalements de bonne foi">
        <p>
          Signalez honnêtement et de bonne foi. Les signalements d&rsquo;abus sciemment faux ou de
          mauvaise foi, les signalements déposés pour harceler un autre client et les tentatives
          d&rsquo;instrumentaliser ce canal contre un concurrent nous font perdre le temps que nous
          consacrerions autrement à de vrais préjudices. Nous pouvons refuser de donner suite aux
          signalements provenant d&rsquo;une source qui a abusé de façon répétée de cette
          procédure.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique en matière d&rsquo;abus pour refléter
          des changements dans nos pratiques, nos services ou le droit applicable. Lorsque nous
          apportons des modifications substantielles, nous mettrons à jour la date d&rsquo;effet en
          haut de cette page et publierons la politique mise à jour à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.abuse}>
            {siteConfig.siteUrl}{siteConfig.paths.abuse}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="11" title="Contact">
        <p>
          Les signalements d&rsquo;abus doivent être adressés à notre équipe chargée des abus. Les
          questions générales sur la présente politique peuvent être envoyées aux adresses
          ci-dessous.
        </p>
        <CompanyContact>
          <InfoRow label="Abus">
            <Email name="abuse" />
          </InfoRow>
          <InfoRow label="Général">
            <Email name="support" /> ou <Email name="hello" />
          </InfoRow>
        </CompanyContact>
      </LegalSection>
    </>
  )
}
