---
name: Terminal Focus
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#becab9'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#889484'
  outline-variant: '#3e4a3d'
  surface-tint: '#6fdd78'
  primary: '#6fdd78'
  on-primary: '#00390e'
  primary-container: '#34a547'
  on-primary-container: '#00320b'
  inverse-primary: '#006e23'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#f9bd22'
  on-tertiary: '#402d00'
  tertiary-container: '#b88900'
  on-tertiary-container: '#372700'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#8bfb91'
  primary-fixed-dim: '#6fdd78'
  on-primary-fixed: '#002106'
  on-primary-fixed-variant: '#005319'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#ffdf9f'
  tertiary-fixed-dim: '#f9bd22'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display-code:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 48px
    letterSpacing: -0.02em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 36px
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  ui-header:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.05em
  ui-body:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  ui-label:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 32px
  xl: 64px
  container-max: 1000px
  gutter: 24px
---

## Brand & Style

This design system is built for extreme focus, drawing inspiration from high-end terminal emulators and the "Monkeytype" typing aesthetic. The brand personality is technical, precise, and utilitarian, yet refined through high-quality typography and intentional whitespace. It targets developers and power users who value speed and clarity over decorative flourishes.

The design style is a blend of **Minimalism** and **Modern Brutalism**. It strips away all non-essential chrome, relying on color-coded syntax and monospaced rhythm to convey meaning. The emotional response is one of "flow state"—calm, rhythmic, and distraction-free. Visual interest is generated not through complex imagery, but through the vibrant glow of "active" text states against a deep, void-like background.

## Colors

The palette is rooted in a deep charcoal foundation to minimize eye strain and maximize the pop of functional colors. 

- **Primary (Neon Green):** Reserved for success states, completed code blocks, and primary actions.
- **Secondary (Cyan):** Used for interactive UI elements, links, and specific code keywords.
- **Tertiary (Amber):** Dedicated to warnings, pending states, or secondary syntax highlighting.
- **Neutral/Background:** The core environment is `#0d1117`. Inactive text uses a subtle gray (`#484f58`) to push it into the background, ensuring only the current focus point is prominent.
- **Glow Effects:** Active characters or cursors should utilize a subtle 4px-8px outer glow using the primary or secondary color at 30% opacity.

## Typography

Typography is the core of this design system. We employ a dual-font strategy:
1. **JetBrains Mono** handles all "data" and "content" (code, typing areas, statistics). It is chosen for its exceptional legibility and technical feel.
2. **Geist** handles the "interface" (navigation, settings, metadata). Its clean, geometric sans-serif nature provides a sophisticated contrast to the monospaced content.

The system emphasizes hierarchy through color and opacity rather than aggressive scale changes. The `display-code` level is used for the primary interaction area, while `ui-label` provides metadata without distracting from the main task.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for the core interaction area to ensure the eye doesn't have to travel far. The content is centered horizontally with a maximum width of 1000px.

- **Rhythm:** A 4px baseline grid governs all spacing. 
- **Whitespace:** Extreme whitespace is used to isolate the "typing zone." Sidebars or secondary UI elements should be hidden or significantly faded when the user is in an active state.
- **Mobile:** On mobile devices, the grid transitions to a fluid model with 16px side margins. Code text should scale down to `code-md` to maintain line-wrap integrity.

## Elevation & Depth

Depth is conveyed through **Tonal Layers** rather than shadows. In a terminal-inspired world, shadows feel out of place.

- **Level 0 (Background):** `#0d1117` (The canvas).
- **Level 1 (Surface):** `#161b22` (Used for cards or segregated UI sections).
- **Outlines:** Instead of shadows, use low-contrast outlines (`#30363d`) to define boundaries.
- **Active State:** A "glow" effect is the only exception to the flat rule. Active characters or the caret use a soft, colored neon drop-shadow to simulate a CRT or high-end OLED display.

## Shapes

The shape language is **Soft (0.25rem)**. While a terminal aesthetic often defaults to sharp corners, a slight radius prevents the UI from feeling overly aggressive or dated. This subtle rounding applies to buttons, input fields, and containers. 

- **Buttons/Inputs:** 4px (0.25rem) radius.
- **Feature Cards:** 8px (0.5rem) radius for a slightly softer container feel.
- **Status Indicators:** Use perfect circles for "live" indicators or dots.

## Components

### Buttons
Buttons are minimalist. Primary buttons are ghost-style with a vibrant border and text color (Primary Green), filling in only on hover. Secondary buttons use muted grays and have no border until hovered.

### Input Fields
Inputs are represented by a single bottom border or a subtle ghost outline. When focused, the border color shifts to Cyan with a faint glow. There are no background fills for inputs.

### Chips & Stats
Statistics (e.g., WPM, Accuracy) use the `code-lg` type scale. They should appear in the tertiary Amber color to distinguish "results" from "active code."

### The Caret (Cursor)
The most important component. It should be a vertical block or bar that pulses slowly. It carries the primary color and a 10px blur glow.

### Progress Indicators
Linear, 2px thin bars. The background track is `#30363d` and the progress fill is a solid Primary Green. No rounded ends; keep them terminal-sharp.

### Lists
Lists of code snippets or history items use `ui-body` for labels and `code-sm` for previews. Rows are separated by a 1px line of `#21262d` (subtle border).