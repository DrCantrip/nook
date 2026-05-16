# feature-spec

## When to use
Before writing a Claude Code prompt for any feature, fix, or migration that
touches: auth, RLS, the recommendation engine, the consent flow, or data
architecture. Not needed for cosmetic or single-component UI work.

## Why this exists
A prompt that says "do X" is not the same as X happening. The SIGNUP bug
(d0f5aef) is the canonical proof: a prompt instructed an UPDATE on
public.users after sign-up. The code ran. The prompt looked satisfied.
But the UPDATE executed under the anon role during email-confirm, public.users
had only authenticated-role policies, and it silently affected zero rows.
Born 7c5bcd2 (7 Apr), undetected for a month.

The gap between "the prompt said so" and "the runtime did it" is where bugs
live. This skill closes it with a preflight run BEFORE the prompt is written.

## Preflight checklist — answer all five before writing the prompt
Each must have a literal answer. If any cannot be answered, STOP and report.

1. WRAPPERS — Which functions wrap the operation being changed? Enumerate them
   by name. (d0f5aef: the sign-up call was wrapped by useAuth — the prompt
   missed it, scope correctly grew 3 to 4 files mid-build. Enumerate up front.)

2. AUTH CONTEXT — What role does each touched DB operation run under: anon,
   authenticated, or service? Email-confirm flows run as anon until
   confirmation. State it per operation.

3. RLS — For each table touched, what policies exist for that role? An
   operation under a role with no matching policy fails SILENTLY (0 rows),
   it does not error. Name the policy or name its absence.

4. FAILURE MODE — If the auth context is wrong, what happens? "Silent 0-row
   write" and "hard error" need different prompt safeguards.

5. VERIFICATION — How will the prompt PROVE the change worked at runtime, not
   just that code ran? A row count, a returned value, a re-read. "Code ran"
   is not verification.

## Stop conditions — write these literally into every prompt
Not "be careful" — literal IF/THEN:
- IF the branch is not the expected branch, stop and report.
- IF a touched file's content does not match the preflight assumption, stop,
  report what was found, do not guess.
- IF a DB write returns 0 affected rows where more than 0 was expected, stop
  and report.
- IF a decision with more than one valid option arises mid-build, present the
  options as NUMBERED TEXT and stop. Do NOT block on the in-IDE picker.

## AskUserQuestion is an anti-pattern here
In the two-tool workflow, CC must not block on the in-IDE question picker for
anything with a decision layer. CC presents options as numbered text and
stops; claude.ai resolves the decision and re-prompts. AskUserQuestion is
reserved only for non-blocking confirmations with no separate decision to make.

## Output
A single paste-ready Claude Code prompt with literal values, explicit paths,
the five preflight answers folded in as stated assumptions, and the stop
conditions written out.
