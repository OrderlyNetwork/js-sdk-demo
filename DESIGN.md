---
version: alpha
name: "Orderly SDK Demo"
description: "A dense trading product UI whose optional brand theme follows the ODS v2 purple semantic palette."
colors:
  primary: "#9C75FF"
  button-primary: "#6700CE"
  primary-contrast: "#FFFFFF"
  brand-primary-light: "#9C75FF"
  brand-soft: "#9C75FF0F"
  canvas: "#090610"
  frame: "#130E1D"
  surface: "#191624"
  control: "#1D1929"
  surface-hover: "#FFFFFF0F"
  text-primary: "#FFFFFF"
  text-secondary: "#FFFFFF80"
  text-muted: "#FFFFFF5C"
  border-strong: "#FFFFFF29"
  border-subtle: "#FFFFFF0A"
  positive: "#02B589"
  negative: "#E94D7A"
  warning: "#D9AB52"
typography:
  display:
    fontFamily: '"Atyp BL Display", "PingFang SC", "Noto Sans CJK SC", "Noto Sans", sans-serif'
    fontWeight: 600
  body:
    fontFamily: '"Atyp BL Text", "PingFang SC", "Noto Sans CJK SC", "Noto Sans", sans-serif'
    fontWeight: 500
omitted:
  - section: rounded
    reason: "Unchanged; existing Orderly UI component geometry remains canonical."
  - section: spacing
    reason: "Unchanged; existing Orderly UI layout and density remain canonical."
  - section: components
    reason: "Unchanged; shared Orderly UI components consume the existing semantic CSS-variable API."
---

# Orderly SDK Demo Design System

## Overview

### Creative North Star

The interface should feel like Orderly infrastructure in active use: dark, precise, high-density, and controlled, with purple reserved for brand actions and selection rather than decoration.

### Product context and register

- **Audience and primary job:** Traders and SDK evaluators monitoring markets and executing time-sensitive trading workflows.
- **Target market and locale:** Global product UI using the repository's existing locale system; this theme introduces no market-specific behavior.
- **Usage scene:** Desktop-first, information-dense trading with existing responsive routes retained.
- **Register:** Product UI. Familiarity, state clarity, and numeric readability lead.
- **Memorable signature:** Approved Orderly light purple appears as a solid color at primary actions, links, and selected states.
- **Restraint:** Surfaces remain neutral and semantic trading/status colors retain their established meanings.
- **Anti-references:** Decorative neon palettes, unrelated product green/blue accents, and any use of profit/loss colors outside their semantic roles.
- **Token ownership/runtime mapping:** Model B. [src/theme/customDark.ts](src/theme/customDark.ts) is the canonical runtime owner for the optional `custom-dark` theme; [src/config/themes.ts](src/config/themes.ts) registers it. This file mirrors the accepted values and intent.

## Colors

The `Orderly Purple` dark theme maps the approved brand palette through the existing `--oui-*` semantic variables:

- Brand accents remain ODS v2 `Background/bg-primary` (`#9C75FF`). Page primary buttons use the requested solid `#6700CE` version; their foreground is derived from that background by choosing whichever of black or white provides the stronger WCAG contrast. The current purple resolves to white. The existing Orderly UI button may consume either the legacy `primary-darken` slot or its `oui-gradient-brand` class, so the theme adapter maps both button paths to the same solid button token in both dark theme entries without changing component logic.
- `#090610`, `#130E1D`, `#191624`, and `#1D1929` map to the base page, primary surface, secondary surface, and secondary control hierarchy.
- Legacy Orderly UI background slots are intentionally collapsed into ODS v2 semantics: inputs, selectors, secondary and disabled buttons use `#1D1929`; neutral hover states use the white-6% composite `#2B2736`; pressed segmented controls use `#9C75FF`; inactive toggle and slider tracks use the strong-border composite `#393541`.
- Order-entry inputs and the margin/leverage selector have no resting border. Their solid control surface establishes the boundary; the maintained focus outline remains available during interaction.
- White at 98%, 50%, and 36% preserves the ODS v2 primary, secondary, and placeholder foreground hierarchy. White at 16% and 4% supplies strong and subtle borders.
- `#02B589`, `#E94D7A`, and `#D9AB52` map to existing positive/profit, negative/loss, and warning roles. Their meanings remain unchanged; only their semantic theme values are updated.
- Every gradient token pair has identical start and end values. The theme must render only solid fills, with no visible gradients.
- WOO X green and WOOFi blue are not used as generic Orderly theme colors.

## Typography

- Use Atyp BL Text Medium for all standard product copy, data, controls, and navigation.
- Use Atyp BL Display Semibold for large headings and title treatments. Retain the existing CJK fallbacks for text Atyp does not cover.
- Enable OpenType stylistic sets `ss02`, `ss03`, `ss05`, and `ss06` globally. These are verified in both loaded Atyp BL font files.

## Do's and Don'ts

- **Do:** Change theme values only through the existing `CUSTOM_DARK_THEME_CSS_VARS` owner.
- **Do:** Change `BUTTON_PRIMARY_RGB` when adapting the primary button color; its contrast token is derived automatically.
- **Do:** Keep every trading and status meaning intact when evolving brand colors.
- **Do:** Keep all gradient start/end pairs identical so every themed fill remains visually solid.
- **Don't:** add screen-local hex overrides or duplicate theme providers.
- **Don't:** use light purple as normal body text or use product-specific green/blue as generic accents.
- **Don't:** introduce blended color transitions or multi-color gradient fills into this theme.
