import { getContrastTextRgb } from "./contrast";

const BUTTON_PRIMARY_RGB = "103 0 206";
const CUSTOM_BUTTON_PRIMARY_RGB = "0 169 222";

export const DARK_THEME_CSS_VARS = {
  "--oui-font-family":
    '"Atyp BL Text", "PingFang SC", "Noto Sans CJK SC", "Noto Sans", sans-serif',

  /* Orderly brand colors */
  "--oui-color-primary": "156 117 255",
  "--oui-color-primary-light": "156 117 255",
  /* Orderly UI buttons consume the legacy `primary-darken` slot. */
  "--oui-color-primary-darken": BUTTON_PRIMARY_RGB,
  "--oui-color-primary-contrast": getContrastTextRgb(BUTTON_PRIMARY_RGB),

  "--oui-color-link": "156 117 255",
  "--oui-color-link-light": "156 117 255",

  "--oui-color-secondary": "255 255 255",
  "--oui-color-tertiary": "132 131 136",
  "--oui-color-quaternary": "98 96 102",

  /* ODS v2 status colors retain their existing product meanings. */
  "--oui-color-danger": "233 77 122",
  "--oui-color-danger-light": "233 77 122",
  "--oui-color-danger-darken": "233 77 122",
  "--oui-color-danger-contrast": "9 6 16",

  "--oui-color-success": "2 181 137",
  "--oui-color-success-light": "2 181 137",
  "--oui-color-success-darken": "2 181 137",
  "--oui-color-success-contrast": "9 6 16",

  "--oui-color-warning": "217 171 82",
  "--oui-color-warning-light": "217 171 82",
  "--oui-color-warning-darken": "217 171 82",
  "--oui-color-warning-contrast": "9 6 16",

  "--oui-color-fill": "29 25 41",
  "--oui-color-fill-active": "43 39 54",

  "--oui-color-base-1": "57 53 65",
  "--oui-color-base-2": "57 53 65",
  "--oui-color-base-3": "29 25 41",
  "--oui-color-base-4": "43 39 54",
  "--oui-color-base-5": "43 39 54",
  "--oui-color-base-6": "43 39 54",
  "--oui-color-base-7": "29 25 41",
  "--oui-color-base-8": "25 22 36",
  "--oui-color-base-9": "19 14 29",
  "--oui-color-base-10": "9 6 16",

  "--oui-color-base-foreground": "255 255 255",
  "--oui-color-line": "255 255 255",

  "--oui-color-trading-loss": "233 77 122",
  "--oui-color-trading-loss-contrast": "9 6 16",
  "--oui-color-trading-profit": "2 181 137",
  "--oui-color-trading-profit-contrast": "9 6 16",

  /* Gradient slots intentionally resolve to flat semantic colors. */
  "--oui-gradient-primary-start": "156 117 255",
  "--oui-gradient-primary-end": "156 117 255",

  "--oui-gradient-secondary-start": "156 117 255",
  "--oui-gradient-secondary-end": "156 117 255",

  "--oui-gradient-success-start": "2 181 137",
  "--oui-gradient-success-end": "2 181 137",

  "--oui-gradient-danger-start": "233 77 122",
  "--oui-gradient-danger-end": "233 77 122",

  "--oui-gradient-warning-start": "217 171 82",
  "--oui-gradient-warning-end": "217 171 82",

  "--oui-gradient-neutral-start": "29 25 41",
  "--oui-gradient-neutral-end": "29 25 41",

  "--oui-gradient-brand-start": "156 117 255",
  "--oui-gradient-brand-end": "156 117 255",

  /* rounded */
  "--oui-rounded-sm": "2px",
  "--oui-rounded": "4px",
  "--oui-rounded-md": "6px",
  "--oui-rounded-lg": "8px",
  "--oui-rounded-xl": "12px",
  "--oui-rounded-2xl": "16px",
  "--oui-rounded-full": "9999px",

  /* spacing */
  "--oui-spacing-xs": "20rem",
  "--oui-spacing-sm": "22.5rem",
  "--oui-spacing-md": "26.25rem",
  "--oui-spacing-lg": "30rem",
  "--oui-spacing-xl": "33.75rem",
};

