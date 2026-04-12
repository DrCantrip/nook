# CLAUDE.md — Cornr Project Rules

## Current build status
Current sprint: Sprint 1
Current task: T9
Last completed: T8 Home screen shell
Blocking issues: NONE

## Staging test users (permanent — do not delete)

These exist in Supabase staging (project tleoqtldxjlyufixeukz) for RLS verification. They are reused for every schema change that touches user-scoped tables. Do not recreate. Do not seed with realistic data. Never copy to production.

- test-a@cornr.test → 0e675e05-63de-46a0-bdfb-cb101268bf3f
- test-b@cornr.test → de7925d8-84f3-49f5-84b8-e6fe01543ef2

Last RLS verification: 7 Apr 2026 (Prompt A, all 6 tables passed).

## Stack
React Native + Expo SDK 54 (managed workflow). NEVER eject.
expo-router v6 file-based navigation.
NativeWind v4 + Tailwind CSS for styling.
@tanstack/react-query for data fetching.
Supabase (Pro, EU region) for auth, DB, Edge Functions.
posthog-react-native for analytics (EU region Frankfurt).
phosphor-react-native for icons ONLY. NEVER @expo/vector-icons or Lucide.

## Key paths
app/ — expo-router screens and layouts
src/hooks/ — custom hooks (useAuth, useStyleProfile)
src/content/strings.ts — ALL user-facing copy
src/tokens/colors.ts — colour constants (reference only, use Tailwind classes)
src/lib/supabase.ts — Supabase client
src/providers/ — context providers (QueryProvider, etc.)

## Critical rules
NEVER use AsyncStorage for auth — use expo-secure-store (Keychain).
NEVER hardcode any colour — use Tailwind tokens only.
NEVER hardcode any UI string — import from src/content/strings.ts.
ALL API keys: Supabase Edge Function secrets ONLY. Never in .env or app code.
JWT verified at top of EVERY Edge Function. Unauthenticated -> 401.
Camera permission NOT declared in Info.plist in v1.
No Gas Safe badge in v1. Not anywhere.
"archetype" NEVER appears in UI copy.
activeOpacity={0.85} on ALL Pressable and TouchableOpacity.
Run ALL schema migrations on staging (nook-staging) first.
No PII in Anthropic API requests — archetype, room type, budget only.
All user input in AI prompts wrapped in <user_context></user_context>.

## Voice gate — applies to any task touching user-facing copy
If a task adds, modifies, or generates ANY user-facing string (button labels, screen copy, error messages, empty states, notifications, expander text, headlines, microcopy, placeholder text, accessibility labels), the voice gate runs before commit.
Authoritative source: docs/CORNR_BRAND_DESIGN_SYSTEM_v3 Sections 2.2 (voice table), 2.3 (never say), 2.4 (always use).

Banned words — NEVER appear in user-facing copy:
curated, bespoke, journey, unlock, stunning, AI-powered, discover (not as nav label or button), elevate, reimagine, transform, algorithm, optimise, leverage, synergy, "curated by AI"

Preferred phrases — reach for these where natural:
"Chosen because..." (AI rationale prefix), "Your [archetype] style", "Every corner, considered.", "find your Cornr", "feels like you", "picked for you", "your space, your story"

Error state rules (all four must hold):
1. Explain what happened in plain language
2. Say what to do next
3. Reassure that nothing is lost (where relevant)
4. Never blame the user, never use technical language (no 401, timeout, exception, null, undefined)

Tone by context:
- Archetype/result screens: warm, personal, affirming
- Product rationale: specific, knowledgeable, starts with "Chosen because..."
- Errors: calm, reassuring, actionable
- Onboarding: encouraging, low-pressure
- Disclosure: honest, brief, adult
- Marketing: considered, aspirational

## Supabase patterns
Supabase client returns PromiseLike, not Promise — wrap in Promise.resolve() when passing to Promise.all or other APIs expecting a real Promise.
Never call useAuth() inside another hook — causes stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

