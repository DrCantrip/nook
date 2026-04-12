# Data asset and commercial strategy
**Research session:** 12 April 2026 — Sessions 1 & 3
**Status:** Decisions locked. Do not re-research.

## Purpose
The commercial model validation — what Cornr's taste data is worth, to whom, at what scale, and how to structure the B2B data product. This defines the business, not just the app.

## Key findings

### The data asset

| Finding | Evidence | Confidence |
|---|---|---|
| Declared zero-party preference data commands 2–5× behavioural clickstream data for targeting | Forrester zero-party data research | High |
| Multi-layered segments (archetype + FTB + budget + room stage) could command £20–35+ CPMs | Programmatic CPM benchmarks; qualified lead territory | Medium |
| Longitudinal taste data (taste change over time) commands 2–5× point-in-time snapshots | Circana, Nielsen, Kantar longitudinal panel pricing | High |
| SheerLuxe acquired by Future plc for £39.9M (7.8× EBITDA, January 2026) with first-party data as key value driver | Future plc announcement | Confirmed |
| Highsnobiety × BCG co-branded reports validate the taste intelligence model — the data product IS the business | 6+ reports since 2018; BCG consulting engagements | Confirmed |
| UK GDPR: aggregate anonymised data falls outside GDPR scope at sufficient cohort sizes (practical floor: k≥30–50 per segment) | ICO anonymisation guidance (updated May 2025) | High |
| Individual data sharing with named brand partners requires explicit, granular, unbundled consent | ICO guidance; Bounty UK £400K fine | Confirmed |

### The commercial model

| Stage | Trigger | Revenue mechanism |
|---|---|---|
| v1: Affiliate | Launch | Awin affiliate commission (4–5% blended; weight toward 30-day cookie programmes) |
| v2: Brand partnerships | 10,000–15,000 profiled users | Quarterly taste intelligence reports (partnership sweetener); sponsored placements |
| v2: Data reports | 50,000+ profiled users | Standalone B2B taste intelligence reports (£2,500–5,000/quarter) |
| v3: Platform API | 100,000+ users | "Powered by Cornr" quiz embedded in mortgage brokers, estate agents, homeware retailers |

### Unit economics

| Metric | Value | Source |
|---|---|---|
| UK FTBs per year | ~341,000 | HMRC first-time buyer relief data |
| Average FTB furnishing spend (Year 1) | £15,509 | Halifax/Nationwide FTB data |
| Blended affiliate commission | 4–5% | Awin programme research (Apr 2026) |
| Cornr affiliate revenue per user (if 5% of spend flows through app) | ~£39 per user lifetime | Calculated |
| Break-even active users (affiliate only) | ~1,500 | Monthly infra costs £100–200; affiliate ~£0.15/user/month |
| Brand partnership revenue potential (10–15K users) | £30K+/year | Panel estimate; R-4 standing rule |
| SheerLuxe comparable exit (at scale) | £39.9M on £12.6M revenue | Future plc acquisition Jan 2026 |

### Retailer affiliate programmes (commission rates)

| Retailer | Commission | Cookie | Notes |
|---|---|---|---|
| Wayfair UK | 7% | 30 days | Excludes mobile app transactions — test webview |
| Heal's | 6% | 30 days | Premium positioning |
| John Lewis | 3–5% | 30 days | Slow approval (2–4 weeks) |
| Dunelm | 2% | 30 days | High volume potential |
| Next Home | ~4% | 30 days | Broad catalogue |
| M&S Home | 5% | 30 days | Strong brand trust |
| Amazon Home | 5% | 24 hours | Short cookie; deprioritise |
| Cox & Cox | 1.2–4% | 30 days | Niche premium |
| IKEA | None | — | No affiliate programme |
| Made.com | — | — | Collapsed October 2022; do not reference |

## Decisions made as a result

1. **Cornr is a data-and-commerce business, not venture-scale.** Affiliate revenue supports 5,000–10,000 users. Data asset becomes commercially viable at 30,000+ users in Year 2–3.
2. **Brand pilot threshold is 2–5K users (R-4), not 10K.** Anti-Thread discipline — validates commercial model early. Brands need purchase conversion data (Awin postback) not just clicks.
3. **Quarterly taste intelligence reports are the partnership sweetener, not the standalone product**, until 50K+ users.
4. **Apply to all Awin retailer programmes on the same day.** John Lewis takes 2–4 weeks. Start immediately.
5. **Do not build on Made.com. Do not list IKEA.** Reference only retailers with active Awin programmes.
6. **Awin server-to-server postback integration required before R-4 brand pilot.** Brands need purchase conversion data.
7. **AI-native positioning leads all commercial conversations (R-11).** Business story: personalisation at negligible marginal cost (~$0.003/recommendation), first-party zero-party taste data, SheerLuxe comparable. Technology story is secondary.

## B2B taste intelligence report structure

For use when approaching brand partners at 10,000+ profiled users:

1. **Market snapshot** — total Cornr FTB users, growth rate, geographic distribution
2. **Style trend data** — archetype distribution shifts, emerging crossover patterns
3. **Category engagement** — product categories with highest save/click rates by archetype
4. **Budget behaviour** — price sensitivity by archetype; splurge vs save categories
5. **Predictive insight** — what's gaining momentum based on engagement trends

**Buyer persona:** Head of Product Merchandising or Consumer Insights Manager at a DTC homeware brand.
**Price point:** £0 for brand partners (partnership sweetener at 10–15K users); £2,500–5,000/quarter standalone (50K+ users).

## Consent architecture requirements

Before any data sharing with brand partners:

- `audience_data_opt_in` toggle: specific language naming data categories shared
- `email_marketing_opt_in` toggle: separate from audience data
- Both toggles: default OFF, unbundled from T&Cs, revocable post-signup
- Data Processing Agreement template ready before first brand conversation
- DPIA conducted before any brand data sharing begins
- Aggregate cohort minimum: k≥50 per segment before external sharing

## Sprint implications

- **Sprint 3 T1d:** Capture `acquisition_source` in engagement_events (consent-gated). Capture `recommendation_rank`, `product_price_band`, `session_id` — all required for brand pilot reporting.
- **Pre-Sprint 3:** Apply to all Awin retailer programmes. Test Wayfair webview commission attribution (S3-WAYFAIR task).
- **Post-Sprint 3:** Implement Awin S2S postback (S3-AWIN-POSTBACK) before any brand partner conversations.
- **v2 data product:** Automate quarterly report generation from PostHog + Supabase aggregate queries.
