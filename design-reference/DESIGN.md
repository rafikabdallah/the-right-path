---
name: At-Tariq Al-Mustaqim
colors:
  surface: '#151219'
  surface-dim: '#151219'
  surface-bright: '#3b383f'
  surface-container-lowest: '#0f0d14'
  surface-container-low: '#1d1a21'
  surface-container: '#211e25'
  surface-container-high: '#2c2930'
  surface-container-highest: '#37333b'
  on-surface: '#e7e0ea'
  on-surface-variant: '#cfc2d6'
  inverse-surface: '#e7e0ea'
  inverse-on-surface: '#322f36'
  outline: '#988d9f'
  outline-variant: '#4d4354'
  surface-tint: '#ddb7ff'
  primary: '#ddb7ff'
  on-primary: '#490080'
  primary-container: '#b76dff'
  on-primary-container: '#400071'
  inverse-primary: '#842bd2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#dbb8ff'
  on-tertiary: '#470083'
  tertiary-container: '#b36fff'
  on-tertiary-container: '#3e0073'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0051'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#efdbff'
  tertiary-fixed-dim: '#dbb8ff'
  on-tertiary-fixed: '#2b0052'
  on-tertiary-fixed-variant: '#6600b7'
  background: '#151219'
  on-background: '#e7e0ea'
  surface-variant: '#37333b'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 9px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.12em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.875rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system expresses a luxury, sanctuary-like spiritual experience that merges deep contemplative calm with hyper-refined futuristic glassmorphism. Built for the modern mindful Muslim, the aesthetic avoids dated or purely traditional tropes, instead elevating Islamic lifestyle, Qur'anic engagement, and daily devotional rhythms into an ethereal, celestial realm.

The mood evokes quiet nocturnal stillness: walking along a path illuminated by soft celestial light. Obsidian foundations ground the user in reverence and digital stillness, while translucent dark-violet glass panes provide architectural layer clarity without visual clutter. Luminous amethyst and electric violet neon pulses serve as intentional focal cues, directing focus toward sacred duties, while disciplined touches of deep emerald strictly validate completed prayers and devotional milestones.

Key aesthetic pillars:
- **Spiritual Ethereality:** Surfaces feel like carved volcanic obsidian resting beneath an amethyst night sky, veiled in soft gaussian luminescence.
- **Architectural Precision:** Razor-thin specular highlight borders (0.5px to 1px) provide structural definition without high-contrast friction.
- **Bi-Scriptural Harmony:** Latin and Arabic scripts stand in balanced equilibrium, pairing razor-sharp contemporary geometry with fluent, organic sacred calligraphy.

## Colors

The palette is tuned around optical dark-mode luminance:

- **Canvas & Abyssal Foundation (75–80%):** `#09070D` (Obsidian Base) and `#0D0B14` (Canvas Shift). Pure black `#000000` is reserved for absolute voids, while these near-black charcoal tones allow purple ambient shadows to bloom naturally.
- **Structural Glass & Panels (15–20%):** Translucent deep violet-slate (`rgba(28, 23, 42, 0.65)` to `rgba(37, 30, 56, 0.45)`), layered over backdrop filters to provide tactile separation.
- **Luminous Amethyst System (5–10%):** 
  - Primary Accent: `#A855F7` (Electric Lavender / Amethyst Core)
  - Focused Highlight: `#C084FC` (Light Violet / Edge Sheen)
  - Deep Radiance: `#7928CA` (Nocturnal Purple Glow & Gradient Stop)
- **Sacred Emerald Completion (Strictly Constrained):** `#10B981` (Vibrant Emerald) and `#059669` (Deep Emerald Shade). This color is never used for general interactive states, badges, or brand decoration; it is reserved solely for verified prayer completion (Fardh/Sunnah checks) and completed Khatmah goals.
- **Typographic System:**
  - Primary Text: `#F8F7FA` (Warm Specular White, 96% opacity)
  - Secondary Text: `#A6A0BB` (Muted Starlight Lavender, 70% opacity)
  - Tertiary / Ghost: `#68617D` (Nocturnal Slate, 45% opacity)
  - Specular Glass Hairlines: `rgba(255, 255, 255, 0.08)` to `rgba(168, 85, 247, 0.2)`

