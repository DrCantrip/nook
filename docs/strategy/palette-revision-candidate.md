---
title: Cornr Archetype Palette Revision Candidate
date: 2026-04-20
status: pending mock-first validation
supersedes: (current Section 14.1 palette, conditionally)
---

# Archetype Palette — Revision Candidate

## Summary
Four of seven archetype accents proposed for revision based on
20 April 2026 colour-theory critique. Concerns spanned colour
theory, brand strategy, accessibility, cultural coding, and
perceptual discrimination. Three archetypes retain current colours.

## Proposed Revision

| Archetype | Current | Revised | Reason |
|---|---|---|---|
| Curator | #2E5A4B | *(retain)* | Works across all five critique axes |
| Nester | #4A7C8A | #7A6A5A | Cool→warm; resolves research mismatch (Nester behavioural truth is warm-linen-and-wood, palette was sea-blue) |
| Maker | #8B5E3C | #3A3A3A | Resolves overlap with Cornr brand terracotta (#9E5F3C); signals industrial correctly (steel/iron vs leather-craft); resolves class-coding concern |
| Minimalist | #6B7C6B | #7A7A72 | Sage→stone; CVD improvement (was collapsing with Curator under deuteranopia); less dated (sage was a 2020-2023 moment) |
| Romantic | #9B6B7A | #A86B5F | Dusty rose→muted clay; reduces gender-coding; preserves warmth |
| Storyteller | #7A6B4A | *(retain; possibly darken to #6B5D3A for WCAG body-text)* | Works thematically; minor WCAG fix may be needed |
| Urbanist | #5A5A6B | #6B2E2E | Slate-purple→oxblood; resolves weak archetypal signal (slate-purple reads corporate-IT); adds confident note to muted palette |

## Validation Plan
Mock-first test script adds explicit colour question per archetype:
"Does this colour feel right for your result?"

Ship condition: ≥4/6 participants endorse revised colour OR reject
current colour. Otherwise retain current palette and defer revision
to post-launch iteration.

## Implementation
On validation, update src/theme/tokens.ts with revised hex values,
regenerate 5%/8% tints, re-verify WCAG across all text pairings,
re-run CVD simulation, update Section 14.1 of canonical. Estimated
4-6h total. See task DESIGN-07 in MC.
