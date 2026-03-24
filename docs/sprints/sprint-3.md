# Cornr — Sprint 3: Product Recommendations

**Goal:** AI-powered product recommendations via Claude Haiku, product cards, wishlist, room-based browsing.

---

## T1 — Schema Migration for Products (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Create the database schema for product recommendations and wishlists.

**Steps:**
1. Create migration SQL for:
   - `products` table (id, name, description, image_url, price, affiliate_url, category, tags, created_at)
   - `recommendations` table (id, user_id, room_id, product_id, rationale, score, created_at)
   - `wishlists` table (id, user_id, product_id, room_id, created_at)
2. Add RLS policies: users can only read/write their own recommendations and wishlists
3. Run on nook-staging FIRST, then production

**Done when:**
- [ ] Migration SQL written
- [ ] RLS policies in place
- [ ] Tested on staging
- [ ] Applied to production
- [ ] `npx tsc --noEmit` passes

---

## T2 — AI Consent Interstitial (2h, cc — NEW, Apple requirement)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Apple requires explicit user consent before AI-generated content is shown. Add an interstitial screen before first recommendation.

**Steps:**
1. Create `app/(main)/ai-consent.tsx`
2. Explain:
   - "Cornr uses AI to suggest products for your room"
   - "Your style profile, room type, and budget are used — never your name or email"
   - "You can turn this off anytime in Settings"
3. "I understand" CTA to accept
4. Store consent in Supabase `profiles.ai_consent`
5. Gate all AI recommendation screens behind this consent
6. All strings from `strings.ts`

**Done when:**
- [ ] Interstitial screen exists
- [ ] Consent stored in Supabase
- [ ] AI screens gated behind consent
- [ ] No PII mentioned in the explanation
- [ ] All strings from `strings.ts`
- [ ] `npx tsc --noEmit` passes

---

## T3 — recommend-products Edge Function (4h, cc)

**Owner:** cc (Claude)
**Estimate:** 4h

**Description:** Supabase Edge Function that calls Claude Haiku to generate product recommendations.

**Steps:**
1. Create Edge Function `recommend-products`
2. JWT verification at top — 401 if unauthenticated
3. Input: `{ room_id }` — function fetches archetype, budget, room type from DB
4. Build prompt for Claude Haiku:
   - Include archetype, room type, budget range in `<user_context>` tags
   - NO PII (no name, email, address)
   - Ask for 5-8 product recommendations with rationales
5. Parse Haiku response, match to products in DB
6. Each rationale must start with "Chosen because..."
7. Store recommendations in `recommendations` table
8. Rate limit using `daily_call_count`
9. API key in Supabase Edge Function secrets ONLY

**Done when:**
- [ ] Edge Function exists and deploys
- [ ] JWT verified at top
- [ ] Calls Claude Haiku with correct prompt
- [ ] No PII in API request
- [ ] User context wrapped in `<user_context>` tags
- [ ] Rationales start with "Chosen because..."
- [ ] Results stored in DB
- [ ] Rate limited
- [ ] API key in secrets only
- [ ] Tested on staging

---

## T4 — ProductCard Component (3h, cc)

**Owner:** cc (Claude)
**Estimate:** 3h

**Description:** Card component for displaying a product recommendation.

**Steps:**
1. Create `src/components/ProductCard.tsx`
2. Layout:
   - Product image (top)
   - Product name (card heading: 17px/600)
   - Price
   - AI rationale in teal panel (bg #F0FDFA, text #134E4A)
   - Rationale always starts "Chosen because..."
   - "View" CTA button
   - Wishlist heart icon (toggle)
3. Card radius: 16px
4. `activeOpacity={0.85}` on all pressables
5. All strings from `strings.ts`

**Done when:**
- [ ] ProductCard renders with all fields
- [ ] Teal panel for rationale (correct colours)
- [ ] Rationale starts "Chosen because..."
- [ ] Wishlist toggle works
- [ ] Card radius 16px
- [ ] `activeOpacity={0.85}`
- [ ] `npx tsc --noEmit` passes

---

## T5 — Products Screen + Room Selector (3h, cc)

**Owner:** cc (Claude)
**Estimate:** 3h

**Description:** Products tab screen showing recommendations filtered by room.

**Steps:**
1. Update `app/(tabs)/products.tsx`
2. Room selector at top (horizontal scrollable pills)
3. Product cards in scrollable list below
4. Fetch recommendations via react-query
5. Affiliate disclosure in screen header only (from `STRINGS.affiliateDisclosure`)
6. Empty state if no recommendations yet
7. Screen background: warmstone

**Done when:**
- [ ] Room selector filters products
- [ ] ProductCards render from react-query data
- [ ] Affiliate disclosure in header (from strings.ts)
- [ ] Empty state for no recommendations
- [ ] warmstone background
- [ ] `npx tsc --noEmit` passes

---

## T6 — Wishlist (2-3h, cc)

**Owner:** cc (Claude)
**Estimate:** 2-3h

**Description:** Users can save products to a wishlist and view them.

**Steps:**
1. Create `app/(main)/wishlist.tsx`
2. List of wishlisted ProductCards
3. Add/remove from wishlist via heart icon on ProductCard
4. Persist to `wishlists` table in Supabase
5. Empty state if no wishlisted items
6. Accessible from Profile tab

**Done when:**
- [ ] Wishlist screen shows saved products
- [ ] Heart toggle adds/removes from wishlist
- [ ] Persisted in Supabase
- [ ] Empty state
- [ ] Accessible from Profile
- [ ] `npx tsc --noEmit` passes

---

## T7 — Recommendation Refresh (1-2h, cc)

**Owner:** cc (Claude)
**Estimate:** 1-2h

**Description:** Allow users to refresh their product recommendations.

**Steps:**
1. Add "Refresh" button on Products screen
2. Calls `recommend-products` Edge Function again
3. Loading state while fetching
4. Respects daily rate limit — show message if limit reached
5. Invalidate react-query cache on success

**Done when:**
- [ ] Refresh button triggers new recommendations
- [ ] Loading state shown
- [ ] Rate limit message when exceeded
- [ ] react-query cache invalidated
- [ ] `npx tsc --noEmit` passes
