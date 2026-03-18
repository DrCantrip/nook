# CLAUDE.md - Nook Project Rules

## Current build status
Current sprint: Sprint 0
Current task: T15
Last completed: T14 NativeWind tokens
Blocking issues: NONE

## Stack
React Native + Expo (managed workflow). NEVER eject.
expo-router v3 file-based navigation.
NativeWind for styling. @tanstack/react-query for data fetching.
Supabase (Pro, EU region) for auth, DB, Edge Functions.
posthog-react-native for analytics (EU region Frankfurt).
phosphor-react-native for icons ONLY. NEVER @expo/vector-icons or Lucide.

## Critical rules
NEVER use AsyncStorage for auth — use expo-secure-store (Keychain)
NEVER hardcode any colour — use Tailwind tokens only
NEVER hardcode any UI string — import from src/content/strings.ts
ALL API keys: Supabase Edge Function secrets ONLY. Never in .env or app code.
JWT verified at top of EVERY Edge Function. Unauthenticated -> 401.
Camera permission NOT declared in Info.plist in v1.
No Gas Safe badge in v1. Not anywhere.
"archetype" NEVER appears in UI copy.
activeOpacity={0.85} on ALL Pressable and TouchableOpacity.
Run ALL schema migrations on staging (nook-staging) first.
No PII in Anthropic API requests — archetype, room type, budget only.
All user input in AI prompts wrapped in <user_context></user_context>.

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