## Typography rules (v4)
- Three fonts via expo-font: Lora (display/serif), DM Sans (body/sans), Newsreader (accent italic)
- Lora bundled at SemiBold (600) and Bold (700) ONLY — never use Lora at Regular weight
- Rule: Serif (Lora) for editorial/headings. Sans (DM Sans) for functional/body. Newsreader for italic accent quotes only.
- Hierarchy comes from font family, not colour — both headings and body use ink (#1A1814)

## Colour tokens (v4 warm palette)
- ink #1A1814 — primary text, headings, wordmark (16.6:1 on cream, AAA)
- cream #FAF7F3 — page background
- white #FFFCF9 — card surface
- accent #94653A — interactive text/borders/icons (4.7:1 on cream, AA-safe DEFAULT)
- accent-surface #B28760 — filled button backgrounds ONLY (3.01:1 UI component on cream, never used for text)
- warm-600 #6B6358 — secondary text (5.54:1 on cream)
- warm-400 #948A7D — placeholders (3.18:1, large text only)
- warm-200 #D4CBC0 — borders, disabled bg
- warm-100 #EDE8E2 — skeleton/light card bg
- Teal #F0FDFA bg + #134E4A text — AI rationale panels ONLY, never elsewhere
- WCAG AA is a HARD RULE — every text colour passes 4.5:1 on its background, every UI boundary passes 3:1

## Pre-commit hook (v4)
A simple-git-hooks pre-commit hook runs npx tsc --noEmit before every commit. If TypeScript errors exist, the commit is blocked. This prevents the silent-TS-error class of bug from reaching main.

## Border radius
Cards:16px | Buttons:10px | Badges:6px | Inputs:12px | Modal:20px top only
NEVER same radius on all elements.

## Visual design rules
All screens use cream (#FAF7F3) background unless white is needed for contrast.
Cards are white with 16px radius and subtle shadow (shadow-sm).
Primary buttons: bg-ink (#1A1814), text-white, rounded-button, py-3.
Secondary buttons: border border-accent (#94653A), text-accent (#94653A), rounded-button, py-3.
Teal panels (AI content only): bg-teal-bg, text-teal-text, rounded-card, p-4.
44pt minimum touch targets on all interactive elements.
Before building any screen, read the relevant component spec from the UX Design Review (project knowledge). The UX Design Review overrides simplified specs in sprint prompts.

### MANDATORY: Read before building
Before building or modifying ANY screen or component, read docs/DESIGN_SPECS.md.
This file contains exact values for spacing, colours, typography, shadows, press states, and touch targets.
Do not use default values. Do not guess. Every number in the spec was chosen deliberately.

### The spec overrides everything
If a sprint prompt says "add a button" without specifying height, the spec says 52px.
If a sprint prompt says "primary colour" without a hex, the spec says ink (#1A1814).
The UX Design Review (project knowledge) overrides simplified specs in sprint prompts.
docs/DESIGN_SPECS.md is the local copy of those specs for Claude Code to reference.

### Verify during /done
The /done command includes a Design Spec Check step. It verifies spacing, colours, typography, touch targets, and press states against the spec. If anything doesn't match, fix it before committing.

## Navigation rules
After adding or modifying any router.push() or router.replace() call, verify the target route file exists. Run: find app/ -name '*.tsx' to list all routes. If the target doesn't exist, stop and flag it — don't commit broken navigation.

## ProductCard rules
Rationale always starts "Chosen because..." — never any other prefix
Teal panel: background #F0FDFA, text #134E4A
Affiliate disclosure on Products screen header only — from STRINGS.affiliateDisclosure

## Trades v1 rules
Companies House badge ONLY. No Gas Safe badge.
Results sorted: rating DESC, review_count DESC.
No messaging, no quotes, no booking. Call button (tel: link) only.

## DO NOT
Use LinearGradient (except swipe card image fade)
Import from @expo/vector-icons, Lucide, or Heroicons
Hardcode any colour value
Hardcode any copy string
Use AsyncStorage for auth tokens
Store API keys outside Supabase Edge Function secrets
Add camera permission to Info.plist in v1
Show Gas Safe badge
Write "archetype" in any user-visible text
Use activeOpacity other than 0.85
Apply identical border-radius to all elements
Run migration SQL on production without testing on staging first
Use NativeWind className on full-screen ImageBackground layouts. Use StyleSheet.create + cssInterop={false} on every component. See docs/DESIGN_SPECS.md "NativeWind escape hatch rules".
Put layout properties (flex, justifyContent, alignItems, minHeight, backgroundColor) inside Pressable style callbacks. Only opacity goes in the callback. Everything else in StyleSheet.create.

## Build rules (added 12 April 2026)
NativeWind is permanently removed (6 Apr). Use StyleSheet.create + src/theme/tokens.ts. No className, no cssInterop, no tw(). ESLint bans hex codes in components.
expo-router v6: app/index.tsx is root entry. Auth guard is ALLOW-LIST only — protected groups (app) and (onboarding). Never deny-list.
