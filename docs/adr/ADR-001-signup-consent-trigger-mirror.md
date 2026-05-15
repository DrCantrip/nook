# ADR-001 — Signup-time consent capture is trigger/server-driven, not a post-`auth.signUp` client write

**Status:** Accepted
**Date:** 2026-05-15
**Context:** SIGNUP-PUBLIC-USERS-SYNC fix

## Context

The Cornr signup flow captures two consent flags at signup time (`email_marketing_opt_in`, `audience_data_opt_in`). These flags are stored on `public.users` and govern downstream marketing and analytics consent.

Prior implementation: client-side `.update()` against `public.users` immediately after `supabase.auth.signUp()` succeeded. Under email-confirm mode, the `.update()` ran as `anon` (no session yet), hit RLS, and silently updated zero rows. Consent flags carried forward as their historical defaults — `false` for three stranded staging accounts.

Root-cause archaeology in `docs/audits/signup-sync-archaeology-2026-05-09.md` (Investigation C) established three stacked silent-failure mechanisms — the deepest of which (no-session-after-signup → `anon` role → RLS wall on `public.users`, which has only `authenticated`-role policies and no INSERT/DELETE policy) **survives** the row-existence fix landed on 5 May (`handle_new_user` trigger + `users_id_fkey`). I.e. even with the row guaranteed to exist by the trigger, the client `.update()` continues to silently drop consent on every fresh email-confirm signup. The fix has to move the consent write off the client.

## Decision

Consent flags propagate from client to `public.users` via:

1. **Client passes consent in signup metadata.** `supabase.auth.signUp({ options: { data: { email_marketing_opt_in, audience_data_opt_in } } })` — Supabase stores `options.data` into `auth.users.raw_user_meta_data` as documented.
2. **Trigger reads metadata, writes consent.** The existing `handle_new_user` SECURITY DEFINER trigger fires AFTER INSERT on `auth.users`. Its body is extended (`supabase/migrations/20260515120000_handle_new_user_consent_propagation.sql`) to read `NEW.raw_user_meta_data->>'email_marketing_opt_in'` and `…->>'audience_data_opt_in'`, cast each to `boolean`, `COALESCE` to `false` if absent, and include them in the same INSERT that already wrote `(id, email, created_at)`.
3. **No client-side `.update()` against `public.users` at signup time.** Removed from `app/(auth)/sign-up.tsx`. Replaced with a comment pointing at this ADR.

`useAuth.signUp` is extended to accept an optional `metadata?: Record<string, unknown>` third argument; both branches (fresh `auth.signUp` and anon `auth.updateUser`) forward it.

## Three concerns addressed

### 1. Anon-upgrade path

`useAuth.signUp`'s anonymous branch calls `supabase.auth.updateUser` (not `auth.signUp`). The AFTER INSERT trigger on `auth.users` does **not** fire on `updateUser` — only on the original anon-creation INSERT. So an anon-upgraded user's `public.users` row keeps the consent flags it had at anon creation time (which is `false`, because the anon flow has no consent form). This decision **does not solve** anon-upgrade consent capture. Two mitigations:

- **Currently latent:** `grep -rn "signInAnonymously"` across `app/` and `src/` returns zero hits — no anon sessions are created in the app today. The anon branch in `useAuth.signUp` is defensive code for a feature not yet shipped, so the gap window is zero-user.
- **Follow-up captured:** a companion `on_auth_user_updated` trigger (or an explicit authenticated reconcile-on-upgrade in `useAuth.signUp`'s anon branch, which now receives `metadata`) is the design fix when anon-first onboarding lands. Tracked alongside the existing ANON-PUBLIC-USERS-PATH backlog item.

### 2. Consent metadata propagation

`raw_user_meta_data` is Supabase's documented channel for arbitrary signup-time metadata, exposed to the client via `options.data` and to the database via the row column. Adding new consent flags in future requires (a) extending the trigger's projection (one new column + one new `COALESCE((NEW.raw_user_meta_data->>'key')::type, default)` line), (b) extending the client `options.data` payload (one new key) — same two-side change as before, but no more client-side write path.

Sensitivity: the consent values are the user's own choices about Cornr (marketing email yes/no, anonymised audience data yes/no), not third-party PII. They live briefly in `auth.users.raw_user_meta_data` (which is only visible to the user themselves and to `service_role`). The trigger could `UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data - 'email_marketing_opt_in' - 'audience_data_opt_in'` after copying — deliberately **not done** here, because (a) it adds DML overhead to every signup for negligible benefit, (b) `raw_user_meta_data` is access-controlled, (c) keeping the raw signup payload aids future auditability of what was captured.

### 3. Vestigial `gen_random_uuid()` default on `public.users.id`

`public.users.id` carries a `DEFAULT gen_random_uuid()` from the original 16 March schema. With the trigger-driven INSERT path, the trigger writes `NEW.id` (the auth UUID) explicitly — the default never fires for the trigger. Investigation C flagged this as candidate-for-removal (a stray bare `INSERT INTO public.users` outside the trigger would get a random id that would then FK-fail against `auth.users(id)` via `users_id_fkey`). Out of scope for this commit (the prompt forbids unrelated migration churn); flagged in canonical Section 6 already; will be dropped in a follow-up if a `public.users` schema migration lands for another reason.

## Consequences

- **Bug closes on staging.** Signup completes with consent flags correctly recorded in `public.users` from the first INSERT, via the trigger, not via a separate UPDATE. The trigger was applied to staging in this commit (`supabase/migrations/20260515120000_handle_new_user_consent_propagation.sql`).
- **Prod fix is queued, not landed.** Production `jsrscopoddxoluwaoyak` still has the original 5 May trigger body that writes only `(id, email, created_at)`. The gap window on prod is **zero user** (TestFlight not yet open). Prod migration must run via the LR-PROD-SYNC packet pattern before TestFlight signups begin — captured as a follow-up dispatch.
- **Historical three stranded staging accounts retain `email_marketing_opt_in = false`.** Not backfilled (test accounts; the choices were never recorded anywhere recoverable). Documented in Investigation C §5.
- **`useAuth.signUp` signature is now `(email, password, metadata?)`.** Backward compatible — existing call sites without `metadata` get original behaviour. Only call site in the repo is `app/(auth)/sign-up.tsx`.
- **`consent_events` insert in `sign-up.tsx` is preserved.** It's the GDPR-demonstrable-consent audit trail and lives on a different code path (a separate INSERT, runs as anon, succeeds because of the live-policy permissive `WITH CHECK true` documented as RLS-DRIFT-CONSENT-EVENTS in canonical Section 6). This ADR does **not** change `consent_events` policy or write path. CONSENT-SOURCE-OF-TRUTH-LOCK (MC-PATCH-7) is the next gating concern before any marketing send path: `consent_events`, not `public.users.*_opt_in` columns, is the system of record for time-series consent state.
- **In-memory hook persistence noted.** During this implementation, the 2026-05-13 stderr-surfacing probe hook continued to fire on every Edit despite `.claude/settings.local.json` being byte-exact-reverted at the end of that probe task. The hook config is loaded into CC at the moment of file change but does not unload on subsequent file revert within the same session — i.e. hot-reload is one-way. Not a concern for this fix (PostToolUse exit 2 surfaces a system-reminder but does not roll back the underlying tool action — confirmed by the probe and re-confirmed here as every Edit landed correctly), but worth folding into the broader Phase 1 hook design.

## Alternatives considered

**Option 1 — UPSERT swap from client.** Keep the client write but make it idempotent. Rejected: still runs as `anon` after `auth.signUp` under email-confirm, still RLS-blocked. Doesn't fix the actual failure mode. Also requires an INSERT policy on `public.users` that the 5 May panel explicitly decided to keep absent ("only the trigger should ever insert"). Already documented as panel-rejected in `supabase/migrations/20260505140000_create_handle_new_user_trigger.sql`.

**Option 3 — Post-confirmation reconcile in app.** Stash consent in local storage at signup form submit; subscribe to `onAuthStateChange`; on first authenticated session, call `public.users.update` with the stashed values. Rejected: adds app-side complexity (form state has to survive an email round-trip and possibly an app restart), introduces a window where the row exists with default `false` flags before the reconcile fires (downstream reads during that window see wrong values), and is a workaround for a problem the trigger pattern already solves cleanly.

**Option 4 — Edge Function intermediary.** Client calls a custom Edge Function with signup payload + consent; the function uses `service_role` to call `auth.admin.createUser` and `public.users.insert`. Rejected: adds infrastructure for what Supabase's `options.data` + trigger pattern handles natively, adds attack surface (an internet-exposed signup endpoint), and centralises a write path that's currently distributed across well-understood Postgres mechanisms.

## References

- `docs/audits/signup-sync-archaeology-2026-05-09.md` (Investigation C — root cause + fix recommendation)
- `supabase/migrations/20260505140000_create_handle_new_user_trigger.sql` (original trigger landing; documents panel decision "trigger over UPSERT")
- `supabase/migrations/20260515120000_handle_new_user_consent_propagation.sql` (this commit — trigger body extension for consent propagation)
- `app/(auth)/sign-up.tsx` (this commit — `.update()` removed, `options.data` populated, task-scoped log line added per R-26)
- `src/hooks/useAuth.ts` (this commit — `signUp` extended with optional `metadata`)
- LR-PROD-SYNC closure 9 May 2026 (`docs/operations/security.md`) — confirms original trigger live on prod
- CONSENT-SOURCE-OF-TRUTH-LOCK (MC-PATCH-7, `docs/operations/mc-patches-2026-05-12.md`) — downstream marketing-data trust surface, separate from this fix
