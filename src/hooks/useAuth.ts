import { useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

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

  const signUp = (email: string, password: string) => {
    if (isAnonymous) {
      // Upgrade anonymous user — preserves existing user_id and linked data
      return supabase.auth.updateUser({ email, password });
    }
    return supabase.auth.signUp({ email, password });
  };

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = () => supabase.auth.signOut();

  return { session, user, loading, signUp, signIn, signOut };
}
