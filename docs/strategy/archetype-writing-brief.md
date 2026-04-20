---
title: Cornr Archetype Writing Brief
date: 2026-04-20
status: governing document
purpose: the rules that govern archetype description writing.
  Consolidated from 3 multi-persona critiques on 20 April 2026.
  All 7 archetype descriptions must satisfy these conditions.
consumes_from:
  - docs/strategy/archetype-research.md (source material)
produces:
  - src/content/archetypes.ts (description layer per archetype)
  - Reveal screen copy (in-product)
  - Share card copy (derivative)
---

# Cornr Archetype Writing Brief

**Date:** 20 April 2026
**Status:** Governing document
**Supersedes:** 7 April 2026 Phase 1 archetype description brief
**Source:** Three multi-persona critiques run on `docs/strategy/archetype-research.md` — 20 voices (research viability + vocabulary accessibility), 10 voices (design × language integration at reveal), 8 voices (colour theory + brand colour), plus a focused panel on quiz edge cases (all-yes/all-no/flat-middle reveals).

---

## Purpose

This document governs the writing of:
- 7 archetype descriptions (4 components each — essence, observation, sensory anchor, behavioural truth)
- 7 motif tooltip lines (5-8 words each)
- 3 fallback reveals (all-yes, all-no, flat-middle)
- 2 derivative assets per archetype (share-card quote, recommendation rationale seed)
- 2 lexicon arrays per archetype (`userLexicon`, `materialLexicon`)

Every piece of archetype-facing copy must be tested against the conditions below before shipping.

---

## TOP-OF-FILE: 12 GOVERNING RULES (READ FIRST)

These are the rules the writer holds in working memory during drafting. The 38 conditions below are the full detail — these 12 are the operating principles.

1. **Directional, not diagnostic.** "You're drawn to..." not "you rearrange three books...". Serves the 80% of FTBs who are becoming, not the 20% who already know.

2. **Second-person warm.** "Your home", "you tend to", never "she" or "he" or "they". No gender, no pronouns that assume a solo protagonist.

3. **Zero proper nouns in user-facing copy.** No brand names, no place names above category level, no designer names. Proper nouns live in `materialLexicon` and `docs/strategy/archetype-research.md`. Never in the description, tooltip, or share quote.

4. **Anglo-Saxon first.** "Worn smooth" over "patinated". "Wooden" over "timber-framed". "Lived-in" over "characterful". The words the archetype uses about themselves, not the design-press vocabulary about them.

5. **Graduated depth across the four components.** Essence line for the design-illiterate. Observation for the design-curious. Sensory anchor for all. Behavioural truth for the design-literate. Description rewards re-reading as aesthetic literacy grows.

6. **Essence line conjures the motif.** Each essence line must evoke its archetype's visual motif. Motif reads as illustration; essence reads as translation. Compositional integration, not just layout.

7. **Barnum swap test before shipping.** Swap archetype-specific nouns for adjacent-archetype nouns. If the description still reads coherent for the adjacent archetype, the description fails. Pay particular attention to: Curator—Minimalist, Nester—Romantic, Maker—Storyteller.

8. **Grandmother test and read-aloud test.** Read every line aloud. Read to a 60+ non-homebuyer. Any hesitation, any "what's that?", any stumble — cut.

9. **Craft budget 80% on essence line.** 60% of users read only the essence line on first visit (4 seconds before tap). Everything else serves return visits and depth-readers. Essence line is the product.

10. **Behavioural truth line is the share card.** This is the screenshot gold. Must pass Barnum cleanly, fit the share card visual, land for design-literate users, and reference a tell observably distinct from adjacent archetypes.

11. **Fallback copy follows same rules.** All-yes, all-no, flat-middle reveals are directional, second-person, proper-noun-free, and name the pattern as valid signal. Never imply the user "swiped wrong."

12. **Writing session is consistency-critical.** All 7 archetypes drafted in one focused session (3-4h). Tooltips + fallback copy folded in. MEDIUM critique on Curator first, then roll pattern forward. Don't fragment across sessions.

---

## THE 38 CONDITIONS (FULL DETAIL)

### Conditions 1-8 — Research viability and translation rules

**Condition 1 — Second-person rewrite is mandatory.**
The source research is third-person anthropology ("they move the same three books around"). All user-facing copy must translate to second-person reflection ("you move the same three books around"). Second person turns observation into recognition; third person reads as surveillance.

