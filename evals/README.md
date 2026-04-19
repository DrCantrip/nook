# Cornr evaluation infrastructure

This directory contains evaluation configuration and documentation for the
Cornr archetype scoring + Haiku recommendation system.

## What lives here

- `COVERAGE.md` — paragraph per synthetic persona fixture explaining what
  edge it tests and what a failure would imply
- `README.md` — this file

## What does NOT live here

- Test harnesses → `tests/` (none yet; harness lands with SP-1B)
- Fixture data → `src/content/synthetic-personas.ts` +
  `src/content/synthetic-personas.adversarial.ts`
- Sanitiser library → `src/lib/catalogue-sanitise.ts`

## Why no harness yet

Per the 18 April repo-state diagnostic and three LARGE panel reviews: the
`recommend-products` Edge Function is Sprint 3 T1A and unbuilt. Building a
promptfoo harness against an unbuilt prompt is waste — the harness would
test stubs and require complete rewrite when the real prompt lands.

**Part A (SP-1, landed):** fixtures + sanitiser library + coverage map.
Pure data + pure functions. Zero dependency on unbuilt infrastructure.

**Part B (SP-1B, parked):** promptfoo harness, Sonnet LLM-as-judge Barnum
swap-test, sanitiser wire-up into the Edge Function. Lands when S3-T1A
scaffolds `recommend-products`.

R-19 governs: synthetic personas supplement, never substitute, real-user
validation. The mock-first 6-naive-user gate remains canonical and
non-negotiable. Synthetic pass is a prerequisite, not a substitute.

## How to run (when Part B lands)

Use the `/eval-haiku` slash command in Claude Code. It will run:

    npx promptfoo eval --config evals/haiku-recommendation.promptfoo.yaml

Cost: ~4 cents per full run (Sonnet judge on 28 fixtures × 3 repeats at
temperature 0.7, plus Haiku calls). Nightly CI is deliberately NOT
enabled — cost control matters more than drift surveillance at this
stage; manual runs before commits touching the prompt are sufficient
until the catalogue is large and volatile.

Until then, `/eval-haiku` is a stub that reports Part B is not yet wired.

## Current fixture inventory

- **20 primary** (`src/content/synthetic-personas.ts`)
  - 7 primary anchors (one per archetype, high confidence)
  - 3 high-risk blends (Curator×Minimalist, Nester×Romantic, Maker×Urbanist)
  - 2 low-confidence flat
  - 2 aspirational-room (archetype/room mismatch)
  - 2 pure-aspirational (pre-purchase, no rooms)
  - 2 near-boundary (genuinely ambiguous)
  - 2 budget-archetype-tension (Mercedes-shaped real v1 users)
- **8 adversarial** (`src/content/synthetic-personas.adversarial.ts`)
  - Barnum, trend_leak, period_leak, hallucination_material,
    hallucination_construction, hallucination_provenance, injection,
    system_leak
- **21 generated blends** via `generateBlendFixture(a, b)` — all archetype
  pairs covered programmatically for scorer-level internal consistency
