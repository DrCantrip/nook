# Cornr Design System

**Snapshot:** 5 May 2026
**Source of truth:** `src/theme/tokens.ts` (code) + `docs/CORNR_CANONICAL.md` Section 14 (rules and intent).
**Re-upload trigger:** any merged change to `tokens.ts` or canonical Section 14. The previous version of this doc was ~30% drifted because it was hand-edited rather than re-derived. If you spot a discrepancy between this doc and `tokens.ts`, the code wins — re-derive, do not patch in place.

> **Why this doc exists.** It's the upload to Claude Design's "Set up design system" notes field. Claude Design renders mockups against these rules. Drift between this doc and `tokens.ts` directly produces drift between mockups and built screens.

---

## 1. Brand essence

Cornr is a UK mobile app for first-time home buyers, active from house-hunting through ~18 months post-completion. It assigns one of seven home-style archetypes via a swipe quiz, then delivers archetype-tuned product recommendations and editorial. Tagline: *"Every corner, considered."*

**Voice:** warm, second-person, directional-not-diagnostic, Anglo-Saxon-first, zero proper nouns in user-facing copy. Behavioural truth is the product moment.

**Visual feel:** considered, not theatrical. Premium without being precious. The reveal is identity-affirming; everything else recedes.

**Banned terms (BDS 2.2):** *curated, journey, elevate, immerse, unleash, empower, seamless, effortless*. AI-genericisms. Era references and temporal language. Generic property-app vocabulary ("dream home").

---

## 2. Three-tier colour system

Cornr's colour model is layered. Tier 1 is the always-present semantic palette. Tier 2 is the reveal-hero gradient set (one per archetype). Tier 3 is the post-archetype tinted-surface system that runs across home/profile/recommendation screens.

### Tier 1 — Semantic palette (90/10 pre-archetype)

Pre-archetype screens use 90% cream + 10% colour. Interactive elements are accent. Text is ink. Hierarchy comes from font family, not colour.

<!-- TOKEN-DOCS:START name=palette -->
**Core neutrals**

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#1A1814` | Primary text, headings, wordmark (16.6:1 on cream, AAA) |
| `charcoal` | `#2C2824` | Dark card backgrounds |
| `warm800` | `#3D3832` | Borders on dark surfaces |
| `warm600` | `#6B6358` | Secondary text, UI labels (5.54:1 on cream) |
| `warm400` | `#948A7D` | Placeholders, inactive icons (3.18:1, large text only) |
| `warm200` | `#D4CBC0` | Light borders, disabled bg |
| `warm100` | `#EDE8E2` | Skeleton, light card bg |
| `cream` | `#FAF7F3` | Page background |
| `white` | `#FFFCF9` | Card surface |

**Accent (terracotta — 15 April late PM shift, Lick / Farrow & Ball 2026 trend data)**

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#9E5F3C` | Interactive text, borders, icons |
| `accentSurface` | `#BE7458` | Filled button backgrounds **only** — never used for text |
| `accentLight` | `#F0D8C0` | Tint backgrounds |
| `accentDark` | `#965E40` | Pressed states |

**Semantic**

| Token | Hex | Usage |
|---|---|---|
| `success` | `#3A7E4F` | Confirmations, "love" overlay base |
| `warning` | `#8E6B26` | Cautions |
| `warningLight` | `#FDF3E3` | Warning backgrounds |
| `error` | `#A84B42` | Errors, "pass" overlay base — 16.1° hue separation from terracotta accent |
| `info` | `#4A6E8E` | Informational |

**AI-content surfaces (the only place teal is allowed)**

| Token | Hex | Usage |
|---|---|---|
| `tealBg` | `#F0FDFA` | AI rationale panel background |
| `tealText` | `#134E4A` | AI rationale panel text |

> Note: AI teal is deprecated for *user-facing identity surfaces* (canonical 15 Apr PM). It still applies to AI-generated content panels (recommendation rationale).

**Swipe overlays (rgba, applied at 35% opacity over card)**

| Token | Value | Usage |
|---|---|---|
| `swipeOverlayLove` | `rgba(58, 126, 79, 0.35)` | Right-swipe love-direction overlay |
| `swipeOverlayPass` | `rgba(172, 83, 66, 0.35)` | Left-swipe pass-direction overlay |
<!-- TOKEN-DOCS:END name=palette -->

### Tier 2 — Reveal hero gradients (`archetypeTheme(id)`)

The reveal screen and share card render at 100% archetype intensity via a three-stop linear gradient. White text (`#FFFCF9`) is verified ≥ 4.5:1 across the full gradient. Components consume the returned object — they never hardcode archetype colours.

