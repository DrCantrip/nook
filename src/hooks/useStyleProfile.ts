import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export function useStyleProfile() {
  const { user } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasProfile(false);
      setLoading(false);
      return;
    }

    supabase
      .from("style_profiles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .single()
      .then(({ data, error }) => {
        setHasProfile(!!data && !error);
        setLoading(false);
      });
  }, [user]);

  return { hasProfile, loading };
}
