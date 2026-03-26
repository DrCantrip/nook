import { ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { STRINGS } from "../../src/content/strings";
import { COLORS } from "../../src/tokens/colors";

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

      {/* Full-screen container with manual safe area padding */}
      <View
        cssInterop={false}
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        {/* Top — branding */}
        <View cssInterop={false} style={styles.topSection}>
          <Text style={styles.wordmark}>{S.title}</Text>
          <Text style={styles.tagline}>{S.subtitle}</Text>
        </View>

        {/* Bottom — CTA area */}
        <View cssInterop={false} style={styles.bottomSection}>
          <Text style={styles.headline}>{S.headline}</Text>

          {/* Button: white bg on outer View, press state on inner Pressable */}
          <View cssInterop={false} style={styles.ctaWrapper}>
            <Pressable
              cssInterop={false}
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

          {/* Sign in link */}
          <Pressable
            cssInterop={false}
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
    backgroundColor: "#000000",
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
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "400",
    color: "rgba(255,255,255,0.8)",
    marginTop: 8,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  headline: {
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.white,
    textAlign: "center",
  },
  ctaWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 16,
    overflow: "hidden",
  },
  ctaPressable: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.primary900,
    letterSpacing: 0.2,
  },
  signInPressable: {
    marginTop: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    paddingVertical: 12,
  },
  signInText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
  },
});