**Condition 2 — Four framings must be rewritten before they bleed into copy.**
The research carries framings that are accurate-but-uncharitable to four archetypes. Rewrite before drafting:
- **Minimalist:** intentional, not neurotic. "An empty surface lets you think", not "clutter-cortisol feedback loop".
- **Urbanist:** current, not shallow. "You keep things current", not "you churn".
- **Romantic:** 32-year-old Instagram-native, not "Rita Konig's niece". Matilda Goad dupes and H&M Home, not Colefax & Fowler.
- **Maker:** competent, not working-class-coded. Strip trade vocabulary assumptions; a Maker is a professional choosing material honesty, not a tradesperson by default.

**Condition 3 — Gender-neutral and partner-neutral throughout.**
No "she", "her flat", "his tools". No assumption of solo protagonist. Use "your home", "you might", "the one chair you saved for". Roughly 70% of UK FTBs buy as couples; descriptions must work when read together.

**Condition 4 — Geographic audit before ship.**
No London-specific proper nouns in user-facing copy. No Peckham, no Kempton, no Walthamstow, no Shoreditch. Place references live only in `materialLexicon` (where Haiku may use them for regional recommendation weighting). User-facing prose uses category-level locations only: "a city flat", "an old terrace", "a first-floor flat".

**Condition 5 — `materialLexicon` distilled to 30-50 product-level pointers per archetype.**
Brand-specific, engine-facing vocabulary lives in `materialLexicon` as array of short tokens (e.g., `["oiled teak", "G Plan Astro", "Farrow & Ball Setting Plaster"]`). Not sentences, not essays. Feeds Haiku's product-matching.

**Condition 6 — Barnum swap test on every description before ship.**
Pick the description. Swap its archetype-specific nouns for adjacent-archetype nouns (use the differentiation matrix in the research). If the description still reads coherent for the adjacent archetype, it fails. Must pass cleanly before ship.

**Condition 7 — Anchor on apologise/defend axis for the `behaviouralTruth` component.**
The research identified three discriminating axes: completion velocity, object count, apologise/defend. Apologise/defend is the most shareable and most behaviourally precise. The behavioural truth line should reference what the archetype apologises for OR what they defend — not both, not a descriptive tell.

**Condition 8 — Nester palette #4A7C8A stays for now; description carries the warmth.**
The Nester archetype behaves warm; the original palette reads cool. Rather than shift colour, the description's sensory anchor and observation must carry warmth explicitly. (Palette revision candidate exists — see `docs/strategy/palette-revision-candidate.md` — but ships only on mock-first validation. Description writing proceeds under the current palette.)

---

### Conditions 9-12 — Vocabulary accessibility

**Condition 9 — Two-lexicon architecture.**
`archetypes.ts` has two lexicon arrays per archetype:
- `userLexicon: string[]` — 15-25 warm, common, feeling-words; drives user-facing prose ("warm", "worn", "lived-in", "one good thing", "the corner you use most")
- `materialLexicon: string[]` — 30-50 brand-specific tokens; drives Haiku recommendation matching

Both derived from same research; feed different layers. Enforceable by lint rule (future): any word in user-facing description not in `userLexicon + common-word-list` triggers a warning.

**Condition 10 — Zero proper nouns in user-facing copy.**
No brand names (Ercol, HAY, Gubi, Hasami). No designer names (Matilda Goad, Rita Konig). No place names above category (Peckham, Kempton, Retrouvius). No cultural-tribe markers (Dezeen, Wallpaper*, NTS, Radio 4). Proper nouns live ONLY in `materialLexicon` and research docs.

**Condition 11 — Anglo-Saxon-first vocabulary.**
Shorter, older English words over Latinate vocabulary. "Worn smooth" over "patinated". "Lived-in" over "characterful". "Wooden" over "timber-framed". "Cupboard" over "storage unit". "Corner" over "niche". The register of the words the archetype uses about themselves, not the words the design press uses about them.

**Condition 12 — Four tests before ship.**
Every piece of archetype-facing copy passes all four before ship:
1. **Barnum swap test** — swap archetype-specific nouns for adjacent-archetype nouns; if still coherent, fail.
2. **Grandmother test** — read aloud to a 60+ non-buyer; any hesitation, cut.
3. **Reading-aloud test** — stumble on any word, cut.
4. **Non-British test** — a French or German FTB working in the UK should parse every sentence.

