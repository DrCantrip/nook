// Dev-only component that throws on render to verify ErrorBoundary.
// Remove before TestFlight.
export function CrashTest(): never {
  throw new Error('Intentional crash for ErrorBoundary test');
}
