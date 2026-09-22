# Chime

The logo combines a coin rim with clock hands, using the app's blue accent.
The navbar and browser favicon share [one SVG asset](public/favicon.svg).
The navbar's GitHub icon links to the [source repository](https://github.com/hasnainroopawalla/chime)
in a new tab.

Income period uses a shadcn select for Yearly, Monthly, Weekly, and Daily, with Monthly
selected by default. The dropdown sits on the right of the income card header
and supports mouse and keyboard selection.
Its options are derived from the income-period enum and label map, and the
selected period is controlled by application state. The parent converts the
entered amount and selected period to income per second for both output cards.
The breakdown multiplies that rate by 1, 60, 3,600, and 86,400 for second, minute,
hour, and day. Live earnings start at zero and add a fifth of a second's income every
200ms. Each update counts smoothly to the new total over 300ms using the same
animation hook as the breakdown. This affects only presentation, not accumulation.
The header shorthand follows the animated total, not the per-second rate.
Reduced-motion preferences make the displayed total update instantly.
A green dot marks the live preview with a 1.4-second pulse, disabled when
reduced motion is requested.
A quiet elapsed-time footer shows minutes and seconds (`MM:SS`) since the live
card mounted. It updates once per second from the actual start timestamp, so
delayed browser ticks do not accumulate drift. Minutes continue beyond 59.
Reset restarts both this timer and accumulated earnings without changing the
entered income. Changing income or its period also restarts both counters;
changing currency does not.

The currency picker defaults to INR and also supports USD, EUR, and GBP.
The income input and breakdown share `react-number-format` settings:
Indian grouping for INR (`12,34,567.89`) and English-style grouping for USD, EUR,
and GBP (`1,234,567.89`).
The library handles input caret movement and filters non-numeric characters.
Extra leading zeros and incomplete values such as `-` are normalized on blur.
The total is rendered by [LiveAmount](src/components/live-amount.tsx), using
`react-number-format` to show the full number with two-to-three decimal places.
It stays on one line when possible and wraps at comma-separated groups when
needed. The currency symbol stays with the first group and the decimals with
the last. The font size stays fixed at each container breakpoint, while additional
lines grow naturally and push the content below the card down. No extra line is
reserved, and the main amount is never clipped, scrolled internally, or abbreviated.
The exact value also remains available in the accessible label and hover title.
For amounts with an absolute value of at least 1,000, plain accent-colored text
on the right of the card header, just before Reset, uses `Intl.NumberFormat`
compact notation with up to two
decimal places. Its tooltip and screen-reader text identify it as a rounded amount.
When space is tight, the shorthand and Reset wrap together onto a right-aligned
second header row to avoid crowding.
This shorthand stays in the header when the large digits wrap onto more lines.
It follows the selected currency: for example, INR 1,50,00,000 becomes
"&#8377;1.5 Cr", while USD 15,000,000 becomes "$15 M". The full number
below remains unchanged.
The input is never abbreviated. Breakdown values are rounded for display to at
most two decimal places, without padding trailing zeros. Calculations retain
their full precision. Rate values keep a fixed 18px font and prefer one line.
They show the full grouped value when it fits, switching to currency-aware
compact notation only when necessary (such as INR L/Cr or USD K/M/B/T).
Compact values use up to two decimals, reducing precision further if space
requires it. If even the shortest compact form is too wide, it wraps inside the
tile as a last resort, allowing the card to grow rather than overflowing.
Available width and font changes are observed, so the full value
returns when there is room. The unabridged two-decimal value remains available
on hover and to screen readers. Rate values use normal letter spacing, with smaller,
muted currency symbols and decimal portions to distinguish them from whole digits
and grouping commas.
Rate values count smoothly up or down to their new amounts over 300ms, without
fading or sliding. All four rates share the same animated per-second value.
New edits interrupt the transition from its current value, and initial values
appear immediately. Reduced-motion preferences make updates instant.
Changing currency updates formatting, icons, labels, and symbols, not the amount;
no exchange-rate conversion is performed.

On desktop, income controls and earning rates occupy separate cards side by
side. Above 1000px, the four compact rate tiles sit in a single row; narrower
screens use a two-column rate grid. The live earnings card spans the full width
below. On mobile, the reading and visual order is income controls, live
earnings, then rates.

Dashboard cards inherit their responsive base styles from the
[Card primitive](src/components/ui/card.tsx). The parent grid controls their layout.

## Linting

Run `npm run lint` to check the project with Oxlint. React hook rules and
exhaustive dependency checks are enabled as errors in [.oxlintrc.json](.oxlintrc.json).

## Utilities

[CurrencyUtils](src/lib/currency.ts) groups `getCurrencyNumberFormat` and
`getCompactCurrencyFormatter`. [IncomePeriodUtils](src/lib/income-period.ts)
exposes `getIncomePerSecond`. Currency/period enums and metadata maps remain
separate named exports. Period conversion uses fixed durations: 365-day years,
30-day months, 7-day weeks, and 24-hour days; currency selection is not conversion.

Run `npm run build` to type-check the app, unit tests, and tooling and build the
production bundle.

## Unit tests

Run `npm test` for a single run, or `npm run test:watch` while developing.
Vitest runs the colocated `src/lib/*.test.ts` files in Node, without a browser,
dev server, or Playwright.

The tests cover currency metadata, grouping and compact formatting, and
fixed-period income conversion, including zero, negative, fractional, and large
amounts.
