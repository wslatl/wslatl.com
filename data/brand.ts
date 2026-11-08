import { uptimeTarget } from '@/data/sla'
import { formatPrice, startingPrice } from '@/lib/pricing'

/**
 * What the brand kit page (/brand) shows, copied from the WSLATL brand kit's
 * guide (BRAND-GUIDELINES.md): the colors, the files, the examples. The words
 * around them are in i18n/copy under `brand`. README.md says where the kit's
 * files come from and how to bring them in again when the kit changes.
 */

/**
 * The kit's folder on Google Drive: every logo and banner size, the SVG files
 * and the PDF guide. Linked from the top of the page and from its last section.
 */
export const fullKitUrl = 'https://drive.google.com/drive/folders/1kjWXhrporu6zPseW4e1Wzm0zA9C1IdB2?usp=drive_link'

/** What the full kit holds, as its own README counts it. */
export const kitContents = { bannerSizes: 14, guidePages: 19 } as const

/** The sizes the kit ships the mark in, in pixels. */
export const markSizes = [16, 32, 48, 64, 96, 128, 144, 152, 180, 192, 256, 512, 1024] as const

type Rgb = readonly [red: number, green: number, blue: number]

/** A named color. Names are the guide's own and stay English in every language: they are what the PDF and the design files call them. */
export interface Swatch {
  name: string
  hex: string
  rgb: Rgb
}

/** The only colors in the logo itself, sampled from the shipped artwork. */
export const logoColors = [
  { id: 'violet', name: 'Violet', hex: '#5000F8', rgb: [80, 0, 248] },
  { id: 'cyan', name: 'Cyan', hex: '#23C7E5', rgb: [35, 199, 229] },
  { id: 'brandCyan', name: 'Brand cyan', hex: '#00BBFC', rgb: [0, 187, 252] },
  { id: 'brandBlue', name: 'Brand blue', hex: '#0088EC', rgb: [0, 136, 236] },
] as const satisfies readonly (Swatch & { id: string })[]

/** The colors the live sites already use: wslatl.com, the knowledge base and the billing portal. */
export const interfaceColors = [
  { id: 'primary', name: 'Primary', hex: '#0079CE', rgb: [0, 121, 206] },
  { id: 'primarySite', name: 'Primary (main site)', hex: '#0073C7', rgb: [0, 115, 199] },
  { id: 'lightAccent', name: 'Light accent', hex: '#48C5FF', rgb: [72, 197, 255] },
  { id: 'paleAccent', name: 'Pale accent', hex: '#8FD0FF', rgb: [143, 208, 255] },
  { id: 'secondaryBlue', name: 'Secondary blue', hex: '#26A9F1', rgb: [38, 169, 241] },
  { id: 'ink', name: 'Ink', hex: '#0F090B', rgb: [15, 9, 11] },
  { id: 'inkAlt', name: 'Ink alt', hex: '#131319', rgb: [19, 19, 25] },
  { id: 'surface', name: 'Surface', hex: '#1A1416', rgb: [26, 20, 22] },
  { id: 'surfaceAlt', name: 'Surface alt', hex: '#262021', rgb: [38, 32, 33] },
  { id: 'paper', name: 'Paper', hex: '#F1EDEE', rgb: [241, 237, 238] },
  { id: 'muted', name: 'Muted', hex: '#9A8A8F', rgb: [154, 138, 143] },
  { id: 'success', name: 'Success', hex: '#05DF72', rgb: [5, 223, 114] },
  { id: 'successAlt', name: 'Success alt', hex: '#00D294', rgb: [0, 210, 148] },
  { id: 'warning', name: 'Warning', hex: '#FCBB00', rgb: [252, 187, 0] },
  { id: 'danger', name: 'Danger', hex: '#FB2C36', rgb: [251, 44, 54] },
  { id: 'info', name: 'Info', hex: '#4A70FF', rgb: [74, 112, 255] },
] as const satisfies readonly (Swatch & { id: string })[]

export type LogoColorId = (typeof logoColors)[number]['id']
export type InterfaceColorId = (typeof interfaceColors)[number]['id']

/** The Ink panel the logo sits on in the dark specimens, from the palette above. */
export const ink = interfaceColors.find((color) => color.id === 'ink')!

/** Two stops, drawn left to right. */
export const gradients = [
  {
    id: 'wordmark',
    name: 'Wordmark gradient',
    from: { hex: '#7879F2', rgb: [120, 121, 242] },
    to: { hex: '#23C7E5', rgb: [35, 199, 229] },
  },
  {
    id: 'subline',
    name: 'Subline gradient',
    from: { hex: '#59DAE3', rgb: [89, 218, 227] },
    to: { hex: '#024DAE', rgb: [2, 77, 174] },
  },
] as const

export type GradientId = (typeof gradients)[number]['id']

/** The CSS for a gradient: the two stops, left to right. */
export function gradientCss(gradient: (typeof gradients)[number]): string {
  return `linear-gradient(to right, ${gradient.from.hex}, ${gradient.to.hex})`
}

/**
 * The files people download, in public/brand/downloads/, copied from the kit
 * unchanged under the names it gave them (scripts/brand-kit.mjs).
 */
