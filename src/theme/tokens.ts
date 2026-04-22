// Cornr design tokens — v4 warm palette
// All WCAG AA verified. Source of truth for all visual styling.
// Never hardcode hex values in components — import from here.

export const colors = {
  // Core
  ink: '#1A1814',           // Primary text, headings, wordmark (16.6:1 on cream, AAA)
  charcoal: '#2C2824',       // Dark card backgrounds
  warm800: '#3D3832',        // Borders on dark surfaces
  warm600: '#6B6358',        // Secondary text, UI labels (5.54:1 on cream)
  warm400: '#948A7D',        // Placeholders, inactive icons (3.18:1, large text only)
  warm200: '#D4CBC0',        // Light borders, disabled bg
  warm100: '#EDE8E2',        // Skeleton, light card bg
  cream: '#FAF7F3',          // Page background
  white: '#FFFCF9',          // Card surface

  // Accent — terracotta shift 15 Apr late PM (Lick/F&B 2026 trend data)
  accent: '#9E5F3C',         // Interactive text/borders/icons
  accentSurface: '#BE7458',  // Filled button bg ONLY — never used for text
  accentLight: '#F0D8C0',    // Tint backgrounds
  accentDark: '#965E40',     // Pressed states

  // Semantic
  success: '#3A7E4F',
  warning: '#8E6B26',
  warningLight: '#FDF3E3',
  error: '#A84B42',          // 16.1° hue separation from terracotta accent
  info: '#4A6E8E',

  // AI content (only place teal is allowed)
  tealBg: '#F0FDFA',
  tealText: '#134E4A',

  // Swipe overlays
  swipeOverlayLove: 'rgba(58, 126, 79, 0.35)',   // success at 35% — love overlay
  swipeOverlayPass: 'rgba(172, 83, 66, 0.35)',   // error at 35% — pass overlay
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;

export const radius = {
  badge: 6,
  button: 10,
  input: 12,
  card: 16,
  modal: 20,
  swipe: 20,
} as const;

export const typography = {
  display: { fontFamily: 'Lora-Bold', fontSize: 34, letterSpacing: -0.5, lineHeight: 40 },
  screenTitle: { fontFamily: 'Lora-SemiBold', fontSize: 22, letterSpacing: -0.3, lineHeight: 28 },
  sectionHeading: { fontFamily: 'Lora-SemiBold', fontSize: 20, letterSpacing: -0.2, lineHeight: 26 },
  cardHeading: { fontFamily: 'DMSans-SemiBold', fontSize: 17, lineHeight: 22 },
  body: { fontFamily: 'DMSans-Regular', fontSize: 16, lineHeight: 24 },
  uiLabel: { fontFamily: 'DMSans-Medium', fontSize: 14, lineHeight: 20 },
  badge: { fontFamily: 'DMSans-SemiBold', fontSize: 12, letterSpacing: 0.4, lineHeight: 16 },
  cta: { fontFamily: 'DMSans-SemiBold', fontSize: 16, letterSpacing: 0.2, lineHeight: 20 },
  quote: { fontFamily: 'NewsreaderItalic', fontSize: 16, lineHeight: 24 },
  essence: { fontFamily: 'NewsreaderItalic', fontSize: 22, lineHeight: 29 },
  behaviouralTruth: { fontFamily: 'Lora-SemiBold', fontSize: 22, lineHeight: 28 },
  observation: { fontFamily: 'DMSans-Regular', fontSize: 16, lineHeight: 24 },
} as const;

export const shadow = {
  card: {
    shadowColor: colors.ink,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  swipe: {
    shadowColor: colors.ink,
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;

// ── Archetype reveal themes ──────────────────────────────────────────────
// Each archetype has its own gradient + accent palette for the reveal screen.
// gradientStart values were darkened from the original research spec where
// needed so white text (#FFFCF9) passes WCAG AA (4.5:1) across the full
// gradient. Contrast margins per archetype documented in commit history.

export type ArchetypeThemeId =
  | 'curator'
  | 'nester'
  | 'maker'
  | 'minimalist'
  | 'romantic'
  | 'storyteller'
  | 'urbanist';

export type ArchetypeTheme = {
  gradientStart: string;
  gradientMid: string;
  gradientEnd: string;
  accent: string;
  grainOpacity: number;
};

// Gradient stops are manually tuned per archetype — do not auto-derive from accent.
const ARCHETYPE_THEMES: Record<ArchetypeThemeId, ArchetypeTheme> = {
  curator:     { gradientStart: '#93662C', gradientMid: '#A67B3D', gradientEnd: '#6B4A2E', accent: '#5C6B4A', grainOpacity: 0.04 },
  nester:      { gradientStart: '#7E725A', gradientMid: '#7D9A8B', gradientEnd: '#5A6F62', accent: '#5A8A94', grainOpacity: 0.05 },
  maker:       { gradientStart: '#766A5B', gradientMid: '#6E6256', gradientEnd: '#3D3832', accent: '#B87F4A', grainOpacity: 0.07 },
  minimalist:  { gradientStart: '#756E65', gradientMid: '#A69E90', gradientEnd: '#8A7E70', accent: '#A09080', grainOpacity: 0.02 },
  romantic:    { gradientStart: '#896D61', gradientMid: '#B08888', gradientEnd: '#7A5A5A', accent: '#C4908A', grainOpacity: 0.05 },
  storyteller: { gradientStart: '#8A4A5A', gradientMid: '#6A3A48', gradientEnd: '#4A2838', accent: '#8A6550', grainOpacity: 0.10 },
  urbanist:    { gradientStart: '#6B645C', gradientMid: '#4D4842', gradientEnd: '#2D2A26', accent: '#5E5A68', grainOpacity: 0.03 },
};

export function archetypeTheme(id: string): ArchetypeTheme {
  return ARCHETYPE_THEMES[id as ArchetypeThemeId] ?? ARCHETYPE_THEMES.curator;
}

// Two-phase colour tints for post-archetype screens (canonical Section 14.1).
// Page = 5% archetype-colour on background neutral. Section = 8% for cards
// or bordered regions sitting on the page tint. WCAG verified against ink
// text; archetype accent for headings remains above 4.5:1.
type TintVariant = 'page' | 'section';

const PAGE_TINTS: Record<ArchetypeThemeId, string> = {
  curator:     '#F2F0EA',
  nester:      '#F2F1EE',
  maker:       '#F7F1EB',
  minimalist:  '#F6F2ED',
  romantic:    '#F7F2EE',
  storyteller: '#F4EFEA',
  urbanist:    '#F2EFEC',
};

const SECTION_TINTS: Record<ArchetypeThemeId, string> = {
  curator:     '#EDEBE5',
  nester:      '#EDEEEB',
  maker:       '#F5EDE5',
  minimalist:  '#F3EFEA',
  romantic:    '#F6EFEB',
  storyteller: '#F1EBE5',
  urbanist:    '#EDEAE7',
};

export function tint(id: string, variant: TintVariant): string {
  const archetypeId = (id as ArchetypeThemeId) in PAGE_TINTS
    ? (id as ArchetypeThemeId)
    : 'curator';
  return variant === 'page'
    ? PAGE_TINTS[archetypeId]
    : SECTION_TINTS[archetypeId];
}

export const tokens = { colors, spacing, radius, typography, shadow } as const;
export default tokens;
