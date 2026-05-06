# Bridge Sprint 2-prime — Task Prompts

**Purpose:** These are paste-ready prompts for Claude Code sessions. Each prompt contains literal values — no descriptions Claude Code has to interpret. Run as a focused sprint over 4–5 sessions before resuming Sprint 2 T2.

**Prerequisite:** Sprint 2 T1 SwipeCard merged to main. Error handling branch merged to main. Main is clean.

**Sequencing:** BS2-T0 (mock test, no code) → BS2-T1 + BS2-T2 (Welcome + ContextChip) → BS2-T3 (chapter marker) → BS2-T4 (escape hatch routing + browse) → BS2-T5 (home canvas + accent feed) → BS2-T6 (schema) → BS2-T7 (events) → BS2-T8 (copy pass). Tasks within a session can be batched where noted.

---

## BS2-T0 — Mock-first user test (no Claude Code — founder task)

**Not a code task.** Build a throwaway mock (Figma, hard-coded HTML, or screenshots in a slide deck) showing:

1. Welcome screen with three zones: "Find your home style" button, chip row ("Where would you like to start?" — Living room, Kitchen, Bedroom, Dining room, Bathroom, Other, plus "I'm not sure yet" link below), and "I know what I'm shopping for" small link at bottom
2. A representative 4-card swipe sequence with a chapter marker between cards 4 and 5
3. An archetype reveal screen saying "Your home's style is The Curator · Warm Scandi"
4. The Home tab showing: "Your home" canvas with 8 room placeholders (styled: "Your living room →", unstyled: "Your kitchen, still becoming"), editorial card below, "Things for your home" accent feed showing 4 product cards (rug, lamp, cushion, art print)
5. The escape-hatch browse screen showing a list of 8 products filtered by "Living room", sorted by price, with a subtle banner "Want personalised picks? Take the 2-minute style quiz"

**Test plan:** Show to 6 people in your network who are first-time buyers or recently moved. 30 minutes each. Don't explain anything. Hand them the phone/screen and say "this is a new app for people furnishing a home — have a go." Watch what they do. Ask: "what did you think that was going to do?" after each tap. Ask: "if you were using this for real, what would you be trying to accomplish?" at the end.

**Gate:** Only proceed to BS2-T1 if the concept validates. If users don't understand the chip row, iterate the copy. If users reflexively take the escape hatch and skip the quiz entirely (>50% of testers), flag for strategy reopen. Write test findings in a note and share in the planning chat before proceeding.

---

## BS2-T1 — Welcome screen rebuild

**Branch:** `feat/bridge-sprint-2/welcome-rebuild`

```
Read docs/CORNR_CANONICAL.md Section 2 (two-tier room context capture) and docs/strategy/cornr-design-system-for-claude-design.md.

Rebuild the Welcome screen (app/(auth)/welcome.tsx or equivalent) with three interaction zones in clear visual hierarchy.

ZONE 1 — Primary CTA:
- PrimaryButton: label "Find your home style"
- Full width, accent-surface (#B28760) bg, ink (#1A1814) text, DM Sans 16px/600
- onPress: navigate to swipe deck screen
- accessibilityLabel="Find your home style, button"

ZONE 2 — Room interest chip row:
- Section label: "Where would you like to start?" in DM Sans 14px/500 warm-600 (#6B6358), 24px above chip row
- Row of ContextChip components (see BS2-T2) in a horizontal ScrollView or flex-wrap row:
  - "Living room" (icon: Phosphor Couch light 20px)
  - "Kitchen" (icon: Phosphor CookingPot light 20px)
  - "Bedroom" (icon: Phosphor Bed light 20px)
  - "Dining room" (icon: Phosphor ForkKnife light 20px)
  - "Bathroom" (icon: Phosphor Bathtub light 20px)
  - "Other" (icon: Phosphor House light 20px)
- Selection state: single-select, tapping a selected chip deselects it
- Below the chip row: GhostLink "I'm not sure yet" in 14px/500 warm-600, highlight "not sure" in accent (#94653A)
- Tapping a chip: store selection in local state, pass to swipe deck as prop
- Tapping "I'm not sure yet": clear selection, same navigation as primary CTA
- accessibilityHint on each chip: "Select this room to personalise your style quiz"

ZONE 3 — Escape hatch:
- GhostLink at bottom: "I know what I'm shopping for" in 14px/500 warm-600, highlight "shopping" in accent (#94653A)
- onPress: navigate to escape hatch room picker (BS2-T4 route, stub for now — just navigate to Home tab if route doesn't exist yet)
- accessibilityLabel="I know what I'm shopping for, skip the style quiz"

LAYOUT:
- Full-bleed background image with ink-toned dark overlay rgba(26,24,20,0.35) per BDS v3
- Wordmark "cornr" at top (Lora Bold 28px, white)
- Zones stacked vertically with space-between, pinned to bottom safe area
- Zone 1 (primary CTA) visually dominant
- Zone 2 (chip row) below Zone 1, 20px gap
- Zone 3 (escape hatch) below Zone 2, 16px gap, above safe area bottom

All colours from tokens.ts. No hardcoded hex values in component code. Run npx tsc --noEmit.
```

