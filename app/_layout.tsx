import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../src/hooks/useAuth";
import { useStyleProfile } from "../src/hooks/useStyleProfile";
import { useAppFonts } from "../src/hooks/useAppFonts";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, user, loading: authLoading } = useAuth();
  const { hasProfile, loading: profileLoading } = useStyleProfile(user);
  const { fontsLoaded } = useAppFonts();
  const segments = useSegments();
  const router = useRouter();

  const loading = authLoading || !fontsLoaded || (!!session && profileLoading);

  useEffect(() => {
    if (loading) return;

    SplashScreen.hideAsync();
  }, [loading]);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    let target: string | null = null;

    if (!session) {
      if (!inAuthGroup) target = "/(auth)/welcome";
    } else if (!hasProfile) {
      if (!inOnboardingGroup) target = "/(onboarding)/swipe";
    } else {
      if (inAuthGroup || inOnboardingGroup) target = "/(app)/home";
    }

    if (!target) return;

    // Defer to next tick so the navigator has finished processing
    // the current render before receiving a replace action.
    const id = setTimeout(() => {
      router.replace(target as string);
    }, 0);
    return () => clearTimeout(id);
  }, [session, hasProfile, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}
