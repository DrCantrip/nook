# Prod Supabase Sync Packets

Generated: 8 May 2026
Target: jsrscopoddxoluwaoyak (nook-production)
Source: feat/reveal-1b-two-experience @ 1f289e7

Six paste-ready SQL packets that bring prod from its original 16 March
6-table schema up to staging parity. Each packet is `BEGIN;`/`COMMIT;`-wrapped
and ends with an `INSERT` into `supabase_migrations.schema_migrations` using
staging's exact `version` values, so prod's migrations table becomes a
faithful copy of staging.

Apply via dashboard SQL Editor (Database → SQL Editor → New query).
Run each packet as a single execution. Do not interleave packets. Run the
post-COMMIT verification query immediately after each packet to confirm the
row was recorded before moving on.

---

## Pre-flight (run BEFORE Packet 1)

Take a manual backup via Supabase dashboard:
**Database → Backups → "Create a manual backup"**
Wait for completion. Note the backup timestamp — you will need it if
rollback is required.

Confirm row counts are zero across all six original tables:

```sql
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL SELECT 'style_profiles', COUNT(*) FROM style_profiles
UNION ALL SELECT 'rooms', COUNT(*) FROM rooms
UNION ALL SELECT 'products', COUNT(*) FROM products
UNION ALL SELECT 'wishlisted_products', COUNT(*) FROM wishlisted_products
UNION ALL SELECT 'places_cache', COUNT(*) FROM places_cache;
```

Confirm `auth.users` is empty:

```sql
SELECT COUNT(*) FROM auth.users;
```

All counts must be `0` before proceeding. **Stop if any is non-zero** —
prod has unexpected state and the migration plan needs revisiting.

---

## Packet 1 — Bootstrap migrations table + Migration 1

Bootstraps `supabase_migrations.schema_migrations` (does not exist on prod —
it is auto-created by the Supabase CLI but we are not using the CLI for
this) and applies the consent_events / email opt-in / rate limit migration.

```sql
BEGIN;

-- Bootstrap migrations table (does not exist on prod)
CREATE SCHEMA IF NOT EXISTS supabase_migrations;
CREATE TABLE IF NOT EXISTS supabase_migrations.schema_migrations (
  version text NOT NULL PRIMARY KEY,
  statements text[],
  name text,
  created_by text,
  idempotency_key text,
  rollback text[]
);

-- Migration: add_consent_events_email_opt_in_rate_limit
-- Applied: 2026-04-07 via Supabase MCP
-- Branch: feature/april-update-a-schema

-- 1. Email marketing opt-in column
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_marketing_opt_in BOOLEAN DEFAULT false;

-- 2. Consent events table for GDPR demonstrable consent
CREATE TABLE IF NOT EXISTS consent_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own consent events"
  ON consent_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert consent events"
  ON consent_events FOR INSERT
  WITH CHECK (true);

-- 3. Rate limit: 50 calls/day for registered users
ALTER TABLE users ALTER COLUMN daily_call_count SET DEFAULT 0;
COMMENT ON COLUMN users.daily_call_count IS 'Rate limit: 50 calls/day for registered users. Reset by pg_cron at midnight UTC.';

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260407092946', 'add_consent_events_email_opt_in_rate_limit');

COMMIT;
```

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 1 row, version = 20260407092946
```

---

## Packet 2 — Migration 2

Bridge sprint data architecture: audience-data opt-in, editorial_content,
archetype_history, engagement_events, room context fields, wishlist
soft-delete, pg_cron retention jobs.

```sql
BEGIN;

-- Bridge Sprint: data architecture foundation
-- Reference: CORNR_CANONICAL.md Sections 4, 6

-- 1. Consent split: audience data opt-in
ALTER TABLE users ADD COLUMN IF NOT EXISTS audience_data_opt_in BOOLEAN DEFAULT false;

-- 2. Editorial content table
CREATE TABLE IF NOT EXISTS editorial_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  headline TEXT NOT NULL,
  body_text TEXT,
  image_url TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  archetype_filter VARCHAR(50),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);