---

## BS2-T2 — ContextChip molecule

**Can be batched with BS2-T1.**

```
Create src/components/molecules/ContextChip.tsx — a new molecule for the Welcome screen room chip row.

Props:
- label: string (e.g. "Living room")
- icon: React.ReactNode (Phosphor icon component)
- selected: boolean
- onPress: () => void

Visual spec:
- Unselected: bg white (#FFFCF9), border 1px warm-200 (#D4CBC0), radius-badge (6px), padding 8px horizontal 6px vertical
  - Icon: 20px warm-400 (#948A7D)
  - Label: DM Sans 13px/500 warm-600 (#6B6358)
- Selected: bg accent-light (#E8D4BC), border 1.5px accent (#94653A), same radius and padding
  - Icon: 20px accent (#94653A)
  - Label: DM Sans 13px/600 ink (#1A1814)
- Press: activeOpacity 0.85, haptic-selection
- Touch target: minimum 44pt height including padding
- accessibilityRole="radio"
- accessibilityState={{ checked: selected }}
- accessibilityHint provided by parent (Welcome screen)

Add to docs/strategy/cornr-design-system-for-claude-design.md component inventory under Molecules.

All colours from tokens.ts. Run npx tsc --noEmit.
```

---

## BS2-T3 — DeckChapterMarker molecule

```
Create src/components/molecules/DeckChapterMarker.tsx — a subtle visual divider rendered by SwipeDeck between groups of 4 cards.

Props:
- label: string (e.g. "Your kitchen style")

Visual spec:
- Full width of the swipe deck area
- Label: Newsreader Italic 14px/400, warm-600 (#6B6358), centered
- Above and below: 1px line in warm-200 (#D4CBC0), 40px wide, centered, 8px gap from label
- Vertical margin: 12px above and below the whole marker
- Fade-in animation: opacity 0→1 over 300ms (duration-normal) when the marker becomes the top of the stack
- Reduce Motion: instant opacity, no animation
- accessibilityLabel: label text (e.g. "Now: your kitchen style")
- accessibilityRole="header"

This component is rendered by SwipeDeck (Sprint 2 T2), not by SwipeCard. It sits between card groups in the stack. SwipeDeck will insert it at indices 4, 8, and 12 of a 16-card deck.

All colours from tokens.ts. Run npx tsc --noEmit.
```

---

## BS2-T4 — Escape hatch routing + minimum-bar browse

**Branch:** `feat/bridge-sprint-2/escape-hatch`

