import { useState } from "react";
import {
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
import { supabase } from "../../src/lib/supabase";
import { identify } from "../../src/services/posthog";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";

const S = STRINGS.signIn;

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit = email.length > 0 && password.length > 0 && !loading;

  async function handleSignIn() {
    setError(null);

    if (!emailValid) {
      setError(S.emailInvalid);
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await signIn(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }
      const userId = data?.user?.id;
      if (userId) {
        await identify(userId);
      }
    } catch {
      setError(S.genericError);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    setResetError(null);
    setResetLoading(true);
    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        resetEmail.trim()
      );
      if (resetErr) {
        setResetError(resetErr.message);
        return;
      }
      setResetSent(true);
    } catch {
      setResetError(S.genericError);
    } finally {
      setResetLoading(false);
    }
  }

  if (showReset) {
    const canReset = resetEmail.length > 0 && !resetLoading;
    return (
      <SafeAreaView style={styles.safe}>
        <Pressable
          style={styles.backButton}
          onPress={() => { setShowReset(false); setResetSent(false); setResetError(null); }}
        >
          <ArrowLeft size={24} color={colors.ink} />
        </Pressable>

        <View style={styles.content}>
          <Text style={styles.title}>{S.resetTitle}</Text>
          <Text style={styles.description}>{S.resetDescription}</Text>

          {resetSent ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{S.resetSuccess}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.label}>{S.emailLabel}</Text>
              <TextInput
                style={[styles.input, { marginBottom: spacing.xl }]}
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                placeholder={S.emailLabel}
                placeholderTextColor={colors.warm400}
              />

              {resetError && <Text style={styles.errorText}>{resetError}</Text>}

              <Pressable
                style={[styles.submitButton, !canReset && styles.submitDisabled]}
                onPress={handleResetPassword}
                disabled={!canReset}
              >
                <Text style={[styles.submitLabel, !canReset && styles.submitLabelDisabled]}>
                  {S.resetButton}
                </Text>
              </Pressable>
            </>
          )}

          <Pressable
            style={styles.backLink}
            onPress={() => { setShowReset(false); setResetSent(false); setResetError(null); }}
          >
            <Text style={styles.backLinkText}>{S.backToSignIn}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
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
            style={[styles.input, { marginBottom: spacing.sm }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            placeholder={S.passwordLabel}
            placeholderTextColor={colors.warm400}
          />

          <Pressable
            style={styles.forgotButton}
            onPress={() => { setShowReset(true); setResetEmail(email); }}
          >
            <Text style={styles.forgotText}>{S.forgotPassword}</Text>
          </Pressable>

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
            onPress={handleSignIn}
            disabled={!canSubmit}
          >
            <Text style={[styles.submitLabel, !canSubmit && styles.submitLabelDisabled]}>
              {loading ? "Signing in..." : S.submitButton}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{S.noAccount} </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-up")}>
              <Text style={styles.linkAccent}>{S.signUpLink}</Text>
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
  description: {
    ...typography.body,
    color: colors.warm600,
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
  forgotButton: {
    alignSelf: "flex-end",
    marginBottom: spacing.xl,
    minHeight: 44,
    justifyContent: "center",
  },
  forgotText: { ...typography.uiLabel, color: colors.accent },
  errorText: { color: colors.error, fontSize: 14, marginBottom: spacing.lg },
  submitButton: {
    backgroundColor: colors.accentSurface,
    borderRadius: radius.button,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  submitDisabled: { backgroundColor: colors.warm200 },
  submitLabel: { ...typography.cta, color: colors.white },
  submitLabelDisabled: { color: colors.warm400 },
  successBox: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  successText: { ...typography.body, color: colors.ink, textAlign: "center" },
  backLink: {
    marginTop: spacing.xl,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  backLinkText: {
    ...typography.uiLabel,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
  },
  linkText: { ...typography.body, color: colors.warm600 },
  linkAccent: { ...typography.body, color: colors.accent, fontFamily: "DMSans-SemiBold" },
});
