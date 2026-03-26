# CLAUDE.md — Cornr Project Rules

## Current build status
Current sprint: Sprint 1
Current task: T9
Last completed: T8 Home screen shell
Blocking issues: NONE

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

## Supabase patterns
Supabase client returns PromiseLike, not Promise — wrap in Promise.resolve() when passing to Promise.all or other APIs expecting a real Promise.
Never call useAuth() inside another hook — causes stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

## Design tokens
primary-900 (#1A3A5C): primary CTA background, screen headings, active nav icon ONLY
primary-600 (#3A6A9A): interactive text, links, secondary button borders ONLY
primary-50 (#EBF2FA): badge backgrounds
teal-bg (#F0FDFA) / teal-text (#134E4A): AI-generated content panels ONLY
warmstone (#F5F4F0): screen background behind card lists

## Typography
Display: 34px/700/letterSpacing -0.5 — archetype name ONLY
Screen title: 22px/600/letterSpacing -0.3 — one per screen
Card heading: 17px/600
Body: 16px/400/lineHeight 24
Badge: 12px/600/uppercase/letterSpacing +0.4

## Border radius
Cards:16px | Buttons:10px | Badges:6px | Inputs:12px | Modal:20px top only
NEVER same radius on all elements.

## Visual design rules
All screens use warmstone (#F5F4F0) background unless white is needed for contrast.
Cards are white with 16px radius and subtle shadow (shadow-sm).
Primary buttons: bg-primary-900, text-white, rounded-button, py-3.
Secondary buttons: border border-primary-600, text-primary-600, rounded-button, py-3.
Teal panels (AI content only): bg-teal-bg, text-teal-text, rounded-card, p-4.
44pt minimum touch targets on all interactive elements.
Before building any screen, read the relevant component spec from the UX Design Review (project knowledge). The UX Design Review overrides simplified specs in sprint prompts.

### MANDATORY: Read before building
Before building or modifying ANY screen or component, read docs/DESIGN_SPECS.md.
This file contains exact values for spacing, colours, typography, shadows, press states, and touch targets.
Do not use default values. Do not guess. Every number in the spec was chosen deliberately.

### The spec overrides everything
If a sprint prompt says "add a button" without specifying height, the spec says 52px.
If a sprint prompt says "primary colour" without a hex, the spec says #1A3A5C.
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
