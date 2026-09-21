# Orderly SDK Demo — Design Notes

The design system's source of truth lives in the SDK repository
(`orderly-web-main` / `DESIGN.md`): the approved ODS v2 dark preset
(`ODS_DARK_THEME_CSS_VARS`), the `--oui-*` token mapping, component-level
visual treatments, and the typography rules all ship inside
`@orderly.network/ui` and the feature packages. This demo consumes them and
adds no parallel design system.

This file only records the decisions that remain consumer-owned.

## Dark (Blue) preset

`src/theme/blueDarkTheme.ts` mirrors the Storybook `Dark (Blue)` consumer
preset (`BLUE_DARK_THEME_CSS_VARS`, registered as `blue-dark`): DIN2014,
blue primary (`96 140 255` / `51 95 252`), white button contrast, and the
cyan-blue brand gradient tokens. No demo-only primary text overrides.

## Leaderboard framing artwork

`src/components/leaderboardDecorations.tsx` renders the static side artwork
(`public/leaderboard/background-left.png` / `background-right.png`) for the
ODS dark theme only; Dark (Blue) keeps the SDK's original video background
via `backgroundSrc`, and Light stays quiet. The geometry is tuned to these
specific assets, so it stays consumer-side instead of entering the SDK.

## Atyp BL fonts

The SDK default dark theme uses Manrope. This demo overrides the default
`orderly` theme's `--oui-font-family` to `Atyp BL Text` in `src/config/themes.ts`,
and loads `Atyp BL Text Medium` from `public/fonts/AtypBL/` via
`src/styles/fonts.css` (SDK packages ship no font files). Weights other than
500 rely on the family's fallbacks or synthesis.
