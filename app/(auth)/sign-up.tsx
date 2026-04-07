import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";

const S = STRINGS.signUp;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && ageConfirmed && !loading;

  async function handleSignUp() {
    setError(null);
    setSuccess(null);

    if (!ageConfirmed) {
      setError(S.ageError);
      return;
    }

    setLoading(true);
    setSubmitted(true);
    try {
      const { error: authError } = await signUp(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }
      setSuccess(S.checkEmail);
    } catch {
      setError(S.genericError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.ink} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>{S.title}</Text>

          <Text style={styles.label}>{S.emailLabel}</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            placeholder={S.emailLabel}
            placeholderTextColor={colors.warm400}
          />

          <Text style={styles.label}>{S.passwordLabel}</Text>
          <TextInput
            style={[styles.input, { marginBottom: spacing.xs }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder={S.passwordLabel}
            placeholderTextColor={colors.warm400}
          />
          <Text style={styles.hint}>{S.passwordHint}</Text>

          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAgeConfirmed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ageConfirmed }}
          >
            <View
              style={[
                styles.checkbox,
                ageConfirmed ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {ageConfirmed && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.ageCheckbox}</Text>
          </Pressable>

          <View style={styles.privacyRow}>
            <Text style={styles.privacyText}>{S.privacyPolicy} </Text>
            <Pressable
              onPress={() => Alert.alert(S.privacyPolicyLink, S.privacyPolicyNotice)}
            >
              <Text style={styles.privacyLink}>{S.privacyPolicyLink}</Text>
            </Pressable>
          </View>

          {submitted && success && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{success}</Text>
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
            onPress={handleSignUp}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
              {loading ? "Creating account..." : S.submitButton}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{S.hasAccount} </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={styles.linkAccent}>{S.signInLink}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  backButton: {
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: spacing.xl },
  title: {
    ...typography.screenTitle,
    color: colors.ink,
    marginBottom: spacing["3xl"],
  },
  label: {
    ...typography.uiLabel,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.warm200,
    borderRadius: radius.input,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...typography.body,
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  hint: {
    fontSize: 12,
    color: colors.warm400,
    marginBottom: spacing.xl,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    minHeight: 44,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: radius.badge,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxUnchecked: {
    backgroundColor: colors.white,
    borderColor: colors.warm200,
  },
  checkmark: { color: colors.white, fontSize: 12, fontWeight: "700" },
  checkboxLabel: { ...typography.body, color: colors.warm600, flex: 1 },
  privacyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xl,
  },
  privacyText: { ...typography.uiLabel, color: colors.warm600 },
  privacyLink: {
    ...typography.uiLabel,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
    textDecorationLine: "underline",
  },
  successBox: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  successText: { ...typography.body, color: colors.ink, textAlign: "center" },
  errorText: { color: colors.error, fontSize: 14, marginBottom: spacing.lg },
  submitButton: {
    backgroundColor: colors.accentSurface,
    borderRadius: radius.button,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: { backgroundColor: colors.warm200 },
  submitLabel: { ...typography.cta, color: colors.white },
  submitLabelDisabled: { color: colors.warm400 },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  linkText: { ...typography.body, color: colors.warm600 },
  linkAccent: { ...typography.body, color: colors.accent, fontFamily: "DMSans-SemiBold" },
});
