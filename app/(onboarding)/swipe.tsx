// S2-T2/T3 SwipeDeck + scoring are not yet built. This stub lets us reach the
// reveal screen (S2-T4) for testing. When T2/T3 ship, replace the stub body
// with the real deck — the router.replace call here stays the same.

import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../src/theme/tokens";
import { supabase } from "../../src/lib/supabase";
import { createLogger } from "../../lib/log";

const log = createLogger("OnboardingSwipe");

export default function SwipeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Style Swipe</Text>
      <Text style={styles.subtitle}>
        SwipeDeck lands in S2-T2. Tap below to jump to the reveal screen
        (assumes an archetype_history row exists for your user).
      </Text>
      <Pressable
        onPress={() => router.replace("/(onboarding)/reveal-essence")}
        style={({ pressed }) => [
          styles.button,
          { opacity: pressed ? 0.85 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Skip to reveal screen (dev)"
      >
        <Text style={styles.buttonText}>Dev: Go to reveal</Text>
      </Pressable>

      {/* HOME-SIGNOUT-01 temporary unblock — remove once a real sign-out path lands */}
      {__DEV__ && (
        <Pressable
          onPress={async () => {
            log.debug("sign-out tapped");
            const { error } = await supabase.auth.signOut();
            if (error) {
              log.warn("sign-out error", error);
            } else {
              log.info("sign-out completed");
            }
          }}
          style={({ pressed }) => [
            styles.button,
            styles.buttonSecondary,
            { opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Sign out (dev)"
        >
          <Text style={styles.buttonText}>Dev: Sign out</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.xl,
  },
  title: {
    fontFamily: "Lora-SemiBold",
    fontSize: 22,
    color: colors.ink,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: "DMSans-Regular",
    fontSize: 14,
    color: colors.warm600,
    textAlign: "center",
    marginBottom: spacing["2xl"],
  },
  button: {
    minHeight: 44,
    paddingHorizontal: spacing["2xl"],
    backgroundColor: colors.ink,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSecondary: {
    marginTop: spacing.md,
    backgroundColor: colors.warm600,
  },
  buttonText: {
    fontFamily: "DMSans-SemiBold",
    fontSize: 16,
    color: colors.white,
  },
});
