import PostHog from "posthog-react-native";

const API_KEY = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let posthog: PostHog | null = null;

export function initPostHog() {
  if (!API_KEY) {
    console.warn("[PostHog] API key not set — skipping init");
    return;
  }

  posthog = new PostHog(API_KEY, { host: HOST });
}

export function capture(event: string, properties?: Record<string, string | number | boolean>) {
  if (!posthog) return;
  posthog.capture(event, properties);
}

export function identify(userId: string, properties?: Record<string, string | number | boolean>) {
  if (!posthog) return;
  posthog.identify(userId, properties);
}

export function reset() {
  if (!posthog) return;
  posthog.reset();
}
