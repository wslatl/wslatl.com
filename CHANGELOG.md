# Changelog

## v0.2.0: Accessibility (WCAG 2.1 AA) Compliance

**Accessibility release.** Brings the marketing site up to WCAG 2.1 Level AA across landmarks, headings, keyboard support, motion preferences, and assistive-technology labelling, with no change to the visual design for sighted mouse users.

### Landmarks and Skip Navigation

Added a "Skip to main content" link as the first focusable element on every page. Restructured the home page and the legal-document layout so a single `<main id="main-content">` wraps only the page content, with `<header>` and `<footer>` as siblings rather than nested inside it. The primary, mobile, and legal navigation regions now each carry a distinct accessible name.

### Menus and Disclosure Controls

The mobile menu button now exposes `aria-expanded` and `aria-controls` with a state-aware label ("Open menu" / "Close menu"), and the desktop login menu button advertises the menu it controls. The FAQ accordion wires each toggle to its answer panel with `aria-controls` and a matching region `id` alongside the existing `aria-expanded`.

### Heading Order

Fixed a heading-level skip on the pricing page: plan groups now render as `<h2>` and plan names as `<h3>`, so the page reads `<h1>` to `<h2>` to `<h3>` with no gaps. Every page keeps exactly one `<h1>`.

### Images, Icons, and Link Text

Decorative logos and inline icons are hidden from assistive technology so they are no longer announced as unlabelled graphics, while meaningful images keep descriptive alternative text. The client logo marquee is now presented once to screen readers as a plain list instead of four repeated, unlabelled copies. Repeated calls to action ("Order Now", "Get started") gained context-specific accessible names so they are distinguishable in a links list.

### Motion Preferences

`prefers-reduced-motion` is now honoured by the logo marquee, the animated hero background wash, and the statistic count-up animations, and smooth scrolling and transitions are disabled when reduced motion is requested. Previously these ran from inline styles that the reduced-motion rules did not reach.

### Data Tables

Legal comparison tables now mark their header cells with `scope="col"` so row and column relationships are conveyed to screen-reader users.
