import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";

const S = STRINGS.welcome;

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      source={require("../../assets/welcome-hero.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.35)"]}
        locations={[0, 1]}
        pointerEvents="none"
        style={styles.gradient}
      />

      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Top — branding */}
        <View style={styles.topSection}>
          <Text style={styles.wordmark}>{S.title}</Text>
          <Text style={styles.tagline}>{S.subtitle}</Text>
        </View>

        {/* Bottom — CTA area */}
        <View style={styles.bottomSection}>
          <Text style={styles.headline}>{S.headline}</Text>

          <View style={styles.ctaWrapper}>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push("/(auth)/sign-up");
              }}
              style={({ pressed }) => [
                styles.ctaPressable,
                { opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Text style={styles.ctaText}>{S.cta}</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/(auth)/sign-in")}
            style={({ pressed }) => [
              styles.signInPressable,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.signInText}>{S.signIn}</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "50%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  topSection: {
    alignItems: "center",
    paddingTop: 60,
  },
  wordmark: {
    fontFamily: "Lora-Bold",
    fontSize: 28,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -0.5,
  },
  tagline: {
    ...typography.body,
    color: "rgba(255,255,255,0.8)",
    marginTop: spacing.sm,
  },
  bottomSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
  headline: {
    ...typography.sectionHeading,
    color: colors.white,
    textAlign: "center",
  },
  ctaWrapper: {
    backgroundColor: colors.white,
    borderRadius: radius.button,
    marginTop: spacing.lg,
    overflow: "hidden",
  },
  ctaPressable: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    ...typography.cta,
    color: colors.ink,
  },
  signInPressable: {
    marginTop: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: spacing.md,
  },
  signInText: {
    ...typography.uiLabel,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
});
