
## Git Rules — IMPORTANT
- NEVER run `git commit`, `git push`, `git add`, `git reset`, `git rebase`, 
  or any git command that changes repo state or history.
- `git status` and `git diff` are fine for checking things.
- The developer (me) handles all staging, committing, and pushing manually.
- If changes are ready, just tell me what changed and that it's ready — 
  do not commit or push it yourself.

# The Right Path (الطريق المستقيم)

A Muslim life-management mobile app built around four pillars: **Spiritual 🕌, Mind 🧠, Body 💪, Character ❤️**.

This file records long-term conventions for working on this codebase. Keep it accurate as the project evolves — update it in the same change that changes a convention it documents.

## Stack

- **Expo SDK 57** (React Native 0.86, React 19) — New Architecture only (there is no old-architecture toggle in this SDK).
- **TypeScript**, strict mode.
- **Expo Router** (file-based routing, `app/` directory). `main` is `expo-router/entry`; there is no `App.tsx` or `index.ts` entry file — don't recreate them.
- **React Native Reanimated 4** (built on `react-native-worklets`). The Babel plugin is `react-native-reanimated/plugin`, configured in `babel.config.js`, and **must remain the last plugin** in the plugins array.
- **lucide-react-native** for icons (depends on `react-native-svg`, already installed).
- **StyleSheet** (`react-native`'s `StyleSheet.create`) for all styling — no styled-components, no NativeWind, no inline style objects for anything beyond one-off dynamic values.
- **Centralized design tokens** under `constants/theme/` — see below.
- **expo-sqlite** for local history, **expo-location** (foreground only) and **adhan** for prayer times.

## Design tokens

All colors, spacing, radii, and typography live in `constants/theme/` and are imported from the single entry point:

```ts
import { colors, spacing, radii, textStyles } from '@/constants/theme';
```

- `colors.ts` — semantic color roles (`colors.background`, `colors.textPrimary`, `colors.primary`, ...) plus four pillar accent tokens (`pillarSpiritual`, `pillarMind`, `pillarBody`, `pillarCharacter`). Single dark theme by design — no light-mode variant. Components must reference semantic roles, never raw hex values or the internal `palette`.
- `spacing.ts` — spacing scale (`spacing.sm`, `spacing.lg`, ...).
- `radii.ts` — border-radius scale.
- `typography.ts` — font sizes/weights/line-heights plus semantic `textStyles` (`textStyles.heading`, `textStyles.body`, ...).
- `shadows.ts` — elevation/glow presets (`shadows.card`, `shadows.glowPurple`, ...) — spread into a StyleSheet entry.
- `animation.ts` — shared durations/scale for Reanimated animations (`animation.durationBase`, `animation.pressScale`, ...).

**Rule:** never hardcode a color, spacing number, radius, or font size directly in a component's `StyleSheet.create`. Add or extend a token instead. This is what keeps theming (including dark mode, once implemented) a one-file change.

## Pillar subsections

The permanent structure of the four pillars. Do not invent, rename, reorder, or add/remove subsections without an explicit product decision — treat this list as the spec.

**Spiritual 🕌** (default/opening tab):
Salah, Adhkar & Du'a, Quran, Islamic Knowledge, Fasting, Sadaqah & Charity, Character & Sins, Family & People, Mosque & Community, Tawbah & Self-Reflection

**Mind 🧠:**
Study, Reading, Learning, Critical Thinking, Skills, Reflection

**Body 💪:**
Exercise, Sleep, Nutrition, Fitness, Recovery

**Character ❤️:**
Discipline, Patience, Emotions, Family, Relationships, Responsibility, Self-control, Good manners

Spiritual is the highest-priority pillar and is the only one being designed right now. Mind, Body and Character are **navigation destinations only** — minimal "Coming soon" placeholder screens. Do not build their pages, dashboards, features, subsections, or content until explicitly asked.

**UI V1 shows only the first six Spiritual sections** — Salah, Adhkar & Du'a, Quran, Islamic Knowledge, Fasting, Sadaqah & Charity. Character & Sins, Family & People, Mosque & Community and Tawbah & Self-Reflection are deliberately postponed so the first screen stays clean; how they get integrated is a later product decision.

## Navigation & transition

Navigation is **four floating bubbles**, not a bottom tab bar. This is a hard requirement: no rectangular bar, no container, no background strip. Four circular pillar nodes float near the bottom of the screen — Spiritual, Mind, Body, Character, each a Lucide icon, Spiritual always the default/opening tab. Screen content scrolls underneath them (screens reserve room via `usePillarNavClearance()`).

The active bubble is obvious: larger, purple-tinted fill, purple border, purple icon, soft halo. Inactive bubbles stay visible but understated — smaller, dark surface, muted icon. The halo is drawn as translucent discs, not a `shadowColor` glow, because Android renders elevation shadows black.

Tapping another pillar plays the **pillar-switch transition**: the purple accent expands out of the pressed bubble as a circle until it covers the screen, the route swaps underneath while hidden, then the color fades to reveal the new pillar — as if the selected pillar became the environment. ~420ms, one easing curve (`Easing.out(Easing.cubic)`) — smooth and restrained, never explosive or game-like. Tapping a Spiritual tile pushes a lightweight in-stack placeholder screen instead (no full-screen sweep); tiles get only a subtle press/scale response.

## Design reference

`design-reference/` holds the earlier Google Stitch exploration (`spiritual-home.png`, `DESIGN.md`, `stitch-spiritual.html`). It is **superseded** by the final reference image the developer supplied in chat — the cinematic night version with the mosque silhouette, crescent, and bright violet cards. Keep the Stitch files for structural reference (layout, hierarchy, typography scale) but take color and atmosphere from the current tokens and the night artwork.

Two things to remember about the generated Stitch artifacts: their palette reads muddy on device (superseded by the brand violet in `constants/theme/colors.ts`), and they contain real bugs — an icon that failed to load, and a progress ring whose `<circle>` has no `r` attribute so it never draws. Fix such things rather than reproducing them.

The reference is inspiration, not permission to change product architecture: the four pillars, the navigation behavior, and existing routes stay as they are, and nothing new gets introduced just because it appears in generated code.

## Background artwork

`assets/backgrounds/spiritual-night.png` is the app's visual identity and is rendered by `components/ui/ScreenBackground.tsx` behind the Spiritual home, Salah, and Prayer Review screens.

- Pinned and `cover` — never stretched, never blurred, and it does not scroll with content.
- The scrim over it is a **gradient**, not a flat wash: nearly clear at the top so the crescent and domes stay visible, deepening toward the bottom where cards and the nav need contrast. Don't raise the bottom stop to opaque — the artwork disappearing is the failure mode.
- Panels over it are translucent glass (`colors.glass`), never opaque. The mosque should read through the layout.
- Mind/Body/Character keep the animated `AmbientBackdrop` instead: the mosque artwork belongs to Spiritual.

## Visual identity — LOCKED

**The current design direction is approved and locked.** Do not redesign it. Every screen and every future pillar shares one template:

- the same global header structure
- the same night background treatment
- the same translucent glass card language
- the same typography and spacing scales
- the same floating four-bubble navigation and its isolation zone
- the same motion language

Mind, Body and Character may eventually take **different accent colors**, but nothing else changes. They are not separate apps and must not be designed as such — same header, same background philosophy, same glass surfaces, same card shapes, same spacing, same type hierarchy, same quality bar.

Goal: **premium + calm + modern + slightly futuristic.**

- Near-black background (`#0F0D14`), white primary text.
- **Color carries meaning. The roles are fixed:**

  | Role | Meaning |
  |---|---|
  | dark / black | background, inactive, waiting |
  | purple | brand, current, selected, navigation, destination |
  | green (`#10B981`) | completed — and nothing else, ever |
  | white | primary text |
  | light purple / slate | secondary information |

  Don't mix these. Green spent on decoration destroys the one thing it says.
- **Layout is compact.** Destination tiles are a dense 3-up grid on the Spiritual home (2-up below 340dp), prayer rows are ~64pt, and the Quick Review / ayah / Prayer Review cards stay small. Oversized cards were a recurring regression — when in doubt, tighten.
- **Purple surfaces are actually purple.** A destination card is a solid `primaryStrong` (`#7C3AED`) or a `#7C3AED → #A855F7` gradient with white content and a thin light-purple border — never a near-black card with a faint violet tint. Depth comes from glow and border, not from mixing the accent down into the background. `surfaceVioletMuted` exists for text-led cards (the ayah) that should read violet without becoming a destination.
- Each pillar also has a quiet identity tint (`colors.pillarSpiritual` etc.), used only on its own placeholder header. Nav and transitions stay purple.
- Dark surfaces for elevated cards, subtle low-contrast borders, generously rounded corners, restrained depth.
- **The dock is visually isolated from the page.** `NavBackdrop` draws a transparent-to-scrim gradient above the floating bubbles, and the dock row itself sits on a near-opaque fill. Scrolling content fades out completely before it reaches the navigation — body text must never be readable under the labels. `usePillarNavClearance()` already includes the fade height, so content still scrolls fully clear of the zone; keep using it for every screen's `paddingBottom`.
- **Centred is the default** for card content: the opening verse, Quick Review, Reminder of the Day, the Salah ayah and the Prayer Review card are all symmetrical. Quick Review states its figure in words — no dial, no chart.
- **The background is alive but still.** `AmbientBackdrop` drifts three large violet lights behind the content on 14–21s cycles. Only that layer moves — content never does, and the motion is slower than the eye tracks. Don't speed it up, add particles, or let it reach the foreground.
- **Every main screen uses `AppHeader`**: hamburger (top-level) or back (detail) on the left, centered title, profile icon on the right. Both the menu and profile controls are placeholders that open a "coming soon" sheet — there is no drawer and no account system yet. There is no floating settings button anywhere.
- **Glow is drawn, never shadowed.** Android renders elevation shadows black, so a `shadowColor` glow only appears on iOS. Use `RadialGlow` / `LinearGlow` (SVG gradients, via the already-installed `react-native-svg`) behind a surface instead — identical on both platforms, and no need for `expo-linear-gradient`.
- **Typography follows DESIGN.md's scale but not its font.** Plus Jakarta Sans is not installed; sizes, weights, line heights and tracking are applied, so adding the family later is one `fontFamily` line per style.
- Featured surfaces (section tiles, the Salah ayah, prayer rows) use the purple surface + `borderPurple` edge + an inner `RadialGlow`. Keep intensity low: this should read as light in the dark, never as a purple panel.
- Animation communicates interaction, not decoration: bubble selection, pillar transition, press feedback, and one subtle staggered card entrance. Don't animate everything.
- No heavy Islamic decoration or emoji inside the UI itself — pillar emoji (🕌🧠💪❤️) are for docs/specs like this file, not for rendering in-app.

## Salah section

The first Spiritual section with real UI. Hierarchy, in order: title + ayah, compact weekly overview, **DAILY PRAYERS** (the five obligatory prayers — the screen's clear focus), then Sunnah, Nawafil and Night Prayer as visibly lighter supporting sections.

Order on screen: header, ayah card, **the five daily prayers immediately beneath it**, divider, the Sunnah and Night Prayer tiles, divider, the Prayer Review card. Nothing goes between the ayah and the prayers. The five daily prayers stay the clear focus.

The Prayer Review card previews three figures and opens the full review (~9 metrics). The review is about growth, not grading: no scores, no streaks, no ranking, no comparison against other people. Bars appear only where a ratio is meaningful.

- **Swipe = quick action, tap = detail.** A daily prayer row is swiped right to mark prayed (left to undo) and tapped to open the detail sheet (Status / Timing / Place / Congregation). Reuse this pattern for other sections rather than inventing a new one. The pan gesture uses `activeOffsetX` + `failOffsetY` so it never steals the page scroll.
- **State is carried by color, not a checkbox.** A daily prayer row has exactly three states, and there is no circle indicator:

  | State | Surface |
  |---|---|
  | pending | dark card, no purple fill |
  | current | strong purple, plus a slow breathing glow |
  | complete | green |

  Only ever one row is current — it comes from `currentPrayerId` in `data/salah.ts`, a static mock, since there is no prayer-time engine. The breathing glow is deliberately shallow and slow (~2.8s, opacity only); it says "this is now", it never pulses or flashes.
- **Framing is growth, never judgement**: "Biggest improvement", never "most missed". With real data, a metric lacking history should say "Not enough data yet" rather than invent a number.
- Sunnah and Night Prayer are `SectionTile` blocks that open their own routes (`/spiritual/salah/<block>`), currently placeholders. They use the same tile language as the Spiritual home sections, so both read as the same kind of destination.
- The ayah sits on a featured purple surface with the same visual weight as the Quick Review card — it's the screen's opening statement, not loose text.
- Prayer times shown on the rows are **static placeholders**, not calculated. There is no prayer-time engine or location in this app.

## Voluntary prayer screens

Sunnah & Nafl and Night Prayer are subsections of Salah and share its language exactly.

- **One completion interaction, one component.** `SwipeCompleteRow` owns the swipe-to-complete behaviour and the three state colors; `PrayerRow` and the Sunnah/Witr rows are thin adapters over it. Don't fork it.
- **Qiyam and Tahajjud are one record, not two.** The recording sheet asks "after sleeping?" and that answer names it Tahajjud. Tracking them separately would double-count the same prayer. Witr likewise appears once.
- **Charts are line charts, never bars**, built on `react-native-svg` (`components/ui/LineChart.tsx`) rather than a charting dependency. One point per day, Monday–Sunday, joined by a smooth luminous line; no axes, no printed scale, numbers only in the tap tooltip. A day with nothing recorded is a zero point, never an omitted day.
- **The charts show objective activity only** — rak'ahs and counts. No score, no XP, no streak pressure, no spiritual-value rating, and never a second chart where a small status dot will do.
- Keep these screens shallow: hero → today's rows → one counter → one chart. Resist adding Nafl categories.

## Data architecture

The Salat section is data-driven. Nothing about prayer times or history is hard-coded, and component state is never the source of truth.

```
services/prayerTimes.ts      Pure calculation. Takes lat/lng, date, timezone, method,
                              madhhab and adjustments; returns normalized times plus
                              the night boundaries. Knows nothing about React.
services/prayerAnalytics.ts  Derived stats: completion, on-time, streaks, consistency,
                              weekly series, the Prayer Review.
services/dates.ts            Timezone-aware date keys, formatting, day arithmetic.
database/database.ts         One migrated SQLite handle, opened lazily.
database/migrations.ts       Ordered migrations tracked by PRAGMA user_version.
database/changes.ts          Write notifications, so views refresh themselves.
repositories/*.ts            All SQL. Nothing else writes to the database.
hooks/*.ts                   Thin React bindings over the repositories.
```

Rules that matter:

- **A day is a `YYYY-MM-DD` key in the user's timezone**, never a UTC instant. A prayer logged at 23:30 belongs to that evening.
- **Rows record actions, not percentages.** `prayer_logs` keeps the scheduled time, the actual `completed_at`, and everything the detail sheet asked: `status`, `timing`, `place`, `congregation`. Analytics are derived from those rows, never stored.
- **Uniqueness prevents duplicates**: `(local_date, prayer_name)`, `(local_date, slot)` for night prayers, and a partial unique index for Rawatib. General Nafl deliberately has none — several entries a day is normal. Un-completing updates the row rather than deleting it.
- **No judgement is made yet.** "Late" is stored because the user said so; the app does not infer it by comparing clocks. When completion/on-time/missed get formal definitions, they go in `prayerAnalytics.ts`.
- **Never fake a chart.** If nothing is recorded, `hasData` is false and the UI shows `ChartEmptyState`. A flat zero-line reads as failure rather than absence.
- **Location is read, never watched.** Foreground permission only, last-known first for a fast start, one refresh after, and coordinates are only rewritten when they move ~1km. Coordinates never leave the device and are never shown to the user — only a city name.
- Recalculate times when the date, stored location, timezone, or calculation settings change, and at no other time.

## Path aliases

`@/*` maps to the project root (configured in both `tsconfig.json` `paths` and picked up automatically by Metro via `expo/metro-config`). Prefer `@/constants/theme`, `@/app/...` etc. over long relative `../../..` chains.

## Project structure

```
app/
  _layout.tsx              Root layout: GestureHandlerRootView + SafeAreaProvider + Stack.
  (tabs)/
    _layout.tsx             Tabs navigator with the floating bubble nav as its custom
                             tabBar; owns the pillar-switch transition shared values.
    spiritual/
      _layout.tsx            Re-exports components/navigation/PillarStackLayout.
      index.tsx               Renders <SpiritualScreen />.
      [section].tsx            Renders <SectionPlaceholderScreen /> (tiles + Quick Review).
      salah/
        index.tsx               Renders <SalahScreen />. A static segment sorts before the
                                 dynamic one, so only Salah escapes the placeholder.
        [block].tsx              Placeholder for any block without its own screen.
        sunnah.tsx               Sunnah & Nafl.
        night-prayer.tsx          Night Prayer (Qiyam, Witr).
        review.tsx               The full prayer review.
    mind.tsx | body.tsx | character.tsx
                             One-line placeholder routes. No folders, no stacks, no content.
components/
  navigation/              PillarBubble, PillarNavigation (floating nav + clearance hook),
                            PillarStackLayout.
  ui/                      Shared primitives: SwipeCompleteRow, LineChart, SegmentedToggle,
                            SectionHeading, NavBackdrop, ScreenBackground, AppHeader,
                            ScreenHeader, BackButton,
                            QuickReviewCard, SectionTile, AyahCard, Divider, ProgressRing,
                            ProgressBar, RadialGlow, LinearGlow, AmbientBackdrop,
                            BottomSheet, OptionGroup, PlaceholderDetail, plus the
                            SpiritualScreen and the PillarPlaceholderScreen /
                            SectionPlaceholderScreen wrappers.
  salah/                   The Salah section: SalahScreen, SalahHeader, SectionLabel,
                            PrayerRow, PrayerDetailSheet, PrayerReviewCard,
                            PrayerReviewScreen, SunnahScreen, NightPrayerScreen,
                            RakahSheet.
constants/
  theme/                   Design tokens (colors, spacing, radii, typography, shadows, animation).
  pillars.ts               UI-layer config: icon + accent color per pillar and Spiritual section.
data/
  types.ts                 PillarId.
  spiritual.ts             Mock content: the six V1 sections + Quick Review copy (no React).
  salah.ts                 Mock content + initial state for the Salah screen (no React).
assets/               Icons, splash images.
babel.config.js       babel-preset-expo + reanimated/worklets plugin (last).
metro.config.js       Default Expo Metro config.
app.json              Expo config: name "The Right Path", slug "the-right-path",
                       scheme "therightpath", Arabic display name in `extra.displayNameArabic`.
```

**Rule:** route files under `app/` stay thin (one line rendering a component); real screen logic lives in `components/`, and content lives in `data/` — never inline mock data or duplicate markup in route files.

## Phase plan

1. **Phase 1 — Technical foundation** (done): Expo/TypeScript/Router/Reanimated/Lucide setup, no UI.
2. **Phase 2 — UI V1** (current): the Spiritual home screen (header, Quick Review button, six section tiles) plus the floating four-pillar bubble navigation and its transition. Mind/Body/Character are placeholders only. Static mock data, no real functionality. Build incrementally — don't try to "finish" the Spiritual pillar.
3. **Phase 3 — Device testing**: verify Phase 2 on real Android (primary) and iOS (secondary) devices/emulators.
4. **Phase 4 — Functionality**: wire up real tracking/logic per subsection, still no backend unless separately decided.

Don't jump ahead to a later phase's scope without it being explicitly requested.

## What is intentionally NOT implemented yet

This is a bare technical foundation. The following are out of scope until explicitly requested:

- Authentication / user accounts
- Database / persistence / cloud sync
- Backend / APIs
- Push notifications
- Real habit/prayer tracking logic
- Qur'an functionality
- Prayer-time functionality

Don't reach for a backend, storage library, or notification API preemptively — add them only when a task explicitly calls for that capability.

## Commands

```bash
npm run android   # expo start --android
npm run ios       # expo start --ios (macOS only for native builds)
npm run web       # expo start --web
npx tsc --noEmit  # type-check
npx expo-doctor   # project health checks
```

## Conventions

- Primary target platform is **Android**; iOS is secondary but must stay working. Avoid platform-specific code unless necessary, and when it is, isolate it behind `Platform.select` / `.ios.tsx` / `.android.tsx` files rather than branching inline.
- Keep `expo-doctor` at 21/21 passing. If adding a native module, install it with `npx expo install <package>` (not plain `npm install`) so Expo resolves the SDK-compatible version.
- This project pins several bleeding-edge versions (Expo 57 / RN 0.86 / React 19.2 / Reanimated 4). If `npm install` hits an `ERESOLVE` peer-dependency conflict from `expo-router`'s internal `react-dom` peer (a known upstream metadata mismatch in this SDK line), reinstall with `npm install --legacy-peer-deps` rather than forcing individual packages.