export interface Download {
  file: string
  width: number
  height: number
}

export const downloadsPath = '/brand/downloads'

const mark = (size: number): Download => ({ file: `wslatl-logo-${size}x${size}.png`, width: size, height: size })

export const markDownloads: readonly Download[] = [64, 128, 256, 512, 1024].map(mark)

/** The lockup in the three sizes the page offers, and what each is for. */
export const lockupDownloads = [
  { file: 'wslatl-banner-1500x500.png', width: 1500, height: 500, use: 'social' },
  { file: 'wslatl-banner-1200x630.png', width: 1200, height: 630, use: 'preview' },
  { file: 'wslatl-banner-960x540.png', width: 960, height: 540, use: 'discord' },
] as const satisfies readonly (Download & { use: string })[]

/**
 * The pictures on the page, in public/brand/. The size here is the size they
 * show at; each file is twice that, which scripts/brand-kit.mjs makes and
 * tests/brand.test.ts checks.
 */
export interface Picture {
  src: string
  width: number
  height: number
}

export const pictures = {
  mark: { src: '/brand/kit-mark.webp', width: 144, height: 144 },
  lockup: { src: '/brand/kit-lockup.webp', width: 330, height: 110 },
  clearSpaceMark: { src: '/brand/kit-clear-space-mark.webp', width: 306, height: 320 },
  clearSpaceLockup: { src: '/brand/kit-clear-space-lockup.webp', width: 618, height: 225 },
  minimumSizes: { src: '/brand/kit-minimum-sizes.webp', width: 634, height: 158 },
  doOriginal: { src: '/brand/kit-do-original.webp', width: 190, height: 190 },
  doDark: { src: '/brand/kit-do-dark.webp', width: 190, height: 190 },
  doLockup: { src: '/brand/kit-do-lockup.webp', width: 190, height: 190 },
  dontStretch: { src: '/brand/kit-dont-stretch.webp', width: 190, height: 190 },
  dontRecolor: { src: '/brand/kit-dont-recolor.webp', width: 190, height: 190 },
  dontShadow: { src: '/brand/kit-dont-shadow.webp', width: 190, height: 190 },
} as const satisfies Record<string, Picture>

export type PictureId = keyof typeof pictures

/** The guide's do-and-don't diagram, as its six pictures: three that are right, three that are not. */
export const tiles = [
  { id: 'original', verdict: 'do', picture: 'doOriginal' },
  { id: 'dark', verdict: 'do', picture: 'doDark' },
  { id: 'lockup', verdict: 'do', picture: 'doLockup' },
  { id: 'stretch', verdict: 'dont', picture: 'dontStretch' },
  { id: 'recolor', verdict: 'dont', picture: 'dontRecolor' },
  { id: 'shadow', verdict: 'dont', picture: 'dontShadow' },
] as const satisfies readonly { id: string; verdict: 'do' | 'dont'; picture: PictureId }[]

/**
 * The words in the voice section that are about English copy. Wherever the
 * page quotes one, it is English in every language and marked lang="en".
 */
export const subline = 'Private Hosting'

/** The quoted words of the rules "Be specific" and "No filler", in the order their text points at them: {0}, {1}... */
export const specificExamples = ['Under 1 hr', 'fast support', 'AMD Ryzen 9 3900X with NVMe', 'enterprise hardware'] as const
export const fillerExamples = [
  "in today's fast-paced world",
  'we are excited to announce',
  'seamlessly',
  'robust',
  'leverage',
] as const

/** The English each voice rule quotes, in the rules' order (i18n/copy: brand.voice.rules). */
export const voiceRuleExamples: readonly (readonly string[])[] = [[], specificExamples, [], fillerExamples, [], []]

export interface VoiceExample {
  insteadOf: string
  write: string
}

/**
 * The guide's "instead of / write" examples, in English. Two of them hold
 * figures, and a figure is never typed twice on this site (data/pricing.ts,
 * data/sla.ts), so those come from there. The guide's own line for new VPS
 * plans says "$5.91/mo" beside the Ryzen 9 and NVMe, but $5.91 is the
 * cheapest Budget plan, which runs on an Intel i7 with SATA SSD. The Ryzen 9
 * and NVMe plans are the Premium tier, so its starting price is used.
 */
export function voiceExamples(): VoiceExample[] {
  const vpsFrom = formatPrice(startingPrice('vps', 'premium'))
  const uptime = uptimeTarget('vps')
  return [
    {
      insteadOf: 'We are excited to announce our new VPS plans',
      write: `New VPS plans. AMD Ryzen 9 3900X, NVMe, from ${vpsFrom}/mo.`,
    },
    { insteadOf: 'Our support team provides exceptional service', write: 'You talk to a real person. Every time.' },
    { insteadOf: 'We offer a wide range of solutions', write: 'Game servers, VPS, dedicated, web hosting.' },
    { insteadOf: `${uptime} uptime SLA`, write: `${uptime} uptime target on VPS and web hosting.` },
    { insteadOf: "Please don't hesitate to contact us", write: "Discord us. We're usually quick." },
    { insteadOf: 'Setup walkthroughs and troubleshooting', write: 'What needs fixing?' },
  ]
}
