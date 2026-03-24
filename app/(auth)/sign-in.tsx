import { useState } from "react";
import {
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
import { supabase } from "../../src/lib/supabase";
import { STRINGS } from "../../src/content/strings";

const S = STRINGS.signIn;

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reset password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  const canSubmit = email.length > 0 && password.length > 0 && !loading;

  async function handleSignIn() {
    setError(null);
    setLoading(true);
    try {
      const { error: authError } = await signIn(email.trim(), password);
      if (authError) {
        setError(authError.message);
        return;
      }
      // Navigation guard in _layout.tsx handles redirect
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
    return (
      <SafeAreaView className="flex-1 bg-warmstone">
        <View className="flex-1 justify-center px-6">
          <Text className="text-[22px] font-semibold tracking-tight text-primary-900 mb-2">
            {S.resetTitle}
          </Text>
          <Text className="text-base text-gray-500 mb-8">
            {S.resetDescription}
          </Text>

          {resetSent ? (
            <View className="bg-white rounded-card p-4 mb-6">
              <Text className="text-base text-primary-900 text-center">
                {S.resetSuccess}
              </Text>
            </View>
          ) : (
            <>
              <Text className="text-base text-primary-900 mb-1.5 font-medium">
                {S.emailLabel}
              </Text>
              <TextInput
                className="bg-white border border-gray-200 rounded-input px-4 py-3 text-base text-gray-900 mb-6"
                value={resetEmail}
                onChangeText={setResetEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                placeholder={S.emailLabel}
                placeholderTextColor="#9CA3AF"
              />

              {resetError && (
                <Text className="text-red-600 text-sm mb-4">{resetError}</Text>
              )}

              <Pressable
                className={`rounded-button py-3 items-center ${
                  resetEmail.length > 0 && !resetLoading
                    ? "bg-primary-900"
                    : "bg-gray-300"
                }`}
                onPress={handleResetPassword}
                disabled={resetEmail.length === 0 || resetLoading}
                style={({ pressed }) => ({
                  opacity:
                    pressed && resetEmail.length > 0 && !resetLoading
                      ? 0.85
                      : 1,
                })}
              >
                <Text
                  className={`text-base font-semibold ${
                    resetEmail.length > 0 && !resetLoading
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  {S.resetButton}
                </Text>
              </Pressable>
            </>
          )}

          <Pressable
            className="mt-6 items-center min-h-[44px] justify-center"
            onPress={() => {
              setShowReset(false);
              setResetSent(false);
              setResetError(null);
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="text-sm font-semibold text-primary-600">
              {S.submitButton}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
            className="bg-white border border-gray-200 rounded-input px-4 py-3 text-base text-gray-900 mb-2"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            placeholder={S.passwordLabel}
            placeholderTextColor="#9CA3AF"
          />

          {/* Forgot password */}
          <Pressable
            className="self-end mb-6 min-h-[44px] justify-center"
            onPress={() => {
              setShowReset(true);
              setResetEmail(email);
            }}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <Text className="text-sm text-primary-600">
              {S.forgotPassword}
            </Text>
          </Pressable>

          {/* Error */}
          {error && (
            <Text className="text-red-600 text-sm mb-4">{error}</Text>
          )}

          {/* Submit */}
          <Pressable
            className={`rounded-button py-3 items-center w-full ${
              canSubmit ? "bg-primary-900" : "bg-gray-300"
            }`}
            onPress={handleSignIn}
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
              {loading ? "Signing in..." : S.submitButton}
            </Text>
          </Pressable>

          {/* Sign up link */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-base text-gray-500">{S.noAccount} </Text>
            <Pressable
              onPress={() => router.replace("/(auth)/sign-up")}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-base font-semibold text-primary-600">
                {S.signUpLink}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
