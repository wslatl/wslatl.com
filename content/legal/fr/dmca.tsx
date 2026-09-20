import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, InfoCard, InfoRow } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'

export default function DmcaContent() {
  return (
    <>
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          WSLATL LLC (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;, &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;)
          respecte les droits de propriété intellectuelle d&rsquo;autrui et attend de ses clients
          qu&rsquo;ils fassent de même. La présente politique DMCA explique comment signaler un
          contenu hébergé sur l&rsquo;infrastructure WSLATL dont vous estimez qu&rsquo;il porte
          atteinte à votre droit d&rsquo;auteur, comment un client peut contester un retrait, et
          comment nous traitons les clients qui contreviennent de façon répétée.
        </p>
        <p>
          La présente politique est rédigée pour s&rsquo;aligner sur le Digital Millennium
          Copyright Act, 17 U.S.C. &sect;&nbsp;512. Elle remplace et développe le résumé qui
          figurait auparavant à la section 8 de nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>,
          et elle est incorporée à ces Conditions par référence.
        </p>
        <p>
          WSLATL est un hébergeur. Dans la plupart des cas, nous ne créons, ne sélectionnons ni
          n&rsquo;examinons les contenus stockés sur notre infrastructure par les clients. Nous
          intervenons sur les plaintes pour atteinte au droit d&rsquo;auteur qui respectent les
          exigences ci-dessous.
        </p>
      </LegalSection>

      <LegalSection number="2" title="Agent désigné pour le droit d’auteur">
        <p>
          Les notifications d&rsquo;atteinte alléguée doivent être envoyées à notre agent désigné.
          Les notifications envoyées à d&rsquo;autres adresses, à des membres du personnel ou sur
          notre serveur Discord peuvent être retardées et peuvent ne pas être traitées comme une
          notification valable.
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
        <InfoCard title="Agent désigné pour le droit d’auteur">
          <InfoRow label="Agent">
            WSLATL Copyright Agent
          </InfoRow>
          <InfoRow label="Société">
            WSLATL LLC
          </InfoRow>
          <InfoRow label="Adresse postale">
            2414 County Road 1310, Moberly, MO 65270, United States
          </InfoRow>
          <InfoRow label="Téléphone">
            1-660-998-8016
          </InfoRow>
          <InfoRow label="E-mail">
            <Email name="dmca" />
          </InfoRow>
          <InfoRow label="Objet">
            DMCA Takedown Notice
          </InfoRow>
        </InfoCard>

        <Callout tone="caution" title="Statut d’enregistrement de l’agent">
          Les coordonnées ci-dessus sont le canal que nous surveillons pour les plaintes relatives
          au droit d&rsquo;auteur. Nous n&rsquo;affirmons pas sur cette page qu&rsquo;un
          enregistrement d&rsquo;agent désigné a été effectué auprès du United States Copyright
          Office. Si vous avez besoin de confirmer le statut d&rsquo;enregistrement actuel avant
          de signifier une notification, contactez-nous à <Email name="support" /> et nous vous
          le dirons.
        </Callout>
      </LegalSection>

      <LegalSection number="3" title="Déposer une notification de retrait">
        <p>
          Pour être effective au titre du 17 U.S.C. &sect;&nbsp;512(c)(3), une notification
          d&rsquo;atteinte alléguée doit être une communication écrite comprenant pour
          l&rsquo;essentiel les six éléments suivants&nbsp;:
        </p>
        <ol>
          <li>
            Une signature physique ou électronique d&rsquo;une personne autorisée à agir au nom du
            titulaire d&rsquo;un droit exclusif prétendument enfreint.
          </li>
          <li>
            L&rsquo;identification de l&rsquo;œuvre protégée par le droit d&rsquo;auteur dont il
            est allégué qu&rsquo;elle a été enfreinte. Si plusieurs œuvres présentes sur un même
            site sont couvertes par une seule notification, une liste représentative de ces œuvres
            sur ce site.
          </li>
          <li>
            L&rsquo;identification du contenu dont il est allégué qu&rsquo;il porte atteinte ou
            qu&rsquo;il fait l&rsquo;objet d&rsquo;une activité contrefaisante, ainsi que des
            informations raisonnablement suffisantes pour nous permettre de le localiser. Une URL
            directe, une adresse IP et un port, un chemin de fichier ou un identifiant de serveur
            sont la forme la plus utile.
          </li>
          <li>
            Des informations raisonnablement suffisantes pour nous permettre de vous contacter,
            dont votre nom, votre adresse, votre numéro de téléphone et, si elle est disponible,
            une adresse e-mail.
          </li>
          <li>
            Une déclaration selon laquelle vous avez la conviction de bonne foi que
            l&rsquo;utilisation du contenu de la manière dénoncée n&rsquo;est autorisée ni par le
            titulaire du droit d&rsquo;auteur, ni par son agent, ni par la loi.
          </li>
          <li>
            Une déclaration selon laquelle les informations contenues dans la notification sont
            exactes et, sous peine de parjure, que vous êtes autorisé à agir au nom du titulaire
            d&rsquo;un droit exclusif prétendument enfreint.
          </li>
        </ol>
        <p>
          Une notification qui ne respecte pas pour l&rsquo;essentiel l&rsquo;ensemble des six
          éléments peut ne pas être traitée comme une notification valable. Si votre notification
          est incomplète, nous vous dirons ce qui manque lorsque nous pouvons raisonnablement le
          faire.
        </p>

        <LegalSubSection title="3.1 Ce qui se passe ensuite">
          <p>
            À réception d&rsquo;une notification conforme, nous agirons dans les meilleurs délais
            pour retirer le contenu identifié ou en désactiver l&rsquo;accès, et nous prendrons des
            mesures raisonnables pour informer le client concerné que le contenu a été retiré ou
            désactivé. Selon le service, le retrait peut prendre la forme de la suppression
            d&rsquo;un fichier précis, de la désactivation d&rsquo;une application précise, ou de
            la suspension du service concerné lorsque le contenu ne peut pas être isolé.
          </p>
          <p>
            Nous transmettons une copie de la notification, y compris les coordonnées
            qu&rsquo;elle contient, au client concerné. N&rsquo;incluez pas dans une notification
            des informations que vous n&rsquo;êtes pas disposé à voir communiquées au client.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Fausse déclaration">
          <p>
            Au titre du 17 U.S.C. &sect;&nbsp;512(f), toute personne qui, sciemment, dénature
            matériellement le fait qu&rsquo;un contenu porte atteinte, ou qu&rsquo;un contenu a été
            retiré ou désactivé par erreur ou par identification erronée, peut être tenue
            responsable de dommages et intérêts, y compris les frais et les honoraires
            d&rsquo;avocat. Merci d&rsquo;examiner si l&rsquo;usage que vous signalez peut être
            autorisé par le titulaire du droit d&rsquo;auteur, par une licence ou par la loi avant
            de déposer.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Contre-notification">
        <p>
          Si vous êtes client de WSLATL et qu&rsquo;un contenu vous appartenant a été retiré ou
          désactivé, et que vous estimez que le retrait résulte d&rsquo;une erreur ou d&rsquo;une
          identification erronée, vous pouvez soumettre une contre-notification à notre agent
          désigné, à l&rsquo;adresse indiquée à la section 2.
        </p>
        <p>
          Pour être effective au titre du 17 U.S.C. &sect;&nbsp;512(g)(3), une contre-notification
          doit être une communication écrite comprenant pour l&rsquo;essentiel les éléments
          suivants&nbsp;:
        </p>
        <ol>
          <li>Votre signature physique ou électronique.</li>
          <li>
            L&rsquo;identification du contenu qui a été retiré ou dont l&rsquo;accès a été
            désactivé, ainsi que l&rsquo;emplacement où ce contenu apparaissait avant son retrait
            ou la désactivation de son accès.
          </li>
          <li>
            Une déclaration, sous peine de parjure, selon laquelle vous avez la conviction de bonne
            foi que le contenu a été retiré ou désactivé à la suite d&rsquo;une erreur ou
            d&rsquo;une identification erronée du contenu.
          </li>
          <li>
            Vos nom, adresse et numéro de téléphone, ainsi qu&rsquo;une déclaration selon laquelle
            vous acceptez la compétence du tribunal fédéral de district du district judiciaire dans
            lequel se trouve votre adresse ou, si votre adresse est située hors des États-Unis, de
            tout district judiciaire dans lequel WSLATL LLC peut être trouvée, et selon laquelle
            vous accepterez la signification des actes de procédure de la part de la personne ayant
            fourni la notification initiale ou d&rsquo;un agent de cette personne.
          </li>
        </ol>

        <LegalSubSection title="4.1 Délai de rétablissement">
          <p>
            À réception d&rsquo;une contre-notification conforme, nous en fournirons rapidement une
            copie à la personne qui a déposé la notification de retrait initiale et nous
            l&rsquo;informerons que nous replacerons le contenu retiré ou cesserons d&rsquo;en
            désactiver l&rsquo;accès.
          </p>
          <p>
            Au titre du 17 U.S.C. &sect;&nbsp;512(g)(2)(C), nous replacerons le contenu retiré ou
            rétablirons l&rsquo;accès{' '}
            <strong>
              dans un délai d&rsquo;au moins 10 et d&rsquo;au plus 14 jours ouvrés
            </strong>{' '}
            suivant la réception de la contre-notification, sauf si notre agent désigné reçoit
            d&rsquo;abord de la part du plaignant initial une notification l&rsquo;informant
            qu&rsquo;il a engagé une action visant à obtenir une décision de justice interdisant au
            client de se livrer à une activité contrefaisante relative au contenu présent sur notre
            infrastructure.
          </p>
          <p>
            Le rétablissement est subordonné au fait que le service soit toujours actif et en
            règle. Un contenu ne peut pas être rétabli depuis un service qui a été résilié ou dont
            les données ont déjà été supprimées au titre de nos règles de conservation, et une
            contre-notification ne suspend ni la facturation, ni la suspension pour défaut de
            paiement, ni aucune mesure distincte prise au titre de notre{' '}
            <Link href={siteConfig.paths.acceptableUse}>Politique d&rsquo;usage acceptable</Link>.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Fausse déclaration dans une contre-notification">
          <p>
            Les sanctions prévues au 17 U.S.C. &sect;&nbsp;512(f) s&rsquo;appliquent aux
            contre-notifications comme aux notifications de retrait. Déposer une
            contre-notification qui, sciemment, dénature matériellement le fait qu&rsquo;un contenu
            a été retiré par erreur ou par identification erronée peut vous exposer à une
            responsabilité pour dommages et intérêts.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Politique relative aux contrevenants récidivistes">
        <p>
          Comme l&rsquo;exige le 17 U.S.C. &sect;&nbsp;512(i), WSLATL a adopté et met en œuvre de
          façon raisonnable une politique prévoyant la résiliation, dans des circonstances
          appropriées, des comptes des clients qui sont des contrevenants récidivistes.
        </p>
        <p>Comment nous mettons en œuvre cette politique&nbsp;:</p>
        <ul>
          <li>
            <strong>Nous enregistrons chaque notification.</strong> Chaque
            notification de retrait conforme sur laquelle nous intervenons est enregistrée au
            dossier du compte client responsable du service concerné.
          </li>
          <li>
            <strong>Nous informons le client.</strong> Le
            client est informé de la plainte, de ce qui a été retiré ou désactivé, et du fait que
            la plainte a été enregistrée au dossier de son compte.
          </li>
          <li>
            <strong>Les plaintes répétées entraînent une escalade.</strong>{' '}
            De nouvelles notifications conformes visant le même compte entraînent des mesures
            graduées, pouvant comprendre un avertissement formel, la suspension du service concerné
            et la résiliation du compte.
          </li>
          <li>
            <strong>Les contre-notifications abouties ne comptent pas.</strong>{' '}
            Une plainte qui est retirée, ou qui est résolue en faveur du client par une
            contre-notification sans action en justice à la suite, n&rsquo;est pas comptabilisée à
            l&rsquo;encontre du compte.
          </li>
          <li>
            <strong>Les cas graves sont traités immédiatement.</strong>{' '}
            Lorsque l&rsquo;atteinte est flagrante, de dimension commerciale, ou accompagnée
            d&rsquo;autres violations de notre Politique d&rsquo;usage acceptable, nous pouvons
            résilier un compte sans attendre une notification supplémentaire.
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
          Une résiliation au titre de la présente section est une résiliation pour juste motif.
          Comme exposé dans notre{' '}
          <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>,
          les services résiliés pour violation de nos Conditions ou de notre Politique
          d&rsquo;usage acceptable ne sont pas éligibles à un remboursement.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Contenus que nous ne contrôlons pas">
        <p>
          WSLATL fournit de l&rsquo;infrastructure. Lorsqu&rsquo;un client exploite son propre
          service sur cette infrastructure et contrôle ce qui y est stocké, c&rsquo;est le client
          qui est responsable du contenu. Lorsque nous pouvons identifier le client, nous lui
          transmettrons votre notification et attendrons de lui qu&rsquo;il y donne suite.
        </p>
        <p>
          Pour les services que nous n&rsquo;hébergeons pas, y compris les domaines enregistrés
          ailleurs, les contenus diffusés par un réseau tiers ou les comptes sur des plateformes
          que nous n&rsquo;exploitons pas, nous ne sommes pas le bon destinataire de votre
          notification et ne pouvons pas retirer le contenu. Merci d&rsquo;adresser votre
          notification à l&rsquo;exploitant de ce service.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Marques et autres plaintes">
        <p>
          La présente politique couvre uniquement le droit d&rsquo;auteur. Les plaintes relatives à
          une atteinte à une marque, à la diffamation, à des atteintes à la vie privée ou à
          d&rsquo;autres contenus illicites doivent être envoyées à{' '}
          <Email name="support" />{' '}
          avec une description claire du contenu, de son emplacement et du fondement juridique de
          votre plainte. Ces plaintes sont traitées au titre de notre{' '}
          <Link href={siteConfig.paths.acceptableUse}>Politique d&rsquo;usage acceptable</Link>{' '}
          plutôt qu&rsquo;au titre du DMCA.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique DMCA pour refléter des changements dans
          nos pratiques ou dans le droit applicable. Lorsque nous apportons des modifications
          substantielles, nous mettrons à jour la date d&rsquo;effet en haut de cette page et
          publierons la politique mise à jour à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.dmca}>
            {siteConfig.siteUrl}{siteConfig.paths.dmca}
          </Link>.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Contact">
        <p>
          Les notifications et contre-notifications relatives au droit d&rsquo;auteur doivent être
          adressées à l&rsquo;agent désigné indiqué à la section 2. Les questions générales sur la
          présente politique peuvent être envoyées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
