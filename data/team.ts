export interface TeamMember {
  name: string
  role: string
  photo: string
  bio: string
}

export const team: TeamMember[] = [
  {
    name: 'Liam Henry',
    role: 'Founder & CEO',
    photo: '/owners/rejectmodders.jpg',
    bio: 'Years in the hosting industry. Built WSLATL to give clients the direct attention they deserve.',
  },
  {
    name: 'Tyler Woollis',
    role: 'Co-Founder & Co-Owner',
    photo: '/owners/tyler.png',
    bio: 'Keeps the infrastructure solid. If something breaks, he already knows about it.',
  },
]