ALTER TABLE editorial_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "editorial_content_read" ON editorial_content
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND published_at <= now()
    AND (expires_at IS NULL OR expires_at > now())
  );

-- 3. Archetype history (longitudinal)
CREATE TABLE IF NOT EXISTS archetype_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  primary_archetype VARCHAR(50) NOT NULL,
  secondary_archetype VARCHAR(50),
  swipe_scores JSONB NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('initial','retake','admin')),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE archetype_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "archetype_history_select_own" ON archetype_history
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "archetype_history_insert_own" ON archetype_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Engagement events (first-party event log)
CREATE TABLE IF NOT EXISTS engagement_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '18 months'),
  model_version VARCHAR(50)
);
ALTER TABLE engagement_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "engagement_events_select_own" ON engagement_events
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "engagement_events_insert_own_or_anon" ON engagement_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE INDEX IF NOT EXISTS engagement_events_user_occurred
  ON engagement_events(user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS engagement_events_type_occurred
  ON engagement_events(event_type, occurred_at DESC);

-- 5. Room context fields
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_aspirational BOOLEAN DEFAULT false;
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS occupancy_status VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS room_stage VARCHAR(20);
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS existing_categories TEXT[];
ALTER TABLE rooms ALTER COLUMN display_name DROP NOT NULL;
ALTER TABLE rooms ALTER COLUMN room_analysis DROP NOT NULL;

-- 6. Wishlist soft-delete + active partial index
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS removed_at TIMESTAMPTZ;
ALTER TABLE wishlisted_products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
CREATE INDEX IF NOT EXISTS wishlisted_products_active
  ON wishlisted_products(user_id, room_id)
  WHERE removed_at IS NULL;

-- 7. pg_cron retention job (engagement events past 18 months)
SELECT cron.schedule(
  'purge-engagement-events',
  '0 2 * * *',
  $$DELETE FROM engagement_events WHERE retention_until < NOW();$$
);

-- 8. Update existing anonymous-session purge to also clear anon engagement events
-- (folds anon engagement event cleanup into the existing hourly anon purge)
SELECT cron.unschedule('purge-anonymous-sessions');
SELECT cron.schedule(
  'purge-anonymous-sessions',
  '0 * * * *',
  $$
  DELETE FROM style_profiles WHERE is_anonymous = true AND created_at < NOW() - INTERVAL '24 hours';
  DELETE FROM engagement_events WHERE user_id IS NULL AND occurred_at < NOW() - INTERVAL '24 hours';
  $$
);

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260407132051', 'bridge_sprint_data_architecture');

COMMIT;
```

> **pg_cron prerequisite:** Packet 2 calls `cron.schedule` and
> `cron.unschedule`. The `pg_cron` extension must be enabled on prod
> (Database → Extensions → enable `pg_cron`). It is enabled on staging.
> The `cron.unschedule('purge-anonymous-sessions')` line will error if no
> such job exists on prod yet — if so, comment it out and re-run the
> packet, then add the new schedule. Confirm via `SELECT * FROM
> cron.job;` before applying this packet.

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 2 rows, latest version = 20260407132051
```

---

## Packet 3 — Migration 3

S2-T3B: 7-dim L2-normalised archetype score vector + archetype version
logging on engagement_events.

```sql
BEGIN;

-- S2-T3B: full 7-dim L2-normalised archetype score vector + rewrite-loop version logging
-- Reference: CORNR_CANONICAL.md Section 6 (schema), Section 13 (archetype description rewrite loop)

-- 13 April 2026: full 7-dim L2-normalised archetype score vector for blended-identity reveal generation
ALTER TABLE archetype_history ADD COLUMN IF NOT EXISTS archetype_scores JSONB NOT NULL DEFAULT '{}'::jsonb;
COMMENT ON COLUMN archetype_history.archetype_scores IS 'L2-normalised 7-dim score vector keyed by archetypeId. Sums to ~1.0. Consumed by S2-T4-INSIGHT Edge Function for blended reveal composition. Format: {"curator": 0.42, "nester": 0.08, ...}';

-- 13 April 2026: archetype version logging for description rewrite loop (canonical Section 13)
ALTER TABLE engagement_events ADD COLUMN IF NOT EXISTS archetype_version INTEGER;
COMMENT ON COLUMN engagement_events.archetype_version IS 'Logs which archetype description version was active when this event fired. Enables A/B comparison of archetype description rewrites against baseline metrics per canonical Section 13 rewrite loop standing rule.';
CREATE INDEX IF NOT EXISTS engagement_events_archetype_version ON engagement_events(archetype_version, event_type, occurred_at DESC) WHERE archetype_version IS NOT NULL;

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260414083047', 's2_t3b_archetype_scores_and_version_logging');

COMMIT;
```

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 3 rows, latest version = 20260414083047
```

---

## Packet 4 — Migration 4

REVEAL-1B two-experience reveal state: timestamps on users
(`reveal_completed_at`, `depth_first_seen_at`) and `reveal_version`
on archetype_history.

```sql
BEGIN;

-- REVEAL-1B: two-experience reveal state (timestamps, not booleans)
-- Reference: docs/CORNR_CANONICAL.md Section 0 (20 April evening entry,
-- two-experience architecture), Section 7 (Sprint 2 T4 revised), REVEAL-1B spec
-- locked via 19-voice end-to-end panel on 21 April 2026.

ALTER TABLE users
ADD COLUMN IF NOT EXISTS reveal_completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS depth_first_seen_at TIMESTAMPTZ;

COMMENT ON COLUMN users.reveal_completed_at IS 'Timestamp of first successful completion of the two-experience reveal (screen 1 mount). NULL until set. Set once; not updated on return visits. Cascades with user row on account deletion.';
COMMENT ON COLUMN users.depth_first_seen_at IS 'Timestamp of first open of archetype depth view from Profile tab. NULL until set. Set once; used for re-encounter analytics (seconds_since_first_visit in reveal_depth_visited event).';

-- Cohort version on completion records for legacy-vs-new-reveal analytics.
-- Version 1 = legacy 4-panel tap-through reveal (pre-REVEAL-1B).
-- Version 2 = two-experience reveal (this build).
-- Staging has zero archetype_history rows today, so DEFAULT 2 is correct here.
-- Production migration must backfill existing rows to version 1 before this
-- DEFAULT applies. See LR-PROD-SYNC follow-up.
ALTER TABLE archetype_history
ADD COLUMN IF NOT EXISTS reveal_version INTEGER NOT NULL DEFAULT 2;

COMMENT ON COLUMN archetype_history.reveal_version IS 'Reveal surface version active when this archetype was assigned. 1 = legacy 4-panel, 2 = two-experience (REVEAL-1B). Enables A/B comparison of reveal surfaces against retention, share rate, depth-view rate.';

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260421144344', '20260421000000_reveal_1b_timestamps');

COMMIT;
```

> **Backfill note:** The migration's own comments mention that production
> "must backfill existing rows to version 1 before this DEFAULT applies."
> The pre-flight confirmed `archetype_history` is empty on prod (alongside
> all six original tables — and `archetype_history` did not exist on prod
> until Packet 2), so no backfill is needed here. The `DEFAULT 2` applies
> only to future rows, which is correct.

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 4 rows, latest version = 20260421144344
```

---

## Packet 5 — Migration 5

Adds `journey_stage`, `home_status`, `created_at` to `public.users` plus
two partial indexes.

```sql
BEGIN;

-- Adds three columns to public.users that the useProfile hook (REVEAL-1B) requires.
-- The hook was written against a schema that didn't yet include these columns.
-- This migration corrects the inconsistency.
--
-- journey_stage: 5-value enum mirroring src/lib/journey-stage-mapping.ts canonical values.
-- home_status: 3-value enum from src/hooks/useProfile.ts.
-- created_at: provisioning timestamp, backfilled from auth.users.created_at.
--
-- Indexes: partial indexes on the two enum columns enable cohort segmentation
-- analytics (journey_stage funnels, home_status by archetype) without overhead
-- on rows where the column is NULL.
--
-- Production migration (LR-PROD-SYNC) will need staged 3-step pattern for created_at:
--   1. ADD COLUMN created_at TIMESTAMPTZ NULL (nullable)
--   2. UPDATE public.users SET created_at = auth.users.created_at FROM auth.users WHERE public.users.id = auth.users.id
--   3. ALTER COLUMN created_at SET NOT NULL DEFAULT now()
-- Staging is safe to do all three in one migration because zero existing real users.
--
-- ROLLBACK: ALTER TABLE public.users DROP COLUMN IF EXISTS journey_stage,
--                                    DROP COLUMN IF EXISTS home_status,
--                                    DROP COLUMN IF EXISTS created_at;
--          DROP INDEX IF EXISTS idx_users_journey_stage;
--          DROP INDEX IF EXISTS idx_users_home_status;
--
-- Note: auth.users join requires service_role (RLS prevents authenticated role
-- from reading auth schema). Backfill is therefore migration-time only, not
-- runtime application logic.

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS journey_stage VARCHAR
    CHECK (journey_stage IS NULL OR journey_stage IN ('pre_purchase', 'new_0_3', 'settled_3_12', 'established', 'renting')),
  ADD COLUMN IF NOT EXISTS home_status VARCHAR
    CHECK (home_status IS NULL OR home_status IN ('first_time', 'experienced', 'renter')),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

-- Backfill created_at from auth.users.created_at for any existing rows.
UPDATE public.users
SET created_at = auth.users.created_at
FROM auth.users
WHERE public.users.id = auth.users.id
  AND public.users.created_at IS NULL;

-- Now safe to set NOT NULL + default.
ALTER TABLE public.users
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now();

-- Partial indexes for analytics segmentation.
CREATE INDEX IF NOT EXISTS idx_users_journey_stage ON public.users(journey_stage) WHERE journey_stage IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_home_status ON public.users(home_status) WHERE home_status IS NOT NULL;

COMMENT ON COLUMN public.users.journey_stage IS 'Where the user is in the buying / settling journey. 5-value enum mirroring src/lib/journey-stage-mapping.ts canonical values. NULL until user populates via onboarding (ONBOARDING-01 follow-up).';
COMMENT ON COLUMN public.users.home_status IS 'Buyer category. 3-value enum from src/hooks/useProfile.ts. NULL until user populates via onboarding. Note: ''renter'' value present pending positioning clarification.';
COMMENT ON COLUMN public.users.created_at IS 'User row creation timestamp. Backfilled from auth.users.created_at on staging. Production: must follow 3-step nullable->backfill->NOT NULL pattern.';

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260424133116', '20260424130000_users_journey_home_status_member');

COMMIT;
```

> **Production single-transaction safety:** The migration's preamble
> warns that production "needs staged 3-step pattern" for `created_at`,
> based on the assumption prod might have rows. Pre-flight confirmed
> `public.users` is empty on prod (0 rows). The single-transaction
> all-three-steps form (matching staging exactly) is therefore safe and
> required to keep prod's schema_migrations row identical to staging's.
> Do NOT split this packet.

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 5 rows, latest version = 20260424133116
```

---

## Packet 6 — Migration 6

`handle_new_user` trigger + FK + backfill. Closes SIGNUP-PUBLIC-USERS-SYNC
on the prod side. Without this, every TestFlight signup would silently
fail to create a `public.users` row.

> **Nested-transaction note:** This migration's source file already
> contains its own `BEGIN;` … `COMMIT;` block. Pasting verbatim inside
> the outer wrapper produces two harmless Postgres warnings:
> - inner `BEGIN` issues `WARNING: there is already a transaction in progress`
>   and is a no-op (the outer transaction stays active)
> - outer `COMMIT` issues `WARNING: there is no transaction in progress`
>   because the inner `COMMIT` already closed it
>
> Net effect: the migration SQL and the `INSERT` into `schema_migrations`
> all execute, and they are atomic with respect to the inner BEGIN/COMMIT
> (which is what matters). The outer `BEGIN`/`COMMIT` is structural only.
> If you prefer a clean run with no warnings, delete the lines marked
> `-- (inner) BEGIN;` and `-- (inner) COMMIT;` below before pasting.

```sql
BEGIN;

-- SIGNUP-PUBLIC-USERS-SYNC — handle_new_user trigger + FK + backfill
-- Date: 5 May 2026
--
-- WHAT:
--   1. Add FK constraint public.users.id → auth.users(id) ON DELETE CASCADE.
--      This relationship was assumed by the entire app since schema creation
--      but never enforced at the database level — public.users.id had its
--      own gen_random_uuid() default and could drift from auth.uid().
--   2. Create handle_new_user() — SECURITY DEFINER function that inserts a
--      public.users row from NEW (id, email, created_at) on every auth.users
--      insert. search_path is locked to (public, pg_temp) per Postgres
--      SECURITY DEFINER best practice (search_path injection guard).
--   3. Create the AFTER INSERT trigger on auth.users.
--   4. Backfill the 3 staging accounts that were stranded (created via the
--      app's broken sign-up flow before the trigger existed). Production was
--      empty at investigation, so this INSERT-FROM-SELECT is a no-op there.
--
-- WHY:
--   Pre-flight investigation (5 May 2026) found 100% of accounts created via
--   the app's sign-up flow were missing their public.users row. Sign-up.tsx
--   does `.from("users").update(...)` after auth.signUp(), which silently
--   matches zero rows because the row doesn't exist yet — Supabase's UPDATE
--   does not error on no-match. Consent flags (email_marketing_opt_in,
--   audience_data_opt_in) were being silently dropped on every signup.
--
-- PANEL DECISION (2026-05-05): trigger over UPSERT. Rationale: keeps
-- public.users INSERT a DB-level invariant, avoids needing a client-facing
-- INSERT RLS policy (no INSERT or DELETE policy exists today and we want
-- to keep it that way — only the trigger should ever insert), and the
-- trigger is the single source of truth for the auth↔public sync.
--
-- PRODUCTION NOTE: Production project (jsrscopoddxoluwaoyak) was empty
-- at investigation time (0 auth.users, 0 public.users, 0 triggers). This
-- migration is mandatory before any TestFlight user signs up. Deployment
-- gated by LR-PROD-SYNC.
--
-- ROLLBACK:
--   BEGIN;
--   DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--   DROP FUNCTION IF EXISTS public.handle_new_user();
--   ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;
--   COMMIT;
--   (Backfilled rows are intentionally left in place by rollback.)

-- (inner) BEGIN;

-- 1. FK constraint connecting public.users.id to auth.users(id).
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. handle_new_user — SECURITY DEFINER function with locked search_path.
CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$;

-- 3. AFTER INSERT trigger on auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Backfill auth users without a matching public row. Preserves original
-- created_at from auth.users (the source of truth). ON CONFLICT (id) DO
-- NOTHING is purely defensive — the LEFT JOIN should already exclude any
-- existing rows.
INSERT INTO public.users (id, email, created_at)
SELECT a.id, a.email, a.created_at
FROM auth.users a
LEFT JOIN public.users p ON p.id = a.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- (inner) COMMIT;

-- Record migration as applied
INSERT INTO supabase_migrations.schema_migrations (version, name)
VALUES ('20260505151841', 'create_handle_new_user_trigger');

COMMIT;
```

Verification (run separately AFTER COMMIT):

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect: 6 rows, latest version = 20260505151841
```

---

## Verification (run AFTER Packet 6)

Confirm all six migrations applied, in the same order and with the same
version values as staging:

```sql
SELECT version, name FROM supabase_migrations.schema_migrations ORDER BY version;
-- Expect 6 rows matching staging exactly:
--   20260407092946  add_consent_events_email_opt_in_rate_limit
--   20260407132051  bridge_sprint_data_architecture
--   20260414083047  s2_t3b_archetype_scores_and_version_logging
--   20260421144344  20260421000000_reveal_1b_timestamps
--   20260424133116  20260424130000_users_journey_home_status_member
--   20260505151841  create_handle_new_user_trigger
```

Confirm new tables exist:

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' ORDER BY table_name;
-- Expect (compared to original 6): users, style_profiles, rooms,
-- products, wishlisted_products, places_cache, plus consent_events,
-- editorial_content, archetype_history, engagement_events.
```

Confirm new columns on `users`:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
-- Expect to include: email_marketing_opt_in, audience_data_opt_in,
-- reveal_completed_at, depth_first_seen_at, journey_stage, home_status,
-- created_at, plus original columns.
```

Confirm new columns on `archetype_history`:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'archetype_history'
ORDER BY ordinal_position;
-- Expect to include: archetype_scores, reveal_version.
```

Confirm trigger exists on `auth.users`:

```sql
SELECT trigger_name FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';
-- Expect: on_auth_user_created trigger present.
```

Confirm `handle_new_user` function exists with locked search_path:

```sql
SELECT proname, prosecdef, proconfig
FROM pg_proc
WHERE proname = 'handle_new_user' AND pronamespace = 'public'::regnamespace;
-- Expect: prosecdef = true, proconfig contains 'search_path=public, pg_temp'.
```

Confirm FK on `public.users.id`:

```sql
SELECT conname, confrelid::regclass AS references
FROM pg_constraint
WHERE conrelid = 'public.users'::regclass AND contype = 'f';
-- Expect: users_id_fkey references auth.users.
```

Confirm pg_cron jobs:

```sql
SELECT jobname, schedule FROM cron.job ORDER BY jobname;
-- Expect: purge-anonymous-sessions (hourly), purge-engagement-events (daily 02:00).
```

---

## Rollback procedure

If any packet fails:

1. **STOP.** Do not proceed to the next packet.
2. The failed packet's `BEGIN`/`COMMIT` will have rolled back its own SQL
   automatically — the failed packet's changes are not persisted.
3. The CUMULATIVE state is now: previous packets committed, current packet
   rolled back. Prod is in a partial-migration state.
4. **Restore from manual backup taken in pre-flight.**
   Database → Backups → restore from the manual backup timestamp recorded
   in pre-flight.
5. Debug the failed migration on staging.
6. Re-prepare packets and re-run from Packet 1.
7. **DO NOT fix-forward on prod.** A partial migration state is harder to
   reason about than a clean restore.

For Packet 1 specifically: if the bootstrap of `supabase_migrations.schema_migrations`
fails, the rollback is the same — restore from backup. The `CREATE SCHEMA
IF NOT EXISTS` and `CREATE TABLE IF NOT EXISTS` are idempotent, so re-running
Packet 1 after fixing the underlying migration SQL is also safe, but the
backup-restore path is the canonical recovery.

---

## Cross-check: staging mapping

| Filename                                                           | Version (staging) | Name (staging)                                       |
|--------------------------------------------------------------------|-------------------|------------------------------------------------------|
| 20260407_add_consent_events_email_opt_in_rate_limit.sql            | 20260407092946    | add_consent_events_email_opt_in_rate_limit           |
| 20260407132012_bridge_sprint_data_architecture.sql                 | 20260407132051    | bridge_sprint_data_architecture                      |
| 20260413000000_s2_t3b_archetype_scores_and_version_logging.sql     | 20260414083047    | s2_t3b_archetype_scores_and_version_logging          |
| 20260421000000_reveal_1b_timestamps.sql                            | 20260421144344    | 20260421000000_reveal_1b_timestamps                  |
| 20260424130000_users_journey_home_status_member.sql                | 20260424133116    | 20260424130000_users_journey_home_status_member      |
| 20260505140000_create_handle_new_user_trigger.sql                  | 20260505151841    | create_handle_new_user_trigger                       |

After all six packets apply, prod's `supabase_migrations.schema_migrations`
will be a faithful copy of staging's — including the quirk that two of the
`name` values still carry their original filename-timestamp prefix
(staging artefact, kept for parity).
