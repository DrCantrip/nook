# Mission Control patches — 2026-05-12 (discipline-pack Step 3)

Patches to apply to the runtime Mission Control artefact in claude.ai localStorage. The MC is not stored in the repo, so this file captures the patch list for manual application by Daryll.

Source investigations:
- [docs/audits/repo-audit-2026-05-09.md](../audits/repo-audit-2026-05-09.md) — Investigation A
- [docs/audits/hook-windows-investigation-2026-05-09.md](../audits/hook-windows-investigation-2026-05-09.md) — Investigation B
- [docs/audits/signup-sync-archaeology-2026-05-09.md](../audits/signup-sync-archaeology-2026-05-09.md) — Investigation C

15 patches total.

---

## Resequence

- [ ] **MC-PATCH-1 — SIGNUP-PUBLIC-USERS-SYNC is the validation task for the feature-spec skill** (replaces HOME-SIGNOUT-01, which shipped in `af1ce20`). Total scope **5–6 h**: 3–4 h trigger-mirror fix + 1–2 h ADR write-up + tests. Per Investigation C, recommended fix scope is Option 2 (trigger-mirror with ADR), confidence high; suggested ADR title *"ADR-NNN — Signup-time consent capture is trigger/server-driven, not a post-`auth.signUp` client write"*.

## Resize

- [ ] **MC-PATCH-2 — Phase 1 hooks task: 3–4 h → 6–8 h.** Reason: node-script implementation required (cmd.exe shell on Windows, bash off-PATH per Investigation B); prettier + eslint install + flat `eslint.config.js` needed; hex-ban rule must be ported from legacy `.eslintrc.json`; stderr re-emission needed for failure visibility (tsc/eslint write diagnostics to stdout but exit-2 surfaces stderr).

- [ ] **MC-PATCH-3 — Branch audit task: lighter than originally scoped.** 48 commits ahead of `main` but **44 clean / 4 large-but-coherent / 0 mixed / 0 concerning** per Investigation A. Audit is **confirm-and-merge** shape, not fix shape.

## New micro-task

- [ ] **MC-PATCH-4 — Phase 1.0: Probe CC 2.1.139 VS Code extension stderr surfacing.** ~30–60 min. Build throwaway PostToolUse hook in `.claude/settings.local.json` with command `node -e "console.error('hook fired'); process.exit(2)"`. Trigger via scratch file edit. Verify model sees stderr on exit 2. **Blocks Phase 1 install** — resolves Investigation B Open Question 1.

## Backlog captures

- [ ] **MC-PATCH-5 — KI-02-STAMP-RITUAL-EXEMPTION.** Dedicated design session needed. KI-02 hook treats stamp-only commits and content-with-stamp commits identically, blocking the historical bump-in-follow-up pattern. Needs a deliberate exemption design.

- [ ] **MC-PATCH-6 — `stash@{1}` 21 Apr reveal-1b WIP.** Investigation A confirms duplicative (work shipped onto branch via regular commits; stash was never popped). **Dropped in this session's Step D** — close-out item only.

- [ ] **MC-PATCH-7 — CONSENT-SOURCE-OF-TRUTH-LOCK.** Before any marketing-send path is built, lock `consent_events` as system of record (NOT `users.email_marketing_opt_in`). Per Investigation C Open Question 5: the `*_opt_in` columns silently carry historical `false` defaults for the 3 stranded staging accounts. If a future job keys sends off those columns, opted-in users get no mail.

## Doc-staleness fixes

- [ ] **MC-PATCH-8 — `CLAUDE.md` "Test strategy" section.** Currently states *"There are NO unit test suites and NONE will be added"* and *"Do not propose adding Jest"*. Reality per Investigation A: `jest-expo` configured inline in `package.json`, `jest.setup.ts` exists, **5 test files** exist (`__tests__/result-fallback.test.tsx` + 4 colocated in `src/`). Rewrite to reflect a **lazy-not-retroactive** policy from discipline-pack adoption.

- [ ] **MC-PATCH-9 — `CLAUDE.md` "Pre-commit hook (v4)" section.** Currently describes the `simple-git-hooks` tsc hook as active. Reality per Investigations A/B: **dormant** because `core.hooksPath=.githooks` shadows `.git/hooks/`. Two resolution paths:
  - (a) revive `simple-git-hooks` tsc by moving KI-02 into `.git/hooks/` alongside, or by removing `core.hooksPath`;
  - (b) rewrite the `CLAUDE.md` section to reflect Phase 1 hook reality once installed.
  - **Recommended: (a)** — a one-line revive that buys tsc-on-commit immediately, ahead of Phase 1.

- [ ] **MC-PATCH-10 — `docs/CORNR_CANONICAL.md` Section 6 expansion.** Covered in the canonical patches landed in this session's Step C — tracking entry only.

- [ ] **MC-PATCH-11 — `docs/operations/security.md` HOME-SIGNOUT-01 entry.** Mark **RESOLVED**; point at commit `af1ce20` (`feat(profile): wire useAuth.signOut to Profile screen`).

- [ ] **MC-PATCH-12 — `docs/operations/security.md` broader triage.** Open items need a status pass — *shipped / still-open / supersede / drop*:
  - ENV-VAR-MIGRATE
  - SIGNUP-EMAIL-REGEX-INCONSISTENT
  - REVEAL-FAILURE-TELEMETRY
  - ANON-PUBLIC-USERS-PATH

## Cleanup

- [ ] **MC-PATCH-13 — `.claude/settings.local.json`.** Strip PowerShell entries pointing at `C:\PZProject` (Project-Zomboid server, unrelated to Cornr). Gitignored so non-propagating, but tidy. Investigation A finding.

## Security drift

- [ ] **MC-PATCH-14 — RLS-DRIFT-CONSENT-EVENTS (P2).** Per Investigation C Open Question 2: live staging `consent_events` INSERT policy is `"Service role can insert consent events"` with `WITH CHECK true` for role `public`. Canonical Section 6 documents `WITH CHECK (auth.uid() = user_id OR user_id IS NULL)`. The loosened policy is **in no migration file in the repo**. Locate provenance, then either restore canonical intent or document the loosened intent as decided.

## Already-shipped close-outs

- [ ] **MC-PATCH-15 — Mark HOME-SIGNOUT-01 complete in MC** wherever it appears (audit found it tagged P1 open; shipped in `af1ce20`).
