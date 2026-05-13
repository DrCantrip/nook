# SIGNUP-PUBLIC-USERS-SYNC — Root-Cause Archaeology

Investigation C of the discipline-pack pre-commitment sequence. Read-only across repo and both databases. Branch `feat/reveal-1b-two-experience`, working tree clean (only the three untracked audit docs from today). All DB access was `SELECT`-only; the Supabase MCP / app client are both pointed at **staging** (`tleoqtldxjlyufixeukz`), so prod state below is taken from the 9 May LR-PROD-SYNC run log, not independently re-verified — see Open Questions.

## Executive summary

- **Original design:** there never was an `auth.users → public.users` INSERT path — not a trigger, not in the app. The original 16-March six-table schema gave `public.users.id` its own `gen_random_uuid()` default and no FK to `auth.users`; the app's `sign-up.tsx` (Sprint 1, 24 Mar) wrote nothing to `public.users`.
- **What went wrong:** on 7 Apr (`7c5bcd2`) a consent-flag write — `supabase.from("users").update({...opt_in flags}).eq("id", userId)` — was added *after* `auth.signUp()`. It silently matched **zero rows** because no `public.users` row had ever been created, and PostgREST `UPDATE` doesn't error on no-match. Consent flags (and the `consent_events` audit row, which FK-failed) were dropped on every fresh signup. Even now that the 5 May trigger creates the row, the same `UPDATE` still silently fails on the dominant path — after `auth.signUp()` with email confirmation enabled there is **no session**, so the request runs as the `anon` role, and `public.users` has *no anon-accessible RLS policy*.
- **Recommended fix scope: Option 2 — trigger-mirror with ADR.** Confidence **HIGH**. Option 1 (UPSERT) was already rejected by the 5 May panel and doesn't fix the no-session/RLS wall; Option 3 (no-op cleanup) is wrong because `useProfile.ts` reads those columns — deleting the write silently regresses the Profile consent toggles to permanently `false`.

---

## Evidence trail (chronological)