## Typography

The type system blends contemporary digital geometry with sacred typographic dignity. 

### Primary Script (Latin & Numerals)
Plus Jakarta Sans provides balanced proportions, pristine geometric terminals, and generous apertures. Titles use negative tracking for a confident, editorial presence, while labels employ wide tracking (`0.04em` to `0.12em`) in full uppercase to create refined pill badges.

### Sacred Script (Arabic & Qur'an)
When rendering Qur'anic passages, Hadith verses, or contextual Arabic calligraphy (such as 'الصراط المستقيم'), the system pairs with high-legibility Naskh (e.g. Noto Naskh Arabic / Amiri). Arabic verses should maintain a line-height multiplier of no less than `1.8x` to preserve the fluid beauty of tashkeel (diacritics) without clipping.

### Hierarchy & Breathing Room
- Headings never press against card perimeters; generous line heights and bottom padding (minimum 8px–12px) protect readability.
- Numerical displays (Qibla bearings, countdown clocks to Fajr/Maghrib) render with proportional or tabular figures in medium-to-bold weights to eliminate jitter during active countdowns.

## Layout & Spacing

This design system uses a mobile-first 4-column fluid layout with an outer canvas gutter of 20px (`1.25rem`), expanding to a 6-to-8 column layout for tablets and small landscape folds (max content container bounded at 640px to preserve intimate mobile ergonomics).

### Rhythm & Flow
- Vertical cadence follows an 8pt base grid with a 4pt sub-mesh for micro-alignments (pill toggles, badge insets, and icon-to-label gaps).
- Generous internal card padding (minimum 16px to 20px) creates an unhurried, contemplative visual tempo.
- Bottom clearance: Screens feature an extended bottom content inset of 104px to accommodate the floating 4-pill bubble dock, ensuring no interactive element is obscured.

## Elevation & Depth

Visual hierarchy does not rely on opaque grey steps. Instead, it employs stacked luminous tiers of frosted glass, directional specular lights, and soft radial atmospheric glows.

### Elevation Levels

- **Tier 0 (Abyss / Ground):** 
  Flat `#09070D` with occasional radial ambient glows (`rgba(121, 40, 202, 0.12)` blurred at 90px–140px) pinned behind major focal features (such as the active prayer hero dial).
- **Tier 1 (Surface Glass):** 
  `background: rgba(26, 21, 38, 0.55)`, `backdrop-filter: blur(24px)`, subtle inner shadow `inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)`, outer border `1px solid rgba(168, 85, 247, 0.12)`.
- **Tier 2 (Elevated Active Cards & Tiles):** 
  `background: linear-gradient(145deg, rgba(38, 29, 61, 0.7) 0%, rgba(20, 16, 31, 0.6) 100%)`, `backdrop-filter: blur(32px)`, `box-shadow: 0 12px 32px -8px rgba(0, 0, 0, 0.6), 0 0 24px -4px rgba(168, 85, 247, 0.22)`.
- **Tier 3 (Floating Docks & Sheets):** 
  `background: rgba(18, 14, 28, 0.82)`, `backdrop-filter: blur(40px) saturate(180%)`, border `1px solid rgba(255, 255, 255, 0.15)`, cast shadow `0 24px 48px -12px rgba(0, 0, 0, 0.8)`.

### Specular Edge Treatment
Every elevated component features a simulated light angle from the top-center: top edges catch a 1px soft white/amethyst highlight (`rgba(255, 255, 255, 0.18)`), feathering down into transparent side and bottom borders (`rgba(168, 85, 247, 0.05)`).

## Shapes

The design system embraces high curvature (`roundedness: 3`) to evoke gentleness, continuous flow, and modern tactile comfort. Sharp, aggressive 90-degree corners are strictly prohibited.

