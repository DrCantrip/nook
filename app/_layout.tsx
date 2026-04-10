import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import { ErrorBoundary } from "../src/components/organisms/ErrorBoundary";
import { initSentry, Sentry } from "../src/services/sentry";
import { initPostHog } from "../src/services/posthog";
import { useAuth } from "../src/hooks/useAuth";
import { useStyleProfile } from "../src/hooks/useStyleProfile";
import { useAppFonts } from "../src/hooks/useAppFonts";

// Init observability at module load
initSentry();
initPostHog();

SplashScreen.preventAutoHideAsync();

function RootLayout() {
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <Slot />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

export default Sentry.wrap(RootLayout);
