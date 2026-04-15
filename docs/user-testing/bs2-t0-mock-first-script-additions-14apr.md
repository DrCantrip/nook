# BS2-T0 mock-first script additions — 14 April 2026

**These observations must be merged into the main BS2-T0 mock-first script before the test runs. They cover reveal-screen retake signal and Profile retake discoverability.**

Source: S2-T4 reveal screen panel critique, 14 April 2026. Product decisions (retake link on reveal screen; panel structural restructure) were deferred to mock-first for empirical resolution.

---

### Reveal screen — retake signal observation (added 14 April 2026 panel critique)

At the reveal moment, does the user express any of the following signals — verbally, via hesitation, via expression, or via body language?
- A desire to retake or redo the quiz
- Partial misrecognition ("that's kind of me but not entirely")
- Full rejection ("this isn't me")
- Uncertainty they can't articulate

Record the raw quote or behaviour. Note which of the four signals fired. If the user expresses any of these, note whether they VOLUNTEERED the signal or whether it took a follow-up question ("How does that archetype feel to you?") to surface it.

Decision trigger: if 0/6 or 1/6 users volunteer any signal, the reveal screen does NOT need a retake entry point — Profile retake is sufficient. If 3/6 or more users volunteer a signal, the reveal screen needs a retake entry point as a fast-follow before launch. Borderline cases (2/6) need Daryll's call.

### Profile retake discoverability observation

After the user has completed the reveal flow and is in the main app, present the following task: "Imagine you felt your style result wasn't quite right. How would you try to fix it?" Observe whether the user can find the Profile → Retake path within 60 seconds without being prompted.

Record: time to first attempt, time to Profile tab, time to retake button, whether they found it at all.

Decision trigger: if 4/6 or more users find the Profile retake path within 60 seconds, discoverability is adequate. If fewer than 4/6 find it, the Profile tab needs a discoverability improvement (more prominent "Your Style" section, post-reveal nudge, or similar) before launch.

These two observations are linked: the reveal-screen retake decision depends on both signal volunteering rate AND Profile discoverability. The combined decision matrix:
- Low signal + high discoverability → no reveal link needed (ship as-is)
- High signal + high discoverability → reveal link helpful but Profile retake is catching them eventually (ship as-is, monitor retake rate post-launch)
- Low signal + low discoverability → Profile needs prominence improvement (fix Profile, no reveal link)
- High signal + low discoverability → ship the reveal link as fast-follow before launch (BOTH fixes needed)
