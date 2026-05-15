import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { reset as resetPostHog } from "../services/posthog";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(() => {
        setSession(null);
      })
      .finally(() => {
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user ?? null;

  const isAnonymous = session?.user?.is_anonymous === true;

  const signUp = (
    email: string,
    password: string,
    metadata?: Record<string, unknown>,
  ) => {
    if (isAnonymous) {
      // Upgrade anonymous user — preserves existing user_id and linked data.
      // Metadata lands in user.user_metadata. Note: the AFTER INSERT trigger
      // on auth.users does NOT fire on updateUser, so the public.users row
      // for an anon-upgraded user keeps the consent flags it had at anon
      // creation (i.e. false). See ADR-001 — anon-upgrade reconciliation
      // is a follow-up.
      return supabase.auth.updateUser({ email, password, data: metadata });
    }
    return supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    });
  };

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    await resetPostHog();
    return result;
  };

  return { session, user, loading, signUp, signIn, signOut };
}
