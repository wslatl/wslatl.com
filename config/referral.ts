/**
 * The referral discount, as a whole percent.
 *
 * The billing panel is what actually gives the discount, so this number MUST
 * match the referral discount set in the billing panel under Settings,
 * Orders. When it changes there, change it here the same day: every page
 * that mentions the discount reads this one constant, so the site never
 * promises a number the panel does not give.
 *
 * What the billing panel does, and so all the partner pages may say:
 * - Its sign-up page fills in a referral code from ?ref=CODE
 *   (lib/partners.ts builds that link from config/links.json).
 * - A client who signs up with a code gets this percent off their FIRST
 *   eligible invoice only: never a renewal, a later order or an add-on
 *   after that. Exactly one paid invoice of a referred client carries it.
 *   If the invoice that was meant to carry it is voided, cancelled or never
 *   paid, the next eligible invoice may carry it instead.
 * - Eligible means hosting: the plan, add-on and setup fee charges. Never a
 *   dedicated server, a credit top-up, a late fee or another charge.
 * - It never combines with a promo code: the larger discount applies.
 * - The person who referred them gets a ONE-TIME account credit once that
 *   first invoice is paid. It is a share of what was paid for eligible
 *   products, not counting tax, fees or the referral discount itself.
 *   Nothing on renewals, and nothing for self-referrals, duplicate accounts,
 *   unpaid invoices or refunded invoices (a refund takes the credit back).
 *   The share is set per referrer in the billing panel, so the pages say "a
 *   share" and never a number.
 * - Partners are approved by our team.
 * Anything beyond these is a promise the panel does not keep. In particular
 * the pages must never promise a discount on every invoice, or for as long
 * as a partner stays in the program: tests/referral-copy.test.ts fails if
 * any language says so.
 */
export const referralDiscountPercent = 10