```
Read docs/CORNR_CANONICAL.md Section 0 (10 April D-prime entry) and Section 2 (two-tier room context).

Build the escape hatch flow: Welcome "I know what I'm shopping for" → room picker → anonymous browse.

PART 1 — Room picker screen:
- New route: app/(task)/room-picker.tsx
- Screen title: "What are you looking for?" in Lora 22px/600 ink
- 6 SelectorCards in a 2x3 grid (reuse existing SelectorCard molecule):
  - Living room (Phosphor Couch)
  - Kitchen (Phosphor CookingPot)
  - Bedroom (Phosphor Bed)
  - Dining room (Phosphor ForkKnife)
  - Bathroom (Phosphor Bathtub)
  - Other (Phosphor House)
- Single-select. Tapping navigates to browse screen with room_type as route param.
- Below grid: GhostLink "Actually, I'd like to find my style first" → navigate back to Welcome
- White (#FFFCF9) background (FocusScreen template)
- accessibilityRole="radiogroup" on the grid container

PART 2 — Anonymous browse screen:
- New route: app/(task)/browse.tsx
- Receives room_type as route param
- Screen title: "[Room type]" in Lora 22px/600 ink (e.g. "Living room")
- FlatList of ProductCard components (existing organism), filtered by room_type
- For v1/Bridge Sprint: hardcode 8-12 products per room from the existing products table. If products table is empty, use placeholder data with real Pexels images and realistic titles/prices.
- Sort: by price ascending (default), with a small sort toggle for "Price ↑" / "Price ↓"
- No filters beyond room in v1
- No wishlist (requires auth)
- No saved state

PART 3 — Soft nudge after 3 product taps:
- After the user taps 3 ProductCard items (tracked via local counter, not persisted), show a non-blocking banner at the bottom of the screen:
  - Banner: bg accent-light (#E8D4BC), radius-card (16px), padding 16px, shadow-card
  - Text: "Want picks matched to your style?" DM Sans 14px/500 ink
  - CTA: "Take the 2-minute quiz" as a small PrimaryButton (condensed width)
  - Dismiss: small X icon (Phosphor X light 18px warm-400) top-right, tapping dismisses permanently for this session
  - If dismissed, do not show again until next app session
  - accessibilityLabel="Personalisation suggestion. Want picks matched to your style? Take the 2-minute quiz. Dismiss."

PART 4 — Navigation integration:
- Welcome screen escape hatch GhostLink (BS2-T1) now navigates to app/(task)/room-picker
- Back button on room picker returns to Welcome
- Back button on browse returns to room picker

Cream (#FAF7F3) background on browse (ListScreen template). All colours from tokens.ts. Run npx tsc --noEmit.
```

---

## BS2-T5 — "Your home" canvas section on Home tab

**Branch:** `feat/bridge-sprint-2/home-canvas`

```
Read docs/CORNR_CANONICAL.md Section 0 (D-prime), Section 2 (two-tier), and Section 5 (editorial surface).

Modify the Home tab screen to add "Your home" canvas as the top section, above the existing EditorialCard and below the screen title.

The Home tab now has three sections in order:
1. "Your home" canvas (new)
2. EditorialCard (existing, unchanged)
3. "Things for your home" multi-room accent feed (new)

SECTION 1 — "Your home" canvas:
- Section heading: "Your home" in Lora 20px/600 ink, 20px below screen title
- Horizontal ScrollView of room placeholder cards, 12px gap between cards
- Each placeholder card:
  - Width: 140px, height: 160px
  - White (#FFFCF9) bg, radius-card (16px), shadow-card
  - Unstyled state:
    - Phosphor room icon (light 32px warm-400 #948A7D), centered top third
    - Room label: DM Sans 14px/500 ink, centered
    - Subtext: Newsreader Italic 12px/400 warm-400, centered. Use editorial placeholder copy:
      - Living room: "Still becoming"
      - Kitchen: "Waiting for you"
      - Bedroom: "Not yet yours"
      - Dining room: "A table, some day"
      - Bathroom: "Quiet potential"
      - Other: "Open to anything"
    - onPress: navigate to room setup flow (existing Sprint 2 T6 route, or stub if not built yet)
  - Styled state (after room setup completion):
    - Same card dimensions
    - Accent (#94653A) thin top border (2px)
    - Phosphor room icon (fill 32px accent #94653A)
    - Room label: DM Sans 14px/600 ink
    - Subtext replaced with archetype badge: Badge component (ink variant) showing primary archetype short name
    - onPress: navigate to room-specific product recommendations

- Progress counter below ScrollView:
  - "Your styled rooms: [N]" in DM Sans 14px/500 warm-600
  - Only visible when N ≥ 1 (hide when no rooms are styled)
  - No denominator. No "of 8". Collection framing only.
  - accessibilityLabel="You have styled N rooms"

- "Add a room" affordance at the end of the ScrollView:
  - Dashed border card (1px dashed warm-200), same dimensions as room cards
  - Phosphor Plus light 24px warm-400, centered
  - Label: "Add a room" DM Sans 13px/500 warm-400
  - onPress: navigate to room setup flow

SECTION 2 — EditorialCard:
- Unchanged from canonical Section 5 and existing implementation
- Sits below the canvas ScrollView with 32px top margin

SECTION 3 — "Things for your home" multi-room accent feed:
- Section heading: "Things for your home" in Lora 20px/600 ink, 32px above first card
- FlatList (horizontal or vertical — vertical preferred for consistency with ListScreen template) of ProductCard components
- Query: products where product_scope = 'multi_room', filtered by user's primary_archetype if available
- If no archetype yet (escape hatch user): show unfiltered multi_room products
- If products table has no multi_room items yet: show EmptyState with heading "Coming soon" and body "We're curating accent pieces for your style."
- 12px gap between cards
- accessibilityLabel on section heading: "Things for your home — accent pieces that work across any room"

The Home tab uses cream (#FAF7F3) background (ListScreen template). Pull-to-refresh preserved. All colours from tokens.ts. Run npx tsc --noEmit.
```

