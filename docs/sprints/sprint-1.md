# Cornr — Sprint 1

**Goal:** Auth flow complete, bottom nav working, monitoring in place, infrastructure hardened.

---

## Pre-T5 Actions (must be done before starting T5)

These are blockers from Known Issues. Complete all before any new feature work.

### P1: Install NativeWind + Metro config
```bash
npx expo install nativewind tailwindcss
```
- Create/update `tailwind.config.js` with content paths pointing to `./app/**/*.{ts,tsx}` and `./src/**/*.{ts,tsx}`
- Create/update `metro.config.js` to wrap with `withNativeWind`
- Verify a test class like `className="bg-primary-900"` renders correctly

### P2: Install react-query
```bash
npx expo install @tanstack/react-query
```
- Create `src/providers/QueryProvider.tsx` wrapping `QueryClientProvider`
- Add to app layout

### P3: Install phosphor-react-native
```bash
npx expo install phosphor-react-native react-native-svg
```
- Verify an icon renders: `<House size={24} />`

### P4: Fix CLAUDE.md expo-router version
- Update CLAUDE.md to say `expo-router v6` (not v3)
- Verify `app/index.tsx` exists as required by v6

### P5: Add pg_cron job for daily_call_count reset
- In Supabase SQL editor (staging first):
```sql
SELECT cron.schedule(
  'reset-daily-call-count',
  '0 0 * * *',
  $$UPDATE profiles SET daily_call_count = 0$$
);
```
- Test on nook-staging before production

### P6: Add ITSAppUsesNonExemptEncryption to app.json
- In `app.json` under `expo.ios`:
```json
"infoPlist": {
  "ITSAppUsesNonExemptEncryption": false
}
```
- This avoids the export compliance questionnaire on every TestFlight upload

**Done when:** All 6 pre-actions complete, `npx tsc --noEmit` passes, NativeWind classes render, icons render.

---

## T5 — Sign Up Screen

**Description:** Create the sign up screen with email/password registration and 18+ age verification. This is the first screen new users see after the welcome screen.

**Steps:**
1. Create `app/(auth)/sign-up.tsx`
2. Add to `src/content/strings.ts`:
   - `signUp.title`: "Create your account"
   - `signUp.emailLabel`: "Email address"
   - `signUp.passwordLabel`: "Password"
   - `signUp.ageCheckbox`: "I confirm I am 18 years or older"
   - `signUp.submitButton`: "Create account"
   - `signUp.hasAccount`: "Already have an account?"
   - `signUp.signInLink`: "Sign in"
   - `signUp.ageError`: "You must be 18 or older to use Cornr"
   - `signUp.passwordHint`: "At least 8 characters"
3. Build the form:
   - Email input (keyboard type: email-address, autoCapitalize: none)
   - Password input (secureTextEntry, min 8 chars validation)
   - 18+ age verification checkbox — must be checked to submit
   - "Create account" button (primary-900 background, 10px radius)
   - "Already have an account? Sign in" link below
4. All interactive elements: `activeOpacity={0.85}`
5. On submit:
   - Validate email format, password length, age checkbox
   - Call `supabase.auth.signUp({ email, password })`
   - On success: fire PostHog event `signup_completed` with no PII
   - Navigate to main app (navigation guard handles this)
   - On error: show inline error message
6. Screen title: 22px/600 per typography rules
7. All colours from Tailwind tokens only

**Done when:**
- [ ] `app/(auth)/sign-up.tsx` exists and renders
- [ ] Email + password inputs with validation
- [ ] 18+ checkbox blocks submission when unchecked
- [ ] Supabase signUp call works
- [ ] PostHog `signup_completed` event fires on success
- [ ] All strings from `strings.ts`
- [ ] All colours from Tailwind tokens
- [ ] `activeOpacity={0.85}` on all pressables
- [ ] `npx tsc --noEmit` passes
- [ ] No hardcoded strings or colours

---

## T6 — Sign In + Password Reset

**Description:** Sign in screen with email/password and a "Forgot password?" flow.

