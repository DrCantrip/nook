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

BEGIN;

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

COMMIT;