- **Pill Primitives:** Buttons, interactive navigation items, category filters, and status badges are rendered as full capsules (`border-radius: 9999px`).
- **Surface Cards & Sheets:** Primary and secondary card surfaces use generous curvature (`24px` to `32px` / `rounded-xl` to `rounded-2xl`).
- **Interactive Tiles:** 2-column square navigation tiles feature balanced `20px` to `24px` radii, creating a soft, cushion-like mosaic grid.

## Components

### 1. Floating 4-Pill Bubble Navigation Dock
- **Structure:** Centered floating bar elevated 24px above screen bottom, pill-contoured with a 40px backdrop-blur obsidian glass chassis (`rgba(18, 14, 28, 0.85)`).
- **Interactive State:** Contains 4 icons (e.g., Today/Prayer, Qur'an, Qibla/Duas, Journey).
- **Active Indicator:** A fluid capsule slide indicator with a luminous amethyst gradient (`#9D4EDD` to `#7928CA`) and a soft neon downlight bloom (`box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4)`). Active icon transitions to pure specular white (`#FFFFFF`); idle icons remain muted starlight (`#68617D`).

### 2. Luminous Feature Hero Cards
- **Structure:** Multi-layered banner with an asymmetric celestial gradient mesh background (`#1C142E` base blending into `#3B1466` and `#7928CA` at the top right).
- **Border:** Dual-layer border: 1px continuous specular border (`rgba(255, 255, 257, 0.12)`) paired with a micro-glow corner accent.
- **Content:** Hero display for the current/next prayer countdown (e.g., "ASR IN 42M"), live celestial azimuth/sun arc graphic, and today's highlighted Ayah with classical Naskh typography.

### 3. 2-Column Square Interactive Destination Tiles
- **Form:** Symmetrical 1:1 aspect-ratio rounded containers (`24px` radius).
- **Surface:** Obsidian violet glass with an ambient inner glow originating from the top right corner (`radial-gradient(circle at 85% 15%, rgba(168, 85, 247, 0.18), transparent 70%)`).
- **Typography & Iconography:** Minimalist iconography (24px line icons) with luminous violet fills inside frosted 40px circles; bold title at bottom-left followed by a micro-label indicator.

### 4. Horizontal Swipeable Prayer Rows
- **Idle State:** Horizontal list card with glass background, showing prayer name in dual English/Arabic, calculated prayer time in crisp tabular figures, and an ethereal circular completion ring.
- **Active / Imminent State:** Subtle pulsing amethyst hairline border with a soft breathing neon shadow.
- **Completed State:** A swift swipe or tap completes the prayer. The row shifts into a calm, satisfied state: the completion ring transitions to vibrant emerald (`#10B981`) filled with a glowing checkmark icon, and a deep emerald sheen wash (`rgba(16, 185, 129, 0.08)`) settles over the surface.

### 5. Luxury Bottom Sheets
- **Backdrop:** Smooth cinematic dimming scrim (`rgba(4, 2, 8, 0.75)`) with an integrated 12px blur.
- **Chassis:** Curved upper rim (`32px`), handle indicator as a discreet 36px wide starlight pill.
- **Controls & Toggles:** Pill toggles utilizing nested obsidian containers where active states glide beneath a pill thumb glowing in soft violet.
- **Call-to-Action:** Primary "Done" / "Confirm" button spans the bottom width as a glowing gradient pill (`#A855F7` to `#7928CA`) with white semi-bold typography, cast with an amethyst underglow (`box-shadow: 0 8px 24px rgba(168, 85, 247, 0.35)`).

### 6. Badges & Chips
- Ultra-compact pill badges (`padding: 4px 10px`) in all-caps tracking (`letter-spacing: 0.1em`). 
- Default style: Obsidian surface with `rgba(168, 85, 247, 0.2)` border and amethyst text. Special completion badges shift strictly to deep emerald glass with `#10B981` text.