**Steps:**
1. Create `app/(auth)/sign-in.tsx`
2. Add strings to `src/content/strings.ts`:
   - `signIn.title`: "Welcome back"
   - `signIn.emailLabel`: "Email address"
   - `signIn.passwordLabel`: "Password"
   - `signIn.submitButton`: "Sign in"
   - `signIn.forgotPassword`: "Forgot your password?"
   - `signIn.noAccount`: "Don't have an account?"
   - `signIn.signUpLink`: "Create one"
   - `signIn.resetTitle`: "Reset your password"
   - `signIn.resetDescription`: "Enter your email and we'll send you a reset link"
   - `signIn.resetButton`: "Send reset link"
   - `signIn.resetSuccess`: "Check your email for the reset link"
3. Build sign in form:
   - Email + password inputs
   - "Sign in" primary CTA
   - "Forgot your password?" link -> modal or separate screen
   - "Don't have an account? Create one" link -> sign-up
4. Forgot password flow:
   - Email input
   - Call `supabase.auth.resetPasswordForEmail(email)`
   - Show success message
5. All interactive elements: `activeOpacity={0.85}`
6. Fire PostHog `signin_completed` on successful sign in

**Done when:**
- [ ] `app/(auth)/sign-in.tsx` exists and renders
- [ ] Email + password sign in works via Supabase
- [ ] "Forgot password?" sends reset email
- [ ] Navigation to sign-up works
- [ ] PostHog `signin_completed` event fires
- [ ] All strings from `strings.ts`
- [ ] All colours from Tailwind tokens
- [ ] `activeOpacity={0.85}` on all pressables
- [ ] `npx tsc --noEmit` passes

---

## T7 — Bottom Navigation (4 tabs)

**Description:** Create the main bottom tab navigator with 4 tabs using Phosphor Icons.

**Steps:**
1. Create `app/(tabs)/_layout.tsx` with bottom tab navigator
2. Create placeholder screens:
   - `app/(tabs)/index.tsx` — Home
   - `app/(tabs)/products.tsx` — Products
   - `app/(tabs)/trades.tsx` — Trades
   - `app/(tabs)/profile.tsx` — Profile