---

## BS2-T6 — Schema migration

**Can be batched with any other task session.**

```
Apply the following schema migration to Supabase staging (project tleoqtldxjlyufixeukz).

-- D-prime: room interest from Welcome chip row
ALTER TABLE users ADD COLUMN IF NOT EXISTS room_interest VARCHAR(20);

-- D-prime: product scope for multi-room vs room-specific commerce layer
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_scope VARCHAR(20)
  DEFAULT 'room_specific'
  CHECK (product_scope IN ('multi_room', 'room_specific'));

After applying:
1. Verify RLS still passes on users table — run a SELECT as test-a@cornr.test (UUID: 0e675e05-63de-46a0-bdfb-cb101268bf3f) and confirm own-row-only access
2. Verify the new columns appear with correct defaults
3. Update the test users: set room_interest = 'living_room' on test-a, leave test-b as NULL
4. Insert 2 test products with product_scope = 'multi_room' and 2 with product_scope = 'room_specific' if products table has test data

Run npx tsc --noEmit (no app code changes in this task, but confirm no regressions).
```

---

## BS2-T7 — Event wiring

**Branch:** `feat/bridge-sprint-2/events` (or batch into the branch of the task you're running alongside)

```
Read docs/CORNR_CANONICAL.md Section 4 (engagement data architecture).

Wire the following new events using the existing recordEvent function in src/services/engagement.ts. All events fire to BOTH PostHog (.capture()) AND engagement_events table (recordEvent()).

NEW EVENTS:

1. welcome_viewed
   - Fires on Welcome screen mount
   - Payload: { layout_version: 'dprime' }

2. welcome_chip_tapped
   - Fires when a ContextChip is tapped on Welcome
   - Payload: { room: string, tap_order: number }
   - tap_order increments if user changes mind (first tap = 1, second = 2)

3. welcome_escape_hatch_tapped
   - Fires when "I know what I'm shopping for" is pressed
   - Payload: {}

4. welcome_primary_cta_tapped
   - Fires when "Find your home style" is pressed
   - Payload: { with_chip: boolean, chip_value: string | null }

5. swipe_deck_weighted
   - Fires on SwipeDeck mount when room weighting is applied
   - Payload: { weight_room: string }

6. escape_hatch_nudge_shown
   - Fires when the soft nudge banner appears on the browse screen
   - Payload: { interaction_count: number }

7. escape_hatch_nudge_accepted
   - Fires when user taps "Take the 2-minute quiz" on the nudge
   - Payload: {}

8. escape_hatch_nudge_dismissed
   - Fires when user dismisses the nudge
   - Payload: {}

9. browse_viewed
   - Fires on browse screen mount
   - Payload: { room_type: string, entry_path: 'escape_hatch' }

10. browse_product_tapped
    - Fires when a ProductCard is tapped on the browse screen
    - Payload: { product_id: string, room_type: string, position: number }

11. browse_nudge_converted
    - Fires when a user who saw the nudge subsequently completes the quiz
    - Payload: { sessions_before_conversion: number }
    - Note: this requires tracking nudge_shown state — store in AsyncStorage or local state

12. home_canvas_viewed
    - Fires on Home tab mount when canvas is visible
    - Payload: { styled_room_count: number, total_room_count: number }

13. room_placeholder_tapped
    - Fires when a room placeholder on the canvas is tapped
    - Payload: { room_type: string, was_styled: boolean }

14. multi_room_feed_viewed
    - Fires when "Things for your home" section scrolls into view (use onViewableItemsChanged or intersection observer pattern)
    - Payload: { item_count: number }
    - Debounce: once per session

15. multi_room_product_tapped
    - Fires when a ProductCard in the accent feed is tapped
    - Payload: { product_id: string, archetype: string | null }

16. room_completion_incremented
    - Fires when a room setup is completed from the canvas
    - Payload: { room_type: string, room_count: number }

EXISTING EVENT EXTENSION:

quiz_card_swiped (already spec'd in Sprint 2 T2) gains one new property:
- source_room_context: string — the room_context tag of the card that was swiped

This does NOT require changing the SwipeCard component — the room_context comes from the card data, and SwipeDeck passes it through when firing the event.

All event payloads follow the existing pattern in src/services/engagement.ts. Run npx tsc --noEmit.
```

---

## BS2-T8 — Copy pass

**Not a Claude Code task — founder task with Claude.ai support.**

Voice-gate the following copy through the BDS v3 voice rules and the banned-word list in CLAUDE.md. All copy below is a starting point — workshop in the planning chat before committing.

| Surface | Copy | Notes |
|---|---|---|
| Welcome primary CTA | "Find your home style" | Shifted from "your style" to "your home style" |
| Welcome chip row label | "Where would you like to start?" | Invitational, not interrogative |
| Welcome chip "I'm not sure yet" | "I'm not sure yet" | GhostLink, reassuring |
| Welcome escape hatch | "I know what I'm shopping for" | Clear intent signal |
| Swipe chapter marker 1 | "Your living room style" | Newsreader italic |
| Swipe chapter marker 2 | "Your kitchen style" | |
| Swipe chapter marker 3 | "Your bedroom style" | |
| Swipe chapter marker 4 | "Your finishing touches" | Covers flex/other rooms |
| Archetype reveal headline | "Your home's style is" | Whole-house promise |
| Home tab canvas heading | "Your home" | Lora section heading |
| Canvas progress counter | "Your styled rooms: [N]" | No denominator |
| Canvas placeholder — Living room | "Still becoming" | Editorial, not administrative |
| Canvas placeholder — Kitchen | "Waiting for you" | |
| Canvas placeholder — Bedroom | "Not yet yours" | |
| Canvas placeholder — Dining room | "A table, some day" | |
| Canvas placeholder — Bathroom | "Quiet potential" | |
| Canvas placeholder — Other | "Open to anything" | |
| Canvas "Add a room" | "Add a room" | Simple, no ceremony |
| Accent feed heading | "Things for your home" | Not "accessories" or "small items" |
| Browse nudge text | "Want picks matched to your style?" | |
| Browse nudge CTA | "Take the 2-minute quiz" | Specific time commitment |
| Browse nudge dismiss | X icon, no text | |
| Room picker heading | "What are you looking for?" | |
| Room picker back link | "Actually, I'd like to find my style first" | Warm redirect |

Workshop these in the planning chat. Run each through the banned-word list: curated, bespoke, journey, unlock, stunning, AI-powered, discover, elevate, reimagine, transform, algorithm, optimise, leverage, synergy. None of the above contain banned words.

---

## Section 11 updates (paste into canonical)

Add to the Open Questions table:

| Question | Resolve by | Default |
|---|---|---|
| Escape hatch engagement rate reopen gate | Post-TestFlight, first 100 users | If >35%, reopen taste-first primacy |
| Quiz completion rate on 16-card deck | Post-TestFlight, first 100 users | If <45%, reduce to 12 cards |
| Entry point Mom Test item-vs-room interviews | Post-TestFlight, ~50 users | Run interview, reopen if majority describe room-first mental models |
| Ad-traffic landing flow (Marcus persona) | Before first paid acquisition campaign | Build ad-specific landing pages bypassing Welcome |
| Mock-first user test outcome gate | Before Bridge Sprint 2 production code | Proceed if validates; iterate if partial; reopen strategy if fundamentally rejected |

Resolve existing question: "Swipe card count: 12 or 15" — **Resolved 10 April 2026: 16 cards under whole-house framing. Reduction to 12 triggered if completion drops below 45%.**

---

*End of Bridge Sprint 2-prime task prompts. Eight tasks. ~21–22 hours total including mock-first test. Copy-paste ready for Claude Code sessions (except BS2-T0 and BS2-T8 which are founder tasks).*
