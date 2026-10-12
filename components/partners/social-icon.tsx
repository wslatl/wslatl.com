import { Globe } from 'lucide-react'
import {
  DiscordIcon,
  GitHubIcon,
  InstagramIcon,
  KickIcon,
  SteamIcon,
  TikTokIcon,
  TwitchIcon,
  XIcon,
  YouTubeIcon,
} from '@/components/brand/icons'
import type { SocialPlatform } from '@/data/partners'

function WebsiteIcon({ className }: { className?: string }) {
  return <Globe aria-hidden="true" className={className} />
}

const icons: Record<SocialPlatform, (props: { className?: string }) => React.ReactElement> = {
  discord: DiscordIcon,
  youtube: YouTubeIcon,
  tiktok: TikTokIcon,
  twitch: TwitchIcon,
  kick: KickIcon,
  x: XIcon,
  instagram: InstagramIcon,
  steam: SteamIcon,
  github: GitHubIcon,
  website: WebsiteIcon,
}

/** Each platform's own mark; a globe for a partner's website. Always decorative. */
export function SocialIcon({ platform, className }: { platform: SocialPlatform; className?: string }) {
  const Icon = icons[platform]
  return <Icon className={className} />
}
