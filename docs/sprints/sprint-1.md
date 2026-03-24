# Sprint 1 — Auth, Navigation, Design System

Weeks 3–5. ~22h. Gate: Sprint 0 complete.
Output: Sign up → sign in → all screens. Design tokens. EPC lookup. ErrorBoundary. Offline banner.

STATUS: T1–T5 COMPLETE. T6 COMPLETE. Next: T7 Bottom Navigation.

---

## Pre-T5 Actions [COMPLETE]

All resolved 24 Mar 2026:
- ✅ NativeWind + metro config installed
- ✅ @tanstack/react-query installed
- ✅ phosphor-react-native installed
- ✅ CLAUDE.md updated (v6, PromiseLike, useAuth, visual rules, Cornr branding)
- ✅ pg_cron daily_call_count reset added
- ✅ ITSAppUsesNonExemptEncryption added to app.json

---

## T1: GitHub Repo + Scaffold [COMPLETE]
## T2: Supabase Auth + useAuth [COMPLETE]
## T3: Navigation Guard [COMPLETE]
## T4: Welcome Screen [COMPLETE]
## T5: Sign Up Screen [COMPLETE]

Built 24 Mar 2026. Email/password, 18+ checkbox, anon upgrade, Privacy Policy link, NativeWind classes.

## T6: Sign In + Password Reset [COMPLETE]

Built 24 Mar 2026. Email/password, forgot password flow, reset confirmation, NativeWind classes.

---

## T7: Bottom Navigation [CLAUDE CODE]

**Prompt:**

Build bottom tab navigator using expo-router Tabs layout at app/(app)/_layout.tsx. 4 tabs: Home (Phosphor House), Products (Phosphor ShoppingBag), Trades (Phosphor Wrench), Profile (Phosphor User). Active tab: primary-900 fill weight icon + label. Inactive: neutral-500 light weight icon + label. Tab label: 11px/500. Tab icon: 24px. Tab bar background: white, top border 1px neutral-100. Active tab icon: scale animation 1.0→1.1→1.0 (this is one of only two places scale is permitted — Brand Identity rule). Tab bar visible on all (app) screens. Hide on (auth) and (onboarding) screens.

**Done when:** 4 tabs visible. Active tab highlighted with fill icon. Inactive tabs use light icon.

---

## T8: Home Screen Shell [CLAUDE CODE]

**Prompt:**

Build Home screen at app/(app)/home.tsx. Screen background: warmstone (#F5F4F0). Screen title: "Your Home" — 22px/600. If user has no rooms: show empty state — Phosphor DoorOpen 64px neutral-300, "Your home, waiting to become yours." Subtext: "Add your first room to get started." CTA: "Add a room" (primary-900, navigates to room setup). If user has rooms: FlatList of room cards. If user has 1 room with recommendations loaded and no second room: show second-room prompt from STRINGS.homeReturnPrompt below the first room card.

**Done when:** Empty state renders with DoorOpen icon. Room cards render when rooms exist. Second-room prompt appears for single-room users.

---

## T9: Sentry (EU) [CLAUDE CODE]

**Prompt:**

Set up Sentry EU project for Cornr. Install @sentry/react-native. Configure in root layout with EU data residency (ingest.de.sentry.io). Store DSN in .env (EXPO_PUBLIC_SENTRY_DSN). Trigger a deliberate crash to verify events appear in Sentry dashboard. Remove test crash after verification.

**Done when:** EU project created in Sentry dashboard. Test crash visible. Test crash code removed.

---

## T10: PostHog (EU) [CLAUDE CODE]

**Prompt:**

Set up PostHog EU project for Cornr. Install posthog-react-native. Wrap root layout with PostHogProvider using EU host (eu.posthog.com). Store API key in .env (EXPO_PUBLIC_POSTHOG_KEY). Fire a test event (app_opened), verify it appears in PostHog dashboard.

**Done when:** EU project created. Test event visible in PostHog dashboard.

---

## T-EPC: Silent EPC Lookup [CLAUDE CODE]

**Prompt:**

After user enters postcode in onboarding (saved to users.postcode_district), add a silent background call — do NOT block the onboarding flow or show any UI: fetch EPC API at epc.opendatacommunities.org/api/v1/domestic/search with postcode and size=1. If result found, extract construction-age-band and update users.property_period. If not found, property_period remains null — no error, no user impact. Store EPC_API_KEY as Supabase Edge Function secret. Register at epc.opendatacommunities.org first.

**Done when:** Postcode entry silently populates property_period. Null if not found. Onboarding not blocked.

---

## T-ERR: ErrorBoundary [CLAUDE CODE]

**Prompt:**

Create a React ErrorBoundary class component at src/components/ErrorBoundary.tsx. Must be a class component (React error boundaries cannot be function components). Catches render errors in child tree. Shows branded fallback: warmstone background, Cornr wordmark, "Something went wrong" message, "Try again" button that calls this.setState to reset. Wrap the root layout's Slot component with this ErrorBoundary.

**Done when:** Deliberate render error is caught. Fallback screen shows with Try again button. Try again recovers the app.

---

## T-OFF: Offline Connectivity Banner [CLAUDE CODE]

**Prompt:**

Install @react-native-community/netinfo. Create OfflineBanner component at src/components/OfflineBanner.tsx. When device is offline (useNetInfo().isConnected === false): show amber banner at top of screen with "You're offline. Some features may not work." text. Non-blocking — user can still navigate. When Reduce Motion is enabled: show banner instantly (no slide animation). Cache current archetype in expo-secure-store so archetype result screen works offline.

**Done when:** Airplane mode shows amber banner. Reconnecting dismisses it. Reduce Motion = instant show/hide.

---

## T-CLI: Supabase CLI Local Dev [CLAUDE CODE]

**Prompt:**

Install Supabase CLI globally. Run supabase init in project root. Link to nook-staging project with supabase link. Verify supabase functions serve starts without error. This enables local Edge Function testing before deploying to Supabase.

**Done when:** supabase --version returns a version number. supabase functions serve starts successfully.

---

## PostHog Events (Sprint 1)

- signup_completed { source, time_since_archetype_seconds }
- signup_skipped { time_on_archetype_screen_seconds }
- signin_completed
