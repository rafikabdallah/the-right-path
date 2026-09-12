
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

## Visual identity

Goal: **premium + calm + modern + slightly futuristic.**

- Near-black background, white/near-white primary text.
- Purple is the app's single accent — active nav bubble, the transition sweep, section icons, and the Quick Review button. Use it **selectively**: no giant gradients, no neon, no screen-wide purple.
- The Quick Review button is the only element with a visible purple fill; that's what makes it read as the screen's primary action.
- Each pillar also has a quiet identity tint (`colors.pillarSpiritual` etc.), used only on its own placeholder header. Nav and transitions stay purple.
- Dark surfaces for elevated cards, subtle low-contrast borders, generously rounded corners, restrained depth.
- Animation communicates interaction, not decoration: bubble selection, pillar transition, press feedback, and one subtle staggered card entrance. Don't animate everything.
- No heavy Islamic decoration or emoji inside the UI itself — pillar emoji (🕌🧠💪❤️) are for docs/specs like this file, not for rendering in-app.

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
      salah.tsx                Renders <SalahScreen />. A static segment sorts before the
                                dynamic one, so only Salah escapes the placeholder.
    mind.tsx | body.tsx | character.tsx
                             One-line placeholder routes. No folders, no stacks, no content.
components/
  navigation/              PillarBubble, PillarNavigation (floating nav + clearance hook),
                            PillarStackLayout.
  ui/                      Shared primitives: ScreenHeader, QuickReviewButton,
                            SpiritualSectionCard, SpiritualScreen, PillarPlaceholderScreen,
                            SectionPlaceholderScreen, BottomSheet, OptionGroup.
  salah/                   The Salah section: SalahScreen, SalahHeader, WeeklyOverview,
                            SectionLabel, PrayerRow, SecondarySection, PrayerDetailSheet.
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
