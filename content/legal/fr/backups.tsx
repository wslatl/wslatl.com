import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact, ScrollTable } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function BackupsContent() {
  return (
    <>
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          La présente politique de sauvegarde explique quelles sauvegardes WSLATL LLC
          (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;,
          &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;) effectue, ce que ces
          sauvegardes sont et ne sont pas, qui est responsable de vos données, et comment demander
          une restauration.
        </p>
        <p>
          Elle est incorporée par référence à nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>{' '}
          et doit être lue avec la section 2 (Description des services), la section 9.3 (Effets de
          la résiliation) et la section 11 (Limitation de responsabilité).
        </p>
        <p>
          La présente politique existe comme document distinct plutôt que comme une clause des
          Conditions pour une raison pratique&nbsp;: ce qui est inclus avec chaque offre change à
          mesure que nos offres changent, et un changement d&rsquo;offre ne devrait pas exiger une
          révision des Conditions de service ni le délai de préavis qui l&rsquo;accompagne. La
          répartition des responsabilités ci-dessous ne change pas&nbsp;; seul le détail des offres
          change.
        </p>
      </LegalSection>

      <LegalSection number="2" title="La version courte">
        <Callout tone="critical" title="Gardez vos propres sauvegardes">
          Toute sauvegarde que nous fournissons est une commodité, pas une garantie. Elle est
          assurée au mieux (best-effort) et elle ne remplace pas vos propres copies indépendantes
          de vos données. Si vos données comptent pour vous, vous devez tenir vos propres
          sauvegardes, stockées ailleurs que sur le service dont elles proviennent. Ne comptez pas
          sur nous comme unique copie.
        </Callout>
        <p>
          Nous effectuons des sauvegardes parce qu&rsquo;elles sont utiles et parce qu&rsquo;elles
          nous aident à vous aider. Nous les prenons au sérieux. Mais une sauvegarde peut échouer,
          peut être incomplète, peut être corrompue et peut être indisponible au moment où vous en
          avez le plus besoin. Tout hébergeur qui vous dit le contraire en promet trop. Le reste de
          cette page expose honnêtement ce que vous obtenez.
        </p>
      </LegalSection>

      <LegalSection number="3" title="Ce qui est inclus">
        <p>
          Ce qui est sauvegardé, la fréquence des sauvegardes et leur durée de conservation
          dépendent du service et de l&rsquo;offre. Le tableau ci-dessous résume ce qui est inclus
          par service. Les durées de conservation exactes pour votre service précis figurent dans
          votre portail de facturation, et vous pouvez toujours les confirmer auprès de notre
          équipe.
        </p>

        <ScrollTable label="Sauvegardes par service">
          <table className="legal-table">
            <thead>
              <tr>
                <th scope="col">Service</th>
                <th scope="col">Sauvegardes incluses</th>
                <th scope="col">Ce qui est capturé</th>
                <th scope="col">Fréquence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-medium text-foreground">Serveurs dédiés</td>
                <td>Non incluses (autogéré)</td>
                <td>Sans objet</td>
                <td>Sans objet</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hébergement de serveurs de jeu</td>
                <td>Incluses</td>
                <td>Conteneur complet du serveur</td>
                <td>Mensuelle</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hébergement VPS</td>
                <td>Incluses <span className="text-muted-foreground">(bientôt disponible)</span></td>
                <td>Image disque complète</td>
                <td>Mensuelle</td>
              </tr>
              <tr>
                <td className="font-medium text-foreground">Hébergement web</td>
                <td>Incluses</td>
                <td>Le site web et son état</td>
                <td>Mensuelle</td>
              </tr>
            </tbody>
          </table>
        </ScrollTable>

        <p>Quelques précisions derrière le tableau&nbsp;:</p>
        <ul>
          <li>
            <strong>Serveurs dédiés.</strong> Un serveur
            dédié est votre machine. Vous avez le contrôle complet du système d&rsquo;exploitation
            et de tout ce qu&rsquo;il contient, et nous n&rsquo;en effectuons pas de sauvegardes
            pour vous. Exécuter et stocker les sauvegardes d&rsquo;un serveur dédié relève de votre
            responsabilité. Nous sommes tout à fait disposés à discuter d&rsquo;une formule de
            sauvegarde gérée sur demande.
          </li>
          <li>
            <strong>Hébergement de serveurs de jeu.</strong> Nous
            effectuons une sauvegarde du conteneur complet du serveur de jeu selon un cycle
            mensuel.
          </li>
          <li>
            <strong>Hébergement VPS.</strong> L&rsquo;hébergement
            VPS arrive bientôt. À son lancement, nous effectuerons une sauvegarde mensuelle de
            l&rsquo;image disque complète de chaque VPS. D&rsquo;ici là, cette ligne décrit ce qui
            est prévu, et non quelque chose qui fonctionne déjà.
          </li>
          <li>
            <strong>Hébergement web.</strong> Nous effectuons
            une sauvegarde mensuelle du site web lui-même et de son état actuel (ses fichiers et
            ses données), et non de l&rsquo;ensemble du compte d&rsquo;hébergement qui
            l&rsquo;entoure.
          </li>
        </ul>
        <p>
          Lorsqu&rsquo;une sauvegarde est décrite comme mensuelle, elle est effectuée selon un
          cycle approximativement mensuel, et non à une date calendaire garantie. Comme exposé à la
          section 4, chaque sauvegarde que nous effectuons est assurée au mieux (best-effort), et
          elle ne remplace pas les copies indépendantes que vous conservez vous-même.
        </p>
      </LegalSection>

      <LegalSection number="4" title="Les sauvegardes sont assurées au mieux (best-effort)">
        <p>
          Lorsque des sauvegardes sont incluses avec votre service, nous les fournissons au mieux
          (best-effort). Nous ne garantissons pas que&nbsp;:
        </p>
        <ul>
          <li>Une sauvegarde existe pour un service donné à un instant donné</li>
          <li>Une sauvegarde effectuée est complète, non corrompue ou restaurable</li>
          <li>Une restauration réussira, ou réussira dans un délai donné</li>
          <li>Les données récupérées depuis une sauvegarde seront à jour à un moment donné</li>
          <li>Une sauvegarde survivra à la perte de l&rsquo;infrastructure sous-jacente</li>
        </ul>
        <p>
          Cela est cohérent avec les exclusions de garantie de la section 10 et la limitation de
          responsabilité de la section 11 de nos Conditions de service. Rien dans la présente
          politique ne crée une garantie que ces sections excluent.
        </p>

        <LegalSubSection title="4.1 Ce contre quoi les sauvegardes ne protègent pas">
          <p>
            Une sauvegarde est une copie de vos données prise à un instant donné. Elle ne vous
            protège pas de tout, et en particulier elle ne protège pas contre&nbsp;:
          </p>
          <ul>
            <li>
              Les dommages qui sont eux-mêmes sauvegardés, comme une base de données corrompue ou
              un mauvais déploiement capturé avant que vous ne remarquiez le problème
            </li>
            <li>
              Une suppression qui tombe entre deux sauvegardes, c&rsquo;est-à-dire tout travail
              effectué depuis la dernière sauvegarde
            </li>
            <li>
              La perte d&rsquo;un service qui a été résilié, lorsque les données ont déjà été
              supprimées au titre de la section 9.3 des Conditions de service
            </li>
          </ul>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Vos responsabilités">
        <p>
          Vous êtes responsable des données que vous stockez sur notre infrastructure. Plus
          précisément, vous acceptez ce qui suit&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Vous tenez vos propres sauvegardes.</strong>{' '}
            Vous êtes responsable de conserver des copies à jour et indépendantes de toute donnée
            que vous ne pouvez pas vous permettre de perdre, stockées en dehors du service WSLATL
            qui les a produites.
          </li>
          <li>
            <strong>Vous vérifiez que vos sauvegardes fonctionnent.</strong>{' '}
            Une sauvegarde depuis laquelle vous n&rsquo;avez jamais restauré est une hypothèse, pas
            une sauvegarde. Testez les vôtres.
          </li>
          <li>
            <strong>Vous faites une copie avant les changements risqués.</strong>{' '}
            Avant une réinstallation du système d&rsquo;exploitation, un changement d&rsquo;offre,
            une migration, une annulation ou toute autre opération susceptible de détruire des
            données, faites d&rsquo;abord votre propre copie. Nous ne serons pas en mesure
            d&rsquo;annuler une action destructrice que vous avez demandée.
          </li>
          <li>
            <strong>Vous exportez avant de partir.</strong> Si
            vous annulez un service ou le laissez expirer, exportez vos données avant que la
            résiliation ne prenne effet. La conservation après résiliation est limitée et est
            décrite à la section 9.3 des Conditions de service.
          </li>
          <li>
            <strong>Vous assurez la sécurité des données de vos propres utilisateurs.</strong>{' '}
            Si d&rsquo;autres personnes dépendent du service que vous faites tourner sur notre
            infrastructure, leurs attentes en matière de sauvegarde relèvent de votre
            responsabilité, pas de la nôtre.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="6" title="Demander une restauration">
        <p>
          Pour demander une restauration, ouvrez un ticket dans le portail de facturation à{' '}
          <ShortLink name="billing" />{' '}
          ou écrivez à{' '}
          <Email name="support" />. Indiquez-nous&nbsp;:
        </p>
        <ul>
          <li>Le service concerné par la restauration</li>
          <li>Ce qui a été perdu et, aussi précisément que possible, quand cela a été perdu</li>
          <li>Le point dans le temps auquel vous souhaitez restaurer</li>
          <li>Si vous voulez une restauration complète par-dessus le service en cours d&rsquo;exécution, ou une copie livrée à côté de celui-ci</li>
        </ul>

        <LegalSubSection title="6.1 Comment nous traitons les demandes de restauration">
          <p>
            Nous vous dirons quelles sauvegardes nous détenons réellement pour le service et ce
            qu&rsquo;une restauration à partir de celles-ci impliquerait, avant de faire quoi que
            ce soit. Lorsqu&rsquo;une sauvegarde existe et qu&rsquo;une restauration est possible,
            nous l&rsquo;effectuerons ou mettrons les données à votre disposition.
          </p>
          <p>
            Une restauration est destructrice par nature. Restaurer par-dessus un service en cours
            d&rsquo;exécution remplace son état actuel, y compris tout ce qui a été créé depuis que
            la sauvegarde a été effectuée. Nous ne commencerons pas une restauration qui écrase des
            données en production sans votre confirmation explicite du point de restauration.
          </p>
          <p>
            Nous ne nous engageons pas sur un délai de traitement pour une restauration. La durée
            d&rsquo;une restauration dépend entièrement de la taille des données, du type de
            service et de l&rsquo;endroit où la sauvegarde est conservée. Nous vous donnerons une
            estimation lorsque nous confirmerons ce qui est disponible, et nous donnons la priorité
            aux restaurations sur le travail de routine.
          </p>
        </LegalSubSection>

        <LegalSubSection title="6.2 Quand une restauration est facturable">
          <p>
            Certaines restaurations sont un service payant plutôt qu&rsquo;un service inclus. Le
            fait qu&rsquo;une restauration soit facturable, et à quel prix, dépend de votre offre
            et de la nature de la demande. Nous vous indiquerons le coût avant d&rsquo;effectuer
            tout travail facturable, et vous pouvez le refuser.
          </p>
          <p>
            Lorsqu&rsquo;une restauration a été effectuée comme option payante, il s&rsquo;agit
            d&rsquo;un service consommé et elle n&rsquo;est pas remboursable, comme exposé à la
            section 5 de notre{' '}
            <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="7" title="Sauvegardes et résiliation">
        <p>
          Les sauvegardes font partie de votre service, et ne sont pas conservées séparément de
          celui-ci. Lorsqu&rsquo;un service est résilié, ses sauvegardes sont soumises aux mêmes
          règles de conservation et de suppression que le service lui-même, décrites à la
          section 9.3 de nos Conditions de service. Une fois cette période écoulée, les données ont
          disparu et nous ne pouvons pas les récupérer pour vous, quelle que soit la raison de la
          demande.
        </p>
        <p>
          Si vous avez besoin de données d&rsquo;un service résilié, demandez-les immédiatement. Ne
          présumez pas qu&rsquo;elles seront encore là la semaine prochaine.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Sécurité des sauvegardes">
        <p>
          Les sauvegardes contiennent vos données et sont protégées par les mêmes mesures que
          celles décrites à la section 6 de notre{' '}
          <Link href={siteConfig.paths.privacy}>Politique de confidentialité</Link>,
          y compris les contrôles d&rsquo;accès qui limitent les membres de notre équipe pouvant y
          accéder. Lorsqu&rsquo;une sauvegarde est conservée sur une infrastructure exploitée par un
          partenaire, les destinataires listés sur notre page{' '}
          <Link href={siteConfig.paths.subprocessors}>Sous-traitants</Link>{' '}
          s&rsquo;appliquent également à cette copie.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Modifications de la présente politique">
        <p>
          Nous pouvons mettre à jour la présente politique de sauvegarde pour refléter des
          changements dans notre infrastructure ou dans nos offres. Lorsque nous apportons des
          modifications substantielles, nous mettrons à jour la date d&rsquo;effet en haut de cette
          page et publierons la politique mise à jour à l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.backups}>
            {siteConfig.siteUrl}{siteConfig.paths.backups}
          </Link>. Les modifications qui réduisent ce qui est inclus avec un service que vous
          détenez déjà seront notifiées par e-mail avant leur prise d&rsquo;effet.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contact">
        <p>
          Les demandes de restauration et les questions sur les sauvegardes doivent être adressées
          à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
