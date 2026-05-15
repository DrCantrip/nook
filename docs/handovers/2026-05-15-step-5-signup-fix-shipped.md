# Cornr session handover — 15 May 2026

## Session shape

Discipline-pack work day. Step 4 closed (stamp-bump, Phase 1.0 stderr probe, parked-index, MC v14 render). Step 5 closed (SIGNUP-PUBLIC-USERS-SYNC staging fix).

## Ships

- `d99a0ea` — Canonical stamp-bump: `CANONICAL-SHA` + `LAST-SYNCED-PK` both set to `9859cd5` (PK-sync ritual closed)
- `52c7fdf` — Phase 1.0 stderr probe: CC VS Code extension surfaces hook stderr to model on exit 2 via `<system-reminder>` envelope (CLI-parity confirmed). Audit at `docs/audits/phase-1-stderr-probe-2026-05-13.md`. Three side-findings banked: hot-reload of `.claude/settings.local.json` works; PostToolUse exit 2 surfaces but does NOT roll back; hook command strings echoed verbatim to model context.
- `186c5b8` — Parked-index recovery surface: `docs/operations/mc-parked-tasks-2026-05-15.md` carries 152 task IDs from v10/v12/v13 MC files. Recovery surface for tasks not carried into v14.
- `d0f5aef` — SIGNUP-PUBLIC-USERS-SYNC fix (staging only): trigger migration extending `handle_new_user` to project consent flags from `raw_user_meta_data` to `public.users`, `useAuth.signUp` wrapper extension for backward compatibility, `app/(auth)/sign-up.tsx` removal of broken `.update()`, ADR-001 documenting the decision. Production migration deferred to follow-up LR-PROD-SYNC packet.

## Claude.ai-side artefacts (not in repo)

- **MC v14** rendered as read-only visualizer widget in claude.ai chat "Investigation reports reconciliation process" (or the chat where the 15 May discipline-pack session ran). Storage key `cornr-mc-2026-04-12` unchanged from v12/v13 era — but v14 is a render-time component, not localStorage-hydrated. To update v14, re-render in claude.ai.

## Current state (verified at session close)

- Branch: `feat/reveal-1b-two-experience` at `d0f5aef` on origin
- Working tree: clean
- Drift: exit 0
- `CANONICAL-SHA = LAST-SYNCED-PK = 9859cd5`
- ADR-001 is the first ADR in the repo (`docs/adr/ADR-001-signup-consent-trigger-mirror.md`)

## SIGNUP runtime smoke status: NOT RUN

The `+audit15` / `+audit16` staging signup verification was not executed at session close. SIGNUP-PUBLIC-USERS-SYNC is provisionally-closed on staging based on synthetic INSERT verification (run in-session by CC against staging via `mcp__supabase__apply_migration` + smoke INSERT + cleanup). Full runtime closure requires the phone-side `+audit15`/`+audit16` flow.

**Smoke procedure (5 min):**

1. App on phone/simulator pointed at staging (`tleoqtldxjlyufixeukz`).
2. Signup `daryll.cowan+audit15@gmail.com`, both opt-ins TRUE.
3. SQL on staging:
```sql
   select id, email, email_marketing_opt_in, audience_data_opt_in, created_at
   from public.users
   where email like 'daryll.cowan+audit15%'
   order by created_at desc limit 1;
```
   Expect both flags `true`.
4. Repeat with `+audit16`, both opt-ins FALSE. Expect both `false`.

Run before LANE A (skill authoring) — the skill's pitch is "preflight catches assumption misalignment" and the staging fix is its retrospective validation case. Authoring on top of an unverified fix undermines the validation.

## Stale-anchor warnings for next session

- (a) 14h/week build budget. Dan meeting cancelled — no deadline driver.
- (b) SIGNUP staging fix landed; PRODUCTION trigger still has pre-fix body. Prod migration MUST ship before TestFlight signups begin. Zero-user gap currently (TestFlight not open). Hard dependency.
- (c) MC v14 is read-only visualizer in claude.ai (not localStorage-hydrated like v10/v12/v13). Update by re-render. Cadence rule R-42 candidate pending next canonical-open: "MC current at end of every planning session".
- (d) Sentry org is US region, not EU. SENTRY-EU-MIGRATION open P1.
- (e) Archetype set locked 7 May: Curator/MCM, Nester/Coastal, Maker/Industrial, Minimalist/Japandi, Romantic/French Country, Storyteller/Eclectic Vintage, Urbanist/Urban Contemporary. Dead names — never reuse: Warm Scandi, Traditionalist, Free Spirit, Purist, Modernist, Dreamer.
- (f) CC scope-creep pattern continues. `d0f5aef` expanded 3 files → 4 files (added `useAuth.ts`) for correct technical reasons (preserving anon-upgrade path). Expansion was right; the prompt should have anticipated the wrapper.
- (g) Phase 1.0 stderr probe finding (13 May): PostToolUse hooks persist in-memory across `.claude/settings.local.json` revert. Hot-reload is one-way. The 13 May probe hook fired through the entire 15 May session as a latent surprise. R-25 sub-rule candidate: "Hot-reload of settings.local.json is one-way; hook removal requires CC restart."
- (h) **Memory addressing split (new):** claude.ai memory uses numeric entries (1, 2, 5, 21, 26 etc.) — only readable from claude.ai chats. Claude Code memory uses slug-keyed files at `~/.claude/projects/c--Projects-Nook/memory/MEMORY.md` — only readable from CC. Handovers must not tell CC to "read memory entry 5" — either summarise inline or point at the right slug file.
- (i) **Handovers must land on disk (new):** Latest file in `docs/handovers/` before this one was 24 Apr (21 days stale). Recent handovers lived in claude.ai scrollback only — a regression. Every claude.ai-authored handover at session close ships as `docs/handovers/{date}-{topic}.md` via a Claude Code commit.

