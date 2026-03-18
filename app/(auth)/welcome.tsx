import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { STRINGS } from "../../src/content/strings";
import { COLORS } from "../../src/tokens/colors";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Dark overlay on lower half */}
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        {/* Top content */}
        <View style={styles.top}>
          <Text style={styles.title}>{STRINGS.welcome.title}</Text>
          <Text style={styles.subtitle}>{STRINGS.welcome.subtitle}</Text>
        </View>

        {/* Bottom content */}
        <View style={styles.bottom}>
          <Text style={styles.headline}>{STRINGS.welcome.headline}</Text>

          <Pressable
            style={({ pressed }) => [
              styles.ctaButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push("/(onboarding)/swipe")}
          >
            <Text style={styles.ctaText}>{STRINGS.welcome.cta}</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.signInButton,
              pressed && { opacity: 0.85 },
            ]}
            onPress={() => router.push("/(auth)/sign-in")}
          >
            <Text style={styles.signInText}>{STRINGS.welcome.signIn}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.warmstone,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  top: {
    alignItems: "center",
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headline: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 16,
  },
  ctaButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary900,
  },
  signInButton: {
    marginTop: 16,
    alignItems: "center",
  },
  signInText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
});