---

### Conditions 13-17 — Lean Product / user needs

**Condition 13 — Directional, not diagnostic.**
Phrase archetype traits as directions users are moving toward, not states they already embody. "You're drawn to..." / "You tend to..." / "You'd rather..." — NOT "you rearrange..." / "you know..." / "you always...". Serves the 80% of FTBs in identity transition, not just the 20% with formed aesthetic self.

**Condition 14 — Graduated depth across the four components.**
- **Essence line** — for the design-illiterate. Universal mood-level truth. Life-wisdom coded.
- **Observation paragraph** — for the design-curious. Behavioural pattern language.
- **Sensory anchor** — for all. Physical, immediate, universally parseable.
- **Behavioural truth** — for the design-literate. Oddly-specific line that's the share.

Every user reads all four. Each lands differently by literacy level. Description rewards re-reading as user's aesthetic vocabulary grows.

**Condition 15 — Archetype framing as introduction, not declaration.**
Reveal screen language introduces the archetype rather than declaring the user's identity. "Meet The Curator" / "Your style territory: The Curator" — NOT "You are The Curator." Carried in reveal screen copy, NOT in the description itself. The description then reads as a page of notes about this style territory, not a verdict on the user.

**Condition 16 — Dual-share architecture.**
The share card offers the user a choice of which line to extract — essence line (life-wisdom coded, universal) OR behavioural truth (specific-and-seen coded, design-literate). Same user profile, different share motivations. Both must be written to share-card spec.

**Condition 17 — Behavioural truth is the most load-bearing sentence in the system.**
Must pass: Barnum defence, share-card fit, design-literate recognition, adjacent-archetype distinction, second-person warmth, universal vocabulary. Gets disproportionate craft time relative to other components.

---

### Conditions 18-26 — Design × language integration at reveal

**Condition 18 — Essence line conjures the motif.**
Each essence line must evoke its archetype's visual motif. Motif becomes the illustration of the sentence; the sentence becomes the translation of the motif. Examples:
- Curator motif = viewfinder. Essence candidate: "You frame what matters and leave the rest alone."
- Nester motif = asymmetric embrace. Essence should conjure holding, softness, making-a-space-feel-like-home.
- Maker motif = interlocking brackets. Essence should conjure building, joining, construction.
- Minimalist motif = quarter-arc. Essence should conjure single-gesture, breath, enough.
- Romantic motif = (pending DESIGN-01) scalloped arc candidate. Essence should conjure soft repetition, layered pattern.
- Storyteller motif = mixed shapes. Essence should conjure accumulation, variety, collected-over-time.
- Urbanist motif = rectangle + diagonal. Essence should conjure city-grid-meets-sharper-line, directional confidence.

Integration at the compositional level, not layout.