## Step 6 — lane choice

Four lanes viable. Recommendation: LANE A, after smoke.

**LANE A — Author feature-spec skill (~2-3h).** Use `d0f5aef` as the retrospective validation case. Skill captures spec-then-build pattern: read audit/investigation report, surface scope-defining assumptions in preflight, write prompt with explicit stop conditions when assumptions don't hold (mirrors what `d0f5aef`'s preflight successfully caught when the trigger didn't read `raw_user_meta_data`). Output: `.claude/skills/feature-spec.md` or equivalent. SMALL critique.

**LANE B — Phase 1 hooks install (~6-8h).** Heaviest. PreToolUse fail-closed, PostToolUse scoped, Stop tsc-only, PII reminder. Node-script implementation. Stderr re-emission confirmed (Phase 1.0 probe). Restart CC after install before testing failure cases (per stale-anchor g). MEDIUM critique.

**LANE C — SENTRY-EU-MIGRATION decision (~2-4h).** Manual decision: accept US region or migrate. Decision-only fits tired window; migration itself separate session. Affects GDPR posture + TestFlight gate. SMALL critique on decision.

**LANE D — Prod migration dispatch for SIGNUP fix (~1-2h).** Ship consent propagation migration to production Supabase (`jsrscopoddxoluwaoyak`) via follow-up LR-PROD-SYNC packet. Mechanical. No code change. Closes prod gap before TestFlight-gating moves forward. No immediate forcing function (TestFlight blocked behind DUNS-1, ~3-4wk from 30 Apr).

**LANE PRE — Smoke test (~5 min).** Runs before LANE A. Verifies the staging fix end-to-end. If skipped, LANE A's validation framing is on unverified ground.

Recommended sequence: LANE PRE → LANE A. Or LANE PRE → LANE D if you want a guaranteed-low-friction win first.

## Open questions carried forward

- ADR-001 anon-upgrade latency: when `signInAnonymously` gets wired anywhere, re-verify upgrade path covers consent metadata propagation.
- Probe hook persistence: confirm whether the hook survives full CC process restart (probably not, worth verifying next CC session).
- R-25 sub-rule candidates pending next canonical-open: "PostToolUse surfaces not blocks" + "Hot-reload is one-way".
- Inv B Q2 (cross-source hook ordering): resolves during Phase 1 install.
- Inv C Q3 (email confirmation toggle history on staging): defer.

## Carry-forwards for session-handover skill (Phase 5+ authoring)

- **Memory addressing split** must be named: claude.ai numeric vs CC slug-keyed. Don't address one from the other.
- **Handovers ship to disk via CC commit**, not scrollback. Mandatory step at session close.
- **CC scope-creep pattern is recurring.** Prompts touching client auth flows must enumerate which auth functions wrap the operation being modified.
- **Investigations are narrowly scoped — adjacent state passes unnoticed.** Investigation C surfaced the prior-trigger state but the SIGNUP prompt didn't probe "what does the live trigger project". When an investigation says "trigger is live", the prompt should still verify "trigger does what we think it does".
- **Probe artefacts can persist beyond declared cleanup boundaries.** Cleanup verification needs an in-process check, not just a file-system check. Hot-reload is one-way per finding (g).
- **Stamp-bump must update both `CANONICAL-SHA` and `LAST-SYNCED-PK`** after canonical amend. They must be string-equal for `drift exit 0`. Single-stamp bumps stall drift.
- **Single-digit ADR numbering established.** ADR-001 is the first.
- **PK-uploaded canonical content is one stamp-commit stale by design** post-bump. That's the steady state, not a defect. Self-reconciles next PK re-upload.

## For next canonical-open session

- R-40 candidate: "No secrets in hook command strings — env vars or out-of-band scripts only."
- R-41 candidate: "Audits classify documented deviations as {accepted, open-for-decision, open-blocker}."
- R-42 candidate: "MC brought current at end of every planning session."
- R-25 sub-rules: "PostToolUse surfaces not blocks; PreToolUse for block-actions, PostToolUse for surface-only." Plus: "Hot-reload of `settings.local.json` is one-way; hook removal requires CC restart."
- Section 6 row reconciliation (MC-PATCH-16 deferred): drop `trades_waitlist`, add `consent_events` + `editorial_content` + `archetype_history` + `engagement_events`.
- KI-02 pointer relocation from §14 to §13 footnote or new §15.
- ADR-001 referenced from canonical (decisions log + Section 6 if schema-touching detail belongs there).

## Warm-up ritual for next session

1. Read this handover.
2. Read claude.ai memory (entries 2, 5, 10, 12, 21, 26) — claude.ai-side only.
3. Run `bash scripts/drift/check.sh`. Expect exit 0.
4. Sanity-check `d0f5aef` is the actual HEAD on `feat/reveal-1b-two-experience`.
5. State-match in 2-3 sentences before producing anything.
6. Wait for confirmation.