/* Original demo preset restored from the repository's Dark (Custom) theme. */
export const CUSTOM_DARK_THEME_CSS_VARS = {
  "--oui-font-family":
    '"DIN2014", "PingFang SC", "Noto Sans CJK SC", "Noto Sans", sans-serif',

  /* colors */
  "--oui-color-primary": "96 140 255",
  "--oui-color-primary-light": "119 157 255",
  "--oui-color-primary-darken": CUSTOM_BUTTON_PRIMARY_RGB,
  "--oui-color-primary-contrast": getContrastTextRgb(CUSTOM_BUTTON_PRIMARY_RGB),

  "--oui-color-link": "182 79 255",
  "--oui-color-link-light": "208 140 255",

  "--oui-color-secondary": "255 255 255",
  "--oui-color-tertiary": "218 218 218",
  "--oui-color-quaternary": "218 218 218",

  "--oui-color-danger": "255 68 124",
  "--oui-color-danger-light": "255 68 124",
  "--oui-color-danger-darken": "217 45 107",
  "--oui-color-danger-contrast": "255 255 255",

  "--oui-color-success": "0 180 158",
  "--oui-color-success-light": "15 203 180",
  "--oui-color-success-darken": "0 134 118",
  "--oui-color-success-contrast": "255 255 255",

  "--oui-color-warning": "255 182 93",
  "--oui-color-warning-light": "255 207 139",
  "--oui-color-warning-darken": "255 125 0",
  "--oui-color-warning-contrast": "255 255 255",

  "--oui-color-fill": "36 32 47",
  "--oui-color-fill-active": "40 46 58",

  "--oui-color-base-1": "83 94 123",
  "--oui-color-base-2": "74 83 105",
  "--oui-color-base-3": "57 65 85",
  "--oui-color-base-4": "51 57 72",
  "--oui-color-base-5": "40 46 58",
  "--oui-color-base-6": "32 37 47",
  "--oui-color-base-7": "27 32 40",
  "--oui-color-base-8": "24 28 35",
  "--oui-color-base-9": "19 21 25",
  "--oui-color-base-10": "7 8 10",

  "--oui-color-base-foreground": "255 255 255",
  "--oui-color-line": "255 255 255",

  "--oui-color-trading-loss": "255 68 124",
  "--oui-color-trading-loss-contrast": "255 255 255",
  "--oui-color-trading-profit": "0 180 158",
  "--oui-color-trading-profit-contrast": "255 255 255",

  /* gradients */
  "--oui-gradient-primary-start": "96 140 255",
  "--oui-gradient-primary-end": "24 40 195",

  "--oui-gradient-secondary-start": "189 107 237",
  "--oui-gradient-secondary-end": "85 13 169",

  "--oui-gradient-success-start": "0 180 158",
  "--oui-gradient-success-end": "0 90 79",

  "--oui-gradient-danger-start": "255 68 124",
  "--oui-gradient-danger-end": "121 20 56",

  "--oui-gradient-warning-start": "255 182 93",
  "--oui-gradient-warning-end": "121 46 0",

  "--oui-gradient-neutral-start": "38 41 46",
  "--oui-gradient-neutral-end": "27 29 34",

  "--oui-gradient-brand-start": "38 254 255",
  "--oui-gradient-brand-end": "89 176 254",

  /* rounded */
  "--oui-rounded-sm": "2px",
  "--oui-rounded": "4px",
  "--oui-rounded-md": "6px",
  "--oui-rounded-lg": "8px",
  "--oui-rounded-xl": "12px",
  "--oui-rounded-2xl": "16px",
  "--oui-rounded-full": "9999px",

  /* spacing */
  "--oui-spacing-xs": "20rem",
  "--oui-spacing-sm": "22.5rem",
  "--oui-spacing-md": "26.25rem",
  "--oui-spacing-lg": "30rem",
  "--oui-spacing-xl": "33.75rem",
};