| When | Event | Source |
|---|---|---|
| ~16 Mar 2026 | Original six-table schema created (`users, style_profiles, rooms, products, wishlisted_products, places_cache`). `public.users.id UUID PRIMARY KEY DEFAULT gen_random_uuid()`, **no FK to `auth.users`**, **no INSERT/DELETE RLS policy**, no `handle_new_user` trigger. | trigger-migration comments; `pg_constraint` on staging shows `users_id_fkey` only added 5 May; `users.id` default *still* `gen_random_uuid()` today |
| 24 Mar (`8dca004`) | `app/(auth)/sign-up.tsx` first appears (Sprint 1 T5). `handleSignUp` calls `useAuth.signUp` and **writes nothing to `public.users`** — no INSERT, no UPDATE. | `git show 8dca004:'app/(auth)/sign-up.tsx'` — only `signUp`, `authError`; zero `users`-table refs |
| 26 Mar | `daryll.cowan@gmail.com` signs up via the app → `auth.users` row created, **no `public.users` row** (nothing creates one). Confirmed via email link 12s later. | `auth.users` row `cef01631-…`, `raw_user_meta_data` has the `sub`-shaped metadata of a normal `auth.signUp` |
| 7 Apr 09:24–09:26 | `test-a@cornr.test` (`0e675e05-…`) and `test-b@cornr.test` (`de7925d8-…`) created — confirmed within ~30–50 ms (admin/auto), minimal `{email_verified:true}` metadata, and **seeded with explicit `public.users` rows** (they later get `style_profiles` rows, which FK-require a `users` row). These are the permanent RLS fixtures; they were never affected by the bug. | `auth.users` timing + metadata shape; `style_profile_rows = 1` for both |
| 7 Apr 12:27 (`7c5bcd2`) | "marketing opt-in toggle wired to `email_marketing_opt_in` + `consent_events`" adds, after `await signUp(...)`: `supabase.from("users").update({ email_marketing_opt_in }).eq("id", userId)` plus `supabase.from("consent_events").insert({...})`, both inside a `try { … } catch (e) { console.warn("Failed to save marketing consent:", e) }`. **This is the bug's birth.** No comment explains the row-existence assumption. | `git log -S'from("users")' -- 'app/(auth)/sign-up.tsx'` → `7c5bcd2`; diff shows the added block |
| 7 Apr 14:23 (`6d8721d` / migration `20260407132012`) | Bridge-sprint data architecture: adds `users.audience_data_opt_in`, new tables, etc. Also adds **6 more lines to `sign-up.tsx`** wiring `audience_data_opt_in` into the same broken `update()` and a second `consent_events` row, and `recordEvent("signup_completed")`. Migration touches **no trigger, no FK on `users.id`**. | `git show 6d8721d --stat`; migration body has zero `trigger`/`auth.`/`FOREIGN KEY` on `users.id` |
| 7 Apr–4 May | `sign-up.tsx` migrated NativeWind→StyleSheet (`86664d6`), observability wired (`b01f145`), consent-split refined (`e6c3501`), `identified_only` PostHog (`7768c70`), motion gating (`bd08612`) — **the broken `from("users").update()` survives every refactor unchanged**. | `git log --follow -- 'app/(auth)/sign-up.tsx'` |
| 1 May 12:04 / 12:11 | Two more app signups: `daryll.cowan+audit04@gmail.com` (`625deb3c-…`, during SEC-AUDIT-04) and `daryll.cowan2026@gmail.com` (`d7c8dc1b-…`). Both `auth.users` rows created, **no `public.users` rows** (same bug). | `auth.users` rows + `sub`-shaped metadata |
| 5 May (`2c31abe` / migration `20260505140000`) | SIGNUP-PUBLIC-USERS-SYNC fix authored. Pre-flight investigation found **100% of app-created accounts missing their `public.users` row**. Migration: (1) add FK `users_id_fkey` `public.users.id → auth.users(id) ON DELETE CASCADE`; (2) `handle_new_user()` SECURITY DEFINER, `search_path=public,pg_temp`, `INSERT INTO public.users (id,email,created_at) VALUES (NEW.id,NEW.email,NEW.created_at)`; (3) `on_auth_user_created` AFTER INSERT trigger on `auth.users`; (4) backfill `INSERT … SELECT … FROM auth.users LEFT JOIN public.users WHERE p.id IS NULL ON CONFLICT (id) DO NOTHING` — backfilled **3 stranded staging accounts**. Migration comment records the **panel decision: trigger over UPSERT** ("keeps `public.users` INSERT a DB-level invariant, avoids needing a client-facing INSERT RLS policy … only the trigger should ever insert"). Applied to staging ~5 May (migration version `20260505151841`). **The broken `sign-up.tsx` `update()` was left in place.** | `supabase/migrations/20260505140000_create_handle_new_user_trigger.sql`; staging `pg_get_functiondef`/`pg_get_triggerdef`/`pg_get_constraintdef` match the file verbatim |
| 9 May (LR-PROD-SYNC) | The same six migrations applied to prod (`jsrscopoddxoluwaoyak`) via dashboard SQL editor. Prod was empty (0 `auth.users`) so the backfill was a no-op. Post-run verification: 6 migration rows matching staging, `on_auth_user_created` trigger present, `users_id_fkey` present, `public.users` 14 columns. Closes the prod side. | `docs/operations/prod-sync-packets.md` run log; `docs/operations/security.md` "LR-PROD-SYNC (RESOLVED, 9 May 2026)" |
| 9 May (today) | Repo audit flags that `sign-up.tsx` still does `from("users").update(...)`; this investigation follows up. | `docs/audits/repo-audit-2026-05-09.md` |

---

## 1. What does `sign-up.tsx` currently do w.r.t. `public.users`?

`app/(auth)/sign-up.tsx` → `handleSignUp()` (lines ~73–139):

1. `const { data, error: authError } = await signUp(email.trim(), password)` — `useAuth.signUp` is: `supabase.auth.updateUser({email,password})` if the current session is anonymous (anon-upgrade), else `supabase.auth.signUp({email,password})` (fresh signup). Neither passes any `options.data` / user metadata.
2. If `authError` → `setError(authError.message); return`.
3. `const userId = data?.user?.id` — populated for both paths (fresh `signUp` returns the user even when `session` is null pending email confirmation).
4. `await identify(userId)` (PostHog).
5. **The write**, inside an inner `try`:
   ```ts
   await Promise.resolve(
     supabase.from("users")
       .update({ email_marketing_opt_in: marketingOptIn, audience_data_opt_in: audienceDataOptIn })
       .eq("id", userId)
   );
   await Promise.resolve(
     supabase.from("consent_events").insert([
       { user_id: userId, event_type: "marketing_opt_in_at_signup", consent_given: marketingOptIn, consent_text: S.marketingOptIn },
       { user_id: userId, event_type: "audience_data_opt_in_at_signup", consent_given: audienceDataOptIn, consent_text: S.audienceDataOptIn },
     ])
   );
   capture("signup_completed", { marketing_opt_in, audience_data_opt_in });
   recordEvent(data?.user ?? null, "signup_completed", { ..., source: "sign_up_screen" });
   ```
   — **catch:** `} catch (e) { console.warn("Failed to save consent:", e); }`.
