## Section 2 — Room Context Capture (v1, two-tier)

Room context is captured at two points in the user journey. Tier 1 is lightweight and optional, before the quiz. Tier 2 is rich and per-room, after the archetype reveal. Both tiers feed the Sprint 3 recommendation engine and the v2 data asset.

### Tier 1 — Welcome screen room interest (pre-quiz, optional)

The Welcome screen includes a "Where would you like to start?" chip row with 6–7 room options plus "I'm not sure yet" as the default-gentle option.

**Room chips:** Living room, Kitchen, Bedroom, Dining room, Bathroom, Flex/Other. Optional seventh chip (Hallway/Study) added if TestFlight feedback demands it.

**Behaviour:**
- Tapping a chip stores `room_interest` on the `users` table
- The swipe deck weights toward the selected room's 4 cards appearing first in the 16-card sequence
- Not tapping any chip is the default — the deck runs room-balanced
- "I'm not sure yet" is a GhostLink below the chip row, explicitly reassuring Pre-Purchase Researchers that they don't need a room in mind

**This is a starting-point preference, not a constraint.** It does not commit the user to a room. It does not gate any content. It exists to (a) signal that Cornr understands the user may have a specific room in mind, (b) capture room-interest data for the v2 brand partnership asset, and (c) weight the swipe deck for a more relevant experience.

### Tier 2 — Room setup constraint capture (post-reveal, per-room)

After the archetype reveal, the user lands on the Home tab with a "Your home" canvas showing room placeholders. Each room placeholder is tappable to start per-room setup. Room setup is a per-room deepening action from the canvas, not a mandatory funnel step.

At room setup, three fields are captured per room:

**1. `occupancy_status`** — "Have you moved in yet?" — three single-tap options:
- "Yes, I'm settling in" → real room, postcode-derived `property_period` applied, full recommendation flow
- "Not yet, I'm planning ahead" → aspirational room (`is_aspirational=true`), no postcode dependency, inspiration-led recommendation flow
- "I'm renovating an existing space" → real room, `room_stage` pre-fills as `partial`

**2. `room_stage`** — "Where are you with this room?" — three options:
- `scratch` (starting from empty)
- `partial` (have a few key pieces)
- `polishing` (mostly furnished, just refining)

**3. `existing_categories`** — "Anything you're keeping?" — six checkboxes plus "Nothing yet":
- Big furniture
- Soft furnishings
- Lighting
- Wall art / decor
- Storage
- Nothing yet (clears all other checkboxes when selected)

All three fields stored on the `rooms` table. All three passed into the Sprint 3 Haiku prompt alongside `room_interest` from Tier 1. Frame as a *briefing*, not a *form* — copy treats this as Cornr getting better at serving the user, not Cornr making the user work.

**Pre-fill behaviour:** If `room_interest` was set at Welcome (Tier 1), the room type picker in Tier 2 pre-fills with that value. The user can change it. This saves one tap for users who signalled their starting room at Welcome.

### How the two tiers interact

Users who complete both tiers have a rich signal: room_interest (which room they care about most) + archetype + room_type + budget + stage + existing_categories. This is the full input set for the Sprint 3 recommendation engine.

Users who complete only Tier 1 (or skip both) have a lighter signal: archetype + room_interest (or null). These users receive multi-room accent recommendations on the Home tab feed (`product_scope = 'multi_room'`), which requires no room setup. They can browse and wishlist accent items indefinitely and set up a room whenever they're ready.

Users who take the escape hatch at Welcome skip both tiers initially. They browse the "Your home" canvas and the multi-room accent feed anonymously. After 3–4 interactions, a soft nudge invites them to take the quiz.
