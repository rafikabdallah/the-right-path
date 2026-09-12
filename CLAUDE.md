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

Spiritual is the highest-priority pillar and gets the most design attention (its Quick Review section, full card set). Mind, Body, and Character use the same reusable components and interaction pattern but don't need deeper design than Spiritual at this stage.

## Navigation & transition

Bottom navigation has four permanent tabs — Spiritual, Mind, Body, Character — each with a Lucide icon, Spiritual always the default/opening tab. Tapping a different pillar tab plays a **pillar-switch transition**: the target pillar's accent color expands outward from the tapped nav item (as a circle growing from the tap point) until it covers the screen, the new screen's content swaps in underneath while covered, then the color fades out to reveal it. Duration ~250–500ms total, one smooth easing curve — no bounce, no flashiness. Tapping a card within a pillar pushes a lightweight in-stack detail screen (not this full-screen transition); cards get only a subtle press/scale response.

## Visual identity

- Near-black background, white/near-white primary text.
- Purple is the app's single shared brand accent (nav active state, primary actions, focus/glow) — used **selectively**, not as a dominant color across every screen.
- Each pillar additionally has its own accent color (used for that pillar's icon tint and its transition sweep) so the four sections stay visually distinct without leaning on purple everywhere.
- Dark purple-tinted surfaces for elevated cards, subtle low-contrast borders, soft glow (colored shadow, not harsh drop shadow), consistently rounded corners.
- No heavy Islamic decoration or emoji inside the UI itself — pillar emoji (🕌🧠💪❤️) are for docs/specs like this file, not for rendering in-app.

## Path aliases

`@/*` maps to the project root (configured in both `tsconfig.json` `paths` and picked up automatically by Metro via `expo/metro-config`). Prefer `@/constants/theme`, `@/app/...` etc. over long relative `../../..` chains.

## Project structure

```
app/                  Expo Router routes (screens). _layout.tsx = root layout.
constants/theme/      Centralized design tokens (colors, spacing, radii, typography).
assets/               Icons, splash images.
babel.config.js       babel-preset-expo + reanimated/worklets plugin (last).
metro.config.js       Default Expo Metro config.
app.json              Expo config: name "The Right Path", slug "the-right-path",
                       scheme "therightpath", Arabic display name in `extra.displayNameArabic`.
```

As features are added, prefer grouping by pillar/domain under `app/` (e.g. `app/(spiritual)/`, `app/(mind)/`, `app/(body)/`, `app/(character)/`) using Expo Router route groups, and colocate feature-specific components under a top-level `components/` or `features/` directory — establish the exact convention when the first real feature is built, then document it here.

## Phase plan

1. **Phase 1 — Technical foundation** (done): Expo/TypeScript/Router/Reanimated/Lucide setup, no UI.
2. **Phase 2 — UI V1** (current): Bottom nav + pillar-switch transition, Spiritual page (Quick Review + all 10 subsections), Mind/Body/Character pages (cards, same pattern, less design depth), all on mock data, placeholder detail screens only.
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
