# Cornr — Sprint 5: Notifications + Account Management

**Goal:** Push notifications, account lifecycle (delete account, welcome email, password reset email).

---

## T1 — Push Notification Permission (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Request push notification permission and store the token.

**Steps:**
1. Install `expo-notifications`
2. Create `src/lib/notifications.ts`
3. Request permission on first launch (after onboarding complete)
4. Store push token in Supabase `profiles.push_token`
5. Handle permission denied gracefully (no nagging)
6. Register for remote notifications

**Done when:**
- [ ] Permission requested at appropriate time
- [ ] Token stored in Supabase
- [ ] Denied permission handled gracefully
- [ ] No repeated permission prompts
- [ ] `npx tsc --noEmit` passes

---

## T2 — Schema Migration for Notifications (1h, cc)

**Owner:** cc (Claude)
**Estimate:** 1h

**Description:** Add notification tracking tables.

**Steps:**
1. Create migration:
   - `notifications` table (id, user_id, type, title, body, data, read, created_at)
   - Add `push_token` column to `profiles` if not exists
2. RLS: users read/write own notifications only
3. Run on staging first

**Done when:**
- [ ] Migration applied to staging
- [ ] Migration applied to production
- [ ] RLS policies correct
- [ ] `npx tsc --noEmit` passes

---

## T3 — Notification Edge Functions x4 (4h, cc)

**Owner:** cc (Claude)
**Estimate:** 4h

**Description:** Four Edge Functions for different notification types.

**Steps:**
1. `send-welcome-notification` — triggered after signup + onboarding complete
2. `send-recommendation-notification` — when new product recommendations are ready
3. `send-weekly-digest` — weekly summary of new recommendations (pg_cron scheduled)
4. `send-custom-notification` — admin-triggered (future use)
5. All functions:
   - JWT verified at top
   - Use Expo push notification service
   - Store notification in `notifications` table
   - Handle invalid/expired tokens gracefully

**Done when:**
- [ ] 4 Edge Functions exist
- [ ] JWT verified in each
- [ ] Notifications stored in DB
- [ ] Invalid tokens handled
- [ ] Tested on staging

---

## T4 — Delete Account (3h, cc)

**Owner:** cc (Claude)
**Estimate:** 3h

**Description:** Apple requires account deletion. Implement full account deletion flow.

**Steps:**
1. Add "Delete account" to Profile screen
2. Confirmation modal: "This will permanently delete your account and all data. This cannot be undone."
3. Require password re-entry for confirmation
4. Create Edge Function `delete-account`:
   - JWT verified
   - Delete all user data: rooms, recommendations, wishlists, notifications
   - Delete Supabase auth user
   - Revoke all sessions
5. On success: navigate to welcome screen, clear local state
6. All strings from `strings.ts`

**Done when:**
- [ ] Delete button on Profile
- [ ] Confirmation modal with warning
- [ ] Password re-entry required
- [ ] Edge Function deletes all user data
- [ ] Auth user deleted
- [ ] Sessions revoked
- [ ] Local state cleared
- [ ] Navigates to welcome screen
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T5 — Welcome Email + Password Reset Email (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Configure Supabase email templates for welcome and password reset.

**Steps:**
1. Customize Supabase Auth email templates:
   - Welcome email: branded with Cornr, warm tone
   - Password reset: clear instructions, branded
2. Use Cornr branding (not Nook)
3. Test both flows on staging
4. Verify reset link works end-to-end

**Done when:**
- [ ] Welcome email sends on signup
- [ ] Password reset email sends
- [ ] Both branded as Cornr
- [ ] Reset link works end-to-end
- [ ] Tested on staging
