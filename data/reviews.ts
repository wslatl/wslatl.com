export const reviewsSection = {
  eyebrow: 'Reviews',

  titleLead: 'See what our customers',
  titleAccent: 'actually',
  titleTail: ' say.',

  subtitle:
    'Every review on our public Trustpilot profile is real. We do not pay for them, we do not filter the bad ones, and we do not hide the ones that sting.',

  body:
    'If you have used us, we would love to hear what you think. Your honest review helps the next person decide whether we are the right fit.',

  cta: {
    label: 'See our reviews on Trustpilot',
  },

  ctaFootnote: 'Reviews are public and unedited.',

  learnMoreHref: 'https://corporate.trustpilot.com/trust/how-trustpilot-works',
} as const

export type ReviewsSection = typeof reviewsSection

