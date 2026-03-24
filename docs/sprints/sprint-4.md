# Cornr — Sprint 4: Tradespeople

**Goal:** Users can search for and call local tradespeople. No messaging, no quotes, no booking — call button only.

---

## T1 — search-tradespeople Edge Function (4h, cc)

**Owner:** cc (Claude)
**Estimate:** 4h

**Description:** Edge Function to search for tradespeople by trade type and location.

**Steps:**
1. Create Edge Function `search-tradespeople`
2. JWT verification at top — 401 if unauthenticated
3. Input: `{ trade_type, postcode, page }` (postcode entered by user, NOT from device location)
4. Query Google Places API (or equivalent) for tradespeople
5. API key in Supabase Edge Function secrets ONLY
6. Return: name, rating, review_count, phone, address, Companies House badge status
7. Sort results: rating DESC, review_count DESC
8. Paginate (20 per page)
9. Rate limit using `daily_call_count`

**Done when:**
- [ ] Edge Function exists and deploys
- [ ] JWT verified at top
- [ ] Searches by trade type + postcode
- [ ] Does NOT use device location API
- [ ] Results sorted: rating DESC, review_count DESC
- [ ] Paginated
- [ ] API key in secrets only
- [ ] Tested on staging

---

## T2 — Verify No Device Location API (1h, cc — NEW)

**Owner:** cc (Claude)
**Estimate:** 1h

**Description:** Audit the codebase to ensure no device location APIs are used. Cornr uses user-entered postcode only.

**Steps:**
1. Grep for `expo-location`, `Geolocation`, `navigator.geolocation`, `Location.requestPermissions`
2. Check `app.json` for location permissions
3. Check `package.json` for location packages
4. Document findings

**Done when:**
- [ ] No device location APIs in codebase
- [ ] No location permissions in app.json
- [ ] No location packages in package.json
- [ ] Documented in BUILD_LOG notes

---

## T3 — Trades Screen (3-4h, cc)

**Owner:** cc (Claude)
**Estimate:** 3-4h

**Description:** Trades tab screen where users search for and view tradespeople.

**Steps:**
1. Update `app/(tabs)/trades.tsx`
2. Trade type selector (dropdown or pills): Plumber, Electrician, Builder, Painter, Carpenter, etc.
3. Postcode input (user-entered, NOT auto-detected)
4. Search button
5. Results list:
   - Tradesperson name (card heading: 17px/600)
   - Rating + review count
   - Companies House badge ONLY (no Gas Safe badge in v1)
   - Call button (`tel:` link) — no messaging, no quotes, no booking
6. `activeOpacity={0.85}` on all pressables
7. All strings from `strings.ts`
8. Screen background: warmstone

**Done when:**
- [ ] Trade type selector works
- [ ] Postcode input (manual entry only)
- [ ] Results render with correct sort order
- [ ] Companies House badge shows (NO Gas Safe badge)
- [ ] Call button uses `tel:` link
- [ ] No messaging/quotes/booking UI
- [ ] All strings from `strings.ts`
- [ ] `activeOpacity={0.85}`
- [ ] `npx tsc --noEmit` passes

---

## T4 — Pagination for Trades Results (2h, cc)

**Owner:** cc (Claude)
**Estimate:** 2h

**Description:** Add infinite scroll or "Load more" pagination to trades results.

**Steps:**
1. Use react-query `useInfiniteQuery` for paginated results
2. "Load more" button or infinite scroll at bottom
3. Loading state for next page
4. Handle end of results gracefully

**Done when:**
- [ ] Pagination loads additional results
- [ ] Loading state shown
- [ ] End of results handled
- [ ] `npx tsc --noEmit` passes

---

## T5 — Google API Security Review (1h, cc)

**Owner:** cc (Claude)
**Estimate:** 1h

**Description:** Ensure Google Places API key is properly secured.

**Steps:**
1. Verify API key is in Supabase Edge Function secrets ONLY
2. Verify API key restrictions in Google Cloud Console (HTTP referrer or IP)
3. Verify no API keys in app code, .env, or git history
4. Run `scripts/verify/check-env.sh`

**Done when:**
- [ ] API key in Edge Function secrets only
- [ ] Key restrictions configured
- [ ] check-env.sh passes
- [ ] No keys in git history (check with `git log -p --all -S "AIza"`)

---

## T6-T13 — Rename Tasks x8 (1h total, cc)

**Owner:** cc (Claude)
**Estimate:** 1h total

**Description:** Rename all user-facing references from "Nook" to "Cornr" across the codebase.

**Steps:**
1. Grep for "Nook" (case-sensitive) in all source files
2. Replace with "Cornr" in:
   - `app.json` (name, slug, scheme)
   - `strings.ts`
   - Any UI text
   - README.md
   - package.json (name field)
3. Do NOT rename the project directory — that's a filesystem concern
4. Do NOT rename Supabase project — that requires migration
5. Update CLAUDE.md header if it says "Nook"

**Done when:**
- [ ] All user-facing "Nook" replaced with "Cornr"
- [ ] `app.json` updated
- [ ] `strings.ts` updated
- [ ] `package.json` name updated
- [ ] No "Nook" in UI-visible strings (grep confirms)
- [ ] `npx tsc --noEmit` passes
