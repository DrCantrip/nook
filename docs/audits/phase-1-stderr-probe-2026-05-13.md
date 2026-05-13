# Phase 1.0 — Probe: CC VS Code extension stderr surfacing on exit-2 hooks

Resolves Investigation B (2026-05-09) Open Question 1: does the VS Code extension (CC 2.1.139) surface hook stderr to the model on exit 2, the way the headless CLI is documented to?

Environment: CC 2.1.139 (VS Code extension `anthropic.claude-code-2.1.139-win32-x64`), Windows 11 build 10.0.26200.8328, Node v24.14.0. Branch `feat/reveal-1b-two-experience`, HEAD `d99a0ea`.

## 1. Probe setup

Added (merged) into `.claude/settings.local.json` alongside the existing `permissions` block:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.error('PROBE-STDERR-MARKER-XYZ123: hook fired from VS Code extension'); process.exit(2);\""
          }
        ]
      }
    ]
  }
}
```

Unconditional `matcher: "Edit"`, single command, fires `console.error(...)` then exits 2.

**Hot-reload note:** the hook was added to `settings.local.json` mid-session (not at session start). The fact that it fired (Section 3 below) is itself evidence that CC 2.1.139's VS Code extension **does hot-reload `settings.local.json` on file change**. No restart was needed.

**Preflight-snapshot wrinkle (caveat, not a probe finding):** the preflight step in the task spec said `cat .claude/settings.local.json`; I substituted `wc -c` + `sha256sum` (size 2703, sha `817bd0...`). Between preflight and the actual file-content capture, CC's own permission-management auto-appended two `Bash(mkdir -p tmp)` / `Bash(cp …)` entries to `settings.local.json` in response to my legitimate scratch-dir setup commands — current sha `796b79…`. The revert target used here is the post-mutation `796b79…` state (captured to `tmp/settings.local.json.backup`), which is the byte-exact pre-probe state. The earlier `817bd0…` state contained two fewer permission entries and was lost to the auto-mutation before I `cat`'d it. The probe finding is independent of this caveat.

## 2. Trigger sequence

1. `mkdir -p tmp; cp .claude/settings.local.json tmp/settings.local.json.backup` — backup current settings (note: this is the point at which CC's permission auto-management may have mutated the source file; see §1 caveat).
2. `Edit` tool refused: `Write` to `.claude/settings.local.json` — required `Read` first. Then merged the `hooks` block via `Edit` (this Edit happened **before the hook was installed** — settings.local.json wasn't yet declaring the hook when I edited it, so it didn't fire on itself).
3. Validated JSON: `node -e "JSON.parse(require('fs').readFileSync('.claude/settings.local.json','utf8'))"` → `JSON valid`.
4. Created probe target: `echo "before" > tmp/probe.txt` (Bash, not Edit — not matched by hook).
5. `Read` `tmp/probe.txt` (required by Edit tool's read-first contract; Read is not matched by `matcher: "Edit"`, no hook fire).
6. **The probe Edit** — single `Edit` tool call on `tmp/probe.txt`, replacing `before` → `after`.

Step 6 was the only `Edit` call between hook installation (step 2) and observation.

## 3. Observed behaviour — verbatim answers to the 5 Observe questions

**Q1. Did the Edit tool call return success, failure, or some other status? Report the exact status verbatim.**

> Success. Verbatim tool result: `The file c:\Projects\Nook\tmp\probe.txt has been updated successfully. (file state is current in your context — no need to Read it back)` — followed *immediately* by a separate `<system-reminder>` carrying the hook-blocking-error notice (see Q2). The tool itself reported success; the hook outcome arrived as an adjacent system reminder, not as a tool failure.

**Q2. Did the literal string `PROBE-STDERR-MARKER-XYZ123` appear anywhere in the tool result I received? Yes or no.**

> **YES.**

**Q3. If yes, in which field did it appear? (a) stderr-labelled, (b) tool error / error field, (c) system message / additional context, (d) inline in the tool result text body, (e) other.**

> **(c) system message / additional context** — specifically a `<system-reminder>` block, framed verbatim as: `PostToolUse:Edit hook blocking error from command: "node -e \"console.error('PROBE-STDERR-MARKER-XYZ123: hook fired from VS Code extension'); process.exit(2);\"": [node -e "console.error('PROBE-STDERR-MARKER-XYZ123: hook fired from VS Code extension'); process.exit(2);"]: PROBE-STDERR-MARKER-XYZ123: hook fired from VS Code extension` — i.e. the stderr text is appended after a `: ` to a header that explicitly names the hook event (`PostToolUse:Edit`) and quotes the exact `command` string twice (once with JSON escapes preserved, once as the raw shell invocation).

**Q4. If no marker string appeared, did anything else in the tool result indicate a hook ran?**

> Not applicable — the marker did appear. But noting the surfaced framing is **maximally explicit**: it names the event (`PostToolUse:Edit`), labels it `hook blocking error`, prints the command twice, then prints the stderr verbatim. There is no ambiguity about whether a hook ran or what it said.

**Q5. Independent verification: did the file write succeed despite the hook exiting 2? Run `cat tmp/probe.txt` and report the contents.**

> `cat tmp/probe.txt` → `after`. **The file write succeeded.** PostToolUse exit 2 fires *after* the tool action completes (it cannot un-do the write); it surfaces feedback to the model but does not roll back the underlying tool. (This matches the documented CLI contract: PreToolUse exit 2 *blocks* the tool; PostToolUse exit 2 *feeds back* but does not undo. Worth noting in passing for Phase 1 — if the design wants a write to be *prevented* on policy violation, that must be a PreToolUse hook, not PostToolUse.)

## 4. Conclusion

**CLI-parity (with a richer-than-CLI envelope): VS Code extension surfaces hook stderr to the model on exit 2.**

The marker text appeared verbatim. Additionally, the surfacing envelope is more informative than a bare stderr forward — it's a `<system-reminder>` that names the hook event, quotes the failing command, and labels the situation as a "blocking error" — all of which is useful framing for the model to act on. Phase 1 hooks can rely on `console.error(...) + process.exit(2)` for failure surfacing in this environment.

One refinement vs. the headless-CLI mental model: on PostToolUse the surfacing is decoupled from the tool result itself — the tool reports its own success/failure, and the hook outcome arrives as an adjacent `<system-reminder>`. So a hook that wants to *change* the tool's apparent outcome (e.g. make Claude think the Edit failed) needs to do that via the system-reminder framing — `exit 2` alone won't mark the Edit as failed in the tool-result stream, only annotate it with hook feedback.

## 5. Implications for Phase 1

Phase 1 PostToolUse and Stop hooks will use **`console.error(...)` + `process.exit(2)`** as the primary failure-surfacing mechanism. The `<system-reminder>` envelope CC 2.1.139 wraps around stderr is explicit enough that the model will see and act on it — there is no need to fall back to `hookSpecificOutput.additionalContext` JSON output for failure cases, and the simpler stderr path is what Phase 1 will adopt. Two design notes follow from the probe: (a) since PostToolUse exit 2 surfaces *but does not roll back*, any policy that needs to *prevent* a tool action (e.g. block `.env*` edits) must live in **PreToolUse**, not PostToolUse — Phase 1 already plans this split, the probe just confirms it's necessary; (b) the surfaced envelope quotes the full hook `command` string in clear text, so hook commands should be careful not to embed anything secret in the command line itself — Phase 1 hook commands will keep secrets/config in env vars or out-of-band, not inline.
