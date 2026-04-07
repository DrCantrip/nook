import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ArrowLeft, CaretDown, CaretUp } from "phosphor-react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { supabase } from "../../src/lib/supabase";
import { capture } from "../../src/services/posthog";
import { recordEvent } from "../../src/services/engagement";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";

const S = STRINGS.signUp;

function WhyWeAskExpander({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.expanderContainer}>
      <Pressable
        style={styles.expanderTrigger}
        onPress={() => {
          LayoutAnimation.easeInEaseOut();
          setExpanded((v) => !v);
        }}
      >
        <Text style={styles.expanderLabel}>{S.whyWeAsk}</Text>
        {expanded ? (
          <CaretUp size={14} color={colors.accent} weight="light" />
        ) : (
          <CaretDown size={14} color={colors.accent} weight="light" />
        )}
      </Pressable>
      {expanded && <Text style={styles.expanderBody}>{text}</Text>}
    </View>
  );
}

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [audienceDataOptIn, setAudienceDataOptIn] = useState(false);
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
      const { data, error: authError } = await signUp(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }

      const userId = data?.user?.id;
      if (userId) {
        try {
          await Promise.resolve(
            supabase
              .from("users")
              .update({
                email_marketing_opt_in: marketingOptIn,
                audience_data_opt_in: audienceDataOptIn,
              })
              .eq("id", userId)
          );
          await Promise.resolve(
            supabase.from("consent_events").insert([
              {
                user_id: userId,
                event_type: "marketing_opt_in_at_signup",
                consent_given: marketingOptIn,
                consent_text: S.marketingOptIn,
              },
              {
                user_id: userId,
                event_type: "audience_data_opt_in_at_signup",
                consent_given: audienceDataOptIn,
                consent_text: S.audienceDataOptIn,
              },
            ])
          );
          capture("signup_completed", {
            marketing_opt_in: marketingOptIn,
            audience_data_opt_in: audienceDataOptIn,
          });
          recordEvent(data?.user ?? null, "signup_completed", {
            marketing_opt_in: marketingOptIn,
            audience_data_opt_in: audienceDataOptIn,
            source: "sign_up_screen",
          });
        } catch (e) {
          console.warn("Failed to save consent:", e);
        }
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
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft size={24} color={colors.ink} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* 18+ checkbox (required) */}
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

          {/* Marketing opt-in toggle */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setMarketingOptIn((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: marketingOptIn }}
          >
            <View
              style={[
                styles.checkbox,
                marketingOptIn ? styles.checkboxChecked : styles.checkboxUnchecked,
              ]}
            >
              {marketingOptIn && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.marketingOptIn}</Text>
          </Pressable>
          <WhyWeAskExpander text={S.marketingWhyWeAsk} />

          {/* Audience data opt-in toggle */}
          <Pressable
            style={styles.checkboxRow}
            onPress={() => setAudienceDataOptIn((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: audienceDataOptIn }}
          >
            <View
              style={[
                styles.checkbox,
                audienceDataOptIn
                  ? styles.checkboxChecked
                  : styles.checkboxUnchecked,
              ]}
            >
              {audienceDataOptIn && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>{S.audienceDataOptIn}</Text>
          </Pressable>
          <WhyWeAskExpander text={S.audienceDataWhyWeAsk} />

          {/* Privacy policy */}
          <View style={styles.privacyRow}>
            <Text style={styles.privacyText}>{S.privacyPolicy} </Text>
            <Pressable
              onPress={() =>
                Alert.alert(S.privacyPolicyLink, S.privacyPolicyNotice)
              }
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
            <Text
              style={[
                styles.submitLabel,
                !canSubmit && styles.submitLabelDisabled,
              ]}
            >
              {loading ? "Creating account..." : S.submitButton}
            </Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkText}>{S.hasAccount} </Text>
            <Pressable onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={styles.linkAccent}>{S.signInLink}</Text>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing["3xl"],
  },
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
    marginBottom: spacing.sm,
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
  expanderContainer: {
    marginBottom: spacing.lg,
  },
  expanderTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 36,
    minHeight: 28,
  },
  expanderLabel: {
    fontFamily: "DMSans-Medium",
    fontSize: 13,
    fontWeight: "500",
    color: colors.accent,
    marginRight: spacing.xs,
  },
  expanderBody: {
    fontFamily: "DMSans-Regular",
    fontSize: 13,
    lineHeight: 18,
    color: colors.warm600,
    paddingLeft: 36,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
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
  linkAccent: {
    ...typography.body,
    color: colors.accent,
    fontFamily: "DMSans-SemiBold",
  },
});
