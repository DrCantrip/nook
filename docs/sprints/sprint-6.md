# Cornr — Sprint 6: Launch Prep

**Goal:** Build, test, polish, audit, submit to App Store.

---

## T1 — EAS Build Configuration (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Configure Expo Application Services for building iOS and Android.

**Steps:**
1. Run `eas build:configure`
2. Set up `eas.json` with profiles: development, preview, production
3. Configure signing credentials
4. Test a preview build
5. Verify bundle identifier matches App Store Connect

**Done when:**
- [ ] `eas.json` configured
- [ ] Preview build succeeds
- [ ] Bundle ID correct
- [ ] Signing credentials set

---

## T2 — iPad Crash Test (2h, Daryll — NEW)

**Owner:** Daryll (manual)
**Estimate:** 2h

**Description:** Test on iPad to ensure no crashes. iPadOS is a common rejection reason.

**Steps:**
1. Run preview build on iPad (or iPad simulator)
2. Test all screens: welcome, auth, tabs, quiz, products, trades, profile
3. Check layout doesn't break on larger screen
4. Check rotation handling (lock to portrait or support both)
5. Document any crashes or layout issues

**Done when:**
- [ ] All screens tested on iPad
- [ ] No crashes
- [ ] Layout acceptable (doesn't need to be perfect, just not broken)
- [ ] Rotation behaviour documented

---

## T3 — App Icon + Splash Screen (2h, Daryll)

**Owner:** Daryll (manual/design)
**Estimate:** 2h

**Description:** Final app icon and splash screen assets.

**Steps:**
1. App icon: 1024x1024 PNG, no transparency, no rounded corners (Apple adds these)
2. Splash screen: branded loading screen
3. Add to `app.json` under `expo.icon` and `expo.splash`
4. Adaptive icon for Android

**Done when:**
- [ ] App icon renders correctly in simulator
- [ ] Splash screen shows on launch
- [ ] Android adaptive icon configured
- [ ] Assets in correct format/size

---

## T4 — UX Polish Pass (3h, cc)

**Owner:** cc (Claude)
**Estimate:** 3h

**Description:** Review all screens for UX consistency and polish.

**Steps:**
1. Verify all screens use correct typography scale
2. Verify all colours from Tailwind tokens (no hardcoded values)
3. Verify all border radii follow the rules (cards 16, buttons 10, badges 6, inputs 12, modal 20 top only)
4. Verify `activeOpacity={0.85}` everywhere
5. Check loading states on all async operations
6. Check empty states on all list screens
7. Verify all strings from `strings.ts`

**Done when:**
- [ ] Typography consistent across all screens
- [ ] No hardcoded colours
- [ ] Border radii correct per rules
- [ ] activeOpacity correct everywhere
- [ ] Loading states present
- [ ] Empty states present
- [ ] All strings externalised

---

## T5 — Accessibility Audit (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Ensure minimum accessibility compliance.

**Steps:**
1. All images have `accessibilityLabel`
2. All buttons have `accessibilityRole="button"` and `accessibilityLabel`
3. All form inputs have labels
4. Colour contrast meets WCAG AA (4.5:1 for text)
5. Touch targets minimum 44pt
6. Screen reader navigation logical order
7. Test with VoiceOver on iOS simulator

**Done when:**
- [ ] All interactive elements have accessibility labels
- [ ] Colour contrast passes WCAG AA
- [ ] Touch targets >= 44pt
- [ ] VoiceOver navigation tested
- [ ] No unlabelled images

---

## T6 — Security Sweep (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Final security audit before submission.

**Steps:**
1. Run `scripts/verify/check-env.sh`
2. Verify no API keys in app code or git history
3. Verify all Edge Functions have JWT check at top
4. Verify RLS policies on all tables
5. Verify no PII sent to Anthropic API
6. Check for common OWASP mobile vulnerabilities
7. Verify auth tokens in expo-secure-store (not AsyncStorage)
8. Check HTTPS everywhere

**Done when:**
- [ ] check-env.sh passes
- [ ] No secrets in code or git history
- [ ] All Edge Functions JWT-protected
- [ ] RLS on all tables
- [ ] No PII to external APIs
- [ ] Auth in secure store
- [ ] HTTPS only

---

## T7 — SDK Data Audit (1h, cc — NEW)

**Owner:** cc (Claude)
**Estimate:** 1h

**Description:** Audit all third-party SDKs for App Store privacy label compliance.

**Steps:**
1. List all SDKs and what data they collect:
   - Supabase: auth tokens, user data (you control)
   - PostHog: analytics events (no PII)
   - Sentry: crash reports (device info, stack traces)
   - Expo: push tokens
2. Map to Apple's privacy categories
3. Document for App Store privacy label
4. Verify no unexpected data collection

**Done when:**
- [ ] All SDKs documented with data collection
- [ ] Mapped to Apple privacy categories
- [ ] No unexpected data collection
- [ ] Ready for App Store privacy label form

---

## T8 — IPv4 Grep (1h, cc — NEW)

**Owner:** cc (Claude)
**Estimate:** 1h

**Description:** Ensure no hardcoded IP addresses in the codebase.

**Steps:**
1. Grep for IPv4 pattern: `\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}`
2. Grep for `localhost`, `127.0.0.1`, `0.0.0.0`
3. Exclude legitimate test/dev references that are properly guarded
4. Fix any hardcoded IPs that should be config-driven

**Done when:**
- [ ] No hardcoded production IPs
- [ ] localhost references properly guarded behind `__DEV__`
- [ ] Documented findings

---

## T9 — Content Audit (2h, Daryll)

**Owner:** Daryll (manual)
**Estimate:** 2h

**Description:** Review all user-visible text for tone, accuracy, and compliance.

**Steps:**
1. Read through all strings in `strings.ts`
2. Verify no "Nook" references (all should be "Cornr")
3. Verify no "archetype" in any user-visible text
4. Check tone is consistent (friendly, direct, not patronising)
5. Check legal text (affiliate disclosure, AI consent)
6. Verify no placeholder text remaining

**Done when:**
- [ ] All text reviewed
- [ ] No "Nook" references
- [ ] No "archetype" in UI
- [ ] Tone consistent
- [ ] Legal text correct
- [ ] No placeholders

---

## T10 — App Store Metadata (2h, Daryll)

**Owner:** Daryll (manual)
**Estimate:** 2h

**Description:** Prepare App Store Connect listing.

**Steps:**
1. App name: "Cornr"
2. Subtitle (30 chars max)
3. Description (4000 chars max)
4. Keywords (100 chars max, comma-separated)
5. Screenshots (6.7" and 6.5" required, 5.5" optional)
6. Category: Lifestyle
7. Age rating questionnaire
8. Support URL
9. Privacy policy URL

**Done when:**
- [ ] All metadata fields filled
- [ ] Screenshots prepared
- [ ] Category set
- [ ] URLs live and accessible

---

## T11 — Privacy Policy + Terms of Service (3h, Daryll)

**Owner:** Daryll (manual/legal)
**Estimate:** 3h

**Description:** Legal documents required for App Store submission.

**Steps:**
1. Privacy Policy covering: data collected, how it's used, third parties (Supabase, PostHog, Sentry, Anthropic), user rights, GDPR compliance
2. Terms of Service: usage terms, disclaimers, liability limits
3. Host on a public URL
4. Link from app Settings and App Store listing

**Done when:**
- [ ] Privacy Policy published at public URL
- [ ] Terms of Service published at public URL
- [ ] Linked from app
- [ ] Linked in App Store listing
- [ ] GDPR-compliant

---

## T12 — TestFlight Build + Testing (2h, Daryll)

**Owner:** Daryll (manual)
**Estimate:** 2h

**Description:** Ship a TestFlight build and test the full flow.

**Steps:**
1. Run `eas build --platform ios --profile production`
2. Submit to TestFlight: `eas submit --platform ios`
3. Wait for Apple processing
4. Test full flow: welcome -> signup -> quiz -> result -> products -> trades -> profile -> delete
5. Test on multiple devices if possible
6. Document any issues found

**Done when:**
- [ ] TestFlight build available
- [ ] Full flow tested
- [ ] No blocking issues
- [ ] Issues documented in BUILD_LOG

---

## T13 — App Store Submission (1h, Daryll)

**Owner:** Daryll (manual)
**Estimate:** 1h

**Description:** Submit to App Store for review.

**Steps:**
1. Verify all metadata complete in App Store Connect
2. Select TestFlight build for submission
3. Answer export compliance (ITSAppUsesNonExemptEncryption = false)
4. Answer content rights
5. Submit for review
6. Monitor review status

**Done when:**
- [ ] App submitted for review
- [ ] Status: "Waiting for Review"

---

## T14 — Post-Launch Monitoring (ongoing, both)

**Owner:** Both
**Estimate:** Ongoing

**Description:** Monitor after App Store approval and release.

**Steps:**
1. Monitor Sentry for crash reports
2. Monitor PostHog for user flow analytics
3. Check Supabase for error rates
4. Respond to App Store reviews
5. Plan Sprint 7 based on user feedback

**Done when:**
- [ ] 48h post-launch with no critical crashes
- [ ] Analytics flowing correctly
- [ ] No emergency fixes needed
