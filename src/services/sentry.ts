import * as Sentry from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry() {
  if (!DSN) {
    console.warn("[Sentry] DSN not set — skipping init");
    return;
  }

  Sentry.init({
    dsn: DSN,
    tracesSampleRate: 0.1,
    environment: __DEV__ ? "development" : "production",
    debug: __DEV__,
  });
}

export { Sentry };