```
archetypeTheme(id) → { gradientStart, gradientMid, gradientEnd, accent, grainOpacity }
```

| Archetype | gradientStart | gradientMid | gradientEnd | accent | grainOpacity |
|---|---|---|---|---|---|
| curator | `#93662C` | `#A67B3D` | `#6B4A2E` | `#5C6B4A` | 0.04 |
| nester | `#7E725A` | `#7D9A8B` | `#5A6F62` | `#5A8A94` | 0.05 |
| maker | `#766A5B` | `#6E6256` | `#3D3832` | `#B87F4A` | 0.07 |
| minimalist | `#756E65` | `#A69E90` | `#8A7E70` | `#A09080` | 0.02 |
| romantic | `#896D61` | `#B08888` | `#7A5A5A` | `#C4908A` | 0.05 |
| storyteller | `#8A4A5A` | `#6A3A48` | `#4A2838` | `#8A6550` | 0.10 |
| urbanist | `#6B645C` | `#4D4842` | `#2D2A26` | `#5E5A68` | 0.03 |

**Graduated intensity model:** reveal screen 100%, share card 100%, home tab ~40%, profile ~20%, everything else 0%. Non-themed screens revert to the Tier 1 semantic palette.

**Implementation:** `expo-linear-gradient` with stops at `[0, 0.45, 1]`. Static SVG grain overlay (`src/components/atoms/GrainOverlay.tsx`) layered above gradient, below text. `pointerEvents="none"`. Wrapped in `React.memo`.

> *DESIGN-07 candidate revision (post-mock-first):* Nester `#7A6A5A`, Maker `#3A3A3A`, Minimalist `#7A7A72`, Romantic `#A86B5F`, Urbanist `#6B2E2E`. Ships only if mock-first validates. Current values above remain canonical until then.

### Tier 3 — Archetype tinted surfaces (`tint(id, variant)`, post-archetype 80/15/5)

Post-archetype screens (home, recommendations, profile) replace the 90/10 rule with an 80/15/5 system:

- **80% tinted neutral** — archetype colour at 5% opacity on page background, 8% on section backgrounds. Pre-computed below.
- **15% archetype identity elements** — motif, archetype name, rationale badges, all rendered at full archetype-accent colour.
- **5% universal interactive** — accent buttons and links. **Identical across all 7 archetypes.** See R-20.

```
tint(id, 'page')    → page-background hex
tint(id, 'section') → card / bordered-region hex
```

| Archetype | Accent (full) | `page` (5%) | `section` (8%) |
|---|---|---|---|
| curator | `#5C6B4A` | `#F2F0EA` | `#EDEBE5` |
| nester | `#5A8A94` | `#F2F1EE` | `#EDEEEB` |
| maker | `#B87F4A` | `#F7F1EB` | `#F5EDE5` |
| minimalist | `#A09080` | `#F6F2ED` | `#F3EFEA` |
| romantic | `#C4908A` | `#F7F2EE` | `#F6EFEB` |
| storyteller | `#8A6550` | `#F4EFEA` | `#F1EBE5` |
| urbanist | `#5E5A68` | `#F2EFEC` | `#EDEAE7` |

**CVD policy:** archetype colour is never the sole differentiator. Name, motif, and typography hierarchy are always co-present. A user with red-green colour-blindness identifies their archetype by motif + name, not hue.

---

## 3. Typography

Hierarchy comes from font family, not colour. All ink-coloured text on cream by default.

**Family roles:**
- **Lora (serif)** — display, headings, behavioural-truth statements. Identity moments.
- **DM Sans (sans)** — body, UI labels, CTAs, observations. Functional moments.
- **Newsreader Italic** — pull quotes, essence lines. Editorial moments only.

<!-- TOKEN-DOCS:START name=typography -->
| Role | Family | Size | Line height | Letter spacing |
|---|---|---|---|---|
| `display` | Lora-Bold | 34 | 40 | -0.5 |
| `screenTitle` | Lora-SemiBold | 22 | 28 | -0.3 |
| `sectionHeading` | Lora-SemiBold | 20 | 26 | -0.2 |
| `cardHeading` | DMSans-SemiBold | 17 | 22 | — |
| `body` | DMSans-Regular | 16 | 24 | — |
| `uiLabel` | DMSans-Medium | 14 | 20 | — |
| `badge` | DMSans-SemiBold | 12 | 16 | 0.4 |
| `cta` | DMSans-SemiBold | 16 | 20 | 0.2 |
| `quote` | NewsreaderItalic | 16 | 24 | — |
| `essence` | NewsreaderItalic | 22 | 29 | — |
| `behaviouralTruth` | Lora-SemiBold | 22 | 28 | — |
| `observation` | DMSans-Regular | 16 | 24 | — |
<!-- TOKEN-DOCS:END name=typography -->

