# Cornr — Sprint 2: Swipe Flow + Archetype

**Goal:** Users can swipe through style cards, get matched to an archetype, set budget + room type, and be prompted to add a second room.

---

## T1 — SwipeCard Component (4-6h, cc — HIGHEST RISK)

**Owner:** cc (Claude)
**Estimate:** 4-6h

**Description:** Build the swipe card component used in the style quiz. This is the highest-risk task in the sprint — the gesture handling must feel native-quality.

**Steps:**
1. Create `src/components/SwipeCard.tsx`
2. Use `react-native-gesture-handler` + `react-native-reanimated` for swipe gestures
3. Card layout:
   - Full-width image with bottom fade (LinearGradient allowed here ONLY)
   - Title overlay at bottom
   - Card radius: 16px
4. Swipe RIGHT = like (weight 1.0)
5. Swipe LEFT = dislike (weight -0.4)
6. SECONDARY action (button tap) = secondary like (weight 0.4)
7. Haptic feedback on swipe threshold
8. Spring animation on release
9. Opacity/rotation interpolation during drag
10. `activeOpacity={0.85}` on secondary action button

**Done when:**
- [ ] Card renders with image + title
- [ ] Swipe right/left with spring animation
- [ ] Secondary action button works
- [ ] Haptic feedback at swipe threshold
- [ ] LinearGradient ONLY on image fade
- [ ] Card radius 16px
- [ ] Smooth 60fps gesture handling
- [ ] `npx tsc --noEmit` passes

---

## T2 — SwipeDeck + Quiz Flow (3-4h, cc)

**Owner:** cc (Claude)
**Estimate:** 3-4h

**Description:** Stack of SwipeCards that cycles through the style quiz images.

**Steps:**
1. Create `src/components/SwipeDeck.tsx`
2. Create `app/(main)/style-quiz.tsx` screen
3. Deck manages card stack (next card visible behind current)
4. Progress indicator (e.g. "3 of 12")
5. Track all swipe decisions in state: `{ imageId, direction, weight }`
6. On deck complete, pass decisions to scoring

**Done when:**
- [ ] Deck cycles through all cards
- [ ] Progress indicator shows position
- [ ] All swipe decisions tracked with correct weights
- [ ] Next card visible behind current
- [ ] Navigates to scoring on completion
- [ ] `npx tsc --noEmit` passes

---

## T3 — Archetype Scoring (2-3h, cc)

**Owner:** cc (Claude)
**Estimate:** 2-3h

**Description:** Score swipe decisions to determine the user's style archetype.

**Steps:**
1. Create `src/lib/scoring.ts`
2. Weighted scoring:
   - RIGHT (like) = +1.0 per matching tag
   - LEFT (dislike) = -0.4 per matching tag
   - SECONDARY = +0.4 per matching tag
3. Each image has tags mapping to archetypes
4. Sum scores per archetype, highest wins
5. Tie-breaking: most RIGHT swipes wins
6. Store result in Supabase `profiles.archetype`
7. NEVER show "archetype" in UI — use "your style" or "style profile"

**Done when:**
- [ ] Scoring function handles all three weights correctly
- [ ] Tie-breaking works
- [ ] Result stored in Supabase
- [ ] "archetype" never appears in UI strings
- [ ] Unit-testable pure function
- [ ] `npx tsc --noEmit` passes

---

## T4 — Archetype Result Screen (2-3h, cc)

**Owner:** cc (Claude)
**Estimate:** 2-3h

**Description:** Show the user their style result after completing the quiz.

**Steps:**
1. Create `app/(main)/style-result.tsx`
2. Display:
   - Style name (Display typography: 34px/700/letterSpacing -0.5)
   - Style description
   - Representative image
   - "Continue" CTA button
3. Fire PostHog `style_result_viewed` event (archetype name only, no PII)
4. All strings from `strings.ts`

**Done when:**
- [ ] Result screen shows style name + description + image
- [ ] Display typography for style name
- [ ] PostHog event fires
- [ ] "archetype" not in any UI text
- [ ] CTA navigates forward
- [ ] `npx tsc --noEmit` passes

---

## T5 — Profile Screen + Retake Quiz (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Profile screen showing style result with option to retake the quiz.

**Steps:**
1. Update `app/(tabs)/profile.tsx`
2. Show:
   - User's style name
   - "Retake style quiz" button
   - Account info (email)
3. Retake navigates back to style quiz, clears previous result
4. `activeOpacity={0.85}` on all pressables

**Done when:**
- [ ] Profile shows style name
- [ ] Retake quiz works (clears + restarts)
- [ ] Account email shown
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T6 — Budget + Room Type Selection (2-3h, cc)

**Owner:** cc (Claude)
**Estimate:** 2-3h

**Description:** After style result, user selects their budget range and first room type.

**Steps:**
1. Create `app/(main)/budget-room.tsx`
2. Budget selector:
   - Predefined ranges (from strings.ts)
   - Single selection
3. Room type selector:
   - Living room, Bedroom, Kitchen, Bathroom, Home Office, Dining Room
   - Single selection for first room
4. Store in Supabase: `profiles.budget_range`, `rooms` table
5. "Continue" CTA
6. All strings from `strings.ts`

**Done when:**
- [ ] Budget range selectable
- [ ] Room type selectable
- [ ] Both stored in Supabase
- [ ] CTA navigates to home/main
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T7 — Second Room Prompt (1-2h, cc)

**Owner:** cc (Claude)
**Estimate:** 1-2h

**Description:** After first room is set up, prompt user to add a second room.

**Steps:**
1. Create `src/components/SecondRoomPrompt.tsx`
2. Show on Home screen after first room is configured
3. "Add another room?" card
4. Tapping opens room type selector (reuse from T6)
5. Dismissible — don't show again if dismissed
6. Store dismissal in Supabase user preferences

**Done when:**
- [ ] Prompt appears after first room configured
- [ ] Opens room selector on tap
- [ ] Dismissible with persistence
- [ ] Does not reappear after dismissal
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes
