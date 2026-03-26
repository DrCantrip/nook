# Cornr Design Specifications

> **This file is the single source of truth for all visual implementation.**
> Claude Code MUST read this file before building or modifying any screen.
> These specs come from the UX Design Review, Brand Identity v2.0, and Atomic Design System v1.1.
> Do not deviate. Do not guess. If a value isn't here, check with the user before proceeding.

---

## 1. Colour Rules

### The 90/10 rule
90% of every screen surface is white or warmstone. 10% is colour. Colour is accent, not base.

### Colour assignments (STRICT)
| Colour | Token | Use ONLY for |
|--------|-------|-------------|
| primary-900 | #1A3A5C | Primary CTA background, screen headings, active nav icon+label, wordmark on light bg |
| primary-600 | #3A6A9A | Interactive text, links, secondary button borders+text, interactive icons |
| neutral-500 | #6B7280 | Minimum for meaningful body text (passes WCAG on white) |
| neutral-400 | #9CA3AF | NEVER for meaningful text. Placeholder text only |
| warmstone | #F5F4F0 | Screen background behind card lists |
| teal-50/900 | #F0FDFA / #134E4A | AI-generated content ONLY (rationale panels) |
| white | #FFFFFF | Focus screen backgrounds, card backgrounds |

### Dark overlay (Welcome screen + SwipeCard only)
These are the ONLY two places gradients are permitted. Use expo-linear-gradient.

---

## 2. Typography

### Type roles (exact values)
| Role | Size | Weight | Tracking | Line height | Use |
|------|------|--------|----------|-------------|-----|
| Display | 34px | 700 | -0.5px | 40px | Archetype name on result screen ONLY |
| Section heading | 20px | 600 | -0.3px | 26px | Section labels within a screen |
| Screen title | 22px | 600 | -0.3px | 28px | Screen heading. One per screen |
| Card heading | 17px | 600 | 0px | 22px | Product name, tradesperson name, room name |
| Body | 16px | 400 | 0px | 24px | All descriptive text |
| UI label | 14px | 500 | 0px | 20px | Form labels, nav labels, supporting text. neutral-600 only |
| Badge/chip | 12px | 600 | 0.4px | 16px | Category badges, budget chips. Uppercase |
| CTA label | 16px | 600 | 0.2px | 20px | Button text only |

### Wordmark "cornr"
- sm: 20px/700/-0.5px (footer, badges)
- md: 28px/700/-0.5px (welcome screen, result loading)
- lg: 40px/700/-1px (splash, brand materials)
- Colour: primary-900 on light bg, white on dark/image bg

### Font
System font only. No custom fonts.

---

## 3. Spacing

| Context | Value |
|---------|-------|
| Screen horizontal padding | 20px (NOT 16) |
| Screen top padding (below header) | 24px |
| Screen bottom padding (above safe area) | 32px |
| Between major sections | 32px |
| Between related items within a section | 20px |
| Within a component (e.g. image to text in card) | 12px |
| Card internal padding | 20px horizontal, 16px vertical |
| Between cards in a list | 12px gap |
| Heading to first content below | 20px below screen title, 12px below section label |
| Empty state vertical position | 40% from top (optical centre, not 50%) |

---

## 4. Components