**Condition 19 — Three-tier typographic hierarchy.**
Reveal screen has three tiers, not five:
- **Arrival** — archetype name + style territory (where you are)
- **Recognition** — essence line (who you are)
- **Depth** — observation + sensory anchor + behavioural truth as a coherent block (what's true about you)

Fewer type moments; clearer landing. Description writing serves these three tiers, not five equal moments.

**Condition 20 — Motif repositioned in reveal sequence.**
Motif appears AFTER essence line, not before. Reveal sequence:
1. Page tint lands (ambient)
2. Archetype name + style territory fades in
3. Essence line types in character-by-character
4. **Motif fades in** as visual echo of essence
5. Observation + sensory + behavioural truth fade in together
6. CTA gently appears

Motif reads as illustration of what was just said, not decoration preceding it.

**Condition 21 — Tappable motif with tooltip for depth.**
Motif is gently interactive on return-visit. 44pt minimum hit area. No indicator on first reveal. One-time soft pulse on first return-visit to Profile tab (discoverability). Tap reveals tooltip above motif, 3-second fade. Tooltip content: 5-8 word archetype-specific micro-essence explaining the motif metaphor. Styling: archetype accent at 80%, DM Sans Italic. Tooltip copy is a distinct writing component per archetype.

**Condition 22 — Reveal is a two-experience screen.**
- **First visit** — essence line + archetype name + tap (4 seconds for 60% of users)
- **Return visit** — depth layers readable, tappable motif, re-read

Copy, design, and motion all serve both experiences separately. Description written to support both: essence does the heavy lifting on first visit; observation + sensory + behavioural truth reward return.

**Condition 23 — Staggered motion with reduced-motion fallback.**
Ceremonial motion on first reveal (timing per Condition 20). Reduced-motion fallback: all elements land simultaneously with spatial ceremony (generous whitespace + clear tier separation) instead of temporal ceremony. Copy must work under both.

**Condition 24 — Craft budget weighted by read-probability.**
- 80% of craft effort — essence line
- 10% — observation paragraph
- 5% — sensory anchor
- 5% — behavioural truth (separately, gets intensive Barnum review)

Essence line is read by everyone; everything else serves specific purposes but doesn't compete for first-impression attention.

**Condition 25 — Typography is archetype-invariant.**
Only colour, motif, and tints shift per archetype. Type system, hierarchy, spacing, and all interactive elements remain constant across the 7 archetypes. Language carries archetype differentiation under a constant type treatment. Writers do NOT need to write to different type voices per archetype — voice is constant, content is differentiated.

**Condition 26 — Motif tooltip is a named copy component per archetype.**
5-8 word micro-essence lines explaining the motif metaphor. Written alongside descriptions. Same voice rules. Same Barnum discipline. Appears on tap, not on initial reveal.
Example candidates:
- Curator (viewfinder): "You frame what matters."
- Nester (asymmetric embrace): "You hold a space until it feels like home."
- Maker (interlocking brackets): "You build what holds."
- Minimalist (quarter-arc): "A single gesture, enough."
- Romantic (scalloped arc, pending DESIGN-01): "Soft repetition, layered up."
- Storyteller (mixed shapes): "Every piece has a story."
- Urbanist (rectangle + diagonal): "Where the grid meets a sharper line."

These are candidates, not final. Final versions written in the consolidated Curator-and-forward writing session.

---

### Conditions 27-33 — Quiz edge cases (all-yes, all-no, flat-middle)

**Condition 27 — Confidence threshold defines routing.**
Archetype assignment requires top dimension ≥1.4× mean of all dimensions. Below threshold = fallback flow, not forced archetype. Description writing doesn't own this rule directly, but must produce copy for the fallback paths (see Condition 33).

**Condition 28 — Three distinct fallback paths.**
The quiz produces 4 reveal types, not 1:
- **Single archetype** (high-confidence argmax) — standard description used
- **Blend** (top 2 both significant) — Haiku composes blended reveal from top 2 archetypes
- **All-yes** (all dimensions positive, low discrimination) — special fallback copy acknowledging openness
- **All-no** (vector magnitude below threshold, no signal) — special fallback copy + secondary mini-quiz offer

Writing session produces copy for all-yes and all-no. Blend is Haiku-composed at runtime.

**Condition 29 — Tap buttons as swipe alternative, ships v1.**
Quiz cards have two buttons (✓ / ✗) below them with equal visual weight to the swipe gesture. Accessibility non-negotiable. This is a design/engineering task (QUIZ-02), not a writing task, but it affects the context in which descriptions land. Users who tap rather than swipe are the population most likely to need accessibility-sensitive fallback copy.

**Condition 30 — Fallback copy follows "directional, not diagnostic" principle.**
All-yes, all-no, flat-middle reveals use second-person-warm voice. Never imply the user "swiped wrong" or "didn't engage". Name the pattern as its own valid signal. Applies Condition 13 to the fallback surface.

**Condition 31 — Raw vector + confidence score logged per completion.**
Engineering-side requirement (QUIZ-04), but relevant to writing: v1 ships with static fallback copy; v1.1 can upgrade to Haiku-composed fuzzy reveals against logged data. Writers produce static copy for v1 knowing it'll be replaced/augmented, not maintained forever.

**Condition 32 — Mock-first test captures all-no rate by demographic.**
Voluntary demographic collection post-quiz, cross-tabulated with all-no/all-yes patterns. Flags deck bias if disproportionate across segments. Affects writing indirectly — if certain demographics disproportionately all-no, the fallback copy needs extra care for those users (no assumptions about design literacy, no cultural tribe-markers).

**Condition 33 — Fallback copy is its own writing component.**
3 meta-reveals need drafting as part of the same writing session:
- **All-yes fallback** — essence + observation (~90 words total)
  Direction: "Your taste is open; here's how we'll narrow it down with you."
- **All-no fallback** — essence + observation (~90 words total) + offer of secondary mini-quiz
  Direction: "Nothing landed yet; let's try a different set."
- **Flat-middle fallback** — handled by blend architecture at runtime (Haiku-composed); writers provide the scaffolding Haiku uses (essence template + tone guidelines) rather than finished prose

Barnum defence does not apply (these are above archetypes, not within them). Passes remaining conditions (directional, second-person, proper-noun-free, vocabulary ceiling).

Draft examples for starting point (expected to be revised in critique):

- **All-yes essence:** *"Most people lean one way, or two. You're drawn across several — that's its own kind of eye."*
- **All-no essence:** *"Nothing quite landed this time. Let's try a different way in."*

---

### Conditions 34-38 — Colour theory implications for description writing

**Condition 34 — Palette revision candidate pending mock-first validation.**
4 of 7 archetype accents proposed for revision (Nester, Maker, Minimalist, Romantic, Urbanist). Writing proceeds under current palette; revision ships only if mock-first validates. For the description writer this means: description sensory anchors must carry archetype warmth or coolness independently of colour, in case palette changes.

**Condition 35 — WCAG AA enforced at token level.**
Accent colours that fail body-text contrast are usable only for large text (18pt+ bold) and icons. Writing implication: the archetype name and essence line (Arrival + Recognition tiers in Condition 19) may render in archetype accent. Observation, sensory anchor, behavioural truth (Depth tier) render in ink regardless. Writers don't need to adjust copy for this, but should know description body lives in ink, not accent.

**Condition 36 — CVD simulation required for palette.**
Every accent colour pair must show ΔE >10 under deuteranopia and protanopia simulation. No direct writing implication, but the archetype identity anchor (colour) may be unreliable for CVD-affected users — which means the **description must be self-sufficient as archetype identity carrier**. A user who can't distinguish their colour from another's should still recognise their archetype from the description alone.

**Condition 37 — Mock-first test validates colour-archetype fit.**
Test script adds: "Does this colour feel right for the archetype you just got?" If ≥4/6 participants reject current colour OR endorse revised colour, ship revision. Writing session produces descriptions robust to either palette outcome.

**Condition 38 — Cornr brand accent separated from archetype accents.**
Current Cornr terracotta #9E5F3C is close to current Maker #8B5E3C (brand-archetype clash). Proposed revision gives Maker #3A3A3A (charcoal), resolving clash. Writing implication: Maker description should NOT lean heavily on "warm brown" or "terracotta" sensory cues, as these will read as Cornr-brand-default to users in other archetypes and as non-differentiating to Maker users. Maker sensory anchors should lean toward charcoal, iron, oiled steel, raw wood — material honesty cues, not warm-colour cues.

---

## APPENDIX A — Four-component structure per archetype (spec)

Each archetype description has four components, in this order:

```
ESSENCE LINE
  Format: Newsreader Italic, 8-14 words
  Voice: second-person, universal, life-wisdom coded
  Constraints: zero proper nouns, conjures the motif (Condition 18)
  Craft budget: 80% of total (Condition 24)
  Example (Curator, draft): "You'd rather have one thing you love than five that are fine."

OBSERVATION PARAGRAPH
  Format: DM Sans Regular, 40-60 words, 3-4 sentences present-tense
  Voice: directional not diagnostic, second-person, proper-noun-free
  Constraints: Anglo-Saxon first, graduated-depth recognition-level
  Craft budget: 10%

SENSORY ANCHOR
  Format: DM Sans Italic, 8-12 words
  Voice: physical, immediate, universal
  Constraints: common material terms + light/sound/smell only
  Craft budget: 5%
  Example direction: "Morning light on a wooden surface you've worn smooth with use."

BEHAVIOURAL TRUTH
  Format: Lora Regular (not Bold, not Italic), 12-18 words
  Voice: confessional, sharp, oddly specific
  Constraints: must pass all four tests (Condition 12), anchors on apologise/defend axis (Condition 7)
  Craft budget: 5% (separately, intensive Barnum review)
```

Total: 68-104 words. Fits 60-110 target.

---

## APPENDIX B — Writing session protocol

1. **Curator first as pattern-setter.** 3-4h focused session. Draft all 4 components + userLexicon (15-25 words) + materialLexicon (30-50 tokens).

2. **MEDIUM critique** (5 personas, 2 rounds) on Curator before moving to archetype 2. Personas: Copywriter, App Copy Specialist, Content Designer, User Researcher, Tester.

3. **Revise Curator** based on critique. Must pass all 4 tests in Condition 12.

4. **Roll pattern forward** to the other 6. Same 4-component structure, same tests, no re-critique per archetype (pattern already validated).

5. **Fold in tooltip copy** (7 × 5-8 words) and fallback copy (3 × ~90 words) during same session — voice consistency benefits from single-session craft.

6. **Single pass read-aloud** at the end of all 7 + tooltips + fallbacks. Stumbling on anything = fix.

7. **Cross-archetype Barnum audit** — pick each description, try to make it read as each of the other 6. Should fail in all 6 attempts. If any pair collapses, revise the weaker description.

8. **Ship to `src/content/archetypes.ts`** via Claude Code prompt. Includes both lexicons, all 4 components, tooltip, and version bump.

Estimated total: 8-10h across one focused day or two half-days. Do not fragment across more than two sessions — consistency degrades.

---

## APPENDIX C — Mandatory Barnum defence differentiators

Per the research's differentiation matrix, the following pairs are highest-risk and each description MUST include content that distinguishes them:

| Pair | Must-include differentiator in both descriptions |
|---|---|
| **Curator — Minimalist** ★ | Curator displays objects with provenance and talks about them; Minimalist conceals and prefers empty surfaces. Curator description must name display/visibility; Minimalist must name absence/emptiness. |
| **Nester — Romantic** ★★ | Nester has pattern-restraint (ticking stripe ceiling); Romantic has pattern-density (florals + gingham + chintz together). Nester description must name restraint in softness; Romantic must name layering. |
| **Maker — Storyteller** ★ | Maker reads objects as substance (rebuilt runners, beech dowels); Storyteller reads objects as person (nan's drawer, 1962 receipt). Maker description must reference making/material; Storyteller must reference narrating/provenance. |
| **Romantic — Storyteller** ★ | Romantic organises by colour and shape (blue-and-white together, symmetrical pairs); Storyteller organises by biography (camera next to bowl next to poster, no palette). Romantic description must reference coherence; Storyteller must reference variety. |
| **Urbanist — Minimalist** ★ | Urbanist's restraint is edit-as-statement (one oxblood sofa in a biscuit room); Minimalist's restraint is subtraction-as-quiet (no art on a wall). Urbanist description must reference the one bold thing; Minimalist must reference silence/absence. |
| **Urbanist — Curator** ★ | Urbanist is directional and present-tense; Curator is reverential and historical. Urbanist description must name current/now; Curator must name time/keeping. |
| **Curator — Storyteller** | Curator knows the designer's name and mark; Storyteller knows whose house it came from. Curator description must reference making/craft; Storyteller must reference person/story. |
| **Nester — Minimalist** ★ | Nester drapes and displays soft things; Minimalist conceals and folds. Nester description must reference softness left out; Minimalist must reference things put away. |

★ = high-risk. ★★ = highest-risk. All ★-level pairs must show clean differentiation under Barnum swap test. All pairs must show some differentiation.

---

## APPENDIX D — What's explicitly NOT in scope for this writing session

- **Image asset curation per archetype** — handled separately (photography brief pending)
- **Recommendation rationale text** — generated by Haiku at runtime using `materialLexicon` + `rationale_qualities` per R-19
- **Onboarding flow copy** — separate brief
- **Error state copy** — already locked (10 April)
- **App Store description copy** — separate brief
- **Marketing copy / referral mechanics** — post-launch
- **Style territory name review** — names locked 7 April, not reopening

---

## Version control

v1.0 — 20 April 2026 — Initial 38 conditions landed, consolidated from three multi-persona critiques

Future versions will be appended below with date and changelog.

---

## File dependencies

- Source: `docs/strategy/archetype-research.md` (behavioural portraits, ~42k words)
- Produces: `src/content/archetypes.ts` (description layer, userLexicon, materialLexicon per archetype)
- Produces: reveal screen copy (in-product)
- Produces: share card copy (derivative)
- Produces: motif tooltip copy (7 × 5-8 words)
- Produces: fallback reveal copy (3 × ~90 words)
- Consults: `docs/CORNR_CANONICAL.md` Section 14 (design system), Section 13 (standing rules R-20..R-23)
- Consults: `docs/strategy/palette-revision-candidate.md` (pending mock-first)
