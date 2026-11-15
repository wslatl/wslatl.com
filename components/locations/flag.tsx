import { cn } from '@/lib/utils'

/**
 * A small country flag, drawn here as SVG so it looks the same on every
 * system: emoji flags show as two letters on Windows. Decorative, since the
 * country's name is always written beside it. Each is drawn on the same 3:2
 * box, simplified for the size it shows at (the stars on the US flag are
 * points). A country with no drawing here shows none:
 * tests/locations.test.ts checks every location has one.
 */
const drawings: Record<string, React.ReactNode> = {
  // 13 stripes, red first, and the blue canton over the top seven.
  US: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      {Array.from({ length: 7 }, (_stripe, i) => (
        <rect key={i} y={(i * 2 * 20) / 13} width="30" height={20 / 13} fill="#b22234" />
      ))}
      <rect width="12" height={(7 * 20) / 13} fill="#3c3b6e" />
      {Array.from({ length: 9 }, (_line, row) =>
        Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_star, col) => (
          <circle
            key={`${row}-${col}`}
            cx={1 + col * 2 + (row % 2 === 0 ? 0 : 1)}
            cy={0.75 + row * 1.15}
            r="0.35"
            fill="#ffffff"
          />
        )),
      )}
    </>
  ),
  DE: (
    <>
      <rect width="30" height="20" fill="#ffce00" />
      <rect width="30" height="13.34" fill="#dd0000" />
      <rect width="30" height="6.67" fill="#000000" />
    </>
  ),
  FR: (
    <>
      <rect width="30" height="20" fill="#ed2939" />
      <rect width="20" height="20" fill="#ffffff" />
      <rect width="10" height="20" fill="#002395" />
    </>
  ),
  NL: (
    <>
      <rect width="30" height="20" fill="#21468b" />
      <rect width="30" height="13.34" fill="#ffffff" />
      <rect width="30" height="6.67" fill="#ae1c28" />
    </>
  ),
  JP: (
    <>
      <rect width="30" height="20" fill="#ffffff" />
      <circle cx="15" cy="10" r="6" fill="#bc002d" />
    </>
  ),
}

/** The countries there is a drawing for. */
export const flagCountries: readonly string[] = Object.keys(drawings)

export function Flag({ country, className }: { country: string; className?: string }) {
  const drawing = drawings[country]
  if (!drawing) return null
  return (
    <svg
      viewBox="0 0 30 20"
      aria-hidden="true"
      focusable="false"
      data-flag={country}
      className={cn('h-3.5 w-[1.3125rem] shrink-0 outline outline-1 outline-foreground/15', className)}
    >
      {drawing}
    </svg>
  )
}
