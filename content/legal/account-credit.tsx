import { LegalSection, LegalSubSection } from '@/components/layout/legal-layout'
import { siteConfig } from '@/config/site'

export default function AccountCreditContent() {
  return (
    <>
      <LegalSection number="1" title="Overview & Scope">
        <p>
          These Account Credit Terms govern the account credit balance held in your WSLATL LLC
          (&ldquo;WSLATL,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) billing
          account. Account credit is a prepaid balance you can apply against WSLATL invoices.
        </p>
        <p>
          These terms are incorporated into and made part of our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>{' '}
          by reference. Where account credit is issued as the outcome of a refund request, our{' '}
          <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>{' '}
          governs whether the refund is approved and these terms govern what the resulting credit
          balance is and how it behaves.
        </p>
        <p>Credit can reach your account in three ways:</p>
        <ul className="list-disc pl-5 space-y-1.5 mt-2">
          <li>You purchase it directly as a top-up through the billing portal</li>
          <li>We issue it to you, for example as the outcome of an approved refund request or a service credit under our{' '}
            <a href={siteConfig.paths.sla} className="text-primary hover:underline">Service Level Agreement</a>
          </li>
          <li>Another WSLATL client gifts it to you and you accept the gift (see Section 5)</li>
        </ul>
      </LegalSection>

      <LegalSection number="2" title="What Account Credit Is Not">
        <p>
          Account credit is stored value for use against WSLATL services. It is important that you
          understand what it is not:
        </p>
        <div className="mt-4">
          <div className="legal-callout border-yellow-500/30 text-yellow-300">
            <strong>Not a deposit account</strong>
            Account credit is not a bank deposit, is not held in a deposit account, is not insured
            by the FDIC or any other insurer, and is not a stored value instrument issued by a
            bank. WSLATL is not a bank or a money transmitter, and your credit balance is not
            protected the way funds held at a financial institution are.
          </div>
        </div>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>
            <span className="text-foreground font-medium">It earns no interest.</span> A credit
            balance does not accrue interest, yield, or any other return, however long it is held.
          </li>
          <li>
            <span className="text-foreground font-medium">It is not redeemable for cash.</span>{' '}
            Credit cannot be withdrawn, cashed out, paid to a bank account, or converted back to
            the payment method that funded it.
          </li>
          <li>
            <span className="text-foreground font-medium">It is not transferable outside WSLATL.</span>{' '}
            Credit may only be applied to WSLATL invoices or gifted to another WSLATL account as
            described in Section 5. It cannot be sold, assigned, or transferred to a third party.
          </li>
          <li>
            <span className="text-foreground font-medium">It is not a credit line.</span> Credit is
            money you or someone else has already paid, or that we have already issued to you. It
            does not let you carry a negative balance.
          </li>
        </ul>
      </LegalSection>

      <LegalSection number="3" title="Buying & Using Credit">

        <LegalSubSection title="3.1 Top-Ups">
          <p>
            You can add credit to your account from the billing portal at{' '}
            <a href={siteConfig.links.billing} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              billing.wslatl.com
            </a>. Top-ups are charged to your selected payment method at the time of purchase and
            are added to your balance once the payment clears.
          </p>
          <p>
            Top-up amounts are currently limited to a minimum of{' '}
            <span className="text-foreground font-medium">$5.00</span> and a maximum of{' '}
            <span className="text-foreground font-medium">$1,000.00</span> per transaction. These
            limits are operational rather than contractual and may be changed in the portal at any
            time. The portal shows the limits in effect when you make the purchase.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.2 How Credit Is Applied">
          <p>
            Credit is applied against WSLATL invoices in your account currency. Where a balance is
            available, it may be applied automatically to invoices as they become due, or applied
            by you manually at payment time, depending on the settings on your account. If an
            invoice exceeds your available credit, the remainder is charged to your payment method.
          </p>
          <p>
            Applying credit does not change any other term of your service. Invoices settled with
            credit are subject to the same Terms of Service, Acceptable Use Policy, and Refund
            Policy as invoices settled by card.
          </p>
        </LegalSubSection>

        <LegalSubSection title="3.3 Transaction Ledger">
          <p>
            Every change to your balance is recorded in a transaction ledger visible in your
            billing portal, showing the date, the amount, the direction of the movement, and the
            reason. The ledger is the authoritative record of your balance. If you believe an
            entry is wrong, contact us at{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">
              {siteConfig.email.support}
            </a>{' '}
            and we will investigate.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="4" title="Expiry & Refundability">
        <div className="mt-1">
          <div className="legal-callout border-green-500/30 text-green-300">
            <strong>Account credit does not expire</strong>
            Your credit balance has no expiry date. We do not apply dormancy fees, maintenance
            fees, inactivity fees, or any other deduction that reduces an unused balance over
            time. Credit remains available for as long as your account is open.
          </div>
        </div>

        <LegalSubSection title="4.1 Credit Is Non-Refundable">
          <p>
            Purchased credit is{' '}
            <span className="text-foreground font-medium">non-refundable</span>. Once a top-up has
            been added to your balance, we do not reverse the purchase or return the money to your
            payment method. Because credit does not expire, an unused balance remains yours to
            spend on WSLATL services rather than being forfeited.
          </p>
          <p>
            Credit that we issued to you, rather than credit you purchased, is likewise not
            redeemable for cash. This includes credit issued as the outcome of an approved refund
            request and service credits issued under our Service Level Agreement.
          </p>
        </LegalSubSection>

        <LegalSubSection title="4.2 Refunds Paid as Credit">
          <p>
            When you request a refund, one possible outcome is that we approve it as account
            credit rather than as a return to your original payment method. Refunds paid as credit
            are governed by these terms once issued: they are spendable on WSLATL invoices, they
            do not expire, and they are not withdrawable for cash. Our{' '}
            <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>{' '}
            sets out when each outcome applies.
          </p>
        </LegalSubSection>
      </LegalSection>

      <LegalSection number="5" title="Gifting Credit to Another Account">
        <p>
          You can gift credit from your balance to another WSLATL account. Gifting moves value
          between accounts inside our platform; it does not send money to a person and it is not a
          payment service.
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">You must have the balance.</span> The
            gift amount is deducted from your available credit at the time you send it. You cannot
            gift more than you hold.
          </li>
          <li>
            <span className="text-foreground font-medium">The recipient must accept it.</span> A
            gift is held pending until the recipient accepts it. Until acceptance, the amount is
            not spendable by either party. It is reserved against your balance and is not yet part
            of the recipient&rsquo;s balance.
          </li>
          <li>
            <span className="text-foreground font-medium">Gifts are final once accepted.</span>{' '}
            Once the recipient accepts a gift, the credit belongs to their account. We will not
            reverse an accepted gift on request, including if you sent it to the wrong account or
            changed your mind. Check the recipient before you send.
          </li>
          <li>
            <span className="text-foreground font-medium">Gifting does not create refund rights.</span>{' '}
            A gift is not a purchase by the recipient. Neither the sender nor the recipient gains
            a refund right in respect of the gifted amount beyond what the original purchase
            carried.
          </li>
          <li>
            <span className="text-foreground font-medium">Both accounts must be in good standing.</span>{' '}
            We may decline or hold a gift where either account is suspended, under investigation,
            or associated with a payment dispute.
          </li>
        </ul>
        <p className="mt-4">
          Gifting exists so you can help out someone you know. Using it to sell credit for value
          outside our platform, to move funds between unrelated parties, or to obscure the source
          of a payment is prohibited and will be treated under Section 6.
        </p>
      </LegalSection>

      <LegalSection number="6" title="Fraud, Chargebacks & Reversal">
        <p>
          We reserve the right to reverse, freeze, or void account credit, in whole or in part,
          where the credit was not legitimately obtained or where the underlying payment has
          failed. This applies in particular to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-foreground font-medium">Charged-back or reversed purchases.</span>{' '}
            If the payment that funded a top-up is charged back, disputed, reversed, or otherwise
            fails after the credit has been added, we will remove the corresponding credit from
            the balance. If the credit has already been spent, the resulting shortfall becomes an
            amount due on your account.
          </li>
          <li>
            <span className="text-foreground font-medium">Fraudulently obtained credit.</span>{' '}
            Credit purchased with a stolen or unauthorized payment method, obtained through false
            information, or obtained by exploiting a defect in our billing system may be reversed
            regardless of how much time has passed.
          </li>
          <li>
            <span className="text-foreground font-medium">Credit moved to evade reversal.</span>{' '}
            Where credit subject to reversal has been gifted onward, we may reverse it from the
            receiving account. Accepting a gift does not shield the credit from reversal if the
            credit was fraudulently obtained.
          </li>
          <li>
            <span className="text-foreground font-medium">Credit issued in error.</span> Credit
            applied to your account through an administrative or system error may be corrected. We
            will tell you when we do this and explain the correction.
          </li>
        </ul>
        <p className="mt-4">
          Where we reverse credit, we will record the reversal in your transaction ledger with the
          reason. Accounts involved in credit fraud may also be suspended or terminated under
          Section 9.2 of our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>.
        </p>
        <p className="mt-3">
          If you believe a charge on your account is wrong, contact us before filing a chargeback.
          We will investigate a billing error under Section 3.2 of our{' '}
          <a href={siteConfig.paths.refund} className="text-primary hover:underline">Refund Policy</a>{' '}
          and it is faster than a dispute through your card issuer.
        </p>
      </LegalSection>

      <LegalSection number="7" title="Account Closure">
        <p>
          Credit is tied to your WSLATL account. It remains available while your account is open,
          including when you have no active services.
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
        <div className="mt-3">
          <div className="legal-callout border-yellow-500/30 text-yellow-300">
            <strong>Balance on closure: pending</strong>
            The treatment of a remaining credit balance when an account is closed is being
            finalized and is not yet stated in this document. Until it is published here, if you
            close your account holding a balance, contact us at {siteConfig.email.support} and we
            will handle it with you directly and in good faith.
          </div>
        </div>

        <p className="mt-4">
          Nothing in this section limits our right to reverse credit under Section 6, or to apply
          a credit balance against invoices that are outstanding at the time of closure. Amounts
          you owe us at closure remain due and payable under Section 9.3 of our Terms of Service.
        </p>
      </LegalSection>

      <LegalSection number="8" title="Taxes">
        <p>
          Buying credit is not itself the purchase of a taxable service. Applicable taxes are
          assessed on the invoice for the service the credit is applied to, in line with Section
          4.6 of our{' '}
          <a href={siteConfig.paths.terms} className="text-primary hover:underline">Terms of Service</a>.
          You remain responsible for any taxes applicable to your use of our services.
        </p>
      </LegalSection>

      <LegalSection number="9" title="Changes to These Terms">
        <p>
          We may update these Account Credit Terms to reflect changes in our practices, our
          billing system, or applicable law. When we make material changes, we will update the
          effective date at the top of this page, notify active clients by email with a summary of
          what changed, and post the updated terms at{' '}
          <a href={siteConfig.paths.accountCredit} className="text-primary hover:underline">
            {siteConfig.siteUrl}{siteConfig.paths.accountCredit}
          </a>.
        </p>
        <p>
          We will not introduce an expiry date, a dormancy fee, or any other deduction that
          reduces an existing unused balance. Credit already in your account when a change takes
          effect keeps the treatment it had when it was issued if that treatment was more
          favorable to you.
        </p>
      </LegalSection>

      <LegalSection number="10" title="Contact">
        <p>
          Questions about your credit balance, a ledger entry, or a gift should be directed to:
        </p>
        <div className="mt-4 p-5 rounded-xl border border-border/70 bg-card/30 space-y-1.5 text-sm relative overflow-hidden">
          <div aria-hidden className="absolute -top-px left-0 w-1/2 h-px bg-gradient-to-r from-primary/50 to-transparent" />
          <p className="font-semibold text-foreground">WSLATL LLC</p>
          <p>Missouri, United States</p>
          <p>
            Email:{' '}
            <a href={`mailto:${siteConfig.email.support}`} className="text-primary hover:underline">{siteConfig.email.support}</a>
            {' '}or{' '}
            <a href={`mailto:${siteConfig.email.info}`} className="text-primary hover:underline">{siteConfig.email.info}</a>
          </p>
          <p>
            Discord:{' '}
            <a
              href={siteConfig.links.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {siteConfig.legal.discordVanity}
            </a>
          </p>
        </div>
      </LegalSection>
    </>
  )
}
