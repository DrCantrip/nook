// S2-T2/T3 SwipeDeck + scoring are not yet built. This stub lets us reach the
// reveal screen (S2-T4) for testing. When T2/T3 ship, replace the stub body
// with the real deck — the router.replace call here stays the same.

import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "../../src/theme/tokens";

export default function SwipeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Style Swipe</Text>
      <Text style={styles.subtitle}>
        SwipeDeck lands in S2-T2. Tap below to jump to the reveal screen
        (assumes an archetype_history row exists for your user).
      </Text>
      {__DEV__ && (
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
  buttonText: {
    fontFamily: "DMSans-SemiBold",
    fontSize: 16,
    color: colors.white,
  },
});