**Reveal-hero typography hierarchy** (largest text = the product moment):
- Style territory in DMSans-Regular at the top (context).
- Archetype name in Lora-SemiBold 48px (identity).
- Behavioural truth in NewsreaderItalic 28px (the "how did it know" moment — the largest type on screen by perceptual weight).

---

## 4. Spacing

T-shirt scale, used for padding, margins, and gap.

<!-- TOKEN-DOCS:START name=spacing -->
| Token | px |
|---|---|
| `xs` | 4 |
| `sm` | 8 |
| `md` | 12 |
| `lg` | 16 |
| `xl` | 20 |
| `2xl` | 24 |
| `3xl` | 32 |
| `4xl` | 48 |
<!-- TOKEN-DOCS:END name=spacing -->

**Standing rules:**
- Screen horizontal margin: 20 (`xl`).
- Screen top below header: 24 (`2xl`).
- Screen bottom: 32 (`3xl`).
- Between major sections: 32 (`3xl`).
- Between related items: 20 (`xl`).
- Card internal padding: 20 horizontal, 16 vertical.
- Between cards in a list: 12 gap (`md`).

---

## 5. Radii

Radius communicates element type. Never uniform.

<!-- TOKEN-DOCS:START name=radii -->
| Token | px | Use |
|---|---|---|
| `badge` | 6 | Status pills, label chips |
| `button` | 10 | Filled and ghost buttons |
| `input` | 12 | Text inputs, selects |
| `card` | 16 | Cards, list rows |
| `modal` | 20 | Modal sheets (top-only) |
| `swipe` | 20 | Swipe deck cards |
<!-- TOKEN-DOCS:END name=radii -->

---

## 6. Shadows

Imported from `tokens.shadow`. Never write shadow values inline in a component.

<!-- TOKEN-DOCS:START name=shadows -->
| Token | Color | Opacity | Radius | Offset | Elevation |
|---|---|---|---|---|---|
| `shadow.card` | `ink` | 0.08\* | 12 | `{0, 4}`\* | 4\* |
| `shadow.swipe` | `ink` | 0.12 | 20 | `{0, 8}` | 8 |
<!-- TOKEN-DOCS:END name=shadows -->

> \***Known token drift on `shadow.card`** (CD-MARKDOWN re-derivation, 5 May): tokens.ts defines `card` as `{0.08, 12, {0,4}, 4}`, but BDS v3 and historical components use `{0.06, 12, {0,1}, 2}`. Components likely inline the BDS values, bypassing the token. **Flagged for future fix** — do not "correct" in either direction without an audit pass. Treat tokens.ts as authoritative for any new component until then.

---

## 7. Voice rules (BDS 2.2 + R-15)

- **Second-person, warm.** Never first-person from the brand. Never imperative-cold.
- **Directional, not diagnostic.** Describe how the archetype *moves*, not what it *is*.
- **Behavioural truth is the product (R-15).** Every archetype surface — reveal description, share card, recommendation rationale — must include a specific, embarrassingly-true behavioural observation. The "how did it know that?" moment.
- **Trend grounding without naming.** Recommendations reference the *quality* a trend embodies, never name the trend. ✓ "the depth of warm walnut" ✗ "walnut is trending in 2026."
- **No era references, no temporal language.** "Mid-century" as a style territory: yes. "2020s" or "right now": no.
- **Anglo-Saxon-first vocabulary.** Grandmother test + read-aloud test required.

---

## 8. Three-tier error / empty-state architecture

Errors and empties are first-class voice surfaces, not afterthoughts.

1. **`src/content/errors.ts`** — single source of truth for error and empty-state copy. Every `ErrorCopyKey` is defined here. No inline strings.
2. **`ErrorScreenTemplate`** — full-screen template for unrecoverable states. Used for crashes, hard auth failures, account-state errors.
3. **`NetworkErrorScreen`** — recoverable-state template. Includes optional `onRetry` callback. Renders the warm error voice — *"Something went west"* (crash fallback), *"Out walking the dog"* (image-load Geordie phrase). Slightly British, warm, never sands the edges off.

If `onRetry` is `undefined`, NetworkErrorScreen logs a warning (current known follow-up: REVEAL-RETRY-STATE / LOG-CONSOLE-WARN-AUDIT).

