# Cornr Build Log

## Completed Tasks

| Sprint | Task | Date | Description | Verified By | Notes |
|--------|------|------|-------------|-------------|-------|
| S0 | T1 | 2026-03-10 | Project scaffold + Expo init | manual | Managed workflow |
| S0 | T2 | 2026-03-10 | Directory structure + base config | manual | |
| S0 | T3 | 2026-03-11 | Design tokens defined | manual | Tailwind config |
| S0 | T4 | 2026-03-11 | Typography scale | manual | |
| S0 | T5 | 2026-03-11 | Border radius tokens | manual | |
| S0 | T6 | 2026-03-12 | Colour palette | manual | primary, teal, warmstone |
| S0 | T7 | 2026-03-12 | CLAUDE.md created | manual | Project rules |
| S0 | T8 | 2026-03-12 | Strings file setup | manual | src/content/strings.ts |
| S0 | T9 | 2026-03-13 | ESLint + Prettier config | manual | |
| S0 | T10 | 2026-03-13 | TypeScript strict mode | manual | |
| S0 | T11 | 2026-03-13 | Git repo + initial commit | manual | |
| S0 | T12 | 2026-03-14 | Supabase project setup | manual | EU region |
| S0 | T13 | 2026-03-14 | Auth schema + RLS | manual | |
| S0 | T14 | 2026-03-14 | NativeWind tokens | manual | |
| S0 | T15 | 2026-03-14 | Sprint 0 complete | manual | |
| S1 | T1 | 2026-03-17 | Supabase auth integration | tsc | expo-secure-store |
| S1 | T2 | 2026-03-18 | useAuth hook | tsc | |
| S1 | T3 | 2026-03-19 | Navigation guard + route groups | tsc | expo-router |
| S1 | T4 | 2026-03-20 | Welcome screen + device testing | tsc | |
| S1 | — | 2026-03-24 | Workflow infrastructure + Supabase MCP | tsc | Commands, build log, sprint docs, verify scripts |
| S1 | Pre-T5 | 2026-03-24 | NativeWind, react-query, phosphor, CLAUDE.md fix, pg_cron, app.json | tsc | All 4 known issues resolved |
| S1 | T5 | 2026-03-24 | Sign Up screen | tsc | Email/password, 18+ checkbox, Supabase auth |

## Known Issues

| Severity | Issue | Impact | Fix |
|----------|-------|--------|-----|
| ~~HIGH~~ | ~~NativeWind not installed~~ | RESOLVED 2026-03-24 | Installed + metro/tailwind/babel config |
| ~~HIGH~~ | ~~CLAUDE.md says expo-router v3~~ | RESOLVED 2026-03-24 | Updated to v6, added Cornr branding |
| ~~HIGH~~ | ~~daily_call_count never resets~~ | RESOLVED 2026-03-24 | pg_cron job: reset-daily-call-count at midnight UTC |
| ~~MEDIUM~~ | ~~react-query and phosphor not installed~~ | RESOLVED 2026-03-24 | Installed with --legacy-peer-deps |
