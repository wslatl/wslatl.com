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
 * - A client who signs up with a code gets this percent off their hosting
 *   on every invoice, except on dedicated servers, for as long as the
 *   partner who referred them stays approved. "Hosting" is the plan, add-on
 *   and setup fee charges: never a credit top-up, a late fee or another
 *   charge. Once a partner is revoked, new invoices for the people they
 *   referred no longer get it.
 * - It never combines with a promo code: the larger discount applies.
 * - Approved referrers earn a share of what the people they refer pay on
 *   their first invoice, as account credit.
 * - Partners are approved by our team.
 * Anything beyond these is a promise the panel does not keep yet.
 */
export const referralDiscountPercent = 10