---

## 9. Motion vocabulary (canonical Section 14.6 + 5 May motion foundation)

> *Motion in Cornr is considered, not theatrical. A premium app has things moving smoothly — never popping.*

Three registers, defined in `src/theme/motion.ts`:

| Register | Duration | Easing | Use |
|---|---|---|---|
| `considered` | 600ms | `bezierFn(0.16, 1, 0.3, 1)` (premium ease-out) | Identity moments — reveal essence, archetype name fade |
| `gentle` | 300ms | `bezierFn(0.4, 0, 0.2, 1)` (standard) | Navigation, transitions, expanders, tab-bar icon scale |
| `immediate` | 0ms | — | Feedback, taps, loading states |

**Reduced-motion gate.** Every animation respects `prefers-reduced-motion` via the project's `useMotionPreference` hook (built on `AccessibilityInfo` + `reduceMotionChanged` listener). Reanimated's own `useReducedMotion` is **not reactive** — it captures once at module load. The project hook is the reactive source of truth for non-gesture surfaces. SwipeCard's continued direct reanimated use is acceptable (re-renders frequently per gesture).

`bezierFn` (not `bezier`) is intentional — it returns a plain `(t: number) => number` consumable by both Reanimated AND React Native core Animated. Single implementation, two consumers.

---

## 10. Component behaviour

- **Pressable:** `activeOpacity: 0.85` + `Haptics.selectionAsync()` on every interactive element.
- **No scale transforms on press.** Visual feedback is opacity + haptic, never bounce.
- **Minimum touch target:** 44 × 44pt on every Pressable. WCAG 2.5.5.
- **`accessibilityRole` and `accessibilityLabel`** required on every interactive element (WCAG AA hard rule).
- **Icons:** `phosphor-react-native` only. Weight `light` default; `fill` for active nav, wishlisted heart, accreditation badges. Sizes: 20px in cards/lists, 24px for action buttons, 18px in badges. Never mix sizes within one component.

---

## 11. Platform notes

- **React Native + Expo SDK 54.** TypeScript. `expo-router` v6.
- **Web HTML output is not a target.** Cornr is mobile-first. No Tailwind, no NativeWind. NativeWind was permanently removed 6 April 2026 because its CSS-interop layer silently stripped layout properties under SDK 54.
- **Styling pattern:** `StyleSheet.create` consuming tokens from `src/theme/tokens.ts`. ESLint bans hex codes in `src/components/`, `src/screens/`, and `app/`.
- **Reanimated:** `~3.16.x` (SDK 54 compat). Standalone `react-native-worklets` conflicts with Expo Go — do not add. Run `npx expo install --check` before any Reanimated change.

---

## 12. Seven archetypes (locked taxonomy)

The IDs and names below are canonical (locked 7 April 2026, hybrid naming). UI shows the personality name only; territory appears on the reveal subtitle and share quote.

| ID | Personality | Style territory |
|---|---|---|
| `curator` | The Curator | Mid-Century Modern |
| `nester` | The Nester | Coastal |
| `maker` | The Maker | Industrial |
| `minimalist` | The Minimalist | Japandi |
| `romantic` | The Romantic | French Country |
| `storyteller` | The Storyteller | Eclectic Vintage |
| `urbanist` | The Urbanist | Urban Contemporary |

**Dead, do not use:** Warm Scandi, Traditionalist, Free Spirit, Purist, Modernist, Dreamer.

**Motifs (locked, 48 × 48 viewBox, 2px stroke, no fill):**

| Archetype | Motif |
|---|---|
| curator | viewfinder + golden spiral |
| nester | asymmetric / concentric embrace |
| maker | interlocking brackets |
| minimalist | lower-left quarter-arc |
| romantic | rotated ellipses |
| storyteller | mixed shapes |
| urbanist | rectangle + diagonal |

---

## 13. Re-derivation provenance

**Generated:** 5 May 2026 from `src/theme/tokens.ts` + canonical Section 14.

**Pending follow-ups (flagged, not blocking):**
- Icon background `#C4785A` referenced in canonical Section 0 / memory but not present as a token. Either add as `colors.iconBg` or document as asset-pipeline-only.
- `shadow.card` token drift (see §6) — audit needed to align tokens.ts with components.
- DESIGN-07 palette revision candidates (4 of 7 accents) — blocked on mock-first validation.

**Re-upload trigger:** any merged change to `src/theme/tokens.ts` or canonical Section 14 invalidates this snapshot.