6. `setSuccess(S.checkEmail)` ("Check your email to continue.").

**Swallowed-exception inventory:**
- `supabase.from("users").update(...)` — the returned `{data,error}` is **never destructured or checked**. An `UPDATE` that matches 0 rows (no row, or RLS denial) returns success-with-empty-body, *no error at all*. Silent.
- `supabase.from("consent_events").insert([...])` — likewise, `{data,error}` **never checked**. A returned `error` (FK violation, RLS `WITH CHECK` failure) is just discarded. Silent.
- The `catch (e)` only fires for *thrown JS exceptions* (network failure, `Promise.resolve` rejection) — not for Supabase's `{error}` returns. So the `console.warn` essentially never fires for the DB-level failures. Doubly silent. (And `console.warn` here also bypasses `lib/log.ts` — a separate logging-discipline nit, pre-existing.)

No other `public.users` *write* exists in the app for the signup flow. Other `.from("users")` call sites (`useProfile.ts:83` read, `archetype-depth.tsx:68/104`, `reveal-essence.tsx:140/156`, `dev-result.tsx:108`, `generate-share-insight/index.ts:79`) are reads / unrelated updates, not signup-row creation.

## 2. Original design intent

There was no trigger-driven design and no app-side-INSERT design — there was simply **no design for creating `public.users` rows at all**. Evidence:
- The earliest `sign-up.tsx` (`8dca004`, 24 Mar) writes nothing to `public.users`.
- `git log -S'from("users")' -- 'app/(auth)/sign-up.tsx'` → the *only* commit that introduces it is `7c5bcd2` (7 Apr, "marketing opt-in toggle wired") — and it's an `.update()`, never an `.insert()` or `.upsert()`. So the row-creation gap was latent from 16 Mar and went unnoticed until a feature (consent flags) needed to *write to* a row that nothing ever created.
- `grep -rniE 'handle_new_user|on_auth_user_created|CREATE TRIGGER|AFTER INSERT ON auth'` across `supabase/` and `docs/` returns only the 5 May migration — there was never a prior trigger, in any branch or migration.
- The original schema gave `public.users.id` a `gen_random_uuid()` default (still present on staging today) — i.e. the schema author imagined `public.users` rows might be created independently of `auth.users`, which is the opposite of a sync design.
- There is **no comment anywhere** explaining why the write is an `.update()` — the `try/catch` `console.warn("Failed to save consent:")` is the only acknowledgement that it might fail, and it doesn't explain the row-existence assumption. The 5 May migration's own header is the first place the failure mode is written down.

So: the client-side write was **added later** (7 Apr, 2 weeks after the screen existed), for a specific feature (persisting consent), and it carried an unstated, false assumption that a `public.users` row already existed.

## 3. What the new `handle_new_user` trigger does

From staging (`pg_get_functiondef`/`pg_get_triggerdef`/`pg_get_constraintdef`), matching the migration file verbatim:
- `FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public','pg_temp'` — body: `INSERT INTO public.users (id, email, created_at) VALUES (NEW.id, NEW.email, NEW.created_at); RETURN NEW;` — a **bare INSERT, no `ON CONFLICT`** (it would *error* on a pre-existing id; safe because it only fires on a brand-new `auth.users` insert).
- `TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()` — runs synchronously inside the `auth.signUp()` transaction.
- FK `users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE`.
- **Columns it populates:** `id`, `email`, `created_at` only. It does **not** touch `email_marketing_opt_in`, `audience_data_opt_in`, `journey_stage`, `home_status`, or anything else (those stay at column defaults — `*_opt_in` default `false`).

