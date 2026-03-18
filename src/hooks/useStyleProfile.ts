import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export function useStyleProfile(user: User | null) {
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHasProfile(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.resolve(
      supabase
        .from("style_profiles")
        .select("id")
        .eq("user_id", user.id)
        .limit(1)
        .single()
    )
      .then(({ data, error }) => {
        setHasProfile(!!data && !error);
      })
      .catch(() => {
        setHasProfile(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  return { hasProfile, loading };
}
