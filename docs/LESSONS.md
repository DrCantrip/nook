# Cornr Lessons Learned

1. **Silent TypeScript errors kill Metro bundler** — Always run `npx tsc --noEmit` before testing in the simulator. Metro will crash with unhelpful errors if there are type issues it can't resolve.

2. **Supabase returns PromiseLike not Promise** — Supabase client methods return a PromiseLike that doesn't behave like a standard Promise in all contexts. Wrap in `Promise.resolve()` when you need real Promise behaviour (e.g. passing to Promise.all).

3. **Never call useAuth() inside another hook** — React hooks calling other custom hooks that depend on context can cause stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

4. **Check expo.dev/go before SDK decisions** — Not all Expo SDK packages work in Expo Go. Always verify compatibility at expo.dev/go before adding a dependency. If it requires a dev client, plan for that build step.

5. **expo-router v6 requires app/index.tsx** — The entry point must exist at `app/index.tsx`. Without it, the router silently fails to mount and you get a blank screen with no error.

6. **Don't manually update CLAUDE.md/BUILD_LOG** — Use the /done command to keep mission control (CLAUDE.md, BUILD_LOG.md) in sync automatically. Manual updates across Claude Chat and Claude Code in VS Code lead to stale or conflicting state. Let the workflow commands handle it.

7. **Trusting Claude Code to execute speeds things up at the cost of context** — Letting Claude Code run through a plan in VS Code without checking every response in Claude.ai is faster, but you lose visibility into the reasoning behind each step. Acceptable trade-off for well-defined tasks; review more closely for ambiguous ones.
