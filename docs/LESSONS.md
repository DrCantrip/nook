# Cornr Lessons Learned

1. **Silent TypeScript errors kill Metro bundler** — Always run `npx tsc --noEmit` before testing in the simulator. Metro will crash with unhelpful errors if there are type issues it can't resolve.

2. **Supabase returns PromiseLike not Promise** — Supabase client methods return a PromiseLike that doesn't behave like a standard Promise in all contexts. Wrap in `Promise.resolve()` when you need real Promise behaviour (e.g. passing to Promise.all).

3. **Never call useAuth() inside another hook** — React hooks calling other custom hooks that depend on context can cause stale closures and infinite re-render loops. Keep useAuth() calls at the component level only.

4. **Check expo.dev/go before SDK decisions** — Not all Expo SDK packages work in Expo Go. Always verify compatibility at expo.dev/go before adding a dependency. If it requires a dev client, plan for that build step.

5. **expo-router v6 requires app/index.tsx** — The entry point must exist at `app/index.tsx`. Without it, the router silently fails to mount and you get a blank screen with no error.

6. **Don't manually update CLAUDE.md/BUILD_LOG** — Use the /done command to keep mission control (CLAUDE.md, BUILD_LOG.md) in sync automatically. Manual updates across Claude Chat and Claude Code in VS Code lead to stale or conflicting state. Let the workflow commands handle it.

7. **Trusting Claude Code to execute speeds things up at the cost of context** — Letting Claude Code run through a plan in VS Code without checking every response in Claude.ai is faster, but you lose visibility into the reasoning behind each step. Acceptable trade-off for well-defined tasks; review more closely for ambiguous ones.

8. **react-native-worklets/plugin ≠ react-native-worklets-core** — These are different packages. If Metro crashes with "Cannot find module 'react-native-worklets/plugin'", check babel.config.js matches what's in package.json. The fix is usually to remove the phantom package and nuke all caches: `rm -rf node_modules/.cache .expo` then `npx expo start --clear`.

9. **NativeWind cssInterop breaks inline styles on wrapped components** — NativeWind v4 with `jsxImportSource: "nativewind"` wraps View, Pressable, SafeAreaView, and other core components through its CSS interop pipeline (see `react-native-css-interop/dist/runtime/components.js`). This can strip `backgroundColor`, `flex`, `justifyContent`, and other style properties. Fix: add `cssInterop={false}` to any component that uses only inline styles or StyleSheet and does NOT need NativeWind className processing. Put ALL styles in `StyleSheet.create()` — never mix inline objects with the interop.

10. **Welcome screen bottom CTA layout** — SafeAreaView must include `edges={['top', 'bottom']}` on full-screen ImageBackground layouts. The bottom CTA section needs `paddingBottom` on top of the safe area inset SafeAreaView already provides. Always calculate total bottom section height (headline + button + link + padding) and verify it fits within ~200px. The LinearGradient overlay must have `pointerEvents='none'` or it blocks touches. `cssInterop={false}` is required on View wrappers carrying backgroundColor and on SafeAreaView to bypass NativeWind's style interop.