3. Tab bar configuration:
   - Icons from phosphor-react-native ONLY:
     - Home: `<House />` (filled when active)
     - Products: `<ShoppingBag />` (filled when active)
     - Trades: `<Wrench />` (filled when active)
     - Profile: `<User />` (filled when active)
   - Active icon colour: primary-900 (#1A3A5C)
   - Inactive icon colour: gray-400
   - Icon size: 24
   - Touch targets: minimum 44pt (44x44)
   - Tab labels below icons
4. Add tab label strings to `strings.ts`
5. Tab bar background: white, top border 1px gray-200

**Done when:**
- [ ] 4 tabs render with correct Phosphor icons
- [ ] Active/inactive states with correct colours
- [ ] Touch targets >= 44pt
- [ ] Tab labels from `strings.ts`
- [ ] Icons from phosphor-react-native ONLY (not @expo/vector-icons)
- [ ] Navigation between tabs works
- [ ] `npx tsc --noEmit` passes

---

## T8 — Home Screen Shell

**Description:** Create the basic Home screen layout as a shell for future content.

**Steps:**
1. Update `app/(tabs)/index.tsx`
2. Add strings:
   - `home.greeting`: "Hi, {{name}}"
   - `home.subtitle`: "Your home hub"
3. Layout:
   - Screen background: warmstone (#F5F4F0)
   - Greeting with user's name from auth context (22px/600 title)
   - Subtitle below
   - Empty state placeholder for future cards
4. Pull-to-refresh shell (no data to refresh yet, but the gesture should work)
5. SafeAreaView with proper insets

**Done when:**
- [ ] Home screen renders with greeting
- [ ] User name pulled from auth context
- [ ] warmstone background
- [ ] Screen title follows typography rules (22px/600)
- [ ] SafeAreaView with proper insets
- [ ] Pull-to-refresh gesture works (even if no-op)
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T9 — Sentry EU Setup

**Description:** Add Sentry error monitoring, EU data region.

**Steps:**
1. Install Sentry:
```bash
npx expo install @sentry/react-native
```
2. Create `src/lib/sentry.ts`:
   - Init with EU DSN (from Supabase Edge Function secrets — never in .env)
   - For dev: use a placeholder DSN or disable
3. Wrap root layout with Sentry error boundary
4. Configure source maps for EAS builds (config only, not running a build)
5. Add Sentry to `app/_layout.tsx`
6. Test with `Sentry.captureException(new Error('test'))` in dev

**Done when:**
- [ ] Sentry SDK installed
- [ ] Init in `src/lib/sentry.ts`
- [ ] Error boundary wraps root layout
- [ ] DSN not hardcoded in app code
- [ ] `npx tsc --noEmit` passes

---

## T10 — PostHog EU Setup

**Description:** Add PostHog analytics, EU region (Frankfurt).

**Steps:**
1. Install PostHog:
```bash
npx expo install posthog-react-native
```
2. Create `src/lib/posthog.ts`:
   - Init with EU host (`https://eu.posthog.com`)
   - API key from config (not hardcoded secret — PostHog public keys are safe in app)
3. Create `src/providers/PostHogProvider.tsx`
4. Add to app layout provider stack
5. Verify events fire in PostHog dashboard

**Done when:**
- [ ] PostHog SDK installed
- [ ] EU region configured
- [ ] Provider wraps app
- [ ] Test event visible in PostHog dashboard
- [ ] `npx tsc --noEmit` passes

---

## T-EPC — Silent EPC Lookup

**Description:** Add silent EPC (Energy Performance Certificate) lookup by postcode. This runs in the background — no UI in this task.

**Steps:**
1. Create Supabase Edge Function `epc-lookup`
2. Function accepts `{ postcode }` in request body
3. Calls the public EPC API: `https://epc.opendatacommunities.org/api/v1/domestic/search`
4. JWT verified at top — unauthenticated requests get 401
5. Returns EPC data for the postcode
6. No PII sent to external API — postcode only
7. Rate limit: use the user's `daily_call_count`

**Done when:**
- [ ] Edge Function `epc-lookup` exists
- [ ] JWT verification at top
- [ ] Calls EPC API with postcode only
- [ ] Returns structured EPC data
- [ ] 401 for unauthenticated requests
- [ ] No PII in external API call
- [ ] Tested on staging

---

## T-ERR — React Error Boundary

**Description:** Add a user-facing error boundary that catches React render errors gracefully.

**Steps:**
1. Create `src/components/ErrorBoundary.tsx`
2. Class component with `componentDidCatch`
3. Fallback UI:
   - "Something went wrong" message (from strings.ts)
   - "Try again" button that resets the error boundary
   - Report to Sentry if configured
4. Wrap main app content (inside Sentry boundary, outside navigation)
5. Add strings to `strings.ts`

**Done when:**
- [ ] `src/components/ErrorBoundary.tsx` exists
- [ ] Catches render errors
- [ ] Shows fallback UI with retry
- [ ] Reports to Sentry
- [ ] Strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T-OFF — Offline Banner

**Description:** Show a banner when the device loses internet connectivity.

**Steps:**
1. Create `src/components/OfflineBanner.tsx`
2. Use `@react-native-community/netinfo` or expo equivalent
3. Banner appears at top of screen when offline
4. Banner text from `strings.ts`: "You're offline. Some features may be unavailable."
5. Banner disappears when connectivity returns
6. Banner style: yellow/amber background, dark text

**Done when:**
- [ ] Banner appears when offline
- [ ] Banner disappears when online
- [ ] Text from `strings.ts`
- [ ] Non-intrusive positioning (top of screen, doesn't push content)
- [ ] `npx tsc --noEmit` passes

---

## T-CLI — Supabase CLI Local Dev

**Description:** Set up Supabase CLI for local development and testing.

**Steps:**
1. Install Supabase CLI if not present
2. Run `supabase init` in project root (if not already done)
3. Configure `supabase/config.toml` for local dev
4. Document in README or docs how to:
   - Start local Supabase: `supabase start`
   - Run migrations locally
   - Test Edge Functions locally
5. Ensure `.env` local overrides point to local Supabase URL

**Done when:**
- [ ] `supabase/` directory with config exists
- [ ] `supabase start` launches local instance
- [ ] Local dev documented
- [ ] Edge Functions testable locally
- [ ] No secrets committed to git
