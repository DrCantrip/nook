# Hook Reliability Investigation — Windows + Claude Code (VS Code extension)

Investigation B of the discipline-pack pre-commitment sequence. Read-only; all experiment artefacts were created under `tmp/hook-investigation/` (untracked scratch, removed after).

## Executive summary

- **Hooks do fire on this setup** — the superpowers plugin's `SessionStart` hook demonstrably injected context into *this* session, so the mechanism works. The proposed chain does **not** ship as-specced.
- **Claude Code on Windows runs hook `command` strings through `cmd.exe`**, and **`bash.exe` is not on the PATH that process sees** — so any bash one-liner or `.sh` script hook fails unless wrapped (the superpowers `run-hook.cmd` exists for exactly this reason).
- **Prettier and ESLint are not installed** (and there's no usable ESLint config) — the PostToolUse chain references tools that don't exist.
- **Headline adaptation:** write hooks as `node` scripts (node *is* on PATH) or wrap bash scripts in a `.cmd` polyglot; make security hooks fail-closed; install/configure prettier+eslint or drop those stages; move `tsc`/tests to Stop-only and re-emit their stdout on stderr; expect ~4s for any `tsc` hook.

---

## Environment observed

| Item | Value |
|---|---|
| OS | Windows 11 Home, build 10.0.26200.8328 |
| Claude Code | **2.1.139** (VS Code extension `anthropic.claude-code-2.1.139-win32-x64`) |
| Shell used by the **Bash tool** | Git Bash / MSYS2 — `MSYSTEM=MINGW64`, `bash 5.2.37(1)` (`/usr/bin/bash`), `uname` → `MINGW64_NT-10.0-26200 ... Msys` |
| Shell used for **hook commands** (inferred) | `cmd.exe` — see Findings → "Shell choice". `bash.exe` is **not** on the system `PATH` (only `C:\Program Files\Git\cmd` is, which has `git.exe` but not `bash.exe`; `bash.exe` lives in `C:\Program Files\Git\bin\`). `where bash` / `where sh` → empty. |
| Node | v24.14.0 (`node` is on PATH; `node -e 1` startup ≈ 41 ms) |
| TypeScript / `tsc` | 5.9.3 (local `node_modules/.bin/tsc`, plus `.cmd` and `.ps1` shims). `npx tsc --version` ≈ 627 ms (npx resolution overhead); `npx tsc --noEmit` on the repo ≈ **3.5–4.0 s** (clean, exit 0). |
| Prettier | **NOT installed** — `npx --no-install prettier --version` → `npx canceled due to missing packages` (`prettier@3.8.3` would be fetched). No `node_modules/prettier`. No `.prettierrc*` / `prettier.config.*` anywhere. |
| ESLint | **NOT installed** — `npx --no-install eslint --version` → `npx canceled due to missing packages` (`eslint@10.3.0` would be fetched). No `node_modules/eslint`. A legacy `.eslintrc.json` exists (dated 7 Apr; `extends: ["expo"]`, with a `no-restricted-syntax` rule banning hex literals in components) — but ESLint ≥ 9 defaults to flat config and **ignores `.eslintrc.json`** unless `ESLINT_USE_FLAT_CONFIG=false`. |
| Git | Git for Windows 2.53.0.windows.2; `git --exec-path` = `C:/Program Files/Git/mingw64/libexec/git-core`; bundled bash at `C:\Program Files\Git\bin\bash.exe` (exists, not on PATH). |
| Repo line-ending policy | `core.autocrlf=true`; `.gitattributes` forces `eol=lf` for `*.sh` and `.githooks/**`. Hook scripts in the repo (`.githooks/pre-commit`, `scripts/drift/check.sh`, `.git/hooks/pre-commit`) are all LF. |

**Scope limit (stated up front):** a *live* "configure a hook, watch it fire" test was **not possible** within the read-only scope — editing `.claude/settings.json` / `.claude/settings.local.json` is forbidden, a scratch settings file is not loaded by Claude Code, and the already-running session can't be restarted with `--settings <scratch>`. So the *integration* layer (does CC 2.1.139 surface a PostToolUse hook's stderr on exit 2 in the extension UI? does it block a Stop? cross-source chaining order?) is **reasoned about, not directly observed**. What *was* directly observed: that the hook *mechanism* works at all (SessionStart), and the *command-execution layer* (shell, bash availability, exit-code semantics, latency, line endings, tool presence).

---

## Experiments run (in order, with output)

1. **Gate + tool recon.** Branch `feat/reveal-1b-two-experience` ✅, root `C:/Projects/Nook` ✅, working tree had only `?? docs/audits/repo-audit-2026-05-09.md` (prior deliverable, untracked — not "dirty"). `node v24.14.0`; `tsc 5.9.3`; `npx --no-install prettier` → missing; `npx --no-install eslint` → missing. `MSYSTEM=MINGW64`, `bash 5.2.37`. `core.autocrlf=true`, `core.hooksPath=.githooks`.

2. **Global / plugin hook config inspection.** `~/.claude/settings.json` has **no `hooks` key** (just permissions, enabled plugins, theme); `~/.claude/settings.local.json` only has a tiny permissions allowlist; the repo's `.claude/settings.local.json` only has permissions. → The `SessionStart` context injection observed in this session comes from the **`superpowers` plugin** (`5.1.0`, `installPath C:\Users\Skcar\.claude\plugins\cache\...\superpowers\5.1.0`). Its `hooks/hooks.json`:
   ```json
   { "hooks": { "SessionStart": [ { "matcher": "startup|clear|compact",
       "hooks": [ { "type": "command",
         "command": "\"${CLAUDE_PLUGIN_ROOT}/hooks/run-hook.cmd\" session-start",
         "async": false } ] } ] } }
   ```
   → **The plugin author routes the hook through a `.cmd` wrapper.** Reading `run-hook.cmd` (a cmd/bash *polyglot*) — its own comments are the best documentation found of CC-on-Windows hook behavior:
   - *"On Windows: cmd.exe runs the batch portion, which finds and calls bash. On Unix: the shell interprets this as a script."*
   - *"Hook scripts use extensionless filenames (e.g. `session-start` not `session-start.sh`) so Claude Code's Windows auto-detection — which prepends `bash` to any command containing `.sh` — doesn't interfere."*
   - The batch portion hunts for `C:\Program Files\Git\bin\bash.exe`, then `C:\Program Files (x86)\Git\bin\bash.exe`, then `where bash` on PATH; **if none found, `exit /b 0` (fail-open)** with a comment "plugin still works, just without SessionStart context injection".
   - `run-hook.cmd` has LF endings (works as a `.cmd` anyway); `session-start` has `#!/usr/bin/env bash` + LF; it emits `{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"..."}}` JSON on stdout. (This is the exact mechanism that produced the `<EXTREMELY_IMPORTANT>` block at the top of this session — proof the injection path works on this machine.)

3. **`cmd.exe` chain semantics** (via the PowerShell tool, to avoid MSYS path-mangling of `/c`):
   ```
   cmd /c "echo A && exit /b 5 && echo B-should-not-print"   →  prints "A", exit 5  (chain stopped, code propagated)
   cmd /c "echo P1 && echo P2 && echo P3"                    →  prints all three, exit 0
   ```
   → `&&` chaining in `cmd.exe` **does** short-circuit on first failure and **does** propagate that command's exit code. (`&` — single — does not; only `&&`.)

4. **`bash` availability for the hook process.** `where.exe bash` → (empty). `where.exe sh` → (empty). `where.exe git` → `C:\Program Files\Git\cmd\git.exe`. PATH entries containing Git: only `C:\Program Files\Git\cmd`. → A hook command of the form `bash foo.sh`, or one that triggers CC's `.sh`→`bash` auto-prepend, **cannot find bash** on this machine; only an explicit hardcoded path (`"C:\Program Files\Git\bin\bash.exe"`) or `node`-based hook works without setup.

5. **bash CRLF tolerance** (scratch). Wrote `crlf-test.sh` (CRLF endings) and `lf-test.sh` (LF). `bash crlf-test.sh` → `crlf-script-ran`, exit 0; `./crlf-test.sh` → same. → **This machine's MSYS bash 5.2.37 tolerates CRLF** in simple scripts. (Version-dependent; the repo's `.gitattributes eol=lf` discipline is still the right call.)

6. **PostToolUse chain simulation** (scratch). Built `tmp/hook-investigation/posttooluse.cmd` (a `run-hook.cmd`-style polyglot wrapper) + `tmp/hook-investigation/posttooluse` (extensionless bash: reads JSON on stdin, runs `prettier`-stand-in → `eslint`-stand-in → `npx --no-install tsc --noEmit`, propagates exit code). Fed it mock CC hook JSON (`{"hook_event_name":"PostToolUse","tool_name":"Edit","tool_input":{"file_path":"...src\\hooks\\useAuth.ts"},"cwd":"C:\\Projects\\Nook",...}`) on stdin:
   - Invoked **directly via `bash posttooluse`**: read 183 stdin bytes, ran all 3 steps, `tsc exit=0`, top-level exit 0. ✅
   - Invoked **via `cmd //c "tmp\hook-investigation\posttooluse.cmd"`** (simulating CC-on-Windows): **failed** — `'tmp' is not recognized as an internal or external command`, exit 1. The failure is a relative-path/forward-slash artefact of *my* MSYS-side invocation, not of the wrapper concept (the superpowers wrapper uses `%~dp0` — the script's own absolute dir — specifically to dodge this). It does, however, underline that **path handling in Windows hook commands is fiddly**.

7. **tsc failure surface** (scratch). Created `tmp/hook-investigation/tserr/bad.ts` (`const x: number = "...";`) + a minimal `tsconfig.json`; `npx --no-install tsc -p tsconfig.json` → `bad.ts(1,7): error TS2322: Type 'string' is not assignable to type 'number'.` on **stdout**, exit code **2**. → A hook that runs `tsc` and exits with tsc's code surfaces exit 2, but the diagnostic text is on **stdout**, not stderr.

8. **The dormant `simple-git-hooks` tsc hook.** `.git/hooks/pre-commit` exists (226 B, `#!/bin/sh`, LF endings, body `npx tsc --noEmit` after a `SKIP_SIMPLE_GIT_HOOKS` guard) — i.e. `npx simple-git-hooks` *was* run at some point. But `core.hooksPath=.githooks`, so git ignores `.git/hooks/` entirely and runs only `.githooks/pre-commit` (the KI-02 canonical-stamp check). The `package.json` has the `"simple-git-hooks": {"pre-commit": "npx tsc --noEmit"}` config but **no `prepare`/`postinstall`** to re-install the shim. Git invokes `.git/hooks/*` via its *own bundled sh* (`C:\Program Files\Git\bin\` — which git knows about even though it's off PATH), so the shim is fully functional; it's just unreachable.

9. **Tree-state check** after all scratch work: `git status --short` showed only `tmp/...` and `docs/audits/...` untracked — no modified/staged files, nothing outside the scratch path touched. Scratch dir then removed.

---

## Findings per failure class

### Line endings
- Repo hook scripts are LF (`.gitattributes` enforces `eol=lf` for `*.sh` and `.githooks/**`). This machine's MSYS bash 5.2.37 *also* tolerated CRLF in a hand-made test script. **Not a hard blocker here.** Caveats: (a) CRLF tolerance varies by bash/MSYS version — keep the `.gitattributes` discipline; (b) `cmd.exe` batch files (`.cmd`/`.bat`) are conventionally CRLF but the superpowers `run-hook.cmd` works with LF — low risk; (c) the real LF/CRLF danger is *editing a hook script with a CRLF-defaulting editor and committing it without `.gitattributes` coverage* — Phase 1 should extend `.gitattributes` to any new `scripts/hooks/**` path.

### Shell choice
- **Claude Code on Windows runs hook `command` strings via `cmd.exe`.** Evidence: the superpowers plugin's `run-hook.cmd` polyglot ("On Windows: cmd.exe runs the batch portion…"), and the documented `.sh`→`bash` auto-prepend behavior. There is no sign CC uses PowerShell or Git Bash for hooks by default.
- **`bash.exe` is not on PATH for that `cmd.exe`.** A hook `command` like `"bash scripts/hooks/x.sh"` or `"scripts/hooks/x.sh"` (which CC may rewrite to `bash scripts/hooks/x.sh`) **will not resolve bash** on this machine. Working options: (i) `node` script (`"command": "node scripts/hooks/x.js"`) — `node` *is* on PATH; (ii) a `.cmd` polyglot wrapper that hardcodes the Git-bundled bash path (the superpowers pattern); (iii) absolute `"C:\\Program Files\\Git\\bin\\bash.exe" scripts/hooks/x.sh` (brittle — assumes that install location).
- A bash one-liner as the hook command (`prettier --write "$F" && eslint --fix "$F" && tsc --noEmit`) is parsed by **cmd.exe**: `&&` works, but `$F`/`"$F"` do not expand (cmd uses `%F%`), single-quoted args don't work, `&&` precedence differs. So the proposed chain commands, if written bash-style, are broken on Windows regardless of tool availability.

### stderr swallowing
- Not directly observable without a live hook. What *is* known: the SessionStart injection (stdout JSON) reached the model — so the stdout-JSON path works. For PostToolUse/Stop, the CC hook protocol shows **stderr** to the model on **exit code 2** (and shows stdout only in transcript/verbose mode). Practical consequence for this chain: `tsc` and `eslint` write diagnostics to **stdout**; a hook that just runs them and forwards their exit code will exit 2 with the useful text on stdout → **the model may not see the actual errors**. The hook must capture and re-emit on stderr (or print a stderr summary). Whether CC 2.1.139's *VS Code extension* surfaces hook stderr to the model the same way the headless CLI does is an **open question** (see below).

### Exit code propagation
- At the shell layer: `cmd.exe` `&&` chains short-circuit and propagate the failing command's exit code (tested). So a `cmd /c "prettier ... && eslint ... && tsc ..."` halts at the first failure and exits non-zero — chaining/halt semantics are fine *if `&&` is used*.
- At the hook→CC layer (reasoned, not tested): a PostToolUse hook exiting 2 feeds stderr back as context (does not undo the edit); a Stop hook exiting 2 blocks the stop and feeds the reason back. Whether CC 2.1.139 in the extension does this reliably and visibly is an open question.

### Hook chaining order
- Within a single `hooks` array under one matcher, CC runs entries in array order (documented). **Cross-source ordering** (plugin hooks vs project `.claude/settings.json` vs user `~/.claude/settings.json` vs enterprise) was **not verified** here — there's only one active hook on this machine (the superpowers SessionStart). If Phase 1 adds project-level PostToolUse hooks alongside any future plugin PostToolUse hooks, the relative order should be confirmed empirically before relying on it.

### Performance
- `node` cold start ≈ 41 ms (cheap). `npx` resolution overhead ≈ 600 ms *per invocation* even for a locally-installed package — so `"npx tsc --noEmit"` ≈ 0.6 s + ~3.5 s ≈ **~4 s**; calling `node_modules\.bin\tsc.cmd` directly saves the 0.6 s.
- `tsc --noEmit` on the repo: **~3.5–4.0 s** warm.
- A full PostToolUse chain (prettier ~0.5–1 s on one file + eslint ~1–3 s + tsc ~3.5–4 s, plus npx overhead if used) ≈ **7–10 s+ per Edit/Write** — at or past the "development drag" line (the brief's threshold: <5 s good, >10 s a drag). Per-edit `tsc` over the *whole* project is the dominant cost and doesn't get cheaper with a one-file edit.
- A Stop hook running `tsc` + the jest suite: `tsc` ~4 s + `jest-expo` cold start (typically 5–15 s+ on Windows; the repo has `jest-expo@^55`, 5 test files) ⇒ a **~10–20 s pause at every Stop**. Heavy for solo dev.

### PII reminder injection
- The injection mechanism (`{"hookSpecificOutput":{"hookEventName":"...","additionalContext":"..."}}` on stdout, exit 0) **works on this machine** — it's the same mechanism the superpowers SessionStart hook uses, and that hook's output is visible in this session (wrapped as a `<system-reminder>` carrying the content). A PostToolUse matcher on `src/services/sentry.ts` / `src/services/posthog.ts` (etc.) emitting an `additionalContext` reminder, exit 0, is **low-risk** — the only Windows caveat is the universal one: the command must actually execute (so: `node` script, or `.cmd`-wrapped bash, not a bare `.sh`/bash one-liner). What it looks like to the session: extra context appended around the tool result (for SessionStart it arrived as a `<system-reminder>` block; PostToolUse `additionalContext` is presented similarly).

### Tool availability (added failure class)
- **prettier and eslint are not installed**, and there is **no working eslint config** (the `.eslintrc.json` is legacy format that ESLint 10 ignores by default; there is no `eslint.config.js`). The PostToolUse chain as written (`npx prettier --write`, `npx eslint --fix`) would, on first run, trigger an interactive/network `npx` install of `prettier@3.x` and `eslint@10.x` — slow, and **fails in an offline/locked-down environment**. This is a Phase-1 **prerequisite**, not a runtime detail: either add `prettier` + `eslint` + a flat `eslint.config.js` (the repo already wants the hex-ban rule that's stranded in `.eslintrc.json`), or drop those two stages from the chain. `tsc` is fine (installed, local).

### CC-vs-Bash-tool environment asymmetry (added)
- The Bash *tool* runs in a fully-provisioned Git Bash with bash/coreutils/etc. on its path. **Hook commands do not inherit that** — they run via `cmd.exe` with the plain Windows PATH (bash absent). Don't reason about hook reliability from "the Bash tool can do X"; they're different execution contexts.

---

## The dormant `tsc` pre-commit hook — what it tells us

- **Why it's dormant:** purely the `core.hooksPath=.githooks` redirect. `.git/hooks/pre-commit` (the `simple-git-hooks` shim: `#!/bin/sh`, LF, `npx tsc --noEmit` behind a `SKIP_SIMPLE_GIT_HOOKS` guard) is present and intact — `npx simple-git-hooks` was run at some point — but git never looks in `.git/hooks/` while `core.hooksPath` points elsewhere, so it never executes. There's also no `prepare`/`postinstall` script, so a fresh `npm install` wouldn't re-install it. It is **not broken, not intentionally disabled in itself — just shadowed**, and `CLAUDE.md` still documents it as the active pre-commit hook ("Pre-commit hook (v4)"), which is stale.
- **Would it work if re-enabled?** Yes — and this is the useful baseline. *Git* invokes `.git/hooks/*` (and `.githooks/*`) through its **own bundled sh** at `C:\Program Files\Git\bin\` (git knows that path even though it's off the system PATH), so an `sh`-shebang hook with LF endings runs reliably. The active `.githooks/pre-commit` (a `#!/usr/bin/env bash` script doing the KI-02 canonical check) proves this works *today* on this Windows machine. **Implication:** *git-invoked* hooks (pre-commit, pre-push) are a **more reliable substrate on Windows** than *Claude-Code-invoked* hooks, because git solves the "find bash" problem for you and CC does not. Several items in the proposed chain (block commits/pushes on `main`, run `tsc --noEmit` before commit) could live as **git pre-commit/pre-push hooks chained off `.githooks/`** instead of CC PreToolUse/Stop hooks, and would be sturdier there. (Caveat: git hooks only fire on `git commit`/`git push` *invocations* — they don't see edits, and a `--no-verify` bypasses them; CC hooks see every tool call. Different coverage, not a drop-in swap.)

---

## Recommendation — per proposed hook

| Proposed hook | Verdict |
|---|---|
| **PreToolUse** — block `.env*` edits; block commit/push on `main`; block `rm -rf`/`rm -fr`; block bash patterns (`:secret`, `BEGIN PRIVATE KEY`, AWS keys) | **Needs adaptation.** (1) Implement as a `node` script (`"command": "node scripts/hooks/pre-tool-use.js"`) — `node` is on PATH (~40 ms); regex-matching `tool_input.file_path` / `tool_input.command` in JS is trivial and Windows-clean. Do **not** write it as a bash one-liner or a bare `.sh` (bash isn't on PATH). (2) It **must fail closed** — if the script errors or its runtime is missing, it must exit 2 (block), never 0; a security gate that fails open (the superpowers wrapper's choice for a *context* hook) is worse than no gate. (3) The "block commit/push on `main`" rule is *also* worth duplicating as a git `pre-commit`/`pre-push` hook off `.githooks/` (sturdier substrate; catches `git` invocations the CC hook can't see — e.g. from a terminal). |
| **PostToolUse** on `Edit\|Write` — prettier → eslint `--fix` → `tsc --noEmit` | **Needs adaptation + has a prerequisite gap.** (1) **prettier and eslint are not installed and there's no usable eslint config** — Phase 1 must either `npm i -D prettier eslint @eslint/js typescript-eslint` and add a flat `eslint.config.js` (folding in the hex-ban rule currently stranded in `.eslintrc.json`), or drop those two stages. (2) Don't write the chain as a bash one-liner — wrap (`.cmd` polyglot like superpowers') or implement as a `node` script that spawns the tools. (3) Call `node_modules\.bin\{prettier,eslint,tsc}.cmd` directly, not via `npx` (saves ~0.6 s each). (4) `tsc`/`eslint` emit diagnostics on **stdout**; the hook must re-emit a summary on **stderr** so the model sees failures on an exit-2. (5) **Latency**: full chain ≈ 7–10 s+ per edit — borderline. Recommend: run prettier + eslint on the *changed file only* (fast) on PostToolUse, and move whole-project `tsc` to the **Stop** hook (or a debounce), not every edit. |
| **Stop** hook — re-run `tsc --noEmit` + test command, surface failures | **Needs adaptation (scope it down).** `tsc` (~4 s) + `jest-expo` cold start (~5–15 s+) ⇒ a ~10–20 s pause at every Stop — too heavy. Recommend `tsc`-only on Stop (or `tsc` + a fast targeted test subset, not the full `jest` run). Same caveats: wrap Windows-safely (node or `.cmd`), re-emit `tsc` stdout on stderr, exit 2 with the reason on stderr to actually block the stop. The "exit-2 blocks the stop and feeds the reason back" part of the protocol is sound *in principle* — see Open Questions for the residual uncertainty about the extension UI. |
| **PII reminder injection** on Sentry/analytics edits | **Ships as specced** (with the universal wrapper caveat). The `hookSpecificOutput.additionalContext` mechanism is the exact one the superpowers SessionStart hook uses and it demonstrably works on this machine. Implement as a small `node` PostToolUse hook matched on `src/services/sentry.ts` / `src/services/posthog.ts` / `src/services/engagement.ts` (and `app/(auth)/sign-up.tsx`, which also touches the PII boundary — see the repo audit), emitting an `additionalContext` reminder and exit 0. Lowest-risk of the four. |

**Cross-cutting Phase-1 prerequisites** (not "fixes" — facts the install must account for): (a) decide the hook-script *runtime* — recommend **node** for CC hooks (on PATH, no wrapper needed) and **sh** for git hooks (git provides bash); avoid bare-`.sh` CC hooks. (b) Install + configure prettier and eslint, or remove them from the chain. (c) Extend `.gitattributes` to any `scripts/hooks/**` path. (d) Confirm hook stderr surfacing and Stop-block behavior in CC 2.1.139's VS Code extension with one throwaway hook *before* building the full chain (the cheapest possible probe — a `node -e "console.error('hook fired'); process.exit(2)"` PostToolUse hook — but that requires editing real settings, which was out of scope here).

---

## Open questions

1. **Does CC 2.1.139's VS Code extension surface a PostToolUse/Stop hook's stderr to the model on exit 2** the same way the headless CLI does? Not testable without editing protected settings. This is the single biggest residual unknown for the PostToolUse/Stop hooks — if stderr isn't surfaced in the extension, "surface failures" has to be done via `additionalContext` instead.
2. **Cross-source hook ordering** (plugin vs project `.claude/settings.json` vs user vs enterprise) when multiple hooks match the same event — only one active hook exists on this machine, so unverified.
3. **Does CC 2.1.139 still do the `.sh`→prepend-`bash` auto-detection** the superpowers comment describes? The plugin keeps its `.cmd` workaround regardless, so it couldn't be inferred from behavior; would need a deliberate test.
4. **Exact UX of a Stop hook that exits 2** in the extension (does it visibly re-prompt? silently loop? show the reason inline?) — not testable here.
5. **Does `npx` actually prompt or silently auto-install** when a hook references an absent package (prettier/eslint) in CC's non-interactive hook context, or does it just fail? `npx --no-install` was used to avoid finding out; the real chain would use bare `npx`, and CC's hook stdin/tty handling could make this hang or fail differently than at an interactive prompt.
6. **`async: true` hooks** — whether error/stderr surfacing differs for async hooks on Windows was not probed (the superpowers hook is `async: false`).

---

## Closing

Report written to `docs/audits/hook-windows-investigation-2026-05-09.md`.

**5-line summary of the most material findings:**
1. Hooks *do* fire on this Windows + VS Code + CC 2.1.139 setup — the superpowers plugin's SessionStart hook injected context into this very session — so the *mechanism* is sound; the proposed chain does **not** ship as-specced.
2. CC runs hook `command` strings via **`cmd.exe`**, and **`bash.exe` is not on that process's PATH** — so bash one-liners and bare `.sh` hooks fail; hooks must be `node` scripts (node *is* on PATH) or `.cmd`-wrapped bash (the superpowers `run-hook.cmd` pattern, which hardcodes the Git-bundled bash path).
3. **Prettier and ESLint aren't installed** and there's no working ESLint config — the PostToolUse chain references tools that don't exist; Phase 1 must install+configure them or drop those stages.
4. **Latency**: any `tsc` hook ≈ ~4 s; the full prettier+eslint+tsc PostToolUse chain ≈ 7–10 s+ per edit (a development drag); a Stop hook adding `jest` ≈ 10–20 s — recommend per-file prettier/eslint on edits, `tsc`-only (no full jest) on Stop, call `.bin\*.cmd` not `npx`, and re-emit tsc/eslint stdout on stderr so failures are visible.
5. The dormant `simple-git-hooks` tsc hook is dormant only because `core.hooksPath=.githooks` shadows `.git/hooks/` — it's intact and *git-invoked* hooks (which git runs through its own bundled bash) are the **more reliable Windows substrate**; the "block main commits/pushes" and "tsc before commit" items could live there instead of as CC hooks.
