import * as Sentry from "@sentry/react-native";

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const UUID_RE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;
const POSTCODE_RE = /\b[A-Z]{1,2}[0-9R][0-9A-Z]? ?[0-9][A-Z]{2}\b/gi;
const SECRET_KEY_RE = /email|password|token|api[_-]?key|secret/i;

function scrubString(value: string): string {
  return value
    .replace(EMAIL_RE, "[email scrubbed]")
    .replace(UUID_RE, "[uuid scrubbed]")
    .replace(POSTCODE_RE, "[postcode scrubbed]");
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object") return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function scrubValue(value: unknown, key?: string): unknown {
  if (key && SECRET_KEY_RE.test(key)) {
    return "[scrubbed]";
  }
  if (typeof value === "string") {
    return scrubString(value);
  }
  if (Array.isArray(value)) {
    return value.map((item) => scrubValue(item));
  }
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[k] = scrubValue(v, k);
    }
    return out;
  }
  if (value && typeof value === "object") {
    return scrubString(String(value));
  }
  return value;
}

function scrubEvent(event: Sentry.ErrorEvent): Sentry.ErrorEvent {
  if (event.message) {
    event.message = scrubString(event.message);
  }
  if (event.transaction) {
    event.transaction = scrubString(event.transaction);
  }
  if (event.fingerprint) {
    event.fingerprint = event.fingerprint.map((f) =>
      typeof f === "string" ? scrubString(f) : f,
    );
  }
  if (event.tags) {
    event.tags = scrubValue(event.tags) as typeof event.tags;
  }
  if (event.extra) {
    event.extra = scrubValue(event.extra) as typeof event.extra;
  }
  if (event.contexts) {
    event.contexts = scrubValue(event.contexts) as typeof event.contexts;
  }
  if (event.user) {
    event.user = scrubValue(event.user) as typeof event.user;
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = scrubValue(event.breadcrumbs) as typeof event.breadcrumbs;
  }
  if (event.exception) {
    event.exception = scrubValue(event.exception) as typeof event.exception;
  }
  if (event.request) {
    event.request = scrubValue(event.request) as typeof event.request;
  }
  return event;
}

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
    beforeSend(event) {
      return scrubEvent(event as Sentry.ErrorEvent);
    },
  });
}

export { Sentry };
