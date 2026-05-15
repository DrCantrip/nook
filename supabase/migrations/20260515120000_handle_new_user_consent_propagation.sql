-- SIGNUP-PUBLIC-USERS-SYNC — extend handle_new_user to project consent flags
-- Date: 15 May 2026
--
-- WHAT:
--   Replace the body of handle_new_user() to additionally read two consent
--   keys from NEW.raw_user_meta_data ('email_marketing_opt_in',
--   'audience_data_opt_in'), cast each to boolean, default to false when
--   absent, and INSERT them into public.users along with id, email,
--   created_at. Function signature unchanged. Existing trigger
--   on_auth_user_created continues to invoke the function — no trigger
--   re-creation needed.
--
-- WHY:
--   Closes the second half of SIGNUP-PUBLIC-USERS-SYNC. The original
--   trigger (20260505140000_create_handle_new_user_trigger.sql) inserted
--   only (id, email, created_at), so consent flags from the signup form
--   fell back to their column defaults (false) regardless of what the
--   user chose. Combined with the companion app-side change that passes
--   options.data on auth.signUp, this completes the trigger-mirror
--   pattern: the client never writes public.users at signup time, the
--   trigger does it server-side via SECURITY DEFINER from a single
--   atomic INSERT that captures id, email, created_at, AND consent.
--
--   See docs/adr/ADR-001-signup-consent-trigger-mirror.md for the
--   decision and trade-offs.
--
-- BEHAVIOUR NOTES:
--   - NULL-safe: if raw_user_meta_data is NULL, or the keys are absent,
--     COALESCE supplies false (matches the column DEFAULT). Boolean cast
--     via ->>'key'::boolean handles 'true'/'false' JSON-string values
--     that Supabase produces from JS true/false in options.data.
--   - search_path lock and SECURITY DEFINER preserved verbatim from the
--     prior body (search_path injection guard, owner-privileged execution).
--   - Idempotent: CREATE OR REPLACE FUNCTION with same signature. Safe to
--     re-run if needed.
--
-- ROLLBACK:
--   Restore the prior body by re-running 20260505140000_create_handle_new_user_trigger.sql
--   step 2 (the CREATE OR REPLACE FUNCTION block with id/email/created_at only):
--
--     CREATE OR REPLACE FUNCTION public.handle_new_user()
--       RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
--       SET search_path = public, pg_temp
--     AS $$ BEGIN
--       INSERT INTO public.users (id, email, created_at)
--       VALUES (NEW.id, NEW.email, NEW.created_at);
--       RETURN NEW;
--     END; $$;
--
--   No data rollback required — rows already inserted with consent flag
--   columns populated remain valid.
--
-- VERIFICATION (run after apply on staging):
--   SELECT pg_get_functiondef('public.handle_new_user'::regproc);
--   -- Expect: body now includes email_marketing_opt_in and
--   -- audience_data_opt_in columns in INSERT and a COALESCE(... ::boolean, false)
--   -- expression for each.
--
--   Runtime smoke (deferred, app-side): sign up with a fresh +auditNN
--   email and both opt-ins true; expect public.users row to show both
--   flags = true. Repeat with both flags false; expect both = false.
--
-- PRODUCTION DEPLOYMENT:
--   Out of scope for this commit. Queued as a separate dispatch via the
--   LR-PROD-SYNC packet pattern. Until that lands, prod's handle_new_user
--   continues to drop consent flags silently — but no prod users have
--   signed up yet (TestFlight gated), so the gap window is zero-user.

BEGIN;

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public, pg_temp
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    created_at,
    email_marketing_opt_in,
    audience_data_opt_in
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.created_at,
    COALESCE((NEW.raw_user_meta_data->>'email_marketing_opt_in')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'audience_data_opt_in')::boolean, false)
  );
  RETURN NEW;
END;
$$;

COMMIT;
