export interface TeamMember {
  name: string
  role: string
  photo: string
  bio: string
}

/** Photos are 192px square WebP crops, shown at 64px. */
export const team: TeamMember[] = [
  {
    name: 'Liam Henry',
    role: 'Founder & CEO',
    photo: '/owners/liam-henry.webp',
    bio: 'Years in the hosting industry. Built WSLATL to give clients the direct attention they deserve.',
  },
  {
    name: 'Tyler Woollis',
    role: 'Co-Founder & Co-Owner',
    photo: '/owners/tyler-woollis.webp',
    bio: 'Keeps the infrastructure solid. If something breaks, he already knows about it.',
  },
]
