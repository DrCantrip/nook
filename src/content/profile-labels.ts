// User-facing label lookups for Profile tab's "What Cornr knows" section.
//
// Source of truth for the underlying enums: canonical Section 2 (onboarding
// journey_stage, home_status), Section 6 (users schema), and
// src/content/archetype-period-modifiers.ts (PropertyPeriod).
//
// Voice-gate register: warm, matter-of-fact, first-person-user-oriented.
// Matches the "disclosure: honest, brief, adult" tone from CLAUDE.md.

import type { PropertyPeriod } from './archetype-period-modifiers';

type JourneyStageDbValue =
  | 'pre_purchase'
  | 'new_0_3'
  | 'settled_3_12'
  | 'established'
  | 'renting';

type HomeStatusDbValue = 'first_time' | 'experienced' | 'renter';

export const JOURNEY_LABELS: Record<JourneyStageDbValue, string> = {
  pre_purchase: 'Looking for your first home',
  new_0_3: 'Just got your keys',
  settled_3_12: 'A few months in, getting sorted',
  established: 'Settled in',
  renting: 'Renting',
};

export const HOME_STATUS_LABELS: Record<HomeStatusDbValue, string> = {
  first_time: 'First home',
  experienced: "I've owned before",
  renter: 'Renting',
};

export const PROPERTY_PERIOD_LABELS: Record<PropertyPeriod, string> = {
  georgian: 'Georgian property',
  victorian: 'Victorian property',
  edwardian: 'Edwardian property',
  interwar: '1930s property',
  modern: 'Modern property',
};

// Regional mapping for postcode district display. Canonical stores only the
// 4-char-max district prefix (e.g. "SW4", "E5", "NW10"); never the full
// postcode. This function returns a human-friendly region label, falling back
// to the raw district if the prefix isn't recognised. Minimal initial coverage
// favouring London + a few major regions; expand as needed.
export function postcodeToRegion(district: string | null | undefined): string | null {
  if (!district) return null;
  const trimmed = district.trim().toUpperCase();
  if (!trimmed) return null;

  // Match leading alphabetic prefix (e.g. "SW4" → "SW", "NW10" → "NW").
  const prefixMatch = trimmed.match(/^[A-Z]+/);
  if (!prefixMatch) return trimmed;
  const prefix = prefixMatch[0];

  // London postal areas (BFPO / PO Box prefixes excluded for now).
  const LONDON_PREFIXES = new Set([
    'E', 'EC', 'N', 'NW', 'SE', 'SW', 'W', 'WC',
  ]);
  if (LONDON_PREFIXES.has(prefix)) return `${trimmed} London`;

  // Map of well-known major prefixes to city/region names.
  const REGION_MAP: Record<string, string> = {
    B: 'Birmingham',
    BN: 'Brighton',
    BS: 'Bristol',
    CB: 'Cambridge',
    CF: 'Cardiff',
    CM: 'Chelmsford',
    CR: 'Croydon',
    DE: 'Derby',
    EH: 'Edinburgh',
    G: 'Glasgow',
    HA: 'Harrow',
    KT: 'Kingston',
    L: 'Liverpool',
    LE: 'Leicester',
    LN: 'Lincoln',
    LS: 'Leeds',
    M: 'Manchester',
    ME: 'Medway',
    NE: 'Newcastle',
    NG: 'Nottingham',
    OX: 'Oxford',
    PO: 'Portsmouth',
    RG: 'Reading',
    RM: 'Romford',
    S: 'Sheffield',
    SK: 'Stockport',
    SM: 'Sutton',
    SO: 'Southampton',
    SR: 'Sunderland',
    SS: 'Southend',
    ST: 'Stoke',
    TN: 'Tunbridge',
    TW: 'Twickenham',
    UB: 'Uxbridge',
    WA: 'Warrington',
    WD: 'Watford',
    YO: 'York',
  };

  if (prefix in REGION_MAP) return `${trimmed} (${REGION_MAP[prefix]})`;

  // Unknown prefix — fall back to the raw district as-is.
  return trimmed;
}