**Overlap / conflict with `sign-up.tsx`:** no *column* overlap — the trigger writes id/email/created_at, the app writes the two `*_opt_in` flags. So they're nominally **complementary**: trigger creates the row, app updates the consent flags onto it. But complementary only works if the app's `UPDATE` actually lands — and it doesn't, on the main path (see Q6). The trigger fixes "row missing"; it does not fix "consent flags dropped", because the consent flags were never in the trigger's input (`raw_user_meta_data` for all 5 staging users lacks any opt-in key — `auth.signUp` is called with no `options.data`).

## 4. Trigger parity between staging and prod

- **Staging has the trigger** (and FK, and function) — verified live: `pg_trigger` row `on_auth_user_created` = 1; function/trigger/FK definitions match the migration file exactly; migration `20260505151841 create_handle_new_user_trigger` recorded.
- **Staging got it first (~5 May), prod got it 9 May.** The migration version stamp is `20260505151841` (= 5 May 15:18:41), recorded on staging then; the LR-PROD-SYNC run log dates the prod apply to 9 May.
- **Did the silent failure reach prod?** No — **prod had zero `auth.users` at investigation time** (5 May) and stayed empty until the trigger was applied (9 May); no real signup ever ran against prod without the trigger. The bug bit **staging only**, in the form of the 3 stranded accounts. (Per `docs/operations/security.md` and the trigger comment: prod was empty, so the prod-side risk was prospective, not realised.)
- **Why did the pattern *exist* on prod at all?** It didn't run there. The *code* (`sign-up.tsx` with the broken `update()`) ships in every build regardless of which Supabase project the build points at — and the app currently hardcodes `tleoqtldxjlyufixeukz` (staging) in `src/lib/supabase.ts`. So in practice every app signup to date has gone to staging.
- **Function definition match:** exact (the live `pg_get_functiondef` differs from the migration only in cosmetic formatting — `SET search_path TO 'public', 'pg_temp'` vs `SET search_path = public, pg_temp` — semantically identical). No drift between the migration file and staging. (Prod not re-checked here — MCP is staging-scoped — but the 9 May run log recorded "function exists with locked search_path" and "trigger present".)

**No stop-gate tripped:** nothing observed contradicts the reported prod state (six migrations, trigger present, FK present).

## 5. Affected-account state

5 staging `auth.users` rows; all 5 now have a `public.users` row (FK enforces it). Breakdown:

| id | email | auth created | public row | `email_marketing_opt_in` / `audience_data_opt_in` | `consent_events` rows | classification |
|---|---|---|---|---|---|---|
| `0e675e05-63de-46a0-bdfb-cb101268bf3f` | `test-a@cornr.test` | 2026-04-07 09:24 | yes (seeded) | false / false | 0 | permanent RLS fixture — **never affected** |
| `de7925d8-84f3-49f5-84b8-e6fe01543ef2` | `test-b@cornr.test` | 2026-04-07 09:26 | yes (seeded) | false / false | 0 | permanent RLS fixture — **never affected** |
| `cef01631-0e92-4911-8b15-b23a4c61a889` | `daryll.cowan@gmail.com` | 2026-03-26 12:04 | yes (**backfilled 5 May**) | false / false | 0 | **stranded → backfilled** (dev account) |
| `625deb3c-9c55-464a-b2e3-1ae4e9d649e5` | `daryll.cowan+audit04@gmail.com` | 2026-05-01 12:04 | yes (**backfilled 5 May**) | false / false | 0 | **stranded → backfilled** (SEC-AUDIT-04 test account) |
| `d7c8dc1b-c491-48b1-a073-b870a6aacc92` | `daryll.cowan2026@gmail.com` | 2026-05-01 12:11 | yes (**backfilled 5 May**) | false / false | 0 | **stranded → backfilled** (dev account) |

The "3 affected accounts" in the handover = the three `daryll.cowan*` accounts created via the app's sign-up flow before 5 May (identified by their `sub`-shaped `raw_user_meta_data` and the absence of a `style_profiles` row, vs the two `test-*` fixtures which were explicitly seeded). The migration's backfill restored `id/email/created_at` for them — but **only those three columns**: their `*_opt_in` flags are at default `false`, and they have **zero `consent_events` rows**. The actual consent choices made at those three signups are **unrecoverable** — they were never persisted to any table (the `update` matched 0 rows and the `consent_events` insert FK-failed, both silently).

