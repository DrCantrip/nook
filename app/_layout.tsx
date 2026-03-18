import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useAuth } from "../src/hooks/useAuth";
import { useStyleProfile } from "../src/hooks/useStyleProfile";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { session, loading: authLoading } = useAuth();
  const { hasProfile, loading: profileLoading } = useStyleProfile();
  const segments = useSegments();
  const router = useRouter();

  const loading = authLoading || (session && profileLoading);

  useEffect(() => {
    if (loading) return;

    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!session) {
      // No session → auth
      if (!inAuthGroup) {
        router.replace("/(auth)/welcome");
      }
    } else if (!hasProfile) {
      // Session but no style profile → onboarding
      if (!inOnboardingGroup) {
        router.replace("/(onboarding)/swipe");
      }
    } else {
      // Session + profile → main app
      if (inAuthGroup || inOnboardingGroup) {
        router.replace("/(app)/home");
      }
    }
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
