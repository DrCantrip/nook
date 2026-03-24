# Cornr Lessons Learned

1. **Silent TypeScript errors kill Metro bundler** — Always run `npx tsc --noEmit` before testing in the simulator. Metro will crash with unhelpful errors if there are type issues it can't resolve.

2. **Supabase returns PromiseLike not Promise** — Supabase client methods return a PromiseLike that doesn't behave like a standard Promise in all contexts. Wrap in `Promise.resolve()` when you need real Promise behaviour (e.g. passing to Promise.all).

3. **Never call useAuth() inside another hook** — React hooks calling other custom hooks that depend on context can cause stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

4. **Check expo.dev/go before SDK decisions** — Not all Expo SDK packages work in Expo Go. Always verify compatibility at expo.dev/go before adding a dependency. If it requires a dev client, plan for that build step.

5. **expo-router v6 requires app/index.tsx** — The entry point must exist at `app/index.tsx`. Without it, the router silently fails to mount and you get a blank screen with no error.
