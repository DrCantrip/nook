import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/hooks/useAuth";
import { STRINGS } from "../../src/content/strings";

const S = STRINGS.signUp;

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password.length >= 8;
  const canSubmit = emailValid && passwordValid && ageConfirmed && !loading;

  async function handleSignUp() {
    setError(null);

    if (!ageConfirmed) {
      setError(S.ageError);
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await signUp(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }
      // PostHog signup_completed event — no PII
      // TODO: Fire posthog.capture("signup_completed") once PostHog provider is added (T10)
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-warmstone">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 justify-center px-6">
          <Text className="text-[22px] font-semibold tracking-tight text-primary-900 mb-8">
            {S.title}
          </Text>

          {/* Email */}
          <Text className="text-base text-primary-900 mb-1.5 font-medium">
            {S.emailLabel}
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-input px-4 py-3 text-base text-gray-900 mb-4"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            placeholder={S.emailLabel}
            placeholderTextColor="#9CA3AF"
          />

          {/* Password */}
          <Text className="text-base text-primary-900 mb-1.5 font-medium">
            {S.passwordLabel}
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-input px-4 py-3 text-base text-gray-900 mb-1"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password-new"
            placeholder={S.passwordLabel}
            placeholderTextColor="#9CA3AF"
          />
          <Text className="text-xs text-gray-400 mb-6">{S.passwordHint}</Text>

          {/* Age checkbox */}
          <Pressable
            className="flex-row items-center mb-6 min-h-[44px]"
            onPress={() => setAgeConfirmed((v) => !v)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: ageConfirmed }}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View
              className={`w-6 h-6 rounded-badge border-2 items-center justify-center mr-3 ${
                ageConfirmed
                  ? "bg-primary-900 border-primary-900"
                  : "bg-white border-gray-300"
              }`}
            >
              {ageConfirmed && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text className="text-base text-gray-700 flex-1">
              {S.ageCheckbox}
            </Text>
          </Pressable>

          {/* Error */}
          {error && (
            <Text className="text-red-600 text-sm mb-4">{error}</Text>
          )}

          {/* Submit */}
          <Pressable
            className={`rounded-button py-3 items-center ${
              canSubmit ? "bg-primary-900" : "bg-gray-300"
            }`}
            onPress={handleSignUp}
            disabled={!canSubmit}
            style={({ pressed }) => ({
              opacity: pressed && canSubmit ? 0.85 : 1,
            })}
          >
            <Text
              className={`text-base font-semibold ${
                canSubmit ? "text-white" : "text-gray-500"
              }`}
            >
              {loading ? "Creating account..." : S.submitButton}
            </Text>
          </Pressable>

          {/* Sign in link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-gray-500">{S.hasAccount} </Text>
            <Pressable
              onPress={() => router.replace("/(auth)/sign-in")}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-base font-semibold text-primary-600">
                {S.signInLink}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