### PrimaryButton
- Background: primary-900 (#1A3A5C). Flat. No gradient. No shadow.
- Text: white, 16px, weight 600, tracking +0.2px
- Height: 52px (minHeight: 52). NOT 44 or 50.
- Border radius: 10px. Not 8. Not 12.
- Width: Full width (alignSelf: 'stretch')
- Press state: activeOpacity={0.85}. NEVER 0.5.
- Haptic: Haptics.impactAsync(ImpactFeedbackStyle.Light) on press
- NO scale animation on buttons (Brand Identity rule)

### PrimaryButton INVERTED (Welcome screen only)
Same as above but: background WHITE, text primary-900.

### GhostButton (secondary actions)
- Background: transparent
- Border: 1.5px solid primary-600
- Text: primary-600, 16px, weight 600
- Height: 52px
- Border radius: 10px
- Press state: activeOpacity={0.85}

### Text link
- Colour: primary-600
- Size: 14px, weight 500
- Touch target: minimum 44pt (use paddingVertical: 12 on TouchableOpacity)
- No underline

### Form inputs
- Border: 1px solid neutral-200
- Border radius: 12px
- Height: 48px
- Padding: 16px horizontal
- Font: 16px, weight 400
- Placeholder: neutral-400
- Label above: 14px, weight 500, neutral-600, marginBottom 8
- Focus border: primary-600
- Error border: red-500, error text below in red-500 12px

### Bottom tab bar
- Background: white
- Top border: 1px solid neutral-100
- Icon size: 24px (was 20px in UX review, 24px in Atomic Design)
- Active: primary-900, fill weight icon + label
- Inactive: neutral-500, light weight icon + label
- Label: 11px, weight 500
- Active icon animation: scale 1.0→1.1→1.0 (one of only two places scale is permitted)

---

## 5. Screen Specifications

### Welcome screen
- Layout: Full-screen ImageBackground (hero photo)
- Overlay: expo-linear-gradient, transparent → rgba(0,0,0,0.35), lower 50%
- Top content (centred, top safe area + 60px):
  - Wordmark "Cornr": 28px/700/white/letterSpacing -0.5
  - Gap: 8px
  - "Every corner, considered." 16px/400/white at 80% opacity
- Bottom content (pinned to bottom safe area, 32px bottom padding, 20px horizontal padding):
  - "Find your home style in 60 seconds." 20px/600/white/centred
  - Gap: 16px
  - "Get started" button: INVERTED (white bg, primary-900 text), 52px height, radius 10, full width
  - Gap: 16px
  - "Already have an account? Sign in" 14px/white at 70% opacity, centred, paddingVertical 12 for 44pt touch target
- Navigation: "Get started" → router.push('/sign-up'). "Sign in" → router.push('/sign-in')
- What NOT to include: feature lists, app store badges, social proof counters
- Implementation notes:
  - SafeAreaView: edges={["top", "bottom"]}, cssInterop={false}
  - Bottom CTA section: paddingHorizontal 20px, paddingBottom 16px (above safe area inset)
  - Button wrapper View: cssInterop={false} (NativeWind strips backgroundColor otherwise)
  - All styles via StyleSheet.create, not inline objects
  - LinearGradient: pointerEvents="none" (prevents blocking button touches)
  - Total bottom section height ~170px (headline 26 + gap 16 + button 52 + gap 16 + link 44 + padding 16)

### Sign Up screen
- Background: warmstone (#F5F4F0)
- Back arrow: top-left, Phosphor ArrowLeft, 24px, primary-900, 44pt touch target
- Screen title: "Create account" 22px/600/primary-900
- Fields: Email, Password (form input spec above)
- 18+ checkbox: must block submit when unchecked
- Privacy policy link: Alert (not URL) until cornr.co.uk is live
- CTA: "Sign up" PrimaryButton spec
- Bottom: "Already have an account? Sign in" text link

### Sign In screen
- Same structure as Sign Up but: title "Welcome back", fields Email + Password
- "Forgot your password?" link below password field (14px, primary-600)
- CTA: "Sign in" PrimaryButton spec
- Bottom: "Don't have an account? Sign up" text link

### Home screen (empty state)
- Background: warmstone (#F5F4F0)
- Screen title: "Your Home" 22px/600/primary-900
- Empty state at 40% from top (optical centre):
  - Phosphor DoorOpen, 64px, neutral-300
  - "Your home, waiting to become yours." 16px/400/neutral-600
  - "Add your first room to get started." 14px/400/neutral-500
  - CTA: "Add a room" PrimaryButton spec

### Home screen (with rooms)
- FlatList of room cards on warmstone background
- Room cards: white bg, 16px radius, card shadow spec, card internal padding
- If 1 room with recommendations loaded: show second-room prompt below

---

## 6. Motion & Press States

### Buttons
- activeOpacity={0.85} + haptic (Light impact). NO scale.
- This is the ONLY press treatment for buttons.

### Heart icon (wishlist)
- Scale 1.0→1.2→1.0 spring animation on toggle. One of only two places scale is permitted.

### Tab bar icons
- Scale 1.0→1.1→1.0 on active. One of only two places scale is permitted.

### Reduce Motion
- All animations → instant (no duration)
- Haptics still fire

---

## 7. Shadows

### Card shadow (ProductCard, room cards)
- iOS: shadowColor #000, shadowOffset {0,1}, shadowOpacity 0.06, shadowRadius 12
- Android: elevation 2
- Light and diffuse. Lifts without dramatising.

### SwipeCard shadow (SwipeCard ONLY)
- iOS: shadowColor #000, shadowOffset {0,8}, shadowOpacity 0.12, shadowRadius 20
- Android: elevation 8
- Stronger — card hovers above screen. Only on SwipeCard.

---

## 8. Icons

### Library: Phosphor Icons (phosphor-react-native)
- Default weight: Light (thin strokes, editorial feel)
- Exception 1: Bottom nav active = Fill weight
- Exception 2: Accreditation badges = Fill weight
- Exception 3: Wishlisted heart = Fill weight

### Sizes
- 20px: cards, lists, inline
- 24px: action buttons, nav icons
- 18px: badges

### Colours
- neutral-400 (#9CA3AF): inactive, decorative
- neutral-500 (#6B7280): standard UI
- primary-600 (#3A6A9A): interactive
- primary-900 (#1A3A5C): active nav only

---

## 9. Accessibility Minimums

- All touch targets: 44pt minimum (including hitSlop/padding)
- Never use neutral-400 for meaningful text (fails WCAG)
- neutral-500 on white: 4.83:1 contrast ratio ✓
- All images: accessibilityLabel from description field
- Form errors: announced via AccessibilityInfo.announceForAccessibility AND visible inline
- Reduce Motion: respected for all animations
- Dynamic Type: allowFontScaling + maxFontSizeMultiplier=1.5

---

## 10. What NEVER to do

- Never use gradients (except Welcome overlay + SwipeCard bottom fade)
- Never use drop shadows on buttons
- Never use scale animation on buttons (opacity + haptic only)
- Never use neutral-400 for readable text
- Never use primary-500 on text (fails WCAG)
- Never use default activeOpacity (0.5) — always 0.85
- Never put teal panel on non-AI content
- Never mix icon families (Phosphor only)
- Never use border-radius 12 on buttons (10px only)
- Never use height 44 on primary buttons (52px only)

---

## 11. NativeWind escape hatch rules

NativeWind v4's CSS interop (jsxImportSource: "nativewind") wraps ALL React Native core components. It can silently strip backgroundColor, flex, justifyContent, alignItems, and minHeight from both inline styles AND StyleSheet.create outputs.

### When to bypass NativeWind entirely on a screen
- Full-screen ImageBackground layouts (Welcome, any future splash/marketing screen)
- Any screen where SafeAreaView + justifyContent: "space-between" is the primary layout pattern
- Any component where a style callback (pressed, focused) sets layout properties

### How to bypass
- Use useSafeAreaInsets() hook + plain View instead of SafeAreaView
- Add cssInterop={false} to EVERY View and Pressable on the screen
- Put ALL layout properties in StyleSheet.create()
- Style callbacks should ONLY toggle opacity — never set layout props like alignItems, justifyContent, or minHeight in a callback
- Use zero NativeWind className props on bypassed screens

### Where NativeWind className is fine
NativeWind className works for screens that use simple flat layouts (Sign Up, Sign In, Home, Products). It breaks on screens with complex layering (ImageBackground + gradient + safe area + pinned bottom content).
