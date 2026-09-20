import { Link } from '@/components/legal/doc-link'
import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'
import { Callout, CompanyContact } from '@/components/legal/blocks'
import { Email } from '@/components/ui/email'
import { ShortLink } from '@/components/ui/short-link'

export default function AccountCreditContent() {
  return (
    <>
      <LegalSection number="1" title="Présentation et champ d’application">
        <p>
          Les présentes conditions de l&rsquo;avoir de compte régissent le solde d&rsquo;avoir de
          compte détenu dans votre compte de facturation WSLATL LLC
          (&laquo;&nbsp;WSLATL&nbsp;&raquo;, &laquo;&nbsp;nous&nbsp;&raquo;,
          &laquo;&nbsp;notre&nbsp;&raquo; ou &laquo;&nbsp;nos&nbsp;&raquo;). L&rsquo;avoir de
          compte est un solde prépayé que vous pouvez imputer sur les factures WSLATL.
        </p>
        <p>
          Les présentes conditions sont incorporées à nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>{' '}
          par référence et en font partie intégrante. Lorsqu&rsquo;un avoir de compte est émis à
          l&rsquo;issue d&rsquo;une demande de remboursement, notre{' '}
          <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>{' '}
          détermine si le remboursement est approuvé et les présentes conditions déterminent ce
          qu&rsquo;est le solde d&rsquo;avoir qui en résulte et comment il se comporte.
        </p>
        <p>L&rsquo;avoir peut arriver sur votre compte de trois façons&nbsp;:</p>
        <ul>
          <li>Vous l&rsquo;achetez directement sous forme de recharge via le portail de facturation</li>
          <li>Nous vous l&rsquo;émettons, par exemple à l&rsquo;issue d&rsquo;une demande de remboursement approuvée ou au titre d&rsquo;un avoir de service prévu par notre{' '}
            <Link href={siteConfig.paths.sla}>Accord de niveau de service</Link>
          </li>
          <li>Un autre client WSLATL vous l&rsquo;offre et vous acceptez le don (voir la section 5)</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="Ce que l’avoir de compte n’est pas">
        <p>
          L&rsquo;avoir de compte est une valeur prépayée destinée à être utilisée sur les services
          WSLATL. Il est important que vous compreniez ce qu&rsquo;il n&rsquo;est pas&nbsp;:
        </p>
        <Callout tone="caution" title="Pas un compte de dépôt">
          L&rsquo;avoir de compte n&rsquo;est pas un dépôt bancaire, n&rsquo;est pas détenu sur un
          compte de dépôt, n&rsquo;est assuré ni par la FDIC ni par aucun autre assureur, et
          n&rsquo;est pas un instrument de valeur stockée émis par une banque. WSLATL n&rsquo;est
          ni une banque ni un transmetteur de fonds, et votre solde d&rsquo;avoir n&rsquo;est pas
          protégé comme le sont les fonds détenus auprès d&rsquo;un établissement financier.
        </Callout>
        <ul>
          <li>
            <strong>Il ne produit aucun intérêt.</strong> Un
            solde d&rsquo;avoir ne génère ni intérêts, ni rendement, ni aucun autre produit, quelle
            que soit la durée pendant laquelle il est détenu.
          </li>
          <li>
            <strong>Il n&rsquo;est pas échangeable contre des espèces.</strong>{' '}
            L&rsquo;avoir ne peut pas être retiré, encaissé, versé sur un compte bancaire, ni
            reconverti vers le moyen de paiement qui l&rsquo;a financé.
          </li>
          <li>
            <strong>Il n&rsquo;est pas transférable en dehors de WSLATL.</strong>{' '}
            L&rsquo;avoir ne peut être imputé qu&rsquo;à des factures WSLATL ou offert à un autre
            compte WSLATL comme décrit à la section 5. Il ne peut pas être vendu, cédé ni transféré
            à un tiers.
          </li>
          <li>
            <strong>Ce n&rsquo;est pas une ligne de crédit.</strong> L&rsquo;avoir
            correspond à de l&rsquo;argent que vous ou quelqu&rsquo;un d&rsquo;autre avez déjà
            payé, ou que nous vous avons déjà émis. Il ne vous permet pas d&rsquo;avoir un solde
            négatif.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Acheter et utiliser de l’avoir">

        <LegalSubSection title="3.1 Recharges">
          <p>
            Vous pouvez ajouter de l&rsquo;avoir à votre compte depuis le portail de facturation
            à{' '}
            <ShortLink name="billing" />. Les recharges sont débitées sur le moyen de paiement que vous avez choisi au moment de l&rsquo;achat et
            sont ajoutées à votre solde une fois le paiement encaissé.
          </p>
          <p>
            Les montants de recharge sont actuellement limités à un minimum de{' '}
            <strong>$5.00</strong> et à un maximum de{' '}
            <strong>$1,000.00</strong> par transaction. Ces
            limites sont opérationnelles plutôt que contractuelles et peuvent être modifiées dans
            le portail à tout moment. Le portail affiche les limites en vigueur au moment où vous
            effectuez l&rsquo;achat.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 Comment l’avoir est imputé">
          <p>
            L&rsquo;avoir est imputé sur les factures WSLATL dans la devise de votre compte.
            Lorsqu&rsquo;un solde est disponible, il peut être imputé automatiquement aux factures
            à leur échéance, ou imputé par vous manuellement au moment du paiement, selon les
            réglages de votre compte. Si une facture dépasse l&rsquo;avoir dont vous disposez, le
            reste est débité sur votre moyen de paiement.
          </p>
          <p>
            L&rsquo;imputation d&rsquo;un avoir ne modifie aucune autre condition de votre service.
            Les factures réglées avec de l&rsquo;avoir sont soumises aux mêmes Conditions de
            service, Politique d&rsquo;usage acceptable et Politique de remboursement que les
            factures réglées par carte.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Registre des transactions">
          <p>
            Chaque mouvement de votre solde est consigné dans un registre des transactions visible
            dans votre portail de facturation, indiquant la date, le montant, le sens du mouvement
            et le motif. Le registre est l&rsquo;enregistrement qui fait foi pour votre solde. Si
            vous estimez qu&rsquo;une écriture est erronée, contactez-nous à{' '}
            <Email name="support" />{' '}
            et nous enquêterons.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Expiration et remboursement">
        <Callout tone="good" title="L’avoir de compte n’expire pas">
          Votre solde d&rsquo;avoir n&rsquo;a pas de date d&rsquo;expiration. Nous n&rsquo;appliquons
          ni frais de dormance, ni frais de tenue de compte, ni frais d&rsquo;inactivité, ni aucune
          autre déduction réduisant un solde inutilisé au fil du temps. L&rsquo;avoir reste
          disponible aussi longtemps que votre compte est ouvert.
        </Callout>

        <LegalSubSection title="4.1 L’avoir n’est pas remboursable">
          <p>
            L&rsquo;avoir acheté est{' '}
            <strong>non remboursable</strong>. Une fois
            qu&rsquo;une recharge a été ajoutée à votre solde, nous n&rsquo;annulons pas
            l&rsquo;achat et ne restituons pas l&rsquo;argent sur votre moyen de paiement. Comme
            l&rsquo;avoir n&rsquo;expire pas, un solde inutilisé reste le vôtre, à dépenser sur les
            services WSLATL plutôt qu&rsquo;à être perdu.
          </p>
          <p>
            L&rsquo;avoir que nous vous avons émis, par opposition à l&rsquo;avoir que vous avez
            acheté, n&rsquo;est pas davantage échangeable contre des espèces. Cela inclut
            l&rsquo;avoir émis à l&rsquo;issue d&rsquo;une demande de remboursement approuvée et
            les avoirs de service émis au titre de notre Accord de niveau de service.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Remboursements versés sous forme d’avoir">
          <p>
            Lorsque vous demandez un remboursement, l&rsquo;une des issues possibles est que nous
            l&rsquo;approuvions sous forme d&rsquo;avoir de compte plutôt que sous forme de
            restitution sur votre moyen de paiement d&rsquo;origine. Les remboursements versés sous
            forme d&rsquo;avoir sont régis par les présentes conditions une fois émis&nbsp;: ils
            sont dépensables sur les factures WSLATL, ils n&rsquo;expirent pas et ils ne sont pas
            retirables en espèces. Notre{' '}
            <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>{' '}
            précise quand chaque issue s&rsquo;applique.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Offrir de l’avoir à un autre compte">
        <p>
          Vous pouvez offrir de l&rsquo;avoir de votre solde à un autre compte WSLATL. Le don
          déplace de la valeur entre des comptes au sein de notre plateforme&nbsp;; il n&rsquo;envoie
          pas d&rsquo;argent à une personne et ce n&rsquo;est pas un service de paiement.
        </p>
        <ul>
          <li>
            <strong>Vous devez disposer du solde.</strong> Le
            montant du don est déduit de l&rsquo;avoir dont vous disposez au moment où vous
            l&rsquo;envoyez. Vous ne pouvez pas offrir plus que ce que vous détenez.
          </li>
          <li>
            <strong>Le destinataire doit l&rsquo;accepter.</strong> Un
            don est mis en attente jusqu&rsquo;à ce que le destinataire l&rsquo;accepte.
            Jusqu&rsquo;à l&rsquo;acceptation, le montant n&rsquo;est dépensable par aucune des
            deux parties. Il est réservé sur votre solde et ne fait pas encore partie du solde du
            destinataire.
          </li>
          <li>
            <strong>Les dons sont définitifs une fois acceptés.</strong>{' '}
            Une fois que le destinataire accepte un don, l&rsquo;avoir appartient à son compte.
            Nous n&rsquo;annulerons pas un don accepté sur demande, y compris si vous
            l&rsquo;avez envoyé au mauvais compte ou si vous avez changé d&rsquo;avis. Vérifiez le
            destinataire avant d&rsquo;envoyer.
          </li>
          <li>
            <strong>Le don ne crée pas de droit à remboursement.</strong>{' '}
            Un don n&rsquo;est pas un achat par le destinataire. Ni l&rsquo;expéditeur ni le
            destinataire n&rsquo;acquièrent de droit à remboursement sur le montant offert au-delà
            de ce que portait l&rsquo;achat d&rsquo;origine.
          </li>
          <li>
            <strong>Les deux comptes doivent être en règle.</strong>{' '}
            Nous pouvons refuser ou bloquer un don lorsque l&rsquo;un des comptes est suspendu,
            fait l&rsquo;objet d&rsquo;une enquête ou est associé à un litige de paiement.
          </li>
        </ul>
        <p>
          Le don existe pour que vous puissiez dépanner quelqu&rsquo;un que vous connaissez.
          L&rsquo;utiliser pour vendre de l&rsquo;avoir contre de la valeur en dehors de notre
          plateforme, pour déplacer des fonds entre des parties sans lien entre elles, ou pour
          masquer l&rsquo;origine d&rsquo;un paiement est interdit et sera traité au titre de la
          section 6.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Fraude, chargebacks et annulation">
        <p>
          Nous nous réservons le droit d&rsquo;annuler, de geler ou de supprimer un avoir de
          compte, en tout ou en partie, lorsque l&rsquo;avoir n&rsquo;a pas été obtenu
          légitimement ou lorsque le paiement sous-jacent a échoué. Cela s&rsquo;applique en
          particulier&nbsp;:
        </p>
        <ul>
          <li>
            <strong>Aux achats ayant fait l&rsquo;objet d&rsquo;un chargeback ou annulés.</strong>{' '}
            Si le paiement qui a financé une recharge fait l&rsquo;objet d&rsquo;un chargeback,
            d&rsquo;une contestation, d&rsquo;une annulation, ou échoue d&rsquo;une autre manière
            après l&rsquo;ajout de l&rsquo;avoir, nous retirerons l&rsquo;avoir correspondant du
            solde. Si l&rsquo;avoir a déjà été dépensé, le déficit qui en résulte devient une somme
            due sur votre compte.
          </li>
          <li>
            <strong>À l&rsquo;avoir obtenu frauduleusement.</strong>{' '}
            Un avoir acheté avec un moyen de paiement volé ou non autorisé, obtenu au moyen
            d&rsquo;informations fausses, ou obtenu en exploitant une faille de notre système de
            facturation peut être annulé quel que soit le temps écoulé.
          </li>
          <li>
            <strong>À l&rsquo;avoir déplacé pour échapper à une annulation.</strong>{' '}
            Lorsqu&rsquo;un avoir susceptible d&rsquo;être annulé a été offert à un autre compte,
            nous pouvons l&rsquo;annuler depuis le compte bénéficiaire. Accepter un don ne met pas
            l&rsquo;avoir à l&rsquo;abri d&rsquo;une annulation si cet avoir a été obtenu
            frauduleusement.
          </li>
          <li>
            <strong>À l&rsquo;avoir émis par erreur.</strong> Un
            avoir porté à votre compte à la suite d&rsquo;une erreur administrative ou système peut
            être corrigé. Nous vous préviendrons lorsque nous le ferons et nous vous expliquerons
            la correction.
          </li>
        </ul>
        <p>
          Lorsque nous annulons un avoir, nous consignerons l&rsquo;annulation dans votre registre
          des transactions avec le motif. Les comptes impliqués dans une fraude à l&rsquo;avoir
          peuvent également être suspendus ou résiliés au titre de la section 9.2 de nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>.
        </p>
        <p>
          Si vous estimez qu&rsquo;un débit sur votre compte est erroné, contactez-nous avant
          d&rsquo;engager un chargeback. Nous enquêterons sur une erreur de facturation au titre de
          la section 3.2 de notre{' '}
          <Link href={siteConfig.paths.refund}>Politique de remboursement</Link>{' '}
          et c&rsquo;est plus rapide qu&rsquo;un litige passant par votre émetteur de carte.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Clôture du compte">
        <p>
          L&rsquo;avoir est rattaché à votre compte WSLATL. Il reste disponible tant que votre
          compte est ouvert, y compris lorsque vous n&rsquo;avez aucun service actif.
        </p>

        {/*
          OWNER DECISION NEEDED: what happens to a remaining credit balance on account closure.

          This has to be decided before publication because the answer has real consequences and
          there is no defensible default to fall back on. The realistic options are:

            (a) Balance is forfeited on closure. Simplest operationally, but forfeiture of
                prepaid stored value is restricted or prohibited in a number of US states and is
                the option most likely to attract unclaimed-property exposure.
            (b) Balance is paid out to the client on closure. Most client-friendly, but it turns
                credit into something cash-redeemable, which conflicts with the non-redeemable
                position taken in Section 2 and changes the analysis of what the product is.
            (c) Balance is held for a defined period after closure and restored if the client
                returns, then handled under the applicable state unclaimed-property law.

          Whichever is chosen, the text must also say who initiates closure (client request
          versus termination for cause) because the answer may differ between the two. Counsel
          should confirm the Missouri unclaimed-property treatment, and the treatment for any
          state where a meaningful number of clients are located, before this is filled in.

          Do not publish a number, a holding period, or a forfeiture rule here until that
          decision is made.
        */}
        <Callout tone="caution" title="Solde à la clôture : en attente">
          Le traitement d&rsquo;un solde d&rsquo;avoir restant lors de la clôture d&rsquo;un compte
          est en cours de finalisation et n&rsquo;est pas encore indiqué dans le présent document.
          Tant qu&rsquo;il n&rsquo;est pas publié ici, si vous clôturez votre compte en détenant un
          solde, contactez-nous à <Email name="support" /> et nous le traiterons avec vous
          directement et de bonne foi.
        </Callout>

        <p>
          Rien dans la présente section ne limite notre droit d&rsquo;annuler un avoir au titre de
          la section 6, ni d&rsquo;imputer un solde d&rsquo;avoir sur les factures impayées au
          moment de la clôture. Les sommes que vous nous devez à la clôture restent dues et
          exigibles au titre de la section 9.3 de nos Conditions de service.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Taxes">
        <p>
          L&rsquo;achat d&rsquo;avoir n&rsquo;est pas en soi l&rsquo;achat d&rsquo;un service
          taxable. Les taxes applicables sont calculées sur la facture du service auquel
          l&rsquo;avoir est imputé, conformément à la section 4.6 de nos{' '}
          <Link href={siteConfig.paths.terms}>Conditions de service</Link>.
          Vous restez responsable de toute taxe applicable à votre utilisation de nos services.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Modifications des présentes conditions">
        <p>
          Nous pouvons mettre à jour les présentes conditions de l&rsquo;avoir de compte pour
          refléter des changements dans nos pratiques, dans notre système de facturation ou dans le
          droit applicable. Lorsque nous apportons des modifications substantielles, nous mettrons
          à jour la date d&rsquo;effet en haut de cette page, informerons les clients actifs par
          e-mail avec un résumé de ce qui a changé, et publierons les conditions mises à jour à
          l&rsquo;adresse{' '}
          <Link href={siteConfig.paths.accountCredit}>
            {siteConfig.siteUrl}{siteConfig.paths.accountCredit}
          </Link>.
        </p>
        <p>
          Nous n&rsquo;introduirons pas de date d&rsquo;expiration, de frais de dormance, ni aucune
          autre déduction réduisant un solde inutilisé existant. L&rsquo;avoir déjà présent sur
          votre compte au moment où une modification prend effet conserve le traitement qui était
          le sien lors de son émission si ce traitement vous était plus favorable.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contact">
        <p>
          Les questions sur votre solde d&rsquo;avoir, sur une écriture du registre ou sur un don
          doivent être adressées à&nbsp;:
        </p>
        <CompanyContact />
      </LegalSection>
    </>
  )
}
