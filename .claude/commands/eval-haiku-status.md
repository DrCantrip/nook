# /eval-haiku-status

Reports the current state of synthetic persona evaluation infrastructure.

## Output

    Part A (SP-1):  ✓ Landed
    Part B (SP-1B): ⏳ Awaiting S3-T1A (recommend-products Edge Function)

    Fixtures available:
      20 primary  — src/content/synthetic-personas.ts
      8  adversarial — src/content/synthetic-personas.adversarial.ts

    Sanitiser library:
      Available at src/lib/catalogue-sanitise.ts
      Wire-up pending S3-T1A

    Coverage map: evals/COVERAGE.md
    R-19: synthetic personas supplement, never substitute

## Use

Run at session start when about to touch recommendation, prompt, or
archetype-scoring code. Cross-check the fixture list against recent
changes in `src/content/synthetic-personas*.ts` to decide whether to
regenerate any fixture.