**Recommended cleanup (informational — not for execution):** all three are dev/test accounts (`daryll.cowan*`), so the pragmatic answer is **none — accept the loss; treat `false` as the correct (GDPR-safe "not given") state**. There are no orphaned `auth.users` rows (every one has a `public.users` row; FK now prevents future orphans). If any of the three were a real user, the correct remediation would be to re-surface the consent prompt on next sign-in rather than guess — but none are. On prod: nothing to clean up (was empty; trigger landed before any signup).

## 6. Why did this fail silently?

Three stacked silent-failure mechanisms, in the order they bite:

1. **Naive `UPDATE` against a non-existent row (the original, pre-trigger failure).** `sign-up.tsx` does `supabase.from("users").update({...}).eq("id", userId)` immediately after `auth.signUp()`. Until 5 May, **nothing ever inserted a `public.users` row** — not the app, not a trigger. So the `UPDATE` matched zero rows. PostgREST/PostgreSQL treat a 0-row `UPDATE` as a success (200/204, empty body) — **no error is raised**. The consent flags evaporated on 100% of fresh app signups.

2. **Returned `{error}` never inspected (the `consent_events` side).** The follow-on `supabase.from("consent_events").insert([...])` *did* produce an error pre-trigger (FK `user_id → users(id)` violated, because the row didn't exist) — but the code does `await Promise.resolve(supabase.from("consent_events").insert([...]))` and **never reads the resolved `{data, error}`**. supabase-js returns DB errors in `error`, it doesn't throw — so the FK violation was discarded, not even reaching the `catch`.

3. **No-session-after-signup → `anon` role → RLS wall (the failure that *survives* the trigger).** Production signup uses email confirmation (`STRINGS.signUp.checkEmail = "Check your email to continue."`, and the staging dev account `daryll.cowan@gmail.com` shows a ~12 s gap between `created_at` and `email_confirmed_at` — a clicked link). After `auth.signUp()` with confirmation enabled, `data.session` is **null**; the supabase-js client therefore makes subsequent requests with only the anon key → PostgreSQL role `anon`. On `public.users` the **only RLS policies are `users_select_own` and `users_update_own`, both restricted to role `authenticated`** with `id = auth.uid()` — there is **no policy granting anything to `anon`, and no INSERT or DELETE policy at all** (deliberately, per the 5 May panel). So even *with* the trigger having created the row, the client's `UPDATE` runs as `anon`, matches zero rows under RLS, returns success-with-empty-body — **still silent, still dropped.** (The `consent_events` `INSERT` is the one part that now works post-trigger: its live policy is "Service role can insert consent events" with `WITH CHECK true` for role `public`, so once the FK is satisfied an anon insert succeeds — meaning the GDPR audit row lands but the denormalised `users.*_opt_in` columns, which `useProfile.ts` reads for the Profile screen, do not.)

The anon-upgrade path is the exception: an anonymous user has a live session, so the same `UPDATE` runs as `authenticated`, `id = auth.uid()` matches, and it works — which is exactly why the bug stayed invisible to anyone testing via "continue as guest → upgrade" rather than a cold email signup.

**The fix-scope decision turns on mechanism #3:** the failure is not "INSERT vs naive UPDATE semantics" (that was #1, and the trigger already addresses the row-existence half) — it's that **the client cannot reliably write `public.users` at signup time at all**, because at that moment it is unauthenticated. That rules out client-side writes (UPSERT included) as a complete fix.

---

## Recommended fix scope

### **Option 2 — trigger-mirror with ADR.** Confidence: **HIGH.**

Why not Option 1 (UPSERT swap): the 5 May panel **explicitly rejected UPSERT** ("trigger over UPSERT … only the trigger should ever insert … avoids needing a client-facing INSERT RLS policy"), and — decisively — an UPSERT from the client *still* runs as `anon` after an email-confirm signup and is *still* blocked by RLS (and would now also need an INSERT policy that the panel wants to keep absent). UPSERT fixes nothing real here and reverses a recorded decision.

Why not Option 3 (no-op with cleanup): the `update()` is not dead code — `src/hooks/useProfile.ts:83–151` reads `email_marketing_opt_in` / `audience_data_opt_in` from `public.users` and exposes them as `emailMarketingOptIn` / `audienceDataOptIn` (consumed by the Profile screen). Deleting the write without a replacement permanently pins those toggles to `false` for every email-confirm signup — a real, user-visible regression — and also drops the `signup_completed` consent recording. "Cleanup only" undersells a write that is *trying* to do something the product requires; it's just failing.

Why Option 2 is right: the only fix that actually closes mechanism #3 is to make the consent capture **server-side, in the same transaction as the `auth.users` insert** — i.e. extend the trigger path the 5 May panel already chose. That is a design change with downstream consequences (read-after-signup expectations, the anon-upgrade path, email-confirmation timing, GDPR consent recording, and where consent metadata briefly lives), so it warrants an ADR rather than a code-only patch. Estimated scope (~3–4 h) is consistent with: schema/trigger change + `sign-up.tsx` rewrite + `useAuth.signUp` signature change + RLS review + the ADR + staging verification.

**ADR title (suggested):** *"ADR-NNN — Signup-time consent capture is trigger/server-driven, not a post-`auth.signUp` client write"* (or, framed broader, *"…The `auth.users` ↔ `public.users` sync, including consent, is owned by `handle_new_user`"*).

**What the ADR would argue (one paragraph):** The `public.users` row, the denormalised consent flags (`email_marketing_opt_in`, `audience_data_opt_in`), and the GDPR `consent_events` audit row should all be written by `handle_new_user()` inside the `auth.users`-insert transaction — not by a follow-up request from `sign-up.tsx`. Concretely: `useAuth.signUp` passes the user's consent choices to `supabase.auth.signUp` as `options.data` (user metadata); `handle_new_user` reads `NEW.raw_user_meta_data` to populate the two `users` columns and `INSERT` the two `consent_events` rows; `sign-up.tsx` then carries *no* `public.users` / `consent_events` write and *no* swallowed-error scaffolding. This closes the no-session-after-signup gap (a client write post-`auth.signUp` runs as `anon` under email confirmation and is silently RLS-rejected), keeps `public.users` INSERT a DB-level invariant with no client-facing INSERT/DELETE policy (consistent with the 5 May panel), and removes the unchecked-`{error}` / `console.warn`-catch anti-pattern. The ADR must resolve three trade-offs: (a) **anon-upgrade** — `useAuth.signUp`'s anonymous branch calls `auth.updateUser`, which does **not** re-fire the AFTER-INSERT trigger, so anon-created `public.users` rows already carry a null/stale `email` (the trigger captured `NEW.email` when the anon row had none) and would not get the upgraded consent; this needs a companion `on_auth_user_updated` sync trigger (or an explicit server-side reconcile on upgrade), and the ADR should decide whether to also re-sync `email`; (b) **consent metadata exposure** — the choices live briefly in `auth.users.raw_user_meta_data`; this is the user's own consent (low sensitivity, not third-party PII), and the trigger can null it out after copying, but the ADR should state the position; (c) **read-after-signup** — Profile/`useProfile` expectations are *unaffected* because the row and flags exist by the time `auth.signUp` returns, but the ADR should note that the `users.id` `gen_random_uuid()` default is now vestigial-and-mildly-hazardous (a stray bare `INSERT` would get a random id that FK-fails) and recommend dropping it.

(Per instructions: the ADR itself and the fix code are **not** written here — only the recommendation and what the ADR would argue.)

---

## Affected accounts (informational)

| Account | id | State | Recommended cleanup |
|---|---|---|---|
| `daryll.cowan@gmail.com` | `cef01631-0e92-4911-8b15-b23a4c61a889` | `public.users` row backfilled 5 May (id/email/created_at); `*_opt_in` = `false` (default — original choices lost); 0 `consent_events`. Dev account. | None — accept; `false` is the GDPR-safe "not given" state. |
| `daryll.cowan+audit04@gmail.com` | `625deb3c-9c55-464a-b2e3-1ae4e9d649e5` | Same as above. SEC-AUDIT-04 test account. | None. |
| `daryll.cowan2026@gmail.com` | `d7c8dc1b-c491-48b1-a073-b870a6aacc92` | Same as above. Dev account. | None. |
| `test-a@cornr.test` / `test-b@cornr.test` | `0e675e05-…` / `de7925d8-…` | Permanent RLS fixtures, seeded with explicit rows — **never affected**. | Leave as-is (do not delete/seed — per CLAUDE.md). |
| (prod) | — | Prod was empty; trigger applied 9 May before any signup. No stranded rows. | None. |

No orphaned `auth.users` rows remain on staging; `users_id_fkey` now prevents future orphans on both environments.

## Open questions

1. **Prod state not independently re-verified.** The Supabase MCP and the app client are both pinned to staging (`tleoqtldxjlyufixeukz`); I could not run a `SELECT` against `jsrscopoddxoluwaoyak`. Prod's trigger/FK/migration state here rests on the 9 May LR-PROD-SYNC run log (`docs/operations/prod-sync-packets.md`). Nothing contradicts it, but a direct re-check is outstanding.
2. **`consent_events` INSERT policy drift.** The canonical SQL (`docs/CORNR_CANONICAL.md` Section 6) shows `consent_events` INSERT policy `WITH CHECK (auth.uid() = user_id OR user_id IS NULL)`, but the *live* staging policy is `"Service role can insert consent events"` `WITH CHECK true` for role `public`. When/why it was loosened isn't recorded in any migration in the repo — it's not in `20260407_add_consent_events_email_opt_in_rate_limit.sql`. Worth a separate look (and it affects whether the post-trigger `consent_events` insert in `sign-up.tsx` currently works as anon — it does, given the live policy, but that's a permissive policy the team may not have intended).
3. **Email-confirmation toggle history on staging.** `daryll.cowan2026@gmail.com` confirmed in ~37 ms (vs ~12–64 s for the other real signups) — suggesting email confirmations were toggled *off* on staging for some test runs. Whether prod will ship with confirmations on (the `checkEmail` copy implies yes) determines how often mechanism #3 bites in practice; not confirmable from the repo.
4. **Which 3 of the 5 were "stranded" — inferred, not recorded.** The 5 May migration says "3 staging accounts" without naming them; the attribution above (the three `daryll.cowan*` accounts) is inferred from `raw_user_meta_data` shape + absence of `style_profiles` rows + the two `test-*` fixtures being deliberately seeded. High confidence, but not from a written record.
5. **Does anything send marketing email off `users.email_marketing_opt_in`?** No code path was found that *consumes* the flag for sending (only `useProfile.ts` reads it for display). If a future/out-of-repo job keys marketing sends off that column, the silent-`false` bug has a direct consequence (opted-in users get no mail); if `consent_events` is the operative source, the impact is smaller. Couldn't determine.

---

## Closing

Report written to `docs/audits/signup-sync-archaeology-2026-05-09.md`.

**5-line summary of the most material findings:**
1. There was never an `auth.users → public.users` INSERT path — not a trigger, not in the app; the original 16-Mar schema gave `public.users.id` its own `gen_random_uuid()` default and no FK, and the Sprint-1 `sign-up.tsx` wrote nothing to `public.users`.
2. The bug was born 7 Apr (`7c5bcd2`): a `supabase.from("users").update({...consent flags}).eq("id", userId)` added *after* `auth.signUp()`, which silently matched **zero rows** (no row existed; PostgREST doesn't error on 0-row UPDATE), and a companion `consent_events.insert` whose returned `{error}` is never checked — consent dropped on 100% of fresh app signups; 3 staging dev accounts were stranded (now backfilled, but their consent choices are unrecoverable).
3. The 5 May `handle_new_user` trigger + `users_id_fkey` FK fix the *row-missing* half (staging since ~5 May, prod since 9 May, definitions verified to match on staging) — but the `sign-up.tsx` `update()` was left in, and it **still silently fails** on the dominant path: after an email-confirm `auth.signUp()` there is no session, so the request runs as the `anon` role, and `public.users` has only `authenticated`-role SELECT/UPDATE policies and no anon/INSERT/DELETE policy at all.
4. So it's not "naive UPDATE vs UPSERT" — the client genuinely cannot write `public.users` at signup time (it's unauthenticated then); the right fix is to move consent capture into the trigger (read `auth.signUp` user metadata), which is the direction the 5 May panel already chose ("only the trigger should ever insert").
5. **Recommended fix scope: Option 2 — trigger-mirror with ADR** (suggested title *"ADR-NNN — Signup-time consent capture is trigger/server-driven, not a post-`auth.signUp` client write"*). Confidence **HIGH**: Option 1 (UPSERT) was panel-rejected and doesn't beat the RLS/no-session wall; Option 3 (no-op cleanup) regresses the Profile consent toggles to permanently `false` because `useProfile.ts` reads those columns.
