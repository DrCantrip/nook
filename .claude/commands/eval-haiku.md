# /eval-haiku

Runs the Cornr Haiku recommendation prompt eval suite.

## STATUS: STUB — Part B not yet landed

This command is intentionally inert until SP-1B lands the promptfoo harness,
which depends on Sprint 3 T1A scaffolding the `recommend-products` Edge
Function. Running this command before SP-1B produces an explicit error
rather than a silent no-op.

## When this command will activate

After SP-1B lands (depends on S3-T1A). At that point this command will:

1. Invoke `npx promptfoo eval --config evals/haiku-recommendation.promptfoo.yaml`
2. Run all 20 primary fixtures and 8 adversarial fixtures against the
   live Haiku prompt
3. Include a Sonnet LLM-as-judge Barnum swap-test per primary fixture
4. Report pass/fail summary and capture a run-id
5. Block `/done` on any primary-fixture failure

## Current behaviour (stub)

Emit an explicit error:

    eval-haiku not yet wired. Sprint 3 T1A required first.
    See evals/README.md for status and when this activates.

## Cost (when active)

~4 cents per full run (Sonnet judge on 28 fixtures × 3 repeats at
temperature 0.7, plus Haiku calls). Run manually before any commit
touching `src/prompts/` or `supabase/functions/recommend-products/`.
