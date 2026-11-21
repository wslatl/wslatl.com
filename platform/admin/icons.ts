import {
  Activity,
  AtSign,
  Container,
  Download,
  FileText,
  Filter,
  KeyRound,
  LayoutDashboard,
  LifeBuoy,
  List,
  Mail,
  Rocket,
  ScrollText,
  Server,
  Settings,
  Shield,
  Sparkles,
  Tags,
  TriangleAlert,
  UserSearch,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { AdminIcon } from '../config.mjs'

/**
 * The icons an admin page may use in admin.nav, by their lucide names. Only
 * these are imported, so an app's build carries these and not the whole set.
 * A test holds this list to adminIcons in config.mjs, which the config check
 * reads.
 */
export const icons: Record<AdminIcon, LucideIcon> = {
  'layout-dashboard': LayoutDashboard,
  'file-text': FileText,
  sparkles: Sparkles,
  download: Download,
  rocket: Rocket,
  'life-buoy': LifeBuoy,
  activity: Activity,
  server: Server,
  'triangle-alert': TriangleAlert,
  container: Container,
  mail: Mail,
  users: Users,
  settings: Settings,
  'scroll-text': ScrollText,
  'key-round': KeyRound,
  'at-sign': AtSign,
  tags: Tags,
  filter: Filter,
  list: List,
  'user-search': UserSearch,
  shield: Shield,
}
