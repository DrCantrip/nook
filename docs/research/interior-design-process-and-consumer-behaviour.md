# Interior design process and consumer behaviour
**Research session:** 12 April 2026 — Session 1
**Status:** Decisions locked. Do not re-research.

## Purpose
Understanding the gap between how professional designers approach rooms (deductive, brief-first) and how consumers actually shop (inductive, piecemeal) — and what this means for Cornr's recommendation architecture and data asset.

## Key findings

| Finding | Evidence | Confidence |
|---|---|---|
| Professionals work deductively (brief → anchor → cascade). Consumers work inductively (accessories first, no vision). This gap IS Cornr's core value proposition. | BIID Interior Design Job Book, RIBA Plan of Work 2020, Christopher Lowell's 7 Layers | High |
| The style vocabulary problem is real and measurable. Users hold strong aesthetic beliefs but can't articulate them. | Venkatesh & Meamber in-depth interviews; IUI'09 study | High |
| Visual preference elicitation outperforms verbal. Swipe mechanic is validated. | 53% prefer quiz approach; 19.8% increase in perceived alignment with visual queries (APE study, IUI 2026) | High |
| Choice overload is most damaging when preference uncertainty is highest — exactly Cornr's user. | Chernev, Böckenholt & Goodman 2015 meta-analysis (Journal of Consumer Psychology) | High |
| Room coherence (not individual product quality) is the unsolved problem. | Pinterest Complete the Look (CVPR 2019), Cansizoglu et al. | High |
| Constraints improve creative decisions for novices. Budget and room context should be framed as enablers. | Moreau & Dahl 2005, Sellier & Dahl 2011, Mehta & Zhu 2016 | Medium |
| Declared zero-party preference data commands 2–5× the value of behavioural clickstream data. | Forrester zero-party data research; Digiday CPM benchmarks | High |
| Multi-layered segments (archetype + life stage + budget + room stage) could command £20–35+ CPMs. | Programmatic CPM benchmarks; qualified lead territory | Medium |
| Longitudinal taste data adds 2–5× value over point-in-time snapshots. | Circana, Nielsen, Kantar longitudinal panel pricing | High |
| SheerLuxe acquired for £39.9M (7.8× EBITDA). First-party data cited as key value driver. | Future plc acquisition announcement, January 2026 | Confirmed |
| UK GDPR: aggregate anonymised data falls outside GDPR scope entirely. Individual data sharing requires explicit named-recipient consent. | ICO anonymisation guidance (updated May 2025); Bounty UK £400K fine case | High |
| Professional budget allocation: splurge on sofa, mattress, lighting, dining table. Save on rugs, accent tables, accessories. | Industry consensus (Christina Samatas, Fratantoni Interior Designers) | High |
| Aspirational browsing (pre-completion) is psychologically productive — identity formation, not distraction. | Pinterest data (85% use as project start), Frontiers in Computer Science 2025 | High |

## Decisions made as a result

1. **Cornr is a first-party taste data asset that happens to recommend products.** The data schema IS the business. Every design decision should optimise for data capture density per user session.
2. **Quiz functions as automated brief generator.** The professional process validates this — the brief is what separates coherent outcomes from piecemeal shopping.
3. **Pre-Purchase Researchers are first-class v1 persona.** Aspirational browsing generates taste data months before purchase — commercially valuable early-funnel signals.
4. **Constraints (budget, room type, existing furniture) should be framed as creative enablers.** Research confirms constraints improve novice creative decisions.
5. **Aggregate anonymised taste intelligence reports are the GDPR-safe B2B data product path.** No GDPR barriers at cohort sizes of 30–50+ per segment.

## Sprint implications

- **Sprint 3 (recommendation engine):** Pass full archetype score vector (all 7 dimensions) to LLM — not just the label. Store all 7 scores in engagement_events JSONB.
- **Sprint 3 (data schema):** Capture archetype + budget_tier + room_stage + journey_stage + acquisition_source from day one. These are the commercially valuable segment fields.
- **Pre-launch:** Design consent architecture with `audience_data_opt_in` toggle — enables B2B aggregate reporting pathway.
- **v2 data product:** Quarterly taste intelligence reports. Format: archetype distributions, category engagement, budget behaviour, regional splits, trend velocity.

## Open questions

- At what user cohort size does Cornr's aggregate data become statistically meaningful for brand reporting? (Working assumption: k≥50 per segment = ~15,750 profiled users across all segments)
- Can Awin postback data be combined with quiz data to build the "declared vs revealed" preference comparison?
